const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('node:module').createRequire(path.resolve(__dirname, '../server/package.json'))('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { createExamPreviewSession } = require('./exam-preview-content.ts');
const { resolveExamContent } = require('../client/src/content/exams/index.ts');
const { getAllExamQuestions } = require('../server/src/shared/examGrading.ts');

for (const form of ['b', 'c']) test('Form ' + form.toUpperCase() + ' preview uses the same content normalization as the student player', () => {
  const content = require('../server/data/exam-content.json')['2026-2027-form-' + form];
  const before = structuredClone(content);
  const exit = () => {};
  const preview = createExamPreviewSession(content, 'math', exit);
  assert.equal(preview.startingSubject, 'math');
  assert.equal(preview.onExit, exit);
  assert.deepEqual(JSON.parse(JSON.stringify(preview.content)), JSON.parse(JSON.stringify(resolveExamContent(preview.assessment))));
  assert.equal(getAllExamQuestions(preview.content).length, 100);
  assert.equal(preview.content.mathSection.questions.length, 50);
  assert.deepEqual(content, before);
});

test('saved editor content takes precedence over the bundled catalog without changing the original', () => {
  const original = require('../server/data/exam-content.json')['2026-2027-form-b'];
  const saved = structuredClone(original);
  saved.mathSection.questions[0].prompt = 'Latest saved editor change';
  const preview = createExamPreviewSession(saved, 'english', () => {});
  assert.equal(preview.content.mathSection.questions[0].prompt, 'Latest saved editor change');
  assert.notEqual(original.mathSection.questions[0].prompt, 'Latest saved editor change');
});

test('worksheet preview respects its actual source identity and duration',()=>{
  const source={sourceFamily:'official_shsat',shsatLevel:'9',year:'2008-2009'};
  const content={assessmentId:'grade9-preview',title:'Grade 9 worksheet',source,passageSets:[],previewMetadata:{durationMinutes:30,studyHallWorksheet:{subject:'math',scope:'mixed',category:'Math',source}}};
  const preview=createExamPreviewSession(content,'math',()=>{});
  assert.equal(preview.assessment.durationMinutes,30);assert.equal(preview.assessment.studyHallWorksheet.source.shsatLevel,'9');assert.equal(preview.content.source.shsatLevel,'9');
});
