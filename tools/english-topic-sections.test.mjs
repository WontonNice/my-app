import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {readEnglishTopicSections,englishTopicConfiguration,saveEnglishSectionTopics} from './english-topic-sections.mjs';

async function fixture(t) {
  const fixtureRoot=join(dirname(fileURLToPath(import.meta.url)),'.content-drafts');
  await mkdir(fixtureRoot,{recursive:true});
  const root=await mkdtemp(join(fixtureRoot,'english-topic-libraries-'));
  t.after(()=>{assert.equal(dirname(resolve(root)),resolve(fixtureRoot));return rm(root,{recursive:true,force:true});});
  await mkdir(join(root,'tools'),{recursive:true});await mkdir(join(root,'server/data'),{recursive:true});
  const reading=['Shared topic',...Array.from({length:7},(_,i)=>'Reading '+i)],editing=['Shared topic','Punctuation'];
  await writeFile(join(root,'tools/content-topics.json'),JSON.stringify([...reading,...editing]));
  const sources=[];
  for(const [section,id] of [['reading','read-q'],['revising_editing_a','a-q'],['revising_editing_b','b-q']]) {
    const path=join(root,id+'.ts'),question={id,topic:'Shared topic',prompt:'Do not change this wording.',correctChoiceId:'B'};
    await writeFile(path,'export const question = '+JSON.stringify(question)+';\n');sources.push({section,path,questions:[question]});
  }
  await writeFile(join(root,'server/data/assessments.json'),JSON.stringify([{id:'exam',questions:sources.flatMap(source=>source.questions)}]));
  return {root,sources};
}
test('legacy lists become independent Reading, Part A and Part B lists; Part A renames never cross libraries',async t=>{
  const {root,sources}=await fixture(t),initial=await readEnglishTopicSections(root);
  assert.deepEqual(initial.revising_editing_a,initial.revising_editing_b);
  assert.notEqual(initial.revising_editing_a,initial.revising_editing_b);
  const before=await Promise.all(sources.map(source=>readFile(source.path,'utf8'))),configuration=await englishTopicConfiguration(root,sources);
  assert.equal(configuration.topicDetailsBySection.revising_editing_a[0].questionCount,1);
  const saved=await saveEnglishSectionTopics(root,{section:'revising_editing_a',revision:configuration.revision,topics:[{original:'Shared topic',label:'Part A development'},{original:'Punctuation',label:'Punctuation'},{original:'',label:'Part A organization'}]},sources);
  assert.deepEqual(saved.reading,initial.reading);assert.deepEqual(saved.revising_editing_b,initial.revising_editing_b);
  assert.equal(await readFile(sources[0].path,'utf8'),before[0]);assert.equal(await readFile(sources[2].path,'utf8'),before[2]);
  assert.equal(await readFile(sources[1].path,'utf8'),before[1].replace('"topic":"Shared topic"','"topic":"Part A development"'));
  const registry=JSON.parse(await readFile(join(root,'server/data/assessments.json'),'utf8'));
  assert.deepEqual(registry[0].questions.map(q=>q.topic),['Shared topic','Part A development','Shared topic']);
  assert.deepEqual(await readEnglishTopicSections(root),saved,'topic lists survive a fresh read');
});
test('topic saves reject stale edits, removing used topics and duplicate names before touching source',async t=>{
  const {root,sources}=await fixture(t),configuration=await englishTopicConfiguration(root,sources);
  const request={section:'revising_editing_a',revision:configuration.revision,topics:[{original:'Shared topic',label:'Shared topic'}]};
  await assert.rejects(saveEnglishSectionTopics(root,{...request,revision:'stale'},sources),/changed/);
  await assert.rejects(saveEnglishSectionTopics(root,{...request,topics:[{label:'New'}]},sources),/used by/);
  await assert.rejects(saveEnglishSectionTopics(root,{...request,topics:[{label:'same'},{label:'Same'}]},sources),/unique/);
  const before=await readFile(sources[1].path,'utf8');await writeFile(sources[1].path,before+'// newer edit\n');
  await assert.rejects(saveEnglishSectionTopics(root,request,sources),/changed/);
  assert.equal(await readFile(sources[1].path,'utf8'),before+'// newer edit\n');
});

