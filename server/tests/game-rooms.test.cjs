const {test,before,after}=require('node:test'),assert=require('node:assert/strict');
const fixture=require('./helpers/game-fixture.cjs');
let server,root;
before(async()=>{const express=require('express'),app=express();app.use(express.json());app.use('/api/game-rooms',fixture.router);server=await new Promise(resolve=>{const instance=app.listen(0,'127.0.0.1',()=>resolve(instance));});root=`http://127.0.0.1:${server.address().port}/api/game-rooms`;});
after(async()=>{await new Promise(resolve=>server.close(resolve));});
async function call(url,token='teacher',method='GET',body){const response=await fetch(root+url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return{status:response.status,data:await response.json()};}
const act=(room,token,action,body={})=>call(`/${room.id}/action`,token,'POST',{action,...body});
async function lobby(mode='survival'){const response=await call('/','teacher','POST',{mode,assessmentId:fixture.content.assessmentId,party:true});assert.equal(response.status,201);const room=response.data.room;for(const token of ['maya','jordan'])assert.equal((await call('/join',token,'POST',{code:room.code})).status,200);return room;}
const answer=(room,choice='A')=>({answer:choice,questionId:room.current.question.id,round:room.round,index:room.teams.find(team=>team.id===room.me?.teamId)?.index});
const vote = room => { const team=room.teams.find(team=>team.id===room.me?.teamId); return {questionId:room.unit[0].question.id,index:team.index,step:team.step??0,draftVersion:team.draftVersion??0}; };
async function choose(room,token,choice='A') { const current=(await call(`/${room.id}`,token)).data.room; const result=await act(current,token,'draft',answer(current,choice)); assert.equal(result.status,200); return result.data.room; }

test('ending and deleting rooms remove them from both lists and reject reconnects and joins',async()=>{
 const room=await lobby('teams');
 assert.equal((await call(`/${room.id}`,'maya','DELETE')).status,403);
 assert.equal((await act(room,'teacher','finish')).status,200);
 for(const token of ['teacher','maya']) {
  assert.equal((await call('/',token)).data.rooms.some(item=>item.id===room.id),false);
  assert.equal((await call(`/${room.id}`,token)).status,410);
 }
 assert.equal((await call('/join','jordan','POST',{code:room.code})).status,410);
 const other=await lobby();assert.equal((await call(`/${other.id}`,'teacher','DELETE')).status,200);
 assert.equal((await act(other,'teacher','start')).status,410);
});

test('English drafts do not score, complete passages score atomically, and Math scores each question',async()=>{
 let room=(await call('/','teacher','POST',{mode:'teams',assessmentId:fixture.englishContent.assessmentId,party:true,playtest:true})).data.room;
 await act(room,'teacher','test-auto',{enabled:false});room=(await act(room,'teacher','start')).data.room;
 assert.equal(room.unit.length,2);assert.equal(JSON.stringify(room.unit).includes('correctChoiceId'),false);
 const body={...answer(room),playtestPlayerId:room.me.id};
 room=(await act(room,'teacher','draft',body)).data.room;
 assert.equal(room.teams[0].score,0);assert.equal(room.teams[0].index,0);
 assert.equal((await act(room,'teacher','answer',body)).status,409);
 assert.equal((await call(`/${room.id}`)).data.room.teams[0].score,0);
 assert.equal((await act(room,'teacher','test-answer',{correct:true})).status,200);
 room=(await call(`/${room.id}`)).data.room;assert.equal(room.teams[0].step,1);assert.equal(room.teams[0].score,0);
 room=(await act(room,'teacher','test-answer',{correct:true})).data.room;assert.equal(room.teams[0].step,2);assert.equal(room.teams[0].score,0);
 assert.equal((await act(room,'teacher','test-next')).status,200);
 room=(await call(`/${room.id}`)).data.room;assert.equal(room.teams[0].score,2);assert.equal(room.teams[0].index,2);assert.equal(room.unit.length,1);assert.equal(room.current.subject,'Math');
 room=(await act(room,'teacher','test-answer',{correct:true})).data.room;
 assert.equal(room.teams[0].score,3);assert.equal(room.teams[0].coins,400);
});

test('sandbox selections affect only the current question and submit advances exactly one step',async()=>{
 let room=await playtest('teams',{assessmentId:fixture.englishContent.assessmentId});room=(await act(room,'teacher','start')).data.room;
 const context=()=>({...vote(room),questionId:room.unit[room.teams[0].step??0]?.question.id??room.unit[0].question.id,playtestPlayerId:room.me.id});
 const command=async(action,body={})=>{const result=await act(room,'teacher',action,{...context(),...body});assert.equal(result.status,200,JSON.stringify(result.data));room=result.data.room;};
 const firstContext=context();
 await command('test-select',{correct:true});
 assert.deepEqual(room.myAnswers,{'reading-0':'A'});assert.equal(room.teams[0].step??0,0);assert.equal(room.teams[0].score,0);assert.equal(room.teams[0].coins??0,0);assert.equal(room.teams[0].streak,0);
 assert.equal((await act(room,'teacher','test-next',firstContext)).status,409,'reject outdated selection version');
 await command('test-select',{correct:false});assert.notEqual(room.myAnswers['reading-0'],'A');assert.equal(room.myAnswers['reading-1'],undefined);
 await command('test-select',{correct:true});
 const submission=context();
 const concurrent=await Promise.all([act(room,'teacher','test-next',submission),act(room,'teacher','test-next',submission)]);
 assert.deepEqual(concurrent.map(result=>result.status).sort(),[200,409]);room=(await call('/'+room.id)).data.room;
 assert.equal(room.teams[0].index,0);assert.equal(room.teams[0].step,1);assert.equal(room.teams[0].score,0);assert.equal(room.teams[0].coins??0,0);assert.equal(room.teams[0].streak,1);
 assert.deepEqual(room.myAnswers,{'reading-0':'A'});
 await command('test-teammate');assert.deepEqual(room.myAnswers,{'reading-0':'A','reading-1':'A'});assert.equal(room.teams[0].step,1);
 await command('test-select',{correct:false});assert.equal(room.myAnswers['reading-0'],'A');assert.notEqual(room.myAnswers['reading-1'],'A');
 await command('test-next');assert.equal(room.teams[0].step,2);assert.equal(room.teams[0].score,0);assert.equal(room.teams[0].streak,0);
 assert.equal((await act(room,'teacher','test-select',{...context(),correct:true})).status,409,'review cannot overwrite answers');
 await command('test-next');assert.equal(room.teams[0].index,2);assert.equal(room.teams[0].score,1);assert.equal(room.teams[0].coins,100);
 const stale=context(),teammate=room.players.find(player=>player.id!==room.me.id&&player.teamId===room.me.teamId);
 room=(await act(room,'teacher','test-control',{playerId:teammate.id})).data.room;
 for(const action of ['test-select','test-next','test-teammate','test-team-ready'])assert.equal((await act(room,'teacher',action,{...stale,correct:true})).status,409,'reject stale viewpoint for '+action);
 const live=await lobby('teams');for(const action of ['test-select','test-next'])assert.equal((await act(live,'teacher',action,{correct:true})).status,403);
 for(const action of ['test-select','test-next'])assert.equal((await act(room,'maya',action,{correct:true})).status,403);
});

test('survival sandbox selects only the visible passage question without submitting the round',async()=>{
 let room=await playtest('survival');
 const row=fixture.rows.find(row=>row.id===room.id),passage=fixture.englishContent.passageSets[0];
 row.payload.questions=passage.questions.map(question=>({question,passage:passage.passage,subject:'English'}));
 room=(await act(room,'teacher','start')).data.room;
 const context=questionId=>({questionId,index:room.round,step:0,draftVersion:0,playtestPlayerId:room.me.id});
 room=(await act(room,'teacher','test-select',{...context('reading-1'),correct:true})).data.room;
 assert.deepEqual(room.myAnswers,{'reading-1':'A'});assert.equal(room.answeredIds.includes(room.me.id),false);assert.equal(room.me.score,0);
 assert.equal((await act(room,'teacher','test-select',{...context('other-question'),correct:true})).status,409);
 room=(await act(room,'teacher','test-select',{...context('reading-0'),correct:false})).data.room;
 assert.equal(room.myAnswers['reading-1'],'A');assert.notEqual(room.myAnswers['reading-0'],'A');assert.equal(room.answeredIds.includes(room.me.id),false);
 room=(await act(room,'teacher','test-next',context('reading-1'))).data.room;
 assert.equal(room.answeredIds.includes(room.me.id),true);
 assert.equal((await act(room,'teacher','test-select',{...context('reading-1'),correct:false})).status,409);
 room=(await act(room,'teacher','test-step')).data.room;assert.equal(room.me.score,1);
});

test('private playtest can enable the shop, grant coins and purchase sabotage without a streak',async()=>{
 let room=await playtest('teams',{party:false});room=(await act(room,'teacher','start')).data.room;
 assert.equal((await act(room,'teacher','test-coins',{boosterId:'ink-bomb'})).status,400);
 room=(await act(room,'teacher','test-party',{enabled:true})).data.room;
 assert.equal((await act(room,'teacher','buy-sabotage',{boosterId:'invented',playtestPlayerId:room.me.id})).status,400);
 room=(await act(room,'teacher','test-coins',{boosterId:'ink-bomb'})).data.room;
 const mine=room.teams.find(item=>item.id===room.me.teamId),opponent=room.teams.find(item=>item.id!==mine.id);
 assert.equal(mine.coins,300);assert.equal(mine.streak,0);
 room=(await act(room,'teacher','buy-sabotage',{boosterId:'ink-bomb',teamId:opponent.id,playtestPlayerId:room.me.id})).data.room;
 assert.equal(room.teams.find(item=>item.id===mine.id).coins,0);
 assert.equal(room.teams.find(item=>item.id===mine.id).inventory['ink-bomb'],1);
 assert.equal(room.teams.find(item=>item.id===opponent.id).inkBomb,undefined);
 room=(await act(room,'teacher','use-sabotage',{boosterId:'ink-bomb',teamId:opponent.id,playtestPlayerId:room.me.id})).data.room;
 assert.ok(room.teams.find(item=>item.id===opponent.id).inkBomb.expiresAt>Date.now());
 assert.equal((await act(room,'teacher','buy-sabotage',{boosterId:'ink-bomb',teamId:opponent.id,playtestPlayerId:room.me.id})).status,400);
});

test('authentication, membership and host controls guard every route',async()=>{
 assert.equal((await call('/','invalid')).status,401);assert.equal((await call('/','staff')).status,403);assert.equal((await call('/','archived')).status,403);
 assert.equal((await call('/','maya','POST',{mode:'teams'})).status,403);assert.equal((await call('/catalog','maya')).status,403);
 const room=await lobby();assert.equal((await call(`/${room.id}`,'outsider')).status,403);assert.equal((await act(room,'maya','start')).status,403);
 assert.equal((await call('/','outsider')).data.rooms.length,0);assert.equal((await call('/join','maya','POST',{code:room.code})).data.room.players.length,2);
});
test('survival locks answers, eliminates mistakes, keeps the audience playing and runs a stealable final',async()=>{
 let room=await lobby();room=(await act(room,'teacher','start')).data.room;
 const first=(await call(`/${room.id}`,'maya')).data.room;const serialized=JSON.stringify(first);assert.equal(serialized.includes('correctChoiceId'),false);assert.equal(serialized.includes('explanation'),false);assert.equal(first.totalQuestions,6);
 assert.equal((await act(room,'maya','answer',answer(first,'B'))).status,200);assert.equal((await act(room,'maya','answer',answer(first))).status,409);
 let jordan=(await call(`/${room.id}`,'jordan')).data.room;room=(await act(room,'jordan','answer',answer(jordan))).data.room;assert.equal(room.phase,'reveal');assert.equal(room.players.find(player=>player.id===fixture.users.maya.id).alive,false);
 room=(await act(room,'teacher','next',{round:room.round})).data.room;assert.equal(room.finalRound,true);
 const audience=(await call(`/${room.id}`,'maya')).data.room;assert.equal((await act(room,'maya','answer',answer(audience))).status,200);
 jordan=(await call(`/${room.id}`,'jordan')).data.room;room=(await act(room,'jordan','answer',answer(jordan,'B'))).data.room;
 assert.equal(room.phase,'finished');assert.deepEqual(room.winners,[fixture.users.maya.id]);assert.equal((await call('/join','alex','POST',{code:room.code})).status,409);
});
test('team assignment, concurrent shared answers and server-enforced sabotage survive reconnects',async()=>{
 let room=await lobby('teams');assert.equal((await act(room,'teacher','start')).status,400);room=(await act(room,'teacher','balance')).data.room;room=(await act(room,'teacher','start')).data.room;
 let maya=(await call(`/${room.id}`,'maya')).data.room;const initial=answer(maya);
 fixture.conflict();assert.equal((await act(room,'maya','draft',initial)).status,200);maya=(await call(`/${room.id}`,'maya')).data.room;assert.equal(maya.teams.find(team=>team.id===maya.me.teamId).draft,'A');
 const parallel=await Promise.all([act(room,'maya','vote',vote(maya)),act(room,'maya','vote',vote(maya))]);assert.deepEqual(parallel.map(response=>response.status).sort(),[200,409]);
 for(let index=0;index<2;index++){maya=await choose(room,'maya');assert.equal((await act(room,'maya','vote',vote(maya))).status,200);}
 maya=(await call(`/${room.id}`,'maya')).data.room;const own=maya.teams.find(team=>team.id===maya.me.teamId),target=maya.teams.find(team=>team.id!==own.id);assert.equal(own.score,3);assert.equal(own.coins,400);
 assert.equal((await act(room,'maya','buy-sabotage',{boosterId:'ink-bomb',teamId:target.id})).status,200);assert.equal((await act(room,'maya','buy-sabotage',{boosterId:'ink-bomb',teamId:target.id})).status,400);
 assert.equal((await act(room,'maya','use-sabotage',{boosterId:'ink-bomb',teamId:target.id})).status,200);
 let jordan=(await call(`/${room.id}`,'jordan')).data.room;assert.ok(jordan.teams.find(team=>team.id===target.id).inkBomb.expiresAt>Date.now());assert.equal((await act(room,'jordan','answer',answer(jordan))).status,409);
 fixture.rows.find(row=>row.id===room.id).payload.teams.find(team=>team.id===target.id).inkBomb.expiresAt=Date.now()-1;
 jordan=await choose(room,'jordan');assert.equal((await act(room,'jordan','vote',vote(jordan))).status,200);
 room=(await act(room,'teacher','finish')).data.room;assert.equal(room.phase,'finished');assert.deepEqual(room.winners,[own.id]);
});
test('deadlines persist automatically and late answers cannot earn points',async()=>{
 const room=await lobby('teams');await act(room,'teacher','balance');await act(room,'teacher','start');let maya=(await call(`/${room.id}`,'maya')).data.room;
 fixture.rows.find(row=>row.id===room.id).payload.deadline=Date.now()-1;
 const late=await act(room,'maya','answer',answer(maya));assert.equal(late.data.room.phase,'finished');assert.equal(late.data.room.teams.every(team=>team.score===0),true);
 const survival=await lobby();await act(survival,'teacher','start');fixture.rows.find(row=>row.id===survival.id).payload.deadline=Date.now()-1;
 const reveal=(await call(`/${survival.id}`,'maya')).data.room;assert.equal(reveal.phase,'reveal');assert.equal(reveal.players.every(player=>!player.alive),true);assert.equal(reveal.reveal.correctChoiceId,'A');
});
test('nested answer keys never leak in current question payloads',()=>{
 const {publicGameQuestion}=require('../src/lib/gameEngine.ts');const item={subject:'Math',question:{id:'complex',type:'inline_dropdown',prompt:'Choose',topic:'Algebra',correctTextAnswers:['secret'],correctPlacements:{x:'secret'},explanation:'secret',correctChoiceIds:['a','b'],dropdowns:[{id:'slot',correctChoiceId:'secret',options:[]}],dragDropSlots:[{id:'slot',correctItemId:'secret'}],numberLineResponse:{correctDirection:'left',correctEndpoint:'closed',correctValue:99,min:0,max:10}}};
 const clean=publicGameQuestion(item);assert.equal(JSON.stringify(clean).includes('secret'),false);assert.equal(clean.question.requiredSelections,2);assert.equal(clean.question.numberLineResponse.min,0);
});
test('teammates share drafts; stale drafts cannot change a locked answer or a later question',async()=>{
 let room=await lobby('teams');await call('/join','alex','POST',{code:room.code});await act(room,'teacher','balance');await act(room,'teacher','start');
 const maya=(await call(`/${room.id}`,'maya')).data.room,first=answer(maya);await act(room,'maya','draft',first);
 const alex=(await call(`/${room.id}`,'alex')).data.room;assert.equal(alex.teams.find(team=>team.id===alex.me.teamId).draft,'A');
 assert.equal((await act(room,'alex','vote',vote(alex))).status,200);
 assert.equal((await call(`/${room.id}`,'maya')).data.room.teams[0].index,0);
 assert.equal((await act(room,'maya','vote',vote(maya))).status,409); // stale answer version
 const refreshed=(await call(`/${room.id}`,'maya')).data.room;
 assert.equal((await act(room,'maya','vote',vote(refreshed))).status,200);assert.equal((await act(room,'maya','draft',{...first,answer:'B'})).status,409);
 const saved=(await call(`/${room.id}`,'maya')).data.room,team=saved.teams.find(team=>team.id===saved.me.teamId);assert.equal(team.index,1);assert.equal(team.score,1);assert.equal(team.answers[0].answer,'A');assert.equal(team.draft,undefined);
});

async function playtest(mode='teams',extra={}) {
 const created=await call('/','teacher','POST',{mode,assessmentId:fixture.content.assessmentId,party:true,playtest:true,...extra});
 assert.equal(created.status,201); const room=created.data.room;
 assert.equal(room.canPlaytest,true); assert.equal(room.players.length,4); assert.ok(room.me); assert.equal(room.isHost,false);
 await act(room,'teacher','test-auto',{enabled:false}); return room;
}

test('sandbox wallet and inventory grants persist, unlimited purchases preserve balance, and live rooms reject every override',async()=>{
 let room=await playtest();
 const command=async(action,body={})=>{const result=await act(room,'teacher',action,{...body,playtestPlayerId:room.me?.id});assert.equal(result.status,200,JSON.stringify(result.data));room=result.data.room;};
 await command('test-coins',{amount:100});await command('test-inventory',{boosterId:'landmine',amount:10});await command('test-inventory',{boosterId:'ink-bomb',amount:10});
 await command('start');await command('test-wallet',{amount:0});await command('test-unlimited',{enabled:true});
 fixture.conflict();
 for(let i=0;i<4;i++)await command('buy-sabotage',{boosterId:i%2?'landmine':'ink-bomb'});
 room=(await call(`/${room.id}`)).data.room;
 assert.equal(room.teams[0].coins,0);assert.deepEqual(room.teams[0].inventory,{'landmine':12,'ink-bomb':12});assert.equal(room.playtest.unlimitedCoins,true);
 assert.equal((await act(room,'teacher','test-inventory',{boosterId:'invented',amount:10})).status,400);
 for(const amount of [-1,1.5,1000000])assert.equal((await act(room,'teacher','test-coins',{amount})).status,400);
 await command('test-unlimited',{enabled:false});assert.equal((await act(room,'teacher','buy-sabotage',{boosterId:'landmine',playtestPlayerId:room.me.id})).status,400);
 const live=await lobby('teams');
 for(const action of ['test-unlimited','test-wallet','test-inventory','test-clear-effects','test-jump','test-landmine-result','test-auto-ready','test-clock','test-view-target','test-return']) {
  assert.equal((await act(live,'teacher',action,{enabled:true,amount:100,question:1})).status,403);
  assert.equal((await act(room,'maya',action,{enabled:true})).status,403);
 }
 await act(live,'teacher','balance');await act(live,'teacher','start');
 assert.equal((await act(live,'maya','buy-sabotage',{boosterId:'landmine',unlimitedCoins:true,playtest:{unlimitedCoins:true}})).status,400);
});

test('sandbox follows the real landmine recipient, preserves sender, previews both outcomes and clears attacks',async()=>{
 let room=await playtest();
 const command=async(action,body={})=>{const result=await act(room,'teacher',action,{...body,playtestPlayerId:room.me?.id});assert.equal(result.status,200,JSON.stringify(result.data));room=result.data.room;};
 await command('start');const sender=room.me.id,target=room.teams[1].id;
 await command('test-unlimited',{enabled:true});await command('buy-sabotage',{boosterId:'landmine'});await command('use-sabotage',{boosterId:'landmine',teamId:target,questionIndex:1,choiceId:'B'});
 await command('test-view-target');assert.equal(room.me.teamId,target);assert.equal(room.playtest.autoPlay,false);
 await command('test-view-target');await command('test-return');assert.equal(room.me.id,sender);
 await command('test-view-target');await command('test-answer',{correct:true});assert.equal(room.teams[1].landmines[0].questionIndex,1);
 await command('test-answer',{correct:false});assert.equal(room.teams[1].landmineResult.outcome,'triggered');assert.equal(room.teams[1].blockedUntil,0);
 assert.equal(room.teams[1].landmineResult.coinsLost,100);assert.equal(room.teams[1].coins,0);
 await command('test-clear-effects');assert.equal(room.teams[1].blockedUntil,0);
 const score=room.teams[1].score, answers=room.teams[1].answers;
 await command('test-landmine-result',{outcome:'defused'});assert.equal(room.teams[1].landmineResult.outcome,'defused');
 await command('test-landmine-result',{outcome:'disarmed'});assert.equal(room.teams[1].landmineResult.outcome,'disarmed');assert.equal(room.teams[1].score,score);assert.deepEqual(room.teams[1].answers,answers);
 await command('test-landmine-result',{outcome:'triggered'});assert.equal(room.teams[1].blockedUntil,0);
 await command('test-clear-effects',{all:true});await command('test-sabotage',{boosterId:'ink-bomb'});assert.ok(room.teams[1].inkBomb.expiresAt>Date.now());
 await command('test-clear-effects',{all:true});assert.ok(room.teams.every(team=>!team.landmine&&!team.landmines?.length&&!team.landmineResult&&!team.inkBomb&&!team.blockedUntil));
 await command('test-sabotage',{boosterId:'landmine'});await command('test-sabotage',{boosterId:'landmine'});assert.equal(room.teams[1].landmines.length,2);
 await command('test-sabotage',{boosterId:'ink-bomb'});assert.equal(room.teams[1].landmines.length,2);assert.ok(room.teams[1].inkBomb);
 fixture.rows.find(row=>row.id===room.id).payload.teams[0].index=room.totalQuestions;
 await command('test-party',{enabled:false});await command('test-sabotage',{boosterId:'ink-bomb'});
 assert.equal(room.party,true);assert.ok(room.teams[1].inkBomb);const previousInk=room.teams[1].inkBomb.id;
 await command('test-sabotage',{boosterId:'ink-bomb'});assert.notEqual(room.teams[1].inkBomb.id,previousInk);
});

test('sandbox timer pause survives reads, resumes, and resets when a survival round ends',async()=>{
 let room=await playtest('teams',{testMinutes:1});room=(await act(room,'teacher','start')).data.room;
 room=(await act(room,'teacher','test-clock',{paused:true})).data.room;assert.equal(room.deadline,null);assert.ok(room.playtest.clockRemainingMs>50000);
 const remaining=room.playtest.clockRemainingMs;
 room=(await call(`/${room.id}`)).data.room;assert.equal(room.phase,'question');assert.equal(room.playtest.clockRemainingMs,remaining);
 room=(await act(room,'teacher','test-clock',{paused:false})).data.room;assert.ok(room.deadline>Date.now()+50000);assert.equal(room.playtest.clockRemainingMs,undefined);
 room=(await act(room,'teacher','test-clock',{paused:true})).data.room;room=(await act(room,'teacher','test-expire')).data.room;assert.equal(room.phase,'finished');assert.equal(room.playtest.clockRemainingMs,undefined);
 room=await playtest('survival',{questionCount:3});await act(room,'teacher','start');await act(room,'teacher','test-clock',{paused:true});await act(room,'teacher','test-answer',{correct:true});
 room=(await act(room,'teacher','test-step')).data.room;assert.equal(room.phase,'reveal');assert.equal(room.playtest.clockRemainingMs,undefined);
 room=(await act(room,'teacher','next',{round:room.round})).data.room;assert.ok(room.deadline>Date.now());
});

test('automatic teammate votes preserve passage grading and sandbox jumping can reopen finished teams',async()=>{
 let room=await playtest('teams',{assessmentId:fixture.englishContent.assessmentId});
 const command=async(action,body={})=>{const result=await act(room,'teacher',action,{...body,playtestPlayerId:room.me?.id});assert.equal(result.status,200,JSON.stringify(result.data));room=result.data.room;};
 await command('start');await command('test-auto-ready',{enabled:true});await command('test-inventory',{boosterId:'landmine',amount:10});await command('test-coins',{amount:100});
 for(const item of room.unit)await command('draft',{questionId:item.question.id,index:0,answer:'A'});
 await command('vote',vote(room));assert.equal(room.teams[0].step,1);assert.equal(room.teams[0].score,0);
 await command('vote',vote(room));assert.equal(room.teams[0].step,2);assert.equal(room.teams[0].score,0);
 await command('vote',vote(room));assert.equal(room.teams[0].index,2);assert.equal(room.teams[0].score,2);
 await command('draft',{...answer(room)});await command('vote',vote(room));assert.equal(room.teams[0].score,3);
 await command('test-expire');assert.equal(room.phase,'finished');await command('test-jump',{question:2});
 assert.equal(room.phase,'question');assert.equal(room.teams[0].index,0);assert.equal(room.teams[0].step,1);assert.equal(room.teams[0].score,0);assert.equal(room.teams[0].answers.length,0);assert.equal(room.teams[0].coins,500);assert.equal(room.teams[0].inventory.landmine,10);assert.equal(room.playtest.autoPlay,false);
 for(const question of [0,-1,1.5,room.totalQuestions+1])assert.equal((await act(room,'teacher','test-jump',{question})).status,400);
 await command('test-select',{correct:true});assert.deepEqual(room.myAnswers,{'reading-1':'A'});assert.equal(room.teams[0].step,1);
 await command('review',{...vote(room),targetStep:0});
 await command('test-answer',{correct:true});assert.equal(room.teams[0].step,1);
 await command('test-next');assert.equal(room.teams[0].step,2);assert.equal(room.teams[0].score,0);
 await command('test-next');assert.equal(room.teams[0].index,2);assert.equal(room.teams[0].score,2);
});
test('solo playtests are private, persist across reconnects, and cannot enable test controls in class rooms',async()=>{
 const room=await playtest();
 assert.equal((await call('/join','maya','POST',{code:room.code})).status,403);
 assert.equal((await call(`/${room.id}`,'maya')).status,403);
 assert.equal((await act(room,'maya','test-control',{playerId:room.me.id})).status,403);
 assert.equal((await call('/','maya')).data.rooms.some(item=>item.id===room.id),false);
 assert.deepEqual(fixture.rows.find(row=>row.id===room.id).member_ids,[]);
 const refreshed=(await call(`/${room.id}`)).data.room;
 assert.equal(refreshed.me.id,room.me.id); assert.equal(refreshed.playtest.autoPlay,false);
 const live=await lobby('teams'); assert.equal((await act(live,'teacher','test-coins')).status,403);
 assert.equal((await call('/','maya','POST',{mode:'survival',playtest:true})).status,403);
});

test('only private playtests expose answer keys and simulated chat follows the controlled team',async()=>{
 let room=await playtest('teams',{assessmentId:fixture.englishContent.assessmentId});room=(await act(room,'teacher','start')).data.room;
 assert.deepEqual(room.playtestKeys.map(item=>item.answer),['A','A']);assert.equal(JSON.stringify(room.unit).includes('correctChoiceId'),false);
 const pilot=room.me,teammate=room.players.find(player=>player.id!==pilot.id&&player.teamId===pilot.teamId),opponent=room.players.find(player=>player.teamId!==pilot.teamId);
 assert.equal((await act(room,'teacher','chat',{text:'Meet at question two',messageId:'playtest-chat-001',playtestPlayerId:pilot.id})).status,200);
 room=(await act(room,'teacher','test-control',{playerId:teammate.id})).data.room;assert.equal(room.teamChat[0].name,pilot.name);
 room=(await act(room,'teacher','test-control',{playerId:opponent.id})).data.room;assert.deepEqual(room.teamChat,[]);
 assert.equal((await act(room,'teacher','chat',{text:'stale',messageId:'playtest-chat-002',playtestPlayerId:pilot.id})).status,409);
 const live=await lobby('teams');await act(live,'teacher','balance');await act(live,'teacher','start');
 for(const token of ['teacher','maya','jordan'])assert.equal((await call('/'+live.id,token)).data.room.playtestKeys,undefined);
});
test('one teacher can test teammate selections, stale perspective protection, streaks and both sides of sabotage',async()=>{
 let room=await playtest(); room=(await act(room,'teacher','start')).data.room;
 const pilot=room.me, teammate=room.players.find(player=>player.id!==pilot.id&&player.teamId===pilot.teamId), opponent=room.players.find(player=>player.teamId!==pilot.teamId);
 room=(await act(room,'teacher','test-teammate')).data.room;
 assert.equal(room.teams.find(team=>team.id===pilot.teamId).draft,'A');
 room=(await act(room,'teacher','test-control',{playerId:teammate.id})).data.room;
 assert.equal(room.teams.find(team=>team.id===teammate.teamId).draft,'A');
 assert.equal((await act(room,'teacher','draft',{...answer(room),playtestPlayerId:pilot.id})).status,409);
 fixture.conflict();
 assert.equal((await act(room,'teacher','vote',{...vote(room),playtestPlayerId:teammate.id})).status,200);
 assert.equal((await act(room,'teacher','test-team-ready')).status,200);
 for(let i=0;i<2;i++)assert.equal((await act(room,'teacher','test-answer',{correct:true})).status,200);
 room=(await call(`/${room.id}`)).data.room;
 assert.equal(room.teams.find(team=>team.id===pilot.teamId).coins,400);
 assert.equal((await act(room,'teacher','buy-sabotage',{boosterId:'ink-bomb',teamId:opponent.teamId,playtestPlayerId:teammate.id})).status,200);
 assert.equal((await act(room,'teacher','use-sabotage',{boosterId:'ink-bomb',teamId:opponent.teamId,playtestPlayerId:teammate.id})).status,200);
 room=(await act(room,'teacher','test-control',{playerId:opponent.id})).data.room;
 assert.ok(room.teams.find(team=>team.id===opponent.teamId).inkBomb.expiresAt>Date.now());
 assert.equal((await act(room,'teacher','test-answer',{correct:true})).status,409);
 fixture.rows.find(row=>row.id===room.id).payload.teams.find(team=>team.id===opponent.teamId).inkBomb.expiresAt=Date.now()-1;
 assert.equal((await act(room,'teacher','test-answer',{correct:true})).status,200);
 assert.equal((await act(room,'teacher','test-sabotage')).status,200);
 room=(await act(room,'teacher','test-expire')).data.room; assert.equal(room.phase,'finished'); assert.ok(room.winners.length);
 room=(await act(room,'teacher','test-reset')).data.room; assert.equal(room.phase,'lobby'); assert.equal(room.players.length,4); assert.notEqual(room.me.id,pilot.id); assert.ok(room.teams.every(team=>!team.score&&!team.index&&!team.coins&&!team.boosters&&!team.blockedUntil&&!team.inkBomb&&!team.landmine));
});
test('solo survival plays through elimination, audience participation, finale and timer expiry',async()=>{
 let room=await playtest('survival',{questionCount:3}); await act(room,'teacher','start');
 await act(room,'teacher','test-answer',{correct:false}); room=(await act(room,'teacher','test-step')).data.room;
 assert.equal(room.phase,'reveal'); assert.equal(room.me.alive,false);
 room=(await act(room,'teacher','next',{round:room.round})).data.room;
 await act(room,'teacher','test-answer',{correct:true}); room=(await act(room,'teacher','test-step')).data.room;
 assert.equal(room.me.score,1); assert.equal(room.phase,'reveal');
 room=(await act(room,'teacher','next',{round:room.round})).data.room; assert.equal(room.finalRound,true);
 await act(room,'teacher','test-answer',{correct:true}); room=(await act(room,'teacher','test-step')).data.room;
 assert.equal(room.phase,'finished'); assert.ok(room.winners.length);
 room=(await act(room,'teacher','test-reset')).data.room; await act(room,'teacher','start');
 room=(await act(room,'teacher','test-expire')).data.room; assert.equal(room.phase,'reveal'); assert.equal(room.players.every(player=>!player.alive),true);
});
test('automatic bots advance once across concurrent polls and leave the controlled team to the teacher',async()=>{
 const room=await playtest(); await act(room,'teacher','start'); await act(room,'teacher','test-auto',{enabled:true});
 fixture.rows.find(row=>row.id===room.id).payload.playtest.nextBotAt=0;
 await Promise.all([call(`/${room.id}`),call(`/${room.id}`)]);
 const updated=(await call(`/${room.id}`)).data.room;
 assert.equal(updated.teams.find(team=>team.id===updated.me.teamId).index,0);
 assert.equal(updated.teams.find(team=>team.id!==updated.me.teamId).index,1);
 assert.equal(JSON.stringify(updated.current).includes('correctChoiceId'),false);
});
test('playtest answer helpers support every automatically graded question format',()=>{
 const {playtestAnswer}=require('../src/lib/gamePlaytest.ts'),{isExamQuestionCorrect}=require('../src/shared/examGrading.ts');
 const variants=[
  {type:'multiple_choice',correctChoiceId:'A',choices:[{id:'A'},{id:'B'}]}, {type:'transition_drop',correctChoiceId:'A'},
  {type:'multi_select',correctChoiceIds:['A','B']}, {type:'graph_point_select',correctPointIds:['point']},
  {type:'math_drag_drop',dragDropSlots:[{id:'slot',correctItemId:'item'}]},
  {type:'inline_dropdown',dropdowns:[{id:'slot',correctChoiceId:'A'}]},
  ...['category_sort','matrix_choice','table_match'].map(type=>({type,correctPlacements:{item:'category'}})),
  {type:'number_line_response',numberLineResponse:{correctValue:2,correctDirection:'left',correctEndpoint:'closed'}},
  ...['short_response','numeric_entry','grid_in'].map(type=>({type,correctTextAnswers:['12']}))
 ];
 for(const question of variants){assert.equal(isExamQuestionCorrect(question,playtestAnswer(question,true)),true,question.type);assert.equal(isExamQuestionCorrect(question,playtestAnswer(question,false)),false,question.type);}
});
