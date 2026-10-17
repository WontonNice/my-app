import type { SelectedAnswer } from "../../../../server/src/shared/examGrading";
import type { Attempt, Change, Save, Submission, ReleasedResult } from "./api";
export type SyncStatus = "Saved" | "Saving…" | "Offline — changes pending" | "Save failed — retrying" | "Session conflict" | "Save failed — review input" | "Submitted";
type Pending = Change & { sequence: number; baseRevision: number };
type Transport = { save: (input: Save) => Promise<{ attempt: Attempt }>; submit: (input: Submission) => Promise<{ attempt: Attempt; result: ReleasedResult | null }> };
type Recovery = { studentId: string; attemptId: string; pending: Pending[]; sectionId: string; submissionId?: string };
/** One serialized writer per attempt. Server CAS and a session lease guard other tabs/devices. */
export class AnswerSheetSync {
  server: Attempt;
  visible: Attempt;
  status: SyncStatus = "Saved";
  error = "";
  recoveryConflict = false;
  recoveredUnsubmitted: Change[] = [];
  result: ReleasedResult | null = null;
  submissionId = "";
  private pending = new Map<string, Pending>();
  private sequence = 0;
  private inflight: { input: Save; sequence: Map<string, number> } | null = null;
  private running: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private heartbeat: ReturnType<typeof setInterval>;
  private stopped = false;
  private navDirty = false;
  private submitting = false;
  private readonly recoveryKey: string;
  constructor(attempt: Attempt, private sessionId: string, private transport: Transport, private storage: Pick<Storage, "getItem" | "setItem" | "removeItem">, private changed: () => void, private online = () => navigator.onLine, private uid = () => crypto.randomUUID()) {
    this.server = structuredClone(attempt); this.visible = structuredClone(attempt);
    this.recoveryKey = `nathan-tutors:answer-sheet:${attempt.studentId}:${attempt.id}`;
    this.status = attempt.status === "submitted" ? "Submitted" : "Saved";
    try {
      const recovered = JSON.parse(storage.getItem(this.recoveryKey) || "null") as Recovery | null;
      if (recovered?.studentId === attempt.studentId && recovered.attemptId === attempt.id && attempt.status === "submitted") {
        this.recoveredUnsubmitted = (recovered.pending ?? []).filter(entry => entry.answer !== undefined && JSON.stringify(entry.answer) !== JSON.stringify(attempt.answers[entry.itemId]) || entry.flagged !== undefined && entry.flagged !== attempt.flags.includes(entry.itemId));
        if (this.recoveredUnsubmitted.length) this.error = "This device has recovered changes that are not in the submitted snapshot. They are preserved below. Ask your teacher to reopen the attempt to apply them without retyping.";
        else storage.removeItem(this.recoveryKey);
      }
      if (recovered?.studentId === attempt.studentId && recovered.attemptId === attempt.id && attempt.status === "in_progress") {
        for (const entry of recovered.pending ?? []) {
          if (!attempt.sheet.sections.some(section => section.items.some(item => item.id === entry.itemId))) continue;
          const answerEqual = entry.answer === undefined || JSON.stringify(entry.answer) === JSON.stringify(attempt.answers[entry.itemId]);
          const flagEqual = entry.flagged === undefined || entry.flagged === attempt.flags.includes(entry.itemId);
          if (answerEqual && flagEqual) continue; // An acknowledgment may have been lost after the server committed.
          if ((attempt.responseRevisions[entry.itemId] ?? 0) > entry.baseRevision) this.recoveryConflict = true;
          this.pending.set(entry.itemId, entry); this.sequence = Math.max(this.sequence, entry.sequence); this.apply(entry);
        }
        if (attempt.sheet.sections.some(section => section.id === recovered.sectionId)) this.visible.sectionId = recovered.sectionId;
        this.navDirty = this.visible.sectionId !== this.server.sectionId;
        this.submissionId = recovered.submissionId ?? "";
        if (this.pending.size || this.navDirty || this.submissionId) this.status = this.recoveryConflict ? "Session conflict" : this.online() ? "Saving…" : "Offline — changes pending";
      }
    } catch { this.error = "Local recovery could not be read. Server-saved responses are loaded."; }
    this.heartbeat = setInterval(() => { if (!this.stopped && this.server.status === "in_progress" && !this.submitting && this.status !== "Session conflict") { this.navDirty = true; void this.flush().catch(() => undefined); } }, 30000);
    if ((this.pending.size || this.navDirty) && !this.recoveryConflict && !this.submissionId) this.schedule(0);
  }
  get hasPending() { return Boolean(this.pending.size || this.inflight || this.navDirty || this.submissionId && this.server.status !== "submitted"); }
  private apply(change: Change) {
    if (change.answer !== undefined) this.visible.answers[change.itemId] = structuredClone(change.answer);
    if (change.flagged !== undefined) { this.visible.flags = this.visible.flags.filter(id => id !== change.itemId); if (change.flagged) this.visible.flags.push(change.itemId); }
  }
  private persist() {
    try {
      if (!this.hasPending) this.storage.removeItem(this.recoveryKey);
      else this.storage.setItem(this.recoveryKey, JSON.stringify({ studentId: this.server.studentId, attemptId: this.server.id, pending: [...this.pending.values()], sectionId: this.visible.sectionId, submissionId: this.submissionId } satisfies Recovery));
    } catch { this.error = "Changes are visible here, but device recovery storage is unavailable. Keep this page open until the server confirms Saved."; }
  }
  edit(itemId: string, answer?: SelectedAnswer, flagged?: boolean) {
    if (this.server.status !== "in_progress" || this.submitting || this.submissionId) return;
    const previous = this.pending.get(itemId);
    const entry: Pending = { ...previous, itemId, sequence: ++this.sequence, baseRevision: previous?.baseRevision ?? this.server.responseRevisions[itemId] ?? 0, ...(answer === undefined ? {} : { answer }), ...(flagged === undefined ? {} : { flagged }) };
    this.pending.set(itemId, entry); this.apply(entry); this.status = this.status === "Session conflict" ? this.status : this.online() ? "Saving…" : "Offline — changes pending";
    this.persist(); this.changed(); if (this.status !== "Session conflict") this.schedule(350);
  }
  navigate(sectionId: string) { this.visible.sectionId = sectionId; this.navDirty = true; this.persist(); this.changed(); if (this.server.status === "in_progress") this.schedule(350); }
  private schedule(ms: number) { clearTimeout(this.timer); if (!this.stopped) this.timer = setTimeout(() => { void this.retry(); }, ms); }
  chooseRecovery(useDevice: boolean) {
    this.recoveryConflict = false;
    if (!useDevice) { this.pending.clear(); this.visible = structuredClone(this.server); this.submissionId = ""; }
    else this.pending.forEach(entry => entry.baseRevision = this.server.responseRevisions[entry.itemId] ?? 0);
    this.status = this.hasPending ? "Saving…" : "Saved"; this.persist(); this.changed(); this.schedule(0);
  }
  flush(): Promise<void> {
    if (this.running) return this.running;
    if (this.stopped || this.status === "Session conflict") return Promise.reject(new Error("Resolve the editing-session conflict first."));
    this.running = this.write().finally(() => { this.running = null; }); return this.running;
  }
  private async write() {
    try {
      while (!this.stopped && (this.pending.size || this.navDirty || this.inflight)) {
        if (!this.inflight) {
          const changes: Change[] = [], sequence = new Map<string, number>(); let bytes = 0;
          for (const entry of this.pending.values()) {
            const { itemId, answer, flagged } = entry;
            const change = { itemId, ...(answer === undefined ? {} : { answer }), ...(flagged === undefined ? {} : { flagged }) };
            const size = new TextEncoder().encode(JSON.stringify(change)).byteLength;
            if (changes.length && (bytes + size > 400000 || changes.length >= 50)) break;
            changes.push(change); sequence.set(itemId, entry.sequence); bytes += size;
          }
          this.inflight = { input: { sessionId: this.sessionId, revision: this.server.revision, mutationId: this.uid(), changes, sectionId: this.visible.sectionId }, sequence };
        }
        this.status = "Saving…"; this.changed();
        const sent = this.inflight, value = await this.transport.save(sent.input);
        if (this.stopped) return;
        this.server = value.attempt;
        for (const [id, sequence] of sent.sequence) {
          const pending = this.pending.get(id);
          if (pending?.sequence === sequence) this.pending.delete(id);
          else if (pending) pending.baseRevision = value.attempt.responseRevisions[id] ?? 0;
        }
        this.navDirty = this.visible.sectionId !== sent.input.sectionId; this.inflight = null;
        this.visible.revision = value.attempt.revision; this.visible.savedAt = value.attempt.savedAt;
        this.persist();
      }
      this.status = this.server.status === "submitted" ? "Submitted" : "Saved"; this.error = ""; this.changed();
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 400 || status === 413) this.inflight = null;
      this.status = status === 400 || status === 413 ? "Save failed — review input" : status === 401 || status === 409 || status === 423 || status === 403 ? "Session conflict" : this.online() ? "Save failed — retrying" : "Offline — changes pending";
      this.error = status === undefined ? "The server connection is unavailable. Answers remain on this device; keep this page open while retrying." : error instanceof Error ? error.message : "The server has not confirmed these changes.";
      this.persist(); this.changed(); if (this.status !== "Session conflict" && this.status !== "Save failed — review input") this.schedule(3000); throw error;
    }
  }
  async submit(confirmUnanswered: boolean) {
    if (this.submitting || this.stopped) return;
    this.submitting = true; clearTimeout(this.timer);
    this.submissionId ||= this.uid(); this.persist(); this.changed();
    try {
      await this.flush();
      const value = await this.transport.submit({ sessionId: this.sessionId, revision: this.server.revision, submissionId: this.submissionId, confirmUnanswered });
      if (this.stopped) return;
      this.server = value.attempt; this.visible = structuredClone(value.attempt); this.result = value.result;
      this.submissionId = ""; this.pending.clear(); this.inflight = null; this.navDirty = false; this.status = "Submitted"; this.error = ""; this.persist(); this.changed();
    } catch (error) {
      const code = (error as { status?: number }).status;
      this.status = code === 401 || code === 409 || code === 423 || code === 403 ? "Session conflict" : this.online() ? "Save failed — retrying" : "Offline — changes pending";
      this.error = error instanceof Error ? error.message : "Submission is pending server confirmation.";
      if (code === 422 || code === 400) { this.submissionId = ""; this.status = this.pending.size ? "Saving…" : "Saved"; }
      this.persist(); this.changed(); if (this.status !== "Session conflict" && this.submissionId) this.schedule(3000);
    } finally { this.submitting = false; }
  }
  async retry() { if (this.stopped || this.status === "Session conflict") return; if (this.submissionId) await this.submit(true); else await this.flush().catch(() => undefined); }
  stop() { this.stopped = true; clearTimeout(this.timer); clearInterval(this.heartbeat); }
}
