import { clean, deg, family, fmt, frac, fracTex, money, names, num, pct, plural, table, tx, type Family } from './kit';

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const tableStories = [
  { label: 'Books read', count: 'Number of students', thing: 'books', who: 'students', verb: 'read' },
  { label: 'Goals scored', count: 'Number of games', thing: 'goals', who: 'games', verb: 'had' },
  { label: 'Pets owned', count: 'Number of families', thing: 'pets', who: 'families', verb: 'own' },
  { label: 'Siblings', count: 'Number of students', thing: 'siblings', who: 'students', verb: 'have' },
] as const;

// ---- Data Displays & Sampling ----
export const dataDisplays: Family[] = [
  family('data-frequency-threshold', 'Reading a frequency table', 1, rng => {
    const s = rng.pick(tableStories), counts = Array.from({ length: 6 }, () => rng.int(1, 9)), t = rng.int(2, 4), mode = rng.pick(['at least', 'more than', 'fewer than'] as const);
    const total = sum(counts), atLeast = sum(counts.slice(t)), moreThan = sum(counts.slice(t + 1)), fewerThan = sum(counts.slice(0, t)), atMost = sum(counts.slice(0, t + 1));
    const answer = mode === 'at least' ? atLeast : mode === 'more than' ? moreThan : fewerThan;
    const wrong = mode === 'at least' ? [moreThan, fewerThan, counts[t], total] : mode === 'more than' ? [atLeast, atMost, counts[t + 1], total] : [atMost, atLeast, counts[t - 1], total];
    const rows = mode === 'fewer than' ? counts.slice(0, t) : mode === 'at least' ? counts.slice(t) : counts.slice(t + 1);
    return { prompt: `${table([s.label, s.count], counts.map((count, value) => [value, count]))}\n\nThe table shows the results of a survey. How many ${s.who} ${s.verb} ${mode} ${t} ${s.thing}?`, answer: num(answer), wrong: wrong.map(num),
      explanation: `"${mode[0].toUpperCase()}${mode.slice(1)} ${t}" means ${mode === 'at least' ? `${t} or more, so include the row for ${t}` : mode === 'more than' ? `${t + 1} or more, so do not include the row for ${t}` : `${t - 1} or fewer, so do not include the row for ${t}`}.\n${rows.length === 1 ? `Only one row qualifies, so the answer is ${answer}.` : `Add those rows: \\(${rows.join('+')}=${answer}\\).`}` };
  }),
  family('data-frequency-total', 'Totals from a frequency table', 2, rng => {
    const s = rng.pick(tableStories), counts = Array.from({ length: 5 }, () => rng.int(1, 8)), weighted = sum(counts.map((count, value) => count * value)), total = sum(counts);
    return { prompt: `${table([s.label, s.count], counts.map((count, value) => [value, count]))}\n\nThe table shows the results of a survey. What is the total number of ${s.thing} for all of the ${s.who} in the survey?`, answer: num(weighted), wrong: [num(total), num(10 + total), num(weighted + total), num(weighted + counts[0])],
      explanation: `Each row stands for several ${s.who}. Multiply each number of ${s.thing} by how many ${s.who} had that number, then add:\n\\[${counts.map((count, value) => `${value}\\times${count}`).join('+')}=${weighted}.\\]\nAdding only the right column (${total}) counts the ${s.who}, not the ${s.thing}.` };
  }),
  family('data-frequency-mean', 'Mean from a frequency table', 3, rng => {
    // Aim for a mean of 2, 3 or 4 equally often, so the answer cannot be guessed from the middle of the scale.
    const want = rng.pick([2, 3, 4]); let counts = want === 2 ? [6, 3, 1, 1, 1] : want === 4 ? [1, 1, 1, 3, 6] : [1, 2, 4, 2, 1];
    for (let tries = 0; tries < 400; tries++) { const peak = want === 2 ? rng.int(0, 1) : want === 4 ? rng.int(3, 4) : rng.int(1, 3), next = Array.from({ length: 5 }, (_, i) => rng.int(1, 4) + (i === peak ? rng.int(3, 9) : 0)); if (sum(next.map((count, i) => count * (i + 1))) === want * sum(next) && !(next[0] === next[4] && next[1] === next[3])) { counts = next; break; } }
    const total = sum(counts), weighted = sum(counts.map((count, i) => count * (i + 1))), mean = weighted / total;
    // Four evenly spaced ratings on the 1-to-5 scale, with the answer equally likely in any position.
    const options = rng.shuffle([0, 1, 2, 3].flatMap(rank => [0.5, 1].map(step => [0, 1, 2, 3].map(i => mean + (i - rank) * step)))).find(values => values.every(value => value >= 1 && value <= 5))!;
    return { prompt: `${table(['Rating', 'Number of customers'], counts.map((count, i) => [i + 1, count]))}\n\nCustomers rated a restaurant from 1 to 5, as shown in the table. What is the mean (average) rating?`, answer: num(mean), wrong: options.filter(value => value !== mean).map(num),
      explanation: `Multiply each rating by the number of customers who gave it, add, and divide by the number of customers.\nTotal of all ratings: \\(${counts.map((count, i) => `${i + 1}\\times${count}`).join('+')}=${weighted}\\).\nNumber of customers: \\(${counts.join('+')}=${total}\\).\n\\[${weighted}\\div${total}=${mean}.\\]` };
  }),
  family('data-circle-graph', 'Circle graphs', 2, rng => {
    if (rng.bool()) { const angle = rng.pick([36, 45, 54, 60, 72, 90, 108, 120, 135, 144]), budget = 360 * rng.int(2, 10), amount = budget * angle / 360, part = rng.pick(['rent', 'food', 'transportation', 'savings']);
      return { prompt: `A family's monthly budget of $${fmt(budget)} is shown in a circle graph. The sector for ${part} has a central angle of \\(${angle}^\\circ\\). How much money is budgeted for ${part} each month?`, answer: money(amount), wrong: [money(budget * angle / 100), money(budget * angle / 180), money(budget - amount), money(amount / 2)],
        explanation: `A full circle is \\(360^\\circ\\), so the sector is \\(\\frac{${angle}}{360}=${fracTex(angle, 360)}\\) of the budget.\n\\[${fracTex(angle, 360)}\\times${tx(budget)}=${tx(amount)}.\\]` }; }
    const p = rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45]), answer = clean(3.6 * p);
    return { prompt: `In a circle graph, one sector represents ${p}% of the data. What is the measure of the central angle of that sector?`, answer: deg(answer), wrong: [deg(p), deg(clean(1.8 * p)), deg(360 - answer), deg(3 * p)],
      explanation: `The whole circle is \\(360^\\circ\\). Take ${p}% of it:\n\\[${p / 100}\\times360^\\circ=${tx(answer)}^\\circ.\\]` };
  }),
  family('data-two-way-table', 'Percents from a two-way table', 2, rng => {
    let rowTotal = 40, p = 30;
    for (let tries = 0; tries < 40; tries++) { rowTotal = rng.pick([20, 25, 40, 50]); p = rng.pick([20, 24, 30, 36, 40, 60, 64, 70, 80]); if (rowTotal * p % 100 === 0) break; rowTotal = 40; p = 30; }
    const walk8 = rowTotal * p / 100, bus8 = rowTotal - walk8, bus7 = rng.int(8, 30); let walk7 = rng.int(8, 30); if (walk7 === walk8) walk7++;
    const grand = bus7 + walk7 + rowTotal;
    return { prompt: `${table(['Grade', 'Bus', 'Walk', 'Total'], [['Grade 7', bus7, walk7, bus7 + walk7], ['Grade 8', bus8, walk8, rowTotal]])}\n\nThe table shows how the students in two grades get to school. What percent of the Grade 8 students walk to school?`, answer: pct(p), wrong: [pct(Math.round(walk8 / grand * 100)), pct(Math.round(walk8 / (walk7 + walk8) * 100)), pct(walk8), pct(100 - p)],
      explanation: `The question is only about Grade 8, so use the Grade 8 row: ${walk8} of the ${rowTotal} Grade 8 students walk.\n\\[\\frac{${walk8}}{${rowTotal}}=${walk8 / rowTotal}=${p}\\%.\\]\nDividing by all ${grand} students, or by all ${walk7 + walk8} walkers, answers a different question.` };
  }),
  family('data-sample-estimate', 'Estimating from a random sample', 2, rng => {
    const n = rng.pick([20, 25, 40, 50]), k = rng.int(3, n - 8), m = rng.int(6, 30), population = n * m, thing = rng.pick(['pizza for lunch', 'soccer over basketball', 'reading fiction', 'morning classes']);
    return { prompt: `In a random sample of ${n} students at a school, ${k} said they prefer ${thing}. The school has ${fmt(population)} students. Based on the sample, what is the best estimate of the number of students at the school who prefer ${thing}?`, answer: num(k * m), wrong: [num(k), num(population - k * m), num(m), num(k * m + k)],
      explanation: `The sample suggests that \\(\\frac{${k}}{${n}}\\) of all students have this preference. Apply that fraction to the whole school:\n\\[\\frac{${k}}{${n}}\\times${tx(population)}=${k}\\times${m}=${tx(k * m)}.\\]\n(The school is ${m} times as large as the sample.)` };
  }),
  family('data-frequency-median', 'Median from a frequency table', 3, rng => {
    const counts = Array.from({ length: 5 }, () => rng.int(1, 7)); if (sum(counts) % 2 === 0) counts[rng.int(0, 4)]++;
    const total = sum(counts), middle = (total + 1) / 2; let running = 0, median = 1; for (let i = 0; i < 5; i++) { running += counts[i]; if (running >= middle) { median = i + 1; break; } }
    const mode = counts.indexOf(Math.max(...counts)) + 1, cumulative = counts.map((_, i) => sum(counts.slice(0, i + 1)));
    return { prompt: `${table(['Quiz score', 'Number of students'], counts.map((count, i) => [i + 1, count]))}\n\nThe table shows the scores of ${total} students on a 5-point quiz. What is the median score?`, answer: num(median), wrong: [...(mode !== median ? [mode] : []), ...rng.shuffle([1, 2, 3, 4, 5].filter(value => value !== median && value !== mode))].map(num),
      explanation: `With ${total} scores in order, the median is the \\(\\frac{${total}+1}{2}=${middle}\\)th score.\nCount through the table: ${cumulative.map((value, i) => `scores of ${i + 1} or lower: ${value}`).join('; ')}.\nThe ${middle}th score falls in the row for a score of ${median}.` };
  }),
];

