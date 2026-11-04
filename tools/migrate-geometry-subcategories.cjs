// October 2026 taxonomy migration. Preview by default; --apply writes local files.
// --remote previews the shared state; --remote --apply publishes the prepared migration.
require('./register-practice-generator.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const { mathSubcategoryConsolidations: mathSubcategoryMoves, consolidatedMathLocation: migratedMathLocation, migratedMathSkillLocation } = require('../server/src/shared/mathSubcategoryMigration.ts');
const { reconcilePracticeTaxonomy, validatePracticeCatalog, defaultPracticeCatalog } = require('../server/src/shared/practiceCatalog.ts');
const { validateClassificationSkills } = require('../server/src/shared/mathClassificationSkills.ts');
const { validateMathDiagnosticSkills } = require('../server/src/shared/mathCommandTaxonomy.ts');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const json = value => JSON.stringify(value, null, 2) + '\n';

const overrides = new Map([
 ['2022-2023-form-b-q73',{category:'Geometry',topic:'Triangles'}],
 ['2026-2027-form-d-math-item-13',{category:'Geometry',topic:'Triangles'}],
]);

function migrateState(original, taxonomy, changes = []) {
  const state = structuredClone(original);
  state.taxonomy = taxonomy;
  const renames = [...(state.taxonomyTopicRenames ?? [])];
  for (const move of mathSubcategoryMoves) if (!renames.some(item => isDeepStrictEqual(item, move))) renames.push(move);
  state.taxonomyTopicRenames = renames;
  for (const field of ['skills', 'classificationSkills']) state[field] = (state[field] ?? []).map(skill => ({ ...skill, ...migratedMathSkillLocation(skill) }));
  for (const [id, metadata] of Object.entries(state.metadata ?? {})) {
    if (metadata.category && metadata.subcategory) {
      const location = overrides.get(id) ?? migratedMathLocation(metadata.category, metadata.subcategory);
      Object.assign(metadata, { category: location.category, subcategory: location.topic });
    }
  }
  for (const change of changes) state.metadata[change.id] = { ...state.metadata[change.id], category: change.to.category, subcategory: change.to.topic };
  if (state.targets?.overrides) state.targets.overrides = state.targets.overrides.map(target => ({ ...target, ...migratedMathSkillLocation({ id:'', category:target.category, subcategory:target.subcategory }) }));
  validateClassificationSkills(state.classificationSkills, taxonomy);
  validateMathDiagnosticSkills(state.skills, taxonomy);
  for (const field of ['skills', 'classificationSkills']) {
    const content = items => items.map(({ category, subcategory, ...item }) => item);
    if (!isDeepStrictEqual(content(original[field] ?? []), content(state[field]))) throw Error('Skill definitions must remain unchanged.');
  }
  return state;
}

async function local(apply) {
  const { mathQuestionTopics } = await import('./math-topic-editor.mjs');
  const taxonomy=read('tools/math-topics.json'), original=read('server/data/math-command.json');
  const files=[], changes=[], seen=new Set();
  for (const filename of fs.readdirSync(path.join(root,'client/src/content/exams/mathSets')).filter(name=>name.endsWith('.ts'))) {
    const file=path.join(root,'client/src/content/exams/mathSets',filename), source=fs.readFileSync(file,'utf8');
    const { tree,questions }=mathQuestionTopics(source,filename), edits=[];
    for (const question of questions) {
      seen.add(question.id);
      const metadata=original.metadata[question.id]??{}, category=metadata.category??question.topic, topic=metadata.subcategory??question.subtopic;
      const to=overrides.get(question.id)??migratedMathLocation(category,topic);
      if(to.category!==category||to.topic!==topic)changes.push({id:question.id,from:{category,topic},to});
      for(const [field,value] of [['topic',to.category],['subtopic',to.topic]]){
        const node=question[field+'Node'];
        if(node&&node.text!==value)edits.push({start:node.getStart(tree),end:node.end,text:JSON.stringify(value)});
      }
    }
    let next=source;for(const edit of edits.sort((a,b)=>b.start-a.start))next=next.slice(0,edit.start)+edit.text+next.slice(edit.end);
    if(next!==source)files.push({file,source,next});
  }
  for(const id of overrides.keys())if(!seen.has(id))throw Error(`Reviewed question is missing: ${id}`);
  const state=migrateState(original,taxonomy,changes);
  if(!isDeepStrictEqual(original,state)){state.revision=randomUUID();files.push({file:path.join(root,'server/data/math-command.json'),source:fs.readFileSync(path.join(root,'server/data/math-command.json'),'utf8'),next:json(state)});}
  const assessments=read('server/data/assessments.json'), before=json(assessments), destinations=new Map(changes.map(change=>[change.id,change.to]));
  for(const exam of assessments)for(const question of exam.questions??[]){const to=destinations.get(question.id);if(to){question.topic=to.category;question.subtopic=to.topic;}}
  if(json(assessments)!==before)files.push({file:path.join(root,'server/data/assessments.json'),source:fs.readFileSync(path.join(root,'server/data/assessments.json'),'utf8'),next:json(assessments)});
  if(apply){
    // Verify every original immediately before changing any file.
    for(const file of files)if(fs.readFileSync(file.file,'utf8').trim()!==file.source.trim())throw Error('A file changed during migration: '+file.file);
    const backup=path.join(root,'artifacts/geometry-subcategories-local-backup-'+Date.now()+'.json');
    fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,json(files.map(({file,source})=>({file,source}))),{flag:'wx'});
    for(const file of files)fs.writeFileSync(file.file,file.next);
    console.log('Backup: '+backup);
  }
  console.log(json({mode:apply?'applied':'preview',subcategories:taxonomy.categories.reduce((n,c)=>n+c.topics.length,0),changedQuestions:changes.length,files:files.map(f=>path.relative(root,f.file)),skillDefinitionsUnchanged:true}));
  return {state,taxonomy,changes};
}

