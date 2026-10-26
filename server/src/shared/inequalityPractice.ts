import type { ExamQuestion } from './examTypes';

export const inequalityTemplate = {
  id: 'one-step-inequalities-v1', sourceId: '2022-2023-form-a-q71',
  title: 'One-step inequalities', distinctCount: 1056,
};

/** Finite, calculator-free vocabulary; unlimited practice cycles, not unlimited unique questions. */
export function generateInequality(index: number, seed = 'q71'): { question: ExamQuestion; coefficient: number; boundary: number; constant: number; relation: '<' | '>'; solution: '<' | '>'; variant: number } {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  // 269 is coprime to 1056, so every stem occurs exactly once per cycle.
  const variant = ((index % 1056) * 269 + hash % 1056) % 1056;
  let code = variant;
  const magnitude = 2 + code % 11; code = Math.floor(code / 11);
  const coefficient = code % 2 ? -magnitude : magnitude; code = Math.floor(code / 2);
  const boundary = code % 24 < 12 ? code % 24 - 12 : code % 24 - 11; code = Math.floor(code / 24);
  const relation = code % 2 ? '>' : '<';
  const constant = coefficient * boundary;
  const solution = ((relation === '>') === (coefficient > 0)) ? '<' : '>';
  const opposite = solution === '<' ? '>' : '<';
  const wrong = Math.sign(boundary) * (magnitude === Math.abs(boundary) ? magnitude + 1 : magnitude);
  const choices = [`x${solution}${boundary}`, `x${opposite}${boundary}`, `x${solution}${wrong}`, `x${opposite}${wrong}`];
  const rotation = (variant + Math.floor(index / 1056) + hash % 4) % 4;
  const shuffled = choices.slice(rotation).concat(choices.slice(0, rotation));
  const correctChoiceId = 'ABCD'[shuffled.indexOf(choices[0])];
  const question: ExamQuestion = {
    id: `${inequalityTemplate.id}:${seed}:${index}`, type: 'multiple_choice', points: 1,
    topic: 'Algebra', subtopic: 'Inequalities',
    prompt: `\\[${constant}${relation}${coefficient}x\\]\n\nFor what values of \\(x\\) is the above inequality true?`,
    choices: shuffled.map((math, at) => ({ id: 'ABCD'[at], math, text: math })), correctChoiceId,
    explanation: `Divide both sides by ${coefficient}. ${coefficient < 0 ? 'Dividing by a negative number reverses the inequality sign.' : 'Dividing by a positive number keeps the inequality sign.'}\n\n${constant} ÷ ${coefficient} = ${boundary}.\n\nTherefore, \\(x${solution}${boundary}\\). The endpoint ${boundary} is excluded because the inequality is strict.`,
  };
  return { question, coefficient, boundary, constant, relation, solution, variant };
}

export const variablesBothSidesTemplate = {
  id: 'variables-both-sides-inequalities-v1', sourceId: '2022-2023-form-b-q70',
  title: 'Inequalities: Variables on Both Sides',
  description: 'Based on 2022–2023 Form B Q70. Collect variable terms and constants, then solve, reversing the sign when dividing by a negative number.',
  distinctCount: 133200,
};

/** Exhausts a calculator-free bank before repeating stems in unlimited practice cycles. */
export function generateVariablesBothSidesInequality(index: number, seed = 'q70') {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const count = variablesBothSidesTemplate.distinctCount;
  // 269 is coprime to 133200, so each stem appears once per cycle.
  const variant = ((index % count) * 269 + hash % count) % count;
  let code = variant;
  const leftCoefficient = 1 + code % 9; code = Math.floor(code / 9);
  const rightSlot = 1 + code % 8; code = Math.floor(code / 8);
  const rightCoefficient = rightSlot >= leftCoefficient ? rightSlot + 1 : rightSlot;
  const boundary = code % 25 - 12; code = Math.floor(code / 25);
  const leftConstant = code % 37 - 18; code = Math.floor(code / 37);
  const relation: '<' | '>' = code % 2 ? '>' : '<';
  const coefficient = leftCoefficient - rightCoefficient;
  const constant = coefficient * boundary;
  const rightConstant = leftConstant + constant;
  const solution = coefficient > 0 ? relation : relation === '<' ? '>' : '<';
  const opposite = solution === '<' ? '>' : '<';
  // Adding the constants instead of subtracting reproduces Q70's 20 distractor.
  const sum = leftConstant + rightConstant;
  const wrongBoundary = sum === boundary ? boundary + 1 : sum;
  const options = [`x${solution}${boundary}`, `x${opposite}${boundary}`, `x${solution}${wrongBoundary}`, `x${opposite}${wrongBoundary}`];
  const rotation = (variant + Math.floor(index / count) + hash % 4) % 4;
  const choices = options.slice(rotation).concat(options.slice(0, rotation));
  const term = (value: number) => value === 1 ? 'x' : value === -1 ? '-x' : `${value}x`;
  const expression = (a: number, b: number) => `${term(a)}${b > 0 ? `+${b}` : b < 0 ? b : ''}`;
  const constantStep = leftConstant > 0 ? `Subtract ${leftConstant}` : leftConstant < 0 ? `Add ${-leftConstant}` : null;
  const question: ExamQuestion = {
    id: `${variablesBothSidesTemplate.id}:${seed}:${index}`, type: 'multiple_choice', points: 1,
    topic: 'Algebra', subtopic: 'Inequalities',
    prompt: `\\[${expression(leftCoefficient, leftConstant)}${relation}${expression(rightCoefficient, rightConstant)}\\]\n\nFor what values of \\(x\\) is the above inequality true?`,
    choices: choices.map((math, at) => ({ id: 'ABCD'[at], math, text: math })),
    correctChoiceId: 'ABCD'[choices.indexOf(options[0])],
    explanation: `Subtract \\(${term(rightCoefficient)}\\) from both sides to collect the variable terms.\n\\[${expression(coefficient, leftConstant)}${relation}${rightConstant}\\]\n\n${constantStep ? `${constantStep} on both sides to isolate the variable term.\n` : ''}\\[${term(coefficient)}${relation}${constant}\\]\n\nDivide both sides by ${coefficient}. ${coefficient < 0 ? 'Dividing by a negative number reverses the inequality sign.' : 'Dividing by a positive number keeps the inequality sign.'}\n\\[x${solution}${boundary}\\]\n\nThe endpoint ${boundary} is excluded because the inequality is strict.`,
  };
  return { question, leftCoefficient, rightCoefficient, leftConstant, rightConstant, coefficient, constant, boundary, relation, solution, variant };
}
