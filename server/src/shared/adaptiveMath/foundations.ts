import { clean, deg, family, fmt, frac, fracTex, lcm, linear, names, num, pct, plural, ratio, signed, table, tex, tx, type Choice, type Family } from './kit';

// Extra foundation (level 1) and challenge (level 3) question types. They give every topic more than
// one way to ask an easy question, so a student who keeps missing a topic still sees variety.

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const extraNumberProperties: Family[] = [
  family('number-identify-prime', 'Recognizing a prime number', 1, rng => {
    const prime = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const composites = rng.shuffle([9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99].filter(value => Math.abs(value - prime) <= 40)).slice(0, 3);
    const factorsOf = (value: number) => { for (let d = 3; d < value; d += 2) if (value % d === 0) return `${d}\\times${value / d}`; return ''; };
    return { prompt: 'Which of the following numbers is a prime number?', answer: num(prime), wrong: composites.map(num),
      explanation: `A prime number has exactly two factors, 1 and itself. Test each choice for small factors:\n${composites.map(value => `\\(${value}=${factorsOf(value)}\\)`).join(', ')}.\n${prime} is not divisible by 2, 3, 5, or 7, so it is prime.` };
  }),
  family('number-lcm', 'Least common multiple', 1, rng => {
    const [a, b] = rng.pick([[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 12], [9, 12], [10, 15], [6, 15], [8, 10], [3, 4], [4, 5], [3, 5], [5, 6], [2, 7], [3, 8], [4, 9], [12, 18], [10, 12], [6, 14]]), answer = lcm(a, b);
    return { prompt: `What is the least common multiple of ${a} and ${b}?`, answer: num(answer), wrong: [num(a * b), num(a + b), num(answer * 2), num(Math.max(a, b))],
      explanation: `List multiples of the larger number, ${Math.max(a, b)}, until one is also a multiple of ${Math.min(a, b)}:\n${Array.from({ length: answer / Math.max(a, b) }, (_, i) => (i + 1) * Math.max(a, b)).join(', ')}.\nThe least common multiple is ${answer}.` };
  }),
];

export const extraIntegers: Family[] = [
  family('integer-signed-expression', 'Evaluating with negative values', 3, rng => {
    const a = -rng.int(2, 5), b = rng.int(2, 4), c = -rng.int(2, 6), answer = a * b * b - c * (a - b);
    return { prompt: `If \\(a=${a}\\), \\(b=${b}\\), and \\(c=${c}\\), what is the value of \\(ab^2-c(a-b)\\)?`, answer: num(answer), wrong: [num(a * b * b + c * (a - b)), num((a * b) ** 2 - c * (a - b)), num(a * b * b - c * (a + b)), num(-a * b * b - c * (a - b))],
      explanation: `Substitute with parentheses and follow the order of operations.\n\\(ab^2=(${a})(${b})^2=(${a})(${b * b})=${a * b * b}\\) (only \\(b\\) is squared).\n\\(a-b=${a}-${b}=${a - b}\\), so \\(c(a-b)=(${c})(${a - b})=${c * (a - b)}\\).\n\\[${a * b * b}-${c * (a - b)}=${answer}.\\]` };
  }),
];

export const extraFractions: Family[] = [
  family('fraction-mixed-operations', 'Fractions with two operations', 3, rng => {
    const [a, b] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6]]), [c, d] = rng.pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]]), [e, f] = rng.pick([[1, 2], [2, 3], [1, 3], [3, 4], [1, 4], [4, 5]]);
    const answer = frac(a * d * f + c * e * b, b * d * f), product = frac(c * e, d * f);
    return { prompt: `What is the value of the expression below?\n\\[\\frac{${a}}{${b}}+\\frac{${c}}{${d}}\\times\\frac{${e}}{${f}}\\]`, answer, wrong: [frac((a * d + c * b) * e, b * d * f), frac(a + c * e, b + d * f), frac(a * c * e, b * d * f), frac(a * d * f + c * e * b, b * d * f * 2)],
      explanation: `Multiply before adding: \\(\\frac{${c}}{${d}}\\times\\frac{${e}}{${f}}=\\frac{${c * e}}{${d * f}}${product.math === `\\frac{${c * e}}{${d * f}}` ? '' : `=${product.math}`}\\).\nThen add with a common denominator:\n\\[\\frac{${a}}{${b}}+${product.math}=${answer.math}.\\]\nAdding the first two fractions before multiplying gives a different, incorrect value.` };
  }),
];

