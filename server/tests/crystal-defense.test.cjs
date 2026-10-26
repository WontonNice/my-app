const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const fixture = require('./helpers/game-fixture.cjs');
const { mutateCrystal, tickCrystal, crystalHostId } = require('../src/lib/crystalDefense.ts');
const { gameView } = require('../src/lib/gameEngine.ts');
const { CRYSTAL_ANIMATION_RETENTION_MS, CRYSTAL_INTERMISSION_MS, CRYSTAL_OFFLINE_MS, CRYSTAL_PICKUP_DISTANCE, CRYSTAL_REINFORCEMENT_MS, crystalSpeedMultiplier, crystalTravelMs, crystalWaveSize } = require('../src/shared/crystalDefense.ts');
let server, root;
before(async () => {
  const app = require('express')(); app.use(require('express').json()); app.use('/api/game-rooms', fixture.router);
  server = app.listen(0, '127.0.0.1'); await once(server, 'listening'); root = `http://127.0.0.1:${server.address().port}/api/game-rooms`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });
const actor = token => ({ id: fixture.users[token].id, name: fixture.users[token].user_metadata.full_name, teacher: token === 'teacher' });
async function call(path, token = 'teacher', method = 'GET', body) {
  const response = await fetch(root + path, { method, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
const act = (room, token, action, body = {}) => {
  // Capture the currently observed token before starting the HTTP request. Two
  // concurrent submissions must keep the same token, even after one commits.
  const attemptId = ['crystal-answer', 'crystal-release'].includes(action) ? gameView(rawRoom(room), actor(token), Date.now()).crystal?.challenges.find(challenge => challenge.monsterId === body.monsterId)?.attemptId : undefined;
  return call(`/${room.id}/action`, token, 'POST', { action, runId: room.crystal?.runId, attemptId, ...body });
};
async function configured(tokens = ['maya', 'jordan'], poolSize = 6, waves = 5, playtest = true) {
  let result = await call('/', 'teacher', 'POST', { mode: 'world' }); assert.equal(result.status, 201);
  let room = result.data.room;
  for (const token of tokens.filter(token => token !== 'teacher')) assert.equal((await call('/join', token, 'POST', { code: room.code })).status, 200);
  result = await act(room, tokens[0], 'crystal-join'); assert.equal(result.status, 200); room = result.data.room;
  result = await act(room, tokens[0], 'crystal-configure', { source: { kind: 'exam-math', assessmentId: 'qa-team-test' }, waves }); assert.equal(result.status, 200, JSON.stringify(result.data)); room = result.data.room;
  if (playtest) assert.equal((await act(room, "teacher", "crystal-teacher-mode", { mode: "playtest" })).status, 200);
  const raw = fixture.rows.find(row => row.id === room.id).payload;
  if (poolSize !== 6) { raw.crystal.questions = Array.from({ length: poolSize }, (_, index) => ({ subject: 'Math', question: { ...fixture.questions[index % fixture.questions.length], id: `unique-${index}` } })); delete raw.crystal.questionDeck; raw.crystal.deckPosition = 0; }
  for (const token of tokens) {
    assert.equal((await act(room, token, 'crystal-join')).status, 200);
    assert.equal((await act(room, token, 'crystal-ready', { ready: true })).status, 200);
  }
  room = (await call(`/${room.id}`)).data.room;
  return room;
}
async function started(tokens, poolSize, waves) { const room = await configured(tokens, poolSize, waves); const token = Object.keys(fixture.users).find(token => actor(token).id === room.crystal.hostId); const result = await act(room, token, 'crystal-start'); assert.equal(result.status, 200, JSON.stringify(result.data)); return result.data.room; }
const rawRoom = room => fixture.rows.find(row => row.id === room.id).payload;
function direct(room, token, action, body, now) {
  const attemptId = ['crystal-answer', 'crystal-release'].includes(action) ? gameView(room, actor(token), now).crystal?.challenges.find(challenge => challenge.monsterId === body.monsterId)?.attemptId : undefined;
  mutateCrystal(room, actor(token), action, { runId: room.crystal.runId, attemptId, ...body }, now);
}
function solveAll(room, now, token = 'maya') {
  for (const monster of [...room.crystal.monsters]) {
    if (monster.status !== 'active') continue;
    direct(room, token, 'crystal-claim', { monsterId: monster.id }, now);
    direct(room, token, 'crystal-answer', { monsterId: monster.id, answer: 'A' }, now);
  }
}
async function retryChallenge() {
  const room = await started(), item = rawRoom(room).crystal.items.find(item => item.ownerId === actor('maya').id); item.kind = 'retry';
  assert.equal((await act(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z })).status, 200);
  const monsterId = room.crystal.monsters[0].id, claimed = await act(room, 'maya', 'crystal-claim', { monsterId }); assert.equal(claimed.status, 200);
  return { room: claimed.data.room, monsterId, attemptId: claimed.data.room.crystal.challenges[0].attemptId };
}

async function infiniteRoom() {
  let view = await configured();
  const response = await act(view, 'maya', 'crystal-configure', { source: { kind: 'infinite-math', moduleId: 'all', topic: 'Algebra', subtopic: 'Inequalities' } });
  assert.equal(response.status, 200, JSON.stringify(response.data)); view = response.data.room;
  for (const token of ['maya', 'jordan']) assert.equal((await act(view, token, 'crystal-ready', { ready: true })).status, 200);
  const started = await act(view, 'maya', 'crystal-start'); assert.equal(started.status, 200);
  return rawRoom(started.data.room);
}
function solveGenerated(room, monster, now, token = 'maya') {
  const answer = room.crystal.questions[monster.questionIndex].question.correctChoiceId;
  direct(room, token, 'crystal-claim', { monsterId: monster.id }, now);
  direct(room, token, 'crystal-answer', { monsterId: monster.id, answer }, now);
}

test('infinite math generates distinct encounters across endless waves with bounded question storage', async () => {
  const room = await infiniteRoom(), seen = new Set(); let now = Date.now(), solved = 0;
  for (let wave = 1; wave <= 15; wave++) {
    assert.equal(room.crystal.wave, wave); assert.equal(room.crystal.phase, 'battle');
    const monsters = [...room.crystal.monsters];
    assert.equal(monsters.length, crystalWaveSize(2, wave));
    assert.equal(new Set(monsters.map(item => item.questionIndex)).size, monsters.length);
    for (const monster of monsters) {
      const question = room.crystal.questions[monster.questionIndex].question;
      assert.equal(seen.has(question.id), false); seen.add(question.id);
      solveGenerated(room, monster, now); solved++;
    }
    assert.equal(room.crystal.phase, 'intermission');
    assert.equal(room.crystal.questions.length, monsters.length, 'old wave slots are reused');
    now += CRYSTAL_INTERMISSION_MS;
    for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now);
  }
  assert.equal(room.crystal.hearts, 5); assert.equal(gameView(room, actor('maya'), now).crystal.totalPoints, solved * 100);
  assert.doesNotMatch(JSON.stringify(gameView(room, actor('maya'), now)), /correctChoiceId|"questions":|explanation/);
});

test('generated questions survive retries and teammate rescues while reinforcements reuse only free slots', async () => {
  const room = await infiniteRoom(); let now = Date.now();
  const [target, ...initial] = room.crystal.monsters;
  const original = structuredClone(room.crystal.questions[target.questionIndex]);
  const wrong = original.question.choices.find(choice => choice.id !== original.question.correctChoiceId).id;
  room.crystal.participants.find(player => player.id === actor('maya').id).retryReady = true;
  direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now);
  const first = gameView(room, actor('maya'), now).crystal.challenges[0];
  direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: wrong }, now);
  const retry = gameView(room, actor('maya'), now).crystal.challenges[0];
  assert.deepEqual(retry.question, first.question); assert.notEqual(retry.attemptId, first.attemptId);
  direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: wrong }, now);
  direct(room, 'jordan', 'crystal-claim', { monsterId: target.id }, now);
  assert.deepEqual(gameView(room, actor('jordan'), now).crystal.challenges[0].question, first.question);
  for (const monster of initial) solveGenerated(room, monster, now);
  const seen = new Set(room.crystal.questions.map(item => item.question.id));
  for (let cycle = 0; cycle < 30; cycle++) {
    now += CRYSTAL_REINFORCEMENT_MS;
    for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now);
    const fresh = room.crystal.monsters.find(monster => monster.status === 'active'); assert.ok(fresh);
    const question = room.crystal.questions[fresh.questionIndex];
    assert.equal(seen.has(question.question.id), false); seen.add(question.question.id);
    solveGenerated(room, fresh, now);
    assert.deepEqual(room.crystal.questions[target.questionIndex], original);
    assert.ok(room.crystal.questions.length <= 3, 'a long replenishing wave must not accumulate question history');
  }
  direct(room, 'jordan', 'crystal-answer', { monsterId: target.id, answer: original.question.correctChoiceId }, now);
  assert.equal(room.crystal.phase, 'intermission');
  assert.equal(room.crystal.participants.find(player => player.id === actor('jordan').id).score, 100);
  assert.equal(gameView(room, actor('maya'), now).crystal.totalPoints, 3300);
});

