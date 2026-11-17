import { family, fmt, frac, fracTex, linear, money, names, num, point, signed, table, tex, tx, type Draft, type Family, type Rng } from './kit';

const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
/** "3x", "x", "-x" style term. */
const term = (coefficient: number, variable = 'x') => coefficient === 1 ? variable : coefficient === -1 ? `-${variable}` : `${coefficient}${variable}`;
const nonzero = (value: number, fallback: number) => value === 0 ? fallback : value;

// ---- Algebraic Expressions ----
export const algebraicExpressions: Family[] = [
  family('expression-evaluate', 'Evaluating an expression', 1, rng => {
    const a = rng.int(2, 5), b = rng.int(2, 6), c = rng.int(2, 5), d = rng.int(2, 4), answer = c * a * a + d * a * b;
    return { prompt: `If \\(x=${a}\\) and \\(y=-${b}\\), what is the value of \\(${c}x^2-${d}xy\\)?`, answer: num(answer), wrong: [num(c * a * a - d * a * b), num((c * a) ** 2 + d * a * b), num(c * 2 * a + d * a * b), num((c * a) ** 2 - d * a * b)],
      explanation: `Substitute carefully, keeping the negative value in parentheses:\n\\[${c}(${a})^2-${d}(${a})(-${b})=${c}(${a * a})-(-${d * a * b})=${c * a * a}+${d * a * b}=${answer}.\\]\nOnly \\(x\\) is squared, not \\(${c}x\\), and subtracting a negative product adds.` };
  }),
  family('expression-simplify', 'Distributing and combining like terms', 2, rng => {
    const a = rng.int(2, 5), c = rng.int(1, 9), d = rng.int(2, 4), e = rng.int(1, 5), f = rng.int(1, 9); let b = rng.int(2, 6); if (a * b === d * e) b++;
    const coefficient = a * b - d * e, constant = -a * c - d * f;
    return { prompt: `Which expression is equivalent to the expression below?\n\\[${a}(${b}x-${c})-${d}(${term(e)}+${f})\\]`, answer: linear(coefficient, constant), wrong: [linear(coefficient, -a * c + d * f), linear(a * b + d * e, constant), linear(coefficient, -a * c - f), linear(a * b - e, -c - f)],
      explanation: `Distribute each multiplier, including the negative sign on the second group:\n\\[${a * b}x-${a * c}-${d * e}x-${d * f}.\\]\nCombine like terms: \\(${a * b}x-${d * e}x=${term(coefficient)}\\) and \\(-${a * c}-${d * f}=${constant}\\).\n\\[${linear(coefficient, constant).math}\\]` };
  }),
  family('expression-translate', 'Translating words into an expression', 2, rng => {
    const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(1, 9), form = rng.int(0, 3);
    const forms: { phrase: string; answer: string; wrong: string[]; why: string }[] = [
      { phrase: `${c} less than the product of ${a} and a number \\(n\\)`, answer: `${a}n-${c}`, wrong: [`${c}-${a}n`, `${a}(n-${c})`, `${a}n+${c}`], why: `"The product of ${a} and \\(n\\)" is \\(${a}n\\). "${c} less than" that amount means subtract ${c} from it: \\(${a}n-${c}\\). The order matters: \\(${c}-${a}n\\) would be "${a}n less than ${c}."` },
      { phrase: `${a} times the sum of a number \\(n\\) and ${b}, decreased by ${c}`, answer: `${a}(n+${b})-${c}`, wrong: [`${a}n+${b}-${c}`, `${a}(n+${b}-${c})`, `${c}-${a}(n+${b})`], why: `"The sum of \\(n\\) and ${b}" must be grouped: \\((n+${b})\\). Multiply the whole sum by ${a}, then subtract ${c}: \\(${a}(n+${b})-${c}\\).` },
      { phrase: `the quotient of a number \\(n\\) and ${a}, increased by ${b}`, answer: `\\frac{n}{${a}}+${b}`, wrong: [`\\frac{n}{${a}+${b}}`, `\\frac{${a}}{n}+${b}`, `\\frac{n+${b}}{${a}}`], why: `"The quotient of \\(n\\) and ${a}" is \\(\\frac{n}{${a}}\\) (the first quantity named is divided by the second). "Increased by ${b}" adds ${b} to that quotient: \\(\\frac{n}{${a}}+${b}\\).` },
      { phrase: `${a} times the difference of a number \\(n\\) and ${b}`, answer: `${a}(n-${b})`, wrong: [`${a}n-${b}`, `${a}(${b}-n)`, `n-${a * b}`], why: `"The difference of \\(n\\) and ${b}" is \\(n-${b}\\), in that order. The whole difference is multiplied by ${a}, so it needs parentheses: \\(${a}(n-${b})\\).` },
    ];
    const chosen = forms[form];
    return { prompt: `Which expression represents "${chosen.phrase}"?`, answer: tex(chosen.answer), wrong: chosen.wrong.map(value => tex(value)), explanation: chosen.why };
  }),
  family('expression-ages', 'Writing an expression from a situation', 2, rng => {
    const b = rng.int(2, 4), a = rng.int(2, 9), older = rng.bool(), [n1, n2] = rng.shuffle([...names]).slice(0, 2), sign = older ? '+' : '-', other = older ? '-' : '+';
    return { prompt: `${n1} is \\(t\\) years old. ${n2} is ${a} years ${older ? 'older' : 'younger'} than ${b} times ${n1}'s age. Which expression represents the sum of their ages, in years?`, answer: tex(`${b + 1}t${sign}${a}`), wrong: [tex(`${b}t${sign}${a}`), tex(`${b + 1}t${other}${a}`), tex(`${b + 1}t${sign}${a * b}`), tex(`${b}t${other}${a}`)],
      explanation: `${n2}'s age is \\(${b}t${sign}${a}\\). Add ${n1}'s age, \\(t\\):\n\\[t+(${b}t${sign}${a})=${b + 1}t${sign}${a}.\\]\nThe question asks for the sum of both ages, not just ${n2}'s age.` };
  }),
  family('expression-in-terms', 'Rewriting one expression in terms of another', 3, rng => {
    const a = rng.int(2, 5), b = rng.int(1, 9), k = rng.int(2, 4); let extra = rng.int(1, 9) * (rng.bool() ? 1 : -1); if (k * b + extra === 0) extra = -extra;
    const m = k * b + extra;
    return { prompt: `If \\(${a}x+${b}=y\\), which expression is equal to \\(${k * a}x${signed(m)}\\)?`, answer: linear(k, extra, 'y'), wrong: [linear(k, m, 'y'), linear(k, m - b, 'y'), linear(k, -extra, 'y'), linear(k, m + k * b, 'y')],
      explanation: `Multiply the given equation by ${k}: \\(${k * a}x+${k * b}=${k}y\\), so \\(${k * a}x=${k}y-${k * b}\\).\nThen \\(${k * a}x${signed(m)}=${k}y-${k * b}${signed(m)}=${linear(k, extra, 'y').math}\\).` };
  }),
  family('expression-sum-difference', 'Using a sum and a difference', 3, rng => {
    const y = rng.int(1, 8), x = y + rng.int(1, 8), s = x + y, d = x - y;
    return { prompt: `If \\(x+y=${s}\\) and \\(x-y=${d}\\), what is the value of \\(x^2-y^2\\)?`, answer: num(s * d), wrong: [num(s * s - d * d), num(s + d), num(s * d / 2), num(s * s + d * d)],
      explanation: `Add the two equations: \\(2x=${s + d}\\), so \\(x=${x}\\). Then \\(y=${s}-${x}=${y}\\).\n\\[x^2-y^2=${x * x}-${y * y}=${s * d}.\\]\n(Shortcut: \\(x^2-y^2=(x+y)(x-y)=${s}\\times${d}=${s * d}\\).)` };
  }),
];

