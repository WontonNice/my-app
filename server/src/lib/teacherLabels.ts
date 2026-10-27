import { randomUUID } from 'node:crypto';
import { commitMathCommandState, readMathCommandState } from './mathCommandCatalogStore';
import type { TeacherLabels } from '../shared/teacherLabels';
import { emptyTeacherQuestion } from '../shared/teacherLabels';
import type { MathCatalog } from '../shared/mathCommandTypes';

const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const text = (value: unknown, max: number) => {
  if (typeof value !== 'string' || value.length > max) throw fail(`Use text of at most ${max} characters.`);
  return value.trim();
};
export function readTeacherLabels(root: string, actor: string): TeacherLabels {
  if (!actor) throw fail('Teacher identity is required.', 403);
  return structuredClone(readMathCommandState(root).teacherLabels?.[actor] ?? { revision: 'new', labels: [], questions: {} });
}
export function saveTeacherLabels(root: string, actor: string, input: Record<string, unknown>) {
  const state = readMathCommandState(root), own = readTeacherLabels(root, actor);
  if (input.revision !== own.revision) throw fail('My Tags changed in another window. Reload tags and retry.', 409);
  if (input.action === 'create' || input.action === 'edit') {
    const name = text(input.name, 120), description = text(input.description ?? '', 500);
    if (!name) throw fail('Give the label a name.');
    if (own.labels.some(label => label.id !== input.id && label.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw fail('You already have a label with this name.');
    if (input.action === 'create') own.labels.push({ id: randomUUID(), name, description });
    else {
      const label = own.labels.find(label => label.id === input.id);
      if (!label) throw fail('This label does not exist in your account.', 404);
      Object.assign(label, { name, description });
    }
  } else if (input.action === 'delete') {
    if (!own.labels.some(label => label.id === input.id)) throw fail('This label does not exist in your account.', 404);
    own.labels = own.labels.filter(label => label.id !== input.id);
    for (const question of Object.values(own.questions)) question.labelIds = question.labelIds.filter(id => id !== input.id);
  } else if (input.action === 'questions') {
    if (!Array.isArray(input.questionIds) || !input.questionIds.length || input.questionIds.length > 10000) throw fail('Select 1–10,000 questions.');
    const ids = [...new Set(input.questionIds.map(id => text(id, 500)))];
    if (ids.some(id => !id || ['__proto__', 'constructor', 'prototype'].includes(id))) throw fail('Choose valid question IDs.');
    for (const key of ['add', 'remove'] as const) if (input[key] !== undefined && (!Array.isArray(input[key]) || (input[key] as unknown[]).some(id => !own.labels.some(label => label.id === id)))) throw fail('Choose labels from your own account.');
    if (input.favorite !== undefined && typeof input.favorite !== 'boolean') throw fail('Favorite must be true or false.');
    if (input.note !== undefined && ids.length !== 1) throw fail('Edit a private note on one question at a time.');
    for (const id of ids) {
      const previous = own.questions[id] ?? emptyTeacherQuestion();
      own.questions[id] = { ...previous, labelIds: [...new Set([...previous.labelIds, ...(input.add as string[] ?? [])])].filter(id => !(input.remove as string[] ?? []).includes(id)), ...(input.favorite !== undefined ? { favorite: input.favorite as boolean } : {}), ...(input.note !== undefined ? { note: text(input.note, 3000) } : {}), updatedAt: new Date().toISOString() };
    }
  } else throw fail('Choose a supported My Tags action.');
  own.revision = randomUUID();
  state.teacherLabels = { ...state.teacherLabels, [actor]: own };
  commitMathCommandState(root, state.revision, state);
  return own;
}
export function teacherCatalog(catalog: MathCatalog, root: string, actor: string): MathCatalog {
  const own = readTeacherLabels(root, actor);
  return { ...catalog, rows: catalog.rows.map(row => {
    const personal = own.questions[row.id] ?? emptyTeacherQuestion();
    return { ...row, personal, teacherLabelNames: own.labels.filter(label => personal.labelIds.includes(label.id)).map(label => label.name) };
  }) };
}
