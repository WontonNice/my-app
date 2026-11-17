import type { ExamQuestion } from '../examTypes';

// Building blocks for the adaptive math exam's infinite question families.
// A family draws its numbers from a seeded random stream, so the same
// (family, seed, index) always rebuilds the same question for resume and review.

export type Level = 1 | 2 | 3;
export type Rng = {
  /** Whole number from min to max, inclusive. */
  int: (min: number, max: number) => number;
  pick: <T>(values: readonly T[]) => T;
  bool: () => boolean;
  shuffle: <T>(values: readonly T[]) => T[];
};
/** One answer option. `value` lets numeric options sort and lets the builder fill missing distractors. */
export type Choice = { text: string; math?: string; value?: number; like?: (value: number) => Choice; near?: () => Choice[] };
export type Draft = { prompt: string; explanation: string; image?: ExamQuestion['image'] } & ({ answer: Choice; wrong: Choice[] } | { grid: number });
export type Family = { id: string; title: string; level: Level; generate: (index: number, seed: string) => ExamQuestion };

export function hash(text: string) { let value = 2166136261; for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0; return value; }
export function createRng(key: string): Rng {
  let state = hash(key) || 1;
  const next = () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  return {
    int, bool: () => next() < 0.5,
    pick: values => values[int(0, values.length - 1)],
    shuffle: values => { const copy = [...values]; for (let i = copy.length - 1; i > 0; i--) { const j = int(0, i); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; },
  };
}

export const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
export const lcm = (a: number, b: number) => a / gcd(a, b) * b;
/** Removes binary rounding noise from decimal arithmetic (for example 0.1 + 0.2). */
export const clean = (value: number) => Math.round(value * 1e6) / 1e6;
/** Plain text number with thousands separators; keeps up to six decimal places. */
export function fmt(value: number) {
  const rounded = clean(value), [whole, decimals] = Math.abs(rounded).toString().split('.');
  return (rounded < 0 ? '-' : '') + Number(whole).toLocaleString('en-US') + (decimals ? '.' + decimals : '');
}
/** The same number for use inside LaTeX math. */
export const tx = (value: number) => fmt(value).replace(/,/g, '{,}');
export const dollars = (value: number) => Number.isInteger(clean(value)) ? fmt(value) : clean(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** A signed term for building expressions such as "3x - 5". */
export const signed = (value: number) => value < 0 ? `-${tx(-value)}` : `+${tx(value)}`;
export const plural = (count: number, one: string, many = one + 's') => count === 1 ? one : many;
export const names = ['Maya', 'Jordan', 'Priya', 'Leo', 'Sofia', 'Marcus', 'Aiden', 'Chloe', 'Daniel', 'Amara', 'Kenji', 'Lucia', 'Omar', 'Grace', 'Mateo', 'Nina', 'Ravi', 'Elena', 'Tariq', 'Hana'] as const;

// Choice constructors.
export const num = (value: number): Choice => ({ text: fmt(value), math: tx(value), value: clean(value), like: num });
export const money = (value: number): Choice => ({ text: `$${dollars(value)}`, math: `\\$${dollars(value).replace(/,/g, '{,}')}`, value: clean(value), like: money });
export const pct = (value: number): Choice => ({ text: `${fmt(value)}%`, math: `${tx(value)}\\%`, value: clean(value), like: pct });
export const unit = (value: number, label: string): Choice => ({ text: `${fmt(value)} ${label}`, math: `${tx(value)}\\text{ ${label}}`, value: clean(value), like: next => unit(next, label) });
export const deg = (value: number): Choice => ({ text: `${fmt(value)}°`, math: `${tx(value)}^\\circ`, value: clean(value), like: deg });
/** A reduced fraction (or whole number when the denominator divides evenly). */
export function frac(numerator: number, denominator: number): Choice {
  if (denominator < 0) { numerator = -numerator; denominator = -denominator; }
  const g = gcd(numerator, denominator) || 1, n = numerator / g, d = denominator / g;
  const near = () => [frac(n + 1, d + 1), frac(n + 1, d), frac(n, d + 1), frac(n + 2, d + 1), frac(n + 1, d + 2), frac(n + 2, d + 3)].filter(choice => n <= 0 || choice.value! > 0);
  if (d === 1) return { text: String(n), math: String(n), value: n, near };
  return { text: `${n}/${d}`, math: `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`, value: n / d, near };
}
export const fracTex = (numerator: number, denominator: number) => frac(numerator, denominator).math!;
export const tex = (math: string, text = math): Choice => ({ text, math });
export const txt = (text: string): Choice => ({ text });
/** k·π with the coefficient written first, or a bare number when there is no π part. */
export const piTerm = (coefficient: number): Choice => ({ text: `${fmt(coefficient)}π`, math: `${tx(coefficient)}\\pi`, value: clean(coefficient), like: piTerm });
export const point = (x: number, y: number): Choice => ({ text: `(${x}, ${y})`, math: `(${x},\\ ${y})`, near: () => [point(y, x), point(-x, y), point(x, -y), point(x + 1, y), point(x, y + 1), point(x - 1, y - 1)] });
export const ratio = (a: number, b: number): Choice => { const g = gcd(a, b) || 1; return { text: `${a / g}:${b / g}`, math: `${a / g}:${b / g}`, near: () => [ratio(b, a), ratio(a + b, b), ratio(a, a + b), ratio(a + 1, b), ratio(a, b + 1), ratio(a + 2, b + 1)] }; };
/** A linear expression such as 3x - 5 in the given variable. */
export function linear(coefficient: number, constant: number, variable = 'x'): Choice {
  const lead = coefficient === 0 ? '' : coefficient === 1 ? variable : coefficient === -1 ? `-${variable}` : `${coefficient}${variable}`;
  const math = !lead ? String(constant) : constant === 0 ? lead : `${lead}${constant < 0 ? '-' : '+'}${Math.abs(constant)}`;
  return { text: math, math };
}

/** A simple table rendered with KaTeX, matching the tables used elsewhere in practice. */
export function table(headers: string[], rows: (string | number)[][]) {
  const cell = (value: string | number) => typeof value === 'number' ? tx(value) : `\\text{${value}}`;
  return `\\[\\begin{array}{|${headers.map(() => 'c').join('|')}|}\\hline ${headers.map(header => `\\textbf{${header}}`).join(' & ')}\\\\ \\hline ${rows.map(row => `${row.map(cell).join(' & ')}\\\\ \\hline`).join(' ')}\\end{array}\\]`;
}

function fillChoices(answer: Choice, wrong: Choice[], rng: Rng): Choice[] {
  const choices = [answer];
  for (const choice of wrong) if (choices.length < 4 && choice.text && !/NaN|Infinity|undefined/.test(choice.text) && !choices.some(item => item.text === choice.text)) choices.push(choice);
  // Missing distractors (a mistake that happened to equal the answer) are replaced with near values.
  if (choices.length < 4 && answer.like && answer.value !== undefined) {
    const value = answer.value, decimals = (String(value).split('.')[1] ?? '').length;
    const step = decimals ? 10 ** -decimals : Math.abs(value) >= 1000 && value % 100 === 0 ? 100 : Math.abs(value) >= 100 && value % 10 === 0 ? 10 : Math.abs(value) >= 40 && value % 5 === 0 ? 5 : 1;
    const offsets = rng.shuffle([1, -1, 2, -2, 3, -3, 4, 5, 6]);
    for (const offset of offsets) {
      const next = clean(value + offset * step);
      if (choices.length >= 4) break;
      if (value >= 0 && next < 0 || value > 0 && next === 0) continue;
      const choice = answer.like(next);
      if (!choices.some(item => item.text === choice.text)) choices.push(choice);
    }
  }
  if (choices.length < 4 && answer.near) for (const choice of answer.near()) if (choices.length < 4 && !choices.some(item => item.text === choice.text)) choices.push(choice);
  if (choices.length < 4) throw new Error('A question family produced fewer than four distinct choices.');
  return choices;
}

export function buildQuestion(id: string, draft: Draft, rng: Rng): ExamQuestion {
  const base = { id, points: 1, topic: '', subtopic: '', skilled: 'TBD', prompt: draft.prompt, explanation: draft.explanation, ...(draft.image ? { image: draft.image } : {}) };
  if (/NaN|Infinity|undefined/.test(draft.prompt + draft.explanation)) throw new Error('A question family produced an invalid number.');
  if ('grid' in draft) {
    if (!Number.isFinite(draft.grid)) throw new Error('A question family produced an invalid answer.');
    const value = clean(draft.grid), plain = String(value), accepted = new Set([plain, fmt(value)]);
    if (Number.isInteger(value)) accepted.add(`${plain}.0`);
    else if (Math.abs(value) < 1) accepted.add(plain.replace('0.', '.'));
    return { ...base, type: 'short_response', entryControl: 'text', instructions: Number.isInteger(value) ? 'Type your answer as a number.' : 'Type your answer as a decimal.', correctTextAnswers: [...accepted] };
  }
  const filled = fillChoices(draft.answer, draft.wrong, rng);
  const numeric = filled.every(choice => choice.value !== undefined);
  // Numeric options are listed in increasing order, as on the SHSAT; other options are shuffled.
  const ordered = numeric ? [...filled].sort((a, b) => a.value! - b.value!) : rng.shuffle(filled);
  return { ...base, type: 'multiple_choice', choices: ordered.map((choice, at) => ({ id: 'ABCD'[at], text: choice.text, ...(choice.math ? { math: choice.math } : {}) })), correctChoiceId: 'ABCD'[ordered.indexOf(filled[0])] };
}

export function family(id: string, title: string, level: Level, make: (rng: Rng) => Draft): Family {
  return { id: `adaptive-${id}-v1`, title, level, generate(index, seed) {
    if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
    const key = `adaptive-${id}-v1:${seed}:${index}`, rng = createRng(key);
    return buildQuestion(key, make(rng), rng);
  } };
}
