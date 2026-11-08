import type { ExamQuestion } from './examTypes';
import { probabilitySequence as sequence } from './probabilityPractice';

const category = 'Arithmetic & Number Sense', topic = 'Exponents, Roots & Scientific Notation';
export const exponentsDestination = {
  moduleId: 'exponents-roots-scientific-notation-2bdfed31', moduleTitle: topic,
  parentId: 'foundation-arithmetic-number-sense-exponents-roots-scientific-notation-1pbgwsc',
  groupType: 'foundation' as const, create: true,
};
function template(id: string, sourceId: string, requestId: string, title: string, description: string, distinctCount: number) {
  return { id, sourceId, requestId, title, description, distinctCount, category, topic,
    destination: exponentsDestination, moduleId: exponentsDestination.moduleId,
    skilled: 'TBD', enabled: false, publishAfterValidation: false, difficulty: 'standard' as const };
}
type Template = ReturnType<typeof template>;
const base = (t: Template, index: number, seed: string) => ({ id: `${t.id}:${seed}:${index}`, points: 1, topic: category, subtopic: topic, skilled: 'TBD' });
// Family-specific mixing prevents the common seed from lining up answer letters
// across the mixed module or exposing the domain's simple permutation stride.
function choiceRotation(t: Template, variant: number, seed: string) {
  let hash = 2166136261;
  for (const character of `${t.id}:${seed}:${variant}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
}
function choices(answer: string, traps: string[], variant: number) {
  const four = [...new Set([answer, ...traps])].slice(0, 4);
  if (four.length !== 4) throw new Error('Four distinct choices are required.');
  const rotation = variant % 4, ordered = four.slice(rotation).concat(four.slice(0, rotation));
  return { choices: ordered.map((math, at) => ({ id: 'ABCD'[at], math, text: math })), correctChoiceId: 'ABCD'[ordered.indexOf(answer)] };
}
const numericChoices = (answer: number, traps: number[], variant: number) => choices(String(answer), [...traps, answer + 1, answer - 1, answer + 2].map(String), variant);
// Integer-scaled decimal formatting keeps keys and displayed arithmetic exact.
function decimal(integer: number, places: number) {
  const sign = integer < 0 ? '-' : '', digits = String(Math.abs(integer)).padStart(places + 1, '0');
  return sign + (places ? `${digits.slice(0, -places)}.${digits.slice(-places)}`.replace(/\.?0+$/, '') : digits);
}

export const powersTemplate = template('exponents-sum-positive-powers-v1', '2019-2020-form-a-q63', 'a20d8fb6-cf3e-4b8d-9d08-db9b3c0cd074',
  'Adding positive integer powers', 'Evaluate each power before adding; distinguish bases from exponents.', 8 * 8 * 3 * 3);
export function generatePositivePowers(index: number, seed = 'positive-powers') {
  const variant = sequence(index, seed, powersTemplate.distinctCount);
  let at = variant;
  const a = at % 8 + 2; at = Math.floor(at / 8);
  const b = at % 8 + 2; at = Math.floor(at / 8);
  const m = at % 3 + 2, n = Math.floor(at / 3) + 2;
  const left = a ** m, right = b ** n, answer = left + right;
  const question: ExamQuestion = { ...base(powersTemplate, index, seed), type: 'multiple_choice',
    prompt: `Evaluate: \\[${a}^{${m}}+${b}^{${n}}\\]`,
    ...numericChoices(answer, [a * m + b * n, (a + b) ** m, left + b * n, a * m + right], choiceRotation(powersTemplate, variant, seed)),
    explanation: `An exponent tells how many equal factors to multiply. First evaluate each power: \\(${a}^{${m}}=${left}\\) and \\(${b}^{${n}}=${right}\\). Then add: \\(${left}+${right}=${answer}\\). Do not multiply each base by its exponent or add the bases before evaluating the powers.` };
  return { question, variant };
}

export const decimalSquareTemplate = template('exponents-decimal-squared-expression-v1', '2021-2022-form-a-q107', '34d09ac6-c688-44d8-961f-086b77122db2',
  'Squaring a decimal expression', 'Add inside parentheses, square the entire sum, multiply, then subtract.', 3 * 5 * 9 * 5);
export function generateDecimalSquare(index: number, seed = 'decimal-square') {
  const variant = sequence(index, seed, decimalSquareTemplate.distinctCount);
  let at = variant;
  const k = [100, 200, 500][at % 3]; at = Math.floor(at / 3);
  const a = at % 5 + 1; at = Math.floor(at / 5);
  const d = at % 9 + 1, c = [25, 50, 75, 100, 125][Math.floor(at / 9)];
  const sum = 10 * a + d, square = sum * sum, product = k / 100 * square, answer = product - c;
  const question: ExamQuestion = { ...base(decimalSquareTemplate, index, seed), type: 'multiple_choice',
    prompt: `Evaluate: \\[${k}(${a}+0.${d})^2-${c}\\]`,
    ...numericChoices(answer, [k * a * a + k / 100 * d * d - c, k / 10 * sum - c, product, k * a * a - c], choiceRotation(decimalSquareTemplate, variant, seed)),
    explanation: `Follow the order of operations. Inside the parentheses, \\(${a}+0.${d}=${decimal(sum, 1)}\\). Square the entire sum: \\(${decimal(sum, 1)}^2=${decimal(square, 2)}\\). Multiply by ${k} to get ${product}, then subtract ${c}: \\(${product}-${c}=${answer}\\). Squaring the two addends separately would leave out their cross product.` };
  return { question, variant };
}

export const exponentLawsTemplate = template('exponents-symbolic-product-quotient-v1', 'grade-9-2018-2019-q4', '0ad9cbd9-860e-4d89-b9af-08ec5345ec8e',
  'Exponent laws with zero and negative powers', 'Combine powers of the same nonzero base using product and quotient rules.', 19 * 8 * 13);
export function generateExponentLaws(index: number, seed = 'exponent-laws') {
  const variant = sequence(index, seed, exponentLawsTemplate.distinctCount);
  let at = variant;
  const a = at % 19 - 6; at = Math.floor(at / 19);
  const b = at % 8 - 3, c = Math.floor(at / 8) - 6, answer = a + b - c;
  const power = (n: number) => `p^{${n}}`;
  const question: ExamQuestion = { ...base(exponentLawsTemplate, index, seed), type: 'multiple_choice',
    prompt: `For \\(p\\ne0\\), simplify as a single power of \\(p\\): \\[\\frac{p^{${a}}\\cdot p^{${b}}}{p^{${c}}}\\]`,
    ...choices(power(answer), [a + b + c, a * b - c, a - b - c, answer + 1, answer - 1, answer + 2].map(power), choiceRotation(exponentLawsTemplate, variant, seed)),
    explanation: `For a nonzero base, multiply powers by adding their exponents, and divide powers by subtracting the denominator's exponent. Here the combined exponent is \\(${a}+(${b})-(${c})=${answer}\\), so the expression is \\(${power(answer)}\\). A zero exponent gives 1; subtracting a negative exponent increases the result.` };
  return { question, variant };
}

const rootPairs: [number, number][] = [];
for (let a = 1; a <= 25; a++) for (let b = a; b <= 25; b++) rootPairs.push([a, b]);
export const squareRootsTemplate = template('exponents-principal-square-root-product-v1', 'grade-9-2018-2019-q2', 'cd0f7980-bbd1-4ac4-96eb-b73728a0aa22',
  'Multiplying principal square roots', 'Find the nonnegative square root of each perfect square, then multiply.', rootPairs.length);
export function generateSquareRoots(index: number, seed = 'square-roots') {
  const variant = sequence(index, seed, rootPairs.length), [a, b] = rootPairs[variant], answer = a * b;
  const question: ExamQuestion = { ...base(squareRootsTemplate, index, seed), type: 'short_response', entryControl: 'text',
    instructions: 'Enter your answer as a number.', prompt: `Evaluate: \\[\\sqrt{${a * a}}\\cdot\\sqrt{${b * b}}\\]`, correctTextAnswers: [String(answer)],
    explanation: `The square-root symbol gives the principal (nonnegative) root. Since \\(${a}^2=${a * a}\\) and \\(${b}^2=${b * b}\\), the two roots are ${a} and ${b}. Multiply them: \\(\\sqrt{${a * a}}\\cdot\\sqrt{${b * b}}=${a}\\cdot${b}=${answer}\\).` };
  return { question, variant };
}

const divisors = [12, 15, 18, 24, 25, 32, 36, 45], quotients = [25, 40, 75, 120, 150, 240, 350, 750, 1020, 1250, 1500, 2400];
const numeratorExponents = [-8, -6, -3, 0, 2, 4, 7], denominatorExponents = [-5, -2, 0, 1, 4, 6];
export const scientificNotationTemplate = template('exponents-scientific-notation-quotient-v1', 'grade-9-2018-2019-q10', '0f605b59-95ae-4658-9315-edf1a2fa031b',
  'Dividing in scientific notation', 'Divide decimal coefficients, subtract exponents, and normalize the coefficient.', divisors.length * quotients.length * numeratorExponents.length * denominatorExponents.length);
export function generateScientificNotation(index: number, seed = 'scientific-notation') {
  const variant = sequence(index, seed, scientificNotationTemplate.distinctCount);
  let at = variant;
  const d = divisors[at % divisors.length]; at = Math.floor(at / divisors.length);
  const q = quotients[at % quotients.length]; at = Math.floor(at / quotients.length);
  const a = numeratorExponents[at % numeratorExponents.length], b = denominatorExponents[Math.floor(at / numeratorExponents.length)];
  const shift = q < 100 ? -1 : q >= 1000 ? 1 : 0, exponent = a - b + shift;
  const coefficient = decimal(q, 2 + shift), term = (e: number) => `${coefficient}\\times10^{${e}}`;
  const question: ExamQuestion = { ...base(scientificNotationTemplate, index, seed), type: 'multiple_choice',
    prompt: `Write the quotient in scientific notation: \\[\\frac{${decimal(d * q, 3)}\\times10^{${a}}}{${decimal(d, 1)}\\times10^{${b}}}\\]`,
    ...choices(term(exponent), [exponent - 1, exponent + 1, a + b + shift, -exponent, exponent + 2].map(term), choiceRotation(scientificNotationTemplate, variant, seed)),
    explanation: `Divide the coefficients: \\(${decimal(d * q, 3)}\\div${decimal(d, 1)}=${decimal(q, 2)}\\). Subtract the exponents: \\(${a}-(${b})=${a - b}\\). Thus the quotient is \\(${decimal(q, 2)}\\times10^{${a - b}}\\). ${shift === 0 ? 'The coefficient is already at least 1 and less than 10.' : `Rewrite the coefficient as \\(${coefficient}\\times10^{${shift}}\\), and add ${shift} to the exponent.`} The normalized answer is \\(${term(exponent)}\\).` };
  return { question, variant };
}

export const exponentsPractice = [
  { ...powersTemplate, generate: generatePositivePowers },
  { ...decimalSquareTemplate, generate: generateDecimalSquare },
  { ...exponentLawsTemplate, generate: generateExponentLaws },
  { ...squareRootsTemplate, generate: generateSquareRoots },
  { ...scientificNotationTemplate, generate: generateScientificNotation },
];