// ---- Equations & Systems ----
export const equationsSystems: Family[] = [
  family('equation-two-step', 'Two-step equations', 1, rng => {
    const a = rng.int(2, 9), x = nonzero(rng.int(-6, 12), 7), b = rng.int(1, 15) * (rng.bool() ? 1 : -1), c = a * x + b;
    return { prompt: `What value of \\(x\\) makes the equation \\(${a}x${signed(b)}=${c}\\) true?`, answer: num(x), wrong: [num(Math.round((c + b) / a)), num(c - b), num(x + (b > 0 ? 1 : -1) * 2), num(-x)],
      explanation: `Undo the ${b > 0 ? 'addition' : 'subtraction'} first, then the multiplication.\n\\[${a}x=${c}${signed(-b)}=${c - b}\\quad\\Rightarrow\\quad x=${c - b}\\div${a}=${x}.\\]\nCheck: \\(${a}(${x})${signed(b)}=${c}\\).` };
  }),
  family('equation-distribute', 'Equations with variables on both sides', 2, rng => {
    const a = rng.int(3, 7), c = rng.int(1, a - 1), x = rng.int(2, 12), b = rng.int(1, 6), d = a * (x - b) - c * x;
    return { prompt: `What value of \\(x\\) makes the equation below true?\n\\[${a}(x-${b})=${term(c)}${d === 0 ? '' : signed(d)}\\]`, grid: x,
      explanation: `Distribute: \\(${a}x-${a * b}=${term(c)}${d === 0 ? '' : signed(d)}\\).\nCollect the \\(x\\) terms on one side and the numbers on the other: \\(${a}x-${term(c)}=${d}+${a * b}\\), so \\(${term(a - c)}=${d + a * b}\\).\n\\[x=${x}.\\]\nCheck: \\(${a}(${x}-${b})=${a * (x - b)}\\) and \\(${c}(${x})${d === 0 ? '' : signed(d)}=${a * (x - b)}\\).` };
  }),
  family('equation-ages', 'Age problems', 2, rng => {
    const m = rng.pick([2, 3]), younger = rng.int(3, 15), k = rng.int(2, 8), gap = (m - 1) * (younger + k), [n1, n2] = rng.shuffle([...names]).slice(0, 2);
    return { prompt: `${n1} is ${gap} years older than ${n2}. In ${k} years, ${n1} will be ${m === 2 ? 'twice' : 'three times'} as old as ${n2}. How old is ${n2} now?`, answer: num(younger), wrong: [num(younger + k), num(younger + gap), num(gap), num(Math.abs(gap - k) || gap + k)],
      explanation: `Let ${n2}'s age now be \\(b\\). Then ${n1} is \\(b+${gap}\\). In ${k} years their ages are \\(b+${k}\\) and \\(b+${gap + k}\\).\n\\[b+${gap + k}=${m}(b+${k})=${m}b+${m * k}\\quad\\Rightarrow\\quad ${gap + k - m * k}=${term(m - 1, 'b')}\\quad\\Rightarrow\\quad b=${younger}.\\]\nCheck: in ${k} years they are ${younger + k} and ${younger + gap + k}, and \\(${m}\\times${younger + k}=${younger + gap + k}\\).` };
  }),
  family('equation-fraction', 'Equations with a fraction', 2, rng => {
    const a = rng.int(2, 9), b = rng.int(1, 12), q = rng.int(2, 12);
    if (rng.bool()) { const c = b + q, x = a * q;
      return { prompt: `What value of \\(x\\) makes the equation \\(\\dfrac{x}{${a}}+${b}=${c}\\) true?`, answer: num(x), wrong: [num(q), num(a * c - b), num(a * (c + b)), num(a * c)],
        explanation: `Subtract ${b} from both sides first: \\(\\frac{x}{${a}}=${q}\\).\nThen multiply both sides by ${a}: \\(x=${a}\\times${q}=${x}\\).` }; }
    const bottom = rng.int(2, 6), quotient = rng.int(3, 12), shift = rng.int(1, Math.min(9, bottom * quotient - 1)), x = bottom * quotient - shift;
    return { prompt: `What value of \\(x\\) makes the equation \\(\\dfrac{x+${shift}}{${bottom}}=${quotient}\\) true?`, answer: num(x), wrong: [num(bottom * quotient + shift), num(bottom * quotient), num(bottom * (quotient - shift)), num(x + bottom)],
      explanation: `Multiply both sides by ${bottom} first: \\(x+${shift}=${bottom * quotient}\\).\nThen subtract ${shift}: \\(x=${bottom * quotient}-${shift}=${x}\\).` };
  }),
  family('equation-two-prices', 'Two unknown amounts', 3, rng => {
    const coins = rng.bool(), low = coins ? 5 : rng.pick([4, 5, 6, 7]), high = coins ? 10 : rng.pick([8, 9, 10, 12, 15]), c1 = rng.int(5, 30); let c2 = rng.int(5, 30); if (c2 === c1) c2++;
    const n = c1 + c2, total = low * c1 + high * c2;
    const prompt = coins ? `A jar contains ${n} coins. All of the coins are nickels and dimes, and their total value is $${(total / 100).toFixed(2)}. How many dimes are in the jar?`
      : `A theater sold ${n} tickets for a show. Adult tickets cost $${high} each and child tickets cost $${low} each. The theater collected $${fmt(total)} in all. How many adult tickets were sold?`;
    const unitText = coins ? 'cents' : 'dollars';
    return { prompt, answer: num(c2), wrong: [num(c1), num(Math.round(total / (low + high))), num(Math.round(n / 2) === c2 ? c2 + 3 : Math.round(n / 2)), num(c2 + (high - low))],
      explanation: `Let \\(d\\) be the number of ${coins ? 'dimes' : 'adult tickets'}. Then there are \\(${n}-d\\) ${coins ? 'nickels' : 'child tickets'}. Working in ${unitText}:\n\\[${high}d+${low}(${n}-d)=${tx(total)}\\quad\\Rightarrow\\quad ${high - low}d+${low * n}=${tx(total)}\\quad\\Rightarrow\\quad d=\\frac{${total - low * n}}{${high - low}}=${c2}.\\]\nCheck: \\(${c2}\\times${high}+${c1}\\times${low}=${tx(total)}\\).` };
  }),
  family('equation-transfer', 'Solve, then evaluate a second expression', 3, rng => {
    const a = rng.int(2, 6), x = nonzero(rng.int(-5, 9), 4), b = rng.int(1, 12), e = rng.int(1, 9), plus = rng.bool(), c = a * x + b; let d = rng.int(2, 7); if (d === a) d++;
    const answer = plus ? d * x + e : d * x - e;
    return { prompt: `If \\(${a}x+${b}=${c}\\), what is the value of \\(${d}x${plus ? '+' : '-'}${e}\\)?`, answer: num(answer), wrong: [num(x), num(plus ? d * c + e : d * c - e), num(plus ? d * x - e : d * x + e), num(d * x)],
      explanation: `Solve for \\(x\\) first: \\(${a}x=${c - b}\\), so \\(x=${x}\\).\nThe question asks for a different expression, so substitute: \\(${d}(${x})${plus ? '+' : '-'}${e}=${answer}\\).` };
  }),
  family('equation-number-puzzle', 'Number puzzles', 2, rng => {
    const k = rng.int(1, 4), m = k + rng.int(1, 3), n = rng.int(3, 15), a = rng.int(1, (m - k) * n - 1), b = (m - k) * n - a;
    return { prompt: `${a} more than ${k === 1 ? 'a number' : `${k} times a number`} is equal to ${b} less than ${m} times the number. What is the number?`, answer: num(n), wrong: [num(a + b), num(Math.abs(b - a) || n + 2), num(n + (m - k)), num(n * 2)],
      explanation: `Let the number be \\(n\\).\n\\[${term(k, 'n')}+${a}=${m}n-${b}\\quad\\Rightarrow\\quad ${a}+${b}=${m}n-${term(k, 'n')}\\quad\\Rightarrow\\quad ${a + b}=${term(m - k, 'n')}\\quad\\Rightarrow\\quad n=${n}.\\]` };
  }),
  family('equation-system', 'Systems of two equations', 3, rng => {
    const a2 = rng.int(1, 3), a1 = a2 + rng.int(1, 3), b = rng.int(1, 5), x = rng.int(1, 9); let y = rng.int(1, 9); if (y === x) y++;
    const top = a1 * x + b * y, bottom = a2 * x + b * y;
    return { prompt: `If \\(${term(a1)}+${term(b, 'y')}=${top}\\) and \\(${term(a2)}+${term(b, 'y')}=${bottom}\\), what is the value of \\(x\\)?`, answer: num(x), wrong: [num(y), num(top - bottom), num(Math.round((top + bottom) / (a1 + a2))), num(x + 1)],
      explanation: `Both equations contain \\(${term(b, 'y')}\\), so subtract the second equation from the first to eliminate \\(y\\):\n\\[(${term(a1)}-${term(a2)})=${top}-${bottom}\\quad\\Rightarrow\\quad ${term(a1 - a2)}=${top - bottom}\\quad\\Rightarrow\\quad x=${x}.\\]\n(Then \\(y=${y}\\).)` };
  }),
];

