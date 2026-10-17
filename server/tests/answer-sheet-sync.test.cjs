const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');const {randomUUID}=require('node:crypto');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {AnswerSheetSync}=require('../../client/src/features/answer-sheets/sync.ts');
function environment(t){
 const data=new Map(), storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
 const sheet={id:'sheet',title:'Fixture',sourceVersion:'Form A',instructions:'',sourceUrl:'',allowUnanswered:true,sections:[{id:'section',title:'English',subject:'english',items:[{id:'one',number:'1',type:'multiple_choice',options:[{id:'A',label:'A'},{id:'B',label:'B'}]},{id:'multi',number:'2',type:'multi_select',options:[{id:'A',label:'A'},{id:'B',label:'B'}],minSelections:2,maxSelections:2},{id:'short',number:'3',type:'short_response',options:[],multiline:true}]}]};
 let server={id:'attempt',studentId:'student-one',assignmentId:'assignment',sheet,revision:1,answers:{},responseRevisions:{},flags:[],sectionId:'section',savedAt:'2026-10-17T12:00:00Z',startedAt:'2026-10-17T11:00:00Z',status:'in_progress',submissions:[],events:[]};
 const state={online:true,loseAck:false,hold:null,saves:0,submits:0};const mutations=new Set(),submissions=new Set();
 const transport={save:async input=>{state.saves++;if(!state.online)throw new TypeError('offline');if(mutations.has(input.mutationId))return{attempt:structuredClone(server)};if(input.revision!==server.revision)throw Object.assign(Error('stale'),{status:409});if(input.changes.some(change=>typeof change.answer==='string'&&change.answer.length>10000))throw Object.assign(Error('10,000 character limit; text retained'),{status:400});for(const change of input.changes){if(change.answer!==undefined)server.answers[change.itemId]=structuredClone(change.answer);if(change.flagged!==undefined)server.flags=change.flagged?[...new Set([...server.flags,change.itemId])]:server.flags.filter(id=>id!==change.itemId);server.responseRevisions[change.itemId]=server.revision+1;}server.revision++;mutations.add(input.mutationId);if(state.hold)await state.hold;if(state.loseAck){state.loseAck=false;throw new Error('acknowledgment lost');}return{attempt:structuredClone(server)};},submit:async input=>{if(!state.online)throw new TypeError('offline');if(!submissions.has(input.submissionId)){assert.equal(input.revision,server.revision);submissions.add(input.submissionId);state.submits++;server.status='submitted';server.submissions.push({id:input.submissionId,answers:structuredClone(server.answers),flags:[...server.flags],at:new Date().toISOString()});}return{attempt:structuredClone(server),result:null};}};
 const controllers=[];const make=(doc=server)=>{const sync=new AnswerSheetSync(structuredClone(doc),'session',transport,storage,()=>{},()=>state.online,randomUUID);controllers.push(sync);return sync;};t.after(()=>controllers.forEach(sync=>sync.stop()));return{make,state,data,storage,transport,get server(){return server},set server(value){server=value}};
}
test('D: offline edits of every type remain visible, persist in scoped recovery, and sync once on reconnect',async t=>{
 const e=environment(t), sync=e.make();e.state.online=false;sync.edit('one','A');sync.edit('multi',['A']);sync.edit('short','0\n1/3 ≠ 0');
 await assert.rejects(sync.flush());assert.equal(sync.status,'Offline — changes pending');assert.equal(sync.visible.answers.short,'0\n1/3 ≠ 0');assert.equal(e.server.answers.short,undefined);
 const other=e.make({...e.server,studentId:'student-two',id:'other-attempt'});assert.deepEqual(other.visible.answers,{});
 e.state.online=true;await sync.retry();assert.equal(sync.status,'Saved');assert.equal(e.server.answers.short,'0\n1/3 ≠ 0');assert.deepEqual(e.server.answers.multi,['A']);assert.equal(e.data.size,0);
});
test('B/E: old acknowledgments do not erase newer typing; immediate submit drains the last characters',async t=>{
 const e=environment(t),sync=e.make();let release;e.state.hold=new Promise(resolve=>release=resolve);sync.edit('short','old');const flushing=sync.flush();sync.edit('short','latest 0\nlast characters');e.state.hold=null;release();await flushing;
 assert.equal(sync.visible.answers.short,'latest 0\nlast characters');assert.equal(e.server.answers.short,'latest 0\nlast characters');
 sync.edit('short','latest 0\nlast characters XYZ');await sync.submit(true);assert.equal(sync.status,'Submitted');assert.equal(e.server.submissions[0].answers.short,'latest 0\nlast characters XYZ');assert.equal(e.state.submits,1);assert.equal(e.data.size,0);
});
test('D: lost save acknowledgment is retried with the same mutation, without duplicate/stale writes',async t=>{
 const e=environment(t),sync=e.make();sync.edit('one','B');e.state.loseAck=true;await assert.rejects(sync.flush());const revision=e.server.revision;await sync.retry();assert.equal(sync.status,'Saved');assert.equal(e.server.revision,revision);assert.equal(e.server.answers.one,'B');
});
test('C/J: reload recovers pending work, newer device answers require a recovery decision',async t=>{
 const e=environment(t),sync=e.make();e.state.online=false;sync.edit('short','device text');await assert.rejects(sync.flush());sync.stop();e.state.online=true;
 const restored=e.make();assert.equal(restored.visible.answers.short,'device text');await restored.flush();assert.equal(e.server.answers.short,'device text');restored.stop();
 e.state.online=false;const local=e.make();local.edit('short','another local draft');await assert.rejects(local.flush());local.stop();e.server={...e.server,revision:e.server.revision+1,answers:{short:'newer other device'},responseRevisions:{short:e.server.revision+1}};e.state.online=true;
 const conflict=e.make();assert.equal(conflict.recoveryConflict,true);assert.equal(conflict.status,'Session conflict');await assert.rejects(conflict.flush());assert.equal(e.server.answers.short,'newer other device');conflict.chooseRecovery(false);assert.equal(conflict.visible.answers.short,'newer other device');assert.equal(e.data.size,0);
});
test('G: invalid long input is retained, can be corrected, and clearing is a saved change',async t=>{
 const e=environment(t),sync=e.make(),raw='x'.repeat(10001);sync.edit('short',raw);await assert.rejects(sync.flush());assert.equal(sync.visible.answers.short,raw);assert.equal(sync.status,'Save failed — review input');sync.edit('short','0');await sync.flush();assert.equal(e.server.answers.short,'0');sync.edit('short','');await sync.flush();assert.equal(e.server.answers.short,'');
});
test('E: offline submission remains pending until the server acknowledges the same submission identifier',async t=>{
 const e=environment(t),sync=e.make();sync.edit('short','final');e.state.online=false;await sync.submit(true);assert.notEqual(sync.status,'Submitted');assert.ok(sync.submissionId);assert.equal(e.state.submits,0);e.state.online=true;await sync.retry();assert.equal(sync.status,'Submitted');assert.equal(e.state.submits,1);assert.equal(e.server.submissions[0].answers.short,'final');
});
test('D: a large Unicode recovery queue syncs in bounded targeted batches',async t=>{
 const e=environment(t);e.server.sheet.sections[0].items=Array.from({length:120},(_,index)=>({id:'short-'+index,number:String(index+1),type:'short_response',options:[]}));
 const sync=e.make(),raw='汉'.repeat(3000);e.state.online=false;for(let index=0;index<120;index++)sync.edit('short-'+index,raw);e.state.online=true;await sync.flush();assert.ok(e.state.saves>1);assert.equal(Object.keys(e.server.answers).length,120);assert.equal(e.server.answers['short-119'],raw);assert.equal(sync.status,'Saved');
});
test('G: text matching is explicit, raw decimals/fractions/symbols remain unchanged, and absent/manual keys stay pending',()=>{
 const {gradeSheet}=require('../src/shared/answerSheets.ts');
 const item={id:'short',number:'1',type:'short_response',options:[]};const sheet={id:'s',sections:[{id:'a',title:'A',subject:'other',items:[item]}],keys:{short:{points:1,mode:'exact',accepted:['Word']}},keyVersion:1};
 const submission={id:'submitted',answers:{short:' word '},flags:[],at:'2026-10-17'};
 assert.equal(gradeSheet(sheet,submission,{},'teacher','now').earned,0);sheet.keys.short.mode='normalized';assert.equal(gradeSheet(sheet,submission,{},'teacher','now').earned,1);
 for(const raw of ['0','0.125','1/3','x² ≠ 0','line one\n line two']){submission.answers.short=raw;sheet.keys.short={points:1,mode:'exact',accepted:[raw]};assert.equal(gradeSheet(sheet,submission,{},'teacher','now').earned,1);assert.equal(submission.answers.short,raw);}
 sheet.keys={};assert.equal(gradeSheet(sheet,submission,{},'teacher','now').earned,null);sheet.keys.short={points:1,mode:'manual'};assert.equal(gradeSheet(sheet,submission,{},'teacher','now').pending,1);
});
test('I: insights use the preserved linked snapshot and do not fabricate skills for unmapped summaries',()=>{
 const {buildStudentAnalytics}=require('../../client/src/lib/studentAnalytics.ts');
 const q={id:'mapped-question',type:'multiple_choice',topic:'Evidence',prompt:'Which evidence?',choices:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctChoiceId:'A'};
 const content={assessmentId:'digitized-source',title:'Source',passageSets:[{id:'set',section:'reading',passage:{id:'passage',title:'Source passage',lines:[]},directions:{title:'Read',body:'Read',subject:'English'},questions:[q],questionCount:1}]};
 const result={assessmentId:'answer-sheet:attempt:submission',title:'Paper test',source:'answer_sheet',completedAt:'2026-10-17T12:00:00Z',completionStatus:'complete',completedSections:['english','math'],answers:{'mapped-question':'A'},correct:1,total:1,percentage:100,topics:[],passages:[],subjects:[],answerSheet:{analysisContent:structuredClone(content)}};
 const changed=structuredClone(content);changed.passageSets[0].questions[0].correctChoiceId='B';
 const data=buildStudentAnalytics([{result,content:changed,subjects:[],passages:[]}]);assert.equal(data.exams[0].evidence.length,1);assert.equal(data.exams[0].evidence[0].status,'Correct');assert.equal(data.exams[0].source,'Answer sheet');assert.equal(data.exams[0].evidence[0].seconds,undefined);
 const summary=buildStudentAnalytics([{result:{...result,answers:{},answerSheet:{}},subjects:[],passages:[]}]);assert.equal(summary.evidence.length,0);assert.equal(summary.skills.length,0);
});
test('J: another session submitting cannot silently hide a device recovery draft; reopening restores it without retyping',async t=>{
 const e=environment(t),old=e.make();e.state.online=false;old.edit('short','unsynced device text');await assert.rejects(old.flush());old.stop();
 e.server={...e.server,status:'submitted',revision:3,answers:{short:'submitted elsewhere'},responseRevisions:{short:3},submissions:[{id:'other-submit',answers:{short:'submitted elsewhere'},flags:[],at:'now'}]};e.state.online=true;
 const sealed=e.make();assert.equal(sealed.status,'Submitted');assert.equal(sealed.visible.answers.short,'submitted elsewhere');assert.equal(sealed.recoveredUnsubmitted[0].answer,'unsynced device text');assert.ok(e.data.size);sealed.stop();
 e.server={...e.server,status:'in_progress',revision:4};const reopened=e.make();assert.equal(reopened.recoveryConflict,true);reopened.chooseRecovery(true);await reopened.flush();assert.equal(e.server.answers.short,'unsynced device text');assert.equal(e.server.submissions[0].answers.short,'submitted elsewhere');
});
