import type { ExamQuestion } from './examTypes';
import { normalizeMathAnswer } from './mathAnswer';

export type TemplateExpression = number | string | { op: 'add'|'subtract'|'multiply'|'divide'|'mod'|'power'|'min'|'max'|'abs'|'gcd'; args: TemplateExpression[] };
export type TemplateValue = TemplateExpression | { text: string };
export type GeneratorTemplate = {
  version: 1;
  variables: { name: string; values: number[] }[];
  derived: { name: string; expression: TemplateExpression }[];
  constraints: { left: TemplateExpression; relation: 'lt'|'lte'|'gt'|'gte'|'eq'|'ne'; right: TemplateExpression }[];
  prompt: string;
  answer: TemplateValue;
  distractors: TemplateValue[];
  responseType: 'multiple_choice'|'short_response';
  explanation: string;
};
type Values = Record<string, number>;
type Variant = { prompt: string; answer: string; distractors: string[]; explanation: string };
type Compiled = { template: GeneratorTemplate; combinations: number; ranks: number[] };
const cache = new Map<string, Compiled>();
const fail = (message: string): never => { throw Object.assign(new Error(`Template: ${message}`), { status: 400 }); };
const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : fail('expected a JSON object.');
const keys = (value: Record<string, unknown>, allowed: string[]) => { for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`unsupported field “${key}”.`); };
const text = (value: unknown, label: string, max = 6000) => typeof value === 'string' && value.trim() && value.length <= max ? value.trim() : fail(`${label} must be text of 1–${max} characters.`);
const list = (value: unknown, label: string, max: number): unknown[] => Array.isArray(value) && value.length <= max ? value : fail(`${label} must be an array with at most ${max} entries.`);
const number = (value: unknown): number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e9 ? value : fail('numbers must be finite and between -1 billion and 1 billion.');
function name(value: unknown, known: Set<string>) {
  const result = text(value, 'Variable name', 32);
  if (!/^[a-z][a-zA-Z0-9_]*$/.test(result) || ['constructor','prototype','__proto__'].includes(result) || known.has(result)) fail(`invalid or repeated variable name “${result}”.`);
  return result;
}
function expression(value: unknown, known: Set<string>, depth = 0): TemplateExpression {
  if (depth > 8) return fail('expressions may nest at most eight levels.');
  if (typeof value === 'number') return number(value);
  if (typeof value === 'string') return known.has(value) ? value : fail(`unknown variable “${value}”.`);
  const row = object(value); keys(row, ['op','args']);
  if (!['add','subtract','multiply','divide','mod','power','min','max','abs','gcd'].includes(String(row.op))) return fail('unsupported math operation.');
  const args = list(row.args, 'Operation arguments', 8).map(item => expression(item, known, depth + 1));
  const op = row.op as Exclude<TemplateExpression, number|string>['op'];
  if (op === 'abs' ? args.length !== 1 : ['subtract','divide','mod','power','gcd'].includes(op) ? args.length !== 2 : args.length < 2) fail(`check the number of arguments for ${op}.`);
  return { op, args };
}
function evaluate(value: TemplateExpression, values: Values): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return number(values[value]);
  const args = value.args.map(arg => evaluate(arg, values)), [a,b] = args;
  let result: number;
  switch (value.op) {
    case 'add': result = args.reduce((sum,n) => sum + n, 0); break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = args.reduce((product,n) => product * n, 1); break;
    case 'divide': if (!b) return fail('division by zero.'); result = a / b; break;
    case 'mod': if (!b) return fail('remainder with a zero divisor.'); result = a % b; break;
    case 'power': if (!Number.isInteger(b) || Math.abs(b) > 10) return fail('powers need an integer exponent between -10 and 10.'); result = a ** b; break;
    case 'min': result = Math.min(...args); break;
    case 'max': result = Math.max(...args); break;
    case 'abs': result = Math.abs(a); break;
    case 'gcd': {
      if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) return fail('gcd needs integers.');
      let x = Math.abs(a), y = Math.abs(b); while (y) [x,y] = [y,x % y]; result = x; break;
    }
  }
  return number(result);
}
const format = (value: number) => {
  const rounded = Number(value.toFixed(10));
  if (Math.abs(value-rounded)>Number.EPSILON*Math.max(1,Math.abs(value))*4) fail('a displayed value needs more than ten decimal places. Use exact fraction text or constrain the domain.');
  return String(rounded);
};
function placeholders(value: unknown, label: string, known: Set<string>) {
  const result = text(value, label);
  const stripped = result.replace(/\{\{([a-z][a-zA-Z0-9_]*)\}\}/g, (_, key: string) => { if (!known.has(key)) fail(`unknown placeholder “${key}” in ${label}.`); return ''; });
  if (/\{\{|\}\}/.test(stripped)) fail(`invalid placeholder in ${label}; use {{variable}}.`);
  if (/<\/?[a-z][^>]*>/i.test(result)) fail(`${label} must use plain text and LaTeX, not HTML.`);
  return result;
}
const render = (value: string, values: Values) => value.replace(/\{\{([a-z][a-zA-Z0-9_]*)\}\}/g, (_, key: string) => format(values[key]));
function templateValue(value: unknown, known: Set<string>): TemplateValue {
  if (value && typeof value === 'object' && 'text' in value) { const row = object(value); keys(row,['text']); return { text: placeholders(row.text,'Answer text',known) }; }
  return expression(value, known);
}
const display = (value: TemplateValue, values: Values) => typeof value === 'object' && 'text' in value ? render(value.text, values) : format(evaluate(value, values));
function answerKey(value: string) {
  const normalized = normalizeMathAnswer(value);
  const fraction = normalized.match(/^(-?)\\frac\{(-?\d+(?:\.\d+)?)\}\{(-?\d+(?:\.\d+)?)\}$/);
  if (fraction && Number(fraction[3]) === 0) return fail('an answer fraction has a zero denominator.');
  if (fraction && Number(fraction[3]) !== 0) return `n:${Number((Number(fraction[2]) / Number(fraction[3]) * (fraction[1] ? -1 : 1)).toPrecision(12))}`;
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return `n:${Number(Number(normalized).toPrecision(12))}`;
  return normalized;
}
function variantAt(template: GeneratorTemplate, rank: number): Variant | null {
  const values: Values = Object.create(null);
  for (const variable of template.variables) { values[variable.name] = variable.values[rank % variable.values.length]; rank = Math.floor(rank / variable.values.length); }
  for (const constraint of template.constraints) {
    const left = evaluate(constraint.left, values), right = evaluate(constraint.right, values);
    const pass = { lt:left < right,lte:left <= right,gt:left > right,gte:left >= right,eq:left === right,ne:left !== right }[constraint.relation];
    if (!pass) return null;
  }
  for (const derived of template.derived) values[derived.name] = evaluate(derived.expression, values);
  return { prompt:render(template.prompt,values), answer:display(template.answer,values), distractors:template.distractors.map(item=>display(item,values)), explanation:render(template.explanation,values) };
}
function compile(value: unknown): Compiled {
  const key = JSON.stringify(value);
  if (!key || key.length > 40000) return fail('keep each template under 40,000 characters.');
  const cached = cache.get(key); if (cached) return cached;
  const row = object(value); keys(row,['version','variables','derived','constraints','prompt','answer','distractors','responseType','explanation']);
  if (row.version !== 1) return fail('version must be 1.');
  const known = new Set<string>();
  const variables = list(row.variables,'Variables',8).map(item => {
    const variable = object(item); keys(variable,['name','values']); const variableName = name(variable.name, known);
    const values = list(variable.values,'Variable values',100).map(number);
    if (!values.length || new Set(values).size !== values.length) fail('variable values must be nonempty and unique.');
    known.add(variableName); return {name:variableName,values};
  });
  const combinations = variables.reduce((count,variable)=>count * variable.values.length,1);
  if (combinations < 2 || combinations > 5000) return fail('use 2–5,000 parameter combinations per template so every combination can be checked. Split larger families into several generators.');
  const constraints = list(row.constraints ?? [],'Constraints',12).map(item => {
    const constraint = object(item); keys(constraint,['left','relation','right']);
    if (!['lt','lte','gt','gte','eq','ne'].includes(String(constraint.relation))) fail('unknown constraint relation.');
    return {left:expression(constraint.left,known),relation:constraint.relation as GeneratorTemplate['constraints'][number]['relation'],right:expression(constraint.right,known)};
  });
  const derived = list(row.derived ?? [],'Derived values',16).map(item=>{
    const derived = object(item); keys(derived,['name','expression']); const derivedName = name(derived.name,known), formula = expression(derived.expression,known);
    known.add(derivedName); return {name:derivedName,expression:formula};
  });
  if (row.responseType !== 'multiple_choice' && row.responseType !== 'short_response') return fail('choose multiple_choice or short_response.');
  const distractors = list(row.distractors ?? [],'Distractors',3).map(item=>templateValue(item,known));
  if (distractors.length !== (row.responseType === 'multiple_choice' ? 3 : 0)) return fail('multiple choice needs three distractors; short response needs none.');
  const template: GeneratorTemplate = {version:1,variables,derived,constraints,prompt:placeholders(row.prompt,'Question',known),answer:templateValue(row.answer,known),distractors,responseType:row.responseType,explanation:placeholders(row.explanation,'Explanation',known)};
  const ranks: number[] = [], stems = new Map<string,string>();
  for (let rank = 0; rank < combinations; rank++) {
    try {
      const variant = variantAt(template,rank); if (!variant) continue;
      const correct = answerKey(variant.answer);
      if (new Set([variant.answer,...variant.distractors].map(answerKey)).size !== 1 + distractors.length) fail('answer choices collide or contain a numeric equivalent of the key.');
      const previous = stems.get(variant.prompt);
      if (previous !== undefined && previous !== correct) fail('the same question stem produces different correct answers. Include all relevant values in the question.');
      if (previous === undefined) { stems.set(variant.prompt,correct); ranks.push(rank); }
    } catch (error) { return fail(`combination ${rank + 1}: ${(error as Error).message.replace(/^Template: /,'')}`); }
  }
  if (ranks.length < 2) return fail('at least two distinct valid question stems are required after constraints.');
  const compiled = {template,combinations,ranks};
  if (cache.size >= 24) cache.delete(cache.keys().next().value!);
  cache.set(key,compiled); return compiled;
}
export const validateGeneratorTemplate = (value: unknown) => structuredClone(compile(value).template);
export function analyzeGeneratorTemplate(value: unknown) { const result=compile(value); return { combinations:result.combinations, distinctStems:result.ranks.length, responseType:result.template.responseType }; }
export function generateTemplateQuestion(value: GeneratorTemplate, index: number, seed: string, id: string, category: string, topic: string): ExamQuestion {
  if (!Number.isSafeInteger(index) || index < 0 || typeof seed !== 'string' || seed.length > 100) return fail('invalid practice sequence.');
  const {template,ranks} = compile(value);
  let hash=2166136261; for (const char of `${id}:${seed}:${Math.floor(index/ranks.length)}`) hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  let step=(hash%ranks.length)||1;
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
  while(gcd(step,ranks.length)!==1)step=step%ranks.length+1;
  const variant = variantAt(template,ranks[((index%ranks.length)*step+hash%ranks.length)%ranks.length])!;
  const base = {id:`${id}:${seed}:${index}`,type:template.responseType,points:1,topic:category,subtopic:topic,prompt:variant.prompt,explanation:variant.explanation};
  if (template.responseType === 'short_response') return {...base,correctTextAnswers:[variant.answer]};
  const choices=[variant.answer,...variant.distractors], rotation=(hash+index)%4;
  const rotated=choices.slice(rotation).concat(choices.slice(0,rotation));
  return {...base,choices:rotated.map((text,i)=>({id:'ABCD'[i],text})),correctChoiceId:'ABCD'[rotated.indexOf(variant.answer)]};
}