test('first student bootstraps and hosts the lobby, chooses sources, and waits for every defender to ready', async () => {
  assert.equal((await call('/crystal-catalog', 'maya')).status, 403);
  assert.equal((await call('/crystal-catalog')).data.infiniteAvailable, true);
  const room = await configured();
  assert.equal(room.phase, 'question'); assert.equal(room.crystal.phase, 'lobby'); assert.equal(room.crystal.questionCount, 6);
  assert.equal(room.crystal.hostId, actor('maya').id); assert.equal(room.crystal.isHost, false);
  assert.equal((await call(`/${room.id}`, 'maya')).data.room.crystal.isHost, true);
  assert.equal((await call(`/crystal-catalog?roomId=${room.id}`, 'maya')).status, 200);
  for (const token of ['jordan', 'outsider']) assert.equal((await call(`/crystal-catalog?roomId=${room.id}`, token)).status, 403);
  assert.equal((await act(room, 'jordan', 'crystal-configure', { source: { kind: 'exam-math' } })).status, 403);
  assert.equal((await act(room, 'teacher', 'crystal-configure', { source: { kind: 'exam-math' } })).status, 403);
  assert.equal((await act(room, 'maya', 'crystal-configure', { source: { kind: 'infinite-math', moduleId: 'missing' } })).status, 400);
  await act(room, 'jordan', 'crystal-ready', { ready: false });
  assert.equal((await act(room, 'maya', 'crystal-start')).status, 409);
  assert.equal((await act(room, 'jordan', 'crystal-start')).status, 403);
  await act(room, 'jordan', 'crystal-ready', { ready: true });
  const started = (await act(room, 'maya', 'crystal-start')).data.room;
  assert.equal(started.crystal.hearts, 5); assert.equal(started.crystal.activePlayers, 2); assert.equal(started.crystal.monsters.length, 3);
  assert.ok(started.crystal.monsters.every(monster => monster.status === 'active'));
  assert.equal((await act(started, 'outsider', 'crystal-join')).status, 403);
});

test('atomic monster claims and answer submissions prevent duplicate scores and hide private question keys', async () => {
  const room = await started(), monsterId = room.crystal.monsters[0].id;
  fixture.conflict(2);
  const attempts = await Promise.all(['maya', 'jordan'].map(token => act(room, token, 'crystal-claim', { monsterId })));
  assert.deepEqual(attempts.map(item => item.status).sort(), [200, 409]);
  const winner = attempts[0].status === 200 ? 'maya' : 'jordan', other = winner === 'maya' ? 'jordan' : 'maya';
  const view = (await call(`/${room.id}`, winner)).data.room;
  assert.equal(view.crystal.challenges.length, 1);
  assert.doesNotMatch(JSON.stringify(view.crystal), /correctChoiceId|explanation|questionIndex|questionDeck|deckPosition|lastQuestionIndex|idleSince|nextMonsterId|"questions":/);
  assert.equal((await call(`/${room.id}`, other)).data.room.crystal.challenges.length, 0);
  const submits = await Promise.all([1, 2].map(() => act(room, winner, 'crystal-answer', { monsterId, answer: 'A' })));
  assert.deepEqual(submits.map(item => item.status).sort(), [200, 409]);
  const final = (await call(`/${room.id}`)).data.room.crystal;
  assert.equal(final.totalPoints, 100); assert.equal(final.participants.find(player => player.id === actor(winner).id).score, 100);
  assert.equal(final.defeated, 1);
});

test('a wrong answer advances only that monster, prevents reattempt, and another student can rescue it', async () => {
  const room = await started(), monsterId = room.crystal.monsters[0].id;
  await act(room, 'maya', 'crystal-claim', { monsterId });
  let response = await act(room, 'maya', 'crystal-answer', { monsterId, answer: 'B' }); assert.equal(response.status, 200);
  let state = response.data.room.crystal;
  assert.equal(state.monsters.find(item => item.id === monsterId).stage, 1); assert.equal(state.hearts, 5);
  assert.equal(state.monsters[1].stage, 0); assert.equal(state.totalPoints, 0);
  assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId })).status, 409);
  assert.equal((await act(room, 'jordan', 'crystal-claim', { monsterId })).status, 200);
  response = await act(room, 'jordan', 'crystal-answer', { monsterId, answer: 'A' }); state = response.data.room.crystal;
  assert.equal(state.monsters.find(item => item.id === monsterId).status, 'defeated'); assert.equal(state.totalPoints, 100);
});

test('endless waves recycle shuffled question decks without changing live question references or growing storage', async () => {
  const view = await started(['maya', 'jordan'], 5, 1), room = rawRoom(view); let now = Date.now();
  const originalQuestions = structuredClone(room.crystal.questions), dealt = [];
  for (let wave = 1; wave <= 35; wave++) {
    assert.equal(room.crystal.wave, wave); assert.equal(room.crystal.phase, 'battle');
    assert.equal(room.crystal.monsters.length, crystalWaveSize(2, wave));
    assert.ok(room.crystal.monsters.length > 2 && room.crystal.monsters.length <= 160);
    assert.ok(room.crystal.monsters.every(monster => monster.status === 'active' && monster.travelMs === crystalTravelMs(wave)));
    dealt.push(...room.crystal.monsters.map(monster => monster.questionIndex));
    solveAll(room, now); assert.equal(room.crystal.phase, 'intermission');
    now += 8001; for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now);
  }
  for (let start = 0; start + 5 <= dealt.length; start += 5) {
    assert.equal(new Set(dealt.slice(start, start + 5)).size, 5);
    if (start) assert.notEqual(dealt[start - 1], dealt[start]);
  }
  assert.deepEqual(room.crystal.questions, originalQuestions);
  assert.equal(room.crystal.questionDeck.length, 5); assert.equal(room.crystal.hearts, 5);
  assert.equal(room.crystal.participants.find(player => player.id === actor('maya').id).score, dealt.length * 100);
  assert.equal(room.crystal.config.waves, undefined); assert.equal(room.crystal.wave, 36);
  assert.equal(crystalTravelMs(1), 150000); assert.equal(crystalTravelMs(3), 130000); assert.equal(crystalTravelMs(100000), 100000);
  assert.equal(crystalWaveSize(32, 100000), 160); assert.equal(crystalWaveSize(1, 1), 2);
});

test('unclaimed monsters keep walking while a challenge freezes for minutes; wrong answers resume in place', async () => {
  const view = await started(), room = rawRoom(view); let now = Date.now(); const [monster, walking] = room.crystal.monsters;
  now += 15000; direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now);
  const frozen = monster.progress;
  assert.ok(frozen > 0);
  for (let step = 0; step < 8; step++) { now += 15000; for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now); }
  assert.equal(monster.status, 'challenged'); assert.equal(monster.progress, frozen); assert.equal(monster.moving, false);
  assert.ok(walking.progress > .4); assert.equal(room.crystal.hearts, 5);
  direct(room, 'maya', 'crystal-answer', { monsterId: monster.id, answer: 'B' }, now);
  assert.equal(monster.progress, frozen); assert.equal(monster.status, 'active'); assert.equal(monster.moving, true);
  assert.equal(room.crystal.hearts, 5); assert.equal(monster.travelMs, crystalTravelMs(1));
  assert.throws(() => direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now), error => error.status === 409);
  now += 15000; direct(room, 'jordan', 'crystal-claim', { monsterId: monster.id }, now);
  assert.ok(monster.progress > frozen); const secondFreeze = monster.progress;
  direct(room, 'jordan', 'crystal-answer', { monsterId: monster.id, answer: 'B' }, now + 1000);
  assert.equal(monster.progress, secondFreeze); assert.equal(monster.status, 'active');
});

test('everyone-failed monsters remain on the field and only damage the crystal on physical arrival', async () => {
  const view = await started(), room = rawRoom(view); let now = Date.now(); const monster = room.crystal.monsters[0];
  for (const token of ['maya', 'jordan']) { direct(room, token, 'crystal-claim', { monsterId: monster.id }, now); direct(room, token, 'crystal-answer', { monsterId: monster.id, answer: 'B' }, now); }
  assert.equal(monster.status, 'active'); assert.equal(monster.failedIds.length, 2); assert.equal(room.crystal.hearts, 5);
  monster.stage = 50; tickCrystal(room, now + 1000); assert.equal(monster.status, 'active'); assert.equal(room.crystal.hearts, 5);
  monster.progress = .999; monster.lastMovedAt = now; now += 1000;
  tickCrystal(room, now); assert.equal(monster.status, 'breached'); assert.equal(monster.progress, 1); assert.equal(room.crystal.hearts, 4);
  tickCrystal(room, now + 1); assert.equal(room.crystal.hearts, 4); assert.equal(room.crystal.breached, 1);
  assert.equal(room.crystal.retreated, 0);
});

test('disconnects release claims, slow remaining defenders, and pause all motion during a fully offline gap', async () => {
  const view = await started(), room = rawRoom(view); let now = Date.now(); const [monster, walking] = room.crystal.monsters;
  direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now);
  direct(room, 'jordan', 'crystal-leave', {}, now);
  assert.equal(walking.travelMs, 600000); assert.equal(room.crystal.monsters.length, 3);
  now += CRYSTAL_OFFLINE_MS + 1; tickCrystal(room, now);
  assert.equal(monster.status, 'active'); assert.equal(monster.claimedBy, undefined); assert.equal(monster.moving, false);
  const paused = room.crystal.monsters.map(item => item.progress);
  tickCrystal(room, now + 3600000); assert.deepEqual(room.crystal.monsters.map(item => item.progress), paused);
  assert.equal(gameView(room, actor('maya'), now).crystal.movementPaused, true);
  direct(room, 'maya', 'crystal-heartbeat', {}, now + 3600001);
  assert.deepEqual(room.crystal.monsters.map(item => item.progress), paused); assert.equal(monster.moving, false);
  assert.equal(monster.status, 'challenged'); assert.equal(monster.claimedBy, actor('maya').id);
  assert.equal(room.crystal.hearts, 5); assert.equal(room.crystal.retreated, 0);
});

