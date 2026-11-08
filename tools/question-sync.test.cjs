const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { exportExamContent } = require('./export-exam-content.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'shsat-question-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ['client/src/content/exams', 'server/data']) fs.mkdirSync(path.join(root, dir), { recursive: true });
  const write = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2));
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const q = (id, extra = {}) => ({ id, type: 'multiple_choice', prompt: `Current ${id}`, topic: 'Algebra', choices: [{ id: 'A', text: '2' }, { id: 'B', text: '3' }], correctChoiceId: 'B', points: 2, ...extra });
  const shared = q('standalone', { topic: 'Pronouns' });
  const exams = {
    first: { assessmentId: 'first', title: 'First', passageSets: [{ passage: { id: 'passage' }, questions: [q('reading', { topic: 'Inference' })] }], standaloneSection: { questions: [shared] }, mathSection: { questions: [q('math', { subtopic: 'Equations', skilled: 'equation-skill', image: { src: '/exam-images/math.svg' } })] }, questionOrder: ['standalone', 'reading', 'math'] },
    second: { assessmentId: 'second', title: 'Second', passageSets: [], standaloneSection: { questions: [shared] } },
  };
  const publishSource = () => fs.writeFileSync(path.join(root, 'client/src/content/exams/index.ts'), `const content = ${JSON.stringify(exams)}; export const registeredExamIds = () => Object.keys(content); export const resolveExamContent = (assessment:any) => content[assessment.id] ?? { assessmentId:assessment.id, passageSets:[], mathSection:{questions:assessment.questions} };`);
  publishSource();
  const stale = { id: 'standalone', type: 'short_response', prompt: 'Old wording', topic: 'Verbs', choices: ['Old'], answer: 'A', points: 1, subtopic: 'obsolete' };
  const assessments = [{ id: 'first', title: 'First', forms: [{ id: 'form-a' }], formAssignments: { student: 'form-a' }, sectionAccess: { english: false, math: true }, questions: [stale, { ...stale, id: 'obsolete' }] }, { id: 'second', questions: [stale] }, { id: 'teacher-created', questions: [q('ad-hoc')] }];
  write('server/data/assessments.json', assessments);
  write('server/data/student-results-sentinel.json', { attempt: { analysisContent: exams.first, answers: { standalone: 'A' } } });
  return { root, read, write, q, exams, assessments, publishSource };
}

test('one export reconciles all registered question fields and membership in source order without changing access or history', t => {
  const f = fixture(t), history = f.read('server/data/student-results-sentinel.json');
  exportExamContent(f.root);
  const [first, second, adHoc] = f.read('server/data/assessments.json');
  assert.deepEqual(first.questions.map(q => q.id), ['standalone', 'reading', 'math']);
  assert.equal(first.questions[0].prompt, 'Current standalone');
  assert.equal(first.questions[0].answer, 'B');
  assert.equal(first.questions[0].type, 'multiple_choice');
  assert.equal(first.questions[0].points, 2);
  assert.deepEqual(first.questions[0].choices, ['2', '3']);
  assert.equal(first.questions[0].subtopic, undefined);
  assert.equal(first.questions[2].subtopic, 'Equations');
  assert.equal(first.questions[2].skilled, 'equation-skill');
  assert.equal(first.questions[2].imageUrl, '/exam-images/math.svg');
  assert.deepEqual(second.questions, [first.questions[0]]);
  for (const field of ['forms', 'formAssignments', 'sectionAccess']) assert.deepEqual(first[field], f.assessments[0][field]);
  assert.deepEqual(adHoc, f.assessments[2], 'registry-only teacher assessments are not rewritten from fallback content');
  assert.deepEqual(f.read('server/data/student-results-sentinel.json'), history);
  const before = fs.readFileSync(path.join(f.root, 'server/data/assessments.json'), 'utf8');
  exportExamContent(f.root);
  assert.equal(fs.readFileSync(path.join(f.root, 'server/data/assessments.json'), 'utf8'), before, 'reconciliation is idempotent');
});

test('later edits to a shared question reach every exam and clear removed metadata', t => {
  const f = fixture(t);
  exportExamContent(f.root);
  for (const exam of Object.values(f.exams)) Object.assign(exam.standaloneSection.questions[0], { prompt: 'Revised again', correctChoiceId: 'A', topic: 'Punctuation' });
  f.publishSource();
  exportExamContent(f.root);
  for (const assessment of f.read('server/data/assessments.json').slice(0, 2)) {
    const summary = assessment.questions.find(q => q.id === 'standalone');
    assert.equal(summary.prompt, 'Revised again');
    assert.equal(summary.answer, 'A');
    assert.equal(summary.topic, 'Punctuation');
  }
});

