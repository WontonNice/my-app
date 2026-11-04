import { randomUUID } from 'node:crypto';
import { commitMathCommandState, readMathCommandCatalog, readMathCommandState } from './mathCommandCatalogStore';
import { emptyGeneratorPlanner, plannerStatuses, type GeneratorPlannerState, type PlannerDestination, type PlannerStatus, type PlannerContext } from '../shared/generatorPlanner';

const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
function text(value: unknown, max: number, required = false): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw fail(`Use ${required ? 'nonempty ' : ''}text of at most ${max} characters.`);
  return value.trim();
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw fail('Invalid planner request.');
  return value as Record<string, unknown>;
}
function destination(value: unknown): PlannerDestination {
  const row = record(value);
  if (row.group !== 'general' && row.group !== 'foundation') throw fail('Choose a practice group.');
  return { category: text(row.category, 120), topic: text(row.topic, 120), moduleId: text(row.moduleId, 500), moduleTitle: text(row.moduleTitle, 120), group: row.moduleId ? row.group : 'foundation', ...(row.skilled===undefined?{}:{skilled:text(row.skilled,500,true)}) };
}
function context(value: unknown): PlannerContext | undefined {
  if (value === undefined || value === null) return undefined;
  const row = record(value);
  const result: PlannerContext = { rationale: text(row.rationale ?? '', 6000) };
  for (const key of ['studentId', 'evidenceId', 'assessment', 'at', 'answer', 'correctAnswer'] as const) if (row[key] !== undefined) result[key] = text(row[key], key === 'studentId' ? 100 : 2000);
  return result;
}
export function readGeneratorPlanner(root: string, actor: string): GeneratorPlannerState {
  if (!actor || ['__proto__', 'constructor', 'prototype'].includes(actor)) throw fail('Teacher identity is required.', 403);
  const planner=structuredClone(readMathCommandState(root).generatorPlanners?.[actor] ?? emptyGeneratorPlanner());
  for(const batch of planner.batches)for(const entry of batch.entries)if(!entry.destination.moduleId)entry.destination.group='foundation';
  return planner;
}
export function saveGeneratorPlanner(root: string, actor: string, value: unknown) {
  const input = record(value), state = readMathCommandState(root), own = readGeneratorPlanner(root, actor);
  if (input.revision !== own.revision) throw fail('Your planner changed in another window. Reload the saved planner before retrying.', 409);
  const now = new Date().toISOString();
  let batch = own.batches.find(item => item.id === input.batchId);
  if (input.action === 'create' || input.action === 'duplicate') {
    if (own.batches.length >= 100) throw fail('Keep at most 100 batches. Download and delete an old batch first.');
    if (input.action === 'duplicate' && !batch) throw fail('This batch is not in your planner.', 404);
    const original = batch;
    batch = { id: randomUUID(), name: text(input.name, 120, true), notes: original?.notes ?? '', updatedAt: now,
      entries: original?.entries.map(entry => ({ ...structuredClone(entry), id: randomUUID(), status: entry.status === 'available' ? 'available' as const : 'draft' as const, addedAt: now })) ?? [] };
    own.batches.push(batch); own.activeBatchId = batch.id;
  } else {
    if (!batch) throw fail('This batch is not in your planner. Reload and choose a batch.', 404);
    if (input.action === 'add') {
      if (!Array.isArray(input.questionIds) || !input.questionIds.length || input.questionIds.length > 100) throw fail('Add between 1 and 100 questions at a time.');
      const ids = [...new Set(input.questionIds.map(id => text(id, 500, true)))];
      const records = readMathCommandCatalog(root);
      const sources = ids.map(id => { const source = records.find(row => row.id === id); if (!source) throw fail(`Source question ${id} is unavailable. Open the current question before adding it.`, 404); return source; });
      const contexts = input.contexts === undefined ? {} : record(input.contexts);
      for (const source of sources) {
        const existing = batch.entries.find(entry => entry.source.id === source.id);
        if (existing) { if (!existing.context && contexts[source.id]) existing.context = context(contexts[source.id]); continue; }
        const category = source.question.topic ?? '', topic = source.question.subtopic ?? '';
        batch.entries.push({ id: randomUUID(), source: { id: source.id, question: structuredClone(source.question), sources: source.sources, category, subcategory: topic, skilled: source.question.skilled ?? 'TBD' },
          destination: { category, topic, moduleId: '', moduleTitle: '', group: 'foundation' }, context: context(contexts[source.id]), notes: '', status: 'available', addedAt: now });
      }
      if (batch.entries.length > 100) throw fail('Keep at most 100 questions in one batch. Create another batch for the rest.');
    } else if (input.action === 'update') {
      batch.name = text(input.name, 120, true); batch.notes = text(input.notes, 6000);
      if (!Array.isArray(input.entries) || input.entries.length !== batch.entries.length) throw fail('Reload the planner before editing its questions.');
      const seen = new Set<string>();
      batch.entries = input.entries.map(value => {
        const row = record(value), entry = batch!.entries.find(entry => entry.id === row.id);
        if (!entry || seen.has(entry.id)) throw fail('Each saved planner entry must appear once.');
        seen.add(entry.id);
        if (!plannerStatuses.includes(row.status as PlannerStatus)) throw fail('Choose a valid request status.');
        return { ...entry, context: row.context === undefined ? entry.context : context(row.context), notes: text(row.notes, 6000), destination: destination(row.destination), status: row.status as PlannerStatus };
      });
    } else if (input.action === 'remove') {
      if (!batch.entries.some(entry => entry.id === input.entryId)) throw fail('This question is not in the batch.', 404);
      batch.entries = batch.entries.filter(entry => entry.id !== input.entryId);
    } else if (input.action === 'export') {
      if (!Array.isArray(input.entryIds) || !input.entryIds.length || input.entryIds.some(id => !batch!.entries.some(entry => entry.id === id))) throw fail('Select saved questions to export.');
      batch.entries = batch.entries.map(entry => input.entryIds instanceof Array && input.entryIds.includes(entry.id) && entry.status === 'draft' ? { ...entry, status: 'exported' } : entry);
    } else if (input.action === 'delete') {
      own.batches = own.batches.filter(item => item.id !== batch!.id);
    } else if (input.action !== 'activate') throw fail('Choose a supported planner action.');
    batch.updatedAt = now;
    own.activeBatchId = own.batches.some(item => item.id === batch!.id) ? batch.id : own.batches[0]?.id ?? '';
  }
  // Keep the metadata adapter bounded even for source questions with large diagrams.
  if (Buffer.byteLength(JSON.stringify(own), 'utf8') > 8_000_000) throw fail('Your planner is full. Download and delete an old batch before adding more questions.');
  own.revision = randomUUID();
  state.generatorPlanners = { ...state.generatorPlanners, [actor]: own };
  commitMathCommandState(root, state.revision, state);
  return own;
}