test('five arriving monsters defeat the crystal, solo wrong answers do not, and stale runs cannot answer', async () => {
  const view = await started(['maya'], 2, 1), room = rawRoom(view); let now = Date.now();
  for (let lost = 0; lost < 5; lost++) {
    if (room.crystal.phase === 'intermission') { now += 8001; direct(room, 'maya', 'crystal-heartbeat', {}, now); }
    const target = room.crystal.monsters.find(item => item.status === 'active'); assert.ok(target);
    direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now);
    direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: 'B' }, now);
    assert.equal(room.crystal.hearts, 5 - lost); assert.equal(target.status, 'active');
    target.progress = .999; target.lastMovedAt = now; now += 1000; tickCrystal(room, now);
    assert.equal(room.crystal.hearts, 4 - lost);
    assert.throws(() => direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: 'A' }, now), error => error.status === 409);
  }
  assert.equal(room.crystal.phase, 'defeat'); assert.equal(room.crystal.participants[0].score, 0);
  const oldRun = room.crystal.runId; direct(room, 'maya', 'crystal-reset', {}, now);
  assert.equal(room.crystal.phase, 'lobby'); assert.equal(room.crystal.hearts, 5); assert.notEqual(room.crystal.runId, oldRun);
  assert.throws(() => mutateCrystal(room, actor('maya'), 'crystal-ready', { runId: oldRun, ready: true }, now), error => error.status === 409);
});

test('teacher test buddy is a separate authenticated defender and world removal also removes a defender', async () => {
  const room = await configured(['teacher', 'maya']);
  assert.equal((await act(room, 'maya', 'crystal-join', { asTestBuddy: true })).status, 403);
  const joined = await act(room, 'teacher', 'crystal-join', { asTestBuddy: true, playerId: actor('maya').id }); assert.equal(joined.status, 200);
  const buddy = joined.data.room.crystal.participants.find(player => player.id === `test:${actor('teacher').id}`); assert.ok(buddy); assert.equal(buddy.name, 'Test buddy');
  await act(room, 'teacher', 'crystal-ready', { asTestBuddy: true, ready: true });
  const started = (await act(room, 'teacher', 'crystal-start')).data.room;
  const target = started.crystal.monsters[0]; await act(room, 'teacher', 'crystal-claim', { asTestBuddy: true, monsterId: target.id });
  const hostView = (await call(`/${room.id}`)).data.room;
  assert.equal(hostView.crystal.challenges[0].playerId, buddy.id); assert.equal((await call(`/${room.id}`, 'maya')).data.room.crystal.challenges.length, 0);
  await act(room, 'teacher', 'crystal-answer', { asTestBuddy: true, monsterId: target.id, answer: 'A' });
  const removed = await act(room, 'teacher', 'remove', { playerId: actor('maya').id });
  assert.equal(removed.status, 200); assert.equal(removed.data.room.crystal.participants.find(player => player.id === actor('maya').id).left, true);
  assert.equal(removed.data.room.crystal.participants.find(player => player.id === buddy.id).score, 100); assert.equal(removed.data.room.players.some(player => player.id === buddy.id), false);
});

test('nested answer keys are stripped from an active challenge', async () => {
  const view = await started(['maya']), room = rawRoom(view), now = Date.now(), target = room.crystal.monsters[0];
  room.crystal.questions[target.questionIndex].question = { id: 'dropdown', type: 'dropdown', topic: 'Algebra', prompt: 'Choose.', dropdowns: [{ id: 'slot', correctChoiceId: 'A', choices: [{ id: 'A', text: '12' }], explanation: 'private nested key' }], correctTextAnswers: ['12'], explanation: 'private top key' };
  direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now);
  const publicView = gameView(room, actor('maya'), now);
  assert.equal(publicView.crystal.challenges.length, 1); assert.doesNotMatch(JSON.stringify(publicView), /correctChoiceId|correctTextAnswers|private nested|private top/);
});

test('losing the final heart dismisses every active question so students can see the result', async () => {
  const view = await started(), room = rawRoom(view), now = Date.now(), [fatal, studying] = room.crystal.monsters;
  direct(room, 'maya', 'crystal-claim', { monsterId: fatal.id }, now);
  direct(room, 'jordan', 'crystal-claim', { monsterId: studying.id }, now);
  assert.equal(gameView(room, actor('jordan'), now).crystal.challenges.length, 1);
  room.crystal.hearts = 1; fatal.progress = .999;
  direct(room, 'maya', 'crystal-answer', { monsterId: fatal.id, answer: 'B' }, now);
  assert.equal(room.crystal.hearts, 1); tickCrystal(room, now + 1000);
  assert.equal(room.crystal.phase, 'defeat'); assert.equal(room.crystal.hearts, 0);
  for (const token of ['maya', 'jordan', 'teacher']) assert.deepEqual(gameView(room, actor(token), now).crystal.challenges, []);
});

test('concurrent first joins elect one student host and an empty lobby cannot start', async () => {
  const created = await call('/', 'teacher', 'POST', { mode: 'world' }), room = created.data.room;
  for (const token of ['maya', 'jordan']) await call('/join', token, 'POST', { code: room.code });
  fixture.conflict(2);
  const joined = await Promise.all(['maya', 'jordan'].map(token => act(room, token, 'crystal-join')));
  assert.deepEqual(joined.map(item => item.status), [200, 200]);
  const latest = (await call(`/${room.id}`, 'maya')).data.room;
  const first = latest.crystal.participants[0].id, hostToken = ['maya', 'jordan'].find(token => actor(token).id === first);
  assert.equal(latest.crystal.hostId, first); assert.equal(latest.crystal.participants.length, 2); assert.equal(latest.crystal.questionCount, 0);
  assert.equal((await act(latest, hostToken, 'crystal-start')).status, 409);
  assert.equal((await act(latest, hostToken, 'crystal-ready', { ready: true })).status, 409);
  assert.equal((await act(latest, hostToken, 'crystal-configure', { source: { kind: 'exam-math' } })).status, 200);
});

test('teacher arrival takes host priority; departures, offline expiry, and rejoining hand off fairly', async () => {
  const view = await configured(), room = rawRoom(view); let now = Date.now();
  assert.equal(crystalHostId(room, now), actor('maya').id);
  direct(room, 'teacher', 'crystal-join', {}, now); assert.equal(crystalHostId(room, now), actor('teacher').id);
  direct(room, 'teacher', 'crystal-join', { asTestBuddy: true }, now);
  direct(room, 'teacher', 'crystal-leave', {}, now); assert.equal(crystalHostId(room, now), actor('maya').id);
  direct(room, 'maya', 'crystal-leave', {}, now); assert.equal(crystalHostId(room, now), actor('jordan').id);
  direct(room, 'maya', 'crystal-join', {}, now); assert.equal(crystalHostId(room, now), actor('jordan').id);
  now += CRYSTAL_OFFLINE_MS + 1; direct(room, 'maya', 'crystal-heartbeat', {}, now);
  assert.equal(crystalHostId(room, now), actor('maya').id);
  direct(room, 'jordan', 'crystal-heartbeat', {}, now); assert.equal(crystalHostId(room, now), actor('maya').id);
  direct(room, 'teacher', 'crystal-join', {}, now); assert.equal(crystalHostId(room, now), actor('teacher').id);
  now += CRYSTAL_OFFLINE_MS - 1; direct(room, 'maya', 'crystal-heartbeat', {}, now);
  now += 2; tickCrystal(room, now); assert.equal(crystalHostId(room, now), actor('maya').id);
  assert.throws(() => direct(room, 'teacher', 'crystal-end', {}, now), error => error.status === 403);
  direct(room, 'teacher', 'crystal-join', {}, now); assert.equal(crystalHostId(room, now), actor('teacher').id);
  for (const token of ['teacher', 'maya', 'jordan']) direct(room, token, 'crystal-leave', {}, now);
  direct(room, 'teacher', 'crystal-heartbeat', { asTestBuddy: true }, now);
  assert.equal(crystalHostId(room, now), null);
  assert.equal(room.hostId, actor('teacher').id);
});

test('teacher can enter an ongoing battle to host without giving student hosts room moderation', async () => {
  const room = await started();
  for (const action of ['finish', 'remove']) assert.equal((await act(room, 'maya', action, { playerId: actor('jordan').id })).status, 403);
  assert.equal((await call(`/${room.id}`, 'maya', 'DELETE')).status, 403);
  assert.equal((await act(room, 'maya', 'crystal-join', { asTestBuddy: true })).status, 403);
  assert.equal((await act(room, 'teacher', 'crystal-end')).status, 403);
  const joined = await act(room, 'teacher', 'crystal-join'); assert.equal(joined.status, 200);
  assert.equal(joined.data.room.crystal.hostId, actor('teacher').id); assert.equal(joined.data.room.crystal.isHost, true);
  assert.equal((await act(room, 'maya', 'crystal-end')).status, 403);
  assert.equal((await act(room, 'teacher', 'crystal-end')).status, 200);
});

test('walking read projections avoid durable revisions and arrivals win races against claims', async () => {
  const room = await started(), raw = rawRoom(room), target = raw.crystal.monsters[0], now = Date.now();
  for (const monster of raw.crystal.monsters) monster.lastMovedAt = now - 1000;
  const revision = raw.revision, before = target.progress;
  const response = await call(`/${room.id}`, 'maya'); assert.equal(response.status, 200);
  assert.equal(rawRoom(room).revision, revision); assert.ok(response.data.room.crystal.monsters[0].progress > before);
  assert.equal(tickCrystal(raw, now + 1000), false);
  target.progress = .999; target.lastMovedAt = now;
  assert.throws(() => direct(raw, 'maya', 'crystal-claim', { monsterId: target.id }, now + 1000), error => error.status === 409);
  assert.equal(target.status, 'breached'); assert.equal(raw.crystal.hearts, 4);
});

