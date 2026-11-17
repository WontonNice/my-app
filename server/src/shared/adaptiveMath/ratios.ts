import { clean, dollars, family, fmt, money, names, num, pct, plural, ratio, tx, type Family } from './kit';

// ---- Ratios & Proportions ----
const twoGroups = [
  { x: 'boys', y: 'girls', group: 'a club', members: 'members' }, { x: 'red marbles', y: 'blue marbles', group: 'a jar', members: 'marbles' },
  { x: 'cats', y: 'dogs', group: 'an animal shelter', members: 'animals' }, { x: 'fiction books', y: 'nonfiction books', group: 'a bookcase', members: 'books' },
  { x: 'sedans', y: 'trucks', group: 'a parking lot', members: 'vehicles' }, { x: 'sixth graders', y: 'seventh graders', group: 'a chess club', members: 'students' },
] as const;
export const ratiosProportions: Family[] = [
  family('ratio-part-of-total', 'Sharing a total in a ratio', 1, rng => {
    const [a, b] = rng.pick([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [5, 6], [3, 7], [2, 7], [5, 7], [1, 4], [5, 8], [3, 8]]), k = rng.int(2, 9), total = k * (a + b), s = rng.pick(twoGroups), second = rng.bool();
    const parts = second ? b : a, other = second ? a : b, answer = k * parts;
    return { prompt: `The ratio of ${s.x} to ${s.y} in ${s.group} is ${a}:${b}. There are ${total} ${s.members} in all. How many ${second ? s.y : s.x} are there?`, answer: num(answer), wrong: [num(k * other), num(k), num(total - parts), num(Math.round(total * parts / other))],
      explanation: `The ratio ${a}:${b} splits the total into \\(${a}+${b}=${a + b}\\) equal parts. Each part is \\(${total}\\div${a + b}=${k}\\).\nThe ${second ? s.y : s.x} make up ${parts} ${plural(parts, 'part')}: \\(${parts}\\times${k}=${answer}\\).` };
  }),
  family('ratio-difference', 'Ratio with a known difference', 2, rng => {
    const [a, b] = rng.pick([[2, 3], [3, 5], [2, 5], [3, 7], [4, 7], [1, 3], [3, 8], [5, 8], [2, 7], [4, 9], [5, 9], [1, 4]]), k = rng.int(2, 9), difference = k * (b - a), s = rng.pick(twoGroups);
    return { prompt: `The ratio of ${s.x} to ${s.y} in ${s.group} is ${a}:${b}. There are ${difference} more ${s.y} than ${s.x}. How many ${s.members} are there in all?`, answer: num(k * (a + b)), wrong: [num(k * b), num(difference * (a + b)), num(k * a), num(difference * b)],
      explanation: `The ${s.y} have \\(${b}-${a}=${b - a}\\) more ${plural(b - a, 'part')} than the ${s.x}, and that difference is ${difference}. So one part is \\(${difference}\\div${b - a}=${k}\\).\nThere are \\(${a}+${b}=${a + b}\\) parts in all: \\(${a + b}\\times${k}=${k * (a + b)}\\).` };
  }),
  family('ratio-proportion', 'Solving a proportion', 2, rng => {
    const b = rng.pick([4, 6, 8, 10, 12]), m = rng.pick([3, 5, 7]), c = b * m / 2, a = rng.pick([2, 6, 10, 14, 18].filter(value => value !== b)), answer = a * m / 2, name = rng.pick(names);
    const story = rng.pick([
      `A machine fills ${a} bottles every ${b} seconds. At this rate, how many bottles does it fill in ${c} seconds?`,
      `A recipe uses ${a} cups of flour for every ${b} cups of milk. How many cups of flour are needed for ${c} cups of milk?`,
      `${name} reads ${a} pages every ${b} minutes. At this rate, how many pages does ${name} read in ${c} minutes?`,
    ]);
    return { prompt: story, answer: num(answer), wrong: [num(a + c - b), num(a * m), num(Math.abs(c - a) || a + 1), num(answer + b)],
      explanation: `Set up a proportion with matching units:\n\\[\\frac{${a}}{${b}}=\\frac{x}{${c}}\\quad\\Rightarrow\\quad x=\\frac{${a}\\times${c}}{${b}}=${answer}.\\]\nThe amounts are multiplied by the same factor (\\(${c}\\div${b}=${m / 2}\\)); adding the same amount to both does not keep the rate.` };
  }),
  family('ratio-combined', 'Linking two ratios', 3, rng => {
    const [a, b] = rng.pick([[2, 3], [3, 4], [1, 2], [3, 5], [4, 5], [2, 5], [5, 6]]), [c, d] = rng.pick([[2, 3], [3, 4], [1, 2], [3, 5], [4, 3], [5, 2], [3, 2], [2, 7], [4, 7]].filter(pair => pair[0] !== b));
    const [x, y, z] = rng.pick([['apples', 'pears', 'plums'], ['pens', 'pencils', 'markers'], ['roses', 'tulips', 'lilies'], ['nickels', 'dimes', 'quarters']]), answer = ratio(a * c, b * d);
    return { prompt: `In a collection, the ratio of ${x} to ${y} is ${a}:${b}, and the ratio of ${y} to ${z} is ${c}:${d}. What is the ratio of ${x} to ${z}?`, answer, wrong: [ratio(a, d), ratio(a * d, b * c), ratio(a + c, b + d), ratio(b * d, a * c)],
      explanation: `Make the number of ${y} match in both ratios. Multiply the first ratio by ${c} and the second by ${b}:\n${x} : ${y} = ${a * c}:${b * c} and ${y} : ${z} = ${b * c}:${b * d}.\nSo ${x} : ${z} = ${a * c}:${b * d}${answer.text !== `${a * c}:${b * d}` ? `, which simplifies to ${answer.text}` : ''}.` };
  }),
  family('ratio-three-part', 'Three-part ratios', 3, rng => {
    const [a, b, c] = rng.pick([[1, 2, 3], [2, 3, 5], [1, 3, 4], [2, 3, 4], [3, 4, 5], [1, 2, 5], [2, 5, 7], [1, 4, 5], [3, 5, 7], [2, 4, 5], [1, 3, 6], [2, 3, 7]]), k = rng.int(2, 9), total = k * (a + b + c);
    const story = rng.pick([{ mix: 'A paint mixture uses red, yellow, and blue paint', made: `A painter makes ${total} liters of the mixture`, unitName: 'liters', first: 'red paint', last: 'blue paint' }, { mix: 'A trail mix uses raisins, peanuts, and almonds', made: `A batch weighs ${total} ounces`, unitName: 'ounces', first: 'raisins', last: 'almonds' }, { mix: 'Three friends, Ana, Ben, and Cal, share prize money', made: `The prize is $${total}`, unitName: 'dollars', first: 'Ana', last: 'Cal' }]);
    const people = story.unitName === 'dollars';
    return { prompt: `${story.mix} in the ratio ${a}:${b}:${c}. ${story.made}. ${people ? `How many more dollars does ${story.last} receive than ${story.first}?` : `How many more ${story.unitName} of ${story.last} than ${story.first} are used?`}`, answer: num(k * (c - a)), wrong: [num(k * c), num(k * a), num(c - a), num(k * b)],
      explanation: `There are \\(${a}+${b}+${c}=${a + b + c}\\) parts in all, so each part is \\(${total}\\div${a + b + c}=${k}\\).\n${story.last}: \\(${c}\\times${k}=${c * k}\\). ${story.first}: \\(${a}\\times${k}=${a * k}\\).\nThe difference is \\(${c * k}-${a * k}=${k * (c - a)}\\).` };
  }),
];

