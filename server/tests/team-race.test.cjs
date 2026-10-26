const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { WebSocket } = require('ws');
const fixture = require('./helpers/game-fixture.cjs');
const { attachGameRealtime } = require('../src/lib/gameRealtime.ts');
const { attachBoardRealtime } = require('../src/lib/boardRealtime.ts');
const servers = [], roots = [];
before(async () => {
  for (let i = 0; i < 2; i++) {
    const express = require('express'), app = express();
    app.use(express.json()); app.use('/api/game-rooms', fixture.router);
    const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
    attachBoardRealtime(server, []); attachGameRealtime(server, []);
    servers.push(server); roots.push(`http://127.0.0.1:${server.address().port}/api/game-rooms`);
  }
});
after(async () => { for (const server of servers) await new Promise(resolve => server.close(resolve)); });
async function call(path, token = 'teacher', method = 'GET', body) {
  const response = await fetch(roots[0] + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
const act = (room, token, action, body = {}) => call(`/${room.id}/action`, token, 'POST', { action, ...body });
const read = async (room, token = 'maya') => (await call(`/${room.id}`, token)).data.room;
const own = view => view.teams.find(team => team.id === view.me?.teamId);
const ballot = view => ({ questionId: view.unit[0].question.id, index: own(view).index, step: own(view).step ?? 0, draftVersion: own(view).draftVersion ?? 0 });
async function race(english = false) {
  const room = (await call('/', 'teacher', 'POST', { mode: 'teams', party: true, assessmentId: (english ? fixture.englishContent : fixture.content).assessmentId })).data.room;
  for (const player of ['maya', 'jordan', 'alex']) assert.equal((await call('/join', player, 'POST', { code: room.code })).status, 200);
  await act(room, 'teacher', 'balance'); await act(room, 'teacher', 'start'); return read(room);
}
async function draft(room, choice = 'A', offset = 0) {
  const view = await read(room);
  const response = await act(room, 'maya', 'draft', { questionId: view.unit[offset].question.id, index: own(view).index, answer: choice });
  assert.equal(response.status, 200); return response.data.room;
}
async function bothReady(room) {
  const body = ballot(await read(room));
  for (const token of ['maya', 'alex']) assert.equal((await act(room, token, 'vote', body)).status, 200);
  return read(room);
}

test('all roster members must approve the same saved answer; duplicates do not count twice', async () => {
  let room = await draft(await race()); const body = ballot(room);
  await Promise.all([act(room, 'maya', 'vote', body), act(room, 'maya', 'vote', body)]);
  room = await read(room); assert.equal(own(room).index, 0); assert.deepEqual(own(room).readyIds, [fixture.users.maya.id]);
  assert.equal((await act(room, 'teacher', 'vote', body)).status, 403);
  assert.equal((await act(room, 'outsider', 'vote', body)).status, 403);
  const opposite = await read(room, 'jordan');
  assert.equal((await act(room, 'jordan', 'vote', { ...body, teamId: own(room).id })).status, 409);
  assert.equal(own(opposite).index, 0);
  const results = await Promise.all([act(room, 'alex', 'vote', body), act(room, 'alex', 'vote', body)]);
  assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
  room = await read(room); assert.equal(own(room).index, 1); assert.equal(own(room).score, 1); assert.deepEqual(own(room).readyIds, []);
});

test('votes can be withdrawn; edits invalidate votes and stale clients cannot submit older choices', async () => {
  let room = await draft(await race()); const stale = ballot(room);
  await act(room, 'maya', 'vote', stale); await act(room, 'maya', 'unvote', stale);
  assert.deepEqual(own(await read(room)).readyIds, []);
  await act(room, 'maya', 'vote', stale);
  room = await draft(room, 'B'); assert.deepEqual(own(room).readyIds, []);
  assert.equal((await act(room, 'alex', 'vote', stale)).status, 409);
  assert.equal((await act(room, 'alex', 'answer', { ...stale, answer: 'A' })).status, 409);
  room = await bothReady(room); assert.equal(own(room).index, 1); assert.equal(own(room).score, 0); assert.equal(own(room).answers[0].answer, 'B');
});

test('English advances together on each question and grades only after unanimous passage review', async () => {
  let room = await draft(await race(true));
  assert.equal((await act(room, 'maya', 'review', { ...ballot(room), targetStep: 2 })).status, 409);
  room = await bothReady(room); assert.equal(own(room).step, 1); assert.equal(own(room).score, 0); assert.equal(own(room).index, 0);
  assert.equal((await act(room, 'maya', 'vote', ballot(room))).status, 400);
  room = await draft(room, 'A', 1); room = await bothReady(room);
  assert.equal(own(room).step, 2); assert.equal(own(room).score, 0);
  const review = ballot(room);
  room = (await act(room, 'alex', 'review', { ...review, targetStep: 0 })).data.room;
  assert.equal(own(room).step, 0); assert.equal((await act(room, 'maya', 'vote', review)).status, 409);
  room = await bothReady(room); room = await bothReady(room);
  const body = ballot(room); fixture.conflict(2);
  const results = await Promise.all([act(room, 'maya', 'vote', body), act(room, 'alex', 'vote', body)]);
  assert.ok(results.every(result => result.status === 200));
  room = await read(room); assert.equal(own(room).score, 2); assert.equal(own(room).index, 2); assert.equal(room.current.subject, 'Math');
  assert.equal(own(room).answers.length, 2);
});

test('passage feedback and streak appear at question lock, remain private, and cannot be farmed by reviewing', async () => {
  let room=await draft(await race(true),'A'); const teamId=own(room).id;
  assert.equal(own(room).answerFeedback,undefined);
  await act(room,'maya','vote',ballot(room));
  assert.equal(own(await read(room)).answerFeedback,undefined);
  room=await bothReady(room);
  assert.deepEqual(own(room).answerFeedback,{questionId:room.unit[0].question.id,questionIndex:0,correct:true,streak:1});
  assert.equal(own(room).streak,1); assert.equal(own(room).score,0); assert.equal(own(room).coins,0);
  assert.deepEqual(own(await read(room,'alex')).answerFeedback,own(room).answerFeedback);
  const opponent=await read(room,'jordan');
  assert.equal(opponent.teams.find(team=>team.id===teamId).pendingFeedback,undefined);
  assert.equal(opponent.teams.find(team=>team.id===teamId).answerFeedback,undefined);
  assert.ok(!opponent.mineTargets.find(team=>team.teamId===teamId).questions.some(item=>item.questionIndex===0));
  storedTeam(room,'team-2').inventory={landmine:1};
  assert.equal((await act(room,'jordan','use-sabotage',{boosterId:'landmine',teamId,questionIndex:0,choiceId:'A'})).status,400);
  assert.equal((await act(room,'maya','draft',{index:0,questionId:room.unit[0].question.id,answer:'B'})).status,409);
  room=await bothReady(await draft(room,'B',1));
  assert.equal(own(room).answerFeedback.correct,false); assert.equal(own(room).streak,0);
  room=(await act(room,'maya','review',{...ballot(room),targetStep:0})).data.room;
  room=await bothReady(room); room=await bothReady(room);
  assert.equal(own(room).pendingFeedback.length,2); assert.equal(own(room).streak,0);
  room=await bothReady(room); assert.equal(own(room).coins,100); assert.equal(own(room).score,1); assert.equal(own(room).streak,0);
  assert.equal(own(room).pendingFeedback,undefined);
  room=await bothReady(await draft(room)); assert.equal(own(room).answerFeedback.correct,true); assert.equal(own(room).streak,1);
});

test('shared exam tools merge concurrent teammates, persist across instances and remain team-private', async () => {
  let room=await race(true); const teamId=own(room).id, q=room.unit[0].question.id;
  const tools=notes=>({drawings:{['passage:'+room.unit[0].passage.id]:[{points:[{x:.1,y:.2},{x:.3,y:.4}]}]},highlights:{['prompt:'+q]:[{start:0,end:4,color:'blue'}]},eliminated:{[q]:['B']},notes:{[room.unit[0].passage.id]:notes}});
  const maya=tools('Maya reasoning'), alex=tools('Alex reasoning'); fixture.conflict(2);
  const updates=await Promise.all([act(room,'maya','tools',{index:0,state:maya}),act(room,'alex','tools',{index:0,state:alex})]);
  assert.ok(updates.every(result=>result.status===200));
  room=await read(room); assert.equal(room.teamTools.length,2); assert.deepEqual(room.teamTools.find(layer=>layer.playerId===fixture.users.maya.id).state,maya);
  assert.ok(room.teams.every(team=>!('tools' in team)));
  const remote=await fetch(roots[1]+'/'+room.id,{headers:{Authorization:'Bearer alex'}});
  assert.equal((await remote.json()).room.teamTools.length,2);
  const opponent=await read(room,'jordan'); assert.deepEqual(opponent.teamTools,[]); assert.equal(JSON.stringify(opponent).includes('Maya reasoning'),false);
  assert.equal((await call('/'+room.id+'?teamId='+teamId)).data.room.teamTools.length,2);
  const cleared={drawings:{},highlights:{},eliminated:{},notes:{}};
  await act(room,'maya','tools',{index:0,state:cleared});
  assert.deepEqual((await read(room)).teamTools.find(layer=>layer.playerId===fixture.users.alex.id).state,alex);
  room=await bothReady(await draft(room)); room=await bothReady(await draft(room,'A',1)); room=await bothReady(room);
  assert.deepEqual(room.teamTools,[]);
  assert.equal((await act(room,'alex','tools',{index:0,state:alex})).status,409);
});

test('tool writes validate bounded geometry, membership, actor ownership and sabotage state', async () => {
  const room=await race(); const empty={drawings:{},highlights:{},eliminated:{},notes:{}};
  for(const token of ['teacher','outsider'])assert.equal((await act(room,token,'tools',{index:0,state:empty})).status,403);
  for(const state of [null,{}, {...empty,drawings:{x:[{points:[{x:-.1,y:1}]}]}}, {...empty,highlights:{x:[{start:4,end:2,color:'blue'}]}}, {...empty,notes:{x:'n'.repeat(4001)}},JSON.parse('{"drawings":{},"highlights":{},"eliminated":{},"notes":{"__proto__":"bad"}}')]) {
    assert.equal((await act(room,'maya','tools',{index:0,state})).status,400);
  }
  assert.equal((await act(room,'maya','tools',{index:0,state:{...empty,notes:{x:'mine'}},playerId:fixture.users.jordan.id,teamId:'team-2'})).status,200);
  assert.equal((await read(room)).teamTools[0].playerId,fixture.users.maya.id);
  assert.deepEqual((await read(room,'jordan')).teamTools,[]);
  await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:false});
  assert.equal((await act(room,'alex','tools',{index:0,state:empty})).status,403);
  storedTeam(room,own(await read(room)).id).inkBomb={id:'ink',expiresAt:Date.now()+30000,clearedSplats:[],source:{teamId:'team-2',teamName:'Team 2',boosterId:'ink-bomb'}};
  assert.equal((await act(room,'maya','tools',{index:0,state:empty})).status,409);
});