// ---- Inequalities (in addition to the existing inequality practice generators) ----
export const inequalities: Family[] = [
  family('inequality-greatest-integer', 'Greatest integer solution', 2, rng => {
    const a = rng.int(2, 7), q = rng.int(-4, 12), exact = rng.bool(), r = exact ? 0 : rng.int(1, a - 1), b = rng.int(1, 12) * (rng.bool() ? 1 : -1), c = b + a * q + r, answer = exact ? q - 1 : q;
    return { prompt: `What is the greatest integer value of \\(x\\) that satisfies the inequality \\(${a}x${signed(b)}<${c}\\)?`, answer: num(answer), wrong: exact ? [num(q), num(q + 1), num(q - 2)] : [num(q + 1), num(q - 1), num(q + 2)],
      explanation: `Solve like an equation: \\(${a}x<${c}${signed(-b)}=${c - b}\\), so \\(x<${exact ? q : fracTex(c - b, a)}\\)${exact ? '' : ` (about ${((c - b) / a).toFixed(2)})`}.\n${exact ? `The inequality is strict, so \\(x\\) cannot equal ${q}. The greatest integer less than ${q} is ${answer}.` : `The greatest integer less than that value is ${answer}.`}` };
  }),
  family('inequality-compound-count', 'Counting integer solutions', 3, rng => {
    const m = rng.pick([2, 3]), low = rng.int(-6, 5), count = rng.int(3, 9), high = low + count, b = rng.int(1, 9) * (rng.bool() ? 1 : -1), left = m * low + b, right = m * high + b;
    return { prompt: `How many integers \\(x\\) satisfy the inequality \\(${left}<${m}x${signed(b)}\\le${right}\\)?`, answer: num(count), wrong: [num(count + 1), num(count - 1), num(right - left), num(right - left + 1)],
      explanation: `Do the same step to all three parts. ${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: \\(${m * low}<${m}x\\le${m * high}\\). Divide by ${m}: \\(${low}<x\\le${high}\\).\nThe integers are ${low + 1} through ${high} (${low} is not included, ${high} is): \\(${high}-(${low})=${count}\\) integers.` };
  }),
];