export const extraOrderOfOperations: Family[] = [
  family('order-parentheses', 'Parentheses first', 1, rng => {
    const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), d = rng.int(1, 12), answer = a * (b + c) - d;
    return { prompt: `What is the value of the expression below?\n\\[${a}\\times(${b}+${c})-${d}\\]`, answer: num(answer), wrong: [num(a * b + c - d), num(a * (b + c - d)), num(a * b + c + d), num(answer + 2 * d)],
      explanation: `Work inside the parentheses first, then multiply, then subtract:\n\\[${a}\\times(${b + c})-${d}=${a * (b + c)}-${d}=${answer}.\\]` };
  }),
  family('order-nested-groups', 'Nested grouping symbols', 3, rng => {
    const d = rng.int(1, 5), c = d + rng.int(2, 5), e = rng.int(2, 5), b = rng.int(2, 30), a = rng.int(10, 50), answer = a - (b - (c - d) * e);
    return { prompt: `What is the value of the expression below?\n\\[${a}-[${b}-(${c}-${d})\\times${e}]\\]`, answer: num(answer), wrong: [num(a - b - (c - d) * e), num(a - (b - (c - d)) * e), num((a - b - (c - d)) * e), num(a - (b - c - d * e))],
      explanation: `Start with the innermost parentheses and work outward.\n\\((${c}-${d})\\times${e}=${c - d}\\times${e}=${(c - d) * e}\\)\nInside the brackets: \\(${b}-${(c - d) * e}=${b - (c - d) * e}\\)\n\\[${a}-(${b - (c - d) * e})=${answer}.\\]\nThe minus sign in front of the brackets applies to the whole bracket.` };
  }),
];

export const extraExponents: Family[] = [
  family('root-perfect-square', 'Square roots and squares', 1, rng => {
    const r = rng.int(4, 15), k = rng.int(2, 9), plus = rng.bool(), answer = plus ? r + k * k : r - k * k;
    return { prompt: `What is the value of \\(\\sqrt{${r * r}}${plus ? '+' : '-'}${k}^2\\)?`, answer: num(answer), wrong: [num(plus ? r + 2 * k : r - 2 * k), num(plus ? r * r / 2 + k * k : r * r / 2 - k * k), num(plus ? r - k * k : r + k * k), num(plus ? r * r + k * k : r * r - k * k)],
      explanation: `\\(\\sqrt{${r * r}}=${r}\\) because \\(${r}\\times${r}=${r * r}\\), and \\(${k}^2=${k}\\times${k}=${k * k}\\).\n\\[${r}${plus ? '+' : '-'}${k * k}=${answer}.\\]\nA square root is not half of a number, and squaring is not doubling.` };
  }),
];