test('duplicate question IDs fail before replacing any derived files', t => {
  const f = fixture(t);
  exportExamContent(f.root);
  const before = ['assessments.json', 'exam-content.json', 'math-import-review.json'].map(file => fs.readFileSync(path.join(f.root, 'server/data', file), 'utf8'));
  f.exams.first.mathSection.questions.push(f.q('standalone'));
  f.publishSource();
  assert.throws(() => exportExamContent(f.root), /duplicate.*standalone/i);
  assert.deepEqual(['assessments.json', 'exam-content.json', 'math-import-review.json'].map(file => fs.readFileSync(path.join(f.root, 'server/data', file), 'utf8')), before);
});

test('one catalog indexes every source, retains explicit versions, and filters without changing exam order', () => {
  const { questionCatalog, selectCatalog } = require('./question-catalog.cjs');
  const standalone = { id: 'standalone', type: 'multiple_choice', topic: 'Pronouns', prompt: 'Original wording' };
  const version = { ...standalone, id: 'source-version', duplicateOf: standalone.id, prompt: 'Retained source wording' };
  const math = { id: 'math', type: 'numeric_entry', topic: 'Algebra', subtopic: 'Equations', prompt: 'Solve x', correctTextAnswers: ['3'] };
  const reading = { id: 'reading', type: 'multiple_choice', topic: 'Inference', prompt: 'Explain the passage' };
  const capture = { id: 'capture', subject: 'English', section: 'reading', status: 'published', topic: 'Inference', prompt: 'Imported question' };
  const inventory = { passages: [{ id: 'p', section: 'reading', fileName: 'p.ts', questions: [reading] }], mathSections: [{ id: 'm', fileName: 'm.ts', questions: [math] }], standaloneItems: [standalone, version], tests: [{ assessmentId: 'exam', passageIds: ['p'], standaloneItemIds: [version.id], mathSectionFileName: 'm.ts' }], errors: [] };
  const content = { assessmentId: 'exam', title: 'Fixture exam', passageSets: [{ questions: [reading] }], mathSection: { questions: [math] }, standaloneSection: { questions: [version] }, questionOrder: [version.id, reading.id, math.id] };
  const catalog = { registeredIds: new Set(['exam']), content: { exam: content } };
  const bank = { questions: [capture], sets: [{ id: 'set', questionIds: [capture.id] }] };
  const before = JSON.stringify({ inventory, content, bank });
  const indexed = questionCatalog(inventory, catalog, bank);
  assert.deepEqual(indexed.issues, []);
  assert.equal(indexed.entries.length, 5);
  const retained = indexed.entries.find(entry => entry.id === version.id);
  assert.equal(retained.canonicalId, standalone.id);
  assert.equal(retained.question.prompt, 'Retained source wording');
  assert.equal(retained.editor.versionId, version.id);
  assert.equal(retained.exams[0].number, 1);
  assert.deepEqual(selectCatalog(indexed.entries, { subject: 'Math', topic: 'Algebra', assessmentId: 'exam' }).map(q => q.id), ['math']);
  assert.deepEqual(selectCatalog(indexed.entries, { search: 'retained', sort: 'topic' }).map(q => q.id), [version.id]);
  assert.deepEqual(selectCatalog(indexed.entries, { id: version.id }).map(q => q.id), [version.id]);
  assert.deepEqual(selectCatalog(indexed.entries, { canonicalId: standalone.id }).map(q => q.id), [version.id, standalone.id]);
  assert.equal(JSON.stringify({ inventory, content, bank }), before);
  inventory.mathSections[0].questions = [];
  bank.sets[0].questionIds.push('missing-capture');
  const broken = questionCatalog(inventory, catalog, bank).issues;
  assert.ok(broken.some(issue => issue.type === 'missing-editor-question' && issue.id === math.id));
  assert.ok(broken.some(issue => issue.type === 'missing-editor-membership' && issue.id === math.id));
  assert.ok(broken.some(issue => issue.type === 'invalid-set-question' && issue.id === 'missing-capture'));
});

test('unregistered editor exams and conflicting bank identities cannot silently disappear', () => {
  const { questionCatalog } = require('./question-catalog.cjs');
  const question = { id: 'same-id', type: 'multiple_choice', prompt: 'Question' };
  const inventory = { passages: [], mathSections: [{ fileName: 'math.ts', questions: [question] }], standaloneItems: [question], tests: [{ assessmentId: 'lost-exam' }], errors: [] };
  const result = questionCatalog(inventory, { registeredIds: new Set(), content: {} }, { questions: [], sets: [] });
  assert.deepEqual(result.issues.map(issue => issue.type), ['duplicate-bank-id', 'unregistered-editor-exam']);
});