test('host views follow each selected team but students and other teachers cannot watch opponents', async () => {
  let room = await draft(await race()); await act(room, 'maya', 'vote', ballot(room));
  const teamId = own(room).id;
  const watched = (await call(`/${room.id}?teamId=${teamId}`)).data.room;
  assert.equal(watched.me, null); assert.equal(watched.isHost, true); assert.equal(watched.observingTeamId, teamId);
  assert.equal(watched.myAnswers[room.current.question.id], 'A'); assert.deepEqual(watched.teams[0].readyIds, [fixture.users.maya.id]);
  assert.equal(JSON.stringify(watched.unit).includes('correctChoiceId'), false);
  for (const token of ['maya', 'jordan', 'outsider']) assert.equal((await call(`/${room.id}?teamId=${teamId}`, token)).status, 403);
  fixture.users.otherTeacher = { ...fixture.users.teacher, id: '00000000-0000-4000-8000-000000000099' };
  assert.equal((await call(`/${room.id}?teamId=${teamId}`, 'otherTeacher')).status, 403);
  const opponent = await read(room, 'jordan'); assert.equal(opponent.teams.find(team => team.id === teamId).drafts, undefined);
  assert.equal(opponent.teams.find(team => team.id === teamId).readyIds, undefined);
  assert.equal((await act(room, 'teacher', 'draft', { ...ballot(room), answer: 'B' })).status, 403);
  assert.equal((await call(`/${room.id}?teamId=missing`)).status, 404);
  room = await bothReady(room);
  const next = (await call(`/${room.id}?teamId=${teamId}`)).data.room;
  assert.equal(next.current.question.id, room.current.question.id); assert.equal(next.teams[0].score, 1);
});