export const extraUnits: Family[] = [
  family('units-half-units', 'Converting with a fraction of a unit', 1, rng => {
    const [big, small, k] = rng.pick([['hours', 'minutes', 60], ['feet', 'inches', 12], ['pounds', 'ounces', 16], ['minutes', 'seconds', 60], ['gallons', 'quarts', 4], ['yards', 'inches', 36]] as const), whole = rng.int(1, 6), answer = whole * k + k / 2;
    return { prompt: `There are ${k} ${small} in 1 ${big.replace(/s$/, '').replace('fee', 'foo')}. How many ${small} are in \\(${whole}\\frac{1}{2}\\) ${big}?`, answer: num(answer), wrong: [num(whole * k), num((whole + 1) * k), num(whole * k + 5), num(whole * k + 50 > answer + 5 ? whole * k + 50 : answer + k)],
      explanation: `Convert the whole part and the half separately:\n\\(${whole}\\times${k}=${whole * k}\\) and \\(\\frac{1}{2}\\times${k}=${k / 2}\\).\n\\[${whole * k}+${k / 2}=${answer}.\\]` };
  }),
  family('units-drip-rate', 'A rate with two unit changes', 3, rng => {
    let ml = 20, seconds = 4, hours = 2;
    for (let tries = 0; tries < 60; tries++) { const a = rng.pick([5, 10, 15, 20, 25, 50]), s = rng.pick([2, 3, 4, 5, 6, 9, 10]), h = rng.int(1, 5); if (Number.isInteger(clean(a * 3600 * h / s / 100))) { ml = a; seconds = s; hours = h; break; } }
    const milliliters = ml * 3600 * hours / seconds, answer = clean(milliliters / 1000);
    return { prompt: `A leaky faucet drips ${ml} milliliters of water every ${seconds} seconds. At this rate, how many liters of water does it drip in ${hours} ${plural(hours, 'hour')}? (1 liter = 1,000 milliliters)`, answer: num(answer), wrong: [num(milliliters), num(clean(answer * 10)), num(clean(answer / 10)), num(clean(answer * 2))],
      explanation: `${hours} ${plural(hours, 'hour')} is \\(${hours}\\times3{,}600=${tx(hours * 3600)}\\) seconds, which is \\(${tx(hours * 3600)}\\div${seconds}=${tx(hours * 3600 / seconds)}\\) periods of ${seconds} seconds.\nWater: \\(${tx(hours * 3600 / seconds)}\\times${ml}=${tx(milliliters)}\\) milliliters.\n\\[${tx(milliliters)}\\div1{,}000=${tx(answer)}\\text{ liters}.\\]` };
  }),
];

export const extraRatios: Family[] = [
  family('ratio-simplest-form', 'Writing a ratio in simplest form', 1, rng => {
    const [a, b] = rng.pick([[2, 3], [3, 4], [1, 4], [2, 5], [3, 5], [4, 5], [1, 3], [5, 6], [3, 7], [2, 7], [5, 8], [3, 8]]), k = rng.int(2, 8), first = a * k, second = b * k;
    const story = rng.pick([['red marbles', 'blue marbles', 'A bag contains'], ['apples', 'oranges', 'A basket holds'], ['wins', 'losses', 'A team has'], ['dogs', 'cats', 'A shelter has']]);
    return { prompt: `${story[2]} ${first} ${story[0]} and ${second} ${story[1]}. What is the ratio of ${story[0]} to ${story[1]}, in simplest form?`, answer: ratio(a, b), wrong: [ratio(b, a), ratio(a, a + b), ratio(b, a + b), ratio(a + 1, b + 1)],
      explanation: `Write the ratio in the order asked, ${story[0]} to ${story[1]}: ${first}:${second}.\nDivide both numbers by their greatest common factor, ${k}: ${a}:${b}.\n${a}:${a + b} would compare the ${story[0]} with the total instead.` };
  }),
];

export const extraRates: Family[] = [
  family('rate-unit-rate', 'Finding a unit rate', 1, rng => {
    const rate = rng.pick([12, 15, 18, 24, 35, 40, 45, 48, 52, 55, 60, 65]), t = rng.int(2, 8), total = rate * t;
    const story = rng.pick([`A car travels ${total} miles in ${t} hours at a constant speed. What is the speed of the car, in miles per hour?`, `A printer prints ${total} pages in ${t} minutes at a constant rate. How many pages does it print per minute?`, `A worker earns $${total} for ${t} hours of work. How much does the worker earn per hour, in dollars?`]);
    return { prompt: story, answer: num(rate), wrong: [num(total * t), num(total - t), num(rate + t), num(rate - t > 0 ? rate - t : rate * 2)],
      explanation: `A unit rate is the amount for one unit of time. Divide the total by the number of units:\n\\[${total}\\div${t}=${rate}.\\]` };
  }),
];

