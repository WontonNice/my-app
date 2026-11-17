import { clean, family, fmt, frac, fracTex, gcd, lcm, money, names, num, plural, signed, tex, tx, type Choice, type Family } from './kit';

const ints = (...values: number[]) => values.map(value => num(Math.round(value)));
const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const mixed = (numerator: number, denominator: number) => { const g = gcd(numerator, denominator), n = numerator / g, d = denominator / g, whole = Math.floor(n / d), rest = n % d; return d === 1 ? String(n) : whole ? `${whole}\\frac{${rest}}{${d}}` : `\\frac{${rest}}{${d}}`; };

// ---- Number Types & Properties ----
export const numberProperties: Family[] = [
  family('number-gcf', 'Greatest common factor', 1, rng => {
    const g = rng.pick([4, 6, 8, 9, 12, 15, 18]), [m, n] = rng.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 7], [5, 7], [2, 7], [4, 7]]);
    const a = g * m, b = g * n, small = [2, 3, 5].find(p => g % p === 0)!;
    return { prompt: `What is the greatest common factor of ${a} and ${b}?`, answer: num(g), wrong: [num(lcm(a, b)), num(small), num(a), num(g * 2)],
      explanation: `Write each number as a product: \\(${a}=${g}\\times${m}\\) and \\(${b}=${g}\\times${n}\\). Because ${m} and ${n} share no factor greater than 1, the greatest number that divides both is ${g}.\n${small} is a common factor, but it is not the greatest one, and ${fmt(lcm(a, b))} is the least common multiple.` };
  }),
  family('number-lcm-events', 'Least common multiple in a schedule', 2, rng => {
    const [a, b] = rng.pick([[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [12, 18], [6, 10], [4, 10], [12, 15], [8, 10], [15, 20], [12, 16], [9, 15], [10, 25], [14, 21], [16, 24], [18, 24]]);
    const story = rng.pick([
      { setup: `One bell rings every ${a} minutes and another bell rings every ${b} minutes. Both bells ring together at noon.`, ask: 'After how many minutes will the two bells next ring at the same time?' },
      { setup: `Bus A leaves the station every ${a} minutes and Bus B leaves every ${b} minutes. Both buses leave together at 8:00 a.m.`, ask: 'After how many minutes will the two buses next leave at the same time?' },
      { setup: `A red light flashes every ${a} seconds and a blue light flashes every ${b} seconds. They flash together now.`, ask: 'In how many seconds will they next flash together?' },
    ]), answer = lcm(a, b);
    return { prompt: `${story.setup} ${story.ask}`, answer: num(answer), wrong: [num(a * b), num(a + b), num(gcd(a, b)), num(answer * 2)],
      explanation: `The events line up at common multiples of ${a} and ${b}. The first time is the least common multiple.\nMultiples of ${b}: ${[1, 2, 3, 4, 5, 6].map(k => k * b).filter(v => v <= answer).join(', ')}. The first one that is also a multiple of ${a} is ${answer}.\nMultiplying \\(${a}\\times${b}=${a * b}\\) gives a common multiple, but not the least one.` };
  }),
  family('number-prime-count', 'Counting primes in a range', 2, rng => {
    const low = rng.pick([10, 20, 30, 40, 50, 60, 70, 80]), high = low + rng.pick([10, 15, 20]);
    const primes: number[] = []; for (let n = low + 1; n < high; n++) if (isPrime(n)) primes.push(n);
    const count = primes.length;
    return { prompt: `How many prime numbers are greater than ${low} and less than ${high}?`, answer: num(count), wrong: [num(count + 1), num(count + 2), ...(count > 0 ? [num(count - 1)] : []), num(count + 3)],
      explanation: `Check each number between ${low} and ${high}. Even numbers and multiples of 3, 5, and 7 are not prime.\nThe primes are: ${primes.join(', ')}. That is ${count} prime ${plural(count, 'number')}.` };
  }),
  family('number-consecutive-sum', 'Consecutive integers with a given sum', 2, rng => {
    const k = rng.pick([3, 4, 5]), start = rng.int(6, 45), sum = k * start + k * (k - 1) / 2, greatest = rng.bool();
    return { prompt: `The sum of ${k} consecutive integers is ${sum}. What is the ${greatest ? 'greatest' : 'least'} of these integers?`, grid: greatest ? start + k - 1 : start,
      explanation: `Let the least integer be \\(n\\). The integers are ${Array.from({ length: k }, (_, i) => i ? `\\(n+${i}\\)` : '\\(n\\)').join(', ')}, so\n\\[${k}n+${k * (k - 1) / 2}=${sum}\\quad\\Rightarrow\\quad ${k}n=${sum - k * (k - 1) / 2}\\quad\\Rightarrow\\quad n=${start}.\\]\nThe integers are ${Array.from({ length: k }, (_, i) => start + i).join(', ')}. The ${greatest ? 'greatest' : 'least'} is ${greatest ? start + k - 1 : start}.` };
  }),
  family('number-factor-count', 'Counting positive factors', 3, rng => {
    const [p, q] = rng.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]]), a = rng.int(1, p === 2 ? 3 : 2), b = rng.int(1, 2), n = p ** a * q ** b, count = (a + 1) * (b + 1);
    const factors: number[] = []; for (let d = 1; d <= n; d++) if (n % d === 0) factors.push(d);
    return { prompt: `How many positive factors does ${n} have?`, answer: num(count), wrong: [num(count - 2), num(a + b), num(count + 2), num(count - 1)],
      explanation: `Prime factorization: \\(${n}=${p}^{${a}}\\times${q}^{${b}}\\). A factor uses 0 to ${a} copies of ${p} (${a + 1} choices) and 0 to ${b} copies of ${q} (${b + 1} choices):\n\\[${a + 1}\\times${b + 1}=${count}.\\]\nThe factors are ${factors.join(', ')}. Remember to count 1 and ${n} itself.` };
  }),
  family('number-remainder', 'Remainders after adding', 3, rng => {
    const d = rng.int(5, 9), r = rng.int(1, d - 1), k = rng.int(d - r + 1, 2 * d + 4), answer = (r + k) % d;
    return { prompt: `When a positive integer \\(n\\) is divided by ${d}, the remainder is ${r}. What is the remainder when \\(n+${k}\\) is divided by ${d}?`, answer: num(answer), wrong: [num(r + k), num(k % d), num(r), num(d - r)].filter(choice => choice.value! < d || choice.value === r + k),
      explanation: `\\(n\\) is ${r} more than a multiple of ${d}, so \\(n+${k}\\) is \\(${r}+${k}=${r + k}\\) more than a multiple of ${d}.\nSince \\(${r + k}=${Math.floor((r + k) / d)}\\times${d}+${answer}\\), the remainder is ${answer}. A remainder must always be less than ${d}.\nCheck with \\(n=${d + r}\\): \\(${d + r + k}\\div${d}\\) leaves remainder ${answer}.` };
  }),
];

