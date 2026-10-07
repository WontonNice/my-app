// Uses the real board API/WebSocket/canvas with isolated in-memory Supabase
// adapters. It never opens .env files, real sessions, or production student data.
const path = require('node:path'), esbuild = require('esbuild'), express = require(require.resolve('express', { paths: [path.resolve(__dirname, '../server')] }));
const { randomUUID } = require('node:crypto');
const fixture = require('../server/tests/helpers/boards-fixture.cjs');
const { shared, store, users, tables, objects } = fixture;
(async () => {
  const result = await esbuild.build({ entryPoints: [path.resolve(__dirname, 'boards-preview.tsx')], bundle: true, write: false, outdir: path.resolve(__dirname, '.boards-preview'), format: 'esm', jsx: 'automatic', loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' }, define: { 'import.meta.env': '{}' }, plugins: [{ name: 'isolated-board-auth', setup(build) { build.onResolve({ filter: /(^|\/)supabase$/ }, () => ({ path: path.resolve(__dirname, 'boards-supabase-preview.ts') })); } }] });
  const files = new Map(result.outputFiles.map(file => ['/' + path.basename(file.path), file.contents]));
  const features = process.argv.includes('--features');
  const port = Number(process.argv.find(value => value.startsWith('--port='))?.slice(7)) || 4328;
  const count = features ? 2 : process.argv.includes("--large") ? 500 : 50; const columns = count > 100 ? 20 : 8;
  const nodes = Array.from({ length: count }, (_, i) => ({ ...shared.makeBoardNode(`qa-note-${i}`, i === 3 ? 'math' : 'note', 80 + (i % columns) * 350, 90 + Math.floor(i / columns) * 260, i === 0 ? '## Central idea\n\nA strong claim grows from evidence.\n\n- Read carefully\n- Explain the connection' : i === 1 ? '## Evidence 1\n\n“The seed received sunlight.”\n\n**Why does this matter?**' : i === 2 ? '## Teacher feedback\n\nExplain why this evidence supports the answer.' : i === 3 ? '## Math reasoning\n\n\\(x^2 + 3x = 10\\)\n\n\\[\\frac{x}{2} = \\sqrt{9}\\]' : `## Learning note ${i + 1}\n\nEvidence, reasoning, and reflection.\n\nConnect this idea to the central claim.`), color: i === 2 ? '#8262b5' : '', locked: i === 0 }));
  if (!features) {
    for (let i = 0; i < 10; i++) nodes.push({ ...shared.makeBoardNode(`qa-link-${i}`, 'link', 80 + (i % columns) * 350, (Math.ceil(count / columns) + 1) * 260 + Math.floor(i / columns) * 260, `Reading source ${i + 1}`), url: 'https://example.com/learning' });
    for (let i = 0; i < 3; i++) nodes.unshift({ ...shared.makeBoardNode(`qa-group-${i}`, 'group', 40 + i * 1050, 30, ['Evidence & support', 'Math reasoning', 'Learning reflection'][i]), width: 1000, height: 540, color: ['#4383b0','#438b61','#8262b5'][i] });
  } else {
    const fs = require('node:fs');
    const sources = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../server/data/board-content.json'), 'utf8'));
    const source = sources.find(source => source.viewer.passage.format === 'prose' && source.viewer.questions.length >= 5);
    const entry = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../server/data/learning-catalog.json'), 'utf8')).find(item => item.id === source.id);
    fixture.catalog.push(entry);
    tables.student_assignments.push({ id: randomUUID(), student_id: users.student.id, kind: 'passage', content_id: source.id, title: source.title, assigned_at: new Date().toISOString(), status: 'assigned' });
    tables.student_library_attempts.push({ id: randomUUID(), user_id: users.student.id, book_id: source.id, total_questions: source.viewer.questions.length, completed_at: new Date().toISOString() });
    nodes[0].locked = false; nodes[0].z = 2; nodes[1].z = 3;
    nodes.push({ ...shared.makeBoardNode('qa-passage-viewer', 'passage', 40, 420, source.title), width: 860, height: 620, z: 1, reference: { kind: 'passage', id: source.id } });
  }
  const edges = Array.from({ length: features ? 0 : count > 100 ? 800 : 45 }, (_, i) => ({ id: `qa-edge-${i}`, source: `qa-note-${i % (count - 1)}`, target: `qa-note-${i % (count - 1) + 1}`, sourceHandle: 'right', targetHandle: 'left', label: i === 0 ? 'supported by' : '', color: '' }));
  const doc = shared.seedBoard({ nodes, edges }); const boardId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  await fixture.db.rpc('create_student_board', { p_id: boardId, p_student: users.student.id, p_owner: users.teacher.id, p_title: 'Evidence & Support Review · isolated QA', p_state: store.encodeBoard(doc) }); doc.destroy();
  const app = express(); app.use(express.json()); app.use('/api/boards', require('../server/src/routes/boards.ts').boardsRouter);
  app.get('/qa-asset/:key', (request, response) => { const buffer = objects.get(request.params.key); if (!buffer) { response.sendStatus(404); return; } response.type('png').send(buffer); });
  app.get('/qa/status', (_request, response) => { const board = tables.student_boards[0], doc = store.decodeBoard(board.state); response.json({ board: { title: board.title, revision: board.revision, epoch: board.epoch }, data: shared.readBoard(doc) }); doc.destroy(); });
  app.use((request, response) => { const url = request.path, file = files.get(url); response.type(file ? url.endsWith('.js') ? 'application/javascript' : url.endsWith('.css') ? 'text/css' : url.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream' : 'text/html').send(file ? Buffer.from(file) : '<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Collaborative boards · isolated QA</title><link rel="stylesheet" href="/boards-preview.css"><div id="root"></div><script type="module" src="/boards-preview.js"></script></html>'); });
  const server = app.listen(port, '127.0.0.1', () => console.log(`Isolated board QA: http://127.0.0.1:${port}/?as=teacher and http://127.0.0.1:${port}/?as=student`));
  require('../server/src/lib/boardRealtime.ts').attachBoardRealtime(server, []);
})();