test('ink bombs identify the attacking team after reconnect and reject frozen votes', async () => {
  let room = await race();
  for (let i = 0; i < 3; i++) room = await bothReady(await draft(room));
  const target = room.teams.find(team => team.id !== own(room).id);
  assert.equal((await act(room, 'maya', 'buy-sabotage', { boosterId: 'ink-bomb', teamId: target.id })).status, 200);
  assert.equal((await act(room, 'maya', 'use-sabotage', { boosterId:'ink-bomb', teamId:target.id })).status, 200);
  const victim = await read(room, 'jordan');
  assert.deepEqual(own(victim).sabotagedBy, { teamId: own(room).id, teamName: own(room).name, boosterId: 'ink-bomb' });
  assert.equal((await act(room, 'jordan', 'vote', ballot(victim))).status, 409);
});

async function waitFor(predicate) {
  const deadline = Date.now() + 4000;
  while (!predicate()) { if (Date.now() > deadline) throw new Error('Timed out waiting for realtime message'); await new Promise(resolve => setTimeout(resolve, 10)); }
}

const storedTeam = (room, id) => fixture.rows.find(row => row.id === room.id).payload.teams.find(team => team.id === id);
async function attackMaya(id = 'ink-bomb', english = false, coins = 300) {
  const room = await race(english), victim = own(room), attacker = own(await read(room, 'jordan'));
  storedTeam(room, attacker.id).coins = coins;
  const result = await act(room, 'jordan', 'buy-sabotage', { boosterId: id, teamId: victim.id });
  assert.equal(result.status, 200);
  assert.equal((await act(room, 'jordan', 'use-sabotage', {boosterId:id,teamId:victim.id,questionIndex:1,choiceId:'B'})).status,200); return read(room);
}

test('correct answers earn 100, streak milestones add increasing bonuses and mistakes reset the streak', async () => {
  let room = await race();
  for (let i = 0; i < 3; i++) room = await bothReady(await draft(room));
  assert.equal(own(room).coins, 400); assert.equal(own(room).boosters, 0); assert.deepEqual(own(room).inventory, {});
  room = await bothReady(await draft(room, 'B')); assert.equal(own(room).streak, 0); assert.equal(own(room).coins, 400);
  for (let i = 0; i < 2; i++) room = await bothReady(await draft(room));
  assert.equal(own(room).coins, 600); assert.equal(own(room).streak, 2);
  room = await race();
  for (let i = 0; i < 6; i++) room = await bothReady(await draft(room));
  assert.equal(own(room).coins, 900); assert.equal(own(room).streak, 6);
  assert.equal(room.teams.some(team => team.inkBomb || team.blockedUntil), false);
});

