import type { ExamQuestion } from './examTypes';

// Infinite permutation and combination practice. Each family generalizes one
// counting question type found in the math question bank (sourceQuestionIds),
// so students can rehearse that exact reasoning with fresh numbers and stories.

const category = 'Statistics and Probability';
const topic = 'Counting & Sets';
type Choice = { id:string; text:string; math:string };
type Generated = { question:ExamQuestion; variant:number };
export type CombinatoricsTemplate = {
  id:string; title:string; description:string; category:string; topic:string; enabled:true; skilled:'TBD';
  difficulty:'foundation'|'standard'; sourceQuestionIds:string[]; distinctCount:number;
  generate:(index:number, seed:string)=>Generated;
};

const gcd = (a:number, b:number):number => b ? gcd(b, a % b) : a;
function hash(text:string) { let value = 2166136261; for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0; return value; }
/** Visit every case once per cycle (coprime stride), then start over: the stream never ends. */
function sequence(index:number, seed:string, count:number) {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let stride = 101; while (gcd(stride, count) !== 1) stride += 2;
  return ((index % count) * stride + hash(seed) % count) % count;
}
const factorial = (n:number) => { let value = 1; for (let i = 2; i <= n; i++) value *= i; return value; };
const permutations = (n:number, r:number) => { let value = 1; for (let i = 0; i < r; i++) value *= n - i; return value; };
const choose = (n:number, r:number) => r < 0 || r > n ? 0 : permutations(n, r) / factorial(r);
const commas = (value:number) => value.toLocaleString('en-US');
const commaMath = (value:number) => commas(value).replace(/,/g, '{,}');
const word = (n:number) => ['zero','one','two','three','four','five','six','seven','eight','nine','ten'][n] ?? String(n);
const names = ['Esther','Maya','Jordan','Priya','Leo','Sofia','Marcus','Aiden','Chloe','Daniel','Amara','Kenji','Lucia','Omar','Grace','Mateo'];
function pick<T>(values:readonly T[], index:number, seed:string, salt:string) { return values[hash(`${seed}:${salt}:${index}`) % values.length]; }
function base(t:{id:string}, index:number, seed:string) { return { id:`${t.id}:${seed}:${index}`, points:1, topic:category, subtopic:topic, skilled:'TBD' }; }

function shuffled(values:Choice[], index:number, seed:string, answer:Choice) {
  const rotation = hash(`${seed}:choices:${index}`) % values.length;
  const ordered = values.slice(rotation).concat(values.slice(0, rotation));
  return { choices:ordered.map((choice, at) => ({ ...choice, id:'ABCD'[at] })), correctChoiceId:'ABCD'[ordered.indexOf(answer)] };
}
/** Four distinct whole-number choices built from common mistakes. */
function countChoices(answer:number, mistakes:number[], index:number, seed:string, money = false) {
  const values = [answer];
  for (const value of mistakes) if (Number.isSafeInteger(value) && value > 0 && !values.includes(value)) values.push(value);
  for (let step = 1; values.length < 4; step++) for (const value of [answer + step, answer - step]) if (values.length < 4 && value > 0 && !values.includes(value)) values.push(value);
  const choices = values.slice(0, 4).map(value => ({ id:'', text:money ? `$${commas(value)}` : commas(value), math:money ? `\\$${commaMath(value)}` : commaMath(value) }));
  return shuffled(choices, index, seed, choices[0]);
}
type Fraction = { n:number; d:number };
const reduce = (n:number, d:number):Fraction => { const g = gcd(n, d) || 1; return { n:n / g, d:d / g }; };
const fractionMath = ({ n, d }:Fraction) => d === 1 ? String(n) : `\\frac{${n}}{${d}}`;
function fractionChoices(answer:Fraction, mistakes:Fraction[], index:number, seed:string) {
  const key = ({ n, d }:Fraction) => `${n}/${d}`;
  const values = [answer];
  for (const value of mistakes) if (value.d > 0 && value.n >= 0 && value.n <= value.d && !values.some(item => key(item) === key(value))) values.push(value);
  for (let d = answer.d + 1; values.length < 4; d++) for (let n = 1; n < d && values.length < 4; n++) { const value = reduce(n, d); if (!values.some(item => key(item) === key(value))) values.push(value); }
  const choices = values.slice(0, 4).map(value => ({ id:'', text:value.d === 1 ? String(value.n) : `${value.n}/${value.d}`, math:fractionMath(value) }));
  return shuffled(choices, index, seed, choices[0]);
}
function template(id:string, title:string, description:string, difficulty:'foundation'|'standard', sourceQuestionIds:string[], distinctCount:number) {
  return { id, title, description, category, topic, enabled:true as const, skilled:'TBD' as const, difficulty, sourceQuestionIds, distinctCount };
}