test('legacy finite victories resume endless waves and legacy queued encounters become walking monsters', async () => {
  const view = await started(['maya'], 2, 1), room = rawRoom(view), now = Date.now();
  solveAll(room, now); room.crystal.phase = 'victory'; room.crystal.config.waves = 1;
  delete room.crystal.questionDeck; delete room.crystal.deckPosition;
  tickCrystal(room, now); assert.equal(room.crystal.phase, 'intermission');
  tickCrystal(room, now + 8001); assert.equal(room.crystal.phase, 'battle'); assert.equal(room.crystal.wave, 2);
  const monster = room.crystal.monsters[0]; monster.status = 'queued'; delete monster.progress; delete monster.lastMovedAt; delete monster.travelMs; delete monster.moving;
  tickCrystal(room, now + 8002); assert.equal(monster.status, 'active'); assert.equal(monster.progress, 0); assert.equal(monster.moving, true);
});

test('a single-question source supports endless encounters with fresh retry locks and unique monster scores', async () => {
  const view = await started(['maya', 'jordan'], 1), room = rawRoom(view); let now = Date.now();
  const first = room.crystal.monsters[0];
  direct(room, 'maya', 'crystal-claim', { monsterId: first.id }, now);
  direct(room, 'maya', 'crystal-answer', { monsterId: first.id, answer: 'B' }, now);
  direct(room, 'jordan', 'crystal-claim', { monsterId: first.id }, now);
  direct(room, 'jordan', 'crystal-answer', { monsterId: first.id, answer: 'A' }, now);
  solveAll(room, now); now += 8001; tickCrystal(room, now);
  assert.equal(room.crystal.wave, 2); assert.ok(room.crystal.monsters.every(monster => monster.questionIndex === 0 && monster.failedIds.length === 0 && monster.id !== first.id));
  solveAll(room, now); assert.equal(room.crystal.phase, 'intermission'); assert.equal(room.crystal.defeated, 7);
  assert.equal(gameView(room, actor('maya'), now).crystal.totalPoints, 700);
});

test('a solo defender receives one fresh monster after twelve seconds without an eligible target', async () => {
  const view = await started(['maya']), room = rawRoom(view), now = Date.now(), old = [...room.crystal.monsters];
  for (const monster of old) {
    direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now);
    direct(room, 'maya', 'crystal-answer', { monsterId: monster.id, answer: 'B' }, now);
  }
  assert.equal(room.crystal.idleSince[actor('maya').id], now);
  assert.equal(tickCrystal(room, now + CRYSTAL_REINFORCEMENT_MS - 1), false);
  assert.equal(room.crystal.monsters.length, 2); assert.equal(room.crystal.idleSince[actor('maya').id], now);
  assert.equal(tickCrystal(room, now + CRYSTAL_REINFORCEMENT_MS), true);
  const fresh = room.crystal.monsters.at(-1);
  assert.equal(room.crystal.monsters.length, 3); assert.equal(fresh.status, 'active'); assert.deepEqual(fresh.failedIds, []);
  assert.equal(fresh.progress, 0); assert.equal(room.crystal.hearts, 5); assert.deepEqual(room.crystal.idleSince, {});
  assert.ok(old.every(monster => monster.status === 'active' && monster.progress > 0));
  assert.equal(tickCrystal(room, now + CRYSTAL_REINFORCEMENT_MS + 1000), false); assert.equal(room.crystal.monsters.length, 3);
  direct(room, 'maya', 'crystal-claim', { monsterId: fresh.id }, now + CRYSTAL_REINFORCEMENT_MS + 1000);
  assert.equal(fresh.status, 'challenged');
});

test('idle defenders get fresh work while teammates solve and old failed monsters keep walking', async () => {
  const view = await started(), room = rawRoom(view), now = Date.now(), [studying, ...others] = room.crystal.monsters;
  direct(room, 'jordan', 'crystal-claim', { monsterId: studying.id }, now);
  const frozenProgress = studying.progress;
  for (const monster of others) {
    direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now);
    direct(room, 'maya', 'crystal-answer', { monsterId: monster.id, answer: 'B' }, now);
  }
  assert.deepEqual(Object.keys(room.crystal.idleSince), [actor('maya').id]);
  tickCrystal(room, now + CRYSTAL_REINFORCEMENT_MS);
  assert.equal(room.crystal.monsters.length, 4); assert.equal(studying.progress, frozenProgress); assert.equal(studying.status, 'challenged');
  assert.ok(others.every(monster => monster.progress > 0 && monster.status === 'active'));
  const fresh = room.crystal.monsters.at(-1); direct(room, 'maya', 'crystal-claim', { monsterId: fresh.id }, now + CRYSTAL_REINFORCEMENT_MS);
  assert.equal(gameView(room, actor('maya'), now).crystal.teamShieldActive, true);
  assert.ok(others.every(monster => monster.travelMs === 300000 && monster.moving));
});

test('eligibility matching counts distinct usable targets and preserves the same waiting timer between polls', async () => {
  const view = await started(), room = rawRoom(view), now = Date.now(), [shared, ...blocked] = room.crystal.monsters;
  for (const monster of blocked) monster.failedIds = [actor('maya').id, actor('jordan').id];
  assert.equal(tickCrystal(room, now), true);
  const waitingId = Object.keys(room.crystal.idleSince)[0]; assert.ok(waitingId);
  for (let second = 1; second < 12; second++) {
    assert.equal(tickCrystal(room, now + second * 1000), false);
    assert.deepEqual(room.crystal.idleSince, { [waitingId]: now });
  }
  tickCrystal(room, now + 12000);
  assert.equal(room.crystal.monsters.length, 4); assert.deepEqual(room.crystal.idleSince, {});
  assert.equal(shared.status, 'active'); assert.equal(room.crystal.monsters.filter(monster => !monster.failedIds.length).length, 2);
  tickCrystal(room, now + 24000); assert.equal(room.crystal.monsters.length, 4);

  const other = rawRoom(await started()), [flexible, onlyMaya, unusable] = other.crystal.monsters;
  onlyMaya.failedIds = [actor('jordan').id]; unusable.failedIds = [actor('maya').id, actor('jordan').id];
  tickCrystal(other, now); tickCrystal(other, now + 12000);
  assert.equal(other.crystal.monsters.length, 3); assert.deepEqual(other.crystal.idleSince, {}); assert.equal(flexible.status, 'active');
});

test('returned targets cancel idle timers and offline gaps never create catch-up reinforcement bursts', async () => {
  const view = await started(), room = rawRoom(view), now = Date.now(), [studying, ...others] = room.crystal.monsters;
  direct(room, 'jordan', 'crystal-claim', { monsterId: studying.id }, now);
  for (const monster of others) monster.failedIds = [actor('maya').id];
  tickCrystal(room, now); assert.equal(room.crystal.idleSince[actor('maya').id], now);
  direct(room, 'jordan', 'crystal-answer', { monsterId: studying.id, answer: 'B' }, now + 6000);
  assert.deepEqual(room.crystal.idleSince, {}); tickCrystal(room, now + 12000); assert.equal(room.crystal.monsters.length, 3);

  const solo = rawRoom(await started(['maya'])), later = Date.now();
  for (const monster of solo.crystal.monsters) monster.failedIds = [actor('maya').id];
  tickCrystal(solo, later); assert.equal(solo.crystal.idleSince[actor('maya').id], later);
  tickCrystal(solo, later + 3600000); assert.deepEqual(solo.crystal.idleSince, {}); assert.equal(solo.crystal.monsters.length, 2);
  direct(solo, 'maya', 'crystal-heartbeat', {}, later + 3600001);
  assert.equal(solo.crystal.idleSince[actor('maya').id], later + 3600001); assert.equal(solo.crystal.monsters.length, 2);
  tickCrystal(solo, later + 3600001 + CRYSTAL_REINFORCEMENT_MS);
  assert.equal(solo.crystal.monsters.length, 3); assert.equal(solo.crystal.hearts, 5);
});

test('all-solving shield halves unclaimed speed, remains moving, and ends at the exact release point', async () => {
  const view = await started(), room = rawRoom(view); let now = Date.now();
  direct(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 6 }, now);
  const [first, second, walking] = room.crystal.monsters;
  direct(room, 'maya', 'crystal-claim', { monsterId: first.id }, now);
  assert.equal(gameView(room, actor('maya'), now).crystal.teamShieldActive, false);
  direct(room, 'jordan', 'crystal-claim', { monsterId: second.id }, now);
  assert.equal(gameView(room, actor('maya'), now).crystal.teamShieldActive, true); assert.equal(walking.travelMs, 200000);
  for (let step = 0; step < 8; step++) { now += 15000; for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now); }
  assert.ok(Math.abs(walking.progress - .6) < 1e-8); assert.equal(first.progress, 0); assert.equal(second.progress, 0); assert.equal(room.crystal.hearts, 5);
  const before = walking.progress; direct(room, 'maya', 'crystal-answer', { monsterId: first.id, answer: 'B' }, now);
  assert.equal(gameView(room, actor('maya'), now).crystal.teamShieldActive, false); assert.equal(walking.progress, before); assert.equal(walking.travelMs, 100000);
  now += 10000; direct(room, 'maya', 'crystal-heartbeat', {}, now); direct(room, 'jordan', 'crystal-heartbeat', {}, now);
  assert.ok(Math.abs(walking.progress - (before + .1)) < 1e-8);
});