// ---- Averages & Spread ----
export const averagesSpread: Family[] = [
  family('mean-list', 'Mean of a list', 1, rng => {
    const mean = rng.int(70, 88); let deviations = [-6, -2, 0, 3, 5];
    for (let tries = 0; tries < 40; tries++) { const next = Array.from({ length: 4 }, () => rng.int(-9, 9)), last = -sum(next); if (Math.abs(last) <= 12 && new Set([...next, last]).size === 5) { deviations = rng.shuffle([...next, last]); break; } }
    const scores = deviations.map(value => mean + value), sorted = [...scores].sort((a, b) => a - b), name = rng.pick(names);
    return { prompt: `${name}'s scores on five quizzes were ${scores.slice(0, 4).join(', ')}, and ${scores[4]}. What is the mean (average) of the five scores?`, answer: num(mean), wrong: [num(sorted[2]), num(sorted[4] - sorted[0]), num(Math.round(sum(scores) / 4)), num(mean + 2)],
      explanation: `Add the scores and divide by how many there are:\n\\[\\frac{${scores.join('+')}}{5}=\\frac{${sum(scores)}}{5}=${mean}.\\]\n(${sorted[2]} is the median, the middle score when they are in order.)` };
  }),
  family('mean-missing-score', 'Score needed for a target mean', 2, rng => {
    const target = rng.int(80, 92); let deviations = [-4, 3, -6, 2];
    for (let tries = 0; tries < 40; tries++) { const next = Array.from({ length: 4 }, () => rng.int(-10, 8)), total = sum(next); if (total !== 0 && target - total <= 100 && target - total >= 60) { deviations = next; break; } }
    const scores = deviations.map(value => target + value), needed = 5 * target - sum(scores), name = rng.pick(names);
    return { prompt: `${name} scored ${scores.slice(0, 3).join(', ')}, and ${scores[3]} on the first four tests. What score does ${name} need on the fifth test for the mean (average) of all five tests to be exactly ${target}?`, answer: num(needed), wrong: [num(target), num(Math.round(sum(scores) / 4)), num(needed - 5), num(needed + 4)],
      explanation: `For a mean of ${target} on five tests, the total must be \\(5\\times${target}=${5 * target}\\).\nThe first four tests total \\(${scores.join('+')}=${sum(scores)}\\).\n\\[${5 * target}-${sum(scores)}=${needed}.\\]` };
  }),
  family('median-even-list', 'Median of an even number of values', 2, rng => {
    const values = new Set<number>(); while (values.size < 6) values.add(rng.int(3, 40));
    const listed = rng.shuffle([...values]), sorted = [...listed].sort((a, b) => a - b), median = (sorted[2] + sorted[3]) / 2;
    return { prompt: `What is the median of the data set below?\n\\[${listed.join(',\\ ')}\\]`, answer: num(median), wrong: [num((listed[2] + listed[3]) / 2), num(sorted[2]), num(sorted[3]), num(Math.round(sum(listed) / 6 * 10) / 10)],
      explanation: `Put the values in order first: ${sorted.join(', ')}.\nThere are 6 values, so the median is the mean of the two middle values (the 3rd and 4th):\n\\[\\frac{${sorted[2]}+${sorted[3]}}{2}=${median}.\\]` };
  }),
  family('mean-consecutive', 'Mean of evenly spaced integers', 2, rng => {
    const count = rng.pick([5, 7]), step = rng.pick([1, 2]), kind = step === 1 ? 'consecutive integers' : rng.bool() ? 'consecutive even integers' : 'consecutive odd integers';
    const middle = kind.includes('even') ? 2 * rng.int(8, 40) : kind.includes('odd') ? 2 * rng.int(8, 40) + 1 : rng.int(12, 80), greatest = middle + step * (count - 1) / 2;
    return { prompt: `The mean (average) of ${count} ${kind} is ${middle}. What is the greatest of these integers?`, answer: num(greatest), wrong: [num(middle), num(middle + (step === 1 ? count - 1 : (count - 1) / 2)), num(middle + count), num(greatest + step)],
      explanation: `For evenly spaced numbers, the mean is the middle number. So the ${count} integers are centered at ${middle}: ${Array.from({ length: count }, (_, i) => middle + step * (i - (count - 1) / 2)).join(', ')}.\nThe greatest is ${greatest}.` };
  }),
  family('mean-change', 'How one value changes the mean', 3, rng => {
    const n = rng.int(5, 9), mean = rng.int(12, 40), shift = rng.int(1, 3) * (rng.bool() ? 1 : -1), next = mean + shift;
    if (rng.bool()) { const removed = n * mean - (n - 1) * next;
      return { prompt: `The mean (average) of ${n} numbers is ${mean}. When one of the numbers is removed, the mean of the remaining ${n - 1} numbers is ${next}. What number was removed?`, answer: num(removed), wrong: [num(mean), num(next), num(Math.abs(n * shift)), num(removed + n)],
        explanation: `Work with totals. The ${n} numbers total \\(${n}\\times${mean}=${n * mean}\\). The remaining ${n - 1} numbers total \\(${n - 1}\\times${next}=${(n - 1) * next}\\).\n\\[${n * mean}-${(n - 1) * next}=${removed}.\\]` }; }
    const added = (n + 1) * next - n * mean;
    return { prompt: `The mean (average) of ${n} numbers is ${mean}. When one more number is included, the mean of the ${n + 1} numbers is ${next}. What number was included?`, answer: num(added), wrong: [num(mean), num(next), num(Math.abs((n + 1) * shift)), num(added + n)],
      explanation: `Work with totals. The ${n} numbers total \\(${n}\\times${mean}=${n * mean}\\). The ${n + 1} numbers total \\(${n + 1}\\times${next}=${(n + 1) * next}\\).\n\\[${(n + 1) * next}-${n * mean}=${added}.\\]` };
  }),
  family('mean-combined', 'Mean of two combined groups', 3, rng => {
    let n1 = 10, m1 = 80, n2 = 30, m2 = 88;
    for (let tries = 0; tries < 120; tries++) { const a = rng.int(8, 30), b = rng.int(8, 30), x = rng.int(68, 94), y = rng.int(68, 94); if (a !== b && Math.abs(x - y) >= 3 && (a * x + b * y) % (a + b) === 0) { n1 = a; n2 = b; m1 = x; m2 = y; break; } }
    const mean = (n1 * m1 + n2 * m2) / (n1 + n2);
    return { prompt: `In one class, ${n1} students have a mean test score of ${m1}. In another class, ${n2} students have a mean test score of ${m2}. What is the mean test score of all ${n1 + n2} students?`, answer: num(mean), wrong: [num((m1 + m2) / 2), num(m1), num(m2), num(mean + 1)],
      explanation: `Combine totals, not means. Class totals: \\(${n1}\\times${m1}=${tx(n1 * m1)}\\) and \\(${n2}\\times${m2}=${tx(n2 * m2)}\\).\n\\[\\frac{${tx(n1 * m1)}+${tx(n2 * m2)}}{${n1 + n2}}=\\frac{${tx(n1 * m1 + n2 * m2)}}{${n1 + n2}}=${mean}.\\]\nThe result is closer to ${n1 > n2 ? m1 : m2} because that class has more students.` };
  }),
];