// 1. Fundamental counting principle: routes through several stops.
const routeStories = [
  { stops:['City W','City X','City Y','City Z'], road:'highways', trip:'a trip from City W to City X to City Y to City Z' },
  { stops:['the campsite','the lake','the waterfall','the summit'], road:'trails', trip:'a hike from the campsite to the lake to the waterfall to the summit' },
  { stops:['home','the library','the park','school'], road:'streets', trip:'a walk from home to the library to the park to school' },
  { stops:['Station A','Station B','Station C','Station D'], road:'train lines', trip:'a ride from Station A to Station B to Station C to Station D' },
] as const;
const routeCases:{story:number;legs:number[]}[] = [];
for (let story = 0; story < routeStories.length; story++) for (let a = 2; a <= 5; a++) for (let b = 2; b <= 5; b++) for (let c = 2; c <= 4; c++) routeCases.push({ story, legs:[a, b, c] });
export const routesTemplate = template('combinatorics-counting-principle-routes-v1', 'Routes Through Several Stops', 'Multiply the number of choices for each leg of a trip (fundamental counting principle).', 'foundation',
  ['2023-2024-form-b-pdf-shsat-2023-2024-b-q091', '2019-2020-form-b-pdf-shsat-2019-2020-b-q091'], routeCases.length);
function generateRoutes(index:number, seed = 'routes'):Generated {
  const variant = sequence(index, seed, routeCases.length), { story, legs } = routeCases[variant], s = routeStories[story];
  const answer = legs[0] * legs[1] * legs[2];
  const question:ExamQuestion = { ...base(routesTemplate, index, seed), type:'multiple_choice',
    prompt:`There are ${legs[0]} different ${s.road} from ${s.stops[0]} to ${s.stops[1]}, ${legs[1]} different ${s.road} from ${s.stops[1]} to ${s.stops[2]}, and ${legs[2]} different ${s.road} from ${s.stops[2]} to ${s.stops[3]}. How many different routes are there for ${s.trip}?`,
    ...countChoices(answer, [legs[0] + legs[1] + legs[2], legs[0] * legs[1] + legs[2], legs[0] * legs[1], legs[1] * legs[2]], index, seed),
    explanation:`Each route makes one choice for every leg, and any choice on one leg can be paired with any choice on the next. Multiply the choices:\n\\[${legs.join('\\times')}=${answer}.\\]\nAdding (${legs.join(' + ')} = ${legs[0] + legs[1] + legs[2]}) would count single legs, not complete routes.` };
  return { question, variant };
}

// 2. One choice from each group (table of options).
const groupStories = [
  { person:'Anita', pick:'report on 1 topic in each of', unit:'subject', groups:['Science','History','Art','Music'], item:'topics', result:'sets of 4 reports' },
  { person:'Marcus', pick:'order 1 item from each section of', unit:'menu section', groups:['Soups','Sandwiches','Sides','Drinks'], item:'items', result:'meals' },
  { person:'Priya', pick:'join 1 club in each of', unit:'category', groups:['Sports','Arts','Academics','Service'], item:'clubs', result:'club schedules' },
  { person:'Kenji', pick:'choose 1 elective in each of', unit:'period', groups:['Period 1','Period 2','Period 3','Period 4'], item:'electives', result:'elective schedules' },
] as const;
const groupCounts = [[2,3,1,5],[3,2,5,1],[2,5,3,1],[4,1,3,2],[3,3,2,2],[2,2,4,3],[1,5,2,4],[5,2,1,3],[2,4,2,3],[3,1,4,4],[6,2,1,2],[2,3,3,3]];
const groupCases:{story:number;counts:number[];size:3|4}[] = [];
for (let story = 0; story < groupStories.length; story++) for (const counts of groupCounts) for (const size of [3, 4] as const) groupCases.push({ story, counts:counts.slice(0, size), size });
export const oneFromEachTemplate = template('combinatorics-one-from-each-group-v1', 'One Choice From Each Group', 'Read the number of options in each group from a table and multiply to count complete selections.', 'foundation',
  ['2022-2023-form-a-q101'], groupCases.length);
