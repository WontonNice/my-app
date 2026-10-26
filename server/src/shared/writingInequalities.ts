import type { ExamQuestion } from './examTypes';

const names = ['Jordan', 'Casey', 'Avery', 'Morgan', 'Riley', 'Alex'];
const rentals = [
  { item: 'a food truck', reference: 'the truck', fee: 'cleaning fee' },
  { item: 'a kayak', reference: 'the kayak', fee: 'equipment fee' },
  { item: 'a bicycle', reference: 'the bicycle', fee: 'equipment fee' },
  { item: 'an art studio', reference: 'the studio', fee: 'booking fee' },
  { item: 'sound equipment', reference: 'the equipment', fee: 'delivery fee' },
  { item: 'a moving van', reference: 'the van', fee: 'cleaning fee' },
];

export const writingInequalitiesTemplate = {
  id: 'writing-inequalities-v1', sourceId: '2026-2027-form-d-math-item-26',
  title: 'Writing Inequalities',
  description: 'Based on 2026–2027 Form D, math item 26. Write a budget inequality using an hourly rental rate and a one-time fee.',
  distinctCount: names.length * rentals.length * 18 * 12 * 12,
};

/** All costs are whole dollars; each seeded cycle visits every stem before repeating. */
export function generateWritingInequality(index: number, seed = 'writing-inequalities') {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const count = writingInequalitiesTemplate.distinctCount;
  // The bank's prime factors are 2 and 3, so 269 permutes a complete cycle.
  const variant = ((index % count) * 269 + hash % count) % count;
  let code = variant;
  const name = names[code % names.length]; code = Math.floor(code / names.length);
  const rental = rentals[code % rentals.length]; code = Math.floor(code / rentals.length);
  const rate = 3 + code % 18; code = Math.floor(code / 18);
  const fee = 5 * (1 + code % 12); code = Math.floor(code / 12);
  const hours = 1 + code % 12;
  const budget = fee + rate * hours;
  // Accept either term order, either side orientation, and common input notation.
  const correctTextAnswers = [`${rate}x`, `${rate}\\cdot x`, `${rate}\\times x`, `${rate}*x`].flatMap(term =>
    [`${fee}+${term}`, `${term}+${fee}`].flatMap(cost => [
      `${cost}\\le ${budget}`, `${budget}\\ge ${cost}`,
      `${cost}<=${budget}`, `${budget}>=${cost}`,
      `${cost}≤${budget}`, `${budget}≥${cost}`,
    ]),
  );
  const question: ExamQuestion = {
    id: `${writingInequalitiesTemplate.id}:${seed}:${index}`, type: 'expression_entry', points: 1,
    topic: 'Algebra', subtopic: 'Inequalities', entryLayout: 'plain', entryVariable: 'x',
    instructions: 'Enter your answer in the space provided. Enter only your answer.',
    prompt: `${name} has a budget of $${budget} to rent ${rental.item}. The rental company charges $${rate} per hour to rent ${rental.reference}, plus a one-time ${rental.fee} of $${fee}.\n\nWrite an inequality that represents this situation, in which x is the number of hours ${name} can rent ${rental.reference}.`,
    correctTextAnswers,
    explanation: `Let \\(x\\) represent the number of rental hours. At $${rate} per hour, the hourly rental cost is \\(${rate}x\\). Add the one-time ${rental.fee} of $${fee} to get the total cost, \\(${fee}+${rate}x\\).\n\nThe total cost cannot exceed the $${budget} budget, so use the less-than-or-equal-to sign. Equality is allowed because spending the entire budget is permitted.\n\\[${fee}+${rate}x\\le ${budget}\\]\n\nEquivalently, \\(${budget}\\ge ${fee}+${rate}x\\).`,
  };
  return { question, rate, fee, budget, hours, variant };
}
