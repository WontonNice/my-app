import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { getSupabaseClient } from "../../lib/supabase";
import { LOCAL_BOARD_ORIGIN, REMOTE_BOARD_ORIGIN, readBoard, type BoardSummary, type BoardPresence } from "../../../../server/src/shared/boards";

const fromBase64 = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));
const toBase64 = (value: Uint8Array) => { let result = ""; for (let i = 0; i < value.length; i += 8192) result += String.fromCharCode(...value.subarray(i, i + 8192)); return btoa(result); };
type SessionState = { docVersion: number; board: BoardSummary; peers: BoardPresence[]; peerId: string; canManage: boolean; status: "Connecting" | "Saved" | "Saving…" | "Reconnecting" | "Recovery needed"; error: string; canUndo: boolean; canRedo: boolean; ready: boolean };
export class BoardSession {
  readonly doc = new Y.Doc();
  readonly undo = new Y.UndoManager([this.doc.getMap("nodes"), this.doc.getMap("edges")], { trackedOrigins: new Set([LOCAL_BOARD_ORIGIN]), captureTimeout: 650 });
  private state: SessionState;
  private listeners = new Set<() => void>();
  private socket: WebSocket | null = null;
  private persistence: IndexeddbPersistence | null = null;
  private stopped = false;
  private retry = 0;
  private reconnectTimer = 0;
  private flushTimer = 0;
  private sequence = 0;
  private inFlight = false;
  private dirty = false;
  private confirmedVector: Uint8Array = new Uint8Array([0]);
  private inflightVector: Uint8Array = new Uint8Array([0]);
  private readySocket = false;
  private presenceData: Partial<BoardPresence> = {};
  private presenceAt = 0;
  private authSubscription: { unsubscribe: () => void } | undefined;
  private readonly generation: string;

