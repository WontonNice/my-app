import { createHash, randomBytes } from 'node:crypto';
import { readFile, readdir, writeFile, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import ts from 'typescript';
import documentImport from './document-import.cjs';
import mathCommand from './math-command-service.cjs';

const fail = (message, status = 400) => Object.assign(new Error(message), { status });
const hash = value => createHash('sha256').update(value).digest('hex');
const text = (value, label) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 80) throw fail(`${label} needs a name of 1–80 characters.`);
  return value.trim();
};
const unique = (values, label) => { if (new Set(values.map(value => value.toLowerCase())).size !== values.length) throw fail(`${label} must have unique names.`); };

export function mathQuestionTopics(source, fileName = 'math.ts') {
  const tree = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  if (tree.parseDiagnostics.length) throw fail(`Fix the syntax errors in ${fileName} before editing categories.`, 409);
  const questions = [];
  const visit = node => {
    if (ts.isObjectLiteralExpression(node)) {
      const fields = new Map(node.properties.filter(ts.isPropertyAssignment).map(property => [property.name.getText(tree).replace(/^["']|["']$/g, ''), property.initializer]));
      const topic = fields.get('topic'), id = fields.get('id'), subtopic = fields.get('subtopic');
      if (topic && id && ts.isStringLiteralLike(topic) && ts.isStringLiteralLike(id)) questions.push({ id: id.text, topic: topic.text, subtopic: subtopic && ts.isStringLiteralLike(subtopic) ? subtopic.text : '', topicNode: topic, subtopicNode: subtopic });
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return { tree, questions };
}

async function snapshot(root) {
  const configPath = join(root, 'tools/math-topics.json'), mathRoot = join(root, 'client/src/content/exams/mathSets');
  const configSource = await readFile(configPath, 'utf8');
  const files = await Promise.all((await readdir(mathRoot)).filter(name => name.endsWith('.ts')).sort().map(async name => {
    const path = join(mathRoot, name), source = await readFile(path, 'utf8');
    try { return { path, source, ...mathQuestionTopics(source, name) }; }
    catch (error) { return { path, source, questions: [], error }; }
  }));
  const managementPath = join(root, 'server/data/math-command.json');
  let managementSource = null, management = {};
  try { managementSource = await readFile(managementPath, 'utf8'); management = JSON.parse(managementSource); } catch(error) { if(error.code !== 'ENOENT') throw error; }
  for(const file of files) for(const question of file.questions) {
    const overlay = management.metadata?.[question.id];
    if(overlay?.category !== undefined) question.topic = overlay.category;
    if(overlay?.subcategory !== undefined) question.subtopic = overlay.subcategory;
  }
  const categories = (management.taxonomy || JSON.parse(configSource)).categories.map(category => ({ label: category.label, topics: [...category.topics] }));
  for (const { questions } of files) for (const question of questions) {
    let category = categories.find(category => category.label === question.topic);
    if (!category) { category = { label: question.topic, topics: [] }; categories.push(category); }
    if (question.subtopic && question.subtopic !== 'Unclassified' && !category.topics.includes(question.subtopic)) category.topics.push(question.subtopic);
  }
  const revision = hash(configSource + (managementSource || '') + files.map(file => file.path + hash(file.source)).join(''));
  return { configPath, configSource, files, categories, revision, managementPath, managementSource, management };
}

export async function readMathTopicConfiguration(root) {
  const state = await snapshot(root), questions = state.files.flatMap(file => file.questions);
  return {
    revision: state.revision,
    classificationSkills:state.management.classificationSkills??[],
    categories: state.categories.map(category => ({
      label: category.label,
      questionCount: questions.filter(question => question.topic === category.label).length,
      unclassifiedCount: questions.filter(question => question.topic === category.label && (!question.subtopic || question.subtopic === 'Unclassified')).length,
      topics: category.topics.map(label => ({ label, questionCount: questions.filter(question => question.topic === category.label && question.subtopic === label).length })),
    })),
  };
}

export function validateMathClassification(question, configuration, previous) {
  const topic = text(question.topic, 'Main category');
  const category = configuration.categories.find(category => category.label === topic);
  if (!category) throw fail(`Choose a configured main category for ${question.id || 'this question'}.`);
  const legacy = previous && previous.topic === topic && (!previous.subtopic || previous.subtopic === 'Unclassified');
  if (question.subtopic != null && typeof question.subtopic !== 'string') throw fail('Specific topic must be text.');
  const subtopic = question.subtopic?.trim() || (legacy ? 'Unclassified' : '');
  if (legacy && subtopic === 'Unclassified') return { topic, subtopic, skilled:mathCommand.validateSkilled(question.skilled,topic,subtopic,configuration.classificationSkills??[]) };
  text(subtopic, `Specific topic for ${question.id || 'this question'}`);
  if (!category.topics.some(candidate => (typeof candidate === 'string' ? candidate : candidate.label) === subtopic)) throw fail(`Choose a specific topic under ${topic} for ${question.id || 'this question'}.`);
  return { topic, subtopic, skilled:mathCommand.validateSkilled(question.skilled,topic,subtopic,configuration.classificationSkills??[]) };
}

// Stage every edit, check original bytes again, then commit. If an I/O failure
// occurs, restore only files still containing our own bytes, never another edit.
async function commitFiles(changes) {
  const staged = [], committed = [];
  try {
    for (const change of changes) {
      const temp = `${change.path}.topics-${randomBytes(8).toString('hex')}`;
      staged.push({ ...change, temp }); await writeFile(temp, change.next, 'utf8');
    }
    for (const change of staged) if (await readFile(change.path, 'utf8') !== change.source) throw fail('Math content changed while categories were saving. Reload and try again.', 409);
    for (const change of staged) {
      if (await readFile(change.path, 'utf8') !== change.source) throw fail('Math content changed while categories were saving. Reload and try again.', 409);
      await rename(change.temp, change.path); committed.push(change);
    }
  } catch (error) {
    for (const change of committed.reverse()) if (await readFile(change.path, 'utf8') === change.next) await writeFile(change.path, change.source, 'utf8');
    throw error;
  } finally { await Promise.all(staged.map(change => rm(change.temp, { force: true }))); }
}

export async function saveMathTopicConfiguration(root, input) {
  const state = await snapshot(root);
  const unreadable = state.files.find(file => file.error);
  if (unreadable) throw unreadable.error;
  if (!input?.revision || input.revision !== state.revision) throw fail('Math categories or questions changed. Reload the category manager and try again.', 409);
  if (!Array.isArray(input.categories) || !input.categories.length || input.categories.length > 100) throw fail('Keep between 1 and 100 main categories.');
  const normalized = input.categories.map((category, index) => {
    if (!category || typeof category !== 'object' || Array.isArray(category)) throw fail('Choose a valid main category.');
    const label = text(category.label, `Category ${index + 1}`), original = typeof category.original === 'string' ? category.original : '';
    const prior = state.categories.find(item => item.label === original);
    if (original && !prior) throw fail('A category no longer exists. Reload and try again.', 409);
    if (!Array.isArray(category.topics) || !category.topics.length || category.topics.length > 150) throw fail(`${label} needs between 1 and 150 specific topics.`);
    const topics = category.topics.map(topic => {
      if (!topic || typeof topic !== 'object' || Array.isArray(topic)) throw fail('Choose a valid specific topic.');
      const name = text(topic.label, 'Specific topic'), previous = typeof topic.original === 'string' ? topic.original : '';
      if (name === 'Unclassified') throw fail('Unclassified is reserved for older questions that need review.');
      if (previous && !prior?.topics.includes(previous)) throw fail('A specific topic no longer exists. Reload and try again.', 409);
      return { label: name, original: previous };
    });
    unique(topics.map(topic => topic.label), `Specific topics in ${label}`);
    unique(topics.map(topic => topic.original).filter(Boolean), 'Original specific topics');
    return { label, original, topics };
  });
  unique(normalized.map(category => category.label), 'Main categories');
  unique(normalized.map(category => category.original).filter(Boolean), 'Original main categories');
  const reassignments = Array.isArray(input.reassignments) ? input.reassignments : [];
  for (const move of reassignments) {
    const origin = state.categories.find(category => category.label === move.category);
    const target = normalized.find(category => category.label === move.targetCategory);
    if (!origin || (move.subtopic != null && !origin.topics.includes(move.subtopic))) throw fail('The category being removed no longer exists.', 409);
    if (!target?.topics.some(topic => topic.label === move.targetSubtopic)) throw fail('Choose a main category and specific topic for the reassigned questions.');
    if (move.subtopic == null ? normalized.some(category => category.original === move.category) : normalized.find(category => category.original === move.category)?.topics.some(topic => topic.original === move.subtopic)) throw fail('Reassignment is only available when removing a category or topic.');
  }
  const replacement = question => reassignments.find(move => move.category === question.topic && (move.subtopic == null || move.subtopic === question.subtopic));
  for (const question of state.files.flatMap(file => file.questions)) {
    if (replacement(question)) continue;
    const category = normalized.find(category => category.original === question.topic);
    if (!category) throw fail(`${question.topic} is in use. Reassign its questions before removing it.`, 409);
    if (question.subtopic && question.subtopic !== 'Unclassified' && !category.topics.some(topic => topic.original === question.subtopic)) throw fail(`${question.subtopic} is in use. Reassign its questions before removing it.`, 409);
  }
  const changes = [];
  const reclassify = question => {
    const move = replacement(question);
    if (move) return { topic: move.targetCategory, subtopic: move.targetSubtopic };
    const category = normalized.find(category => category.original === question.topic);
    return category ? { topic: category.label, subtopic: category.topics.find(topic => topic.original === question.subtopic)?.label || question.subtopic } : question;
  };
  for (const file of state.files) {
    const edits = [];
    for (const question of file.questions) {
      const updated = reclassify(question);
      for (const key of ['topic', 'subtopic']) if ((question[`${key}Node`]?.text || '') !== updated[key]) {
        const node = question[`${key}Node`];
        if (node) edits.push({ start: node.getStart(file.tree), end: node.end, text: JSON.stringify(updated[key]) });
        else if (key === 'subtopic') edits.push({ start: question.topicNode.end, end: question.topicNode.end, text: `, subtopic: ${JSON.stringify(updated[key])}` });
      }
    }
    let next = file.source;
    for (const edit of edits.sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
    if (next !== file.source) changes.push({ path: file.path, source: file.source, next });
  }
  const assessmentPath = join(root, 'server/data/assessments.json'), assessmentSource = await readFile(assessmentPath, 'utf8'), assessments = JSON.parse(assessmentSource);
  const effectiveQuestions = new Map(state.files.flatMap(file => file.questions.map(question => [question.id, question])));
  const mathIds = new Set(effectiveQuestions.keys());
  let assessmentChanged = false;
  for (const assessment of assessments) for (const question of assessment.questions || []) if (mathIds.has(question.id)) {
    const updated = reclassify(effectiveQuestions.get(question.id) || question);
    if (updated.topic !== question.topic || updated.subtopic !== question.subtopic) { Object.assign(question, updated); assessmentChanged = true; }
  }
  if (assessmentChanged) changes.push({ path: assessmentPath, source: assessmentSource, next: `${JSON.stringify(assessments, null, 2)}\n` });
  changes.push({ path: state.configPath, source: state.configSource, next: `${JSON.stringify({ categories: normalized.map(({ label, topics }) => ({ label, topics: topics.map(topic => topic.label) })) }, null, 2)}\n` });
  // Keep the downloadable extraction contract aligned with editable categories.
  // Minimal test fixtures may omit these generated artifacts entirely.
  let english;
  try { english = JSON.parse(await readFile(join(root, 'tools/content-topics.json'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (english) {
    let englishSections = {};
    try {englishSections=JSON.parse(await readFile(join(root,'tools/content-topic-sections.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
    const taxonomy = { reading: englishSections.reading || english.slice(0, 8), revising_editing_a: englishSections.revising_editing_a || english.slice(8), math: normalized.map(category => category.label), mathSpecificTopics: Object.fromEntries(normalized.map(category => [category.label, category.topics.map(topic => topic.label)])) };
    for (const [name, next] of Object.entries({ 'DOCUMENT_EXTRACTION_PROMPT.txt': documentImport.prompt(taxonomy) + '\n', 'document-import-contract.json': JSON.stringify({ ...documentImport.schema, taxonomy }, null, 2) + '\n' })) {
      const path = join(root, 'tools', name);
      let source;
      try { source = await readFile(path, 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      if (source !== next) changes.push({ path, source, next });
    }
  }
  if (state.managementSource) {
    const management = state.management;
    const practiceRenames=normalized.filter(category=>category.original===category.label).flatMap(category=>category.topics.filter(topic=>topic.original&&topic.original!==topic.label).map(topic=>({category:category.label,from:topic.original,to:topic.label})));
    if(practiceRenames.length)management.taxonomyTopicRenames=[...(management.taxonomyTopicRenames||[]),...practiceRenames];
    management.taxonomy = {categories: normalized.map(({label, topics}) => ({label, topics: topics.map(topic => topic.label)}))};
    for(const file of state.files) for(const question of file.questions) {
      const updated = reclassify(question), metadata = management.metadata?.[question.id];
      if(metadata) { if(metadata.category !== undefined) metadata.category = updated.topic; if(metadata.subcategory !== undefined) metadata.subcategory = updated.subtopic; }
    }
    management.skills = (management.skills || []).map(skill => { const updated = reclassify({topic: skill.category, subtopic: skill.subcategory}); return {...skill, category: updated.topic, subcategory: updated.subtopic}; });
    management.classificationSkills=(management.classificationSkills||[]).map(skill=>{const updated=reclassify({topic:skill.category,subtopic:skill.subcategory});return {...skill,category:updated.topic,subcategory:updated.subtopic};});
    mathCommand.validateClassificationSkills(management.classificationSkills,{categories:normalized.map(category=>({label:category.label,topics:category.topics.map(topic=>topic.label)}))});
    if(management.targets?.overrides) management.targets.overrides = management.targets.overrides.map(target => {const updated = reclassify({topic: target.category, subtopic: target.subcategory});return {...target,category:updated.topic,subcategory:updated.subtopic};});
    management.revision = randomBytes(16).toString('hex');
    changes.push({path: state.managementPath, source: state.managementSource, next: JSON.stringify(management, null, 2)+'\n'});
  }
  await commitFiles(changes);
  return readMathTopicConfiguration(root);
}