export const extraPercentages: Family[] = [
  family('percent-from-fraction', 'Writing a fraction as a percent', 1, rng => {
    const [a, b] = rng.pick([[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10], [3, 20], [7, 20], [9, 20], [11, 20], [3, 25], [7, 25], [12, 25], [9, 50], [21, 50], [1, 20], [1, 25]]), answer = a * 100 / b;
    return { prompt: `Which percent is equal to \\(\\frac{${a}}{${b}}\\)?`, answer: pct(answer), wrong: [pct(Number(`${a}.${b}`)), pct(a * 10 === answer ? a * 5 : a * 10), pct(100 - answer === answer ? answer + 10 : 100 - answer), pct(b)],
      explanation: `Percent means "out of 100." Scale the fraction so the denominator is 100:\n\\[\\frac{${a}}{${b}}=\\frac{${a}\\times${100 / b}}{${b}\\times${100 / b}}=\\frac{${answer}}{100}=${answer}\\%.\\]` };
  }),
];

export const extraExpressions: Family[] = [
  family('expression-combine', 'Combining like terms', 1, rng => {
    const a = rng.int(2, 9), b = rng.int(1, 12), c = rng.int(2, 9), d = rng.int(1, 12), constant = b - d === 0 ? b + 1 - d : b - d, first = constant + d;
    return { prompt: `Which expression is equivalent to \\(${a}x+${first}+${c}x-${d}\\)?`, answer: linear(a + c, constant), wrong: [linear(a + c, first + d), linear(a * c, constant), tex(`${Math.max(2, Math.abs(a + c + constant))}x`), linear(a + c, -constant)],
      explanation: `Combine the \\(x\\) terms and combine the numbers separately:\n\\(${a}x+${c}x=${a + c}x\\) and \\(${first}-${d}=${constant}\\).\n\\[${linear(a + c, constant).math}\\]\nA term with \\(x\\) cannot be combined with a plain number.` };
  }),
];

export const extraEquations: Family[] = [
  family('equation-one-step', 'One-step equations with negatives', 1, rng => {
    const a = rng.int(2, 12), b = rng.int(a + 1, a + 12), form = rng.int(0, 1);
    if (form === 0) return { prompt: `What value of \\(x\\) makes the equation \\(x-${a}=-${b}\\) true?`, answer: num(a - b), wrong: [num(-a - b), num(a + b), num(b - a), num(-b)],
      explanation: `Add ${a} to both sides to undo the subtraction:\n\\[x=-${b}+${a}=${a - b}.\\]\nCheck: \\(${a - b}-${a}=-${b}\\).` };
    const q = rng.int(2, 9);
    return { prompt: `What value of \\(x\\) makes the equation \\(\\dfrac{x}{${a}}=-${q}\\) true?`, answer: num(-a * q), wrong: [num(a * q), num(-q + a), num(-q - a), num(-q)],
      explanation: `Multiply both sides by ${a} to undo the division:\n\\[x=-${q}\\times${a}=${-a * q}.\\]\nA negative times a positive is negative.` };
  }),
];