// ---- Functions & Graphs ----
export const functionsGraphs: Family[] = [
  family('function-table-rule', 'Extending a linear table', 1, rng => {
    const m = rng.int(2, 7), b = nonzero(rng.int(-6, 9), 3), x0 = rng.int(1, 4), k = rng.int(9, 20), xs = [x0, x0 + 1, x0 + 2, x0 + 3], last = m * xs[3] + b;
    return { prompt: `${table(['x', 'y'], xs.map(x => [x, m * x + b]))}\n\nThe table shows a linear relationship between \\(x\\) and \\(y\\). What is the value of \\(y\\) when \\(x=${k}\\)?`, answer: num(m * k + b), wrong: [num(m * k), num(last + m), num(m * k - b), num(last + k)],
      explanation: `Each time \\(x\\) goes up by 1, \\(y\\) goes up by ${m}, so the rule has the form \\(y=${m}x+b\\).\nUse the first row: \\(${m}(${x0})+b=${m * x0 + b}\\), so \\(b=${b}\\). The rule is \\(y=${linear(m, b).math}\\).\n\\[y=${m}(${k})${signed(b)}=${m * k + b}.\\]` };
  }),
  family('function-slope', 'Slope between two points', 2, rng => {
    const x1 = rng.int(-6, 4), y1 = rng.int(-6, 6), dx = rng.int(1, 8); let dy = rng.int(1, 9) * (rng.bool() ? 1 : -1); if (Math.abs(dy) === dx) dy += dy > 0 ? 1 : -1;
    const x2 = x1 + dx, y2 = y1 + dy, raw = `\\frac{${dy}}{${dx}}`, reduced = fracTex(dy, dx);
    return { prompt: `What is the slope of the line that passes through the points \\((${x1},\\ ${y1})\\) and \\((${x2},\\ ${y2})\\)?`, answer: frac(dy, dx), wrong: [frac(dx, dy), frac(-dy, dx), frac(-dx, dy), frac(y1 + y2 || 1, x1 + x2 || 1)],
      explanation: `Slope is the change in \\(y\\) divided by the change in \\(x\\), taken in the same order:\n\\[\\frac{${y2}-(${y1})}{${x2}-(${x1})}=${raw}${reduced === raw ? '' : `=${reduced}`}.\\]\nThe line ${dy > 0 ? 'rises' : 'falls'} from left to right, so the slope is ${dy > 0 ? 'positive' : 'negative'}.` };
  }),
  family('function-intercept', 'Finding the y-intercept', 2, rng => {
    const m = nonzero(rng.int(-4, 5), 2), p = rng.int(1, 6), b = rng.int(-9, 9), q = m * p + b;
    return { prompt: `A line has a slope of \\(${m}\\) and passes through the point \\((${p},\\ ${q})\\). What is the \\(y\\)-intercept of the line?`, answer: num(b), wrong: [num(q + m * p), num(q - m), num(q), num(p - m * q)],
      explanation: `Use \\(y=mx+b\\) with \\(m=${m}\\), \\(x=${p}\\), and \\(y=${q}\\):\n\\[${q}=${m}(${p})+b=${m * p}+b\\quad\\Rightarrow\\quad b=${q}-(${m * p})=${b}.\\]` };
  }),
  family('function-missing-value', 'Missing value in a linear table', 2, rng => {
    const xs = rng.pick([[1, 3, 7, 9], [2, 4, 8, 10], [0, 2, 6, 8], [1, 2, 5, 6], [3, 5, 9, 11]]), m = rng.int(2, 6) * (rng.bool() ? 1 : -1), b = rng.int(-5, 12), y = (x: number) => m * x + b;
    return { prompt: `${table(['x', 'y'], [[xs[0], y(xs[0])], [xs[1], y(xs[1])], [xs[2], 'n'], [xs[3], y(xs[3])]])}\n\nThe table shows a linear relationship between \\(x\\) and \\(y\\). What is the value of \\(n\\)?`, answer: num(y(xs[2])), wrong: [num((y(xs[1]) + y(xs[3])) / 2), num(y(xs[1]) + m), num(2 * y(xs[1]) - y(xs[0])), num(y(xs[3]) - (y(xs[1]) - y(xs[0])))],
      explanation: `Find the rate of change from two complete rows: \\(\\frac{${y(xs[1])}-(${y(xs[0])})}{${xs[1]}-${xs[0]}}=${m}\\). So \\(y\\) changes by ${m} for each increase of 1 in \\(x\\).\nFrom \\(x=${xs[1]}\\) to \\(x=${xs[2]}\\) is an increase of ${xs[2] - xs[1]}: \\(n=${y(xs[1])}+(${m})(${xs[2] - xs[1]})=${y(xs[2])}\\).\nThe \\(x\\)-values are not evenly spaced, so the \\(y\\)-values are not either.` };
  }),
  family('function-point-on-line', 'Another point on a line', 3, rng => {
    const m = rng.pick([-3, -2, 2, 3, 4]), x1 = rng.int(-3, 2), y1 = rng.int(-5, 5), x2 = x1 + rng.int(1, 3), x3 = x2 + rng.int(2, 5), y = (x: number) => y1 + m * (x - x1);
    return { prompt: `A line passes through the points \\((${x1},\\ ${y1})\\) and \\((${x2},\\ ${y(x2)})\\). Which of the following points also lies on this line?`, answer: point(x3, y(x3)), wrong: [point(x3, y(x3) + m), point(x3, y(x3) - 1), point(x3 + 1, y(x3))],
      explanation: `Slope: \\(\\frac{${y(x2)}-(${y1})}{${x2}-(${x1})}=${m}\\). Each step of 1 to the right changes \\(y\\) by ${m}.\nFrom \\((${x2},\\ ${y(x2)})\\), moving ${x3 - x2} to the right changes \\(y\\) by \\(${m}\\times${x3 - x2}=${m * (x3 - x2)}\\), giving \\((${x3},\\ ${y(x3)})\\).` };
  }),
  family('function-flat-fee', 'Flat fee plus a rate', 3, rng => {
    const rate = rng.pick([15, 20, 25, 30, 35, 40, 45]), fee = rng.pick([20, 25, 30, 40, 50, 60, 75]), h1 = rng.int(1, 3), h2 = h1 + rng.int(2, 4), a = fee + rate * h1, b = fee + rate * h2;
    const worker = rng.pick(['A plumber', 'An electrician', 'A bike repair shop', 'A tutor']);
    return { prompt: `${worker} charges a flat fee plus a constant hourly rate. A ${h1}-hour job costs $${a}, and a ${h2}-hour job costs $${b}. What is the flat fee?`, answer: money(fee), wrong: [money(rate), money(b - a), money(a - rate), money(fee + rate)].filter(choice => choice.value! > 0),
      explanation: `The extra \\(${h2}-${h1}=${h2 - h1}\\) hours cost \\(\\$${b}-\\$${a}=\\$${b - a}\\), so the hourly rate is \\(${b - a}\\div${h2 - h1}=\\$${rate}\\).\nFor the ${h1}-hour job, the hourly part is \\(${h1}\\times${rate}=\\$${rate * h1}\\), so the flat fee is \\(\\$${a}-\\$${rate * h1}=\\$${fee}\\).` };
  }),
];