  constructor(board: BoardSummary, canManage: boolean, private readonly userId: string) {
    this.generation = board.epoch;
    this.state = { docVersion: 0, board, peers: [], peerId: "", canManage, status: "Connecting", error: "", canUndo: false, canRedo: false, ready: false };
    this.doc.on("update", (_update: Uint8Array, origin: unknown) => {
      if (origin !== REMOTE_BOARD_ORIGIN) { this.dirty = true; if (this.state.status !== "Recovery needed") this.patch({ status: this.readySocket ? "Saving…" : "Reconnecting" }); this.scheduleFlush(); }
      this.patch({ docVersion: this.state.docVersion + 1, canUndo: this.undo.canUndo(), canRedo: this.undo.canRedo() });
    });
    this.undo.on("stack-item-added", () => this.patch({ canUndo: this.undo.canUndo(), canRedo: this.undo.canRedo() }));
    this.undo.on("stack-item-popped", () => this.patch({ canUndo: this.undo.canUndo(), canRedo: this.undo.canRedo() }));
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  snapshot = () => this.state;
  private patch(changes: Partial<SessionState>) { if (this.stopped) return; this.state = { ...this.state, ...changes }; this.listeners.forEach(listener => listener()); }
  async start() {
    this.persistence = new IndexeddbPersistence(`student-board:${this.userId}:${this.state.board.id}:${this.state.board.epoch}`, this.doc);
    await this.persistence.whenSynced.catch(() => { this.patch({ error: "Local offline recovery is unavailable in this browser." }); });
    if (this.stopped) return;
    const { data } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.id !== this.userId) { this.recover("The signed-in account changed. Keep a recovery copy and reopen your board."); this.socket?.close(); }
      else this.send({ type: "token", token: session.access_token });
    });
    this.authSubscription = data.subscription;
    await this.connect();
  }
  private async connect() {
    if (this.stopped || this.state.status === "Recovery needed") return;
    const { data } = await getSupabaseClient().auth.getSession();
    if (this.stopped) return;
    if (!data.session || data.session.user.id !== this.userId) { this.recover("Sign in to this account again to sync the board."); return; }
    const base = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL) : new URL(window.location.origin);
    base.protocol = base.protocol === "https:" ? "wss:" : "ws:"; base.pathname = "/api/boards/live"; base.search = ""; base.hash = "";
    const socket = new WebSocket(base); this.socket = socket;
    socket.onopen = () => socket.send(JSON.stringify({ type: "join", token: data.session!.access_token, boardId: this.state.board.id }));
    socket.onmessage = event => {
      if (this.stopped) return;
      try {
        const message = JSON.parse(event.data);
        if (message.type === "ready") {
          if (message.board.epoch !== this.generation) { this.recover("The board has a restored version. Download unsaved work and reopen it."); return; }
          const serverDoc = new Y.Doc(); Y.applyUpdate(serverDoc, fromBase64(message.state)); this.confirmedVector = Y.encodeStateVector(serverDoc); serverDoc.destroy();
          Y.applyUpdate(this.doc, fromBase64(message.state), REMOTE_BOARD_ORIGIN);
          this.readySocket = true; this.retry = 0; this.inFlight = false;
          this.patch({ board: message.board, canManage: message.canManage, peerId: message.peerId, ready: true, status: this.dirty ? "Saving…" : "Saved", error: "" });
          this.flush(); this.presence(this.presenceData, true);
        } else if (message.type === "sync") {
          if (message.board && message.board.epoch !== this.generation) { this.recover("The board has a restored version. Download unsaved work and reopen it."); return; }
          Y.applyUpdate(this.doc, fromBase64(message.state), REMOTE_BOARD_ORIGIN);
          if (message.board && message.board.revision >= this.state.board.revision) this.patch({ board: message.board, canManage: typeof message.canManage === "boolean" ? message.canManage : message.board.role === "owner" });
          else if (typeof message.revision === "number" && message.revision >= this.state.board.revision) this.patch({ board: { ...this.state.board, revision: message.revision, updatedAt: message.updatedAt ?? this.state.board.updatedAt } });
        } else if (message.type === "ack" && message.sequence === this.sequence) {
          this.confirmedVector = this.inflightVector; this.inFlight = false;
          this.patch({ board: { ...this.state.board, revision: Math.max(message.revision, this.state.board.revision) }, status: this.dirty ? "Saving…" : "Saved" });
          if (this.dirty) this.flush();
        } else if (message.type === "presence") this.patch({ peers: message.peers });
        else if (message.type === "retry") this.patch({ status: "Reconnecting", error: message.message, peers: [] });
        else if (["recovery", "error"].includes(message.type)) this.recover(message.message);
      } catch { this.recover("A collaboration message could not be read. Keep a recovery copy and reopen the board."); }
    };
    socket.onclose = event => {
      this.dirty = this.dirty || this.inFlight;
      this.readySocket = false; this.inFlight = false;
      if (this.stopped || this.state.status === "Recovery needed") return;
      if (event.code === 4003 || event.code === 4009) { this.recover("Your board access or version changed. Keep a recovery copy and reopen the board."); return; }
      this.patch({ status: "Reconnecting", peers: [] });
      this.reconnectTimer = window.setTimeout(() => void this.connect(), Math.min(15000, 700 * 2 ** this.retry++) + Math.random() * 250);
    };
  }
  private send(value: unknown) { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(value)); }
  private scheduleFlush() { window.clearTimeout(this.flushTimer); this.flushTimer = window.setTimeout(() => this.flush(), 240); }
  flush() {
    if (!this.readySocket || this.inFlight || !this.dirty || this.state.status === "Recovery needed") return;
    if (this.state.board.role === "viewer" || this.state.board.archivedAt) { this.recover("This board became view only. Keep a recovery copy of any local edits."); return; }
    const update = Y.encodeStateAsUpdate(this.doc, this.confirmedVector);
    if (update.byteLength > 512 * 1024) { this.recover("The pending change is too large to sync. Keep a recovery copy and reopen the board."); return; }
    this.inflightVector = Y.encodeStateVector(this.doc); this.inFlight = true; this.dirty = false;
    this.send({ type: "update", epoch: this.generation, sequence: ++this.sequence, state: toBase64(update) });
  }
  presence(changes: Partial<BoardPresence>, force = false) {
    this.presenceData = { ...this.presenceData, ...changes };
    if (force || Date.now() - this.presenceAt >= 65) { this.presenceAt = Date.now(); if (this.readySocket) this.send({ type: "presence", data: this.presenceData }); }
  }
  private recover(message: string) { this.patch({ status: "Recovery needed", error: message, peers: [] }); this.readySocket = false; }
  transaction(action: () => void) { this.undo.stopCapturing(); this.doc.transact(action, LOCAL_BOARD_ORIGIN); this.undo.stopCapturing(); }
  recovery() { return JSON.stringify({ format: "student-board-recovery-v1", title: this.state.board.title, epoch: this.state.board.epoch, recoveredAt: new Date().toISOString(), ...readBoard(this.doc) }, null, 2); }
  updateBoard(board: BoardSummary) { if (board.epoch !== this.generation) { this.recover("The board has a restored version. Download unsaved work and reopen it."); return; } if (board.revision >= this.state.board.revision) this.patch({ board }); }
  stop() { this.flush(); this.stopped = true; window.clearTimeout(this.reconnectTimer); window.clearTimeout(this.flushTimer); this.authSubscription?.unsubscribe(); this.socket?.close(); void this.persistence?.destroy(); this.undo.destroy(); this.doc.destroy(); this.listeners.clear(); }
}
