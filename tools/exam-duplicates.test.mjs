import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,cp,rm} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createServer} from 'node:http';
import vm from 'node:vm';
import {compareExamState,normalizeDuplicateText} from './exam-duplicates.mjs';
const root=fileURLToPath(new URL('..',import.meta.url)),toolsRoot=join(root,'tools');
const question=(id,prompt='What is the value of \\(x + 2\\) when \\(x = 5\\)?')=>({id,type:'multiple_choice',prompt,choices:[{id:'A',text:'7'},{id:'B',text:'9'}],correctChoiceId:'A',topic:'Algebra'});
function fixture(){return {tests:[{assessmentId:'a',title:'Test A',passageIds:['p-a'],standaloneItemIds:[],mathSectionFileName:'a.ts'},{assessmentId:'b',title:'Test B',passageIds:['p-b'],standaloneItemIds:[],mathSectionFileName:'b.ts'}],passages:[{id:'p-a',title:'Original title',text:'The patient gardener waits for the seed to grow. Each morning she carefully measures its first green leaves.',questions:[question('e-a','Which detail supports the central idea?')]},{id:'p-b',title:'Another title',text:'The patient gardener waits for the seed to grow. Each morning she carefully measures its first green leaves.',questions:[question('e-b','Which detail supports the central idea?')]}],mathSections:[{fileName:'a.ts',questions:[question('a-1'),question('a-2')]},{fileName:'b.ts',questions:[question('b-1')]}],standaloneItems:[]};}
test('counts unique shared content and every occurrence without multiplying repeated copies; IDs, keys, taxonomy and option order do not change a question',async()=>{
 const state=fixture(),before=JSON.stringify(state),b=state.mathSections[1].questions[0];
 b.choices=[{id:'H',text:'9'},{id:'G',text:'7'}];b.correctChoiceId='H';b.topic='Another classification';b.explanation='A teacher explanation.';
 const snapshot=JSON.stringify(state),report=await compareExamState(state,'a','b');
 assert.deepEqual(report.stats.math,{groups:1,leftMatched:2,rightMatched:1,leftTotal:2,rightTotal:1});
 assert.equal(report.stats.english.groups,1);assert.equal(report.stats.passages.groups,1);assert.equal(report.matches[0].left.length,2);
 assert.equal(JSON.stringify(state),snapshot);assert.notEqual(snapshot,before);
});
test('English questions are checked with their actual passage or Part B stimulus, rather than generic prompts or shared IDs',async()=>{
 const state=fixture();state.passages[1].text='An unrelated article about the history of ocean navigation.';
 let report=await compareExamState(state,'a','b');assert.equal(report.stats.english.groups,0);assert.equal(report.stats.passages.groups,0);assert.equal(report.possible.filter(item=>item.kind==='english').length,0);
 state.tests.forEach((test,index)=>{test.passageIds=[];test.standaloneItemIds=['s'+index];});
 state.standaloneItems=[{...question('s0','Which sentence needs revision?'),stimulus:'A paragraph about a garden.'},{...question('s1','Which sentence needs revision?'),stimulus:'A paragraph about a city.'}];
 report=await compareExamState(state,'a','b');assert.equal(report.stats.english.groups,0);
 state.standaloneItems[1].stimulus=state.standaloneItems[0].stimulus;
 assert.equal((await compareExamState(state,'a','b')).stats.english.groups,1);
});
test('format-only HTML, entities, Unicode quotes and TeX spacing normalize, while numeric and geometric changes stay separate',async()=>{
 const state=fixture();state.passages[1].richText='<p>The patient <em>gardener</em> waits for the seed to grow.</p><p>Each morning she carefully measures its first green leaves.</p>';
 state.mathSections[1].questions[0].promptHtml='<p>What is the value of \\(x+2\\) when \\(x=5\\)?</p>';
 let report=await compareExamState(state,'a','b');assert.equal(report.stats.math.groups,1);assert.equal(report.stats.passages.groups,1);
 const long='A gardener plants 25 trees in each of 12 equal rows. How many trees does the gardener plant altogether in the garden?';
 state.mathSections[0].questions=[question('a',long)];state.mathSections[1].questions=[question('b',long.replace('25','26'))];
 report=await compareExamState(state,'a','b');assert.equal(report.stats.math.groups,0);assert.equal(report.possible[0].reason,'Numbers or values differ.');
 state.mathSections.forEach(section=>{section.questions[0]=question('q','Select the number line.');section.questions[0].choices=[{id:'A',text:'',numberLine:{min:-3,max:3,solutionStart:0,solutionEnd:2,startClosed:true,endClosed:false}}];});
 state.mathSections[1].questions[0].choices[0].numberLine.solutionEnd=3;
 report=await compareExamState(state,'a','b');assert.equal(report.stats.math.groups,0);
 assert.equal(normalizeDuplicateText('“A”  \n value'),'"a" value');assert.notEqual(normalizeDuplicateText('x²',true),normalizeDuplicateText('x2',true));
});
test('diagrams compare by content, never by alt text or dimensions; missing or changed diagrams are not confirmed matches',async()=>{
 const state=fixture();state.mathSections[0].questions=[question('a')];state.mathSections[1].questions=[question('b')];
 state.mathSections[0].questions[0].choices=[{id:'A',text:'',html:'<img src="/exam-images/one.png" alt="Diagram" width="250">'}];
 state.mathSections[1].questions[0].choices=[{id:'B',text:'',html:'<img src="/exam-images/two.png" alt="Other description" width="400">'}];
 assert.equal((await compareExamState(state,'a','b',{imageFingerprint:async()=> 'same-bytes'})).stats.math.groups,1);
 const changed=await compareExamState(state,'a','b',{imageFingerprint:async src=>src});assert.equal(changed.stats.math.groups,0);assert.ok(changed.possible.some(item=>item.kind==='math'));
 const missing=await compareExamState(state,'a','b');assert.equal(missing.stats.math.groups,0);assert.ok(missing.possible.some(item=>/could not be verified/.test(item.reason)));
});
test('rejects invalid selections, excludes empty drafts, and reports unreadable content rather than asserting zero overlap',async()=>{
 const state=fixture();state.mathSections[0].questions.push(question('empty',''));state.passageErrors=[{fileName:'broken.ts'}];
 await assert.rejects(compareExamState(state,'a','a'),/different/);await assert.rejects(compareExamState(state,'a','missing'),/saved exam content/);
 const report=await compareExamState(state,'a','b');assert.equal(report.stats.math.leftTotal,2);assert.ok(report.warnings.some(w=>w.includes('empty')));assert.ok(report.warnings.some(w=>w.includes('incomplete')));
 new vm.Script(await readFile(join(toolsRoot,'content-studio-compare.js'),'utf8'));
});
test('real comparison endpoint counts actual authored test content and serves its dashboard without changing source files',async()=>{
 const baseDir=join(toolsRoot,'.content-drafts');await mkdir(baseDir,{recursive:true});const work=await mkdtemp(join(baseDir,'compare-test-'));
 const modulePath=join(toolsRoot,`.compare-http-${Date.now()}.mjs`);let server;
 try{
  for(const name of ['client/src/content','server/src/shared'])await cp(join(root,name),join(work,name),{recursive:true});
  for(const name of ['client/src/lib/studentMaterials.ts','server/data/assessments.json','tools/content-topics.json','tools/math-topics.json','tools/practice-topics.json','tools/content-studio-glossary.js']){await mkdir(dirname(join(work,name)),{recursive:true});await cp(join(root,name),join(work,name));}
  await writeFile(join(work,'server/data/question-bank.json'),'{"revision":0,"questions":[],"sets":[]}');
  const source=(await readFile(join(toolsRoot,'content-studio.mjs'),'utf8')).replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");',`const workspaceRoot = ${JSON.stringify(work)};`).split('if (process.argv.includes("--validate"))')[0]+'\nexport {handleRequest,getState};';
  await writeFile(modulePath,source);const studio=await import(pathToFileURL(modulePath).href),state=await studio.getState();
  const a=state.tests.find(test=>test.passageIds.length&&state.mathSections.some(section=>section.fileName===test.mathSectionFileName&&section.questions.length)),b=state.tests.find(test=>test!==a);assert.ok(a);
  const file=join(work,'client/src/content/exams/tests',a.fileName),before=await readFile(file,'utf8');
  server=createServer(studio.handleRequest);await new Promise(done=>server.listen(0,'127.0.0.1',done));const origin=`http://127.0.0.1:${server.address().port}`;
  const response=await fetch(`${origin}/api/tests/compare?left=${encodeURIComponent(a.assessmentId)}&right=${encodeURIComponent(b.assessmentId)}`);assert.equal(response.status,200);const report=await response.json();
  assert.equal(report.left.title,a.title);assert.ok(report.stats.math.leftTotal>0);assert.ok(report.stats.english.leftTotal>0);assert.ok(report.stats.passages.leftTotal>0);assert.equal(await readFile(file,'utf8'),before);
  assert.equal((await fetch(`${origin}/api/tests/compare?left=a&right=a`)).status,400);
 }finally{if(server)await new Promise(done=>server.close(done));await rm(modulePath,{force:true});if(dirname(work)===baseDir)await rm(work,{recursive:true,force:true});}
});