// ---- Integers & Absolute Value ----
export const integersAbsoluteValue: Family[] = [
  family('integer-chain', 'Adding and subtracting signed numbers', 1, rng => {
    const a = rng.int(2, 15), b = rng.int(2, 15), c = rng.int(2, 15), answer = -a + b - c;
    return { prompt: `What is the value of the expression below?\n\\[-${a}-(-${b})+(-${c})\\]`, answer: num(answer), wrong: [num(-a - b - c), num(-a + b + c), num(a + b - c), num(a - b + c)],
      explanation: `Subtracting a negative is the same as adding, and adding a negative is the same as subtracting:\n\\[-${a}-(-${b})+(-${c})=-${a}+${b}-${c}=${answer}.\\]` };
  }),
  family('integer-number-line-distance', 'Distance on a number line', 1, rng => {
    const a = rng.int(2, 14), b = rng.int(2, 14);
    return { prompt: `On a number line, point P is located at \\(-${a}\\) and point Q is located at ${b}. What is the distance between P and Q?`, answer: num(a + b), wrong: [num(Math.abs(b - a)), num(-(a + b)), num(a * b), num(a + b + 1)],
      explanation: `Distance is the difference between the coordinates, and it is never negative:\n\\[${b}-(-${a})=${b}+${a}=${a + b}.\\]\nP is ${a} units left of 0 and Q is ${b} units right of 0, so they are \\(${a}+${b}=${a + b}\\) units apart.` };
  }),
  family('integer-absolute-value', 'Evaluating absolute value', 1, rng => {
    const a = rng.int(1, 9), b = rng.int(a + 2, 19), c = rng.int(2, 9), answer = b - a - c;
    return { prompt: `What is the value of the expression below?\n\\[|${a}-${b}|-|-${c}|\\]`, answer: num(answer), wrong: [num(a - b - c), num(b - a + c), num(a - b + c), num(-(answer))],
      explanation: `Absolute value is the distance from 0, so it is never negative.\n\\(|${a}-${b}|=|${a - b}|=${b - a}\\) and \\(|-${c}|=${c}\\).\n\\[${b - a}-${c}=${answer}.\\]` };
  }),
  family('integer-temperature', 'Temperature changes', 2, rng => {
    const a = rng.int(3, 15), b = rng.int(a + 2, a + 18), c = rng.int(b - a + 2, b - a + 14), answer = -a + b - c;
    return { prompt: `At 6:00 a.m. the temperature was \\(-${a}^\\circ\\text{F}\\). By noon it had risen ${b} degrees, and by midnight it had fallen ${c} degrees from the noon temperature. What was the temperature, in degrees Fahrenheit, at midnight?`, answer: num(answer), wrong: [num(a + b - c), num(-a - b - c), num(-a + b + c), num(-answer)],
      explanation: `Start at \\(-${a}\\). Rising adds and falling subtracts:\n\\[-${a}+${b}=${b - a}\\qquad ${b - a}-${c}=${answer}.\\]\nThe midnight temperature was \\(${answer}^\\circ\\text{F}\\).` };
  }),
  family('integer-absolute-substitution', 'Absolute value with substitution', 2, rng => {
    const a = rng.int(2, 9); let b = rng.int(1, 9); if (b === a) b = a + 1;
    const answer = a + b - Math.abs(b - a);
    return { prompt: `If \\(x=-${a}\\) and \\(y=${b}\\), what is the value of \\(|x-y|-|x+y|\\)?`, answer: num(answer), wrong: [num(2 * Math.max(a, b)), num(0), num(-answer), num(2 * (a + b))],
      explanation: `Substitute, then simplify inside each absolute value first.\n\\(|x-y|=|-${a}-${b}|=|${-a - b}|=${a + b}\\)\n\\(|x+y|=|-${a}+${b}|=|${b - a}|=${Math.abs(b - a)}\\)\n\\[${a + b}-${Math.abs(b - a)}=${answer}.\\]` };
  }),
  family('integer-absolute-equation', 'Solving an absolute value equation', 2, rng => {
    let a = rng.int(-6, 8); if (a === 0) a = 3;
    const b = rng.int(Math.abs(a) + 1, Math.abs(a) + 9), smaller = rng.bool(), answer = smaller ? a - b : a + b;
    return { prompt: `What is the ${smaller ? 'lesser' : 'greater'} of the two solutions to the equation \\(|x${signed(-a)}|=${b}\\)?`, answer: num(answer), wrong: [num(smaller ? a + b : a - b), num(smaller ? -(a + b) : -(a - b)), num(b), num(-b)],
      explanation: `The expression inside the absolute value can equal ${b} or \\(-${b}\\).\n\\(x${signed(-a)}=${b}\\) gives \\(x=${a + b}\\).\n\\(x${signed(-a)}=-${b}\\) gives \\(x=${a - b}\\).\nThe ${smaller ? 'lesser' : 'greater'} solution is ${answer}.` };
  }),
  family('integer-absolute-inequality-count', 'Counting integers within a distance', 3, rng => {
    let a = rng.int(-5, 9); if (a === 0) a = 4;
    const b = rng.int(2, 7), strict = rng.bool(), answer = strict ? 2 * b - 1 : 2 * b + 1;
    return { prompt: `How many integers \\(x\\) satisfy the inequality \\(|x${signed(-a)}|${strict ? '<' : '\\le'}${b}\\)?`, answer: num(answer), wrong: [num(2 * b), num(strict ? 2 * b + 1 : 2 * b - 1), num(b), num(strict ? b - 1 : b + 1)],
      explanation: `The inequality says \\(x\\) is ${strict ? 'less than' : 'at most'} ${b} units from ${a} on the number line, so \\(${a - b}${strict ? '<' : '\\le '}x${strict ? '<' : '\\le '}${a + b}\\).\nThe integers run from ${strict ? a - b + 1 : a - b} to ${strict ? a + b - 1 : a + b}. Count them: \\(${strict ? a + b - 1 : a + b}-(${strict ? a - b + 1 : a - b})+1=${answer}\\).` };
  }),
];

