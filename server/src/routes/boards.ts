import { Router, raw, type ErrorRequestHandler } from "express";
import { randomUUID } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { boardUser, boardTeacher, boardStudent, boardName, boardSummary, boardAccess, boardStorage, boardUuid, boardFail, createBoard, encodeBoard, decodeBoard } from "../lib/boardStore";
import { notifyBoardChanged } from "../lib/boardRealtime";
import { readBoard, seedBoard } from "../shared/boards";
import { boardContentCatalog, referenceKey } from "../lib/boardContent";

export const boardsRouter = Router();
boardsRouter.use(async (request, response, next) => { try { response.locals.user = await boardUser(request.headers.authorization); next(); } catch (error) { next(error); } });
const titleValue = (value: unknown) => { if (typeof value !== "string" || !value.trim() || value.trim().length > 200) throw boardFail("Give the board a title of 1–200 characters."); return value.trim(); };
const revisionValue = (value: unknown) => { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw boardFail("Reload this board's details before updating it."); return value; };
const notify = async (board: Parameters<typeof notifyBoardChanged>[0]) => { try { await notifyBoardChanged(board); } catch (error) { console.error("Board fanout needs to reconnect", error instanceof Error ? error.message : "Unavailable"); } };

boardsRouter.get("/", async (request, response) => {
  const user = response.locals.user as User;
  const allTeacherBoards = request.query.scope === "teacher";
  if (allTeacherBoards && !boardTeacher(user)) throw boardFail("Teacher access is required.", 403);
  const studentId = typeof request.query.studentId === "string" ? request.query.studentId : user.id;
  if (studentId !== user.id && !boardTeacher(user)) throw boardFail("Teacher access is required to open another student's workspace.", 403);
  if (!allTeacherBoards) await boardStudent(studentId);
  const membership = await supabase.from("board_participants").select("board_id").eq("user_id", user.id); boardStorage(membership.error);
  const ids = (membership.data ?? []).map(row => row.board_id);
  let query = supabase.from("student_boards").select("*").is("deleted_at", null).or(`owner_id.eq.${user.id}${ids.length ? `,id.in.(${ids.join(",")})` : ""}`);
  if (!allTeacherBoards) query = query.eq("student_id", studentId);
  const result = await query.order("updated_at", { ascending: false }).limit(500);
  boardStorage(result.error);
  const boards = await Promise.all((result.data ?? []).map(row => boardSummary(row, user)));
  response.json({ boards });
});
boardsRouter.post("/", async (request, response) => {
  const user = response.locals.user as User;
  const studentId = request.body?.studentId ?? user.id;
  const board = await createBoard(studentId, user, titleValue(request.body?.title));
  response.status(201).json({ board: await boardSummary(board, user) });
});
boardsRouter.get("/:id", async (request, response) => {
  const access = await boardAccess(request.params.id, response.locals.user);
  response.json({ board: await boardSummary(access.board, response.locals.user), canManage: access.canManage });
});
boardsRouter.patch("/:id", async (request, response) => {
  revisionValue(request.body?.revision);
  const user = response.locals.user as User;
  const access = await boardAccess(request.params.id, user);
  if (access.role !== "owner") throw boardFail("Only the board owner can manage this board.", 403);
  const action = request.body?.action;
  if (!["rename", "archive", "delete", "checkpoint", "restore"].includes(action)) throw boardFail("Choose a valid board action.");
  const value: Record<string, unknown> = {};
  if (action === "rename") value.title = titleValue(request.body.title);
  if (action === "archive") { if (typeof request.body.archived !== "boolean") throw boardFail("Choose archive or restore."); value.archived = request.body.archived; }
  if (action === "delete" && request.body.confirm !== access.board.title) throw boardFail("Type the board title to confirm deletion.");
  if (action === "restore") {
    if (!boardUuid(request.body.versionId)) throw boardFail("Choose a version.");
    const version = await supabase.from("board_revisions").select("state").eq("id", request.body.versionId).eq("board_id", access.board.id).maybeSingle(); boardStorage(version.error);
    if (!version.data) throw boardFail("Version not found.", 404);
    const old = decodeBoard(version.data.state), fresh = seedBoard(readBoard(old));
    value.id = request.body.versionId; value.state = encodeBoard(fresh); old.destroy(); fresh.destroy();
  }
  const result = await supabase.rpc("manage_student_board", { p_id: access.board.id, p_actor: user.id, p_revision: request.body.revision, p_action: action, p_value: value }); boardStorage(result.error);
  if (!result.data) throw boardFail("This board changed. Refresh its details and try again.", 409);
  await notify(result.data);
  response.json(action === "delete" ? { deleted: true } : { board: await boardSummary(result.data, user) });
});
boardsRouter.post("/:id/duplicate", async (request, response) => {
  const user = response.locals.user as User;
  const access = await boardAccess(request.params.id, user, true);
  const original = decodeBoard(access.board.state), data = readBoard(original); original.destroy();
  const board = await createBoard(access.board.student_id, user, `${access.board.title.slice(0, 190)} (copy)`);
  try {
    const mapping = new Map<string, string>();
    for (const node of data.nodes) if (node.assetId) {
      const prior = mapping.get(node.assetId);
      if (prior) { node.assetId = prior; continue; }
      const asset = await supabase.from("board_assets").select("*").eq("id", node.assetId).eq("board_id", access.board.id).maybeSingle(); boardStorage(asset.error);
      if (!asset.data) { delete node.assetId; continue; }
      const id = randomUUID(), objectPath = `${board.id}/${id}`;
      const copied = await supabase.storage.from("student-board-assets").copy(asset.data.object_path, objectPath); boardStorage(copied.error);
      const row = await supabase.from("board_assets").insert({ id, board_id: board.id, object_path: objectPath, name: asset.data.name, mime: asset.data.mime, bytes: asset.data.bytes, created_by: user.id }); boardStorage(row.error);
      mapping.set(node.assetId, id); node.assetId = id;
    }
    const doc = seedBoard(data);
    const saved = await supabase.rpc("commit_student_board", { p_id: board.id, p_actor: user.id, p_revision: board.revision, p_epoch: board.epoch, p_state: encodeBoard(doc) }); doc.destroy(); boardStorage(saved.error);
    response.status(201).json({ board: await boardSummary(saved.data ?? board, user) });
  } catch (error) { await supabase.from("student_boards").update({ deleted_at: new Date().toISOString() }).eq("id", board.id); throw error; }
});
boardsRouter.get("/:id/history", async (request, response) => {
  await boardAccess(request.params.id, response.locals.user);
  const page = Math.max(0, Math.min(10000, Math.floor(Number(request.query.page) || 0)));
  const result = await supabase.from("board_revisions").select("id,title,label,created_at,created_by", { count: "exact" }).eq("board_id", request.params.id).order("created_at", { ascending: false }).range(page * 30, page * 30 + 29); boardStorage(result.error);
  const revisions = await Promise.all((result.data ?? []).map(async row => { const author = await supabase.auth.admin.getUserById(row.created_by); return { id: row.id, title: row.title, label: row.label, createdAt: row.created_at, author: author.data.user ? boardName(author.data.user) : "Participant" }; }));
  response.json({ revisions, total: result.count ?? 0, page });
});
boardsRouter.get("/:id/teachers", async (request, response) => {
  const access = await boardAccess(request.params.id, response.locals.user);
  if (access.role !== "owner") throw boardFail("Owner access is required.", 403);
  const teachers: { id: string; name: string }[] = [];
  for (let page = 1; page <= 100; page++) {
    const result = await supabase.auth.admin.listUsers({ page, perPage: 100 }); if (result.error) throw boardFail("Teacher directory is unavailable.", 503);
    teachers.push(...result.data.users.filter(user => boardTeacher(user) && !user.app_metadata.student_archived_at).map(user => ({ id: user.id, name: boardName(user) })));
    if (result.data.users.length < 100) break;
  }
  response.json({ teachers });
});
boardsRouter.put("/:id/participants/:userId", async (request, response) => {
  revisionValue(request.body?.revision);
  const access = await boardAccess(request.params.id, response.locals.user);
  if (access.role !== "owner") throw boardFail("Owner access is required.", 403);
  if (!boardUuid(request.params.userId) || !["editor", "viewer", "remove"].includes(request.body?.role)) throw boardFail("Choose a valid participant and role.");
  if (request.params.userId === access.board.owner_id) throw boardFail("The board owner cannot be changed.");
  if (request.params.userId === access.board.student_id && request.body.role === "remove") throw boardFail("Keep the student on their own board.");
  const lookup = await supabase.auth.admin.getUserById(request.params.userId);
  if (!lookup.data.user || lookup.data.user.id !== access.board.student_id && !boardTeacher(lookup.data.user)) throw boardFail("Share only with this student or a verified teacher.", 403);
  const result = await supabase.rpc("manage_student_board", { p_id: access.board.id, p_actor: response.locals.user.id, p_revision: request.body.revision, p_action: "participant", p_value: { id: request.params.userId, role: request.body.role } }); boardStorage(result.error);
  if (!result.data) throw boardFail("Participants changed. Refresh and try again.", 409);
  await notify(result.data); response.json({ board: await boardSummary(result.data, response.locals.user) });
});
boardsRouter.get("/:id/content", async (request, response) => {
  const access = await boardAccess(request.params.id, response.locals.user);
  const q = String(request.query.q ?? "").toLowerCase().slice(0, 150);
  const all = await boardContentCatalog(access.student, true);
  response.json({ items: all.filter(item => item.reference.kind === "passage" && item.viewer?.passage && item.viewer.questions.length && item.title.toLowerCase().includes(q)).slice(0, 100) });
});
boardsRouter.get("/:id/content/:nodeId", async (request, response) => {
  const access = await boardAccess(request.params.id, response.locals.user);
  const doc = decodeBoard(access.board.state), node = readBoard(doc).nodes.find(node => node.id === request.params.nodeId); doc.destroy();
  if (!node?.reference) throw boardFail("Content card not found.", 404);
  const { questionId, ...baseReference } = node.reference!;
  let item = (await boardContentCatalog(access.student)).find(item => referenceKey(item.reference) === referenceKey(baseReference));
  if (item && questionId) {
    const index = item.viewer?.questions.findIndex(question => question.id === questionId) ?? -1;
    const question = item.viewer?.questions[index];
    item = question ? { reference: node.reference!, title: `Question ${index + 1} · ${item.title}`, href: item.href, prompt: question.prompt, choices: question.choices, viewer: { questions: [question] } } : undefined;
  }
  if (!item) throw boardFail("This source is no longer available to this student. Ask the teacher to check its assignment or assessment access.", 403);
  response.json({ item });
});
boardsRouter.post("/:id/assets", raw({ type: "application/octet-stream", limit: "10mb" }), async (request, response) => {
  const access = await boardAccess(request.params.id, response.locals.user, true);
  if (!Buffer.isBuffer(request.body) || !request.body.length) throw boardFail("Choose an attachment up to 10 MB.");
  const bytes = request.body as Buffer, mime = String(request.header("x-file-type") || "application/octet-stream");
  const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf", "text/plain", "application/octet-stream"];
  if (!allowed.includes(mime)) throw boardFail("Use a PNG, JPEG, GIF, WebP, PDF, text, or downloadable file.");
  const signature = mime === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : mime === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 : mime === "image/gif" ? bytes.subarray(0, 3).toString() === "GIF" : mime === "image/webp" ? bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP" : mime === "application/pdf" ? bytes.subarray(0, 5).toString() === "%PDF-" : true;
  if (!signature) throw boardFail("The attachment's contents do not match its file type.");
  let name = "Attachment"; try { name = decodeURIComponent(request.header("x-file-name") ?? name).replace(/[\r\n/\\]/g, " ").slice(0, 200); } catch { throw boardFail("Invalid file name."); }
  const id = randomUUID(), objectPath = `${access.board.id}/${id}`;
  const uploaded = await supabase.storage.from("student-board-assets").upload(objectPath, bytes, { contentType: mime, upsert: false }); boardStorage(uploaded.error);
  const saved = await supabase.from("board_assets").insert({ id, board_id: access.board.id, object_path: objectPath, name, mime, bytes: bytes.length, created_by: response.locals.user.id });
  if (saved.error) { await supabase.storage.from("student-board-assets").remove([objectPath]); boardStorage(saved.error); }
  response.status(201).json({ asset: { id, name, mime, bytes: bytes.length } });
});
boardsRouter.get("/:id/assets/:assetId", async (request, response) => {
  await boardAccess(request.params.id, response.locals.user);
  const asset = await supabase.from("board_assets").select("*").eq("board_id", request.params.id).eq("id", request.params.assetId).maybeSingle(); boardStorage(asset.error);
  if (!asset.data) throw boardFail("Attachment not found.", 404);
  const signed = await supabase.storage.from("student-board-assets").createSignedUrl(asset.data.object_path, 60, asset.data.mime.startsWith("image/") ? undefined : { download: asset.data.name }); boardStorage(signed.error);
  response.json({ url: signed.data!.signedUrl, name: asset.data.name, mime: asset.data.mime, expiresIn: 60 });
});
const handleBoardError: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) { next(error); return; }
  response.status(error.status ?? (error.type === "entity.too.large" ? 413 : 500)).json({ message: error instanceof Error ? error.message : "Could not complete this board action.", requestId: response.locals.requestId });
};
boardsRouter.use(handleBoardError);
