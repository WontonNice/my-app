// Reviewed, repeatable fill for official exams. Preview by default.
require('./register-practice-generator.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const store = require('../server/src/lib/mathCommandCatalogStore.ts');
const root = path.resolve(__dirname, '..');
const manifest = require('./official-math-classifications.json');
const json = value => JSON.stringify(value, null, 2) + '\n';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const official = id => /^20\d\d-20\d\d-form-[a-d]$/.test(id);
function contentHash(question) {
  const { topic, subtopic, skilled, ...content } = question;
  return createHash('sha256').update(JSON.stringify(content)).digest('hex');
}
function plan(original) {
  const state = structuredClone(original), taxonomy = state.taxonomy ?? read('tools/math-topics.json');
  const exams = Object.values(read('server/data/exam-content.json')).filter(exam => official(exam.assessmentId));
  if (exams.length !== 22) throw Error(`Expected 22 official exams; found ${exams.length}.`);
  const questions = new Map(exams.flatMap(exam => (exam.mathSection?.questions ?? []).map(q => [q.id, q])));
  const valid = (category, topic) => taxonomy.categories.some(c => c.label === category && c.topics.includes(topic));
  const changes = [], skipped = [];
  for (const row of manifest) {
    const question = questions.get(row.id);
    if (!question || contentHash(question) !== row.contentHash) throw Error(`Question content changed since review: ${row.id}`);
    if (!valid(row.category, row.topic)) throw Error(`Reviewed topic is no longer configured: ${row.topic}`);
    const metadata = state.metadata[row.id] ?? {}, category = metadata.category ?? question.topic, topic = metadata.subcategory ?? question.subtopic;
    // A valid explicit overlay wins, including any later teacher correction.
    if (valid(category, topic) && (metadata.category !== undefined || metadata.subcategory !== undefined || metadata.classification)) { skipped.push(row.id); continue; }
    // The native pair may already have been updated by the local phase.
    if (valid(category, topic) && (category !== row.category || topic !== row.topic)) { skipped.push(row.id); continue; }
    const next = { ...metadata, category: row.category, subcategory: row.topic,
      classification: { source: 'ai', status: 'needs_review', category: row.category, subcategory: row.topic, at: new Date().toISOString(), actor: 'codex:official-math-audit', reason: row.reason } };
    state.metadata[row.id] = next;
    changes.push({ id: row.id, from: { category, topic }, to: { category: row.category, topic: row.topic } });
  }
  const invalid = [...questions.values()].filter(q => !valid(state.metadata[q.id]?.category ?? q.topic, state.metadata[q.id]?.subcategory ?? q.subtopic));
  if (invalid.length) throw Error(`Missing reviewed classifications for ${invalid.length} questions: ${invalid.map(q => q.id).join(', ')}`);
  return { state, changes, skipped, exams: exams.map(exam => ({ id: exam.assessmentId, questions: exam.mathSection.questions.length })), total: questions.size };
}
function backup(kind, value) {
  const file = path.join(root, `artifacts/official-math-${kind}-backup-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, json(value), { flag: 'wx' });
  console.log('Backup: ' + file);
}
async function local(apply) {
  const original = store.readMathCommandState(root), result = plan(original), destinations = new Map(result.changes.map(change => [change.id, change.to]));
  const { mathQuestionTopics } = await import('./math-topic-editor.mjs');
  const files = [], found = new Set();
  for (const filename of fs.readdirSync(path.join(root, 'client/src/content/exams/mathSets')).filter(name => name.endsWith('.ts'))) {
    const file = path.join(root, 'client/src/content/exams/mathSets', filename), source = fs.readFileSync(file, 'utf8');
    const { tree, questions } = mathQuestionTopics(source, filename), edits = [];
    for (const question of questions) {
      const to = destinations.get(question.id); if (!to) continue;
      found.add(question.id);
      for (const [field, value] of [['topic', to.category], ['subtopic', to.topic]]) {
        const node = question[field + 'Node'];
        if (node && node.text !== value) edits.push({ start: node.getStart(tree), end: node.end, text: JSON.stringify(value) });
        else if (!node && field === 'subtopic') edits.push({ start: question.topicNode.end, end: question.topicNode.end, text: ', subtopic: ' + JSON.stringify(value) });
      }
    }
    let next = source; for (const edit of edits.sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
    if (next !== source) files.push({ file, source, next });
  }
  for (const id of destinations.keys()) if (!found.has(id)) throw Error('Native question not found: ' + id);
  const assessments = read('server/data/assessments.json');
  for (const exam of assessments) for (const q of exam.questions ?? []) { const to = destinations.get(q.id); if (to) Object.assign(q, { topic: to.category, subtopic: to.topic }); }
  for (const [relative, next] of [['server/data/assessments.json', json(assessments)]]) {
    const file = path.join(root, relative), source = fs.readFileSync(file, 'utf8'); if (source !== next) files.push({ file, source, next });
  }
  if (apply && result.changes.length) {
    backup('local', { state: original, files: files.map(({ file, source }) => ({ file, source })) });
    for (const file of files) if (fs.readFileSync(file.file, 'utf8') !== file.source) throw Error('Concurrent file edit: ' + file.file);
    store.commitMathCommandState(root, original.revision, result.state);
    for (const file of files) fs.writeFileSync(file.file, file.next);
  }
  console.log(json({ mode: apply ? 'applied' : 'preview', exams: result.exams, questions: result.total, aiClassified: result.changes.length, preserved: result.total - result.changes.length, invalid: 0, files: files.length }));
}
async function remote(apply) {
  require('node:module').createRequire(path.join(root, 'server/package.json'))('dotenv').config({ path: [path.join(root, 'server/.env'), path.join(root, '.env')], quiet: true });
  const { supabase } = require('../server/src/lib/supabase.ts');
  const current = await supabase.from('math_command_metadata').select('revision,state').eq('id', 'main').maybeSingle();
  if (current.error) throw Error(current.error.message);
  if (!current.data) throw Error('Shared math state is missing. Refusing to replace it with a local snapshot.');
  const result = plan(current.data.state), changed = !isDeepStrictEqual(current.data.state, result.state);
  if (apply && changed) {
    backup('remote', current.data);
    const revision = randomUUID(); result.state.revision = revision;
    const saved = await supabase.from('math_command_metadata').update({ state: result.state, revision, updated_at: new Date().toISOString() }).eq('id', 'main').eq('revision', current.data.revision).select('revision').maybeSingle();
    if (saved.error || !saved.data) throw Error(saved.error?.message ?? 'Shared classifications changed concurrently. Preview again.');
  }
  console.log(json({ mode: apply ? 'applied' : 'preview', exams: result.exams.length, questions: result.total, aiClassified: result.changes.length, preserved: result.total - result.changes.length, invalid: 0, changed }));
}
module.exports = { plan, contentHash };
if (require.main === module) (process.argv.includes('--remote') ? remote : local)(process.argv.includes('--apply')).catch(error => { console.error(error.message); process.exitCode = 1; });