// ---- Fractions & Decimals ----
const unitFractions = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [3, 10], [7, 10], [5, 12], [7, 12]];
export const fractionsDecimals: Family[] = [
  family('fraction-add', 'Adding fractions with unlike denominators', 1, rng => {
    let a = 1, b = 2, c = 1, d = 3;
    for (let tries = 0; tries < 50; tries++) { [a, b] = rng.pick(unitFractions); [c, d] = rng.pick(unitFractions); if (b !== d && a * d + c * b < b * d) break; a = 1; b = 4; c = 1; d = 3; }
    const common = lcm(b, d);
    return { prompt: `What is the value of the expression below?\n\\[\\frac{${a}}{${b}}+\\frac{${c}}{${d}}\\]`, answer: frac(a * d + c * b, b * d), wrong: [frac(a + c, b + d), frac(a + c, b * d), frac(a * c, b * d), frac(a + c, Math.max(b, d))],
      explanation: `Use a common denominator of ${common}:\n\\[\\frac{${a}}{${b}}+\\frac{${c}}{${d}}=\\frac{${a * common / b}}{${common}}+\\frac{${c * common / d}}{${common}}=\\frac{${a * common / b + c * common / d}}{${common}}${gcd(a * common / b + c * common / d, common) > 1 ? `=${fracTex(a * d + c * b, b * d)}` : ''}.\\]\nNever add the denominators.` };
  }),
  family('fraction-of-group', 'Fraction of a group', 1, rng => {
    const [p, q] = rng.pick([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 6], [5, 6], [3, 8], [5, 8]]), total = q * rng.int(3, 12), name = rng.pick(names);
    const story = rng.pick([
      { setup: `A class has ${total} students. \\(${fracTex(p, q)}\\) of them walk to school.`, ask: 'How many students do not walk to school?' },
      { setup: `${name} has ${total} stickers. ${name} gives away \\(${fracTex(p, q)}\\) of them.`, ask: `How many stickers does ${name} have left?` },
      { setup: `A parking lot has ${total} spaces, and \\(${fracTex(p, q)}\\) of the spaces are filled.`, ask: 'How many spaces are empty?' },
    ]), part = total * p / q;
    return { prompt: `${story.setup} ${story.ask}`, answer: num(total - part), wrong: [num(part), num(total / q), num(total - p), num(total - q)],
      explanation: `First find the fraction of the total: \\(${fracTex(p, q)}\\times${total}=${part}\\).\nThe question asks for the rest: \\(${total}-${part}=${total - part}\\).\n(You can also multiply by the remaining fraction: \\(${fracTex(q - p, q)}\\times${total}=${total - part}\\).)` };
  }),
  family('fraction-of-remainder', 'Fraction of what is left', 2, rng => {
    const [p, a] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 5], [3, 5]]), [q, b] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), name = rng.pick(names);
    const direct = a * b - p * b - q * a;
    return { prompt: `${name} spent \\(${fracTex(p, a)}\\) of a paycheck on rent and then spent \\(${fracTex(q, b)}\\) of the remaining money on food. What fraction of the paycheck is left?`, answer: frac((a - p) * (b - q), a * b), wrong: [direct > 0 ? frac(direct, a * b) : frac(1, a * b), frac(p * q, a * b), frac((a - p) * q, a * b), frac(a - p, a)],
      explanation: `After rent, \\(1-${fracTex(p, a)}=${fracTex(a - p, a)}\\) of the paycheck remains.\nFood uses \\(${fracTex(q, b)}\\) of that remainder, so \\(${fracTex(b - q, b)}\\) of the remainder is left:\n\\[${fracTex(a - p, a)}\\times${fracTex(b - q, b)}=${fracTex((a - p) * (b - q), a * b)}.\\]\nThe second fraction is taken from what was left, not from the whole paycheck.` };
  }),
  family('decimal-product', 'Multiplying decimals', 2, rng => {
    const m = rng.pick([2, 3, 4, 6, 7, 8, 9, 11, 12, 13]), n = rng.pick([2, 3, 4, 6, 7, 8, 9]), i = rng.int(1, 2), j = rng.int(1, 2), x = clean(m / 10 ** i), y = clean(n / 10 ** j), answer = clean(m * n / 10 ** (i + j));
    return { prompt: `What is the value of \\(${tx(x)}\\times${tx(y)}\\)?`, answer: num(answer), wrong: [num(clean(answer * 10)), num(clean(answer / 10)), num(clean(answer * 100))],
      explanation: `Multiply the whole numbers: \\(${m}\\times${n}=${m * n}\\).\n\\(${tx(x)}\\) has ${i} decimal ${plural(i, 'place')} and \\(${tx(y)}\\) has ${j}, so the product needs \\(${i}+${j}=${i + j}\\) decimal places:\n\\[${tx(x)}\\times${tx(y)}=${tx(answer)}.\\]` };
  }),
  family('fraction-division-pieces', 'Dividing by a fraction', 2, rng => {
    const [p, q] = rng.pick([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3], [3, 8], [1, 8], [2, 5], [3, 5]]), count = rng.int(4, 24);
    const story = rng.pick([
      { thing: 'A board', unit: 'feet', piece: 'foot', ask: 'pieces' }, { thing: 'A ribbon', unit: 'yards', piece: 'yard', ask: 'pieces' }, { thing: 'A rope', unit: 'meters', piece: 'meter', ask: 'pieces' },
    ]);
    return { prompt: `${story.thing} is \\(${mixed(count * p, q)}\\) ${story.unit} long. It is cut into pieces that are each \\(${fracTex(p, q)}\\) ${story.piece} long, with nothing left over. How many ${story.ask} are there?`, grid: count,
      explanation: `Divide the total length by the length of one piece. Dividing by a fraction is the same as multiplying by its reciprocal:\n\\[${mixed(count * p, q)}\\div${fracTex(p, q)}=${fracTex(count * p, q)}\\times${fracTex(q, p)}=${count}.\\]` };
  }),
  family('fraction-compare', 'Comparing fractions', 2, rng => {
    const pool = rng.shuffle([[2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [4, 7], [5, 7], [5, 8], [7, 8], [5, 9], [7, 9], [7, 10], [9, 10], [7, 12], [11, 12], [4, 9], [3, 7], [6, 11], [8, 11]]);
    const picked: number[][] = []; for (const item of pool) if (picked.length < 4 && !picked.some(other => Math.abs(other[0] / other[1] - item[0] / item[1]) < 0.012)) picked.push(item);
    const greatest = rng.bool(), sorted = [...picked].sort((x, y) => x[0] / x[1] - y[0] / y[1]), answer = greatest ? sorted[3] : sorted[0];
    const option = ([n, d]: number[]): Choice => tex(`\\frac{${n}}{${d}}`, `${n}/${d}`);
    return { prompt: `Which of the following fractions is the ${greatest ? 'greatest' : 'least'}?`, answer: option(answer), wrong: picked.filter(item => item !== answer).map(option),
      explanation: `Compare the fractions as decimals (or with a common denominator):\n${sorted.map(([n, d]) => `\\(\\frac{${n}}{${d}}\\approx${(n / d).toFixed(3)}\\)`).join(', ')}.\nThe ${greatest ? 'greatest' : 'least'} is \\(\\frac{${answer[0]}}{${answer[1]}}\\).` };
  }),
  family('fraction-to-decimal', 'Writing a fraction as a decimal', 1, rng => {
    const [n, d] = rng.pick([[3, 8], [5, 8], [7, 8], [1, 8], [3, 20], [7, 20], [9, 20], [11, 20], [3, 25], [7, 25], [9, 25], [3, 40], [9, 40], [7, 40], [13, 20], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 20], [17, 20], [19, 20], [1, 25], [4, 25], [11, 25], [13, 25], [1, 40], [11, 40]]), answer = clean(n / d);
    return { prompt: `Which decimal is equal to \\(\\frac{${n}}{${d}}\\)?`, answer: num(answer), wrong: [num(Number(`0.${n}${d}`)), num(clean(answer * 10)), num(clean(answer + 0.05)), num(clean(answer + 0.1))],
      explanation: `Divide the numerator by the denominator: \\(${n}\\div${d}=${tx(answer)}\\).\nYou can also scale the denominator to a power of 10: \\(\\frac{${n}}{${d}}=\\frac{${clean(n * 1000 / d)}}{1{,}000}=${tx(answer)}\\).` };
  }),
  family('fraction-complex', 'Simplifying a complex fraction', 3, rng => {
    const [a, b] = rng.pick([[2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [3, 6], [4, 5], [2, 6], [4, 6]]), c = rng.pick([2, 3, 4, 6, 8]);
    return { prompt: `What is the value of the expression below?\n\\[\\frac{\\dfrac{1}{${a}}+\\dfrac{1}{${b}}}{\\dfrac{1}{${c}}}\\]`, answer: frac((a + b) * c, a * b), wrong: [frac(a + b, a * b * c), frac(2 * c, a + b), frac(c, a * b), frac(a * b, (a + b) * c)],
      explanation: `Simplify the numerator first: \\(\\frac{1}{${a}}+\\frac{1}{${b}}=\\frac{${b}}{${a * b}}+\\frac{${a}}{${a * b}}=${fracTex(a + b, a * b)}\\).\nDividing by \\(\\frac{1}{${c}}\\) is the same as multiplying by ${c}:\n\\[${fracTex(a + b, a * b)}\\times${c}=${fracTex((a + b) * c, a * b)}.\\]` };
  }),
];

