// Export real browser content metadata for server-side reference validation.
const fs = require('node:fs');
const path = require('node:path');
const { compileContentModule } = require('./content-transpile-cache.cjs');
const { createHash } = require('node:crypto');
const { writeExportFile } = require('./write-export-file.cjs');
const defaultRoot = path.resolve(__dirname, '..');
function exportLearningCatalog(root = defaultRoot, { catalogOnly = false } = {}) {
const previous = require.extensions['.ts'];
require.extensions['.ts'] = compileContentModule;
try {
  for (const filename of Object.keys(require.cache)) {
    if (filename.startsWith(path.join(root, 'client/src/content') + path.sep) || filename === path.join(root, 'client/src/lib/studentMaterials.ts')) delete require.cache[filename];
  }
  const { getEnglishLibraryMaterial } = require(path.join(root, 'client/src/lib/studentMaterials.ts'));
  const { examPassageLibrary, examLibraryBooks } = require(path.join(root, 'client/src/content/exams/passageLibrary.ts'));
  const { advancedPracticePassages } = require(path.join(root, 'client/src/content/advancedPractice/index.ts'));
  const { practiceTopics } = require(path.join(root, 'client/src/content/practice/index.ts'));
  const { libraryQuestionKey, libraryPassageKey } = require(path.join(root, 'server/src/shared/libraryBooks.ts'));
  const hash = value => createHash('sha256').update(value).digest('hex');
  const normalize = value => value.normalize('NFKC').replace(/&nbsp;|&#160;/gi, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
  const sets = [...examPassageLibrary.map(set => ({ id: set.passage.id, set })), ...advancedPracticePassages.map(passage => ({ id: passage.id, set: passage.passageSet }))];
  // Retain original assignment IDs and board references even though the library shelf combines versions.
  const passages = sets.flatMap(entry => {
    const id = entry.id;
    const material = getEnglishLibraryMaterial(id);
    if (!material || !entry.set.questions.length) return [];
    return [{ id, kind: 'passage', title: material.title, href: material.href.startsWith("/advanced-practice/") ? material.href : `/study-hall/shsat/library/${id}`, subject: material.subject, category: material.readingFormat || material.category,
      passageSection: entry.set.section ?? "reading",
      passageCategory: entry.set.passage.passageCategory ?? material.passageCategory,
      passageTextKey: entry.set.passage.lines.some(line => line.text || line.html || line.image) ? hash(libraryPassageKey(entry.set.passage)) : undefined,
      questionSetKey: hash(JSON.stringify(entry.set.questions.map(libraryQuestionKey).sort())),
      relationshipCandidateKey: hash(normalize(entry.set.passage.title + '|' + (entry.set.passage.lines.find(line => line.kind === 'byline')?.text ?? '')).toLowerCase()),
      versionLabel: entry.set.passage.versionLabel || id, skills: [...new Set(entry.set.questions.map(q => q.topic))], questionCount: entry.set.questions.length, aliases: [...new Set([id, entry.set.id, entry.set.passage.id, ...examLibraryBooks.filter(book => book.versions.length > 1 && book.versions.some(version => version.id === id)).map(book => book.id)])] }];
  });
  const practice = practiceTopics.filter(topic => topic.questionBank.length).map(topic => ({ id: topic.slug, kind: 'practice', title: topic.title, href: `/practice/${topic.slug}`, subject: 'English', category: 'Reading comprehension', skills: [...new Set([topic.title, topic.key])], questionCount: topic.questionBank.length, aliases: [topic.slug] }));
  const output = path.join(root, 'server/data/learning-catalog.json');
  writeExportFile(output, JSON.stringify([...passages, ...practice]) + '\n');
  if (catalogOnly) return;
  // Canonical read-only sources for linked canvas cards. No answer keys are
  // exported into this file; boards store only the stable passage reference.
  const sources = passages.flatMap(item => {
    const entry = sets.find(entry => item.aliases.includes(entry.id) || item.aliases.includes(entry.set.id));
    const { boardQuestion } = require(path.join(root, 'server/src/shared/boardContent.ts'));
    return entry ? [{ id: item.id, title: entry.set.passage.title, text: entry.set.passage.lines.map(line => line.text).join(entry.set.passage.format === 'poem' ? '\n' : '\n\n'), viewer: { passage: entry.set.passage, directions: entry.set.directions, questions: entry.set.questions.map(boardQuestion) } }] : [];
  });
  const sourceOutput = path.join(root, 'server/data/board-content.json');
  writeExportFile(sourceOutput, JSON.stringify(sources) + '\n');
  const bookOutput = path.join(root, 'server/data/library-books.json');
  const bookJson = JSON.stringify(examLibraryBooks) + '\n';
  writeExportFile(bookOutput, bookJson);
  // Exact source routes grade and snapshot their own question set, not the merged shelf book.
  writeExportFile(path.join(root, 'server/data/library-versions.json'), JSON.stringify(sets.map(({id,set}) => ({ id, passageSet: set, versions: [{ id, label: set.passage.versionLabel || set.passage.title, questionIds: set.questions.map(question => question.id), questionKeys: set.questions.map(libraryQuestionKey), coverageVerified: true }], questionPassages: {} }))) + '\n');
} finally { if (previous) require.extensions['.ts'] = previous; else delete require.extensions['.ts']; }
}
module.exports = { exportLearningCatalog };
if (require.main === module) exportLearningCatalog(defaultRoot, { catalogOnly: process.argv.includes("--catalog-only") });