function generateOneFromEach(index:number, seed = 'one-from-each'):Generated {
  const variant = sequence(index, seed, groupCases.length), { story, counts, size } = groupCases[variant], s = groupStories[story];
  const answer = counts.reduce((a, b) => a * b, 1), sum = counts.reduce((a, b) => a + b, 0), groups = s.groups.slice(0, size);
  const table = `\\[\\begin{array}{|l|c|}\\hline \\textbf{${s.unit[0].toUpperCase()}${s.unit.slice(1)}} & \\textbf{Number of ${s.item}}\\\\ \\hline ${groups.map((group, at) => `\\text{${group}} & ${counts[at]}\\\\ \\hline`).join(' ')}\\end{array}\\]`;
  const result = s.result.replace('4', String(size));
  const question:ExamQuestion = { ...base(oneFromEachTemplate, index, seed), type:'multiple_choice',
    prompt:`${table}\n\n${s.person} will ${s.pick} the ${size} ${s.unit === 'menu section' ? 'menu sections' : `${s.unit}s`} shown in the table above. How many different ${result} are possible?`,
    ...countChoices(answer, [sum, answer / Math.max(...counts), Math.max(...counts) * size, sum * size], index, seed),
    explanation:`${s.person} makes one choice in every row, and each choice can go with any choice from the other rows. Multiply the numbers in the table:\n\\[${counts.join('\\times')}=${answer}.\\]\n${counts.includes(1) ? 'A row with only 1 option multiplies by 1, so it does not change the total. ' : ''}Adding the rows (${sum}) would count single choices, not complete ${result}.` };
  return { question, variant };
}

// 3. Arranging every item: n!.
const arrangeStories = [
  (n:number, digits:number[]) => ({ prompt:`How many ${n}-digit numbers can be created using the digits ${digits.slice(0, -1).join(', ')}, and ${digits[n - 1]} without repeating any digits within that ${n}-digit number?`, thing:'digits', slot:'place' }),
  (n:number) => ({ prompt:`${pick(names, n, 'shelf', 'name')} has ${n} different books. In how many different orders can all ${n} books be arranged in a row on a shelf?`, thing:'books', slot:'spot on the shelf' }),
  (n:number) => ({ prompt:`${n} runners are in a race, and there are no ties. In how many different orders can all ${n} runners finish?`, thing:'runners', slot:'finishing place' }),
  (n:number) => ({ prompt:`${n} friends are standing in a line for a photo. In how many different ways can the ${n} friends be arranged in the line?`, thing:'friends', slot:'position in line' }),
];
const digitSets = [[2,3,5,7,8],[1,4,6,8,9],[2,4,5,7,9],[1,3,5,6,8],[3,4,6,7,9],[1,2,5,8,9]];
const arrangeCases:{story:number;n:number;digits:number}[] = [];
for (let story = 0; story < arrangeStories.length; story++) for (let n = 3; n <= 6; n++) for (let digits = 0; digits < (story === 0 ? digitSets.length : 1); digits++) if (story !== 0 || n <= 5) arrangeCases.push({ story, n, digits });
export const arrangeAllTemplate = template('combinatorics-arrange-all-v1', 'Arranging Every Item', 'Arrange all of the different items in order without repeats: multiply the shrinking number of choices, such as 5 × 4 × 3 × 2 × 1.', 'foundation',
  ['2021-2022-form-b-pdf-shsat-2021-2022-b-q058', '2025-2026-form-b-official-shsat-2025-b-63', 'official-shsat-2026-b-55'], arrangeCases.length);