test('unclassified source questions do not become empty topics or block adding valid topics',async t=>{
  const {root,sources}=await fixture(t);
  const questions=[{id:'empty',topic:''},{id:'spaces',topic:' \t '},{id:'missing'},{id:'null',topic:null},{id:'provisional',topic:'Uncategorized'}];
  const path=join(root,'imported-questions.ts');
  const source='export const questions = '+JSON.stringify(questions)+';\n';
  await writeFile(path,source);
  sources.push({section:'revising_editing_a',path,questions});
  const registryPath=join(root,'server/data/assessments.json');
  const registry=JSON.stringify([{id:'exam',questions:sources.flatMap(item=>item.questions)}]);
  await writeFile(registryPath,registry);
  const configuration=await englishTopicConfiguration(root,sources);
  const details=configuration.topicDetailsBySection.revising_editing_a;
  assert.ok(details.every(topic=>typeof topic.label==='string' && topic.label.trim()));
  assert.equal(configuration.unclassifiedCountBySection.revising_editing_a,4);
  assert.equal(configuration.unclassifiedCountBySection.reading,0);
  assert.equal(details.find(topic=>topic.label==='Uncategorized').questionCount,1);
  const request={section:'revising_editing_a',revision:configuration.revision,topics:[...details.map(({label})=>({label,original:label})),{label:'New valid topic',original:''}]};
  await assert.rejects(saveEnglishSectionTopics(root,{...request,topics:request.topics.filter(topic=>topic.label!=='Uncategorized')},sources),/Uncategorized is used by 1 questions/);
  await assert.rejects(saveEnglishSectionTopics(root,{...request,topics:[...request.topics,{label:'',original:''}]},sources),/topic names/);
  await saveEnglishSectionTopics(root,request,sources);
  const after=await englishTopicConfiguration(root,sources);
  assert.ok(after.sections.revising_editing_a.includes('New valid topic'));
  assert.equal(after.unclassifiedCountBySection.revising_editing_a,4);
  assert.equal(await readFile(path,'utf8'),source,'unclassified source records stay byte-for-byte unchanged');
  assert.equal(await readFile(registryPath,'utf8'),registry,'exam registry questions are not reclassified');
});

