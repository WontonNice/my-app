import { randomUUID } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import * as Y from "yjs";
import { supabase } from "./supabase";
import { getAuthenticatedUser, getEnrolledClassIds, isStudentArchived } from "./auth";
import { readBoard, seedBoard, validateBoard, checkBoardMutation, type BoardRole, type BoardSummary } from "../shared/boards";

export type BoardRow = { id: string; student_id: string; owner_id: string; title: string; state: string; epoch: string; revision: number; archived_at: string | null; deleted_at: string | null; updated_at: string; updated_by: string };
export const boardFail = (message: string, status = 400) => Object.assign(new Error(message), { status });
export const boardUuid = (id: unknown): id is string => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
export const boardTeacher = (user: User) => ["teacher", "admin"].includes(String(user.app_metadata.role));
export const boardName = (user: User) => String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Participant").slice(0, 80);
export function boardStorage(error: { message: string } | null) {
  if (error) throw boardFail("Board storage is unavailable. Apply migration 202610060001_collaborative_student_boards.sql and check the database connection.", 503);
}
export async function boardUser(authorization: string | undefined) {
  const auth = await getAuthenticatedUser(authorization);
  if (!auth.user) throw boardFail(auth.error || "Sign in to open boards.", 401);
  // Authoritative lookup prevents stale role/archival claims on long-lived rooms.
  const verified = await supabase.auth.getUser(authorization!.slice(7));
  if (verified.error || !verified.data.user || verified.data.user.is_anonymous) throw boardFail("Sign in again to open boards.", 401);
  const user = verified.data.user;
  if (isStudentArchived(user)) throw boardFail("This student account is archived.", 403);
  return user;
}
export async function boardStudent(id: string) {
  if (!boardUuid(id)) throw boardFail("Choose a valid student.");
  const lookup = await supabase.auth.admin.getUserById(id);
  const user = lookup.data.user;
  if (lookup.error || !user || boardTeacher(user) || ["staff", "admin"].includes(String(user.app_metadata.role)) || isStudentArchived(user) || !getEnrolledClassIds(user.app_metadata).includes("shsat")) throw boardFail("Choose an active SHSAT student.", 404);
  return user;
}
export async function fetchBoard(id: string) {
  if (!boardUuid(id)) throw boardFail("Invalid board ID.");
  const result = await supabase.from("student_boards").select("*").eq("id", id).is("deleted_at", null).maybeSingle();
  boardStorage(result.error);
  if (!result.data) throw boardFail("Board not found.", 404);
  return result.data as BoardRow;
}
export async function boardAccess(id: string, user: User, edit = false) {
  const board = await fetchBoard(id);
  const student = await boardStudent(board.student_id);
  if (user.id !== board.student_id && !boardTeacher(user)) throw boardFail("Access requires this student or a verified teacher participant.", 403);
  let role: BoardRole = "viewer";
  if (board.owner_id === user.id) role = "owner";
  else {
    const member = await supabase.from("board_participants").select("role").eq("board_id", id).eq("user_id", user.id).maybeSingle();
    boardStorage(member.error);
    if (!member.data) throw boardFail("This board is private. Ask its owner to share it with you.", 403);
    role = member.data.role as BoardRole;
  }
  if (edit && (role === "viewer" || board.archived_at)) throw boardFail(board.archived_at ? "Restore this archived board before editing." : "This board is view only.", 403);
  return { board, role, student, canManage: role === "owner" || boardTeacher(user) && role === "editor" };
}
export async function boardSummary(board: BoardRow, user: User): Promise<BoardSummary> {
  const access = await boardAccess(board.id, user);
  if (access.board.epoch !== board.epoch) throw boardFail("The board was restored while it was opening. Reopen the current version.", 409);
  board = access.board;
  const members = await supabase.from("board_participants").select("user_id,role").eq("board_id", board.id); boardStorage(members.error);
  const owner = await supabase.auth.admin.getUserById(board.owner_id);
  const participants: BoardSummary["participants"] = [{ id: board.owner_id, name: owner.data.user ? boardName(owner.data.user) : "Owner", role: "owner" }];
  for (const member of members.data ?? []) {
    const lookup = await supabase.auth.admin.getUserById(member.user_id);
    participants.push({ id: member.user_id, name: lookup.data.user ? boardName(lookup.data.user) : "Participant", role: member.role });
  }
  return { id: board.id, title: board.title, studentId: board.student_id, studentName: boardName(access.student), ownerId: board.owner_id, role: access.role, archivedAt: board.archived_at, updatedAt: board.updated_at, revision: board.revision, epoch: board.epoch, participants };
}
export function decodeBoard(state: string) {
  const doc = new Y.Doc();
  if (state) Y.applyUpdate(doc, Buffer.from(state, "base64"));
  return doc;
}
export const encodeBoard = (doc: Y.Doc) => Buffer.from(Y.encodeStateAsUpdate(doc)).toString("base64");
export async function commitBoardUpdate(id: string, user: User, epoch: string, update: Uint8Array) {
  if (update.byteLength > 512 * 1024) throw boardFail("This change is too large. Add smaller batches of cards.");
  for (let attempt = 0; attempt < 8; attempt++) {
    const access = await boardAccess(id, user, true);
    if (access.board.epoch !== epoch) throw boardFail("The board was restored. Keep a recovery copy, then reopen the current version.", 409);
    const doc = decodeBoard(access.board.state);
    try {
      const before = readBoard(doc);
      const protectedTypes = new Map(before.nodes.filter(node => node.locked).map(node => { const map = doc.getMap<Y.Map<unknown>>("nodes").get(node.id)!; return [node.id, { map, text: map.get("text") }] as const; }));
      Y.applyUpdate(doc, update);
      // Pending structs/deletions signal missing causal dependencies; never ACK
      // data which is invisible to lock/schema validation.
      if (doc.store.pendingStructs || doc.store.pendingDs) throw boardFail("The board needs to resynchronize before this change can be saved.", 409);
      validateBoard(doc);
      const after = readBoard(doc);
      checkBoardMutation(before, after, access.role, access.canManage);
      if (!access.canManage) for (const [nodeId, previous] of protectedTypes) {
        const map = doc.getMap<Y.Map<unknown>>("nodes").get(nodeId);
        if (map !== previous.map || map.get("text") !== previous.text) throw boardFail("A teacher or owner has locked this source card.", 403);
      }
      const old = new Map(before.nodes.map(node => [node.id, node]));
      const maps = doc.getMap<Y.Map<unknown>>("nodes");
      doc.transact(() => {
        for (const node of after.nodes) {
          const previous = old.get(node.id);
          const map = maps.get(node.id)!;
          if (previous) {
            const createdBy = previous.createdBy ?? user.id;
            if (map.get("createdBy") !== createdBy) map.set("createdBy", createdBy);
            const updatedBy = JSON.stringify(previous) !== JSON.stringify(node) ? user.id : previous.updatedBy;
            if (updatedBy && map.get("updatedBy") !== updatedBy) map.set("updatedBy", updatedBy);
          } else { if (map.get("createdBy") !== user.id) map.set("createdBy", user.id); if (map.get("updatedBy") !== user.id) map.set("updatedBy", user.id); }
        }
      });
      for (const node of after.nodes) {
        if (node.assetId && node.assetId !== old.get(node.id)?.assetId) {
          const asset = await supabase.from("board_assets").select("id").eq("id", node.assetId).eq("board_id", id).maybeSingle();
          boardStorage(asset.error); if (!asset.data) throw boardFail("Attachment does not belong to this board.", 403);
        }
      }
      const state = encodeBoard(doc);
      if (state === access.board.state) return { board: access.board, update: Y.encodeStateAsUpdate(doc) };
      const result = await supabase.rpc("commit_student_board", { p_id: id, p_actor: user.id, p_revision: access.board.revision, p_epoch: epoch, p_state: state });
      boardStorage(result.error);
      if (result.data) return { board: result.data as BoardRow, update: Y.encodeStateAsUpdate(doc) };
    } finally { doc.destroy(); }
  }
  throw boardFail("Several people changed this board at once. Reconnect to merge your work.", 409);
}
export async function createBoard(studentId: string, user: User, title: string, state?: string) {
  await boardStudent(studentId);
  if (studentId !== user.id && !boardTeacher(user)) throw boardFail("Only a verified teacher can create a board for another student.", 403);
  const id = randomUUID();
  const empty = seedBoard({ nodes: [], edges: [] });
  const result = await supabase.rpc("create_student_board", { p_id: id, p_student: studentId, p_owner: user.id, p_title: title, p_state: state ?? encodeBoard(empty) });
  empty.destroy(); boardStorage(result.error);
  return fetchBoard(id);
}