// ---- Counting & Sets (in addition to the existing combinatorics and overlapping-groups generators) ----
const clubStories = [['play soccer', 'play basketball', 'sport'], ['take art', 'take music', 'class'], ['own a cat', 'own a dog', 'kind of pet'], ['speak Spanish', 'speak French', 'language']] as const;
export const countingSets: Family[] = [
  family('sets-neither', 'Two overlapping groups: neither', 1, rng => {
    const both = rng.int(2, 8), onlyA = rng.int(3, 12), onlyB = rng.int(3, 12), neither = rng.int(1, 9), a = onlyA + both, b = onlyB + both, total = onlyA + onlyB + both + neither, s = rng.pick(clubStories);
    return { prompt: `In a group of ${total} students, ${a} ${s[0]}, ${b} ${s[1]}, and ${both} do both. How many of the students do neither?`, answer: num(neither), wrong: [num(Math.abs(total - a - b)), num(a + b - both), num(neither + both), num(total - both)],
      explanation: `Students who do both are counted in each group, so subtract them once to find how many do at least one:\n\\[${a}+${b}-${both}=${a + b - both}.\\]\nThe rest do neither: \\(${total}-${a + b - both}=${neither}\\).` };
  }),
  family('sets-exactly-one', 'Two overlapping groups: exactly one', 2, rng => {
    const both = rng.int(2, 9), onlyA = rng.int(3, 14), onlyB = rng.int(3, 14), a = onlyA + both, b = onlyB + both, s = rng.pick(clubStories);
    return { prompt: `In a survey, ${a} students said they ${s[0]} and ${b} students said they ${s[1]}. Of these students, ${both} said they do both. How many of the students do exactly one of the two?`, answer: num(onlyA + onlyB), wrong: [num(a + b - both), num(a + b), num(Math.abs(a - b) || both + 1), num(a + b - 3 * both > 0 ? a + b - 3 * both : onlyA)],
      explanation: `Remove the students who do both from each group.\nOnly the first: \\(${a}-${both}=${onlyA}\\). Only the second: \\(${b}-${both}=${onlyB}\\).\n\\[${onlyA}+${onlyB}=${onlyA + onlyB}.\\]\nThe ${both} students who do both must be removed from both groups, so they are subtracted twice.` };
  }),
];

