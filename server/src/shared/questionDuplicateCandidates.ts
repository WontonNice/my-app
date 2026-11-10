import type { ExamQuestion, ExamPassage } from './examTypes';

export type QuestionDuplicateCandidate = { left: string; right: string; kind: 'exact' | 'likely'; score: number; reason: string };
const ignored = new Set(['id', 'number', 'topic', 'subtopic', 'skilled', 'source', 'explanation', 'explanationHtml', 'incorrectChoiceExplanations', 'review', 'points']);
const text = (value: string) => value.normalize('NFKC').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([, value]) => value !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, stable(value)]));
  return typeof value === 'string' ? value.normalize('NFC').replace(/\s+/g, ' ').trim() : value;
}
function fingerprint(question: ExamQuestion) {
  // Keep every response field, diagram, and answer key. Unknown TEI fields are significant.
  const content = Object.fromEntries(Object.entries(question).filter(([key]) => !ignored.has(key)));
  if (question.type === 'multiple_choice' || question.type === 'multi_select') {
    const choices = question.choices ?? [];
    const choiceKey = (id: string) => {
      const choice = choices.find(item => item.id === id);
      return choice ? JSON.stringify(stable(Object.fromEntries(Object.entries(choice).filter(([key]) => key !== 'id')))) : id;
    };
    content.choices = choices.map(choice => choiceKey(choice.id)).sort();
    if (question.correctChoiceId) content.correctChoiceId = choiceKey(question.correctChoiceId);
    if (question.correctChoiceIds) content.correctChoiceIds = question.correctChoiceIds.map(choiceKey).sort();
  }
  return JSON.stringify(stable(content));
}
function visible(question: ExamQuestion) {
  return text([question.instructionsHtml || question.instructions, question.stimulusHtml || question.stimulus, question.promptHtml || question.prompt,
    ...(question.choices ?? []).map(choice => choice.html || choice.math || choice.text),
    ...(question.items ?? []).map(item => item.html || item.text), ...(question.categories ?? []).map(item => item.title),
    ...(question.dropdownContent ?? []), ...(question.dragDropContent ?? []),
    ...(question.dropdowns ?? []).flatMap(item => item.options.map(option => option.text)),
  ].filter(Boolean).join(' '));
}
function similarity(left: string, right: string) {
  if (left === right) return left ? 1 : 0;
  const grams = (value: string) => { const words = value.split(/\s+/); return new Set(words.slice(1).map((word, index) => `${words[index]} ${word}`)); };
  const a = grams(left), b = grams(right);
  return a.size + b.size ? 2 * [...a].filter(word => b.has(word)).length / (a.size + b.size) : 0;
}

/** Compare questions within a shared passage/context; suggestions never merge records. */
export function questionDuplicateCandidates(questions: ExamQuestion[], passages: Record<string, ExamPassage> = {}): QuestionDuplicateCandidate[] {
  const rows = questions.map(question => ({ question, key: fingerprint(question), text: visible(question) }));
  const matches: QuestionDuplicateCandidate[] = [];
  rows.forEach((left, index) => {
    for (const right of rows.slice(index + 1)) {
      if (left.question.id === right.question.id) continue;
      const sameContext = JSON.stringify(stable(passages[left.question.id]?.lines)) === JSON.stringify(stable(passages[right.question.id]?.lines));
      const exact = left.key === right.key && sameContext;
      const score = similarity(left.text, right.text);
      if (!exact && (Math.min(left.text.length, right.text.length) < 40 || score < .84)) continue;
      matches.push({ left: left.question.id, right: right.question.id, kind: exact ? 'exact' : 'likely', score: Math.round(score * 100),
        reason: exact ? 'Question content, response structure, and answer key match.' : !sameContext ? 'Similar questions use different passage versions. Check the source passages as well as the answers.' : left.question.type !== right.question.type ? 'Similar wording with different response types. Compare both interactions.' : 'Similar wording. Check answer keys, diagrams, and response details.' });
    }
  });
  return matches.sort((a, b) => Number(b.kind === 'exact') - Number(a.kind === 'exact') || b.score - a.score);
}

export function groupDuplicateCandidates(pairs: QuestionDuplicateCandidate[]) {
  const groups: {questionIds: string[]; pairs: QuestionDuplicateCandidate[]}[] = [];
  for (const pair of pairs) {
    const matching = groups.filter(group => group.questionIds.includes(pair.left) || group.questionIds.includes(pair.right));
    const group = {questionIds: [...new Set([pair.left, pair.right, ...matching.flatMap(group => group.questionIds)])], pairs: [...matching.flatMap(group => group.pairs), pair]};
    for (const match of matching) groups.splice(groups.indexOf(match), 1);
    groups.push(group);
  }
  return groups;
}
