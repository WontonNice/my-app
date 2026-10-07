const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const Y = require('yjs');
const fixture = require('./helpers/boards-fixture.cjs');
const { shared, store, users, studentId, tables } = fixture;
let server, root, wss;
before(async () => {
  const express = require('express'), app = express(); app.use(express.json()); app.use('/api/boards', require('../src/routes/boards.ts').boardsRouter);
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  wss = require('../src/lib/boardRealtime.ts').attachBoardRealtime(server, []);
  root = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { for (const ws of wss.clients) ws.terminate(); await new Promise(resolve => server.close(resolve)); });
async function call(path, token = 'teacher', method = 'GET', body, extra = {}) {
  const response = await fetch(root + '/api/boards' + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...extra.headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), ...extra });
  return { status: response.status, data: await response.json() };
}
async function newBoard() { const created = await call('/', 'teacher', 'POST', { studentId, title: 'Evidence & Support Review' }); assert.equal(created.status, 201); return created.data.board; }
function docFor(board) { return store.decodeBoard(tables.student_boards.find(row => row.id === board.id).state); }
async function commit(board, user, change) { const doc = docFor(board); const vector = Y.encodeStateVector(doc); doc.transact(() => change(doc)); const result = await store.commitBoardUpdate(board.id, user, board.epoch, Y.encodeStateAsUpdate(doc, vector)); doc.destroy(); return result; }
function live(board, token) {
  const { WebSocket } = require('ws'), ws = new WebSocket(root.replace('http:', 'ws:') + '/api/boards/live');
  const messages = [], waiters = [], doc = new Y.Doc();
  ws.on('open', () => ws.send(JSON.stringify({ type: 'join', boardId: board.id, token })));
  ws.on('message', raw => { const message = JSON.parse(raw); if (message.state) Y.applyUpdate(doc, Buffer.from(message.state, 'base64')); messages.push(message); for (const waiter of [...waiters]) if (waiter.filter(message)) { waiters.splice(waiters.indexOf(waiter), 1); waiter.resolve(message); } });
  const wait = (filter, existing = true) => { const found = existing && messages.find(filter); if (found) return Promise.resolve(found); return new Promise((resolve, reject) => { const waiter = { filter, resolve: message => { clearTimeout(timer); resolve(message); } }; const timer = setTimeout(() => { waiters.splice(waiters.indexOf(waiter), 1); reject(new Error('WebSocket message timed out')); }, 5000); waiters.push(waiter); }); };
  return { ws, doc, messages, wait, send: value => ws.send(JSON.stringify(value)), update: (change, sequence = 1) => { const vector = Y.encodeStateVector(doc); doc.transact(() => change(doc)); ws.send(JSON.stringify({ type: 'update', epoch: board.epoch, sequence, state: Buffer.from(Y.encodeStateAsUpdate(doc, vector)).toString('base64') })); return wait(message => message.type === 'ack' && message.sequence === sequence, false); } };
}
test('private student workspace creation, membership, management and forged teacher rejection', async () => {
  const originAllowed = require('../src/lib/boardRealtime.ts').boardOriginAllowed;
  assert.equal(originAllowed('%%%', 'localhost:8080', []), false);
  assert.equal(originAllowed('https://unrelated.example', 'app.example', []), false);
  assert.equal(originAllowed('https://app.example', 'app.example', []), true);
  assert.equal((await call('/', 'missing')).status, 401);
  assert.equal((await call('/', 'forged', 'POST', { studentId, title: 'Not allowed' })).status, 403);
  const board = await newBoard();
  assert.equal(board.studentId, studentId); assert.equal(board.participants.find(person => person.id === studentId).role, 'editor');
  assert.equal((await call(`/${board.id}`, 'other')).status, 403);
  users.teacher.app_metadata.role = 'student';
  try { assert.equal((await call(`/${board.id}`, 'teacher')).status, 403); } finally { users.teacher.app_metadata.role = 'teacher'; }
  assert.equal((await call(`/?studentId=${studentId}`, 'other')).status, 403);
  assert.equal((await call('/', 'student')).data.boards.some(item => item.id === board.id), true);
  assert.equal((await call(`/${board.id}`, 'student', 'PATCH', { action: 'rename', title: 'Wrong', revision: board.revision })).status, 403);
  const renamed = await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'rename', title: 'Essay plan', revision: board.revision }); assert.equal(renamed.data.board.title, 'Essay plan');
  assert.equal((await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'rename', title: 'Missing revision' })).status, 400);
  assert.equal((await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'rename', title: 'Stale', revision: board.revision })).status, 409);
  assert.equal((await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'delete', confirm: 'wrong', revision: renamed.data.board.revision })).status, 400);
});
test('same-note CRDT edits converge, different-node edits survive CAS retry, local undo preserves remote work', async () => {
  const board = await newBoard(), noteId = randomUUID();
  await commit(board, users.teacher, doc => shared.addBoardNode(doc, shared.makeBoardNode(noteId, 'note', 0, 0, 'Claim')));
  const teacher = docFor(board), student = docFor(board), vectorA = Y.encodeStateVector(teacher), vectorB = Y.encodeStateVector(student);
  teacher.getMap('nodes').get(noteId).get('text').insert(5, ' teacher'); student.getMap('nodes').get(noteId).get('text').insert(5, ' student');
  const updates = [Y.encodeStateAsUpdate(teacher, vectorA), Y.encodeStateAsUpdate(student, vectorB)];
  fixture.conflict(); await Promise.all(updates.map((update, index) => store.commitBoardUpdate(board.id, index ? users.student : users.teacher, board.epoch, update)));
  const stored = docFor(board), content = shared.readBoard(stored).nodes[0].text; assert.match(content, /teacher/); assert.match(content, /student/);
  Y.applyUpdate(teacher, Y.encodeStateAsUpdate(stored)); Y.applyUpdate(student, Y.encodeStateAsUpdate(stored)); assert.equal(shared.readBoard(teacher).nodes[0].text, shared.readBoard(student).nodes[0].text);
  const undo = new Y.UndoManager(teacher.getMap('nodes'), { trackedOrigins: new Set(['local']) });
  teacher.transact(() => teacher.getMap('nodes').get(noteId).set('color', '#438b61'), 'local');
  student.getMap('nodes').get(noteId).get('text').insert(0, 'Remote '); Y.applyUpdate(teacher, Y.encodeStateAsUpdate(student)); undo.undo(); assert.match(shared.readBoard(teacher).nodes[0].text, /^Remote /); assert.equal(shared.readBoard(teacher).nodes[0].color, '');
  undo.destroy(); [teacher, student, stored].forEach(doc => doc.destroy());
});
test('viewer, source-lock bypass, unsafe URLs, unknown schema and forged actor fields', async () => {
  const board = await newBoard(), noteId = randomUUID();
  await commit(board, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(noteId, 'note', 0, 0, 'Locked source'), locked: true, createdBy: users.other.id }));
  assert.equal(shared.readBoard(docFor(board)).nodes[0].createdBy, users.teacher.id);
  await assert.rejects(commit(board, users.student, doc => doc.getMap('nodes').get(noteId).set('locked', false)), /locked|locks/);
  await assert.rejects(commit(board, users.student, doc => doc.getMap('nodes').delete(noteId)), /locked/);
  await assert.rejects(commit(board, users.student, doc => doc.getMap('nodes').get(noteId).get('text').insert(0, 'Overwrite')), /locked/);
  await assert.rejects(commit(board, users.student, doc => { const map = doc.getMap('nodes').get(noteId); const replacement = new Y.Text(); replacement.insert(0, map.get('text').toString()); map.set('text', replacement); }), /locked/);
  const current = (await call(`/${board.id}`)).data.board;
  await call(`/${board.id}/participants/${studentId}`, 'teacher', 'PUT', { role: 'viewer', revision: current.revision });
  await assert.rejects(commit(board, users.student, doc => shared.addBoardNode(doc, shared.makeBoardNode(randomUUID(), 'note', 0, 0))), /view only/);
  await assert.rejects(commit(board, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(randomUUID(), 'link', 0, 0), url: 'javascript:alert(1)' })), /http/);
  await assert.rejects(commit(board, users.teacher, doc => doc.getMap('secrets').set('value', 'oops')), /Unknown/);
});
test('private image upload, foreign-board denial, file validation and duplication', async () => {
  const board = await newBoard(), foreign = await newBoard();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jfRsAAAAASUVORK5CYII=', 'base64');
  const response = await fetch(`${root}/api/boards/${board.id}/assets`, { method: 'POST', headers: { Authorization: 'Bearer student', 'Content-Type': 'application/octet-stream', 'x-file-type': 'image/png', 'x-file-name': 'evidence.png' }, body: png });
  assert.equal(response.status, 201); const { asset } = await response.json();
  assert.equal((await call(`/${board.id}/assets/${asset.id}`, 'other')).status, 403);
  assert.equal((await call(`/${foreign.id}/assets/${asset.id}`)).status, 404);
  await commit(board, users.student, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(randomUUID(), 'image', 0, 0, 'Evidence'), assetId: asset.id }));
  await assert.rejects(commit(foreign, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(randomUUID(), 'image', 0, 0), assetId: asset.id })), /does not belong/);
  const copied = await call(`/${board.id}/duplicate`, 'teacher', 'POST'); assert.equal(copied.status, 201); const copiedNode = shared.readBoard(docFor(copied.data.board)).nodes[0]; assert.notEqual(copiedNode.assetId, asset.id);
});
test('imports exclude individual questions and assignments; existing linked cards retain safe access', async () => {
  const board = await newBoard(); assert.equal((await call(`/${board.id}/content`)).data.items.length, 0);
  tables.student_assignments.push({ id: randomUUID(), student_id: studentId, kind: 'practice', content_id: 'qa-bank', title: 'Evidence practice', instructions: 'Explain your reasoning.', assigned_at: new Date().toISOString(), status: 'assigned' });
  const result = await call(`/${board.id}/content`, 'student'); assert.equal(result.status, 200); assert.deepEqual(result.data.items, []);
  const nodeId = randomUUID();
  await commit(board, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(nodeId, 'question', 0, 0), reference: { kind: 'question', id: 'qa-bank-q' } }));
  const existing = await call(`/${board.id}/content/${nodeId}`, 'student');
  assert.equal(existing.status, 200);
  assert.doesNotMatch(JSON.stringify(existing.data), /SECRET|correctChoiceId|explanation/);
  assert.equal((await call(`/${board.id}/content/${nodeId}`, 'other')).status, 403);
});
test('restore preserves current work, rejects stale offline generations, and archives are read only', async () => {
  const board = await newBoard(); await commit(board, users.student, doc => shared.addBoardNode(doc, shared.makeBoardNode(randomUUID(), 'note', -10000, 20000, 'Offline learning')));
  const staleMetadata = await store.fetchBoard(board.id);
  const version = (await call(`/${board.id}/history`, 'student')).data.revisions[0]; const current = (await call(`/${board.id}`)).data.board;
  const restored = await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'restore', versionId: version.id, revision: current.revision }); assert.equal(restored.status, 200); assert.notEqual(restored.data.board.epoch, board.epoch);
  await assert.rejects(store.boardSummary(staleMetadata, users.teacher), /restored/);
  const update = Y.encodeStateAsUpdate(shared.seedBoard({ nodes: [shared.makeBoardNode(randomUUID(), 'note', 0, 0)], edges: [] }));
  await assert.rejects(store.commitBoardUpdate(board.id, users.student, board.epoch, update), /restored/);
  assert.equal((await call(`/${board.id}/history`)).data.revisions.some(version => version.label === 'Before restore'), true);
  const archived = await call(`/${board.id}`, 'teacher', 'PATCH', { action: 'archive', archived: true, revision: restored.data.board.revision }); assert.equal(archived.status, 200);
  await assert.rejects(store.commitBoardUpdate(board.id, users.student, archived.data.board.epoch, update), /archived/);
  const active = await newBoard(), stalePeer = live(active, 'student'); await stalePeer.wait(message => message.type === 'ready');
  const freshDoc = shared.seedBoard({ nodes: [], edges: [] });
  const changed = await fixture.db.rpc('manage_student_board', { p_id: active.id, p_actor: users.teacher.id, p_revision: active.revision, p_action: 'restore', p_value: { state: store.encodeBoard(freshDoc) } }); freshDoc.destroy();
  // Simulate a lost restore notification: an existing socket still cannot
  // relabel its old document with the new generation.
  stalePeer.send({ type: 'update', epoch: changed.data.epoch, sequence: 99, state: Buffer.from(update).toString('base64') });
  const rejected = await stalePeer.wait(message => message.type === 'recovery'); assert.match(rejected.message, /different version/); stalePeer.ws.close(); stalePeer.doc.destroy();
});
test('authenticated WebSocket collaboration: creation, same-note typing, move, group, edge, lock, reconnect and durable reload', async () => {
  const board = await newBoard(), a = live(board, 'teacher'), b = live(board, 'student'); await Promise.all([a.wait(message => message.type === 'ready'), b.wait(message => message.type === 'ready')]);
  const noteId = randomUUID(), otherId = randomUUID();
  await a.update(doc => { shared.addBoardNode(doc, shared.makeBoardNode(noteId, 'note', 0, 0, 'Idea')); shared.addBoardNode(doc, shared.makeBoardNode(otherId, 'note', 400, 0, 'Evidence')); });
  await b.wait(() => shared.readBoard(b.doc).nodes.length === 2);
  await b.update(doc => doc.getMap('nodes').get(noteId).set('x', -300), 2);
  await a.wait(() => shared.readBoard(a.doc).nodes.find(node => node.id === noteId).x === -300);
  const vectorA = Y.encodeStateVector(a.doc), vectorB = Y.encodeStateVector(b.doc);
  a.doc.getMap('nodes').get(noteId).get('text').insert(4, ' teacher'); b.doc.getMap('nodes').get(noteId).get('text').insert(4, ' student');
  a.send({ type: 'update', sequence: 3, epoch: board.epoch, state: Buffer.from(Y.encodeStateAsUpdate(a.doc, vectorA)).toString('base64') }); b.send({ type: 'update', sequence: 3, epoch: board.epoch, state: Buffer.from(Y.encodeStateAsUpdate(b.doc, vectorB)).toString('base64') }); await Promise.all([a.wait(message => message.type === 'ack' && message.sequence === 3), b.wait(message => message.type === 'ack' && message.sequence === 3)]);
  assert.match(shared.readBoard(docFor(board)).nodes.find(node => node.id === noteId).text, /teacher/); assert.match(shared.readBoard(docFor(board)).nodes.find(node => node.id === noteId).text, /student/);
  await b.update(doc => shared.addBoardEdge(doc, { id: randomUUID(), source: noteId, target: otherId, sourceHandle: 'right', targetHandle: 'left', label: 'supported by', color: '' }), 4);
  await a.update(doc => { shared.addBoardNode(doc, shared.makeBoardNode(randomUUID(), 'group', -400, -100, 'Evidence & support')); doc.getMap('nodes').get(otherId).set('locked', true); }, 5);
  await b.wait(() => shared.readBoard(b.doc).nodes.some(node => node.locked));
  b.send({ type: 'presence', data: { name: 'Impersonated teacher', userId: users.teacher.id, cursor: { x: 20, y: 30 }, selection: [noteId], editing: noteId } });
  const presence = await a.wait(message => message.type === 'presence' && message.peers.some(peer => peer.userId === studentId && peer.editing === noteId), false); assert.equal(presence.peers.find(peer => peer.userId === studentId).name, 'QA Student');
  b.send({ type: 'presence', data: { editing: otherId, drag: [{ id: otherId, x: 999, y: 999 }], selection: [] } });
  const guarded = await a.wait(message => message.type === 'presence' && message.peers.some(peer => peer.userId === studentId && peer.editing === null && peer.drag?.length === 0), false);
  assert.equal(guarded.peers.find(peer => peer.userId === studentId).drag.length, 0);
  const disconnected = Y.encodeStateAsUpdate(b.doc); b.ws.close();
  await a.update(doc => doc.getMap('nodes').get(noteId).get('text').insert(0, 'Live '), 6);
  const offline = new Y.Doc(); Y.applyUpdate(offline, disconnected); const vector = Y.encodeStateVector(offline); offline.getMap('nodes').get(noteId).get('text').insert(0, 'Offline ');
  const returning = live(board, 'student'); await returning.wait(message => message.type === 'ready'); returning.send({ type: 'update', sequence: 7, epoch: board.epoch, state: Buffer.from(Y.encodeStateAsUpdate(offline, vector)).toString('base64') }); await returning.wait(message => message.type === 'ack' && message.sequence === 7);
  const final = docFor(board); assert.match(shared.readBoard(final).nodes.find(node => node.id === noteId).text, /Live /); assert.match(shared.readBoard(final).nodes.find(node => node.id === noteId).text, /Offline /); assert.equal(shared.readBoard(final).edges.length, 1); assert.equal(shared.readBoard(final).nodes.some(node => node.type === 'group'), true);
  a.ws.close(); returning.ws.close(); [a.doc,b.doc,returning.doc,offline,final].forEach(doc => doc.destroy());
});
test('a temporary collaboration outage requests reconnect and a fresh join succeeds', async () => {
  const board = await newBoard();
  fixture.failChannel();
  const failed = live(board, 'student');
  const closed = new Promise(resolve => failed.ws.once('close', code => resolve(code)));
  const message = await failed.wait(message => message.type === 'retry');
  assert.match(message.message, /collaboration service is unavailable/);
  assert.equal(await closed, 1013);
  const returning = live(board, 'student');
  await returning.wait(message => message.type === 'ready');
  assert.equal((await call(`/${board.id}`, 'student')).status, 200);
  returning.ws.close(); failed.doc.destroy(); returning.doc.destroy();
});
test('student-created boards appear for a teacher only after explicit sharing', async () => {
  const created = await call('/', 'student', 'POST', { title: 'Student reasoning' });
  const board = created.data.board;
  assert.equal((await call(`/?studentId=${studentId}`, 'teacher')).data.boards.some(item => item.id === board.id), false);
  assert.equal((await call(`/${board.id}`, 'teacher')).status, 403);
  const shared = await call(`/${board.id}/participants/${users.teacher.id}`, 'student', 'PUT', { role: 'editor', revision: board.revision });
  assert.equal(shared.status, 200);
  const listed = (await call(`/?studentId=${studentId}`, 'teacher')).data.boards.find(item => item.id === board.id);
  assert.equal(listed.role, 'editor');
});
test('teacher-wide library includes owned and invited boards without exposing private student boards', async () => {
  const owned = await newBoard();
  const privateBoard = (await call('/', 'student', 'POST', { title: 'Private planning' })).data.board;
  const invited = (await call('/', 'student', 'POST', { title: 'Shared planning' })).data.board;
  await call(`/${invited.id}/participants/${users.teacher.id}`, 'student', 'PUT', { revision: invited.revision, role: 'editor' });
  const listed = await call('/?scope=teacher');
  assert.equal(listed.status, 200);
  assert.equal(listed.data.boards.some(board => board.id === owned.id), true);
  assert.equal(listed.data.boards.some(board => board.id === invited.id), true);
  assert.equal(listed.data.boards.some(board => board.id === privateBoard.id), false);
  assert.equal((await call('/?scope=teacher', 'student')).status, 403);
  assert.equal((await call('/?scope=teacher', 'forged')).status, 403);
});
test('passage bundles include every original question; extracted questions keep access checks and omit nested answers', async () => {
  const canonical = require('../data/board-content.json'), learning = require('../data/learning-catalog.json');
  for (const passage of learning.filter(item => item.kind === 'passage')) {
    const bundled = canonical.find(item => item.id === passage.id);
    assert.equal(bundled?.viewer.questions.length, passage.questionCount, `Every question in ${passage.id} must be exported`);
    assert.doesNotMatch(JSON.stringify(bundled), /"(?:correct[A-Z][^"]*|explanation(?:Html)?)"\s*:/);
  }
  const board = await newBoard();
  tables.student_assignments.push({ id: randomUUID(), student_id: studentId, kind: 'passage', content_id: 'qa-passage', assigned_at: new Date().toISOString(), status: 'assigned' });
  tables.student_library_attempts.push({ id: randomUUID(), user_id: studentId, book_id: 'qa-passage', total_questions: 1, completed_at: new Date().toISOString() });
  const catalog = (await call(`/${board.id}/content`, 'student')).data.items;
  const source = catalog.find(item => item.reference.kind === 'passage');
  assert.ok(catalog.every(item => item.reference.kind === 'passage' && item.viewer?.passage));
  assert.equal((await call(`/${board.id}/content?q=synthetic`, 'student')).data.items.length, 1);
  assert.equal((await call(`/${board.id}/content?q=Which%20evidence`, 'student')).data.items.length, 0);
  assert.ok((await call(`/${board.id}/content?kind=question`, 'student')).data.items.every(item => item.reference.kind === 'passage'));
  assert.equal(source.viewer.questions.length, 1);
  assert.equal(source.viewer.passage.title, 'A synthetic reading passage');
  assert.doesNotMatch(JSON.stringify(source), /SECRET|correctChoice|explanation/);
  const nodeId = randomUUID();
  await commit(board, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(nodeId, 'question', 0, 0), reference: { ...source.reference, questionId: 'qa-exam-q' } }));
  const extracted = await call(`/${board.id}/content/${nodeId}`, 'student');
  assert.equal(extracted.status, 200);
  assert.equal(extracted.data.item.viewer.questions[0].id, 'qa-exam-q');
  assert.equal(extracted.data.item.viewer.passage, undefined);
  assert.equal((await call(`/${board.id}/content/${nodeId}`, 'other')).status, 403);
  const { boardQuestion } = require('../src/shared/boardContent.ts');
  const sanitized = boardQuestion({ id: 'tei', type: 'inline_dropdown', topic: 'Grammar', prompt: 'Choose', correctChoiceId: 'SECRET', explanation: 'SECRET', dropdowns: [{ id: 'blank', options: [{ id: 'A', text: 'Text' }], correctChoiceId: 'SECRET' }], dragDropSlots: [{ id: 'box', correctItemId: 'SECRET' }], numberLineResponse: { min: 0, max: 10, tickStep: 1, labelStep: 1, correctValue: 3, correctDirection: 'left', correctEndpoint: 'open' } });
  assert.doesNotMatch(JSON.stringify(sanitized), /SECRET|correct/i);
  assert.equal(sanitized.dropdowns[0].options[0].text, 'Text');
});
test('passage imports use completed library and exam history, including aliases and pagination, without exposing unfinished passages', async () => {
  const target = users.other.id, at = new Date().toISOString();
  const created = await call('/', 'teacher', 'POST', { studentId: target, title: 'Completed work only' }), board = created.data.board;
  const entries = ['library-done', 'compat-done', 'exam-done', 'not-done', 'page-done'].map(id => ({ id: `qa-${id}`, kind: 'passage', title: id, aliases: [`qa-${id}-set`, `qa-${id}-alias`], href: `/study-hall/shsat/library/qa-${id}` }));
  const catalogLength = fixture.catalog.length, setLength = fixture.examContent.passageSets.length;
  const sets = [...entries.map(entry => ({ id: entry.aliases[0], passage: { id: entry.id, title: entry.title, lines: [{ text: entry.title }] }, questions: [{ id: `${entry.id}-q`, type: 'multiple_choice', prompt: 'Question', topic: 'Inference', correctChoiceId: 'SECRET' }] })), { id: 'qa-custom-done', passage: { id: 'qa-custom-text', title: 'Custom exam passage', lines: [{ text: 'Custom passage' }] }, questions: [{ id: 'qa-custom-q', type: 'multiple_choice', prompt: 'Custom question', topic: 'Inference', correctChoiceId: 'SECRET' }] }];
  fixture.catalog.push(...entries); fixture.examContent.passageSets.push(...sets);
  try {
    tables.student_assignments.push({ id: randomUUID(), student_id: target, kind: 'passage', content_id: 'qa-not-done', assigned_at: at, status: 'assigned' });
    tables.student_practice_progress.push({ user_id: target, topic_slug: 'english-library:qa-not-done', progress: { unlockedAt: at, attempts: [] } });
    assert.deepEqual((await call(`/${board.id}/content`, 'other')).data.items, []);
    tables.student_library_attempts.push({ id: randomUUID(), user_id: target, book_id: 'qa-library-done-alias', total_questions: 1, completed_at: at });
    tables.student_library_attempts.push({ id: randomUUID(), user_id: studentId, book_id: 'qa-not-done', total_questions: 1, completed_at: at });
    tables.student_library_attempts.push({ id: randomUUID(), user_id: target, book_id: 'qa-not-done', total_questions: 0, completed_at: at });
    tables.student_library_attempts.push({ id: randomUUID(), user_id: target, book_id: 'qa-not-done', total_questions: 1, completed_at: null });
    tables.student_practice_progress.push({ user_id: target, topic_slug: 'english-library:qa-compat-done-alias', progress: { attempts: [{ total_questions: 1, completed_at: at }] } });
    tables.student_practice_progress.push({ user_id: target, topic_slug: 'english-library:qa-library-done', progress: { attempts: [{ total_questions: 1, completed_at: at }] } });
    const history = { user_id: target, assessment_id: 'qa-exam', completed_at: at, result: { completedSections: ['math'], completionStatus: 'math_complete', passages: [{ id: 'qa-exam-done-set', total: 1 }, { id: 'qa-custom-done', total: 1 }] } };
    tables.student_exam_results.push(history);
    const ids = async () => (await call(`/${board.id}/content`, 'other')).data.items.map(item => item.reference.id).sort();
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-library-done']);
    history.result = { ...history.result, completedSections: ['english'], completionStatus: 'english_complete', status: 'in_progress' };
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-library-done']);
    delete history.result.status;
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-custom-done', 'qa-exam-done', 'qa-library-done']);
    for (let i = 0; i < 1000; i++) tables.student_library_attempts.push({ id: `history-${String(i).padStart(4, '0')}`, user_id: target, book_id: 'unknown', total_questions: 0, completed_at: at });
    tables.student_library_attempts.push({ id: 'zz-last-page', user_id: target, book_id: 'qa-page-done', total_questions: 1, completed_at: at });
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-custom-done', 'qa-exam-done', 'qa-library-done', 'qa-page-done']);
    const items = (await call(`/${board.id}/content`, 'other')).data.items;
    assert.doesNotMatch(JSON.stringify(items), /SECRET|correctChoiceId/);
    const source = items.find(item => item.reference.id === 'qa-custom-done'), nodeId = randomUUID();
    await commit(board, users.teacher, doc => shared.addBoardNode(doc, { ...shared.makeBoardNode(nodeId, 'passage', 0, 0), reference: source.reference }));
    assert.equal((await call(`/${board.id}/content/${nodeId}`, 'other')).data.item.viewer.questions[0].id, 'qa-custom-q');
    const verified = tables.student_assignments.find(row => row.student_id === target && row.content_id === 'qa-not-done');
    verified.status = 'completed'; verified.completed_at = at;
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-custom-done', 'qa-exam-done', 'qa-library-done', 'qa-not-done', 'qa-page-done']);
    fixture.tableErrors.set('student_library_attempts', { code: 'PGRST205', message: 'Missing legacy library table' });
    assert.deepEqual(await ids(), ['qa-compat-done', 'qa-custom-done', 'qa-exam-done', 'qa-library-done', 'qa-not-done']);
    fixture.tableErrors.delete('student_library_attempts');
    fixture.tableErrors.set('student_exam_results', { code: '08006', message: 'Database connection interrupted' });
    const failed = await call(`/${board.id}/content`, 'other');
    assert.equal(failed.status, 503); assert.match(failed.data.message, /Completed passage history/);
  } finally {
    fixture.tableErrors.clear(); fixture.catalog.splice(catalogLength); fixture.examContent.passageSets.splice(setLength);
  }
});
test('shared highlights merge concurrently, survive reload and obey source locks', async () => {
  const board = await newBoard(), nodeId = randomUUID();
  await commit(board, users.teacher, doc => shared.addBoardNode(doc, shared.makeBoardNode(nodeId, 'note', 0, 0, 'Evidence text')));
  const a = docFor(board), b = docFor(board), va = Y.encodeStateVector(a), vb = Y.encodeStateVector(b);
  a.getMap('nodes').get(nodeId).get('highlights').set('teacher-mark', { key: 'note', start: 0, end: 8, quote: 'Evidence', color: 'yellow' });
  b.getMap('nodes').get(nodeId).get('highlights').set('student-mark', { key: 'note', start: 9, end: 13, quote: 'text', color: 'blue' });
  await Promise.all([store.commitBoardUpdate(board.id, users.teacher, board.epoch, Y.encodeStateAsUpdate(a, va)), store.commitBoardUpdate(board.id, users.student, board.epoch, Y.encodeStateAsUpdate(b, vb))]);
  assert.equal(Object.keys(shared.readBoard(docFor(board)).nodes[0].highlights).length, 2);
  await commit(board, users.teacher, doc => doc.getMap('nodes').get(nodeId).set('locked', true));
  await assert.rejects(commit(board, users.student, doc => doc.getMap('nodes').get(nodeId).get('highlights').delete('teacher-mark')), /locked/);
  await assert.rejects(commit(board, users.teacher, doc => doc.getMap('nodes').get(nodeId).get('highlights').set('invalid', { key: 'note', start: -1, end: 2, quote: 'abc', color: 'yellow' })), /highlight/);
  a.destroy(); b.destroy();
});
test('layers order notes against images, keep selection order and persist after reload', async () => {
  const board = await newBoard(), note = { ...shared.makeBoardNode('note-a', 'note', 0, 0), z: 1 }, image = { ...shared.makeBoardNode('image-a', 'image', 0, 0), z: 2 }, other = { ...shared.makeBoardNode('note-b', 'note', 0, 0), z: 3 };
  await commit(board, users.teacher, doc => [note, image, other].forEach(node => shared.addBoardNode(doc, node)));
  const front = shared.boardLayerChanges([note, image, other], new Set([note.id]), 'front');
  assert.ok(front[note.id] > other.z);
  const forward = shared.boardLayerChanges([note, image, other], new Set([note.id]), 'forward');
  assert.ok(forward[note.id] > image.z && forward[note.id] < other.z);
  const backward = shared.boardLayerChanges([note, image, other], new Set([image.id]), 'backward');
  assert.ok(backward[image.id] < note.z);
  const back = shared.boardLayerChanges([note, image, other], new Set([note.id, other.id]), 'back');
  assert.ok(back[note.id] < back[other.id] && back[other.id] < image.z);
  await commit(board, users.teacher, doc => doc.getMap('nodes').get(note.id).set('z', front[note.id]));
  assert.equal(shared.readBoard(docFor(board)).nodes.find(node => node.id === note.id).z, front[note.id]);
});
test('500-node structured boards remain bounded and preserve 800 connections', () => {
  const started = performance.now(), nodes = Array.from({ length: 500 }, (_, i) => shared.makeBoardNode(`note-${i}`, 'note', (i % 20) * 350, Math.floor(i / 20) * 250, `Evidence ${i} · \\(x^2\\)`));
  const edges = Array.from({ length: 800 }, (_, i) => ({ id: `edge-${i}`, source: `note-${i % 499}`, target: `note-${i % 499 + 1}`, sourceHandle: 'right', targetHandle: 'left', label: 'supports', color: '' }));
  const doc = shared.seedBoard({ nodes, edges }); shared.validateBoard(doc); const encoded = Y.encodeStateAsUpdate(doc); const replica = new Y.Doc(); Y.applyUpdate(replica, encoded);
  assert.equal(shared.readBoard(replica).nodes.length, 500); assert.equal(shared.readBoard(replica).edges.length, 800); assert.ok(encoded.length < 512 * 1024); console.log(`500-node CRDT create/validate/reload: ${Math.round(performance.now()-started)} ms, ${encoded.length} bytes`); doc.destroy(); replica.destroy();
});
