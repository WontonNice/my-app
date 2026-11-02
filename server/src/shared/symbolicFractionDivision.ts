import type { ExamQuestion } from './examTypes';

export const symbolicFractionDivisionTemplate = {
  id: 'symbolic-fraction-division-v1',
  sourceId: '2021-2022-form-a-q96',
  title: 'Dividing Symbolic Fractions',
  description: 'Divide two fractions expressed in four nonzero variables by multiplying by the reciprocal. 48 symbolic stems per seeded cycle; variable placements and quotient direction vary.',
  category: 'Algebra', topic: 'Algebraic Expressions',
  moduleId: 'general-algebra-algebraic-expressions-rj42ee',
  existingModuleOnly: true, groupType: 'general', enabled: false,
  distinctCount: 48,
} as const;

const symbols = ['w', 'x', 'y', 'z'];
const fraction = (top: string, bottom: string) => `\\frac{${top}}{${bottom}}`;
// Canonical factor order prevents differently ordered products looking like new answers.
const product = (a: string, b: string) => [a, b].sort().join('');

/** 4! assignments to the four fraction slots × 2 quotient directions.
 * These are symbolic relabelings of one reasoning task, not 48 different skills.
 * Every variable is nonzero, so either quotient and every offered expression exist.
 */
export function generateSymbolicFractionDivision(index: number, seed = 'symbolic-fractions') {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  // gcd(13, 48) = 1. Reduce index before multiplication, even at MAX_SAFE_INTEGER.
  const variant = ((index % 48) * 13 + hash % 48) % 48;
  let rank = Math.floor(variant / 2);
  const remaining = [...symbols];
  const slots = [6, 2, 1, 1].map(block => {
    const at = Math.floor(rank / block);
    rank %= block;
    return remaining.splice(at, 1)[0];
  });
  const [w, x, y, z] = slots;
  const reverse = variant % 2 === 1;
  const [a, b, c, d] = reverse ? [y, z, w, x] : slots;
  const quotient = fraction(reverse ? 'N' : 'M', reverse ? 'M' : 'N');
  const correct = fraction(product(a, d), product(b, c));
  const options = [
    fraction(product(a, b), product(c, d)), // group the two symbols of each given fraction
    fraction(product(a, c), product(b, d)), // multiply without taking the reciprocal
    correct,
    fraction(product(b, c), product(a, d)), // invert the dividend instead of the divisor
  ];
  const rotation = variant % 4;
  const ordered = options.slice(rotation).concat(options.slice(0, rotation));
  const question: ExamQuestion = {
    id: `${symbolicFractionDivisionTemplate.id}:${seed}:${index}`,
    type: 'multiple_choice', points: 1, topic: 'Algebra', subtopic: 'Algebraic Expressions', skilled: 'TBD',
    prompt: `Suppose \\(M=${fraction(w, x)}\\), \\(N=${fraction(y, z)}\\), and \\(w\\), \\(x\\), \\(y\\), and \\(z\\) do not equal 0. What is \\(${quotient}\\) in terms of \\(w\\), \\(x\\), \\(y\\), and \\(z\\)?`,
    choices: ordered.map((math, at) => ({ id: 'ABCD'[at], math, text: math })),
    correctChoiceId: 'ABCD'[ordered.indexOf(correct)],
    explanation: `Dividing by a nonzero fraction means multiplying by its reciprocal. Keep the first fraction and invert the second:\n\\[${quotient}=${fraction(a, b)}\\div ${fraction(c, d)}=${fraction(a, b)}\\times ${fraction(d, c)}=${correct}.\\]\nAll four variables are nonzero, so the given fractions, the divisor, and the final denominator are nonzero. Multiply the numerators together and the denominators together; multiplying the original fractions without inverting the divisor gives the wrong expression.`,
  };
  return { question, variant };
}