test('terminal animation retention and unique serials keep a long replenishing wave bounded', async () => {
  const view = await started(), room = rawRoom(view); let now = Date.now(); const [studying, ...initial] = room.crystal.monsters;
  const seen = new Set(room.crystal.monsters.map(monster => monster.id));
  direct(room, 'jordan', 'crystal-claim', { monsterId: studying.id }, now);
  solveAll(room, now); assert.equal(room.crystal.monsters.length, 3);
  tickCrystal(room, now + CRYSTAL_ANIMATION_RETENTION_MS - 1); assert.ok(initial.every(monster => room.crystal.monsters.includes(monster)));
  tickCrystal(room, now + CRYSTAL_ANIMATION_RETENTION_MS); assert.equal(room.crystal.monsters.length, 1);
  for (let cycle = 0; cycle < 40; cycle++) {
    now += CRYSTAL_REINFORCEMENT_MS;
    for (const token of ['maya', 'jordan']) direct(room, token, 'crystal-heartbeat', {}, now);
    const fresh = room.crystal.monsters.find(monster => monster.status === 'active'); assert.ok(fresh);
    assert.equal(seen.has(fresh.id), false); seen.add(fresh.id);
    solveAll(room, now); assert.ok(room.crystal.monsters.length <= 2);
    assert.equal(studying.status, 'challenged'); assert.equal(room.crystal.phase, 'battle'); assert.equal(room.crystal.wave, 1);
  }
  assert.equal(room.crystal.defeated, 42); assert.equal(room.crystal.waveSize, 43); assert.equal(room.crystal.hearts, 5);
  assert.equal(gameView(room, actor('maya'), now).crystal.totalPoints, 4200);
});

test('concurrent reinforcement polls commit only the required fresh targets once', async () => {
  const view = await started(), room = rawRoom(view), now = Date.now(), revision = room.revision;
  for (const monster of room.crystal.monsters) monster.failedIds = [actor('maya').id, actor('jordan').id];
  room.crystal.idleSince = { [actor('maya').id]: now - CRYSTAL_REINFORCEMENT_MS, [actor('jordan').id]: now - CRYSTAL_REINFORCEMENT_MS };
  fixture.conflict(2);
  const responses = await Promise.all(['maya', 'jordan'].map(token => call(`/${view.id}`, token)));
  assert.deepEqual(responses.map(response => response.status), [200, 200]);
  const final = rawRoom(view); assert.equal(final.crystal.monsters.length, 5); assert.equal(new Set(final.crystal.monsters.map(monster => monster.id)).size, 5);
  assert.equal(final.revision, revision + 1); assert.deepEqual(final.crystal.idleSince, {});
  await call(`/${view.id}`, 'maya'); assert.equal(rawRoom(view).revision, revision + 1);
});

test('cleared waves wait only five seconds before the next battle', async () => {
  const room = rawRoom(await started(['maya'])), now = Date.now();
  solveAll(room, now); assert.equal(room.crystal.nextWaveAt, now + 5000); assert.equal(CRYSTAL_INTERMISSION_MS, 5000);
  tickCrystal(room, now + 4999); assert.equal(room.crystal.phase, 'intermission');
  tickCrystal(room, now + 5000); assert.equal(room.crystal.phase, 'battle'); assert.equal(room.crystal.wave, 2);
});

test('teacher admin privilege is separate from student hosting and can jump an unready configured lobby', async () => {
  let room = await configured();
  assert.equal(room.crystal.canAdmin, true); assert.equal(room.crystal.isHost, false);
  const studentView = (await call(`/${room.id}`, 'maya')).data.room;
  assert.equal(studentView.crystal.isHost, true); assert.equal(studentView.crystal.canAdmin, false);
  for (const body of [{ operation: 'jump-wave', wave: 2 }, { operation: 'next-wave' }, { operation: 'set-hearts', hearts: 5 }]) {
    assert.equal((await act(room, 'maya', 'crystal-admin', body)).status, 403);
    assert.equal((await act(room, 'maya', 'crystal-admin', { ...body, asTestBuddy: true })).status, 403);
  }
  for (const token of ['maya', 'jordan']) await act(room, token, 'crystal-ready', { ready: false });
  const oldRun = room.crystal.runId;
  const jumped = await act(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 4, asTestBuddy: true });
  assert.equal(jumped.status, 200); room = jumped.data.room;
  assert.equal(room.crystal.phase, 'battle'); assert.equal(room.crystal.wave, 4); assert.notEqual(room.crystal.runId, oldRun);
  assert.ok(room.crystal.monsters.every(monster => monster.status === 'active' && monster.travelMs === 120000));
  assert.equal(room.crystal.hostId, actor('maya').id); assert.equal(room.crystal.canAdmin, true);
  assert.equal((await act(room, 'teacher', 'crystal-end')).status, 403);
});

test('jump and next-wave preserve scores and hearts, replace claims, and reject stale answers', async () => {
  let room = await started(); const [scored, challenged] = room.crystal.monsters;
  await act(room, 'maya', 'crystal-claim', { monsterId: scored.id });
  await act(room, 'maya', 'crystal-answer', { monsterId: scored.id, answer: 'A' });
  await act(room, 'jordan', 'crystal-claim', { monsterId: challenged.id });
  await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 3 });
  const oldRun = room.crystal.runId;
  const jumped = await act(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: room.crystal.wave });
  assert.equal(jumped.status, 200); room = jumped.data.room;
  assert.notEqual(room.crystal.runId, oldRun); assert.equal(room.crystal.totalPoints, 100); assert.equal(room.crystal.defeated, 1); assert.equal(room.crystal.hearts, 3);
  assert.equal(room.crystal.wave, 1); assert.deepEqual(room.crystal.challenges, []);
  assert.ok(room.crystal.monsters.every(monster => !monster.claimedBy && monster.status === 'active' && !monster.id.startsWith(oldRun)));
  assert.deepEqual(rawRoom(room).crystal.idleSince, {});
  assert.equal((await act(room, 'jordan', 'crystal-answer', { runId: oldRun, monsterId: challenged.id, answer: 'A' })).status, 409);
  assert.equal((await act(room, 'jordan', 'crystal-answer', { monsterId: challenged.id, answer: 'A' })).status, 409);
  const next = await act(room, 'teacher', 'crystal-admin', { operation: 'next-wave' }); assert.equal(next.status, 200);
  assert.equal(next.data.room.crystal.wave, 2); assert.notEqual(next.data.room.crystal.runId, room.crystal.runId);
  assert.equal(next.data.room.crystal.hearts, 3); assert.equal(next.data.room.crystal.totalPoints, 100);
});

test('setting zero hearts ends active questions and a destroyed crystal requires a jump or restart', async () => {
  let room = await started(); const target = room.crystal.monsters[0];
  await act(room, 'maya', 'crystal-claim', { monsterId: target.id });
  for (const hearts of [1, 5, 2]) {
    const response = await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts }); assert.equal(response.status, 200);
    assert.equal(response.data.room.crystal.hearts, hearts); assert.equal(response.data.room.crystal.phase, 'battle');
  }
  const ended = await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 0 }); assert.equal(ended.status, 200); room = ended.data.room;
  assert.equal(room.crystal.hearts, 0); assert.equal(room.crystal.phase, 'defeat'); assert.equal(room.crystal.nextWaveAt, null);
  assert.equal(room.crystal.teamShieldActive, false); assert.ok(room.crystal.monsters.every(monster => !monster.moving));
  assert.deepEqual((await call(`/${room.id}`, 'maya')).data.room.crystal.challenges, []);
  const denied = await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 5 }); assert.equal(denied.status, 409); assert.match(denied.data.message, /Jump.*restart/);
  const revived = await act(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 9 }); assert.equal(revived.status, 200);
  assert.equal(revived.data.room.crystal.hearts, 5); assert.equal(revived.data.room.crystal.wave, 9); assert.equal(revived.data.room.crystal.phase, 'battle');
  assert.notEqual(revived.data.room.crystal.runId, room.crystal.runId);
});

test('admin validation rejects invalid numbers, empty pools, absent defenders, and stale runs', async () => {
  const room = await configured();
  for (const wave of [undefined, null, '2', -1, 0, 1.5, 10000]) assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave })).status, 400);
  for (const hearts of [undefined, null, '3', -1, .5, 6]) assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts })).status, 400);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'unknown' })).status, 400);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'next-wave', runId: 'outdated-run' })).status, 409);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 3 })).data.room.crystal.hearts, 3);
  const raw = rawRoom(room); for (const player of raw.crystal.participants) player.left = true;
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'next-wave' })).status, 409);
  assert.equal(rawRoom(room).crystal.runId, room.crystal.runId);

  const created = (await call('/', 'teacher', 'POST', { mode: 'world' })).data.room;
  const empty = (await act(created, 'teacher', 'crystal-join')).data.room;
  await act(empty, "teacher", "crystal-teacher-mode", { mode: "playtest" });
  assert.equal((await act(empty, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 1 })).status, 409);
  assert.equal(rawRoom(empty).crystal.runId, empty.crystal.runId);

  const maximum = await act(await configured(), 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 9999 }); assert.equal(maximum.status, 200);
  assert.equal(maximum.data.room.crystal.wave, 9999);
  assert.equal((await act(maximum.data.room, 'teacher', 'crystal-admin', { operation: 'next-wave' })).status, 400);
});

test('concurrent admin advances with the same run apply only once', async () => {
  const room = await started(), oldRun = room.crystal.runId;
  fixture.conflict(2);
  const results = await Promise.all([1, 2].map(() => act(room, 'teacher', 'crystal-admin', { operation: 'next-wave' })));
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  const state = rawRoom(room).crystal; assert.equal(state.wave, 2); assert.notEqual(state.runId, oldRun); assert.equal(state.monsters.length, crystalWaveSize(2, 2));
});

