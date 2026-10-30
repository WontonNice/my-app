import { readFile, writeFile, mkdir, rename, rm, open } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import ts from 'typescript';

export const englishSections = ['reading', 'revising_editing_a', 'revising_editing_b'];
const fail = (message, status = 400) => Object.assign(new Error(message), {status});
const read = async path => { try { return await readFile(path, 'utf8'); } catch(error) { if(error.code === 'ENOENT') return null; throw error; } };
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export async function readEnglishTopicSections(root) {
  const legacy = JSON.parse(await read(join(root, 'tools/content-topics.json')) || '[]');
  const saved = JSON.parse(await read(join(root, 'tools/content-topic-sections.json')) || '{}');
  return Object.fromEntries(englishSections.map(section => {
    const topics = saved[section] ?? (section === 'reading' ? legacy.slice(0,8) : legacy.slice(8));
    if(!Array.isArray(topics) || !topics.length || topics.some(topic => typeof topic !== 'string' || !topic.trim())) throw fail(`The ${section} topic list is invalid.`, 409);
    return [section, [...topics]];
  }));
}

export function patchQuestionTopics(source, renamesById) {
  const file = ts.createSourceFile('questions.ts', source, ts.ScriptTarget.Latest, true), edits = [], found = new Set();
  if(file.parseDiagnostics.length) throw fail('Fix the question source syntax before renaming topics.',409);
  const walk = node => {
    if(ts.isObjectLiteralExpression(node)) {
      const properties = new Map(node.properties.filter(ts.isPropertyAssignment).map(property => [property.name.getText(file).replace(/^['"]|['"]$/g,''), property.initializer]));
      const id = properties.get('id'), topic = properties.get('topic');
      if(id && topic && ts.isStringLiteralLike(id) && ts.isStringLiteralLike(topic) && renamesById.has(id.text)) {
        const value = renamesById.get(id.text); found.add(id.text);
        if(value !== topic.text) edits.push({start:topic.getStart(file),end:topic.end,text:JSON.stringify(value)});
      }
    }
    ts.forEachChild(node,walk);
  };
  walk(file);
  if([...renamesById.keys()].some(id => !found.has(id))) throw fail('A question topic cannot be safely renamed in its source. No changes were saved.',409);
  for(const edit of edits.sort((a,b)=>b.start-a.start)) source = source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  return source;
}

async function snapshot(root,sources) {
  const configPath=join(root,'tools/content-topic-sections.json'), configSource=await read(configPath), legacySource=await read(join(root,'tools/content-topics.json'));
  const files=await Promise.all(sources.map(async source=>({...source,source:await readFile(source.path,'utf8')})));
  const registryPath=join(root,'server/data/assessments.json'), registrySource=await read(registryPath);
  const sections=await readEnglishTopicSections(root);
  const revision=hash([configSource,legacySource,registrySource,files.map(file=>[file.path,file.source])]);
  const unclassifiedCountBySection=Object.fromEntries(englishSections.map(section=>[section,0]));
  const topicDetailsBySection=Object.fromEntries(englishSections.map(section=>{
    const counts=new Map(sections[section].map(label=>[label,0]));
    for(const file of files.filter(file=>file.section===section)) for(const question of file.questions) {
      // An unfinished classification is not an editable topic name. Keep the
      // question untouched while tracking it separately from named-topic use.
      if(typeof question.topic!=='string'||!question.topic.trim()) {unclassifiedCountBySection[section]++;continue;}
      counts.set(question.topic,(counts.get(question.topic)||0)+1);
    }
    return [section,[...counts].map(([label,questionCount])=>({label,questionCount}))];
  }));
  return {sections,revision,topicDetailsBySection,unclassifiedCountBySection,configPath,configSource,files,registryPath,registrySource};
}
export async function englishTopicConfiguration(root,sources) {
  const {sections,revision,topicDetailsBySection,unclassifiedCountBySection}=await snapshot(root,sources);
  return {sections,revision,topicDetailsBySection,unclassifiedCountBySection};
}
export async function saveEnglishSectionTopics(root,input,sources) {
  const lockPath=join(root,'tools/content-topic-sections.json.lock');
  let lock;
  try {lock=await open(lockPath,'wx');} catch(error) {if(error.code==='EEXIST')throw fail('Another topic save is in progress. Retry after it finishes.',409);throw error;}
  try {return await saveTopicsLocked(root,input,sources);} finally {await lock.close();await rm(lockPath,{force:true});}
}
async function saveTopicsLocked(root,input,sources) {
  if(!englishSections.includes(input?.section)) throw fail('Choose Reading, Part A, or Part B topics.');
  const state=await snapshot(root,sources), section=input.section;
  if(input.revision!==state.revision) throw fail('Topics or questions changed. Reopen the topic manager and retry.',409);
  if(!Array.isArray(input.topics)||!input.topics.length||input.topics.length>150) throw fail('Keep between 1 and 150 topics in this library.');
  const topics=input.topics.map(item=>{
    if(!item||typeof item.label!=='string'||!item.label.trim()||item.label.trim().length>80) throw fail('Use topic names of 1–80 characters.');
    const original=typeof item.original==='string'?item.original:'';
    if(original&&!state.topicDetailsBySection[section].some(topic=>topic.label===original)) throw fail('A topic no longer exists. Reopen the manager.',409);
    return {label:item.label.trim(),original};
  });
  if(new Set(topics.map(topic=>topic.label.toLowerCase())).size!==topics.length || new Set(topics.map(topic=>topic.original).filter(Boolean)).size!==topics.filter(topic=>topic.original).length) throw fail('Use unique topic names within this library.');
  for(const topic of state.topicDetailsBySection[section]) if(topic.questionCount&&!topics.some(item=>item.original===topic.label)) throw fail(`${topic.label} is used by ${topic.questionCount} questions. Reclassify them before removing it.`,409);
  const renames=new Map(topics.filter(topic=>topic.original&&topic.label!==topic.original).map(topic=>[topic.original,topic.label]));
  const ids=new Map(), changes=[];
  for(const file of state.files.filter(file=>file.section===section)) {
    const replacements=new Map(file.questions.filter(question=>renames.has(question.topic)).map(question=>[question.id,renames.get(question.topic)]));
    replacements.forEach((value,id)=>ids.set(id,value));
    if(replacements.size) changes.push({path:file.path,source:file.source,next:patchQuestionTopics(file.source,replacements)});
  }
  if(state.registrySource&&ids.size) {
    const registry=JSON.parse(state.registrySource);
    for(const assessment of registry) for(const question of assessment.questions||[]) if(ids.has(question.id)) question.topic=ids.get(question.id);
    const next=JSON.stringify(registry,null,2)+'\n';
    if(JSON.stringify(registry)!==JSON.stringify(JSON.parse(state.registrySource))) changes.push({path:state.registryPath,source:state.registrySource,next});
  }
  state.sections[section]=topics.map(topic=>topic.label);
  changes.push({path:state.configPath,source:state.configSource,next:JSON.stringify(state.sections,null,2)+'\n'});
  const staged=[],committed=[];
  try {
    for(const change of changes) { await mkdir(dirname(change.path),{recursive:true});const temp=change.path+'.topics-'+randomUUID();await writeFile(temp,change.next,'utf8');staged.push({...change,temp}); }
    // Include files from the other libraries in the stale-editor check.
    if((await snapshot(root,sources)).revision!==state.revision) throw fail('Topics or questions changed during the save. Reopen the manager.',409);
    for(const change of staged) {if(await read(change.path)!==change.source)throw fail('A source changed during the save. Retry.',409);await rename(change.temp,change.path);committed.push(change);}
  } catch(error) {
    for(const change of committed.reverse()) if(await read(change.path)===change.next) {if(change.source===null) await rm(change.path,{force:true});else await writeFile(change.path,change.source,'utf8');}
    throw error;
  } finally {await Promise.all(staged.map(change=>rm(change.temp,{force:true})));}
  return state.sections;
}
