// Authored exam modules are the source of truth; JSON registries are projections.
const fs = require('node:fs');
const path = require('node:path');
const { compileContentModule } = require('./content-transpile-cache.cjs');

function withTypeScript(operation) {
  const previous = require.extensions['.ts'];
  require.extensions['.ts'] = compileContentModule;
  try { return operation(); }
  finally {
    if (previous) require.extensions['.ts'] = previous;
    else delete require.extensions['.ts'];
  }
}
const { orderByQuestionIds } = withTypeScript(() => require('../server/src/shared/examQuestionOrder.ts'));
const { activityStore } = withTypeScript(() => require('../server/src/lib/activityStore.ts'));

function examQuestions(content) {
  return orderByQuestionIds([
    ...(content.passageSets || []).flatMap(set => set.questions),
    ...(content.standaloneSection?.questions || []),
    ...(content.mathSection?.questions || []),
  ], content.questionOrder);
}

function assessmentQuestionFrom(question) {
  return {
    answer: typeof question.correctChoiceId === 'string' ? question.correctChoiceId
      : Array.isArray(question.correctChoiceIds) ? question.correctChoiceIds.join(',')
      : Array.isArray(question.correctTextAnswers) ? question.correctTextAnswers[0] ?? '' : '',
    choices: Array.isArray(question.choices) ? question.choices.map(choice => String(choice.text ?? '')) : [],
    id: String(question.id ?? ''),
    ...(typeof question.skilled === 'string' ? { skilled: question.skilled } : {}),
    imageUrl: typeof question.image?.src === 'string' ? question.image.src : '',
    points: Number.isFinite(Number(question.points)) ? Number(question.points) : 1,
    prompt: String(question.prompt ?? ''),
    topic: String(question.topic ?? 'Uncategorized'),
    ...(question.subtopic ? { subtopic: String(question.subtopic) } : {}),
    type: String(question.type ?? 'multiple_choice'),
  };
}

function validateExamContent(id, content) {
  // Check the un-ordered array: the player's order helper deliberately tolerates
  // legacy order lists and would otherwise hide duplicate identities.
  const seen = new Set();
  for (const question of [...(content.passageSets || []).flatMap(set => set.questions), ...(content.standaloneSection?.questions || []), ...(content.mathSection?.questions || [])]) {
    if (typeof question.id !== 'string' || !question.id.trim()) throw new Error(`Exam ${id} contains a question without an ID.`);
    if (seen.has(question.id)) throw new Error(`Exam ${id} contains duplicate question ID ${question.id}.`);
    seen.add(question.id);
  }
}

function readExamCatalog(root) {
  return withTypeScript(() => {
    const contentRoot = path.join(root, 'client/src/content/exams');
    for (const filename of Object.keys(require.cache)) if (filename.startsWith(contentRoot + path.sep)) delete require.cache[filename];
    const api = require(path.join(contentRoot, 'index.ts'));
    const assessments = activityStore(path.join(root, 'server/data')).read();
    const registeredIds = new Set(api.registeredExamIds?.() || []);
    const seen = new Set();
    for (const assessment of assessments) {
      if (!assessment.id || seen.has(assessment.id)) throw new Error(`Missing or duplicate assessment ID: ${assessment.id}`);
      seen.add(assessment.id);
    }
    for (const id of registeredIds) if (!seen.has(id)) throw new Error(`Authored exam ${id} is missing from the assessment registry.`);
    const releaseFile=path.join(root,'server/data/activity-releases.json');
    const releases=fs.existsSync(releaseFile)?JSON.parse(fs.readFileSync(releaseFile,'utf8')):{};
    const content = Object.fromEntries(assessments.map(assessment => {
      const release=assessment.assembly?.publishedReleaseId&&releases[assessment.assembly.publishedReleaseId];
      if(assessment.assembly?.publishedReleaseId&&!release)throw new Error(`Published release missing for ${assessment.id}.`);
      if(release)registeredIds.add(assessment.id);
      const exam = release?.content || api.resolveExamContent(assessment);
      validateExamContent(assessment.id, exam);
      return [assessment.id, exam];
    }));
    return { assessments, content, registeredIds };
  });
}

function reconcileAssessments({ assessments, content, registeredIds }) {
  return assessments.map(assessment => registeredIds.has(assessment.id)
    ? { ...assessment, questions: examQuestions(content[assessment.id]).map(assessmentQuestionFrom) }
    : assessment);
}

module.exports = { readExamCatalog, examQuestions, assessmentQuestionFrom, reconcileAssessments, validateExamContent, activityStore, withTypeScript };
