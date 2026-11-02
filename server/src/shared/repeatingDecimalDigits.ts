import type { ExamQuestion } from './examTypes';

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
function repeatingBlock(numerator: number, denominator: number) {
  let remainder = numerator, block = '';
  do {
    remainder *= 10; block += Math.floor(remainder / denominator); remainder %= denominator;
  } while (remainder !== numerator);
  return block;
}
// Reduced proper fractions with no preperiod. Keep short, primitive blocks with
// distinct digits so adjacent-position distractors diagnose an indexing error.
const fractions = [{ numerator: 10, denominator: 13, block: '769230' }];
for (const denominator of [7, 13, 27, 37, 101]) {
  for (let numerator = 1; numerator < denominator; numerator++) {
    if (gcd(numerator, denominator) !== 1 || numerator === 10 && denominator === 13) continue;
    const block = repeatingBlock(numerator, denominator);
    if ([3, 4, 6].includes(block.length) && new Set(block).size === block.length) fractions.push({ numerator, denominator, block });
  }
}
const positions = 900;
const count = fractions.length * positions;
// Interleave fractions and jump about 100 digit positions per question.
// Coprimality preserves every fraction/position pair once per complete cycle.
let stride = fractions.length * 100 + 101;
while (gcd(stride, count) !== 1) stride += 2;

export const repeatingDecimalDigitsTemplate = {
  id: 'repeating-decimal-digit-position-v1', sourceId: '2021-2022-form-a-q105',
  requestId: '1f92fd4c-997f-4d6d-8a2a-259869107999',
  title: 'Repeating Decimals: Digit Positions',
  category: 'Algebra', topic: 'Patterns & Sequences',
  moduleId: 'foundation-algebra-patterns-sequences-1f8v94i',
  existingModuleOnly: true, groupType: 'foundation', enabled: false,
  description: `Find a distant digit in a repeating decimal using its 3-, 4-, or 6-digit cycle. ${count.toLocaleString('en-US')} distinct fraction-and-position stems per seeded cycle; includes exact cycle endings and leading zeros.`,
  distinctCount: count, fractionCount: fractions.length, stride,
} as const;

function ordinal(value: number) {
  const lastTwo = value % 100;
  return lastTwo >= 11 && lastTwo <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th');
}

export function generateRepeatingDecimalDigit(index: number, seed = 'repeating-decimals', sequenceVersion: 1 | 2 = 2) {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  // Version 1 remains available for already displayed/saved questions.
  const variant = ((index % count) * (sequenceVersion === 1 ? 101 : stride) + hash % count) % count;
  const { numerator, denominator, block } = fractions[sequenceVersion === 1 ? Math.floor(variant / positions) : variant % fractions.length];
  // Offset includes the original 391st-digit example at index 0 / empty seed.
  const position = 100 + ((sequenceVersion === 1 ? variant % positions : Math.floor(variant / fractions.length)) + 291) % positions;
  const length = block.length, remainder = position % length;
  const slot = (position - 1) % length, answer = Number(block[slot]);
  const candidates = [answer, Number(block[(slot + length - 1) % length]), Number(block[(slot + 1) % length]), Number(block[(slot + length - 2) % length]), length, remainder, position % 10, ...block.split('').map(Number), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const values = [...new Set(candidates)].slice(0, 4).sort((a, b) => a - b);
  if (values.length !== 4) throw new Error('A digit question needs four distinct choices.');
  const rotation = variant % 4, ordered = values.slice(rotation).concat(values.slice(0, rotation));
  const math = `\\frac{${numerator}}{${denominator}}=0.\\overline{${block}}`;
  const stem = `In the infinitely repeating decimal above, \\(${block[0]}\\) is the first digit in the repeating pattern. What is the \\(${position}\\)${ordinal(position)} digit?`;
  const quotient = Math.floor(position / length);
  const question: ExamQuestion = {
    id: `${repeatingDecimalDigitsTemplate.id}:${seed}:${index}`, type: 'multiple_choice', points: 1,
    topic: repeatingDecimalDigitsTemplate.category, subtopic: repeatingDecimalDigitsTemplate.topic, skilled: 'TBD',
    prompt: `\\[${math}\\]\n\n${stem}`,
    promptHtml: `<p data-align="center">\\(\\displaystyle ${math}\\)</p><p>${stem}</p>`,
    choices: ordered.map((digit, at) => ({ id: 'ABCD'[at], text: String(digit), math: String(digit) })),
    correctChoiceId: 'ABCD'[ordered.indexOf(answer)],
    explanation: `The repeating block is ${block}, with ${length} digits. Count positions after the decimal point starting at 1${block[0] === '0' ? '; the initial zero counts as the first digit' : ''}.\n\nDivide the requested position by the block length:\n\\[${position}=${length}\\times ${quotient}+${remainder}.\\]\n${remainder === 0
      ? `A remainder of 0 means the position ends a complete block, so use its last (the ${length}${ordinal(length)}) digit, ${answer}. A zero remainder specifies the last position; do not restart at the first digit.`
      : `The remainder is ${remainder}, so use the ${remainder}${ordinal(remainder)} digit of ${block}, which is ${answer}. The remainder gives a position inside the block, not necessarily the digit itself.`}\n\nTherefore, the ${position}${ordinal(position)} digit is ${answer}.`,
  };
  return { question, variant };
}