// ---- Order of Operations ----
export const orderOfOperations: Family[] = [
  family('order-four-operations', 'Order of operations with four operations', 1, rng => {
    const a = rng.int(3, 20), b = rng.int(2, 9), c = rng.int(2, 9), e = rng.int(2, 6), d = e * rng.int(2, 8), answer = a + b * c - d / e;
    return { prompt: `What is the value of the expression below?\n\\[${a}+${b}\\times${c}-${d}\\div${e}\\]`, answer: num(answer), wrong: ints(((a + b) * c - d) / e, (a + b) * c - d / e, a + b * (c - d) / e, a + b * c - d),
      explanation: `Multiply and divide before adding and subtracting:\n\\[${a}+(${b}\\times${c})-(${d}\\div${e})=${a}+${b * c}-${d / e}=${answer}.\\]\nWorking strictly left to right gives a different, incorrect value.` };
  }),
  family('order-squared-group', 'Order of operations with a squared group', 2, rng => {
    const d = rng.int(1, 6), c = d + rng.int(2, 5), b = rng.int(2, 5), a = rng.int(10, 60), answer = a - b * (c - d) ** 2;
    return { prompt: `What is the value of the expression below?\n\\[${a}-${b}(${c}-${d})^2\\]`, answer: num(answer), wrong: [num((a - b) * (c - d) ** 2), num(a - (b * (c - d)) ** 2), num(a - b * (c * c - d * d)), num(a + b * (c - d) ** 2)],
      explanation: `Work inside the parentheses, then the exponent, then multiply, then subtract:\n\\[${a}-${b}(${c - d})^2=${a}-${b}(${(c - d) ** 2})=${a}-${b * (c - d) ** 2}=${answer}.\\]\nThe exponent applies only to the parentheses, and the subtraction comes last.` };
  }),
  family('order-fraction-bar', 'Order of operations with a fraction bar', 2, rng => {
    const d = rng.int(2, 6), q = rng.int(6, 14), b = rng.int(2, 5), c = rng.int(2, Math.floor((d * q - 1) / b)), a = d * q - b * c, e = rng.int(2, 4), answer = q - e * e;
    return { prompt: `What is the value of the expression below?\n\\[\\frac{${a}+${b}\\times${c}}{${d}}-${e}^2\\]`, answer: num(answer), wrong: [num(q - 2 * e), num(q + e * e), ...ints((a + b) * c / d - e * e), num(answer + d)],
      explanation: `The fraction bar groups the numerator, so simplify it first (multiplication before addition):\n\\[${a}+${b}\\times${c}=${a}+${b * c}=${a + b * c}.\\]\nThen \\(${a + b * c}\\div${d}=${q}\\) and \\(${e}^2=${e * e}\\), so the value is \\(${q}-${e * e}=${answer}\\).` };
  }),
  family('order-negative-square', 'Negative signs and exponents', 3, rng => {
    const a = rng.int(2, 6), b = rng.int(1, 5), c = b + rng.int(2, 5), d = rng.int(2, 5), answer = -a * a + (b - c) ** 2 * d;
    return { prompt: `What is the value of the expression below?\n\\[-${a}^2+(${b}-${c})^2\\times${d}\\]`, answer: num(answer), wrong: [num(a * a + (b - c) ** 2 * d), num(-a * a - (b - c) ** 2 * d), num((-a * a + (b - c) ** 2) * d), num(a * a - (b - c) ** 2 * d)],
      explanation: `\\(-${a}^2\\) means the opposite of \\(${a}^2\\), which is \\(-${a * a}\\) (the exponent applies before the negative sign).\n\\((${b}-${c})^2=(${b - c})^2=${(b - c) ** 2}\\), which is positive.\n\\[-${a * a}+${(b - c) ** 2}\\times${d}=-${a * a}+${(b - c) ** 2 * d}=${answer}.\\]` };
  }),
  family('order-grid', 'Order of operations (student response)', 2, rng => {
    const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 6), e = rng.int(2, 5), d = e * rng.int(2, 6), f = rng.int(1, 12), answer = (a + b) * c - d / e + f;
    return { prompt: `What is the value of the expression below?\n\\[(${a}+${b})\\times${c}-${d}\\div${e}+${f}\\]`, grid: answer,
      explanation: `Parentheses first, then multiplication and division from left to right, then addition and subtraction from left to right:\n\\[(${a + b})\\times${c}-${d}\\div${e}+${f}=${(a + b) * c}-${d / e}+${f}=${answer}.\\]` };
  }),
];