test('shop validates ownership, balance, target and item; concurrent teammates cannot overspend a coin', async () => {
  let room = await race(); const mine = own(room), target = own(await read(room, 'jordan'));
  const purchase = { boosterId: 'ink-bomb', teamId: target.id, cost: 0, coins: 999 };
  assert.equal((await act(room, 'maya', 'buy-sabotage', purchase)).status, 400);
  for (const token of ['teacher', 'outsider']) assert.equal((await act(room, token, 'buy-sabotage', purchase)).status, 403);
  for (let i = 0; i < 3; i++) room = await bothReady(await draft(room));
  for (const invalid of [{...purchase, boosterId:'blackout'}, {...purchase, boosterId:'made-up'}]) {
    assert.equal((await act(room, 'maya', 'buy-sabotage', invalid)).status, 400);
    assert.equal(own(await read(room)).coins, 400);
  }
  fixture.conflict(2);
  const purchases = await Promise.all(['maya','alex'].map(token => act(room, token, 'buy-sabotage', purchase)));
  assert.deepEqual(purchases.map(result => result.status).sort(), [200,400]);
  room = await read(room); assert.equal(own(room).coins, 100);
  assert.equal(own(await read(room, 'jordan')).inkBomb, undefined);
  assert.equal(own(room).inventory['ink-bomb'],1);
  for(const teamId of [mine.id,'missing']) assert.equal((await act(room,'maya','use-sabotage',{boosterId:'ink-bomb',teamId})).status,400);
  for(const token of ['teacher','outsider','jordan']) assert.notEqual((await act(room,token,'use-sabotage',purchase)).status,200);
  fixture.conflict(2);
  const uses=await Promise.all(['maya','alex'].map(token=>act(room,token,'use-sabotage',purchase)));
  assert.deepEqual(uses.map(result=>result.status).sort(),[200,400]);
  assert.deepEqual(own(await read(room)).inventory,{});
  assert.ok(own(await read(room,'jordan')).inkBomb);
});

test('ink cleanup is shared, deduplicated and persisted; only seven distinct current splats unlock the team', async () => {
  let room = await attackMaya('ink-bomb', false, 600), ink = own(room).inkBomb;
  assert.ok(ink.expiresAt - room.serverNow <= 30000 && ink.expiresAt - room.serverNow > 29000);
  const clear = splat => ({ inkId: ink.id, splat });
  assert.equal((await act(room, 'teacher', 'clear-ink', clear(0))).status, 403);
  assert.equal((await act(room, 'jordan', 'clear-ink', clear(0))).status, 409);
  for (const splat of [-1, 7, 1.5, '0']) assert.equal((await act(room, 'maya', 'clear-ink', clear(splat))).status, 400);
  assert.equal((await act(room, 'maya', 'clear-ink', { ...clear(0), inkId:'old' })).status, 409);
  assert.equal((await act(room, 'maya', 'draft', { questionId:room.current.question.id, index:0, answer:'A' })).status, 409);
  fixture.conflict(2);
  await Promise.all(['maya','alex','maya'].map(token => act(room, token, 'clear-ink', clear(0))));
  assert.deepEqual(own(await read(room, 'alex')).inkBomb.clearedSplats, [0]);
  for (let splat = 1; splat < 6; splat++) assert.equal((await act(room, 'alex', 'clear-ink', clear(splat))).status, 200);
  assert.equal((await act(room, 'maya', 'vote', ballot(room))).status, 409);
  assert.equal((await act(room, 'maya', 'clear-ink', clear(6))).status, 200);
  room = await bothReady(await draft(room)); assert.equal(own(room).index, 1);
  assert.equal((await act(room, 'jordan', 'buy-sabotage', { boosterId:'ink-bomb' })).status, 200);
  assert.equal((await act(room, 'jordan', 'use-sabotage', { boosterId:'ink-bomb', teamId:own(room).id })).status, 200);
  assert.equal((await act(room, 'maya', 'clear-ink', clear(0))).status, 409);
  assert.deepEqual(own(await read(room)).inkBomb.clearedSplats, []);
});

test('ink expires on the server without clicks and cannot be stacked or refreshed by another purchase', async () => {
  let room = await attackMaya('ink-bomb', false, 600), victim = own(room), jordan = own(await read(room, 'jordan'));
  const expiresAt = victim.inkBomb.expiresAt;
  assert.equal((await act(room, 'jordan', 'buy-sabotage', { boosterId:'ink-bomb' })).status, 200);
  assert.equal((await act(room, 'jordan', 'use-sabotage', { boosterId:'ink-bomb', teamId:victim.id })).status, 400);
  assert.equal(own(await read(room,'jordan')).inventory['ink-bomb'],1);
  assert.equal(own(await read(room, 'jordan')).coins, 0); assert.equal(own(await read(room)).inkBomb.expiresAt, expiresAt);
  storedTeam(room, victim.id).inkBomb.expiresAt = Date.now() - 1;
  room = await bothReady(await draft(room)); assert.equal(own(room).index, 1);
  assert.equal(storedTeam(room, jordan.id).coins, 0);
});