const inequalityContexts = [
  { text: (k: number) => `Riders on a roller coaster must be at least ${k} inches tall. Which inequality shows the heights \\(h\\), in inches, of people who may ride?`, variable: 'h', symbol: '\\ge', values: [42, 44, 48, 52, 54] },
  { text: (k: number) => `An elevator can hold at most ${fmt(k)} pounds. Which inequality shows the weights \\(w\\), in pounds, the elevator can hold?`, variable: 'w', symbol: '\\le', values: [1500, 2000, 2500, 3000] },
  { text: (k: number) => `A club needs more than ${k} members to hold a vote. Which inequality shows the numbers of members \\(m\\) that allow a vote?`, variable: 'm', symbol: '>', values: [12, 15, 20, 25, 30] },
  { text: (k: number) => `A package ships at the lower price only if it weighs less than ${k} ounces. Which inequality shows the weights \\(w\\), in ounces, that ship at the lower price?`, variable: 'w', symbol: '<', values: [8, 13, 16, 24, 32] },
  { text: (k: number) => `A student may miss no more than ${k} days of class. Which inequality shows the numbers of days \\(d\\) the student may miss?`, variable: 'd', symbol: '\\le', values: [3, 4, 5, 6, 8] },
  { text: (k: number) => `A game is for players who are no younger than ${k} years old. Which inequality shows the ages \\(a\\), in years, of people who may play?`, variable: 'a', symbol: '\\ge', values: [8, 10, 12, 13, 16] },
] as const;
const symbolWords: Record<string, string> = { '\\ge': '"At least" and "no younger than" mean that value or greater, so use ≥.', '\\le': '"At most" and "no more than" mean that value or less, so use ≤.', '>': '"More than" does not include the value itself, so use >.', '<': '"Less than" does not include the value itself, so use <.' };
export const extraInequalities: Family[] = [
  family('inequality-from-words', 'Choosing an inequality symbol', 1, rng => {
    const context = rng.pick(inequalityContexts), k = rng.pick(context.values), option = (symbol: string): Choice => tex(`${context.variable}${symbol}${tx(k)}`, `${context.variable} ${symbol.replace('\\ge', '≥').replace('\\le', '≤')} ${fmt(k)}`);
    return { prompt: context.text(k), answer: option(context.symbol), wrong: ['\\ge', '\\le', '>', '<'].filter(symbol => symbol !== context.symbol).map(option),
      explanation: `${symbolWords[context.symbol]}\n\\[${context.variable}${context.symbol}${tx(k)}\\]\nAsk whether the boundary value ${fmt(k)} itself is allowed, and which direction the allowed values go.` };
  }),
];

export const extraFunctions: Family[] = [
  family('function-evaluate-rule', 'Using a rule', 1, rng => {
    const a = rng.int(2, 8), b = rng.int(1, 12), k = rng.int(2, 9) * (rng.bool() ? 1 : -1), minus = rng.bool(), answer = minus ? a * k - b : a * k + b;
    return { prompt: `The rule for a function is \\(y=${a}x${minus ? '-' : '+'}${b}\\). What is the value of \\(y\\) when \\(x=${k}\\)?`, answer: num(answer), wrong: [num(minus ? a * k + b : a * k - b), num(a + k + (minus ? -b : b)), num((minus ? a - b : a + b) * k), num(-answer)],
      explanation: `Replace \\(x\\) with ${k} and multiply before ${minus ? 'subtracting' : 'adding'}:\n\\[y=${a}(${k})${minus ? '-' : '+'}${b}=${a * k}${minus ? '-' : '+'}${b}=${answer}.\\]` };
  }),
];

export const extraSequences: Family[] = [
  family('sequence-missing-term', 'Finding a missing term', 1, rng => {
    const d = rng.int(3, 12) * (rng.bool() ? 1 : -1), start = d > 0 ? rng.int(2, 30) : rng.int(70, 120), terms = Array.from({ length: 6 }, (_, i) => start + i * d), next = rng.bool(), gap = rng.int(2, 3);
    if (next) return { prompt: `The numbers below follow a pattern.\n\\[${terms.slice(0, 5).join(',\\ ')},\\ \\ldots\\]\nWhat is the next number in the pattern?`, answer: num(terms[5]), wrong: [num(terms[4] - d), num(terms[5] + d), num(terms[4] + Math.abs(d) + 1), num(terms[4] + (d > 0 ? d - 1 : d + 1))],
      explanation: `Each number is ${Math.abs(d)} ${d > 0 ? 'more' : 'less'} than the one before it (for example, \\(${terms[1]}-${terms[0]}=${d}\\)).\n\\[${terms[4]}${signed(d)}=${terms[5]}.\\]` };
    return { prompt: `The numbers below follow a pattern, and one number is missing.\n\\[${terms.slice(0, 5).map((value, i) => i === gap ? '\\underline{\\quad}' : value).join(',\\ ')}\\]\nWhat is the missing number?`, answer: num(terms[gap]), wrong: [num(terms[gap] + (d > 0 ? 1 : -1)), num(terms[gap - 1] + 2 * d), num(terms[gap - 1]), num(terms[gap] - (d > 0 ? 2 : -2))],
      explanation: `Each number is ${Math.abs(d)} ${d > 0 ? 'more' : 'less'} than the one before it (\\(${terms[1]}-${terms[0]}=${d}\\)).\nThe missing number is \\(${terms[gap - 1]}${signed(d)}=${terms[gap]}\\). Check: \\(${terms[gap]}${signed(d)}=${terms[gap + 1]}\\).` };
  }),
];