// ---- Rates & Unit Rates ----
const hoursMinutes = (minutes: number) => minutes % 60 === 0 ? `${minutes / 60} ${plural(minutes / 60, 'hour')}` : minutes < 60 ? `${minutes} minutes` : `${Math.floor(minutes / 60)} ${plural(Math.floor(minutes / 60), 'hour')} ${minutes % 60} minutes`;
const workPairs = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [8, 24], [9, 18], [10, 40], [14, 35], [21, 28], [20, 5], [30, 6], [36, 12], [60, 40], [30, 15], [45, 36], [12, 6], [18, 9], [24, 8], [15, 10], [30, 20], [12, 4], [6, 3]];
export const rates: Family[] = [
  family('rate-unit-price', 'Unit price', 1, rng => {
    const price = rng.pick([75, 125, 150, 175, 225, 250, 325, 350, 450]) / 100, a = rng.int(2, 8), c = rng.int(a + 1, a + 9), item = rng.pick(['notebooks', 'pens', 'granola bars', 'bottles of juice', 'raffle tickets', 'packs of gum']);
    return { prompt: `${a} ${item} cost $${dollars(a * price)} in all. At this rate, how much do ${c} ${item} cost?`, answer: money(c * price), wrong: [money(a * price + (c - a)), money(c * a * price), money((c - a) * price), money(c * price + price)],
      explanation: `Find the cost of one: \\(\\$${dollars(a * price)}\\div${a}=\\$${dollars(price)}\\).\nThen multiply by ${c}: \\(${c}\\times\\$${dollars(price)}=\\$${dollars(c * price)}\\).` };
  }),
  family('rate-distance-time', 'Constant speed with mixed time units', 2, rng => {
    const u = rng.pick([15, 20, 30, 40, 45]), miles = rng.int(2, 12), k = rng.int(3, 8), target = u * k, name = rng.pick(names);
    const story = rng.pick([['bikes', 'bike'], ['jogs', 'jog'], ['paddles a canoe', 'paddle']]);
    return { prompt: `${name} ${story[0]} ${miles} miles in ${u} minutes. At this rate, how many miles will ${name} ${story[1]} in ${hoursMinutes(target)}?`, answer: num(miles * k), wrong: [num(clean(miles * target / 60)), num(miles * (k - 1)), num(miles * (k + 1)), num(miles + k)],
      explanation: `Use the same time unit. ${hoursMinutes(target)} is ${target} minutes, which is \\(${target}\\div${u}=${k}\\) periods of ${u} minutes.\n${name} covers ${miles} miles in each period: \\(${k}\\times${miles}=${miles * k}\\) miles.` };
  }),
  family('rate-average-speed', 'Average speed for a whole trip', 3, rng => {
    let t1 = 1, t2 = 3, r1 = 30, r2 = 50;
    for (let tries = 0; tries < 80; tries++) {
      const a = rng.int(1, 4), b = rng.int(1, 4), x = 5 * rng.int(6, 13), y = 5 * rng.int(6, 13);
      if (a !== b && x !== y && (x * a + y * b) % (a + b) === 0) { t1 = a; t2 = b; r1 = x; r2 = y; break; }
    }
    const distance = r1 * t1 + r2 * t2, answer = distance / (t1 + t2);
    return { prompt: `A driver travels ${r1 * t1} miles at ${r1} miles per hour and then ${r2 * t2} miles at ${r2} miles per hour. What is the driver's average speed, in miles per hour, for the entire trip?`, answer: num(answer), wrong: [num((r1 + r2) / 2), num(Math.max(r1, r2)), num(Math.min(r1, r2)), num(answer + 5)],
      explanation: `Average speed is total distance divided by total time.\nTime for each part: \\(${r1 * t1}\\div${r1}=${t1}\\) ${plural(t1, 'hour')} and \\(${r2 * t2}\\div${r2}=${t2}\\) ${plural(t2, 'hour')}.\n\\[\\frac{${r1 * t1}+${r2 * t2}}{${t1}+${t2}}=\\frac{${distance}}{${t1 + t2}}=${answer}.\\]\nAveraging the two speeds (${(r1 + r2) / 2}) ignores that more time was spent at one speed.` };
  }),
  family('rate-combined-work', 'Working together', 3, rng => {
    const [a, b] = rng.pick(workPairs), together = a * b / (a + b), [n1, n2] = rng.shuffle([...names]).slice(0, 2);
    const story = rng.pick([{ x: 'Pipe A', y: 'Pipe B', job: 'fill a tank', unitName: 'hours' }, { x: 'One printer', y: 'A second printer', job: 'print a batch of flyers', unitName: 'minutes' }, { x: n1, y: n2, job: 'paint a fence', unitName: 'hours' }]);
    return { prompt: `${story.x} can ${story.job} in ${a} ${story.unitName}. ${story.y} can ${story.job} in ${b} ${story.unitName}. Working together at these rates, how many ${story.unitName} will it take them to ${story.job}?`, answer: num(together), wrong: [num((a + b) / 2), num(a + b), num(Math.abs(a - b)), num(Math.min(a, b) / 2)],
      explanation: `Add the rates, not the times. In one ${story.unitName.replace(/s$/, '')}, they finish \\(\\frac{1}{${a}}+\\frac{1}{${b}}=\\frac{${a + b}}{${a * b}}=\\frac{1}{${together}}\\) of the job.\nSo the whole job takes ${together} ${story.unitName}. The answer must be less than the faster time of ${Math.min(a, b)} ${story.unitName}.` };
  }),
  family('rate-machines', 'Scaling a rate in two ways', 2, rng => {
    const r = rng.pick([5, 8, 10, 12, 15, 20, 25]), m1 = rng.int(2, 6), h1 = rng.int(2, 6), m2 = rng.int(m1 + 1, m1 + 5); let h2 = rng.int(2, 8); if (h2 === h1) h2++;
    return { prompt: `${m1} identical machines make ${fmt(m1 * h1 * r)} parts in ${h1} hours. At this rate, how many parts can ${m2} of these machines make in ${h2} hours?`, answer: num(m2 * h2 * r), wrong: [num(m2 * h1 * r), num(m1 * h2 * r), num(m1 * h1 * r * 2), num(m2 * h2)],
      explanation: `Find what one machine makes in one hour: \\(${tx(m1 * h1 * r)}\\div${m1}\\div${h1}=${r}\\) parts.\nThen scale to ${m2} machines for ${h2} hours: \\(${r}\\times${m2}\\times${h2}=${tx(m2 * h2 * r)}\\).` };
  }),
];

