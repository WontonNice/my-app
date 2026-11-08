import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import vm from 'node:vm';
import {documentDraftStore} from './document-drafts.mjs';
import bank from './part-b-bank.cjs';

test('individual Part B draft deletion retains siblings, publication receipts and a recoverable copy',async t=>{
  const root=await mkdtemp(join(tmpdir(),'part-b-delete-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const dir=join(root,'tools/.content-drafts');await mkdir(dir,{recursive:true});
  const questions=[{id:'published',type:'short_response',prompt:'Published',acceptedAnswers:['1']},{id:'draft',type:'short_response',prompt:'Draft',acceptedAnswers:['2']}];
  const entry={id:'batch',kind:'standalone',status:'draft',publishedQuestionIds:['published'],publications:{exam:{questionIds:['published'],questionMap:{published:'published'}}},content:{questions,review:{expectedQuestionCount:2}}};
  await writeFile(join(dir,'document-imports.json'),JSON.stringify({revision:1,entries:[entry]}));
  const store=documentDraftStore(root);
  await assert.rejects(store.delete({id:'batch',questionId:'draft',revision:0}),/changed/);
  await assert.rejects(store.delete({id:'batch',questionId:'published',revision:1}),/published/i);
  const result=await store.delete({id:'batch',questionId:'draft',revision:1});
  assert.deepEqual(result.entries[0].content.questions,[questions[0]]);
  assert.deepEqual(result.entries[0].publications,entry.publications);
  assert.equal(result.entries[0].content.review.expectedQuestionCount,1);
  assert.equal(result.deletedStandaloneQuestions[0].question.id,'draft');
  assert.equal((await store.read()).entries[0].content.questions.length,1);
  await assert.rejects(store.delete({id:'batch',questionId:'draft',revision:2}),/not found/i);
});

test('bank deletion checks every retained ID and exam registry, then backs up only unused questions',async()=>{
  const source=await readFile(new URL('./content-studio.mjs',import.meta.url),'utf8');
  const start=source.indexOf('async function deleteStandaloneItem('),end=source.indexOf('\nasync function ',start+1);
  assert.ok(start>=0,'Part B bank deletion must be supported');
  const items=[{id:'a',topic:'Pronouns'},{id:'b',duplicateOf:'a',topic:'Pronouns'},{id:'other',topic:'Verbs'}];
  let state={standaloneItems:items,tests:[{assessmentId:'exam',title:'Official Form A',standaloneItemIds:['b']}],assessments:[],testErrors:[]},written,archives=[];
  const remove=vm.runInNewContext(source.slice(start,end)+'\ndeleteStandaloneItem;',{
    mutateStandalone:fn=>fn(),readFile:async()=> 'bank',standaloneItemsPath:'bank.ts',hashSource:()=> 'hash',
    requiredText:v=>v,EditorError:class extends Error {constructor(status,message){super(message);this.status=status;}},getState:async()=>state,
    partBBank:bank,join,workspaceRoot:'fixture',mkdir:async()=>{},writeFile:async(p,value)=>archives.push(JSON.parse(value)),
    writeStandaloneItems:async next=>written=next,relativePath:p=>p,
  });
  await assert.rejects(remove({id:'a',sourceHash:'old'}),/changed/);
  await assert.rejects(remove({id:'a',sourceHash:'hash'}),/Official Form A/);
  assert.equal(archives.length,0);assert.equal(written,undefined);
  state={...state,tests:[],assessments:[{id:'registry',title:'Registry exam',questions:[{id:'b'}]}]};
  await assert.rejects(remove({id:'a',sourceHash:'hash'}),/Registry exam/);
  state={...state,assessments:[]};
  await remove({id:'a',sourceHash:'hash'});
  assert.deepEqual(JSON.parse(JSON.stringify(written)),[items[2]]);
  assert.deepEqual(archives[0].items,items.slice(0,2));
});