function generateArrangeAll(index:number, seed = 'arrange-all'):Generated {
  const variant = sequence(index, seed, arrangeCases.length), { story, n, digits } = arrangeCases[variant];
  const s = arrangeStories[story](n, digitSets[digits].slice(0, n)), answer = factorial(n), factors = Array.from({ length:n }, (_, i) => n - i);
  const question:ExamQuestion = { ...base(arrangeAllTemplate, index, seed), type:'multiple_choice', prompt:s.prompt,
    ...countChoices(answer, [n ** n, n * n, factors.reduce((a, b) => a + b, 0), answer / n], index, seed),
    explanation:`Fill one ${s.slot} at a time. There are ${n} choices for the first, then ${n - 1} left for the next, and so on, because nothing can be used twice:\n\\[${factors.join('\\times')}=${answer}.\\]\nIf repeats were allowed it would be \\(${n}^{${n}}\\), but each of the ${s.thing} is used exactly once.` };
  return { question, variant };
}

// 4. Ordered selections without repeats: nPr (roles matter).
// The paint story itself is covered by the existing counting-distinct-paint-arrangements-v1 generator.
const orderedStories = [
  { setup:(n:number, r:number) => `A club with ${n} members will choose ${r === 3 ? 'a president, a vice president, and a secretary' : 'a president and a vice president'}. No member can hold more than one office. How many different ways can the offices be filled?`, roles:'offices' },
  { setup:(n:number, r:number) => `${n} students are in a spelling bee final. ${r === 3 ? 'Gold, silver, and bronze medals' : 'A first-place and a second-place ribbon'} will be awarded, and no student can win more than one. How many different ways can the ${r === 3 ? 'medals' : 'ribbons'} be awarded?`, roles:'awards' },
  { setup:(n:number, r:number) => `${pick(names, n * r, 'locker', 'name')} is making a locker code using ${r} different letters chosen from ${n} letters, and no letter may repeat. How many different codes are possible if the order of the letters matters?`, roles:'positions in the code' },
];
const orderedCases:{story:number;n:number;r:number}[] = [];
for (let story = 0; story < orderedStories.length; story++) for (let n = 4; n <= 9; n++) for (const r of [2, 3]) orderedCases.push({ story, n, r });
export const orderedSelectionTemplate = template('combinatorics-ordered-selection-v1', 'Ordered Selections Without Repeats', 'Assign different items to different roles; order matters, so multiply decreasing choices (permutations).', 'standard',
  ['2020-2021-form-b-q104', 'pdf-shsat-2024-2025-b-q104'], orderedCases.length);
function generateOrderedSelection(index:number, seed = 'ordered-selection'):Generated {
  const variant = sequence(index, seed, orderedCases.length), { story, n, r } = orderedCases[variant], s = orderedStories[story];
  const answer = permutations(n, r), factors = Array.from({ length:r }, (_, i) => n - i);
  const question:ExamQuestion = { ...base(orderedSelectionTemplate, index, seed), type:'multiple_choice', prompt:s.setup(n, r),
    ...countChoices(answer, [choose(n, r), n ** r, n * r, factors.reduce((a, b) => a + b, 0)], index, seed),
    explanation:`The ${s.roles} are different, so swapping two choices makes a new outcome: order matters. There are ${factors.join(', then ')} choices because each choice is used up:\n\\[${factors.join('\\times')}=${answer}.\\]\nDo not divide by ${factorial(r)}. Dividing is only for groups where order does not matter.` };
  return { question, variant };
}

