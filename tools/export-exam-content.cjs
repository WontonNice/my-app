// Export the same authored content used by the student app for server-side grading.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function mathImportReview(workspaceRoot, content) {
  const canonicalByAssessment = new Map(Object.entries(content).map(([id, exam]) => [id, new Set((exam.mathSection?.questions ?? []).map(question => question.id))]));
  const canonicalIds = new Set([...canonicalByAssessment.values()].flatMap(ids => [...ids]));
  const manifestPath = path.join(workspaceRoot, 'server/data/math-import-review.json');
  const existing = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  // Builds without private editor drafts retain the published review flags.
  const pending = new Set((Array.isArray(existing.needsEditingQuestionIds) ? existing.needsEditingQuestionIds : []).filter(id => typeof id === 'string' && canonicalIds.has(id)));
  const statusPath = path.join(workspaceRoot, 'tools/.content-drafts/math-import-status.json');
  if (fs.existsSync(statusPath)) {
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    if (!status || typeof status !== 'object' || Array.isArray(status)) throw new Error('Math import status must be an object before content can be exported.');
    const local = new Map();
    for (const [key, value] of Object.entries(status)) {
      let pair;
      try { pair = JSON.parse(key); } catch { continue; }
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || typeof pair[1] !== 'string' || !canonicalByAssessment.get(pair[0])?.has(pair[1]) || typeof value?.needsEditing !== 'boolean') continue;
      // A reused question remains under review if any local source marks it red.
      local.set(pair[1], local.get(pair[1]) === true || value.needsEditing);
    }
    for (const [id, needsEditing] of local) {
      if (needsEditing) pending.add(id);
      else pending.delete(id);
    }
  }
  return { schemaVersion: 1, needsEditingQuestionIds: [...pending].sort() };
}

function exportExamContent(workspaceRoot = root) {
  const previous = require.extensions['.ts'];
  require.extensions['.ts'] = (module, filename) => {
    module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText, filename);
  };
  try {
    const contentRoot = path.join(workspaceRoot, 'client', 'src', 'content', 'exams');
    for (const filename of Object.keys(require.cache)) {
      if (filename.startsWith(contentRoot + path.sep)) delete require.cache[filename];
    }
    const { resolveExamContent } = require(path.join(contentRoot, 'index.ts'));
    const assessments = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'server/data/assessments.json'), 'utf8'));
    const content = Object.fromEntries(assessments.map(assessment => [assessment.id, resolveExamContent(assessment)]));
    const review = mathImportReview(workspaceRoot, content);
    const output = path.join(workspaceRoot, 'server/data/exam-content.json');
    const temporary = output + `.${process.pid}.tmp`;
    const reviewOutput = path.join(workspaceRoot, 'server/data/math-import-review.json');
    const reviewTemporary = reviewOutput + `.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(content) + '\n');
    fs.writeFileSync(reviewTemporary, JSON.stringify(review) + '\n');
    fs.renameSync(temporary, output);
    fs.renameSync(reviewTemporary, reviewOutput);
  } finally {
    if (previous) require.extensions['.ts'] = previous;
    else delete require.extensions['.ts'];
  }
}
module.exports = { exportExamContent, mathImportReview };
if (require.main === module) exportExamContent();
