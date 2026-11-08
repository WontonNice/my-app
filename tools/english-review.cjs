const { createHash } = require('node:crypto');
const bank = require('./part-b-bank.cjs');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const text = bank.text;

function buildRows(inventory, legacyDrafts, documentDrafts, records = {}) {
  const rows = [];
  function add(question, details, context = '', sourceContext = context) {
    const hash = digest([question, sourceContext, details.versions || []]);
    const blocked = !text(question.promptHtml || question.prompt) ? 'Missing prompt' : question.type === 'multiple_choice' && !(question.choices || []).some(c => c.id === question.correctChoiceId) ? 'Missing answer key' : '';
    rows.push({ question, prompt: text(question.promptHtml || question.prompt), topic: question.topic || 'Unclassified', context, hash, blocked,
      ...details, status: details.draft ? 'draft' : records[details.key]?.hash === hash && records[details.key]?.finished ? 'finished' : 'needs-review', duplicates: [] });
  }
  const tests = inventory.tests;
  for (const passage of inventory.passages.filter(p => p.section === 'revising_editing_a')) {
    const context = text(passage.richText || passage.text);
    for (const [index, question] of passage.questions.entries()) add(question, {
      key: `passage:${passage.id}:${question.id}`, section: 'part-a', title: `${passage.title} · Q${index + 1}`, location: { kind: 'passage', id: passage.id, questionId: question.id },
      exams: tests.filter(t => t.passageIds.includes(passage.id)).map(t => ({ id: t.assessmentId, title: t.title })),
    }, context, [passage.text, passage.richText, passage.images, passage.image, passage.directions]);
  }
  for (const q of inventory.standaloneItems.filter(q => !q.duplicateOf)) add(q, {
    key: `standalone:${q.id}`, section: 'standalone', title: bank.labels(q).join(' · ') || 'Standalone question', location: { kind: 'standalone', id: q.id },
    versions: bank.versions(q, inventory.standaloneItems), exams: bank.usage(q, inventory.standaloneItems, tests),
  });
  for (const entry of legacyDrafts) add(entry.question, {
    key: `import:${entry.id}`, section: 'standalone', title: bank.labels(entry.question).join(' · ') || 'Imported standalone', draft: true,
    location: { kind: 'legacy-draft', id: entry.id }, exams: [],
  });
  for (const entry of documentDrafts.entries.filter(e => e.status !== 'published' && (e.destination || 'exam') === 'exam')) {
    if (entry.kind !== 'standalone' && !(entry.kind === 'passage' && entry.content.section === 'revising_editing_a')) continue;
    for (const q of (entry.content.questions || []).filter(q => !entry.publishedQuestionIds?.includes(q.id))) add(q, {
      key: `document:${entry.id}:${q.id}`, section: entry.kind === 'standalone' ? 'standalone' : 'part-a', title: entry.content.title || 'Imported standalone', draft: true,
      location: { kind: 'document-draft', id: entry.id, questionId: q.id }, exams: [],
    }, text(entry.content.richText || entry.content.text));
  }
  // Candidates only: layout differences are recognized, never automatically merged.
  const groups = new Map();
  for (const row of rows) {
    const q = row.question;
    if (q.type !== 'multiple_choice' || !bank.answerKey(q) || !(q.choices || []).length) continue;
    const clean = s => text(s).replace(/^Read (?:this|the) (?:paragraph|sentence)\.?\s*/i, '').trim();
    const p = clean(q.prompt), s = clean(q.stimulus);
    for (const wording of new Set([clean(p + ' ' + s), clean(s + ' ' + p)])) {
      const key = digest([row.section, row.context, wording, q.choices.map(c => text(c.text || c.html)), bank.answerKey(q)]);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }
  }
  for (const group of groups.values()) if (group.length > 1) for (const row of group) row.duplicates.push(...group.filter(other => other.key !== row.key).map(other => other.key));
  for (const row of rows) row.duplicates = [...new Set(row.duplicates)];
  return rows;
}

function applyReview(rows, records, input) {
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 2000 || typeof input.finished !== 'boolean') throw new Error('Select saved questions and a review action.');
  const seen = new Set(), selected = [];
  for (const item of input.items) {
    const row = rows.find(r => r.key === item.key);
    if (!row || row.draft || seen.has(item.key)) throw new Error('Selection contains a draft, duplicate, or missing question. Refresh the dashboard.');
    if (row.hash !== item.hash) throw new Error('A selected question changed. Refresh and review it again.');
    if (input.finished && row.blocked) throw new Error(`${row.title}: ${row.blocked}. Open the question before marking it finished.`);
    seen.add(item.key); selected.push(row);
  }
  const next = { ...records };
  for (const row of selected) next[row.key] = { hash: row.hash, finished: input.finished };
  return next;
}
module.exports = { digest, buildRows, applyReview };
