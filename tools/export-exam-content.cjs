// Export the same authored content used by the student app for server-side grading.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function exportExamContent(workspaceRoot = root) {
  const previous = require.extensions['.ts'];
  require.extensions['.ts'] = (module, filename) => {
    module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
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
    const output = path.join(workspaceRoot, 'server/data/exam-content.json');
    const temporary = output + `.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(content) + '\n');
    fs.renameSync(temporary, output);
  } finally {
    if (previous) require.extensions['.ts'] = previous;
    else delete require.extensions['.ts'];
  }
}
module.exports = { exportExamContent };
if (require.main === module) exportExamContent();