test('the topic manager retains configured and used named topics, with deletion protection and no empty row',async()=>{
  const html=await readFile(new URL('./content-studio.html',import.meta.url),'utf8');
  const start=html.indexOf('    function renderContentTopicManager('),end=html.indexOf('    function closeContentTopicManager(',start);
  const configuration={revision:'fixture',topicDetailsBySection:{revising_editing_a:[{label:'Configured',questionCount:1},{label:'Uncategorized',questionCount:2},{label:'',questionCount:4}]}};
  const app={state:{partATopics:['Configured','Unused'],topicConfiguration:configuration}};
  const list={innerHTML:''},title={},dialog={opened:false,showModal(){this.opened=true;}};
  const elements={'#content-topic-list':list,'#content-topic-dialog-title':title,'#content-topic-dialog':dialog};
  const open=vm.runInNewContext(html.slice(start,end)+'\nopenContentTopicManager;',{app,document:{body:{dataset:{workspace:'part-a'}}},currentPassageQuestionSection:()=> 'revising_editing_a',questionTopicsForSection:()=>app.state.partATopics,$:selector=>elements[selector],escapeHtml:String,setStatus:()=>assert.fail('No unsaved edits should block this fixture')});
  open();
  assert.equal(dialog.opened,true);
  assert.equal(app.contentTopicRevision,'fixture');
  assert.deepEqual(JSON.parse(JSON.stringify(app.contentTopicDrafts)),[{label:'Configured',original:'Configured',questionCount:1},{label:'Unused',original:'Unused',questionCount:0},{label:'Uncategorized',original:'Uncategorized',questionCount:2}]);
  const rows=[...list.innerHTML.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(match=>match[0]);
  assert.equal(rows.length,3);
  assert.match(rows.find(row=>row.includes('value="Uncategorized"')),/data-content-topic-action="remove" disabled/);
  assert.doesNotMatch(rows.find(row=>row.includes('value="Unused"')),/data-content-topic-action="remove" disabled/);
  assert.deepEqual(app.state.partATopics,['Configured','Unused'],'opening the manager must not modify taxonomy');
});
test('Reading can grow past eight topics without shifting Part A, and simultaneous writers are rejected',async t=>{
  const {root,sources}=await fixture(t),configuration=await englishTopicConfiguration(root,sources);
  const request={section:'reading',revision:configuration.revision,topics:[...configuration.sections.reading.map(label=>({label,original:label})),{label:'New reading skill'}]};
  const lock=join(root,'tools/content-topic-sections.json.lock');await writeFile(lock,'');
  await assert.rejects(saveEnglishSectionTopics(root,request,sources),/in progress/);await rm(lock);
  const saved=await saveEnglishSectionTopics(root,request,sources);
  assert.equal(saved.reading.length,9);
  assert.deepEqual(saved.revising_editing_a,configuration.sections.revising_editing_a);
  assert.deepEqual(saved.revising_editing_b,configuration.sections.revising_editing_b);
});
test('library membership and topic lookup stay separate, including legacy section inference',async()=>{
  const source=await readFile(new URL('./content-studio-workspace.js',import.meta.url),'utf8');
  const reading={id:'read',section:'reading',format:'sentence_prose'},partA={id:'part-a',section:'revising_editing_a'},legacy={id:'legacy',format:'sentence_prose'},advanced={id:'sat'};
  const app={passageMode:'exam',passageLibrary:'reading',state:{passages:[reading,partA,legacy],advancedPassages:[advanced],readingTopics:['Reading only'],partATopics:['Part A only'],partBTopics:['Part B only']}};
  const ui=vm.runInNewContext(source+'\nstudioUI;',{app});
  assert.deepEqual(Array.from(ui.passagesForLibrary(),p=>p.id),['read']);
  app.passageLibrary='revising_editing_a';assert.deepEqual(Array.from(ui.passagesForLibrary(),p=>p.id),['part-a','legacy']);
  assert.equal(ui.passageLibraryTab(partA),'part-a');assert.equal(ui.passageLibraryKey(),'revising_editing_a');
  assert.deepEqual(Array.from(ui.questionTopicsForSection('reading')),['Reading only']);
  assert.deepEqual(Array.from(ui.questionTopicsForSection('revising_editing_a')),['Part A only']);
  assert.deepEqual(Array.from(ui.questionTopicsForSection('revising_editing_b')),['Part B only']);
  app.passageMode='advanced';assert.deepEqual(Array.from(ui.passagesForLibrary(),p=>p.id),['sat']);
});

test('switching libraries retains each library draft, search and selected passage',async()=>{
  const source=await readFile(new URL('./content-studio-workspace.js',import.meta.url),'utf8'),html=await readFile(new URL('./content-studio.html',import.meta.url),'utf8');
  const reading={id:'read',section:'reading',questions:[]},partA={id:'edit',section:'revising_editing_a',questions:[]};
  const draft={...reading,title:'Unsaved reading title'};
  const app={state:{passages:[reading,partA]},passageMode:'exam',passageLibrary:'reading',selectedPassageId:'read',passageDraft:draft,passageDirty:true};
  const ui=vm.runInNewContext(source+'\nstudioUI;',{app}),searches=new Map();let query='reading search',active='passages';
  Object.assign(ui,{capturePassageLibrary(){searches.set(this.passageLibraryKey(),query);},restorePassageLibrary(){query=searches.get(this.passageLibraryKey())||'';},readPreference:(_key,fallback)=>fallback,activateWorkspace:tab=>{active=tab;}});
  const start=html.indexOf('    function switchTab(tab) {'),end=html.indexOf('\n    function ',start+10);
  const switchTab=vm.runInNewContext(html.slice(start,end)+'\nswitchTab;',{app,studioUI:ui,clone:structuredClone,$$:()=>[],setStatus(){},updatePassageWorkspaceLabels(){},renderPassageList(){},renderPassageEditor(){}});
  switchTab('part-a');assert.equal(active,'part-a');assert.equal(app.selectedPassageId,'edit');assert.equal(app.passageDraft.section,'revising_editing_a');assert.equal(query,'');
  const partADraft=app.passageDraft;partADraft.title='Unsaved Part A title';app.passageDirty=true;query='Part A search';
  switchTab('passages');assert.equal(app.passageDraft,draft);assert.equal(app.passageDirty,true);assert.equal(query,'reading search');
  switchTab('part-a');assert.equal(app.passageDraft,partADraft);assert.equal(app.passageDirty,true);assert.equal(query,'Part A search');
});

test('new Part A passages default to the Part A section, sentence numbering and a Part A question topic',async()=>{
  const html=await readFile(new URL('./content-studio.html',import.meta.url),'utf8');
  const extract=name=>{const start=html.indexOf('    function '+name+'('),end=html.indexOf('\n    function ',start+10);return html.slice(start,end);};
  const app={passageMode:'exam',passageLibrary:'revising_editing_a',state:{partATopics:['Part A revision'],readingTopics:['Reading meaning']}};
  const create=vm.runInNewContext([extract('defaultQuestion'),extract('questionTopicsForSection'),extract('defaultPassage'),'defaultPassage;'].join('\n'),{app});
  const passage=create();assert.equal(passage.section,'revising_editing_a');assert.equal(passage.format,'sentence_prose');assert.equal(passage.questions[0].topic,'Part A revision');
  app.passageLibrary='reading';const reading=create();assert.equal(reading.section,'reading');assert.equal(reading.questions[0].topic,'Reading meaning');
});