// 5. Unordered groups: nCr.
// The cookie-pairs story itself is covered by the existing counting-unordered-cookie-pairs-v1 generator.
const groupItems = [
  { thing:'books', setup:(n:number, r:number, name:string) => `${name} has ${n} different books and will bring ${r} of them on vacation. How many different groups of ${r} books can ${name} bring?` },
  { thing:'toppings', setup:(n:number, r:number) => `A frozen yogurt shop has ${n} different toppings. A customer chooses ${r} different toppings for a cup. How many different combinations of ${r} toppings are possible?` },
  { thing:'students', setup:(n:number, r:number) => `A teacher will choose ${r} students from a group of ${n} students to form a team. How many different teams of ${r} students are possible?` },
];
const unorderedCases:{story:number;n:number;r:number}[] = [];
for (let story = 0; story < groupItems.length; story++) for (let n = 4; n <= 10; n++) for (const r of [2, 3]) if (r < n) unorderedCases.push({ story, n, r });
export const unorderedGroupTemplate = template('combinatorics-unordered-groups-v1', 'Choosing Unordered Groups', 'Count groups where order does not matter: multiply decreasing choices, then divide by the orderings (combinations).', 'standard',
  ['2021-2022-form-a-q91', 'choose-pairs-of-cookies', '2026-2027-form-a-math-item-29'], unorderedCases.length);
function generateUnorderedGroup(index:number, seed = 'unordered-groups'):Generated {
  const variant = sequence(index, seed, unorderedCases.length), { story, n, r } = unorderedCases[variant], s = groupItems[story];
  const answer = choose(n, r), ordered = permutations(n, r), factors = Array.from({ length:r }, (_, i) => n - i);
  const question:ExamQuestion = { ...base(unorderedGroupTemplate, index, seed), type:'multiple_choice', prompt:s.setup(n, r, pick(names, variant, seed, 'name')),
    ...countChoices(answer, [ordered, n * r, n ** 2, choose(n, r - 1) === answer ? n + r : choose(n, r - 1)], index, seed),
    explanation:`First count as if order mattered: \\(${factors.join('\\times')}=${ordered}\\). But the same ${r} ${s.thing} can be picked in \\(${Array.from({ length:r }, (_, i) => r - i).join('\\times')}=${factorial(r)}\\) different orders, and they make the same group. Divide out those repeats:\n\\[\\frac{${factors.join('\\times')}}{${Array.from({ length:r }, (_, i) => r - i).join('\\times')}}=${answer}.\\]` };
  return { question, variant };
}

// 6. Groups that include one specific person.
const includeStories = [
  { setup:(name:string, n:number, r:number) => `${name} is one of ${n} members of a committee. If ${r} members of that committee are selected to go to a conference, how many of the possible ${r === 2 ? 'pairs' : 'groups'} of members would include ${name}?` },
  { setup:(name:string, n:number, r:number) => `${name} is one of ${n} students who signed up for a science fair. The teacher will pick ${r} of these students to present. How many of the possible ${r === 2 ? 'pairs' : 'groups'} of presenters would include ${name}?` },
  { setup:(name:string, n:number, r:number) => `A coach will choose ${r} of ${n} swimmers for a relay group, where the order of the swimmers does not matter. ${name} is one of the ${n} swimmers. How many of the possible groups include ${name}?` },
];
const includeCases:{story:number;n:number;r:number}[] = [];
for (let story = 0; story < includeStories.length; story++) for (let n = 4; n <= 10; n++) for (const r of [2, 3]) includeCases.push({ story, n, r });
export const includesPersonTemplate = template('combinatorics-groups-including-one-v1', 'Groups That Include a Specific Person', 'Lock one person into the group, then choose only the remaining spots from everyone else.', 'standard',
  ['2019-2020-form-a-q89', '2023-2024-form-a-pdf-shsat-2023-2024-a-q089'], includeCases.length);
function generateIncludesPerson(index:number, seed = 'includes-person'):Generated {
  const variant = sequence(index, seed, includeCases.length), { story, n, r } = includeCases[variant], name = pick(names, variant, seed, 'name');
  const answer = choose(n - 1, r - 1), all = choose(n, r);
  const question:ExamQuestion = { ...base(includesPersonTemplate, index, seed), type:'multiple_choice', prompt:includeStories[story].setup(name, n, r),
    ...countChoices(answer, [all, n, all - answer, permutations(n - 1, r - 1)], index, seed),
    explanation:`${name} is already in the group, so only ${r - 1} ${r - 1 === 1 ? 'spot is' : 'spots are'} left to fill, chosen from the other ${n - 1} people.\n${r === 2 ? `\\[${n - 1}\\text{ choices for the partner}=${answer}.\\]` : `\\[\\frac{${n - 1}\\times${n - 2}}{2}=${answer}.\\]`}\nChoosing from all ${n} people would give ${all} ${r === 2 ? 'pairs' : 'groups'}, but that also counts the ones without ${name}.` };
  return { question, variant };
}