// ---- Exponents, Roots & Scientific Notation ----
/** Standard-form text for (digits/10) × 10^exponent, built from strings so small values never switch to e-notation. */
function standardForm(digits: number, exponent: number) {
  const text = String(digits);
  if (exponent >= 1) return Number(text + '0'.repeat(exponent - 1)).toLocaleString('en-US').replace(/,/g, '{,}');
  if (exponent === 0) return `${text[0]}.${text.slice(1)}`;
  return `0.${'0'.repeat(-exponent - 1)}${text}`;
}
const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29], [9, 40, 41], [15, 20, 25], [10, 24, 26], [12, 35, 37], [15, 36, 39], [18, 24, 30]];
export const exponentsRoots: Family[] = [
  family('exponent-evaluate', 'Evaluating powers', 1, rng => {
    const [a, m] = rng.pick([[2, 5], [2, 6], [3, 3], [3, 4], [4, 3], [5, 3], [2, 7], [6, 2], [7, 2], [10, 3]]), [b, n] = rng.pick([[2, 3], [3, 2], [2, 4], [4, 2], [5, 2], [2, 2], [3, 3]]);
    const big = a ** m, small = b ** n, minus = big > small && rng.bool(), answer = minus ? big - small : big + small;
    return { prompt: `What is the value of \\(${a}^{${m}}${minus ? '-' : '+'}${b}^{${n}}\\)?`, answer: num(answer), wrong: [num(minus ? a * m - b * n : a * m + b * n), num(minus ? big + small : Math.abs(big - small)), num(minus ? big - b * n : big + b * n), num(minus ? a * m + small : a * m - small)],
      explanation: `An exponent tells how many times to use the base as a factor.\n\\(${a}^{${m}}=${Array(m).fill(a).join('\\times')}=${big}\\) and \\(${b}^{${n}}=${Array(n).fill(b).join('\\times')}=${small}\\).\n\\[${big}${minus ? '-' : '+'}${small}=${answer}.\\]\nDo not multiply the base by the exponent.` };
  }),
  family('exponent-rules', 'Combining exponents', 2, rng => {
    const a = rng.int(2, 6), b = rng.int(2, 5), c = rng.int(2, 9), power = rng.bool(), v = rng.pick(['x', 'n', 'p', 'y']);
    if (power) return { prompt: `If \\((${v}^{${a}})^{${b}}\\cdot ${v}^{${c}}=${v}^{k}\\) for all values of \\(${v}\\), what is the value of \\(k\\)?`, answer: num(a * b + c), wrong: [num(a + b + c), num(a * b * c), num((a + b) * c), num(a ** b + c)],
      explanation: `A power raised to a power multiplies the exponents: \\((${v}^{${a}})^{${b}}=${v}^{${a * b}}\\).\nMultiplying powers of the same base adds the exponents: \\(${v}^{${a * b}}\\cdot ${v}^{${c}}=${v}^{${a * b + c}}\\).\nSo \\(k=${a * b + c}\\).` };
    const top = a + b + c;
    return { prompt: `If \\(\\dfrac{${v}^{${top}}\\cdot ${v}^{${b}}}{${v}^{${c}}}=${v}^{k}\\) for all nonzero values of \\(${v}\\), what is the value of \\(k\\)?`, answer: num(top + b - c), wrong: [num(top * b - c), num(top + b + c), num(Math.round(top * b / c)), num(top - b - c)],
      explanation: `Multiplying powers of the same base adds the exponents: \\(${v}^{${top}}\\cdot ${v}^{${b}}=${v}^{${top + b}}\\).\nDividing subtracts the exponents: \\(${v}^{${top + b}}\\div ${v}^{${c}}=${v}^{${top + b - c}}\\).\nSo \\(k=${top + b - c}\\).` };
  }),
  family('root-between-integers', 'Estimating a square root', 2, rng => {
    let n = rng.int(11, 220); while (Number.isInteger(Math.sqrt(n))) n++;
    const f = Math.floor(Math.sqrt(n)), option = (low: number): Choice => ({ text: `${low} and ${low + 1}`, value: low, like: option });
    return { prompt: `Between which two consecutive whole numbers is \\(\\sqrt{${n}}\\)?`, answer: option(f), wrong: [option(f - 1), option(f + 1), option(f + 2), option(f - 2)].filter(choice => choice.value! > 0),
      explanation: `Compare ${n} with nearby perfect squares: \\(${f}^2=${f * f}\\) and \\(${f + 1}^2=${(f + 1) ** 2}\\).\nSince \\(${f * f}<${n}<${(f + 1) ** 2}\\), \\(\\sqrt{${n}}\\) is between ${f} and ${f + 1}.` };
  }),
  family('root-pythagorean-sum', 'Square root of a sum', 2, rng => {
    const [a, b, c] = rng.pick(triples);
    return { prompt: `What is the value of \\(\\sqrt{${a * a}+${b * b}}\\)?`, answer: num(c), wrong: [num(a + b), num((a * a + b * b) / 2), num(c + 2), num(a * b)],
      explanation: `Add inside the square root first: \\(${a * a}+${b * b}=${c * c}\\).\nThen \\(\\sqrt{${c * c}}=${c}\\) because \\(${c}\\times${c}=${c * c}\\).\nTaking each square root separately (\\(${a}+${b}=${a + b}\\)) is not allowed for a sum.` };
  }),
  family('scientific-to-standard', 'Scientific notation to standard form', 2, rng => {
    const digits = rng.pick([12, 15, 18, 24, 27, 32, 36, 45, 48, 52, 56, 63, 72, 75, 84, 91, 96]), exponent = rng.bool() ? -rng.int(2, 5) : rng.int(3, 6);
    const option = (e: number): Choice => ({ text: standardForm(digits, e).replace(/\{,\}/g, ','), math: standardForm(digits, e), value: digits / 10 * 10 ** e });
    return { prompt: `Which number is equal to \\(${digits / 10}\\times10^{${exponent}}\\)?`, answer: option(exponent), wrong: [option(exponent + 1), option(exponent - 1), option(exponent + 2)],
      explanation: `Multiplying by \\(10^{${exponent}}\\) moves the decimal point ${Math.abs(exponent)} places to the ${exponent > 0 ? 'right' : 'left'}.\n\\[${digits / 10}\\times10^{${exponent}}=${standardForm(digits, exponent)}.\\]\nCount the places the decimal point moves, not the number of zeros.` };
  }),
  family('standard-to-scientific', 'Standard form to scientific notation', 2, rng => {
    const digits = rng.pick([12, 15, 18, 24, 27, 32, 36, 45, 48, 52, 56, 63, 72, 75, 84, 91, 96]), exponent = rng.bool() ? -rng.int(2, 5) : rng.int(3, 6);
    const option = (e: number): Choice => tex(`${digits / 10}\\times10^{${e}}`, `${digits / 10} x 10^${e}`);
    return { prompt: `Which expression shows \\(${standardForm(digits, exponent)}\\) written in scientific notation?`, answer: option(exponent), wrong: [option(-exponent), option(exponent + 1), option(exponent - 1)],
      explanation: `Scientific notation uses a number from 1 up to 10 times a power of 10. Place the decimal point after the first nonzero digit to get ${digits / 10}.\nThe decimal point moved ${Math.abs(exponent)} places, and the original number is ${exponent > 0 ? 'greater than 10, so the exponent is positive' : 'less than 1, so the exponent is negative'}:\n\\[${standardForm(digits, exponent)}=${digits / 10}\\times10^{${exponent}}.\\]` };
  }),
  family('scientific-product', 'Multiplying in scientific notation', 3, rng => {
    const [a, b] = rng.pick([[2, 6], [3, 4], [3, 5], [4, 5], [4, 6], [5, 5], [6, 7], [5, 8], [3, 8], [4, 9], [6, 9], [7, 8], [2, 8], [5, 7], [2, 9]]), m = rng.int(2, 7), n = rng.bool() ? rng.int(2, 6) : -rng.int(2, 9), lead = a * b / 10;
    const option = (e: number): Choice => tex(`${lead}\\times10^{${e}}`, `${lead} x 10^${e}`);
    return { prompt: `Which expression is equal to \\((${a}\\times10^{${m}})(${b}\\times10^{${n}})\\) written in scientific notation?`, answer: option(m + n + 1), wrong: [option(m + n), option(m * n), option(m + n - 1), option(m + n + 2)],
      explanation: `Multiply the number parts and add the exponents: \\(${a}\\times${b}=${a * b}\\) and \\(10^{${m}}\\times10^{${n}}=10^{${m + n}}\\), giving \\(${a * b}\\times10^{${m + n}}\\).\nIn scientific notation the first number must be less than 10, so rewrite \\(${a * b}=${lead}\\times10^{1}\\):\n\\[${lead}\\times10^{${m + n + 1}}.\\]` };
  }),
  family('exponent-common-base', 'Equations with a common base', 3, rng => {
    const [base, big, k] = rng.pick([[2, 4, 2], [3, 9, 2], [2, 8, 3], [5, 25, 2], [3, 27, 3], [2, 16, 4]]), b = rng.int(2, 6), a = rng.int(1, k * b - 1), answer = k * b - a;
    return { prompt: `If \\(${base}^{n+${a}}=${big}^{${b}}\\), what is the value of \\(n\\)?`, answer: num(answer), wrong: [num(k * b + a), num(k * b), ...(b - a !== answer ? [num(b - a)] : []), num(b + a), num(answer + 1)],
      explanation: `Write both sides with base ${base}. Since \\(${big}=${base}^{${k}}\\), \\(${big}^{${b}}=(${base}^{${k}})^{${b}}=${base}^{${k * b}}\\).\nEqual powers of the same base have equal exponents:\n\\[n+${a}=${k * b}\\quad\\Rightarrow\\quad n=${answer}.\\]` };
  }),
];

