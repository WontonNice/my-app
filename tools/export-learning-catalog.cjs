// Export real browser content metadata for server-side reference validation.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const defaultRoot = path.resolve(__dirname, '..');
function exportLearningCatalog(root = defaultRoot) {
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
try {
  for (const filename of Object.keys(require.cache)) {
    if (filename.startsWith(path.join(root, 'client/src/content') + path.sep) || filename === path.join(root, 'client/src/lib/studentMaterials.ts')) delete require.cache[filename];
  }
  const { englishLibraryMaterials } = require(path.join(root, 'client/src/lib/studentMaterials.ts'));
  const { examPassageLibrary, examLibraryBooks } = require(path.join(root, 'client/src/content/exams/passageLibrary.ts'));
  const { advancedPracticePassages } = require(path.join(root, 'client/src/content/advancedPractice/index.ts'));
  const { practiceTopics } = require(path.join(root, 'client/src/content/practice/index.ts'));
  const sets = [...examPassageLibrary.map(set => ({ id: set.passage.id, set })), ...advancedPracticePassages.map(passage => ({ id: passage.id, set: passage.passageSet }))];
  const passages = englishLibraryMaterials.flatMap(material => {
    const id = material.href.split('/').at(-1);
    const entry = sets.find(item => item.id === id);
    if (!entry || !entry.set.questions.length) return [];
    return [{ id, kind: 'passage', title: material.title, href: material.href, subject: material.subject, category: material.readingFormat || material.category,
      passageCategory: material.passageCategory,
      versionLabel: entry.set.passage.versionLabel || id, skills: [...new Set(entry.set.questions.map(q => q.topic))], questionCount: entry.set.questions.length, aliases: [...new Set([id, entry.set.id, entry.set.passage.id, ...examLibraryBooks.filter(book => book.versions.length > 1 && book.versions.some(version => version.id === id)).map(book => book.id)])] }];
  });
  const practice = practiceTopics.filter(topic => topic.questionBank.length).map(topic => ({ id: topic.slug, kind: 'practice', title: topic.title, href: `/practice/${topic.slug}`, subject: 'English', category: 'Reading comprehension', skills: [...new Set([topic.title, topic.key])], questionCount: topic.questionBank.length, aliases: [topic.slug] }));
  const output = path.join(root, 'server/data/learning-catalog.json');
  const temporary = output + `.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify([...passages, ...practice]) + '\n');
  fs.renameSync(temporary, output);
  // Canonical read-only sources for linked canvas cards. No answer keys are
  // exported into this file; boards store only the stable passage reference.
  const sources = passages.flatMap(item => {
    const entry = sets.find(entry => item.aliases.includes(entry.id) || item.aliases.includes(entry.set.id));
    const { boardQuestion } = require(path.join(root, 'server/src/shared/boardContent.ts'));
    return entry ? [{ id: item.id, title: entry.set.passage.title, text: entry.set.passage.lines.map(line => line.text).join(entry.set.passage.format === 'poem' ? '\n' : '\n\n'), viewer: { passage: entry.set.passage, directions: entry.set.directions, questions: entry.set.questions.map(boardQuestion) } }] : [];
  });
  const sourceOutput = path.join(root, 'server/data/board-content.json');
  const sourceTemporary = sourceOutput + `.${process.pid}.tmp`;
  fs.writeFileSync(sourceTemporary, JSON.stringify(sources) + '\n');
  fs.renameSync(sourceTemporary, sourceOutput);
  const bookOutput = path.join(root, 'server/data/library-books.json');
  const bookTemporary = bookOutput + `.${process.pid}.tmp`;
  const bookJson = JSON.stringify(examLibraryBooks) + '\n';
  if (!fs.existsSync(bookOutput) || fs.readFileSync(bookOutput, 'utf8') !== bookJson) {
    fs.writeFileSync(bookTemporary, bookJson);
    fs.renameSync(bookTemporary, bookOutput);
  }
} finally { if (previous) require.extensions['.ts'] = previous; else delete require.extensions['.ts']; }
}
module.exports = { exportLearningCatalog };
if (require.main === module) exportLearningCatalog();