// 7. Every pair compared once, then cost.
const pairStories = [
  { setup:(n:number, cost:number) => `A company wants to study ${n} brands of soap by comparing each brand with every other brand. If each comparison costs $${commas(cost)}, how much will the company spend altogether?`, pair:'comparison' },
  { setup:(n:number, cost:number) => `In a league with ${n} teams, each team plays every other team exactly once. If renting the field for one game costs $${commas(cost)}, how much will the league spend on field rentals for all the games?`, pair:'game' },
  { setup:(n:number, cost:number) => `A judge will taste ${n} different recipes, comparing each recipe with every other recipe exactly once. If each taste comparison costs $${commas(cost)} in ingredients, how much will all the comparisons cost?`, pair:'comparison' },
];
const pairCosts = [5, 10, 20, 25, 50, 100, 500, 1000, 2000, 3000];
const pairCases:{story:number;n:number;cost:number}[] = [];
for (let story = 0; story < pairStories.length; story++) for (let n = 4; n <= 9; n++) for (const cost of pairCosts) pairCases.push({ story, n, cost });
export const everyPairTemplate = template('combinatorics-every-pair-cost-v1', 'Every Pair Compared Once', 'Count each pair once (n times n minus 1, divided by 2), then multiply by the cost of each pairing.', 'standard',
  ['2019-2020-form-b-pdf-shsat-2019-2020-b-q104'], pairCases.length);
function generateEveryPair(index:number, seed = 'every-pair'):Generated {
  const variant = sequence(index, seed, pairCases.length), { story, n, cost } = pairCases[variant], s = pairStories[story];
  const pairs = choose(n, 2), answer = pairs * cost;
  const question:ExamQuestion = { ...base(everyPairTemplate, index, seed), type:'multiple_choice', prompt:s.setup(n, cost),
    ...countChoices(answer, [n * (n - 1) * cost, n * cost, (n - 1) * cost, n * n * cost], index, seed, true),
    explanation:`Each of the ${n} items pairs with the other ${n - 1}, which gives \\(${n}\\times${n - 1}=${n * (n - 1)}\\). That counts every ${s.pair} twice (A with B and B with A), so divide by 2:\n\\[\\frac{${n}\\times${n - 1}}{2}=${pairs}\\text{ ${s.pair}s}.\\]\nThen multiply by the cost: \\(${pairs}\\times\\$${commaMath(cost)}=\\$${commaMath(answer)}\\).` };
  return { question, variant };
}

// 8. Sizes times topping combinations.
const sizeStories = [
  { shop:'A pizza shop', sizes:['small','medium','large','extra large'], item:'pizza', extras:'toppings', person:'Cody' },
  { shop:'A smoothie bar', sizes:['small','medium','large','jumbo'], item:'smoothie', extras:'fruits', person:'Lucia' },
  { shop:'A sandwich shop', sizes:['6-inch','9-inch','12-inch','18-inch'], item:'sandwich', extras:'fillings', person:'Omar' },
];
const sizeCases:{story:number;sizes:number;extras:number;k:number}[] = [];
for (let story = 0; story < sizeStories.length; story++) for (let sizes = 2; sizes <= 4; sizes++) for (let extras = 4; extras <= 9; extras++) for (const k of [2, 3]) if (k < extras && (k === 2 || extras <= 7)) sizeCases.push({ story, sizes, extras, k });
export const sizeToppingsTemplate = template('combinatorics-size-and-toppings-v1', 'Sizes Times Topping Combinations', 'Choose an unordered set of toppings (combination), then multiply by the number of sizes.', 'standard',
  ['2021-2022-form-b-pdf-shsat-2021-2022-b-q094', '2025-2026-form-b-official-shsat-2025-b-94', 'official-shsat-2026-b-81'], sizeCases.length);