test('landmine remains hidden on its chosen question and choice, then deducts 100 without a blackout', async () => {
  let room = await attackMaya('landmine'), victimId = own(room).id; storedTeam(room,victimId).coins=250;
  for (const token of ['maya','alex','jordan']) {
    const view = await read(room, token); assert.equal(JSON.stringify(view).includes('"landmine":'), false);
  }
  const observed = (await call(`/${room.id}?teamId=${victimId}`)).data.room;
  assert.equal(observed.teams.find(team => team.id === victimId).landmines[0].questionIndex, 1);
  room = await bothReady(await draft(room, 'B')); // The question already on screen is not trapped.
  assert.equal(own(room).blockedUntil, 0); assert.equal(storedTeam(room, victimId).landmines.length, 1);
  room = await bothReady(await draft(room, 'B'));
  const victim = own(room); assert.equal(victim.index, 2); assert.equal(victim.landmineResult.outcome, 'triggered');
  assert.equal(victim.blockedUntil,0); assert.equal(victim.coins,150); assert.equal(victim.landmineResult.coinsLost,100);
  assert.equal(victim.sabotagedBy.teamName, 'Team 2'); assert.equal(storedTeam(room, victimId).landmine, undefined);
  assert.equal((await act(room, 'maya', 'buy-sabotage', {boosterId:'ink-bomb',teamId:'team-2'})).status, 400);
  storedTeam(room, victimId).blockedUntil = Date.now() - 1;
  room = await bothReady(await draft(room)); assert.equal(own(room).index, 3);
});

test('a correct trapped answer disarms a landmine without blocking, and passage traps grade atomically', async () => {
  let room = await attackMaya('landmine');
  room = await bothReady(await draft(room)); room = await bothReady(await draft(room));
  assert.equal(own(room).landmineResult.outcome, 'disarmed'); assert.equal(own(room).blockedUntil, 0);
  assert.equal(storedTeam(room, own(room).id).landmine, undefined);
  room = await attackMaya('landmine', true);
  room = await bothReady(await draft(room));
  room = await bothReady(await draft(room, 'B', 1));
  assert.equal(own(room).step, 2); assert.equal(own(room).score, 0); assert.equal(own(room).blockedUntil, 0);
  room = await bothReady(room);
  assert.equal(own(room).score, 1); assert.equal(own(room).index, 2); assert.equal(own(room).landmineResult.outcome, 'triggered');
});

test('legacy blackout inventory becomes coins; invalid targets and disabled party mode never charge', async () => {
  let room = await race(); const mine = own(room), target = own(await read(room, 'jordan'));
  const saved = storedTeam(room, mine.id); delete saved.coins; saved.boosters = 2; saved.inventory = {blackout:2};
  assert.equal(own(await read(room)).coins, 600);
  storedTeam(room, target.id).index = room.totalQuestions - 1;
  assert.equal((await act(room, 'maya', 'buy-sabotage', {boosterId:'landmine'})).status, 200);
  assert.equal((await act(room, 'maya', 'use-sabotage', {boosterId:'landmine',teamId:target.id})).status, 400);
  assert.equal(own(await read(room)).coins, 300);
  assert.equal(own(await read(room)).inventory.landmine, 1);
  fixture.rows.find(row => row.id === room.id).payload.party = false;
  assert.equal((await act(room, 'maya', 'buy-sabotage', {boosterId:'ink-bomb',teamId:target.id})).status, 400);
  fixture.rows.find(row => row.id === room.id).payload.party = true;
  assert.equal((await act(room, 'maya', 'buy-sabotage', {boosterId:'ink-bomb',teamId:target.id})).status, 200);
  room = await read(room); assert.equal(own(room).coins, 0); assert.equal(storedTeam(room, mine.id).boosters, 0); assert.deepEqual(storedTeam(room, mine.id).inventory, {landmine:1,'ink-bomb':1});
  assert.equal((await act(room,'maya','use-sabotage',{boosterId:'ink-bomb',teamId:target.id})).status,200);
  assert.deepEqual(own(await read(room)).inventory,{landmine:1});
});
test('chosen mines validate placement, allow the final question, and do not explode on another wrong choice or a correct choice', async () => {
  let room = await race(), victim = own(room), attacker = own(await read(room,'jordan'));
  storedTeam(room,attacker.id).inventory = {landmine:5};
  const plant = body => act(room,'jordan','use-sabotage',{boosterId:'landmine',teamId:victim.id,...body});
  for(const body of [{},{questionIndex:-1,choiceId:'B'},{questionIndex:1.5,choiceId:'B'},{questionIndex:99,choiceId:'B'},{questionIndex:0,choiceId:'Z'}]) assert.equal((await plant(body)).status,400);
  assert.equal(storedTeam(room,attacker.id).inventory.landmine,5);
  assert.equal((await plant({questionIndex:0,choiceId:'B'})).status,200);
  storedTeam(room,victim.id).coins=80;
  room = await bothReady(await draft(room,'C')); assert.equal(own(room).landmineResult.outcome,'avoided'); assert.equal(own(room).coins,80);
  assert.equal((await plant({questionIndex:0,choiceId:'B'})).status,400); // Already submitted.
  assert.equal((await plant({questionIndex:1,choiceId:'A'})).status,200);
  room = await bothReady(await draft(room,'A')); assert.equal(own(room).landmineResult.outcome,'defused'); assert.equal(own(room).coins,180);
  assert.equal((await plant({questionIndex:2,choiceId:'B'})).status,200);
  storedTeam(room,victim.id).coins=80;
  room = await bothReady(await draft(room,'B')); assert.equal(own(room).coins,0); assert.equal(own(room).landmineResult.coinsLost,80);
  assert.equal((await plant({questionIndex:room.totalQuestions-1,choiceId:'B'})).status,200);
  const choices=room.mineTargets.find(team=>team.teamId===attacker.id).questions;
  assert.ok(choices.every(item=>!('correctChoiceId' in item)&&!('prompt' in item)));
});

