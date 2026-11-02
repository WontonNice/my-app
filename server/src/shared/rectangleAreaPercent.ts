import type { ExamQuestion } from './examTypes';

type Parameters = { length: number; width: number; lengthPercent: number; widthMeters: number };
const parameters: Parameters[] = [{ length: 80, width: 50, lengthPercent: 15, widthMeters: 10 }];
for (let length = 20; length <= 120; length += 10) {
  for (let width = 10; width <= 80; width += 5) {
    if (width >= length) continue;
    for (const lengthPercent of [5, 10, 15, 20, 25, 30]) {
      for (const widthPercent of [10, 15, 20, 25, 30, 40, 50]) {
        // Integer meter lengths and at most one decimal place in the answer.
        if (length * lengthPercent % 100 || width * widthPercent % 100 || lengthPercent * widthPercent % 10) continue;
        const widthMeters = width * widthPercent / 100;
        if (length === 80 && width === 50 && lengthPercent === 15 && widthMeters === 10) continue;
        parameters.push({ length, width, lengthPercent, widthMeters });
      }
    }
  }
}
const count = parameters.length;
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
let stride = 101;
while (gcd(stride, count) !== 1) stride += 2;
// Percentages are stored as integer tenths; no floating-point choice collisions.
const percent = (tenths: number) => String(tenths / 10);

export const rectangleAreaPercentTemplate = {
  id: 'rectangle-area-percent-increase-v1', sourceId: '2020-2021-form-b-q113',
  requestId: '4bca692b-55f0-40d4-ab9f-c6af1eaed5c7',
  title: 'Rectangular Area: Percent Increase',
  category: 'Ratios and Proportional Relationships', topic: 'Percentages',
  moduleId: 'general-ratios-and-proportional-relationships-percentages-4bd37f',
  existingModuleOnly: true, groupType: 'general', enabled: false,
  description: `Find the area increase when a field’s length grows by a percentage and its width grows by a number of meters. ${count.toLocaleString('en-US')} distinct numerical stems per seeded cycle, with worked area calculations and misconception distractors.`,
  distinctCount: count, stride,
} as const;

export function generateRectangleAreaPercent(index: number, seed = 'rectangle-area') {
  if (!Number.isSafeInteger(index) || index < 0) throw new Error('Question index must be a nonnegative safe integer.');
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const variant = ((index % count) * stride + hash % count) % count;
  const { length, width, lengthPercent, widthMeters } = parameters[variant];
  const widthPercent = widthMeters * 100 / width;
  const newLength = length + length * lengthPercent / 100, newWidth = width + widthMeters;
  const originalArea = length * width, newArea = newLength * newWidth, increase = newArea - originalArea;
  const answer = (lengthPercent + widthPercent) * 10 + lengthPercent * widthPercent / 10;
  // First three are the source's traps: treat meters as percent, add the two
  // percentages, or treat the stated length percentage as a number of meters.
  const wrongMetersNumerator = ((length + lengthPercent) * newWidth - originalArea) * 1000;
  const wrongMeters = wrongMetersNumerator % originalArea === 0 ? wrongMetersNumerator / originalArea : undefined;
  const candidates = [answer, (lengthPercent + widthMeters) * 10 + lengthPercent * widthMeters / 10, (lengthPercent + widthPercent) * 10,
    wrongMeters, widthPercent * 10, lengthPercent * 10, (lengthPercent + widthPercent) * 10 + lengthPercent * widthPercent / 5];
  const values = [...new Set(candidates.filter((value): value is number => value !== undefined && Number.isSafeInteger(value) && value > 0))].slice(0, 4).sort((a, b) => a - b);
  if (values.length !== 4) throw new Error('An area question needs four distinct choices.');
  const rotation = variant % 4, ordered = values.slice(rotation).concat(values.slice(0, rotation));
  const question: ExamQuestion = {
    id: `${rectangleAreaPercentTemplate.id}:${seed}:${index}`, type: 'multiple_choice', points: 1,
    topic: rectangleAreaPercentTemplate.category, subtopic: rectangleAreaPercentTemplate.topic, skilled: 'TBD',
    prompt: `A rectangular field had a length of ${length} meters and a width of ${width} meters. The field was recently enlarged, with the length increased by ${lengthPercent}% and the width increased by ${widthMeters} meters. By what percentage was the area of the field increased?`,
    choices: ordered.map((value, at) => ({ id: 'ABCD'[at], text: `${percent(value)}%` })), correctChoiceId: 'ABCD'[ordered.indexOf(answer)],
    explanation: `First find the original area:\n\\[${length}\\times ${width}=${originalArea}\\text{ square meters}.\\]\nA ${lengthPercent}% increase in length adds \\(${length}\\times ${lengthPercent}/100=${newLength - length}\\) meters, so the new length is ${newLength} meters. The new width is \\(${width}+${widthMeters}=${newWidth}\\) meters.\n\nThe new area is \\(${newLength}\\times ${newWidth}=${newArea}\\) square meters, an increase of \\(${newArea}-${originalArea}=${increase}\\) square meters. Compare this increase with the ORIGINAL area:\n\\[\\frac{${increase}}{${originalArea}}\\times100\\%=${percent(answer)}\\%.\\]\nThe width increase is \\(${widthMeters}/${width}\\times100\\%=${widthPercent}\\%\\). Simply adding ${lengthPercent}% and ${widthPercent}% misses the extra corner area where both dimensions increase. Also, ${lengthPercent}% is a percentage of the original length, while ${widthMeters} is a number of meters.`,
  };
  return { question, variant };
}