export const extraTriangles: Family[] = [
  family('triangle-right-acute', 'Acute angles of a right triangle', 1, rng => {
    const a = rng.int(12, 78);
    return { prompt: `One acute angle of a right triangle measures \\(${a}^\\circ\\). What is the measure of the other acute angle?`, answer: deg(90 - a), wrong: [deg(180 - a), deg(90 + a), deg(a), deg(90 - a + 10)],
      explanation: `A right triangle has one \\(90^\\circ\\) angle, and all three angles add to \\(180^\\circ\\). So the two acute angles add to \\(90^\\circ\\):\n\\[90-${a}=${90 - a}^\\circ.\\]` };
  }),
  family('triangle-isosceles-perimeter', 'Isosceles triangle with two given sides', 3, rng => {
    const a = rng.int(3, 9), b = 2 * a + rng.int(0, 7), perimeter = a + 2 * b;
    return { prompt: `An isosceles triangle has one side of length ${a} and another side of length ${b}. What is the perimeter of the triangle?`, answer: num(perimeter), wrong: [num(2 * a + b), num(a + b), num(2 * (a + b)), num(perimeter + a)],
      explanation: `The third side must match one of the given sides, so it is ${a} or ${b}.\nSides ${a}, ${a}, and ${b} cannot form a triangle because \\(${a}+${a}=${2 * a}\\) is not greater than ${b}.\nSo the sides are ${a}, ${b}, and ${b}: \\(${a}+${b}+${b}=${perimeter}\\).` };
  }),
];

export const extraPolygons: Family[] = [
  family('parallelogram-adjacent-angle', 'Angles of a parallelogram', 1, rng => {
    let a = rng.int(35, 145); if (a === 90) a = 72;
    const opposite = rng.bool();
    if (opposite) return { prompt: `One angle of a parallelogram measures \\(${a}^\\circ\\). What is the measure of the angle opposite it?`, answer: deg(a), wrong: [deg(180 - a), deg(360 - a), deg(Math.abs(90 - a) || 45), deg(a + 10)],
      explanation: `Opposite angles of a parallelogram are equal, so the opposite angle also measures \\(${a}^\\circ\\).\n(The angles next to it each measure \\(180^\\circ-${a}^\\circ=${180 - a}^\\circ\\).)` };
    return { prompt: `One angle of a parallelogram measures \\(${a}^\\circ\\). What is the measure of an angle next to it?`, answer: deg(180 - a), wrong: [deg(a), deg(360 - a), deg(Math.abs(90 - a) || 45), deg(180 - a + 10)],
      explanation: `Angles next to each other in a parallelogram are supplementary:\n\\[180^\\circ-${a}^\\circ=${180 - a}^\\circ.\\]\nOnly the opposite angle is equal to \\(${a}^\\circ\\).` };
  }),
];

export const extraCircles: Family[] = [
  family('circle-radius-from-circumference', 'Radius and diameter', 1, rng => {
    const r = rng.int(2, 20), askRadius = rng.bool();
    return { prompt: `The circumference of a circle is \\(${2 * r}\\pi\\) centimeters. What is the ${askRadius ? 'radius' : 'diameter'} of the circle, in centimeters?`, answer: num(askRadius ? r : 2 * r), wrong: askRadius ? [num(2 * r), num(4 * r), num(r * r), num(r + 1)] : [num(r), num(4 * r), num(r * r === 2 * r ? r + 3 : r * r), num(2 * r + 2)],
      explanation: `Circumference is \\(\\pi\\) times the diameter, so the diameter is ${2 * r}. The radius is half the diameter: \\(${2 * r}\\div2=${r}\\).\nThe ${askRadius ? 'radius' : 'diameter'} is ${askRadius ? r : 2 * r}.` };
  }),
];

