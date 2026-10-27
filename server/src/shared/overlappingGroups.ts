import type { ExamQuestion } from './examTypes';

const contexts = [
  {
    groupA: 'Females who do not commute', groupB: 'Males who commute',
    prompt: (a: number, b: number, both: number) => `In Centerville, ${a}% of the population is female, and ${b}% of the population commutes to work daily. Of the total Centerville population, ${both}% are females who commute to work daily. What percentage of the total Centerville population are males who do not commute to work daily?`,
  },
  {
    groupA: 'Students who play soccer only', groupB: 'Students who play an instrument only',
    prompt: (a: number, b: number, both: number) => `At Westfield School, ${a}% of the students play soccer, and ${b}% play a musical instrument. Of all the students, ${both}% both play soccer and play a musical instrument. What percentage of all the students do neither activity?`,
  },
  {
    groupA: 'Members who borrow fiction only', groupB: 'Members who borrow audiobooks only',
    prompt: (a: number, b: number, both: number) => `At a library, ${a}% of the members borrow fiction books, and ${b}% borrow audiobooks. Of all the members, ${both}% borrow both fiction books and audiobooks. What percentage of all the members borrow neither fiction books nor audiobooks?`,
  },
];

export const overlappingGroupsTemplate = {
  id: 'overlapping-groups-v1', sourceId: '2021-2022-form-a-q76',
  title: 'Overlapping Groups', category: 'Statistics and Probability', topic: 'Overlapping Groups',
  description: 'Based on 2021–2022 Form A Q76. Use two overlapping group percentages to find the percentage in neither group.',
  // Four disjoint cells are at least 5%; their remaining 80 points have C(83,3) allocations.
  distinctCount: 91881 * contexts.length,
};

export function generateOverlappingGroups(index: number, seed = 'overlapping-groups') {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const count = overlappingGroupsTemplate.distinctCount;
  // 269 is coprime to 275643, giving a complete cycle with no repeated stems.
  const variant = ((index % count) * 269 + hash % count) % count;
  const contextIndex = variant % contexts.length, context = contexts[contextIndex];
  let rank = Math.floor(variant / contexts.length);
  let both = 5;
  for (; both <= 85; both++) {
    const remaining = 100 - both - 15;
    const allocations = (remaining + 1) * (remaining + 2) / 2;
    if (rank < allocations) break;
    rank -= allocations;
  }
  let onlyA = 5;
  for (; onlyA <= 90 - both; onlyA++) {
    const allocations = 100 - both - onlyA - 10 + 1;
    if (rank < allocations) break;
    rank -= allocations;
  }
  const onlyB = 5 + rank, neither = 100 - both - onlyA - onlyB;
  const groupA = onlyA + both, groupB = onlyB + both, union = 100 - neither;
  const options = [neither];
  for (const value of [onlyA, onlyB, Math.abs(groupA - groupB), 100 - groupB, 100 - groupA, both, union]) {
    if (!options.includes(value)) options.push(value);
    if (options.length === 4) break;
  }
  const rotation = (variant + Math.floor(index / count) + hash % 4) % 4;
  const choices = options.slice(rotation).concat(options.slice(0, rotation));
  const question: ExamQuestion = {
    id: `${overlappingGroupsTemplate.id}:${seed}:${index}`, type: 'multiple_choice', points: 1,
    topic: overlappingGroupsTemplate.category, subtopic: overlappingGroupsTemplate.topic,
    prompt: context.prompt(groupA, groupB, both),
    choices: choices.map((value, at) => ({ id: 'ABCD'[at], text: `${value}%` })),
    correctChoiceId: 'ABCD'[choices.indexOf(neither)],
    explanation: `The overlap is included in both group percentages, so subtract it once when finding the percentage in at least one group.\n\\[${groupA}+${groupB}-${both}=${union}\\]\n\nThe percentage in neither group is the remainder of the whole population:\n\\[100-${union}=${neither}\\]\n\nTherefore, the answer is ${neither}%.\n\nCheck the four separate groups:\n${context.groupA}: ${groupA} − ${both} = ${onlyA}%.\n${context.groupB}: ${groupB} − ${both} = ${onlyB}%.\nBoth groups: ${both}%.\nNeither group: ${neither}%.\nThese add to ${onlyA} + ${onlyB} + ${both} + ${neither} = 100%.`,
  };
  return { question, groupA, groupB, both, onlyA, onlyB, neither, contextIndex, variant };
}