test('initial monster counts rise every wave for solo, small, and full classrooms up to the rendering cap', () => {
  for (const players of [1, 4, 32]) {
    const increase = Math.max(1, Math.ceil(.2 * players)), opening = players + Math.ceil(.25 * players);
    assert.equal(crystalWaveSize(players, 1), opening);
    for (let wave = 2; wave <= 200; wave++) {
      assert.equal(crystalWaveSize(players, wave), Math.min(160, opening + (wave - 1) * increase));
      assert.ok(crystalWaveSize(players, wave) >= crystalWaveSize(players, wave - 1));
    }
  }
  assert.deepEqual([1, 2, 3].map(wave => crystalWaveSize(32, wave)), [40, 47, 54]);
  assert.equal(crystalWaveSize(0, 100), 0);
});

test('each online defender receives one separated personal item and reinforcements do not create more', async () => {
  const room = rawRoom(await started(['maya'])), now = Date.now(), original = room.crystal.participants[0];
  for (let index = 1; index < 32; index++) {
    const id = `item-defender-${index}`;
    room.players.push({ ...room.players[0], id, name: `Defender ${index}` });
    room.crystal.participants.push({ ...original, id, name: `Defender ${index}`, lastSeen: now });
  }
  direct(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 1 }, now);
  const items = structuredClone(room.crystal.items);
  assert.equal(items.length, 32); assert.equal(new Set(items.map(item => item.id)).size, 32); assert.equal(new Set(items.map(item => item.ownerId)).size, 32);
  assert.deepEqual(new Set(items.map(item => item.ownerId)), new Set(room.crystal.participants.map(player => player.id)));
  for (const item of items) {
    assert.ok(['speed', 'retry'].includes(item.kind)); assert.equal(item.pickedUpAt, undefined);
    assert.ok(Math.hypot(item.x, item.z) >= 8 && Math.hypot(item.x, item.z) <= 14);
    for (const other of items) if (item.id !== other.id) assert.ok(Math.hypot(item.x - other.x, item.z - other.z) > 2.39);
  }
  const ids = room.crystal.participants.map(player => player.id);
  for (const monster of room.crystal.monsters) monster.failedIds = [...ids];
  tickCrystal(room, now); tickCrystal(room, now + CRYSTAL_REINFORCEMENT_MS);
  assert.equal(room.crystal.monsters.length, 72); assert.deepEqual(room.crystal.items, items);
});

test('pickups enforce owner, finite proximity, per-wave quota, and atomic single collection', async () => {
  const room = await started(), raw = rawRoom(room), item = raw.crystal.items.find(item => item.ownerId === actor('maya').id);
  item.kind = 'speed';
  assert.equal((await act(room, 'jordan', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z, playerId: actor('maya').id })).status, 403);
  assert.equal((await act(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z, asTestBuddy: true })).status, 403);
  for (const position of [{ x: '1', z: item.z }, { x: NaN, z: item.z }, { x: item.x, z: Infinity }, { x: item.x }]) assert.equal((await act(room, 'maya', 'crystal-pickup', { itemId: item.id, ...position })).status, 400);
  assert.equal((await act(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x + CRYSTAL_PICKUP_DISTANCE + .1, z: item.z })).status, 409);
  fixture.conflict(2);
  const requests = await Promise.all([1, 2].map(() => act(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z })));
  assert.deepEqual(requests.map(result => result.status).sort(), [200, 409]);
  const state = rawRoom(room).crystal, player = state.participants.find(player => player.id === actor('maya').id);
  assert.equal(player.speedStacks, 1); assert.equal(player.pickedItemWave, 1); assert.equal(player.lastPickup.itemId, item.id);
  assert.equal(player.lastPickup.kind, 'speed'); assert.equal(player.score, 0); assert.ok(state.items.find(candidate => candidate.id === item.id).pickedUpAt);
  const duplicate = { ...item, id: `${item.id}-extra`, pickedUpAt: undefined }; state.items.push(duplicate);
  assert.equal((await act(room, 'maya', 'crystal-pickup', { itemId: duplicate.id, x: duplicate.x, z: duplicate.z })).status, 409);
  assert.equal(rawRoom(room).crystal.participants.find(player => player.id === actor('maya').id).speedStacks, 1);
});

test('speed boosts clamp to three stacks and capped defenders receive retry items', async () => {
  const room = rawRoom(await started(['maya'])); let now = Date.now(); const player = room.crystal.participants[0];
  for (let count = 1; count <= 4; count++) {
    const item = room.crystal.items[0]; item.kind = 'speed';
    direct(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now);
    assert.equal(player.speedStacks, Math.min(count, 3)); assert.equal(crystalSpeedMultiplier(player.speedStacks), 1 + Math.min(count, 3) * .1);
    now += 1; direct(room, 'teacher', 'crystal-admin', { operation: 'next-wave' }, now);
    if (count >= 3) assert.equal(room.crystal.items[0].kind, 'retry');
  }
  for (const [stacks, multiplier] of [[undefined, 1], [-20, 1], [0, 1], [1, 1.1], [2, 1.2], [3, 1.3], [999, 1.3], [NaN, 1]]) assert.equal(crystalSpeedMultiplier(stacks), multiplier);
  player.speedStacks = 999;
  assert.equal(gameView(room, actor('maya'), now).crystal.participants[0].speedStacks, 3);
  const retry = room.crystal.items[0]; direct(room, 'maya', 'crystal-pickup', { itemId: retry.id, x: retry.x, z: retry.z }, now);
  assert.equal(player.speedStacks, 3); assert.equal(player.retryReady, true);
});

test('buffs persist through waves and admin jumps while new expeditions reset them', async () => {
  const room = rawRoom(await started()); let now = Date.now(); const player = room.crystal.participants.find(player => player.id === actor('maya').id);
  let item = room.crystal.items.find(item => item.ownerId === player.id); item.kind = 'speed';
  direct(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now);
  const firstRun = room.crystal.runId, oldItem = item;
  direct(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 1 }, now);
  assert.equal(player.speedStacks, 1); assert.equal(player.pickedItemWave, undefined); assert.notEqual(room.crystal.runId, firstRun);
  assert.throws(() => direct(room, 'maya', 'crystal-pickup', { itemId: oldItem.id, x: oldItem.x, z: oldItem.z }, now), error => error.status === 409);
  assert.throws(() => mutateCrystal(room, actor('maya'), 'crystal-pickup', { runId: firstRun, itemId: room.crystal.items[0].id, x: 0, z: 0 }, now), error => error.status === 409);
  item = room.crystal.items.find(item => item.ownerId === player.id); item.kind = 'retry';
  direct(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now);
  assert.equal(player.retryReady, true);
  solveAll(room, now, 'jordan'); now += CRYSTAL_INTERMISSION_MS; tickCrystal(room, now);
  assert.equal(room.crystal.wave, 2); assert.equal(player.speedStacks, 1); assert.equal(player.retryReady, true); assert.equal(player.pickedItemWave, undefined);
  assert.throws(() => direct(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now), error => error.status === 409);
  const monster = room.crystal.monsters[0]; direct(room, 'maya', 'crystal-claim', { monsterId: monster.id }, now);
  assert.equal(monster.retryAvailableFor, player.id); assert.equal(player.retryReady, false);
  direct(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 2 }, now);
  assert.equal(player.speedStacks, 1); assert.equal(player.retryReady, false); assert.ok(room.crystal.monsters.every(monster => !monster.retryAvailableFor));
  direct(room, 'maya', 'crystal-reset', {}, now);
  const reset = room.crystal.participants.find(candidate => candidate.id === player.id);
  assert.equal(reset.speedStacks, 0); assert.equal(reset.retryReady, false); assert.equal(reset.pickedItemWave, undefined); assert.deepEqual(room.crystal.items, []);
});

test('intermission pickups work, reconnects do not refresh quota, and late entrants receive no extra drop', async () => {
  let view = await started(['teacher']), room = rawRoom(view), now = Date.now(), item = room.crystal.items[0]; item.kind = 'speed';
  direct(room, 'teacher', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now);
  const ids = room.crystal.items.map(item => item.id);
  direct(room, 'teacher', 'crystal-leave', {}, now); direct(room, 'teacher', 'crystal-join', {}, now);
  assert.deepEqual(room.crystal.items.map(item => item.id), ids);
  assert.throws(() => direct(room, 'teacher', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now), error => error.status === 409);
  now += CRYSTAL_OFFLINE_MS + 1; tickCrystal(room, now); direct(room, 'teacher', 'crystal-heartbeat', {}, now);
  assert.deepEqual(room.crystal.items.map(item => item.id), ids); assert.equal(room.crystal.participants[0].speedStacks, 1);

  view = await started(['maya']); room = rawRoom(view); now = Date.now(); item = room.crystal.items[0]; item.kind = 'retry';
  direct(room, 'teacher', 'crystal-join', {}, now); assert.equal(room.crystal.items.length, 1); assert.equal(room.crystal.items.some(item => item.ownerId === actor('teacher').id), false);
  solveAll(room, now); assert.equal(room.crystal.phase, 'intermission');
  direct(room, 'maya', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now + 1);
  assert.equal(room.crystal.participants.find(player => player.id === actor('maya').id).retryReady, true);
  tickCrystal(room, now + CRYSTAL_INTERMISSION_MS); assert.equal(room.crystal.items.length, 2);
  direct(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 0 }, now + CRYSTAL_INTERMISSION_MS);
  item = room.crystal.items.find(item => item.ownerId === actor('teacher').id);
  assert.throws(() => direct(room, 'teacher', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z }, now + CRYSTAL_INTERMISSION_MS), error => error.status === 409);
});