// ---- Probability (in addition to the existing probability generators) ----
export const probability: Family[] = [
  family('probability-simple', 'Probability of a single draw', 1, rng => {
    const counts = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)], colors = rng.shuffle(['red', 'blue', 'green', 'yellow', 'white']).slice(0, 3), total = sum(counts), i = rng.int(0, 2);
    return { prompt: `A bag contains ${counts[0]} ${colors[0]} marbles, ${counts[1]} ${colors[1]} marbles, and ${counts[2]} ${colors[2]} marbles. One marble is drawn at random. What is the probability that it is ${colors[i]}?`, answer: frac(counts[i], total), wrong: [frac(counts[i], total - counts[i]), frac(1, 3), frac(total - counts[i], total), frac(1, counts[i])],
      explanation: `Probability is favorable outcomes over total outcomes. There are \\(${counts.join('+')}=${total}\\) marbles, and ${counts[i]} are ${colors[i]}:\n\\[\\frac{${counts[i]}}{${total}}${frac(counts[i], total).text === `${counts[i]}/${total}` ? '' : `=${fracTex(counts[i], total)}`}.\\]\nCompare with the total, not with the other marbles.` };
  }),
  family('probability-complement', 'Probability that an event does not happen', 2, rng => {
    const counts = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)], colors = rng.shuffle(['red', 'blue', 'green', 'yellow', 'white']).slice(0, 3), total = sum(counts), i = rng.int(0, 2), rest = total - counts[i];
    return { prompt: `A jar contains ${counts[0]} ${colors[0]} buttons, ${counts[1]} ${colors[1]} buttons, and ${counts[2]} ${colors[2]} buttons. One button is chosen at random. What is the probability that it is NOT ${colors[i]}?`, answer: frac(rest, total), wrong: [frac(counts[i], total), frac(rest, counts[i] + total), frac(counts[i], rest), frac(2, 3)],
      explanation: `There are ${total} buttons, and \\(${total}-${counts[i]}=${rest}\\) of them are not ${colors[i]}:\n\\[\\frac{${rest}}{${total}}${frac(rest, total).text === `${rest}/${total}` ? '' : `=${fracTex(rest, total)}`}.\\]\n(Or subtract from 1: \\(1-${fracTex(counts[i], total)}\\).)` };
  }),
  family('probability-number-property', 'Probability with number properties', 2, rng => {
    const n = rng.pick([10, 12, 15, 16, 18, 20, 24, 25, 30]), kind = rng.int(0, 2), m = rng.pick([3, 4, 5, 6]), k = rng.int(Math.floor(n / 2), n - 3);
    const test = kind === 0 ? (value: number) => value % m === 0 : kind === 1 ? isPrime : (value: number) => value > k;
    const label = kind === 0 ? `a multiple of ${m}` : kind === 1 ? 'a prime number' : `greater than ${k}`, matches = Array.from({ length: n }, (_, i) => i + 1).filter(test), count = matches.length;
    return { prompt: `Cards numbered 1 through ${n} are placed in a box, one number on each card. One card is drawn at random. What is the probability that the number on the card is ${label}?`, answer: frac(count, n), wrong: [frac(count + 1, n), frac(Math.max(1, count - 1), n), frac(n - count, n), kind === 0 ? frac(1, m) : frac(count, n + 1)],
      explanation: `List the numbers from 1 to ${n} that are ${kind === 0 ? `multiples of ${m}` : kind === 1 ? 'prime' : label}: ${matches.join(', ')}. That is ${count} ${plural(count, 'number')}.\n\\[\\frac{${count}}{${n}}${frac(count, n).text === `${count}/${n}` ? '' : `=${fracTex(count, n)}`}.\\]${kind === 1 ? '\nRemember that 1 is not prime and 2 is prime.' : ''}` };
  }),
  family('probability-add-marbles', 'Changing a probability', 3, rng => {
    const [p, q] = rng.pick([[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]]), m = rng.int(2, 6), finalRed = p * m, finalTotal = q * m, blue = finalTotal - finalRed, added = rng.int(1, finalRed - 1), red = finalRed - added;
    return { prompt: `A bag contains ${red} red ${plural(red, 'marble')} and ${blue} blue ${plural(blue, 'marble')}. How many red marbles must be added to the bag so that the probability of randomly drawing a red marble is \\(\\frac{${p}}{${q}}\\)?`, answer: num(added), wrong: [num(finalRed), num(Math.abs(blue - red) || added + 2), num(finalTotal), num(added + q)],
      explanation: `Adding red marbles does not change the ${blue} blue ${plural(blue, 'marble')}. If \\(\\frac{${p}}{${q}}\\) of the marbles are red, then \\(\\frac{${q - p}}{${q}}\\) are blue.\nSo \\(\\frac{${q - p}}{${q}}\\) of the new total is ${blue}, which makes the new total \\(${blue}\\times${fracTex(q, q - p)}=${finalTotal}\\) and the number of red marbles \\(${finalTotal}-${blue}=${finalRed}\\).\n\\[${finalRed}-${red}=${added}.\\]\nCheck: \\(\\frac{${finalRed}}{${finalTotal}}=\\frac{${p}}{${q}}\\).` };
  }),
];