export const extraArea: Family[] = [
  family('area-square-from-perimeter', 'Square: perimeter to area', 1, rng => {
    const side = rng.int(3, 15), perimeter = 4 * side, reverse = rng.bool();
    if (reverse) return { prompt: `A square has an area of ${side * side} square inches. What is the perimeter of the square, in inches?`, answer: num(perimeter), wrong: [num(side), num(2 * side), num(side * side * 4), num(side * side / 2 === perimeter ? perimeter + 4 : Math.round(side * side / 2))],
      explanation: `Each side is \\(\\sqrt{${side * side}}=${side}\\) inches. A square has 4 equal sides:\n\\[4\\times${side}=${perimeter}.\\]` };
    return { prompt: `A square has a perimeter of ${perimeter} inches. What is the area of the square, in square inches?`, answer: num(side * side), wrong: [num(perimeter * perimeter), num(side), num(4 * side * side), num(2 * perimeter === side * side ? side * side + 4 : 2 * perimeter)],
      explanation: `A square has 4 equal sides, so each side is \\(${perimeter}\\div4=${side}\\) inches. Area is side times side:\n\\[${side}\\times${side}=${side * side}.\\]\nSquaring the perimeter itself, or stopping at the side length, are common mistakes.` };
  }),
];

export const extraCoordinate: Family[] = [
  family('coordinate-axis-distance', 'Horizontal and vertical distance', 1, rng => {
    const fixed = rng.int(-8, 8), low = rng.int(-9, -1), high = rng.int(1, 9), vertical = rng.bool(), first = vertical ? `(${fixed},\\ ${low})` : `(${low},\\ ${fixed})`, second = vertical ? `(${fixed},\\ ${high})` : `(${high},\\ ${fixed})`;
    return { prompt: `What is the distance between the points \\(${first}\\) and \\(${second}\\) on the coordinate plane?`, answer: num(high - low), wrong: [num(Math.abs(high + low) || 1), num(high), num(-low === high ? high + 2 : -low), num(high - low + Math.abs(fixed) + 1)],
      explanation: `The points have the same \\(${vertical ? 'x' : 'y'}\\)-coordinate, so they lie on a ${vertical ? 'vertical' : 'horizontal'} line. Subtract the other coordinates:\n\\[${high}-(${low})=${high - low}.\\]\nOne point is ${-low} ${plural(-low, 'unit')} on one side of the axis and the other is ${high} on the other side, so the distances add.` };
  }),
];