test('test buddy pickups use only the authenticated derived buddy identity', async () => {
  let room = await configured(['teacher']);
  await act(room, 'teacher', 'crystal-join', { asTestBuddy: true }); await act(room, 'teacher', 'crystal-ready', { asTestBuddy: true, ready: true });
  room = (await act(room, 'teacher', 'crystal-start')).data.room;
  const item = rawRoom(room).crystal.items.find(item => item.ownerId === `test:${actor('teacher').id}`); item.kind = 'speed';
  assert.equal((await act(room, 'teacher', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z, playerId: item.ownerId })).status, 403);
  const picked = await act(room, 'teacher', 'crystal-pickup', { itemId: item.id, x: item.x, z: item.z, asTestBuddy: true, playerId: actor('teacher').id }); assert.equal(picked.status, 200);
  assert.equal(picked.data.room.crystal.participants.find(player => player.id === item.ownerId).speedStacks, 1);
  assert.equal(picked.data.room.crystal.participants.find(player => player.id === actor('teacher').id).speedStacks, 0);
});

test('retry items bind to a new claim, keep the first wrong answer frozen, then resume after a second wrong answer', async () => {
  const { room, monsterId, attemptId } = await retryChallenge(), monster = rawRoom(room).crystal.monsters.find(monster => monster.id === monsterId), frozen = monster.progress;
  const player = room.crystal.participants.find(player => player.id === actor('maya').id);
  assert.equal(player.retryReady, false); assert.equal(monster.retryAvailableFor, player.id); assert.ok(attemptId);
  await act(room, 'maya', 'crystal-claim', { monsterId }); assert.equal(rawRoom(room).crystal.monsters.find(monster => monster.id === monsterId).attemptId, attemptId);
  const first = await act(room, 'maya', 'crystal-answer', { monsterId, attemptId, answer: 'B' }); assert.equal(first.status, 200);
  const state = first.data.room.crystal, target = state.monsters.find(monster => monster.id === monsterId), nextAttempt = state.challenges[0].attemptId;
  assert.equal(target.status, 'challenged'); assert.equal(target.claimedBy, player.id); assert.equal(target.progress, frozen); assert.equal(target.moving, false);
  assert.deepEqual(target.failedIds, []); assert.equal(target.stage, 0); assert.equal(target.retryAvailableFor, undefined); assert.equal(state.hearts, 5); assert.equal(state.totalPoints, 0);
  assert.equal(state.participants.find(candidate => candidate.id === player.id).lastResult.retry, true); assert.notEqual(nextAttempt, attemptId);
  const second = await act(room, 'maya', 'crystal-answer', { monsterId, attemptId: nextAttempt, answer: 'B' }); assert.equal(second.status, 200);
  const walking = second.data.room.crystal.monsters.find(monster => monster.id === monsterId);
  assert.equal(walking.status, 'active'); assert.equal(walking.moving, true); assert.equal(walking.stage, 1); assert.deepEqual(walking.failedIds, [player.id]);
  assert.equal(second.data.room.crystal.participants.find(candidate => candidate.id === player.id).lastResult.retry, undefined);
  assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId })).status, 409);
});

test('retry correctness awards only one hundred points whether the first or second attempt succeeds', async () => {
  for (const useSecondAttempt of [false, true]) {
    const challenge = await retryChallenge(); let attemptId = challenge.attemptId;
    if (useSecondAttempt) {
      const wrong = await act(challenge.room, 'maya', 'crystal-answer', { monsterId: challenge.monsterId, attemptId, answer: 'B' });
      attemptId = wrong.data.room.crystal.challenges[0].attemptId;
    }
    const correct = await act(challenge.room, 'maya', 'crystal-answer', { monsterId: challenge.monsterId, attemptId, answer: 'A' }); assert.equal(correct.status, 200);
    assert.equal(correct.data.room.crystal.totalPoints, 100); assert.equal(correct.data.room.crystal.defeated, 1);
    assert.equal(correct.data.room.crystal.monsters.find(monster => monster.id === challenge.monsterId).retryAvailableFor, undefined);
    assert.equal((await act(challenge.room, 'maya', 'crystal-answer', { monsterId: challenge.monsterId, attemptId, answer: 'A' })).status, 409);
    assert.equal(rawRoom(challenge.room).crystal.participants.find(player => player.id === actor('maya').id).score, 100);
  }
});

test('duplicate first-wrong posts consume only the retry bonus and stale attempt tokens cannot spend the second attempt', async () => {
  const { room, monsterId, attemptId } = await retryChallenge(); fixture.conflict(2);
  const requests = await Promise.all([1, 2].map(() => act(room, 'maya', 'crystal-answer', { monsterId, attemptId, answer: 'B' })));
  assert.deepEqual(requests.map(result => result.status).sort(), [200, 409]);
  const target = rawRoom(room).crystal.monsters.find(monster => monster.id === monsterId), nextAttempt = target.attemptId;
  assert.equal(target.status, 'challenged'); assert.notEqual(nextAttempt, attemptId); assert.deepEqual(target.failedIds, []); assert.equal(target.stage, 0);
  assert.equal((await act(room, 'maya', 'crystal-answer', { monsterId, attemptId, answer: 'B' })).status, 409);
  assert.equal((await act(room, 'maya', 'crystal-answer', { monsterId, attemptId: undefined, answer: 'A' })).status, 409);
  const second = await act(room, 'maya', 'crystal-answer', { monsterId, attemptId: nextAttempt, answer: 'A' }); assert.equal(second.status, 200);
  assert.equal(second.data.room.crystal.totalPoints, 100);
});

test('leaving and disconnects discard attached retries without transferring or refreshing them', async () => {
  for (const exit of ['leave', 'offline']) {
    const challenge = await retryChallenge(), room = rawRoom(challenge.room), now = Date.now(), target = room.crystal.monsters.find(monster => monster.id === challenge.monsterId);
    const player = room.crystal.participants.find(player => player.id === actor('maya').id);
    if (exit === 'leave') direct(room, 'maya', 'crystal-leave', {}, now);
    if (exit === 'offline') {
      direct(room, 'jordan', 'crystal-heartbeat', {}, now + 30000);
      direct(room, 'jordan', 'crystal-heartbeat', {}, now + CRYSTAL_OFFLINE_MS + 1);
    }
    assert.equal(target.status, 'active'); assert.equal(target.retryAvailableFor, undefined); assert.equal(target.attemptId, undefined); assert.equal(player.retryReady, false);
    const later = exit === 'offline' ? now + CRYSTAL_OFFLINE_MS + 1 : now;
    direct(room, 'jordan', 'crystal-claim', { monsterId: target.id }, later);
    assert.equal(target.retryAvailableFor, undefined);
    direct(room, 'jordan', 'crystal-answer', { monsterId: target.id, answer: 'B' }, later);
    assert.equal(target.status, 'active'); assert.deepEqual(target.failedIds, [actor('jordan').id]);
  }
});

test('releases cannot skip an unanswered question or spend its attached retry', async () => {
  const { room, monsterId, attemptId } = await retryChallenge();
  const other = room.crystal.monsters.find(monster => monster.id !== monsterId), playerId = actor('maya').id;
  for (const body of [{ attemptId }, { attemptId: 'stale-attempt' }, { attemptId: undefined }]) {
    assert.equal((await act(room, 'maya', 'crystal-release', { monsterId, ...body })).status, 409);
    assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId: other.id })).status, 409);
  }
  const current = (await call(`/${room.id}`, 'maya')).data.room.crystal, target = current.monsters.find(monster => monster.id === monsterId);
  assert.equal(target.status, 'challenged'); assert.equal(target.retryAvailableFor, playerId); assert.equal(current.challenges[0].attemptId, attemptId);
  assert.equal(current.participants.find(player => player.id === playerId).pendingMonsterId, monsterId);
  const wrong = await act(room, 'maya', 'crystal-answer', { monsterId, attemptId, answer: 'B' });
  const retryAttempt = wrong.data.room.crystal.challenges[0].attemptId; assert.notEqual(retryAttempt, attemptId);
  assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId: other.id })).status, 409);
  assert.equal((await act(room, 'maya', 'crystal-release', { monsterId, attemptId: retryAttempt })).status, 409);
  assert.equal((await act(room, 'maya', 'crystal-answer', { monsterId, attemptId: retryAttempt, answer: 'A' })).status, 200);
  assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId: other.id })).status, 200);
});

test('concurrent claims reveal only one question and an explicit departure cannot rejoin to reroll', async () => {
  const room = await started(), [first, second] = room.crystal.monsters; fixture.conflict(2);
  const results = await Promise.all([first, second].map(monster => act(room, 'maya', 'crystal-claim', { monsterId: monster.id })));
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  const view = (await call(`/${room.id}`, 'maya')).data.room.crystal;
  assert.equal(view.challenges.length, 1); assert.equal(view.participants.find(player => player.id === actor('maya').id).pendingMonsterId, view.challenges[0].monsterId);
  assert.equal((await act(room, 'maya', 'crystal-leave')).status, 200);
  assert.equal((await act(room, 'maya', 'crystal-join')).status, 409);
  assert.equal((await act(room, 'maya', 'crystal-claim', { monsterId: second.id })).status, 403);
});