test('passage coins and trap loss settle together, while long streak bonuses grow at every third correct answer', async () => {
  let room=await attackMaya('landmine',true);
  room=await bothReady(await draft(room,'A')); room=await bothReady(await draft(room,'B',1));
  assert.equal(own(room).coins,0); assert.equal(own(room).coinReceipt,undefined);
  room=await bothReady(room); assert.equal(own(room).coins,0); assert.equal(own(room).landmineResult.coinsLost,100);
  assert.equal(own(room).coinReceipt.base,100); assert.equal(own(room).coinReceipt.penalty,100);
  room=await race();
  const payload=fixture.rows.find(row=>row.id===room.id).payload;
  const extra=payload.questions.map((item,index)=>({...item,question:{...item.question,id:'extra-'+index}}));payload.questions.push(...extra);
  const expected=[100,200,400,500,600,900,1000,1100,1500,1600,1700,2200];
  for(const coins of expected) { room=await bothReady(await draft(room)); assert.equal(own(room).coins,coins); }
});

test('multiple landmines persist under concurrent placement, stay hidden, and resolve only their question', async () => {
  let room = await race(); const victim = own(room), attacker = own(await read(room, 'jordan'));
  storedTeam(room, attacker.id).inventory = { landmine: 4 };
  storedTeam(room, victim.id).coins = 350;
  fixture.conflict(2);
  const planted = await Promise.all([0,0,1,2].map(questionIndex => act(room, 'jordan', 'use-sabotage', { boosterId:'landmine', teamId:victim.id, questionIndex, choiceId:'B' })));
  assert.ok(planted.every(result => result.status === 200));
  assert.equal(storedTeam(room, victim.id).landmines.length,4);
  assert.equal(new Set(storedTeam(room, victim.id).landmines.map(mine => mine.id)).size,4);
  assert.deepEqual(storedTeam(room, attacker.id).inventory,{});
  assert.equal((await act(room,'jordan','use-sabotage',{boosterId:'landmine',teamId:victim.id,questionIndex:0,choiceId:'B'})).status,400);
  for (const token of ['maya','alex','jordan']) {
    const view = await read(room, token);
    assert.ok(view.teams.every(team => team.landmine === undefined && team.landmines === undefined));
  }
  const stale = ballot(await draft(room,'B'));
  room = await bothReady(await read(room));
  assert.equal(own(room).coins,150); assert.equal(own(room).coinReceipt.penalty,200);
  assert.equal(own(room).landmineResult.traps.length,2);
  assert.deepEqual(storedTeam(room,victim.id).landmines.map(mine=>mine.questionIndex).sort(),[1,2]);
  assert.equal((await act(room,'maya','vote',stale)).status,409);
  assert.equal(own(await read(room)).coins,150);
  room = await bothReady(await draft(room,'A'));
  assert.equal(own(room).landmineResult.outcome,'disarmed'); assert.equal(own(room).coins,250);
  assert.equal(storedTeam(room,victim.id).landmines.length,1);
});

test('mixed passage traps settle together, correct mined choices defuse, and old saved mines migrate', async () => {
  let room = await race(true); const victim=own(room), attacker=own(await read(room,'jordan'));
  storedTeam(room,victim.id).landmine={questionIndex:0,choiceId:'A',source:{teamId:attacker.id,teamName:attacker.name,boosterId:'landmine'}};
  storedTeam(room,attacker.id).inventory={landmine:3};
  for (const questionIndex of [1,1,2]) assert.equal((await act(room,'jordan','use-sabotage',{boosterId:'landmine',teamId:victim.id,questionIndex,choiceId:'B'})).status,200);
  assert.equal(storedTeam(room,victim.id).landmine,undefined);
  assert.equal(storedTeam(room,victim.id).landmines.length,4);
  room=await bothReady(await draft(room,'A')); room=await bothReady(await draft(room,'B',1));
  assert.equal(own(room).landmineResult,undefined); assert.equal(own(room).coins,0);
  room=await bothReady(room);
  assert.equal(own(room).coins,0); assert.equal(own(room).coinReceipt.penalty,100);
  assert.equal(own(room).landmineResult.coinsLost,100);
  assert.deepEqual(own(room).landmineResult.traps.map(trap=>trap.outcome),['defused','triggered','triggered']);
  assert.equal(storedTeam(room,victim.id).landmines.length,1);
});

test('mines can coexist with ink and simultaneous splat clears persist without losing a click', async () => {
  let room=await attackMaya('ink-bomb'); const victim=own(room), ink=victim.inkBomb;
  storedTeam(room,'team-2').inventory={landmine:2};
  for(const questionIndex of [0,1])assert.equal((await act(room,'jordan','use-sabotage',{boosterId:'landmine',teamId:victim.id,questionIndex,choiceId:'A'})).status,200);
  fixture.conflict(2);
  const clears=await Promise.all(Array.from({length:7},(_,splat)=>act(room,splat%2?'alex':'maya','clear-ink',{inkId:ink.id,splat})));
  assert.ok(clears.every(result=>result.status===200));
  assert.equal(own(await read(room)).inkBomb.clearedSplats.length,7);
  room=await bothReady(await draft(room,'A'));
  assert.equal(own(room).landmineResult.outcome,'defused');
  assert.equal(own(room).coins,100); assert.equal(storedTeam(room,victim.id).landmines.length,1);
});