async function remote(apply) {
  const serverRequire=require('node:module').createRequire(path.join(root,'server/package.json'));
  serverRequire('dotenv').config({path:[path.join(root,'server/.env'),path.join(root,'.env')],quiet:true});
  const {supabase}=require('../server/src/lib/supabase.ts');
  const results=await Promise.all([supabase.from('math_command_metadata').select('revision,state').eq('id','main').maybeSingle(),supabase.from('infinite_practice_catalog').select('revision,catalog').eq('id','main').maybeSingle()]);
  for(const result of results)if(result.error)throw Error(result.error.message);
  const [math,practice]=results.map(result=>result.data),localState=read('server/data/math-command.json'),taxonomy=read('tools/math-topics.json');
  // Existing shared metadata stays authoritative; never overwrite teacher edits with a local snapshot.
  const state=migrateState(math?.state??localState,taxonomy);
  // Publish native classifications too, while retaining explicit shared teacher edits.
  for(const [id,metadata] of Object.entries(localState.metadata??{})){
    if(metadata.category&&metadata.subcategory&&!state.metadata[id]?.category&&!state.metadata[id]?.subcategory)
      state.metadata[id]={...state.metadata[id],category:metadata.category,subcategory:metadata.subcategory};
  }
  const catalog=validatePracticeCatalog(reconcilePracticeTaxonomy(practice?.catalog??defaultPracticeCatalog(),{...taxonomy,classificationSkills:state.classificationSkills},state.taxonomyTopicRenames),{...taxonomy,classificationSkills:state.classificationSkills});
  const mathChanged=!math||!isDeepStrictEqual(math.state,state),practiceChanged=!practice||!isDeepStrictEqual(practice.catalog,catalog);
  if(apply&&(mathChanged||practiceChanged)){
    const backup=path.join(root,'artifacts/geometry-subcategories-remote-backup-'+Date.now()+'.json');
    fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,json({math,practice}),{flag:'wx'});console.log('Backup: '+backup);
    const revision=randomUUID();let mathSaved=false;
    try{
      if(mathChanged){state.revision=revision;const row={id:'main',state,revision,updated_at:new Date().toISOString()};const result=await(math?supabase.from('math_command_metadata').update(row).eq('id','main').eq('revision',math.revision):supabase.from('math_command_metadata').insert(row)).select('revision').maybeSingle();if(result.error||!result.data)throw Error(result.error?.message??'Math metadata changed concurrently.');mathSaved=true;}
      if(practiceChanged){const row={id:'main',catalog,revision:(practice?.revision??0)+1,updated_at:new Date().toISOString()};const result=await(practice?supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',practice.revision):supabase.from('infinite_practice_catalog').insert(row)).select('revision').maybeSingle();if(result.error||!result.data)throw Error(result.error?.message??'Practice catalog changed concurrently.');}
    }catch(error){
      if(mathSaved){const restored=await(math?supabase.from('math_command_metadata').update({state:math.state,revision:math.revision}).eq('id','main').eq('revision',revision):supabase.from('math_command_metadata').delete().eq('id','main').eq('revision',revision)).select('revision');if(restored.error||!restored.data?.length)throw Error(`${error.message} Automatic rollback was not confirmed; use ${backup}.`);}
      throw error;
    }
  }
  console.log(json({mode:apply?'applied':'preview',mathChanged,practiceChanged,generators:catalog.generators.length,modules:catalog.modules.length,videos:catalog.videos.length,subcategories:taxonomy.categories.reduce((n,c)=>n+c.topics.length,0),skillDefinitionsUnchanged:true}));
}

module.exports={local,remote,migrateState};
if(require.main===module)(process.argv.includes('--remote')?remote:local)(process.argv.includes('--apply')).catch(error=>{console.error(error);process.exitCode=1;});
