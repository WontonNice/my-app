// Export the same authored content used by the student app for server-side grading.
const fs = require('node:fs');
const path = require('node:path');
const { writeExportFile } = require('./write-export-file.cjs');
const { readExamCatalog, reconcileAssessments, activityStore } = require('./exam-catalog.cjs');
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
  // Resolve and validate everything before replacing any derived file. Running
  // this again also repairs an interrupted export without changing authored IDs.
  const catalog = readExamCatalog(workspaceRoot);
  const review = mathImportReview(workspaceRoot, catalog.content);
  const assessments = reconcileAssessments(catalog);
  // A small projection lets Study Hall show actual exam membership without
  // treating editable source/version labels as evidence of exam usage.
  const passageAppearances = {};
  for (const assessment of assessments) {
    for (const set of catalog.content[assessment.id]?.passageSets ?? []) {
      if (!set.passage?.id) continue;
      const titles = passageAppearances[set.passage.id] ??= [];
      if (!titles.includes(assessment.title)) titles.push(assessment.title);
    }
  }
  writeExportFile(path.join(workspaceRoot, 'client/src/content/exams/passageAppearances.json'), JSON.stringify(passageAppearances, null, 2) + '\n');
  writeExportFile(path.join(workspaceRoot, 'server/data/exam-content.json'), JSON.stringify(catalog.content) + '\n');
  writeExportFile(path.join(workspaceRoot, 'server/data/math-import-review.json'), JSON.stringify(review) + '\n');
  activityStore(path.join(workspaceRoot, 'server/data')).write(assessments);
}
module.exports = { exportExamContent, mathImportReview };
if (require.main === module) exportExamContent();