test('team chat is persisted, private, bounded, deduplicated and available during sabotage', async () => {
  let room=await attackMaya('ink-bomb');
  const message={text:'  I think A because 4 × 3 = 12.  ',messageId:'chat-test-0001',teamId:'team-2',name:'Spoof',playerId:fixture.users.jordan.id};
  fixture.conflict(2);
  const results=await Promise.all([act(room,'maya','chat',message),act(room,'maya','chat',message)]);
  assert.ok(results.every(result=>result.status===200));
  const alex=await read(room,'alex');assert.equal(alex.teamChat.length,1);assert.equal(alex.teamChat[0].name,'Maya Chen');assert.equal(alex.teamChat[0].playerId,fixture.users.maya.id);assert.equal(alex.teamChat[0].text,'I think A because 4 × 3 = 12.');
  assert.equal(alex.teams.some(team=>'messages' in team),false);
  assert.deepEqual((await read(room,'jordan')).teamChat,[]);assert.equal(JSON.stringify(await read(room,'jordan')).includes('I think A'),false);
  assert.equal((await call('/'+room.id+'?teamId='+own(room).id)).data.room.teamChat.length,1);
  assert.equal((await call('/'+room.id+'?teamId='+own(room).id,'jordan')).status,403);
  const secondServer=await fetch(roots[1]+'/'+room.id,{headers:{Authorization:'Bearer alex'}});assert.equal((await secondServer.json()).room.teamChat.length,1);
  assert.equal((await act(room,'maya','chat',{...message,messageId:'chat-test-0002'})).status,429);
  for(const text of ['', ' '.repeat(10), 'x'.repeat(501), {html:'<img>'}]) assert.equal((await act(room,'alex','chat',{text,messageId:'chat-test-invalid'})).status,400);
  for(const token of ['outsider','teacher'])assert.equal((await act(room,token,'chat',message)).status,403);
  await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:false});assert.equal((await act(room,'alex','chat',{text:'hello',messageId:'chat-test-away'})).status,403);
  storedTeam(room,own(room).id).messages=Array.from({length:100},(_,i)=>({id:'prior-'+i,playerId:fixture.users.alex.id,name:'Alex',text:'Earlier message',at:i}));
  assert.equal((await act(room,'maya','chat',{text:'Latest',messageId:'chat-test-latest'})).status,200);
  room=await read(room);assert.equal(room.teamChat.length,100);assert.equal(room.teamChat[0].id,'prior-1');assert.equal(room.teamChat.at(-1).text,'Latest');
});

async function connect(t, room, token, teamId, instance = 0) {
  const ws = new WebSocket(roots[instance].replace('http:', 'ws:') + '/live');
  t.after(() => ws.terminate());
  const messages = []; let closed;
  ws.on('message', raw => messages.push(JSON.parse(raw.toString()))); ws.on('close', code => { closed = code; });
  await once(ws, 'open'); ws.send(JSON.stringify({ type: 'join', token, roomId: room.id, ...(teamId ? { teamId } : {}) }));
  await waitFor(() => closed || messages.some(message => message.type === 'ready'));
  return { ws, messages, closed, latest: () => messages.filter(message => message.type === 'presence').at(-1)?.peers ?? [] };
}

test('host can excuse and restore a departing teammate without losing progress or allowing stale votes', async t => {
  let room = await bothReady(await draft(await race()));
  room = await draft(room); const stale = ballot(room), original = own(room);
  await act(room,'maya','vote',stale);
  for (const token of ['maya','alex','outsider','otherTeacher']) {
    assert.equal((await act(room,token,'set-participation',{playerId:fixture.users.alex.id,active:false})).status,403);
  }
  assert.equal((await act(room,'teacher','set-participation',{playerId:'missing',active:false})).status,400);
  assert.equal((await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:'false'})).status,400);
  fixture.conflict(2);
  assert.equal((await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:false})).status,200);
  room = await read(room);
  assert.equal(own(room).index,original.index); assert.equal(own(room).score,original.score);
  assert.deepEqual(own(room).drafts,original.drafts); assert.deepEqual(own(room).readyIds,[]);
  assert.ok(room.players.find(player=>player.id===fixture.users.alex.id).excusedAt);
  assert.equal((await act(room,'maya','vote',stale)).status,409);
  const absent = await read(room,'alex'); assert.ok(absent.me.excusedAt);
  for (const action of ['draft','vote','review','unvote','buy-sabotage','use-sabotage','clear-ink']) assert.equal((await act(room,'alex',action,ballot(room))).status,403);
  const cursor = await connect(t,room,'alex'); assert.equal(cursor.closed,4003);
  assert.ok((await call('/join','alex','POST',{code:room.code})).data.room.me.excusedAt);
  assert.equal((await act(room,'maya','vote',ballot(room))).status,200);
  room = await read(room); assert.equal(own(room).index,2); assert.equal(own(room).score,2);
  room = await draft(room); const beforeReturn = ballot(room);
  assert.equal((await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:true})).status,200);
  assert.equal((await act(room,'maya','vote',beforeReturn)).status,409);
  room = await read(room); assert.equal(room.players.find(player=>player.id===fixture.users.alex.id).excusedAt,undefined);
  await act(room,'maya','vote',ballot(room));
  assert.equal(own(await read(room)).index,2);
  room = await bothReady(room); assert.equal(own(room).index,3); assert.equal(own(room).coins,400);
});