// ---- Patterns & Sequences ----
const colorNames = ['red', 'blue', 'green', 'yellow', 'white', 'purple', 'orange', 'black'];
function arithmeticTerm(rng: Rng, far: boolean): Draft {
  const a = rng.int(2, 15), d = rng.int(2, 9), n = far ? rng.int(20, 60) : rng.int(7, 10), answer = a + (n - 1) * d;
  return { prompt: `In the sequence below, each term is ${d} more than the term before it.\n\\[${a},\\ ${a + d},\\ ${a + 2 * d},\\ ${a + 3 * d},\\ \\ldots\\]\nWhat is the ${ordinal(n)} term of the sequence?`, answer: num(answer), wrong: [num(a + n * d), num(n * d), num(a + (n + 1) * d), num(a + (n - 2) * d)],
    explanation: `To reach the ${ordinal(n)} term from the 1st term, add ${d} a total of \\(${n}-1=${n - 1}\\) times:\n\\[${a}+${n - 1}\\times${d}=${a}+${(n - 1) * d}=${answer}.\\]\nAdding ${d} a full ${n} times goes one term too far.` };
}
export const patternsSequences: Family[] = [
  family('sequence-arithmetic-near', 'Arithmetic sequences: a nearby term', 1, rng => arithmeticTerm(rng, false)),
  family('sequence-arithmetic-far', 'Arithmetic sequences: a distant term', 2, rng => arithmeticTerm(rng, true)),
  family('sequence-repeating', 'Repeating patterns', 2, rng => {
    const length = rng.int(4, 6), colors = rng.shuffle(colorNames).slice(0, length), n = rng.int(31, 160), r = n % length, at = (r + length - 1) % length;
    return { prompt: `A string of beads repeats the color pattern ${colors.join(', ')} over and over, starting with ${colors[0]}. What color is the ${ordinal(n)} bead?`, answer: { text: colors[at] }, wrong: [{ text: colors[(at + 1) % length] }, { text: colors[(at + length - 1) % length] }, { text: colors[(at + 2) % length] }],
      explanation: `The pattern has ${length} beads, so divide: \\(${n}\\div${length}=${Math.floor(n / length)}\\) remainder ${r}.\n${r === 0 ? `A remainder of 0 means the ${ordinal(n)} bead finishes a full pattern, so it matches the last color, ${colors[at]}.` : `After ${Math.floor(n / length)} full patterns, the ${ordinal(n)} bead is the ${ordinal(r)} bead of the next pattern, which is ${colors[at]}.`}` };
  }),
  family('sequence-recursive', 'Sequences defined by a rule', 2, rng => {
    const m = rng.pick([2, 3]), s = rng.int(1, 5), a = rng.int(Math.max(2, s + 1), 7), terms = [a]; for (let i = 0; i < 4; i++) terms.push(m * terms[i] - s);
    return { prompt: `The first term of a sequence is ${a}. Each term after the first is found by multiplying the previous term by ${m} and then subtracting ${s}. What is the 4th term of the sequence?`, answer: num(terms[3]), wrong: [num(terms[2]), num(terms[4]), num(a * m ** 3 - s), num(m * terms[2] + s)],
      explanation: `Apply the rule one term at a time.\n2nd term: \\(${m}\\times${a}-${s}=${terms[1]}\\)\n3rd term: \\(${m}\\times${terms[1]}-${s}=${terms[2]}\\)\n4th term: \\(${m}\\times${terms[2]}-${s}=${terms[3]}\\)` };
  }),
  family('sequence-geometric', 'Multiplying patterns', 2, rng => {
    const a = rng.int(2, 9), r = rng.pick([2, 3]), n = rng.int(4, 6), answer = a * r ** (n - 1);
    return { prompt: `The first term of a sequence is ${a}, and each term after the first is ${r} times the term before it. What is the ${ordinal(n)} term?`, answer: num(answer), wrong: [num(a * r ** n), num(a * r * (n - 1)), num(a * r * n), num(a + r * (n - 1))],
      explanation: `Multiply by ${r} each time: ${Array.from({ length: n }, (_, i) => a * r ** i).join(', ')}.\nThe ${ordinal(n)} term is ${answer}. (Only \\(${n}-1=${n - 1}\\) multiplications are needed.)` };
  }),
  family('sequence-figure-number', 'Which figure in a growing pattern', 3, rng => {
    const first = rng.int(3, 6), d = rng.int(2, 5), n = rng.int(12, 40), total = first + (n - 1) * d, item = rng.pick(['toothpicks', 'tiles', 'dots', 'blocks']);
    return { prompt: `Figure 1 in a pattern is made with ${first} ${item}. Each figure after the first uses ${d} more ${item} than the figure before it. Which figure number uses exactly ${total} ${item}?`, grid: n,
      explanation: `Figure \\(n\\) uses \\(${first}+${d}(n-1)\\) ${item}.\n\\[${first}+${d}(n-1)=${total}\\quad\\Rightarrow\\quad ${d}(n-1)=${total - first}\\quad\\Rightarrow\\quad n-1=${n - 1}\\quad\\Rightarrow\\quad n=${n}.\\]\nRemember that Figure 1 has no added groups, so add 1 after dividing.` };
  }),
  family('sequence-sum-range', 'Sum of consecutive integers', 3, rng => {
    const a = rng.int(1, 20), count = rng.pick([10, 12, 16, 20, 24, 30]), b = a + count - 1, sum = count * (a + b) / 2;
    return { prompt: `What is the sum of all the integers from ${a} to ${b}, inclusive?`, answer: num(sum), wrong: [num(count * (a + b)), num(sum - (a + b)), num(sum + a + b), num(sum - b)],
      explanation: `There are \\(${b}-${a}+1=${count}\\) integers. Pair the first with the last, the second with the next-to-last, and so on. Each pair adds to \\(${a}+${b}=${a + b}\\), and there are \\(${count}\\div2=${count / 2}\\) pairs:\n\\[${count / 2}\\times${a + b}=${tx(sum)}.\\]` };
  }),
];
