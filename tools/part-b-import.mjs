import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import documentImport from './document-import.cjs';
import partBBank from './part-b-bank.cjs';

const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const fingerprint = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const text = value => typeof value === 'string' ? value : '';
const fail = (message, status = 400) => { const error = new Error(message); error.status = status; throw error; };

export function partBPrompt(topics) {
  return `Extract the requested SHSAT Revising/Editing Part B questions from my attached screenshots, PDF or text into Nathan Tutors Content Studio. Return ONLY complete valid JSON, or a downloadable .json file. Include every requested question in source order. This is Part B: each question has its OWN sentence or paragraph; do not turn it into a shared reading passage.

Copy wording, punctuation, sentence numbers such as (1), paragraph breaks, answer order, directions and answer-box labels exactly. Preserve underlining, bold and italics in promptHtml, stimulusHtml, choices[].html, items[].html and explanationHtml, using only p, br, strong, em, u, sup, sub. Include matching plain-text fields too. Do not wrap normal paragraphs in code blocks or invent layout, images or URLs. Do not add sentence numbers that are absent from the source.

Exclude general exam/section DIRECTIONS, timing rules, navigation instructions and test-taking advice. Do not copy them into any question or stimulus field. Preserve only directions needed to answer the specific question, such as how many choices to select or where to place an answer card.

Use only answers and explanations explicitly supplied in the source. NEVER solve or guess an answer. Use correctChoiceId:"" or correctPlacements:{} when the key is absent or unclear. Preserve any supplied explanation exactly. Put missing content, ambiguous text, unsupported interactions and required images in notes. Incomplete questions are welcome: the teacher will edit them in the content editor.

For multiple choice use type:"multiple_choice", choices:[{id:"A",text:"...",html:"..."}, ...] and correctChoiceId. Keep all choices; normalize printed E/F/G/H to A/B/C/D IN ORDER and remap a supplied key. Preserve original labels in sourceChoiceIds. Do not invent choices to reach four.
For the one-answer-box drag-and-drop type use type:"category_sort", items:[{id:"sentence-1",text:"Sentence 1",html:"..."}, ...], categories:[{id:"answer-box",title:"exact box label"}], categoryCapacity:1, requiredPlacements:1, and correctPlacements:{"verified-item-id":"answer-box"}; leave that object empty if no key is supplied.
For any other interaction retain all source data and flag it in notes; do not omit the question.

Topics allowed: ${topics.join('; ')}. Choose a topic only if clear; otherwise topic:"" and a note. points defaults to 1. sourceQuestion preserves the printed number. versionLabels is a teacher-only array of separate exam/year/form tags, for example ["2020-2021 Form A", "2022-2023 Form A"]. Include only sources actually supplied. Reused questions can have several tags; do not invent source tests. Legacy versionLabel is also accepted.

Envelope (one question may also use {"question":{...}} or a bare question object):
{"format":"nathan-tutors-part-b-v1","questions":[{"sourceQuestion":"1","type":"multiple_choice","prompt":"Exact question","promptHtml":"Exact question","stimulus":"Exact numbered paragraph","stimulusHtml":"Exact paragraph with <u>source underlining</u>","choices":[{"id":"A","text":"First answer"},{"id":"B","text":"Second answer"},{"id":"C","text":"Third answer"},{"id":"D","text":"Fourth answer"}],"correctChoiceId":"","topic":"","points":1,"explanation":"","explanationHtml":"","versionLabels":[],"notes":[]}]}

The example describes the schema, not content to reuse. Produce one complete question or the complete requested batch. Never truncate JSON. If splitting a large job, end each file after a complete question and state the covered source range in its questions' notes.`;
}

