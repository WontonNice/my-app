const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { WebSocket } = require('ws');
const fixture = require('./helpers/game-fixture.cjs');
const { attachGameWorldRealtime, parseWorldPose } = require('../src/lib/gameWorldRealtime.ts');
const { WORLD_MAX_PLAYERS } = require('../src/shared/gameWorld.ts');
const { worldRoomEvents } = require('../src/lib/gameWorldEvents.ts');
const { supabase } = require('../src/lib/supabase.ts');
const servers = [], roots = [];
before(async () => {
  for (let index = 0; index < 2; index++) {
    const express = require('express'), app = express();
    app.use(express.json()); app.use('/api/game-rooms', fixture.router);
    const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
    attachGameWorldRealtime(server, []);
    servers.push(server); roots.push(`http://127.0.0.1:${server.address().port}/api/game-rooms`);
  }
});
after(async () => { for (const server of servers) await new Promise(resolve => server.close(resolve)); });
async function call(path, token = 'teacher', method = 'GET', body) {
  const response = await fetch(roots[0] + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
const act = (room, token, action, body = {}) => call(`/${room.id}/action`, token, 'POST', { action, ...body });
const join = (room, token) => call('/join', token, 'POST', { code: room.code });
async function world() {
  const response = await call('/', 'teacher', 'POST', { mode: 'world' });
  assert.equal(response.status, 201, JSON.stringify(response.data)); return response.data.room;
}
async function waitFor(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) { if (Date.now() > deadline) throw new Error('Timed out waiting for a world message'); await new Promise(resolve => setTimeout(resolve, 15)); }
}
async function connect(t, room, token, instance = 0, extra = {}) {
  const ws = new WebSocket(roots[instance].replace('http:', 'ws:') + '/world');
  t.after(() => ws.terminate());
  const result = { ws, messages: [], closed: undefined, latest() { return this.messages.filter(message => message.type === 'presence' || message.type === 'ready').at(-1)?.peers ?? []; } };
  ws.on('message', raw => result.messages.push(JSON.parse(raw.toString())));
  ws.on('close', code => { result.closed = code; });
  await once(ws, 'open'); ws.send(JSON.stringify({ type: 'join', token, roomId: room.id, character: 'frog', ...extra }));
  await waitFor(() => result.closed || result.messages.some(message => message.type === 'ready'));
  return result;
}

test('teachers open a world without assessments; students join the same live room and reconnect', async () => {
  assert.equal((await call('/', 'maya', 'POST', { mode: 'world' })).status, 403);
  assert.equal((await call('/', 'teacher', 'POST', { mode: 'world', playtest: true })).status, 400);
  const room = await world();
  assert.equal(room.mode, 'world'); assert.equal(room.phase, 'question'); assert.equal(room.isHost, true);
  assert.equal(room.deadline, null); assert.equal(room.totalQuestions, 0); assert.deepEqual(room.unit, []);
  assert.equal(room.current, null); assert.equal(room.playtest, undefined);
  assert.equal((await call(`/${room.id}`, 'outsider')).status, 403);
  for (const token of ['maya', 'jordan']) assert.equal((await join(room, token)).status, 200);
  assert.equal((await join(room, 'maya')).data.room.players.length, 2);
  assert.equal((await call('/', 'maya')).data.rooms.some(item => item.id === room.id && item.mode === 'world'), true);
  assert.equal((await act(room, 'maya', 'answer', { answer: 'A' })).status, 400);
  assert.equal((await act(room, 'maya', 'finish')).status, 403);
  const row = fixture.rows.find(item => item.id === room.id);
  row.payload.players = Array.from({ length: WORLD_MAX_PLAYERS - 1 }, (_, index) => ({ id: `member-${index}`, name: 'Student' }));
  assert.equal((await join(room, 'alex')).status, 400);
});

test('authenticated avatars, positions, characters and preset emotes synchronize across servers and stay inside their room', async t => {
  const room = await world(), separateRoom = await world();
  for (const token of ['maya', 'alex']) await join(room, token);
  await join(separateRoom, 'jordan');
  const maya = await connect(t, room, 'maya'), alex = await connect(t, room, 'alex', 1), teacher = await connect(t, room, 'teacher');
  const jordan = await connect(t, separateRoom, 'jordan', 1);
  assert.equal(teacher.messages.find(message => message.type === 'ready').selfId, fixture.users.teacher.id);
  const outsider = await connect(t, room, 'outsider'); assert.equal(outsider.closed, 4003);
  const invalid = await connect(t, room, 'invalid'); assert.equal(invalid.closed, 4003);
  const archived = await connect(t, room, 'archived'); assert.equal(archived.closed, 4003);
  const wrongCharacter = await connect(t, room, 'maya', 0, { character: 'unknown' }); assert.equal(wrongCharacter.closed, 4003);
  maya.ws.send(JSON.stringify({ type: 'move', name: 'Spoof', id: fixture.users.teacher.id, pose: { x: 3, y: 1, z: -4, rotation: 1.5, moving: true } }));
  maya.ws.send(JSON.stringify({ type: 'character', character: 'astronaut' }));
  maya.ws.send(JSON.stringify({ type: 'emote', emote: 'hello', text: 'Unrestricted text cannot pass through' }));
  await waitFor(() => alex.latest().some(peer => peer.id === fixture.users.maya.id && peer.pose.x === 3 && peer.emote === 'hello'));
  const remote = alex.latest().find(peer => peer.id === fixture.users.maya.id);
  assert.equal(remote.name, 'Maya Chen'); assert.equal(remote.character, 'astronaut'); assert.equal(remote.pose.z, -4);
  assert.ok(remote.emoteAt <= Date.now()); assert.equal(JSON.stringify(remote).includes('Unrestricted'), false);
  assert.equal(jordan.messages.some(message => message.peers?.some(peer => peer.id === fixture.users.maya.id)), false);
  maya.ws.close(); await waitFor(() => !alex.latest().some(peer => peer.id === fixture.users.maya.id));
  const refreshed = await connect(t, room, 'maya');
  await waitFor(() => alex.latest().some(peer => peer.id === fixture.users.maya.id));
  refreshed.ws.send(JSON.stringify({ type: 'emote', emote: '<script>' }));
  await waitFor(() => refreshed.closed); assert.equal(refreshed.closed, 1008);
});

test('all four meme characters can join and switch across realtime server instances', async t => {
  const room = await world(); await join(room, 'maya');
  const teacher = await connect(t, room, 'teacher', 0, { character: 'tung-tung' });
  const student = await connect(t, room, 'maya', 1, { character: 'pepe' });
  await waitFor(() => teacher.latest().some(peer => peer.id === fixture.users.maya.id && peer.character === 'pepe'));
  for (const character of ['tung-tung', 'le-sunshine', 'mike', 'pepe']) {
    teacher.ws.send(JSON.stringify({ type: 'character', character }));
    await waitFor(() => student.latest().some(peer => peer.id === fixture.users.teacher.id && peer.character === character));
  }
  assert.equal(teacher.closed, undefined); assert.equal(student.closed, undefined);
});

test('teacher removal immediately disconnects a student across servers and prevents code reentry', async t => {
  const room = await world(); await join(room, 'maya'); await join(room, 'alex');
  const maya = await connect(t, room, 'maya', 1), alex = await connect(t, room, 'alex');
  assert.equal((await act(room, 'alex', 'remove', { playerId: fixture.users.maya.id })).status, 403);
  assert.equal((await act(room, 'teacher', 'remove', { playerId: fixture.users.maya.id })).status, 200);
  await waitFor(() => maya.closed); assert.equal(maya.closed, 4003);
  assert.equal((await join(room, 'maya')).status, 403);
  assert.equal((await call(`/${room.id}`, 'maya')).status, 403);
  await waitFor(() => !alex.latest().some(peer => peer.id === fixture.users.maya.id));
  const result = await act(room, 'teacher', 'finish'); assert.equal(result.status, 200); assert.ok(result.data.room.closedAt);
  await waitFor(() => alex.closed); assert.equal(alex.closed, 4003);
  assert.equal((await join(room, 'jordan')).status, 410);
  assert.equal((await call(`/${room.id}`)).status, 410);
  assert.equal((await call('/', 'teacher')).data.rooms.some(item => item.id === room.id), false);
});

test('only the host can add one separate test buddy, with independent identity and movement across servers', async t => {
  const room = await world(); await join(room, 'maya'); await join(room, 'alex');
  const teacher = await connect(t, room, 'teacher'), student = await connect(t, room, 'maya', 1);
  const denied = await connect(t, room, 'maya', 0, { testCharacter: true, testOwnerId: fixture.users.teacher.id });
  assert.equal(denied.closed, 4003);
  const staff = await connect(t, room, 'staff', 0, { testCharacter: true });
  assert.equal(staff.closed, 4003);
  const buddy = await connect(t, room, 'teacher', 1, { testCharacter: true, id: fixture.users.maya.id, name: 'Spoof', testOwnerId: fixture.users.maya.id });
  const buddyId = `test:${fixture.users.teacher.id}`;
  assert.equal(buddy.messages.find(message => message.type === 'ready').selfId, buddyId);
  await waitFor(() => teacher.latest().some(peer => peer.id === buddyId));
  const presence = teacher.latest().find(peer => peer.id === buddyId);
  assert.equal(presence.name, 'Test buddy'); assert.equal(presence.testOwnerId, fixture.users.teacher.id);
  assert.equal(presence.pose.x, 3); assert.equal(teacher.closed, undefined); assert.equal(student.closed, undefined);
  teacher.ws.send(JSON.stringify({ type: 'move', pose: { x: -3, y: 0, z: 6, rotation: 0, moving: true } }));
  buddy.ws.send(JSON.stringify({ type: 'move', pose: { x: 5, y: 0, z: 6, rotation: 0, moving: true } }));
  buddy.ws.send(JSON.stringify({ type: 'move', pose: { x: 5, y: 0, z: 6, rotation: 0, moving: false } }));
  buddy.ws.send(JSON.stringify({ type: 'character', character: 'duck' }));
  await waitFor(() => student.latest().some(peer => peer.id === buddyId && peer.pose.x === 5 && !peer.pose.moving && peer.character === 'duck')
    && student.latest().some(peer => peer.id === fixture.users.teacher.id && peer.pose.x === -3));
  assert.equal((await call(`/${room.id}`)).data.room.players.length, 2, 'Test avatars must not create student membership');
  const secondBuddy = await connect(t, room, 'teacher', 0, { testCharacter: true });
  await waitFor(() => buddy.closed); assert.equal(buddy.closed, 4009); assert.equal(teacher.closed, undefined);
  await waitFor(() => student.latest().filter(peer => peer.id === buddyId).length === 1);
  assert.equal((await act(room, 'teacher', 'remove', { playerId: fixture.users.alex.id })).status, 200);
  await new Promise(resolve => setTimeout(resolve, 120));
  assert.equal(secondBuddy.closed, undefined, 'Membership reconciliation must keep the host-owned test buddy');
  secondBuddy.ws.close(); await waitFor(() => !student.latest().some(peer => peer.id === buddyId));
  const finalBuddy = await connect(t, room, 'teacher', 1, { testCharacter: true });
  assert.equal((await act(room, 'teacher', 'finish')).status, 200);
  await waitFor(() => finalBuddy.closed && teacher.closed && student.closed);
  assert.equal(finalBuddy.closed, 4003);
});

test('explicit cancellation, movement and jumping clear an emote for remote players while idle updates retain it', async t => {
  const room = await world(); await join(room, 'maya');
  const teacher = await connect(t, room, 'teacher'), student = await connect(t, room, 'maya', 1);
  const id = fixture.users.teacher.id, pose = { x: 0, y: 0, z: 6, rotation: 0, moving: false };
  const remote = () => student.latest().find(peer => peer.id === id);
  teacher.ws.send(JSON.stringify({ type: 'emote', emote: 'wave' }));
  await waitFor(() => remote()?.emote === 'wave');
  const messageCount = student.messages.length;
  teacher.ws.send(JSON.stringify({ type: 'move', pose }));
  await waitFor(() => student.messages.length > messageCount);
  assert.equal(remote().emote, 'wave');
  teacher.ws.send(JSON.stringify({ type: 'emote', emote: null }));
  await waitFor(() => remote() && remote().emote === undefined);
  assert.equal(remote().emoteAt, undefined); assert.equal(teacher.closed, undefined);
  await new Promise(resolve => setTimeout(resolve, 710));
  teacher.ws.send(JSON.stringify({ type: 'emote', emote: 'dance' }));
  await waitFor(() => remote()?.emote === 'dance');
  teacher.ws.send(JSON.stringify({ type: 'move', pose: { ...pose, x: 1, moving: true } }));
  await waitFor(() => remote()?.pose.x === 1 && remote().emote === undefined);
  assert.equal(remote().emoteAt, undefined);
  await new Promise(resolve => setTimeout(resolve, 710));
  teacher.ws.send(JSON.stringify({ type: 'emote', emote: 'cheer' }));
  await waitFor(() => remote()?.emote === 'cheer');
  teacher.ws.send(JSON.stringify({ type: 'move', pose: { ...pose, y: .5 } }));
  await waitFor(() => remote()?.pose.y === .5 && remote().emote === undefined);
  assert.equal(remote().emoteAt, undefined);
});

test('duplicate tabs replace a single avatar and world input rejects out-of-bounds and non-finite poses', async t => {
  const pose = { x: 0, y: 0, z: 6, rotation: 0, moving: false };
  assert.deepEqual(parseWorldPose(pose), pose);
  for (const invalid of [null, {}, { ...pose, x: NaN }, { ...pose, y: Infinity }, { ...pose, z: 24 }, { ...pose, y: -1 }, { ...pose, moving: 'yes' }]) assert.throws(() => parseWorldPose(invalid));
  const room = await world(); await join(room, 'maya'); await join(room, 'alex');
  const first = await connect(t, room, 'maya'), watcher = await connect(t, room, 'alex');
  const second = await connect(t, room, 'maya', 1);
  await waitFor(() => first.closed); assert.equal(first.closed, 4009);
  await waitFor(() => watcher.latest().filter(peer => peer.id === fixture.users.maya.id).length === 1);
  second.ws.send(JSON.stringify({ type: 'move', pose: { ...pose, x: 99 } }));
  await waitFor(() => second.closed); assert.equal(second.closed, 1008);
});

test('an HTTP-only instance broadcasts removal and closure to a socket instance without a shared lifecycle emitter', async t => {
  const room = await world(); await join(room, 'maya'); await join(room, 'alex');
  // Both sockets are on instance 1. The action goes to instance 0, which has no hub.
  const maya = await connect(t, room, 'maya', 1), alex = await connect(t, room, 'alex', 1);
  const socketListener = worldRoomEvents.listeners('room')[1];
  assert.ok(socketListener);
  worldRoomEvents.off('room', socketListener);
  const originalChannel = supabase.channel, originalRemove = supabase.removeChannel;
  const temporary = new Set(), removed = new Set();
  supabase.channel = function (...args) { const channel = originalChannel.apply(this, args); temporary.add(channel); return channel; };
  supabase.removeChannel = async function (channel) { removed.add(channel); return originalRemove.call(this, channel); };
  try {
    assert.equal((await act(room, 'teacher', 'remove', { playerId: fixture.users.maya.id })).status, 200);
    await waitFor(() => maya.closed); assert.equal(maya.closed, 4003);
    assert.equal(alex.closed, undefined);
    assert.equal((await act(room, 'teacher', 'finish')).status, 200);
    await waitFor(() => alex.closed); assert.equal(alex.closed, 4003);
    await waitFor(() => temporary.size >= 2 && [...temporary].every(channel => removed.has(channel)));
  } finally {
    worldRoomEvents.on('room', socketListener);
    supabase.channel = originalChannel; supabase.removeChannel = originalRemove;
  }
});

test('temporary identity and subscription failures close with retryable codes and clean up failed hubs', async t => {
  const room = await world(); await join(room, 'maya');
  const originalUser = supabase.auth.getUser;
  try {
    supabase.auth.getUser = async () => ({ data: { user: null }, error: { status: 503, name: 'AuthRetryableFetchError' } });
    const unavailable = await connect(t, room, 'maya'); assert.equal(unavailable.closed, 1013);
  } finally { supabase.auth.getUser = originalUser; }
  const originalChannel = supabase.channel, originalRemove = supabase.removeChannel;
  const created = new Set(), removed = new Set();
  supabase.channel = function (...args) {
    const channel = originalChannel.apply(this, args), subscribe = channel.subscribe;
    channel.subscribe = function (callback) { return subscribe.call(this, () => callback('CHANNEL_ERROR')); };
    created.add(channel); return channel;
  };
  supabase.removeChannel = async function (channel) { removed.add(channel); return originalRemove.call(this, channel); };
  try {
    const unavailable = await connect(t, room, 'maya'); assert.equal(unavailable.closed, 1013);
    await waitFor(() => created.size > 0 && [...created].every(channel => removed.has(channel)));
  } finally { supabase.channel = originalChannel; supabase.removeChannel = originalRemove; }
  const restored = await connect(t, room, 'maya'); assert.ok(restored.messages.some(message => message.type === 'ready'));
});

test('a database fetch rejected by a connection reset remains retryable and a later join succeeds', async t => {
  const room = await world(); await join(room, 'maya');
  const originalFrom = supabase.from;
  supabase.from = function (...args) {
    const query = originalFrom.apply(this, args);
    query.then = (_resolve, reject) => reject(new TypeError('fetch failed', { cause: Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' }) }));
    return query;
  };
  try {
    const unavailable = await connect(t, room, 'maya');
    assert.equal(unavailable.closed, 1013);
  } finally { supabase.from = originalFrom; }
  const restored = await connect(t, room, 'maya');
  assert.ok(restored.messages.some(message => message.type === 'ready'));
});

test('slow verification does not become a permanent sign-in failure and eventually allows retry', async t => {
  const room = await world(); await join(room, 'maya');
  const originalUser = supabase.auth.getUser, verifiedUser = await originalUser('maya');
  let started, complete;
  const authenticating = new Promise(resolve => { started = resolve; });
  const verification = new Promise(resolve => { complete = resolve; });
  supabase.auth.getUser = async () => { started(); return verification; };
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const ws = new WebSocket(roots[0].replace('http:', 'ws:') + '/world');
  t.after(() => ws.terminate());
  try {
    await once(ws, 'open');
    const closed = once(ws, 'close');
    ws.send(JSON.stringify({ type: 'join', token: 'maya', roomId: room.id, character: 'frog' }));
    await authenticating;
    t.mock.timers.tick(15000);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(ws.readyState, WebSocket.OPEN, 'A supplied join must not hit the missing sign-in deadline');
    t.mock.timers.tick(15000);
    assert.equal((await closed)[0], 1013, 'An upstream timeout must allow the client to reconnect');
  } finally {
    t.mock.timers.reset(); supabase.auth.getUser = originalUser; complete(verifiedUser);
  }
  const restored = await connect(t, room, 'maya');
  assert.ok(restored.messages.some(message => message.type === 'ready'));
});