function generateSizeToppings(index:number, seed = 'size-toppings'):Generated {
  const variant = sequence(index, seed, sizeCases.length), { story, sizes, extras, k } = sizeCases[variant], s = sizeStories[story];
  const combos = choose(extras, k), answer = sizes * combos, sizeList = s.sizes.slice(0, sizes), listed = sizeList.length === 2 ? sizeList.join(' and ') : `${sizeList.slice(0, -1).join(', ')}, and ${sizeList[sizes - 1]}`;
  const question:ExamQuestion = { ...base(sizeToppingsTemplate, index, seed), type:'multiple_choice',
    prompt:`${s.shop} offers a choice of ${sizes} sizes (${listed}) and ${extras} different ${s.extras}. Different ${s.item}s can be created by changing the size and/or the choice of ${s.extras}. If ${s.person} wants to order a ${s.item} with exactly ${k} different ${s.extras}, how many different ${s.item}s can ${s.person} create?`,
    ...countChoices(answer, [sizes * permutations(extras, k), sizes * extras, sizes + combos, combos], index, seed),
    explanation:`Step 1: choose the ${s.extras}. The order you pick them in does not matter, so count combinations:\n\\[\\frac{${Array.from({ length:k }, (_, i) => extras - i).join('\\times')}}{${Array.from({ length:k }, (_, i) => k - i).join('\\times')}}=${combos}.\\]\nStep 2: every ${s.extras.replace(/s$/, '')} combination comes in each of the ${sizes} sizes, so multiply:\n\\[${sizes}\\times${combos}=${answer}.\\]` };
  return { question, variant };
}

// 9. Groups with an exact mix of two types.
const mixStories = [
  { setup:(n:number, m:number, k:number, j:number) => `XYZ Corporation hired ${n} people as summer workers. Of these ${n} people, ${k} will be hired as permanent employees in the fall. If ${m} of the ${n} people are male, how many of the possible groups of ${k} people hired in the fall will include exactly ${j} ${j === 1 ? 'male' : 'males'}?`, a:'male', b:'female' },
  { setup:(n:number, m:number, k:number, j:number) => `A bag holds ${n} different marbles: ${m} are red and the rest are blue. ${pick(names, n + m, 'mix', 'name')} will take ${k} marbles at once. How many of the possible groups of ${k} marbles contain exactly ${j} red ${j === 1 ? 'marble' : 'marbles'}?`, a:'red', b:'blue' },
  { setup:(n:number, m:number, k:number, j:number) => `A class has ${n} volunteers: ${m} are seventh graders and the rest are eighth graders. The teacher will choose ${k} volunteers for a committee. How many different committees include exactly ${j} seventh ${j === 1 ? 'grader' : 'graders'}?`, a:'seventh grader', b:'eighth grader' },
];
const mixCases:{story:number;n:number;m:number;k:number;j:number}[] = [];
for (let story = 0; story < mixStories.length; story++) for (let n = 5; n <= 9; n++) for (let m = 2; m <= n - 2; m++) for (const k of [2, 3]) for (let j = 1; j <= Math.min(m, k - 1); j++) if (k - j <= n - m && m <= 4) mixCases.push({ story, n, m, k, j });
export const exactMixTemplate = template('combinatorics-committee-exact-mix-v1', 'Groups With an Exact Mix', 'Choose from each type separately (combinations), then multiply the two counts.', 'standard',
  ['2022-2023-form-b-q98', '2026-2027-form-d-math-item-35'], mixCases.length);