export function createPartBImports({ workspaceRoot, sanitizeRichText, sanitizeInlineRichText, normalizeChoiceLabels, listItems, normalizeItem, saveItem, getTopics }) {
  const directory = join(workspaceRoot, 'tools', '.content-drafts');
  const path = join(directory, 'part-b-imports.json');
  let queue = Promise.resolve();
  const mutate = operation => { const result = queue.then(operation); queue = result.catch(() => {}); return result; };
  async function read() {
    try {
      const state = JSON.parse(await readFile(path, 'utf8'));
      state.entries = state.entries.map(entry => ({ ...entry, question: documentImport.withoutSectionDirections(entry.question) }));
      return state;
    }
    catch (error) { if (error.code === 'ENOENT') return { entries: [] }; throw error; }
  }
  async function write(state) {
    await mkdir(directory, { recursive: true });
    await writeFile(path + '.tmp', JSON.stringify(state, null, 2) + '\n', 'utf8');
    await rename(path + '.tmp', path);
  }
  function question(raw, id) {
    raw = documentImport.withoutSectionDirections(raw);
    const q = { ...raw, id, prompt: text(raw.prompt), stimulus: text(raw.stimulus), explanation: text(raw.explanation), instructions: text(raw.instructions), topic: text(raw.topic), versionLabel: text(raw.versionLabel), points: Number(raw.points) || 1 };
    Object.assign(q, partBBank.withLabels(q, partBBank.labels(raw)));
    delete q.importDraftId; delete q.importVersion; delete q.duplicateOf;
    const unsupported = Boolean(q.type && !['multiple_choice', 'category_sort'].includes(q.type));
    const notes = (Array.isArray(raw.notes) ? raw.notes : []).map(String);
    for (const field of ['promptHtml', 'explanationHtml']) q[field] = sanitizeInlineRichText(raw[field]);
    q.stimulusHtml = sanitizeRichText(raw.stimulusHtml);
    if (!['multiple_choice', 'category_sort'].includes(q.type)) {
      if (q.type) notes.push(`Source interaction ${q.type} needs manual setup. Original JSON is retained.`);
      q.type = 'multiple_choice'; q.correctChoiceId = '';
    }
    if (q.type === 'multiple_choice') {
      q.choices = (Array.isArray(raw.choices) ? raw.choices : []).map((choice, index) => ({ ...choice, id: text(choice?.id) || String.fromCharCode(65 + index), text: typeof choice === 'string' ? choice : text(choice?.text), html: sanitizeInlineRichText(choice?.html) }));
      q.correctChoiceId = unsupported ? '' : text(raw.correctChoiceId);
      try { Object.assign(q, normalizeChoiceLabels(q)); }
      catch { q.choices = q.choices.map((choice, i) => ({ ...choice, id: String.fromCharCode(65 + i) })); q.correctChoiceId = ''; notes.push('Duplicate source choice labels: verify the answer key manually.'); }
      if (!q.choices.some(choice => choice.id === q.correctChoiceId)) q.correctChoiceId = '';
      if (q.choices.length !== 4) notes.push(`Source has ${q.choices.length} choices. Edit the question to have four before saving to the bank.`);
      while (q.choices.length < 4) q.choices.push({ id: String.fromCharCode(65 + q.choices.length), text: '' });
      if (!q.correctChoiceId) notes.push('Correct answer was not provided.');
    } else {
      q.items = (Array.isArray(raw.items) ? raw.items : []).map((item, i) => ({ id: text(item?.id) || `sentence-${i + 1}`, text: text(item?.text), html: sanitizeInlineRichText(item?.html) }));
      q.categories = (Array.isArray(raw.categories) && raw.categories.length ? raw.categories : [{ id: 'answer-box', title: '' }]).map((category, i) => ({ id: text(category?.id) || `answer-box-${i + 1}`, title: text(category?.title) }));
      q.correctPlacements = raw.correctPlacements && typeof raw.correctPlacements === 'object' && !Array.isArray(raw.correctPlacements) ? { ...raw.correctPlacements } : {};
      q.categoryCapacity = 1; q.requiredPlacements = 1;
      if (q.categories.length !== 1) notes.push('This interaction has several boxes. Choose the supported question type and configure it manually; the original JSON is retained.');
      if (!Object.keys(q.correctPlacements).length) notes.push('Correct answer card was not provided.');
    }
    if (!q.topic || !getTopics().includes(q.topic)) notes.push('Choose a Revising/Editing topic.');
    if (!q.prompt || !q.stimulus) notes.push('Question or paragraph text is missing.');
    return { question: q, notes: [...new Set(notes)] };
  }
  function parse(source) {
    let data;
    try { data = typeof source === 'string' ? JSON.parse(source.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1')) : source; }
    catch { fail('Paste valid Part B JSON or choose a .json file.'); }
    if (data?.format && data.format !== 'nathan-tutors-part-b-v1') fail('Use the Part B extraction prompt for this import.');
    const records = Array.isArray(data) ? data : data?.questions ?? (data?.question ? [data.question] : data?.prompt !== undefined ? [data] : null);
    if (!Array.isArray(records) || !records.length || records.length > 500) fail('Include one question or a batch of 1–500 Part B questions.');
    return records.map((record, i) => { if (!record || typeof record !== 'object' || Array.isArray(record)) fail(`Source question ${i + 1} is not a question object.`); return record; });
  }
  return {
    prompt: () => partBPrompt(getTopics()),
    list: async () => (await read()).entries.filter(entry => !entry.publishedId),
    import: input => mutate(async () => {
      const sources = input?.sources || (input?.source ? [input.source] : []);
      if (!Array.isArray(sources) || !sources.length) fail('Choose JSON files or paste Part B JSON.');
      const records = sources.flatMap(parse); // Validate every file before writing any drafts.
      if (records.length > 500) fail('Import at most 500 Part B questions at a time.');
      const state = await read(), items = await listItems(), added = [], existing = [], published = [];
      const ids = new Set([...items.map(item => item.id), ...state.entries.map(entry => entry.question.id)]);
      for (const raw of records) {
        const hash = fingerprint(raw), previous = state.entries.find(entry => entry.fingerprint === hash);
        if (previous) { (previous.publishedId ? published : existing).push(previous.publishedId || previous.id); continue; }
        // A deleted question can be reimported without reviving a stale editor's ID.
        const base = `part-b-import-${hash.slice(0, 12)}-${randomUUID().slice(0, 8)}`; let id = base, n = 2;
        while (ids.has(id)) id = `${base}-${n++}`;
        ids.add(id);
        const entry = { id, fingerprint: hash, version: 1, original: raw, ...question(raw, id) };
        state.entries.push(entry); added.push(id);
      }
      await write(state); return { drafts: state.entries.filter(entry => !entry.publishedId), added, existing, published };
    }),
    save: input => mutate(async () => {
      const state = await read(), entry = state.entries.find(entry => entry.id === input?.id);
      if (!entry || entry.publishedId) fail('This Part B import draft is no longer available.', 404);
      if (entry.version !== input.version) fail('This Part B draft changed in another editor. Refresh before saving.', 409);
      if (!input.question || typeof input.question !== 'object') fail('Part B draft data is missing.');
      const cleaned = question(input.question, entry.question.id);
      entry.question = cleaned.question; entry.version++;
      await write(state); return { entry };
    }),
    delete: input => mutate(async () => {
      const state = await read(), entry = state.entries.find(entry => entry.id === input?.id);
      if (!entry) fail('This Part B import draft is no longer available.', 404);
      if (entry.publishedId) fail('This question has already been saved to the bank and cannot be deleted as a draft.', 409);
      if (entry.version !== input.version) fail('This Part B draft changed in another editor. Refresh before deleting.', 409);
      state.entries = state.entries.filter(item => item.id !== entry.id);
      await write(state);
      return { deleted: entry.id, drafts: state.entries.filter(item => !item.publishedId) };
    }),
    publish: input => mutate(async () => {
      const state = await read(), entry = state.entries.find(entry => entry.id === input?.id);
      if (!entry) fail('This Part B import draft is no longer available.', 404);
      if (entry.publishedId) return { id: entry.publishedId };
      if (entry.version !== input.version) fail('This Part B draft changed in another editor. Refresh before saving.', 409);
      const cleaned = question(input.question || entry.question, entry.question.id).question;
      const normalized = normalizeItem(cleaned); // Publication uses the normal strict Part B validator.
      const items = await listItems(), old = items.find(item => item.id === normalized.id);
      let savedId = normalized.id;
      if (old) { if (fingerprint(normalizeItem(old)) !== fingerprint(normalized)) fail('A different question already uses this ID. Existing content was preserved.', 409); }
      if (old) savedId = partBBank.rootId(old, items);
      else savedId = (await saveItem({ item: normalized, originalId: '', sourceHash: input.sourceHash })).item.id;
      entry.question = normalized; entry.publishedId = savedId; entry.version++;
      await write(state); return { id: savedId, reused: savedId !== normalized.id };
    }),
  };
}
