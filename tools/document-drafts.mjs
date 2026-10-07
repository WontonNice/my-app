import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import contract from './document-import.cjs';

// Teacher-only sidecar. Student exporters only read the existing published sources.
export function documentDraftStore(root, sanitize = content => content) {
  const directory = join(root, 'tools', '.content-drafts');
  const file = join(directory, 'document-imports.json');
  let pending = Promise.resolve();
  async function read() {
    try { return JSON.parse(await readFile(file, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return { revision: 0, entries: [] }; throw error; }
  }
  function mutate(revision, operation) {
    const task = pending.then(async () => {
      const state = await read();
      if (revision !== undefined && revision !== state.revision) throw new Error('Document drafts changed. Reopen the draft library before saving.');
      await operation(state);
      state.revision++;
      await mkdir(directory, { recursive: true });
      const temporary = file + '.tmp';
      await writeFile(temporary, JSON.stringify(state, null, 2), 'utf8');
      await rename(temporary, file);
      return state;
    });
    pending = task.catch(() => {});
    return task;
  }
  return {
    read,
    async import(source, revision, published = []) {
      const entries = contract.parse(source);
      return mutate(revision, state => {
        for (const entry of entries) {
          const fingerprint = createHash('sha256').update(contract.fingerprint(entry)).digest('hex');
          if (state.entries.some(e => e.fingerprint === fingerprint)) continue;
          if (published.some(p => contract.fingerprint({ kind: 'passage', content: p }) === contract.fingerprint(entry))) throw new Error('This content is already published. Open the existing passage instead.');
          if (entry.kind === 'passage' && [...state.entries.filter(e => e.kind === 'passage').map(e => e.content), ...published].some(p => p.id === entry.content.id)) throw new Error('A passage with this title/version already exists. Review the existing content or supply its distinct source version.');
          entry.content = sanitize(entry.content);
          entry.id = `import-${fingerprint.slice(0, 20)}`;
          entry.fingerprint = fingerprint;
          entry.status = 'draft';
          entry.content.importDraftId = entry.id;
          entry.createdAt = new Date().toISOString();
          state.entries.push(entry);
        }
      });
    },
    async save(input) {
      return mutate(input.revision, state => {
        const current = state.entries.find(e => e.id === input.entry.id);
        if (!current) throw new Error('Import draft not found.');
        if (!Array.isArray(input.entry.content?.questions)) throw new Error('Keep the ordered questions array.');
        current.content = sanitize(input.entry.content);
        current.content.importDraftId = current.id;
        current.status = 'draft';
        current.updatedAt = new Date().toISOString();
      });
    },
    async published(id, content) {
      return mutate(undefined, state => {
        const current = state.entries.find(e => e.id === id);
        if (current) { current.content = content; current.status = 'published'; current.publishedAt = new Date().toISOString(); }
      });
    },
  };
}

export function publicationContent(entry) {
  const p = JSON.parse(JSON.stringify(entry.content));
  const allVisuals = [...(p.visuals || []), ...p.questions.flatMap(q => (q.visuals || []).map(v => ({ ...v, questionId: v.questionId || q.id })))];
  p.images = p.images || [];
  for (const v of allVisuals) {
    if (!v.questionId) { if (!p.images.some(image => image.src === v.image.src)) p.images.push(v.image); continue; }
    const q = p.questions.find(q => q.id === v.questionId);
    if (!q) throw new Error(`Visual refers to missing question ${v.questionId}.`);
    if (v.choiceId) {
      const choice = q.choices?.find(c => c.id === v.choiceId);
      if (!choice) throw new Error(`Visual refers to missing choice ${v.choiceId}.`);
      if (choice.image && choice.image.src !== v.image.src) throw new Error('Combine multiple choice visuals into one faithful crop before publishing.');
      choice.image = v.image;
    } else {
      if (q.image && q.image.src !== v.image.src) throw new Error('Combine multiple question visuals into one faithful crop before publishing.');
      q.image = v.image;
    }
  }
  delete p.review; delete p.visuals; delete p.importDraftId; delete p.teacherSource;
  p.questions = p.questions.map(({ review, visuals, ...q }) => ({ ...q,
    ...(entry.kind === 'passage' && !q.id.startsWith(p.id + '-') ? { id: `${p.id}-${q.id}` } : {}) }));
  p.preserveSourceLayout = true;
  return p;
}