// ---- Percentages ----
export const percentages: Family[] = [
  family('percent-of', 'Percent of a number', 1, rng => {
    const p = rng.pick([5, 15, 20, 25, 30, 35, 40, 45, 60, 65, 75, 80]), n = rng.pick([40, 60, 80, 120, 140, 160, 180, 200, 240, 260, 320, 360, 400, 480]), answer = p * n / 100;
    const story = rng.pick([`What is ${p}% of ${n}?`, `A school has ${n} students, and ${p}% of them ride the bus. How many students ride the bus?`, `A farm has ${n} animals, and ${p}% of them are sheep. How many sheep are on the farm?`]);
    return { prompt: story, answer: num(answer), wrong: [num(p * n / 10), num(n - p), num(n - answer), num(clean(answer / 10))],
      explanation: `Percent means "out of 100," so \\(${p}\\%=\\frac{${p}}{100}=${p / 100}\\).\n\\[${p / 100}\\times${n}=${answer}.\\]` };
  }),
  family('percent-change', 'Percent increase and decrease', 2, rng => {
    let a = 40, p = 25;
    for (let tries = 0; tries < 40; tries++) { a = rng.pick([20, 25, 40, 50, 60, 80, 120, 150, 200, 250]); p = rng.pick([10, 15, 20, 25, 30, 40, 50, 60, 75]); if (a * p % 100 === 0) break; a = 40; p = 25; }
    const up = rng.bool(), change = a * p / 100, b = up ? a + change : a - change, thing = rng.pick(['a concert ticket', 'a monthly bus pass', 'a pair of sneakers', 'a video game']);
    return { prompt: `The price of ${thing} ${up ? 'rose' : 'dropped'} from $${a} to $${b}. What was the percent ${up ? 'increase' : 'decrease'}?`, answer: pct(p), wrong: [pct(Math.round(change / b * 1000) / 10), pct(change), pct(clean(Math.round(b / a * 1000) / 10))],
      explanation: `Percent change compares the amount of change with the original amount.\nChange: \\(${Math.max(a, b)}-${Math.min(a, b)}=${change}\\). Original: ${a}.\n\\[\\frac{${change}}{${a}}=${change / a}=${p}\\%.\\]\nAlways divide by the starting value, not the new value.` };
  }),
  family('percent-discount', 'Sale price', 2, rng => {
    const price = rng.pick([24, 30, 36, 40, 45, 48, 60, 75, 80, 90, 120, 150]), d = rng.pick([10, 15, 20, 25, 30, 40]), off = price * d / 100, thing = rng.pick(['jacket', 'backpack', 'lamp', 'pair of headphones', 'skateboard']);
    return { prompt: `A ${thing} that regularly costs $${price} is on sale for ${d}% off. What is the sale price?`, answer: money(price - off), wrong: [money(off), money(price - d), money(price + off)],
      explanation: `The discount is \\(${d}\\%\\) of \\$${price}: \\(${d / 100}\\times${price}=\\$${dollars(off)}\\).\nSubtract it from the regular price: \\(\\$${price}-\\$${dollars(off)}=\\$${dollars(price - off)}\\).\n(Or find \\(${100 - d}\\%\\) of \\$${price} directly.)` };
  }),
  family('percent-reverse', 'Finding the original price', 2, rng => {
    const original = rng.pick([40, 50, 60, 80, 120, 150, 200, 240, 300]), d = rng.pick([10, 20, 25, 30, 40]), sale = original * (100 - d) / 100, thing = rng.pick(['bicycle', 'tent', 'keyboard', 'winter coat']);
    return { prompt: `After a ${d}% discount, a ${thing} costs $${dollars(sale)}. What was the original price?`, answer: money(original), wrong: [money(sale * (100 + d) / 100), money(sale + d), money(original * (100 + d) / 100)],
      explanation: `After a ${d}% discount, the sale price is \\(${100 - d}\\%\\) of the original price.\n\\[${(100 - d) / 100}\\times\\text{original}=${tx(sale)}\\quad\\Rightarrow\\quad\\text{original}=${tx(sale)}\\div${(100 - d) / 100}=${original}.\\]\nAdding ${d}% of the sale price does not undo the discount, because the ${d}% was taken from the larger original price.` };
  }),
  family('percent-is-what', 'One number as a percent of another', 2, rng => {
    let b = 20, p = 75;
    for (let tries = 0; tries < 40; tries++) { b = rng.pick([8, 12, 16, 20, 24, 25, 32, 40, 48, 60, 80]); p = rng.pick([20, 25, 30, 40, 60, 75, 80]); if (b * p % 100 === 0) break; b = 20; p = 75; }
    const a = b * p / 100, name = rng.pick(names);
    const story = rng.pick([`On a quiz with ${b} questions, ${name} answered ${a} correctly. What percent of the questions did ${name} answer correctly?`, `${name} has saved $${a} toward a $${b} goal. What percent of the goal has ${name} saved?`, `A team won ${a} of the ${b} games it played. What percent of its games did the team win?`]);
    return { prompt: story, answer: pct(p), wrong: [pct(100 - p), pct(a), pct(b - a), pct(Math.round(b / a * 100))],
      explanation: `Write the part over the whole, then convert to a percent:\n\\[\\frac{${a}}{${b}}=${a / b}=${p}\\%.\\]` };
  }),
  family('percent-successive', 'Two percent changes in a row', 3, rng => {
    const [a, b] = rng.pick([[20, 25], [10, 10], [50, 50], [20, 20], [30, 30], [40, 40], [10, 20], [20, 10], [25, 40], [50, 20], [40, 25], [60, 25], [30, 10], [10, 30], [50, 10], [20, 50], [50, 40], [40, 50], [30, 20], [20, 30], [60, 50], [25, 60]]), result = (100 + a) * (100 - b) / 100;
    const thing = rng.pick(['a jacket', 'a tablet', 'a bicycle', 'a sofa']);
    if (rng.bool()) return { prompt: `A store lowers the price of ${thing} by ${b}% and later raises the new price by ${a}%. The final price is what percent of the original price?`, answer: pct(result), wrong: [pct(100 + a - b), pct(100 - b), pct(100 + a)],
      explanation: `Use an original price of $100. After a ${b}% decrease the price is $${100 - b}.\nThe ${a}% increase is taken from $${100 - b}: \\(${a / 100}\\times${100 - b}=${clean((100 - b) * a / 100)}\\), giving \\(${100 - b}+${clean((100 - b) * a / 100)}=${result}\\).\nThe final price is ${result}% of the original. The two percents cannot simply be added and subtracted, because they apply to different amounts.` };
    return { prompt: `A store raises the price of ${thing} by ${a}% and later lowers the new price by ${b}%. The final price is what percent of the original price?`, answer: pct(result), wrong: [pct(100 + a - b), pct(100 - b), pct(100 + a)],
      explanation: `Use an original price of $100. After a ${a}% increase the price is $${100 + a}.\nThe ${b}% decrease is taken from $${100 + a}: \\(${b / 100}\\times${100 + a}=${clean((100 + a) * b / 100)}\\), leaving \\(${100 + a}-${clean((100 + a) * b / 100)}=${result}\\).\nThe final price is ${result}% of the original. The two percents cannot simply be added and subtracted, because they apply to different amounts.` };
  }),
  family('percent-of-percent', 'Percent of a percent', 3, rng => {
    const [p, q] = rng.pick([[40, 25], [60, 25], [80, 25], [50, 30], [20, 45], [50, 40], [25, 40], [75, 20], [60, 50], [40, 35], [80, 15], [30, 30], [70, 30], [60, 35], [40, 40], [50, 50], [80, 75], [60, 75], [40, 75], [20, 35], [90, 30]]), answer = p * q / 100;
    const story = rng.pick([{ whole: 'the students at a school', first: 'are in the band', second: 'of the band members play a brass instrument', ask: 'play a brass instrument in the band' }, { whole: 'the cars in a lot', first: 'are electric', second: 'of the electric cars are blue', ask: 'are blue electric cars' }, { whole: 'the members of a gym', first: 'take classes', second: 'of the members who take classes take yoga', ask: 'take yoga' }]);
    return { prompt: `${p}% of ${story.whole} ${story.first}, and ${q}% ${story.second}. What percent of all ${story.whole.replace('the ', 'the ')} ${story.ask}?`, answer: pct(answer), wrong: [pct(p + q <= 100 ? p + q : p - q), pct(Math.abs(p - q)), pct(q), pct((p + q) / 2)].filter(choice => choice.value! > 0),
      explanation: `Take ${q}% of the ${p}%. Using 100 as the total: ${p} ${story.first}, and \\(${q / 100}\\times${p}=${answer}\\) of them are in the smaller group.\n\\[${q / 100}\\times${p / 100}=${clean(answer / 100)}=${answer}\\%.\\]` };
  }),
];