function generateExactMix(index:number, seed = 'exact-mix'):Generated {
  const variant = sequence(index, seed, mixCases.length), { story, n, m, k, j } = mixCases[variant], s = mixStories[story];
  const fromA = choose(m, j), fromB = choose(n - m, k - j), answer = fromA * fromB;
  const ways = (total:number, take:number, result:number) => take === 1 ? `${result}` : `\\(\\frac{${Array.from({ length:take }, (_, i) => total - i).join('\\times')}}{${factorial(take)}}=${result}\\)`;
  const question:ExamQuestion = { ...base(exactMixTemplate, index, seed), type:'multiple_choice', prompt:s.setup(n, m, k, j),
    ...countChoices(answer, [choose(n, k), fromA + fromB, fromB, fromA * permutations(n - m, k - j) === answer ? m * (n - m) + 1 : fromA * permutations(n - m, k - j)], index, seed),
    explanation:`Split the choice into two parts. Choose ${word(j)} ${s.a}${j === 1 ? '' : 's'} from ${m}: ${ways(m, j, fromA)} ${fromA === 1 ? 'way' : 'ways'}. Choose the other ${k - j} ${s.b}${k - j === 1 ? '' : 's'} from the ${n - m} ${s.b}s: ${ways(n - m, k - j, fromB)} ${fromB === 1 ? 'way' : 'ways'}.\nEach first choice can pair with each second choice, so multiply:\n\\[${fromA}\\times${fromB}=${answer}.\\]` };
  return { question, variant };
}

// 10. Fraction of pair products with a property (odd/even).
const productCases:{start:number;length:number;odd:boolean}[] = [];
for (let start = 1; start <= 9; start++) for (let length = 4; length <= 7; length++) for (const odd of [true, false]) productCases.push({ start, length, odd });
export const pairProductsTemplate = template('combinatorics-pair-products-fraction-v1', 'Fraction of Pair Products', 'Count all pairs of different numbers, count the pairs whose product is odd (only odd times odd), and write the fraction.', 'standard',
  ['2023-2024-form-b-pdf-shsat-2023-2024-b-q107', '2019-2020-form-b-pdf-shsat-2019-2020-b-q107'], productCases.length);
function generatePairProducts(index:number, seed = 'pair-products'):Generated {
  const variant = sequence(index, seed, productCases.length), { start, length, odd } = productCases[variant];
  const values = Array.from({ length }, (_, i) => start + i), odds = values.filter(value => value % 2).length, total = choose(length, 2), oddPairs = choose(odds, 2);
  const favorable = odd ? oddPairs : total - oddPairs, answer = reduce(favorable, total);
  const question:ExamQuestion = { ...base(pairProductsTemplate, index, seed), type:'multiple_choice',
    prompt:`\\[\\{${values.join(',')}\\}\\]\nA student made a list of all possible products of 2 different numbers in the set above. What fraction of the products are ${odd ? 'odd' : 'even'}?`,
    ...fractionChoices(answer, [reduce(total - favorable, total), reduce(odd ? odds : length - odds, length), reduce(favorable, length * length), reduce(odd ? odds * odds : length * length - odds * odds, length * length)], index, seed),
    explanation:`There are ${length} numbers, so the number of pairs is \\(\\frac{${length}\\times${length - 1}}{2}=${total}\\). A product is odd only when both numbers are odd. The set has ${odds} odd ${odds === 1 ? 'number' : 'numbers'}, so there ${oddPairs === 1 ? 'is' : 'are'} \\(${odds < 2 ? '0' : `\\frac{${odds}\\times${odds - 1}}{2}=${oddPairs}`}\\) odd ${oddPairs === 1 ? 'product' : 'products'}.\n${odd ? '' : `Every other product is even: \\(${total}-${oddPairs}=${favorable}\\).\n`}\\[\\frac{${favorable}}{${total}}${answer.d === total ? '' : `=${fractionMath(answer)}`}.\\]` };
  return { question, variant };
}

export const combinatoricsPractice:CombinatoricsTemplate[] = [
  { ...routesTemplate, generate:generateRoutes },
  { ...oneFromEachTemplate, generate:generateOneFromEach },
  { ...arrangeAllTemplate, generate:generateArrangeAll },
  { ...orderedSelectionTemplate, generate:generateOrderedSelection },
  { ...unorderedGroupTemplate, generate:generateUnorderedGroup },
  { ...includesPersonTemplate, generate:generateIncludesPerson },
  { ...everyPairTemplate, generate:generateEveryPair },
  { ...sizeToppingsTemplate, generate:generateSizeToppings },
  { ...exactMixTemplate, generate:generateExactMix },
  { ...pairProductsTemplate, generate:generatePairProducts },
];