export const extraSimilarity: Family[] = [
  family('scale-similar-side', 'Missing side of a similar figure', 1, rng => {
    const a = rng.int(2, 8), b = a + rng.int(1, 7), k = rng.int(2, 6);
    return { prompt: `Two rectangles are similar. The first rectangle is ${a} centimeters wide and ${b} centimeters long. The second rectangle is ${a * k} centimeters wide. How long is the second rectangle, in centimeters?`, answer: num(b * k), wrong: [num(b + (a * k - a)), num(a * k + b), num(b * k + a), num(a * b)],
      explanation: `Similar figures have the same scale factor for every side. The widths give the factor: \\(${a * k}\\div${a}=${k}\\).\n\\[${b}\\times${k}=${b * k}.\\]\nThe sides are multiplied by the same number, not increased by the same amount.` };
  }),
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const extraDataDisplays: Family[] = [
  family('data-table-compare', 'Comparing values in a table', 1, rng => {
    const values = new Set<number>(); while (values.size < 5) values.add(rng.int(12, 95));
    const counts = [...values], thing = rng.pick(['Tickets sold', 'Books borrowed', 'Cups sold', 'Miles driven']), [i, j] = rng.shuffle([0, 1, 2, 3, 4]).slice(0, 2), big = Math.max(counts[i], counts[j]), small = Math.min(counts[i], counts[j]), form = rng.int(0, 1);
    const shown = table(['Day', thing], weekdays.map((day, at) => [day, counts[at]]));
    if (form === 0) return { prompt: `${shown}\n\nThe table shows data for five days. What is the difference between the values for ${weekdays[i]} and ${weekdays[j]}?`, answer: num(big - small), wrong: [num(big + small), num(big), num(Math.max(...counts) - Math.min(...counts) === big - small ? big - small + 10 : Math.max(...counts) - Math.min(...counts)), num(big - small + 10)],
      explanation: `Read the two rows: ${weekdays[i]} is ${counts[i]} and ${weekdays[j]} is ${counts[j]}.\n\\[${big}-${small}=${big - small}.\\]` };
    return { prompt: `${shown}\n\nThe table shows data for five days. What is the total for all five days?`, answer: num(sum(counts)), wrong: [num(sum(counts) - counts[4]), num(sum(counts) + 10), num(sum(counts) - 10), num(Math.max(...counts))],
      explanation: `Read the value for each day from the right column and add all five:\n\\[${counts.join('+')}=${sum(counts)}.\\]` };
  }),
];

export const extraAverages: Family[] = [
  family('range-and-mode', 'Range and mode', 1, rng => {
    const mode = rng.int(10, 40), others = new Set<number>(); while (others.size < 4) { const value = rng.int(5, 48); if (value !== mode) others.add(value); }
    const listed = rng.shuffle([mode, mode, ...others]), sorted = [...listed].sort((a, b) => a - b), range = sorted[5] - sorted[0], askRange = rng.bool();
    if (askRange) return { prompt: `What is the range of the data set below?\n\\[${listed.join(',\\ ')}\\]`, answer: num(range), wrong: [num(sorted[5]), num(mode === range ? mode + 3 : mode), num(sorted[5] + sorted[0]), num(Math.abs(listed[5] - listed[0]) === range ? range + 2 : Math.abs(listed[5] - listed[0]))],
      explanation: `The range is the greatest value minus the least value:\n\\[${sorted[5]}-${sorted[0]}=${range}.\\]\nUse the greatest and least values, not the first and last ones listed.` };
    return { prompt: `What is the mode of the data set below?\n\\[${listed.join(',\\ ')}\\]`, answer: num(mode), wrong: [num(sorted[5] === mode ? sorted[4] : sorted[5]), num(range === mode ? range + 2 : range), num((sorted[2] + sorted[3]) / 2 === mode ? mode + 1 : (sorted[2] + sorted[3]) / 2), num(sorted[0] === mode ? sorted[1] : sorted[0])],
      explanation: `The mode is the value that appears most often. In order, the data are ${sorted.join(', ')}.\n${mode} appears twice and every other value appears once, so the mode is ${mode}.` };
  }),
];

export const extraProbability: Family[] = [
  family('probability-spinner-range', 'Probability on a numbered spinner', 1, rng => {
    const n = rng.pick([5, 6, 8, 10, 12]), k = rng.int(2, n - 1), less = rng.bool(), count = less ? k - 1 : n - k, name = rng.pick(names);
    return { prompt: `${name} spins a spinner that has ${n} equal sections numbered 1 through ${n}. What is the probability that the spinner lands on a number ${less ? 'less' : 'greater'} than ${k}?`, answer: frac(count, n), wrong: [frac(less ? k : n - k + 1, n), frac(less ? n - k + 1 : k, n), frac(1, n), frac(count, n + count)],
      explanation: `The numbers ${less ? 'less' : 'greater'} than ${k} are ${Array.from({ length: count }, (_, i) => less ? i + 1 : k + 1 + i).join(', ')}. That is ${count} of the ${n} equally likely sections:\n\\[\\frac{${count}}{${n}}${frac(count, n).text === `${count}/${n}` ? '' : `=${fracTex(count, n)}`}.\\]\n${k} itself is not ${less ? 'less' : 'greater'} than ${k}.` };
  }),
];
