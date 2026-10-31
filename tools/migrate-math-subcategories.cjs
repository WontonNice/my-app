// October 2026 taxonomy migration. Preview by default; --apply writes local files.
// --remote previews the shared state; --remote --apply publishes the prepared migration.
require('./register-practice-generator.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const { mathSubcategoryMoves, migratedMathLocation, migratedMathSkillLocation } = require('../server/src/shared/mathSubcategoryMigration.ts');
const { reconcilePracticeTaxonomy, validatePracticeCatalog, defaultPracticeCatalog } = require('../server/src/shared/practiceCatalog.ts');
const { validateClassificationSkills } = require('../server/src/shared/mathClassificationSkills.ts');
const { validateMathDiagnosticSkills } = require('../server/src/shared/mathCommandTaxonomy.ts');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const json = value => JSON.stringify(value, null, 2) + '\n';

// Reviewed question destinations for topics that split. Unclassified imports stay unclassified.
const overrides = new Map();
function assign(category, topic, groups) {
  for (const [prefix, suffixes] of Object.entries(groups)) for (const suffix of suffixes) {
    const id = prefix + suffix;
    if (overrides.has(id)) throw Error(`Duplicate migration destination: ${id}`);
    overrides.set(id, { category, topic });
  }
}
assign('Algebra', 'Formulas & Rearranging Equations', {
  '2021-2022-form-a-q': [100,112], '2022-2023-form-a-q': [72,104], '2022-2023-form-b-q': [64,65],
  '2026-2027-form-a-math-item-': [38,48], '2026-2027-form-d-math-item-': [2],
});
assign('Algebra', 'Algebraic Word Problems', {
  '': ['tien-jordan-age-ratio'], '2025-2026-form-a-math-': [9,15], '2021-2022-form-a-q': [62,66,87],
  '2022-2023-form-a-q': [85,107], '2022-2023-form-b-q': [107], '2019-2020-form-a-q': [97,112],
  '2024-2025-form-a-q': [84], '2026-2027-form-a-math-item-': [8,14,26], '2026-2027-form-d-math-item-': [44,45],
});
assign('Algebra', 'Algebraic Expressions', {
  '': ['compound-fraction-math-entry'], '2022-2023-form-a-q': [79], '2022-2023-form-b-q': [67],
  '2019-2020-form-a-q': [90], '2024-2025-form-a-q': [64], '2026-2027-form-a-math-item-': [50], '2026-2027-form-d-math-item-': [4],
});
assign('Algebra', 'Patterns & Sequences', {'2024-2025-form-a-q':[75], '2020-2021-form-b-q':[94], '2019-2020-form-a-q':[88]});
assign('Algebra', 'Equations & Systems', {'2020-2021-form-b-q':[70]});
assign('Algebra', 'Inequalities', {'2020-2021-form-b-q':[72]});
assign('Geometry', 'Triangles & Polygons', {
  '2025-2026-form-a-math-':[11], '2021-2022-form-a-q':[58], '2022-2023-form-a-q':[68],
  '2022-2023-form-b-q':[73], '2019-2020-form-a-q':[91], '2026-2027-form-a-math-item-':[9], '2026-2027-form-d-math-item-':[13],
});
assign('Geometry', 'Circles', {'2020-2021-form-b-q':[89], '2022-2023-form-a-q':[58,114], '2019-2020-form-a-q':[94], '2024-2025-form-a-q':[65]});
assign('Geometry', 'Coordinates & Segment Relationships', {
  '2019-2020-form-a-q':[67,92], '2021-2022-form-a-q':[111], '2022-2023-form-a-q':[82],
  '2024-2025-form-a-q':[82,94,113], '2026-2027-form-a-math-item-':[47],
});
assign('Geometry', 'Surface Area & Volume', {'2022-2023-form-b-q':[58,110], '2019-2020-form-a-q':[107], '2024-2025-form-a-q':[96], '2026-2027-form-d-math-item-':[47]});
assign('Geometry', 'Similarity & Scale Drawings', {'2020-2021-form-b-math-':[3]});
assign('Statistics and Probability', 'Sampling & Predictions', {
  '2020-2021-form-b-q':[77], '2022-2023-form-a-q':[97,98,105], '2022-2023-form-b-q':[93],
  '2019-2020-form-a-q':[103], '2024-2025-form-a-q':[72,104], '2026-2027-form-d-math-item-':[31],
});
assign('Statistics and Probability', 'Compound Probability', {
  '':['cards-without-replacement-not-blue'], '2020-2021-form-b-q':[86,98,102,107,109], '2021-2022-form-a-q':[78,99],
  '2022-2023-form-a-q':[99,100,102], '2022-2023-form-b-q':[97,99,100], '2019-2020-form-a-q':[110,114],
  '2024-2025-form-a-q':[74], '2026-2027-form-a-math-item-':[19], '2026-2027-form-d-math-item-':[5,29,34],
});
assign('Statistics and Probability', 'Counting & Combinations', {'2020-2021-form-b-math-':[2], '2022-2023-form-b-q':[101], '2026-2027-form-d-math-item-':[38]});
assign('Statistics and Probability', 'Set Relationships', {'2021-2022-form-a-q':[61,76], '2022-2023-form-b-q':[76], '2026-2027-form-d-math-item-':[17]});
assign('Ratios and Proportional Relationships', 'Proportional Relationships', {
  '':['notebook-cost-graph-points'], '2020-2021-form-b-q':[76,87], '2022-2023-form-a-q':[90,91,92,109,112,113],
  '2022-2023-form-b-q':[59,102,104,105,109], '2024-2025-form-a-q':[103,105,112,114],
  '2026-2027-form-a-math-item-':[37], '2026-2027-form-d-math-item-':[16,28,41],
});
assign('Ratios and Proportional Relationships', 'Percent Change & Applications', {
  '2020-2021-form-b-q':[66,73,92,100,113], '2021-2022-form-a-q':[102], '2022-2023-form-a-q':[110],
  '2022-2023-form-b-q':[61,94,106,108,112,114], '2019-2020-form-a-q':[58],
  '2024-2025-form-a-q':[63,73,91,95,97,110], '2026-2027-form-d-math-item-':[19,33,50],
});
assign('Ratios and Proportional Relationships', 'Ratios & Proportions', {'2020-2021-form-b-q':[68]});
assign('Ratios and Proportional Relationships', 'Rates & Unit Rates', {'2020-2021-form-b-q':[71]});
assign('Arithmetic & Number Sense', 'Number Types & Properties', {'2021-2022-form-a-q':[97]});
assign('Arithmetic & Number Sense', 'Fractions', {'2020-2021-form-b-q':[67,69]});
assign('Arithmetic & Number Sense', 'Decimals', {'2022-2023-form-a-q':[78,81], '2022-2023-form-b-q':[60], '2024-2025-form-a-q':[100,108]});
assign('Arithmetic & Number Sense', 'Order of Operations', {
  '2021-2022-form-a-q':[94,109], '2022-2023-form-a-q':[67,77,80], '2022-2023-form-b-q':[79],
  '2019-2020-form-a-q':[59,77], '2024-2025-form-a-q':[81], '2026-2027-form-a-math-item-':[45],
  '2026-2027-form-d-math-item-':[20], 'digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-math-':[9],
});
assign('Arithmetic & Number Sense', 'Exponents, Roots & Scientific Notation', {'2019-2020-form-a-q':[63]});

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
    const backup=path.join(root,'artifacts/math-subcategories-local-backup-'+Date.now()+'.json');
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
  const catalog=validatePracticeCatalog(reconcilePracticeTaxonomy(practice?.catalog??defaultPracticeCatalog(),{...taxonomy,classificationSkills:state.classificationSkills},state.taxonomyTopicRenames),{...taxonomy,classificationSkills:state.classificationSkills});
  const mathChanged=!math||!isDeepStrictEqual(math.state,state),practiceChanged=!practice||!isDeepStrictEqual(practice.catalog,catalog);
  if(apply&&(mathChanged||practiceChanged)){
    const backup=path.join(root,'artifacts/math-subcategories-remote-backup-'+Date.now()+'.json');
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