test('offline expiry keeps the original assignment and reconnect resumes the same question', async () => {
  const room = rawRoom(await started()), now = Date.now(), [target, other] = room.crystal.monsters, player = room.crystal.participants.find(player => player.id === actor('maya').id);
  direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now); const attemptId = target.attemptId, questionIndex = target.questionIndex;
  direct(room, 'jordan', 'crystal-heartbeat', {}, now + 30000);
  direct(room, 'jordan', 'crystal-heartbeat', {}, now + CRYSTAL_OFFLINE_MS + 1);
  assert.equal(target.status, 'active'); assert.equal(target.moving, true); assert.equal(player.pendingMonsterId, target.id);
  const later = now + CRYSTAL_OFFLINE_MS + 1001; direct(room, 'maya', 'crystal-heartbeat', {}, later);
  assert.equal(target.status, 'challenged'); assert.equal(target.moving, false); assert.equal(target.claimedBy, player.id);
  assert.notEqual(target.attemptId, attemptId); assert.equal(target.questionIndex, questionIndex);
  assert.throws(() => direct(room, 'maya', 'crystal-claim', { monsterId: other.id }, later), error => error.status === 409);
  assert.throws(() => direct(room, 'maya', 'crystal-answer', { monsterId: target.id, attemptId, answer: 'A' }, later), error => error.status === 409);
  direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: 'B' }, later);
  assert.equal(player.pendingMonsterId, undefined); direct(room, 'maya', 'crystal-claim', { monsterId: other.id }, later);
});

test('a reconnecting student waits for a teammate on their original monster and resumes after a failed rescue', async () => {
  const room = rawRoom(await started()), now = Date.now(), [target, other] = room.crystal.monsters, player = room.crystal.participants.find(player => player.id === actor('maya').id);
  direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now);
  direct(room, 'jordan', 'crystal-heartbeat', {}, now + 30000);
  const later = now + CRYSTAL_OFFLINE_MS + 1; direct(room, 'jordan', 'crystal-claim', { monsterId: target.id }, later);
  direct(room, 'maya', 'crystal-heartbeat', {}, later);
  assert.equal(player.pendingMonsterId, target.id); assert.equal(gameView(room, actor('maya'), later).crystal.challenges.length, 0);
  assert.throws(() => direct(room, 'maya', 'crystal-claim', { monsterId: other.id }, later), error => error.status === 409);
  direct(room, 'jordan', 'crystal-answer', { monsterId: target.id, answer: 'B' }, later);
  assert.equal(target.status, 'challenged'); assert.equal(target.claimedBy, player.id);
  assert.equal(gameView(room, actor('maya'), later).crystal.challenges[0].monsterId, target.id);
  direct(room, 'maya', 'crystal-answer', { monsterId: target.id, answer: 'A' }, later);
  assert.equal(player.pendingMonsterId, undefined);
});

test('rescued and breached assignments clear instead of trapping returning students', async () => {
  for (const outcome of ['rescued', 'breached', 'new-wave']) {
    const room = rawRoom(await started()), now = Date.now(), target = room.crystal.monsters[0], player = room.crystal.participants.find(player => player.id === actor('maya').id);
    direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now);
    direct(room, 'jordan', 'crystal-heartbeat', {}, now + 30000);
    const later = now + CRYSTAL_OFFLINE_MS + 1; direct(room, 'jordan', 'crystal-heartbeat', {}, later);
    if (outcome === 'rescued') { direct(room, 'jordan', 'crystal-claim', { monsterId: target.id }, later); direct(room, 'jordan', 'crystal-answer', { monsterId: target.id, answer: 'A' }, later); }
    if (outcome === 'breached') { target.progress = 1; tickCrystal(room, later); }
    if (outcome === 'new-wave') direct(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 3 }, later);
    assert.equal(player.pendingMonsterId, undefined);
    direct(room, 'maya', 'crystal-heartbeat', {}, later);
    const next = room.crystal.monsters.find(monster => monster.status === 'active'); assert.ok(next);
    direct(room, 'maya', 'crystal-claim', { monsterId: next.id }, later);
    assert.equal(next.claimedBy, player.id);
  }
});

test('admin controls require an explicit teacher Playtest selection and disappear when it ends', async () => {
  let room = await configured(['maya'], 6, 5, false);
  assert.equal(room.crystal.teacherMode, 'play'); assert.equal(room.crystal.canAdmin, false);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 0 })).status, 403);
  for (const mode of ['play', 'spectate', 'playtest']) assert.equal((await act(room, 'maya', 'crystal-teacher-mode', { mode })).status, 403);
  assert.equal((await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'invalid' })).status, 400);
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'playtest' })).data.room;
  assert.equal(room.crystal.canAdmin, true);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'jump-wave', wave: 4 })).status, 200);
  room = (await call(`/${room.id}`)).data.room;
  assert.equal(room.crystal.teacherMode, 'playtest');
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'play' })).data.room;
  assert.equal(room.crystal.canAdmin, false);
  assert.equal((await act(room, 'teacher', 'crystal-admin', { operation: 'set-hearts', hearts: 0 })).status, 403);
  assert.equal(room.crystal.hearts, 5);
});

test('a spectating teacher hosts and starts without readiness, monsters, or items of their own', async () => {
  let room = await configured(['maya', 'jordan'], 6, 5, false);
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'spectate' })).data.room;
  assert.equal(room.crystal.hostId, actor('teacher').id); assert.equal(room.crystal.isHost, true);
  assert.equal(room.crystal.activePlayers, 2); assert.equal(room.crystal.canAdmin, false);
  assert.equal((await act(room, 'teacher', 'crystal-ready', { ready: true })).status, 403);
  const start = await act(room, 'teacher', 'crystal-start'); assert.equal(start.status, 200);
  room = start.data.room;
  assert.equal(room.crystal.waveSize, crystalWaveSize(2, 1)); assert.equal(room.crystal.items.length, 2);
  assert.ok(room.crystal.items.every(item => item.ownerId !== actor('teacher').id));
  assert.equal((await act(room, 'teacher', 'crystal-claim', { monsterId: room.crystal.monsters[0].id })).status, 403);
  assert.equal((await act(room, 'teacher', 'crystal-pickup', { itemId: room.crystal.items[0].id, x: 0, z: 0 })).status, 403);
  await act(room, 'maya', 'crystal-claim', { monsterId: room.crystal.monsters[0].id });
  room = (await act(room, 'jordan', 'crystal-claim', { monsterId: room.crystal.monsters[1].id })).data.room;
  assert.equal(room.crystal.teamShieldActive, true, 'the spectator does not prevent team protection');
  const raw = rawRoom(room), later = Date.now() + CRYSTAL_OFFLINE_MS + 1;
  direct(raw, 'teacher', 'crystal-heartbeat', {}, later);
  const observer = gameView(raw, actor('teacher'), later).crystal;
  assert.equal(observer.activePlayers, 0); assert.equal(observer.movementPaused, true);
  assert.ok(observer.monsters.every(monster => !monster.moving), 'a spectator alone cannot keep the battle moving');
});

test('spectator choice survives setup and reset; returning to Play resumes an unfinished encounter', async () => {
  let room = await configured(['teacher', 'maya'], 6, 5, false);
  room = (await act(room, 'teacher', 'crystal-start')).data.room;
  const target = room.crystal.monsters[0].id;
  await act(room, 'teacher', 'crystal-claim', { monsterId: target });
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'spectate' })).data.room;
  assert.equal(room.crystal.challenges.length, 0);
  assert.equal(room.crystal.monsters.find(monster => monster.id === target).status, 'active');
  assert.equal(room.crystal.activePlayers, 1);
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'play' })).data.room;
  assert.equal(room.crystal.challenges[0].monsterId, target); assert.equal(room.crystal.activePlayers, 2);
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'spectate' })).data.room;
  room = (await act(room, 'teacher', 'crystal-end')).data.room;
  room = (await act(room, 'teacher', 'crystal-configure', { source: { kind: 'exam-math', assessmentId: 'qa-team-test' } })).data.room;
  assert.equal(room.crystal.teacherMode, 'spectate'); assert.equal(room.crystal.activePlayers, 1);
  assert.equal(room.crystal.participants.find(player => player.id === actor('teacher').id).spectating, true);
});

test('leaving Playtest withdraws the test buddy from defender counts and releases its monster', async () => {
  let room = await configured(['teacher', 'maya']);
  await act(room, 'teacher', 'crystal-join', { asTestBuddy: true });
  await act(room, 'teacher', 'crystal-ready', { asTestBuddy: true, ready: true });
  room = (await act(room, 'teacher', 'crystal-start')).data.room;
  const target = room.crystal.monsters[0].id;
  await act(room, 'teacher', 'crystal-claim', { asTestBuddy: true, monsterId: target });
  room = (await act(room, 'teacher', 'crystal-teacher-mode', { mode: 'spectate' })).data.room;
  assert.equal(room.crystal.activePlayers, 1);
  assert.equal(room.crystal.monsters.find(monster => monster.id === target).status, 'active');
  assert.equal(room.crystal.participants.find(player => player.id.startsWith('test:')).left, true);
});

test('legacy saved challenges receive stable attempt tokens and missing item arrays remain usable', async () => {
  const room = rawRoom(await started(['maya'])), now = Date.now(), target = room.crystal.monsters[0];
  direct(room, 'maya', 'crystal-claim', { monsterId: target.id }, now); delete target.attemptId; delete room.crystal.items;
  assert.equal(tickCrystal(room, now), true); const token = target.attemptId; assert.ok(token);
  assert.equal(tickCrystal(room, now + 1), false); assert.equal(target.attemptId, token);
  const view = gameView(room, actor('maya'), now); assert.deepEqual(view.crystal.items, []); assert.equal(view.crystal.challenges[0].attemptId, token);
  assert.doesNotMatch(JSON.stringify(view.crystal.monsters), /attemptId|questionIndex/);
  assert.throws(() => direct(room, 'maya', 'crystal-answer', { monsterId: target.id, attemptId: undefined, answer: 'A' }, now), error => error.status === 409);
  direct(room, 'maya', 'crystal-answer', { monsterId: target.id, attemptId: token, answer: 'A' }, now);
  assert.equal(target.status, 'defeated');
});