// ---- Units & Conversions ----
export const unitsConversions: Family[] = [
  family('units-compound', 'Converting a two-part measurement', 1, rng => {
    const [big, small, k] = rng.pick([['feet', 'inches', 12], ['hours', 'minutes', 60], ['pounds', 'ounces', 16], ['yards', 'feet', 3], ['minutes', 'seconds', 60], ['gallons', 'quarts', 4]] as const);
    const a = rng.int(2, 9), b = rng.int(1, k - 1), answer = a * k + b, one = big.replace(/s$/, '').replace('fee', 'foo');
    return { prompt: `There are ${k} ${small} in 1 ${one}. How many ${small} are in ${a} ${big} ${b} ${b === 1 ? small.replace(/s$/, '').replace('inche', 'inch').replace('fee', 'foo') : small}?`, answer: num(answer), wrong: [num(a + b), num(a * k), num((a + b) * k), num(a * k - b)],
      explanation: `Convert the ${big} to ${small}, then add the extra ${small}:\n\\[${a}\\times${k}=${a * k}\\qquad ${a * k}+${b}=${answer}.\\]` };
  }),
  family('units-invented-chain', 'Converting through two made-up units', 2, rng => {
    const [x, y, z] = rng.shuffle(['sind', 'lorg', 'dalt', 'plex', 'zarn', 'quib', 'morp', 'tink', 'vosh', 'reld']), p = rng.int(2, 6), q = rng.int(3, 8), k = rng.int(2, 9), down = rng.bool();
    if (down) return { prompt: `In a game, 1 ${x} = ${p} ${y}s and 1 ${y} = ${q} ${z}s. How many ${z}s are equal to ${k} ${x}s?`, answer: num(k * p * q), wrong: [num(k * p), num(k * q), num(k * (p + q)), num(p * q)],
      explanation: `Convert one step at a time. ${k} ${x}s = \\(${k}\\times${p}=${k * p}\\) ${y}s.\nThen ${k * p} ${y}s = \\(${k * p}\\times${q}=${k * p * q}\\) ${z}s.` };
    const total = k * p * q;
    return { prompt: `In a game, 1 ${x} = ${p} ${y}s and 1 ${y} = ${q} ${z}s. How many ${x}s are equal to ${total} ${z}s?`, answer: num(k), wrong: [num(total / q), num(total / p), num(total * p), num(k * 2)],
      explanation: `Work backward one step at a time. ${total} ${z}s = \\(${total}\\div${q}=${total / q}\\) ${y}s.\nThen ${total / q} ${y}s = \\(${total / q}\\div${p}=${k}\\) ${x}s.\n(1 ${x} is worth \\(${p}\\times${q}=${p * q}\\) ${z}s.)` };
  }),
  family('units-speed', 'Converting a speed', 2, rng => {
    const form = rng.int(0, 2);
    if (form === 1) { const metric = rng.pick([18, 36, 54, 72, 90, 108, 126, 144]), result = metric * 5 / 18;
      return { prompt: `A train travels at a constant speed of ${metric} kilometers per hour. What is its speed in meters per second? (1 kilometer = 1,000 meters)`, answer: num(result), wrong: [num(metric * 1000 / 60), num(result * 2), num(metric * 10), num(result + 5)],
        explanation: `Convert kilometers to meters and hours to seconds. One hour is \\(60\\times60=3{,}600\\) seconds.\n\\[\\frac{${metric}\\times1{,}000\\text{ meters}}{3{,}600\\text{ seconds}}=\\frac{${tx(metric * 1000)}}{3{,}600}=${result}\\text{ meters per second}.\\]\nDividing by 60 only once gives meters per minute.` }; }
    if (form === 2) { const feet = rng.pick([22, 44, 66, 88, 110, 132]), result = feet * 15 / 22;
      return { prompt: `A cyclist coasts downhill at a constant speed of ${feet} feet per second. What is this speed in miles per hour? (1 mile = 5,280 feet)`, answer: num(result), wrong: [num(result * 2), num(feet), num(clean(feet * 60 / 5280 * 10)), num(result + 5)],
        explanation: `In one hour (3,600 seconds) the cyclist travels \\(${feet}\\times3{,}600=${tx(feet * 3600)}\\) feet.\nDivide by the number of feet in a mile:\n\\[${tx(feet * 3600)}\\div5{,}280=${result}\\text{ miles per hour}.\\]` }; }
    const speed = rng.pick([15, 30, 45, 60, 75, 90]), answer = speed * 22 / 15;
    return { prompt: `A car travels at a constant speed of ${speed} miles per hour. What is its speed in feet per second? (1 mile = 5,280 feet)`, answer: num(answer), wrong: [num(speed * 88), num(answer * 2), num(answer / 2)],
      explanation: `Convert miles to feet and hours to seconds. One hour is \\(60\\times60=3{,}600\\) seconds.\n\\[\\frac{${speed}\\times5{,}280\\text{ feet}}{3{,}600\\text{ seconds}}=\\frac{${tx(speed * 5280)}}{3{,}600}=${answer}\\text{ feet per second}.\\]\nDividing by 60 only once gives feet per minute.` };
  }),
  family('units-area', 'Converting units of area', 3, rng => {
    if (rng.bool()) {
      const a = rng.int(2, 9), b = rng.int(2, 9);
      return { prompt: `A rectangular room is ${a} yards long and ${b} yards wide. What is the area of the room in square feet? (1 yard = 3 feet)`, answer: num(9 * a * b), wrong: [num(3 * a * b), num(a * b), num(6 * a * b), num(3 * (a + b))],
        explanation: `Convert each side to feet before multiplying: \\(${a}\\times3=${3 * a}\\) feet and \\(${b}\\times3=${3 * b}\\) feet.\n\\[${3 * a}\\times${3 * b}=${9 * a * b}\\text{ square feet}.\\]\nOne square yard is \\(3\\times3=9\\) square feet, not 3.` };
    }
    const n = rng.int(2, 9);
    return { prompt: `How many square inches are in ${n} square feet? (1 foot = 12 inches)`, answer: num(144 * n), wrong: [num(12 * n), num(24 * n), num(48 * n), num(144 + n)],
      explanation: `A square foot is 12 inches by 12 inches, so it contains \\(12\\times12=144\\) square inches.\n\\[${n}\\times144=${144 * n}.\\]` };
  }),
  family('units-elapsed-time', 'Adding elapsed time', 2, rng => {
    const hour = rng.int(1, 6), minute = rng.pick([15, 20, 25, 35, 40, 45, 50, 55]), h = rng.int(1, 3), m = rng.pick([15, 20, 25, 30, 35, 40, 45, 50, 55].filter(value => value + minute >= 60 && (value + minute) % 60 !== 0));
    const end = hour * 60 + minute + h * 60 + m, clock = (total: number) => `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')} p.m.`;
    const option = (total: number): Choice => ({ text: clock(total), value: total });
    const story = rng.pick(['A movie starts', 'A train leaves', 'A soccer practice begins', 'A concert starts']);
    return { prompt: `${story} at ${clock(hour * 60 + minute)} and lasts ${h} ${plural(h, 'hour')} ${m} minutes. At what time does it end?`, answer: option(end), wrong: [option(end - 60), option(end + 60), option(end + rng.pick([10, 20, -10, -20]))],
      explanation: `Add the hours, then the minutes: ${hour}:${String(minute).padStart(2, '0')} plus ${h} ${plural(h, 'hour')} is ${hour + h}:${String(minute).padStart(2, '0')}.\n${minute} minutes + ${m} minutes = ${minute + m} minutes, which is 1 hour ${minute + m - 60} minutes.\nSo the end time is ${clock(end)}. Remember that 60 minutes, not 100, make an hour.` };
  }),
  family('units-money-rate', 'Converting with an exchange rate', 2, rng => {
    const rate = rng.pick([4, 5, 6, 8, 12, 15, 20]), dollarsHad = rng.int(3, 15) * 5, cost = rate * rng.int(4, Math.floor(dollarsHad * 0.8)), unitName = rng.pick(['pesos', 'kroner', 'rupees', 'francs']), name = rng.pick(names);
    return { prompt: `${name} exchanges $${dollarsHad} for ${unitName} at a rate of ${rate} ${unitName} per dollar and then spends ${fmt(cost)} ${unitName}. How many dollars is the remaining money worth?`, answer: money(dollarsHad - cost / rate), wrong: [money(dollarsHad * rate - cost), money(cost / rate), money(dollarsHad)],
      explanation: `Convert the amount spent back to dollars: \\(${tx(cost)}\\div${rate}=${cost / rate}\\) dollars.\n\\[\\$${dollarsHad}-\\$${cost / rate}=\\$${dollarsHad - cost / rate}.\\]\n(Or: ${name} had \\(${dollarsHad}\\times${rate}=${tx(dollarsHad * rate)}\\) ${unitName}, has ${fmt(dollarsHad * rate - cost)} left, and \\(${tx(dollarsHad * rate - cost)}\\div${rate}=${dollarsHad - cost / rate}\\).)` };
  }),
];