test('departure during a passage keeps its answers and remaining teammate can finish every step', async () => {
  let room = await bothReady(await draft(await race(true)));
  await act(room,'teacher','set-participation',{playerId:fixture.users.alex.id,active:false});
  room = await draft(room,'A',1);
  room = (await act(room,'maya','vote',ballot(room))).data.room;
  assert.equal(own(room).step,2); assert.equal(own(room).score,0);
  room = (await act(room,'maya','vote',ballot(room))).data.room;
  assert.equal(own(room).score,2); assert.equal(own(room).index,2);
});

test('fully absent teams cannot be targeted and do not prevent the remaining team from finishing', async () => {
  let room = await race();
  await act(room,'teacher','set-participation',{playerId:fixture.users.jordan.id,active:false});
  storedTeam(room,own(room).id).coins = 300;
  assert.equal((await act(room,'maya','buy-sabotage',{boosterId:'ink-bomb'})).status,200);
  assert.equal((await act(room,'maya','use-sabotage',{boosterId:'ink-bomb',teamId:'team-2'})).status,400);
  assert.equal(own(await read(room)).inventory['ink-bomb'],1);
  for(let i=0;i<6;i++) room=await bothReady(await draft(room));
  assert.equal(room.phase,'finished'); assert.equal(room.teams[1].index,0);
  assert.deepEqual(room.winners,[own(room).id]);
});

test('inventory survives reconnects, new coins and other purchases until explicitly used', async () => {
  let room=await race(); storedTeam(room,own(room).id).coins=600;
  for(const boosterId of ['landmine','ink-bomb']) assert.equal((await act(room,'maya','buy-sabotage',{boosterId,teamId:'team-2'})).status,200);
  room=await read(room,'alex'); assert.deepEqual(own(room).inventory,{landmine:1,'ink-bomb':1});
  assert.equal(room.teams[1].inkBomb,undefined); assert.equal(storedTeam(room,'team-2').landmine,undefined);
  for(let i=0;i<3;i++) room=await bothReady(await draft(room));
  assert.equal(own(room).coins,400); assert.deepEqual(own(room).inventory,{landmine:1,'ink-bomb':1});
  assert.equal((await act(room,'alex','use-sabotage',{boosterId:'landmine',teamId:'team-2',questionIndex:1,choiceId:'B'})).status,200);
  room=await read(room); assert.equal(own(room).coins,400); assert.deepEqual(own(room).inventory,{'ink-bomb':1});
  assert.equal((await act(room,'maya','use-sabotage',{boosterId:'ink-bomb',teamId:'team-2'})).status,200);
  assert.deepEqual(own(await read(room)).inventory,{});
});
test('live cursors cross server instances, stay inside the team, and are visible to the observing host', async t => {
  const room = await race(), teamId = own(room).id;
  const maya = await connect(t, room, 'maya'), alex = await connect(t, room, 'alex', undefined, 1), jordan = await connect(t, room, 'jordan');
  const host = await connect(t, room, 'teacher', teamId, 1);
  const unauthorized = await connect(t, room, 'jordan', teamId); assert.equal(unauthorized.closed, 4003);
  const outsider = await connect(t, room, 'outsider'); assert.equal(outsider.closed, 4003);
  maya.ws.send(JSON.stringify({ type: 'cursor', cursor: { anchor: 'math', x: .2, y: .6, index: 0, step: 0 }, name: 'Spoof', teamId: 'team-2' }));
  await waitFor(() => alex.latest().some(peer => peer.playerId === fixture.users.maya.id) && host.latest().some(peer => peer.playerId === fixture.users.maya.id));
  const peer = alex.latest().find(peer => peer.playerId === fixture.users.maya.id);
  assert.equal(peer.name, 'Maya Chen'); assert.equal(peer.teamId, teamId); assert.equal(peer.cursor.x, .2);
  assert.equal(jordan.messages.some(message => message.peers?.some(peer => peer.playerId === fixture.users.maya.id)), false);
  host.ws.send(JSON.stringify({ type: 'cursor', cursor: { anchor: 'math', x: 1, y: 1, index: 0, step: 0 } }));
  maya.ws.close();
  await waitFor(() => !alex.latest().some(peer => peer.playerId === fixture.users.maya.id));
  assert.ok(alex.latest().every(peer => peer.playerId !== fixture.users.teacher.id));
  const refreshed = await connect(t, room, 'maya');
  refreshed.ws.send(JSON.stringify({ type: 'cursor', cursor: { anchor: 'math', x: .4, y: .3, index: 0, step: 0 } }));
  await waitFor(() => alex.latest().some(peer => peer.playerId === fixture.users.maya.id));
  refreshed.ws.send(JSON.stringify({ type: 'cursor', cursor: { anchor: 'math', x: 5, y: 0, index: 0, step: 0 } }));
  assert.equal((await once(refreshed.ws, 'close'))[0], 1008);
});
