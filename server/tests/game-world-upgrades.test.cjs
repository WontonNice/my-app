const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { WebSocket } = require('ws');
const fixture = require('./helpers/game-fixture.cjs');
const { attachBoardRealtime } = require('../src/lib/boardRealtime.ts');
const { attachGameRealtime } = require('../src/lib/gameRealtime.ts');
const { attachGameWorldRealtime } = require('../src/lib/gameWorldRealtime.ts');
let server, root;

before(async () => {
  const express = require('express'), app = express();
  app.use(express.json()); app.use('/api/game-rooms', fixture.router);
  server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  // Keep the production registration order: every upgrade listener sees the request.
  attachBoardRealtime(server, []);
  attachGameRealtime(server, []);
  attachGameWorldRealtime(server, []);
  root = `http://127.0.0.1:${server.address().port}`;
});
after(async () => new Promise(resolve => server.close(resolve)));

async function call(path, token, body) {
  const response = await fetch(root + '/api/game-rooms' + path, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.ok(response.ok, `Game API returned ${response.status}`);
  return (await response.json()).room;
}
async function waitFor(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) { if (Date.now() > deadline) throw new Error('Timed out waiting for a socket message'); await new Promise(resolve => setTimeout(resolve, 15)); }
}
function socket(t, path, options = {}) {
  const ws = new WebSocket(root.replace('http:', 'ws:') + path, { handshakeTimeout: 2000, ...options });
  const result = { ws, messages: [], errors: [], closed: undefined, opened: false };
  ws.on('open', () => { result.opened = true; });
  ws.on('message', raw => result.messages.push(JSON.parse(raw.toString())));
  ws.on('error', error => result.errors.push(error));
  ws.on('close', code => { result.closed = code; });
  t.after(() => ws.terminate());
  return result;
}

test('world joins and movement work alongside board and team cursor upgrade handlers', async t => {
  const room = await call('/', 'teacher', { mode: 'world' });
  await call('/join', 'maya', { code: room.code });
  const teacher = socket(t, '/api/game-rooms/world'), maya = socket(t, '/api/game-rooms/world?transport=websocket');
  await Promise.all([once(teacher.ws, 'open'), once(maya.ws, 'open')]);
  for (const [connection, token] of [[teacher, 'teacher'], [maya, 'maya']]) {
    connection.ws.send(JSON.stringify({ type: 'join', token, roomId: room.id, character: 'frog' }));
  }
  await waitFor(() => [teacher, maya].every(connection => connection.messages.some(message => message.type === 'ready')));
  assert.equal(maya.messages.find(message => message.type === 'ready').selfId, fixture.users.maya.id);
  const pose = { x: 4, y: 0, z: -3, rotation: 1, moving: true };
  maya.ws.send(JSON.stringify({ type: 'move', pose }));
  await waitFor(() => teacher.messages.some(message => message.peers?.some(peer => peer.id === fixture.users.maya.id && peer.pose.x === pose.x)));
  assert.deepEqual(teacher.messages.at(-1).peers.find(peer => peer.id === fixture.users.maya.id).pose, pose);
});

test('existing board and team endpoints still upgrade and reject missing sign-in messages', async t => {
  for (const path of ['/api/boards/live', '/api/game-rooms/live']) {
    const connection = socket(t, path);
    await once(connection.ws, 'open');
    connection.ws.send(JSON.stringify({ type: 'join' }));
    await waitFor(() => connection.closed !== undefined);
    assert.equal(connection.closed, 4001, path);
  }
});

test('combined upgrade handlers reject foreign origins and unknown socket routes', async t => {
  for (const path of ['/api/boards/live', '/api/game-rooms/live', '/api/game-rooms/world', '/api/game-rooms/world/unrecognized']) {
    const connection = socket(t, path, { origin: 'https://untrusted.example' });
    await waitFor(() => connection.closed !== undefined);
    assert.equal(connection.opened, false, path);
    assert.ok(connection.errors.length > 0, path);
  }
  const unknown = socket(t, '/api/unrecognized');
  await waitFor(() => unknown.closed !== undefined);
  assert.equal(unknown.opened, false);
  assert.ok(unknown.errors.length > 0);
});
