import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Download, Plus, RefreshCw } from 'lucide-react';
import { ExamMathQuestion } from '../../components/ExamMathQuestion';
import { ExamText } from '../../components/ExamReviewQuestion';
import { InequalityPractice } from './InequalityPractice';
import { generatorPreviewCatalog } from './generatorPreview';
import { generatorBatchExport, plannerEntryIssue } from './generatorBatchExport';
import { AddToGeneratorPlanner } from './AddToGeneratorPlanner';
import { plannerQuestionIds } from './generatorPlannerNavigation';
import { subscribePlannerChanges } from './generatorPlannerSync';
import { changePlanner, personalPlannerRequest, personalPracticeRequest, plannerStatusLabels, readPlanner } from './generatorPlannerClient';
import { plannerStatuses, type GeneratorBatch, type GeneratorPlannerState, type PlannerEntry } from '../../../../server/src/shared/generatorPlanner';
import { practiceModuleKind, type PracticeCatalog, type PracticeTaxonomy } from '../../../../server/src/shared/practiceCatalog';
import type { MathCommandRequest } from './client';
import './generator-planner.css';
import { relatedGenerators } from './relatedGenerators';
import { infiniteAssignmentHref } from './infiniteAssignmentLink';
import { QuestionExplanation } from './QuestionExplanation';

type CatalogData = { catalog: PracticeCatalog; taxonomy: PracticeTaxonomy['categories'] };
const updatePayload = (batch: GeneratorBatch) => ({ action: 'update', batchId: batch.id, name: batch.name, notes: batch.notes, entries: batch.entries.map(({ id, notes, status, destination, context }) => ({ id, notes, status, destination, context })) });
const editable = (batch?: GeneratorBatch) => batch ? JSON.stringify(updatePayload(batch)) : '';
function download(name: string, value: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type })), link = document.createElement('a');
  link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function GeneratorPlanner({ studentId, request = personalPlannerRequest, practiceRequest = personalPracticeRequest, onBrowse, onDirtyChange }: { studentId?: string; request?: MathCommandRequest; practiceRequest?: MathCommandRequest; onBrowse?: () => void; onDirtyChange?: (dirty: boolean) => void }) {
  const [data, setData] = useState<GeneratorPlannerState>(), [catalogData, setCatalogData] = useState<CatalogData>();
  const [draft, setDraft] = useState<GeneratorBatch>(), [focused, setFocused] = useState('');
  const [selected, setSelected] = useState<string[]>([]), [query, setQuery] = useState(''), [status, setStatus] = useState('');
  const [busy, setBusy] = useState(true), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [validation, setValidation] = useState<{ entryId: string; field: string; message: string }>();
  const [changingBatch, setChangingBatch] = useState(false);
  const [newName, setNewName] = useState(''), [creating, setCreating] = useState(false), [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exportText, setExportText] = useState(''), [sample, setSample] = useState<PracticeCatalog | null>(null);
  const [pendingQuestionIds, setPendingQuestionIds] = useState(() => plannerQuestionIds(window.location.search));
  const stateRef = useRef(data), draftRef = useRef(draft), working = useRef(false), previewTrigger = useRef<HTMLButtonElement | null>(null);
  const dirty = editable(draft) !== editable(data?.batches.find(batch => batch.id === draft?.id));
  useEffect(() => { onDirtyChange?.(dirty || busy); }, [dirty, busy, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  function accept(next: GeneratorPlannerState, syncDraft = true) {
    stateRef.current = next; setData(next);
    if (syncDraft) { const batch = next.batches.find(batch => batch.id === next.activeBatchId); draftRef.current = batch; setDraft(batch); setSelected([]); setFocused(batch?.entries[0]?.id ?? ''); setExportText(''); }
  }
  function edit(next: GeneratorBatch) { setValidation(undefined); draftRef.current = next; setDraft(next); setNotice(''); setExportText(''); }
  async function load() {
    if (working.current) return;
    working.current = true; setBusy(true); setChangingBatch(true); setError('');
    try { const [next, resources] = await Promise.all([readPlanner(request), practiceRequest<CatalogData>('/catalog?manage=1')]); accept(next); setCatalogData(resources); }
    catch (reason) { setError((reason as Error).message); }
    finally { working.current = false; setBusy(false); setChangingBatch(false); }
  }
  useEffect(() => { let active = true;
    void Promise.all([readPlanner(request), practiceRequest<CatalogData>('/catalog?manage=1')]).then(([next, resources]) => { if (active) { accept(next); setCatalogData(resources); setError(''); } }).catch(reason => { if (active) setError(reason.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [request, practiceRequest]);
  useEffect(() => {
    let active = true, refreshing = false;
    const unsubscribe = subscribePlannerChanges(() => {
      const own = stateRef.current;
      if (!own || refreshing || working.current || editable(draftRef.current) !== editable(own.batches.find(item => item.id === draftRef.current?.id))) return;
      refreshing = true;
      void readPlanner(request).then(next => {
        // A refresh must not replace typing or a save that began while reading.
        if (!active || working.current || stateRef.current !== own || editable(draftRef.current) !== editable(own.batches.find(item => item.id === draftRef.current?.id))) return;
        setError(message => message.startsWith('Could not refresh your planner:') ? '' : message);
        if (next.revision === own.revision) return;
        const current = next.batches.find(item => item.id === draftRef.current?.id) ?? next.batches.find(item => item.id === next.activeBatchId);
        accept(next, false); draftRef.current = current; setDraft(current);
        setSelected(ids => ids.filter(id => current?.entries.some(item => item.id === id)));
        setFocused(id => current?.entries.some(item => item.id === id) ? id : current?.entries[0]?.id ?? '');
        setExportText(''); setNotice('Planner updated with the latest saved questions.');
      }).catch(reason => { if (active) setError(`Could not refresh your planner: ${reason.message}`); }).finally(() => { refreshing = false; });
    });
    return () => { active = false; unsubscribe(); };
  }, [request]);
  async function persist(): Promise<GeneratorPlannerState | undefined> {
    const own = stateRef.current, batch = draftRef.current;
    if (!own || !batch || working.current) return;
    if (editable(batch) === editable(own.batches.find(item => item.id === batch.id))) return own;
    working.current = true; setBusy(true); setError('');
    try {
      const next = await changePlanner(request, own, updatePayload(batch)); accept(next, false);
      if (draftRef.current === batch) { const saved = next.batches.find(item => item.id === batch.id); draftRef.current = saved; setDraft(saved); }
      return next;
    } catch (reason) { setError((reason as Error).message); return undefined; }
    finally { working.current = false; setBusy(false); }
  }
  useEffect(() => {
    if (!dirty || busy || error || !draft?.name.trim()) return;
    const timer = setTimeout(() => { void persist(); }, 700); return () => clearTimeout(timer);
    // The timer always reads the latest draft and revision from refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, dirty, busy, error]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  async function action(payload: Record<string, unknown>, syncDraft = true) {
    if (working.current || !stateRef.current) return;
    if (dirty && !await persist()) return;
    if (editable(draftRef.current) !== editable(stateRef.current?.batches.find(item => item.id === draftRef.current?.id))) { setNotice('Your latest edits are still saving. Try again once saved.'); return; }
    working.current = true; setBusy(true); setChangingBatch(true); setError('');
    try { const next = await changePlanner(request, stateRef.current!, payload); accept(next, syncDraft); setDeleteConfirm(false); return next; }
    catch (reason) { setError((reason as Error).message); return undefined; }
    finally { working.current = false; setBusy(false); setChangingBatch(false); }
  }
  const batch = draft, catalog = catalogData?.catalog;
  const entries = batch?.entries ?? [], entry = entries.find(item => item.id === focused);
  const shown = entries.filter(item => (!status || item.status === status) && `${item.source.id} ${item.source.question.prompt} ${item.destination.category} ${item.destination.topic} ${item.destination.moduleTitle}`.toLowerCase().includes(query.toLowerCase()));
  const exportEntries = selected.length ? entries.filter(item => selected.includes(item.id)) : entries;
  function editEntry(patch: Partial<PlannerEntry>) { if (batch && entry) edit({ ...batch, entries: entries.map(item => item.id === entry.id ? { ...item, ...patch } : item) }); }
  function reorder(id: string, direction: number) {
    if (!batch) return; const next = [...entries], index = next.findIndex(item => item.id === id), other = index + direction;
    if (other < 0 || other >= next.length) return; [next[index], next[other]] = [next[other], next[index]]; edit({ ...batch, entries: next });
  }
  async function exportBatch(kind: 'copy' | 'download' | 'view') {
    if (!batch || !catalog || !catalogData || busy) return;
    const invalid = exportEntries.map(item => ({ item, issue: plannerEntryIssue(item, catalog, catalogData.taxonomy) })).find(item => item.issue);
    if (invalid?.issue) {
      setValidation({ entryId: invalid.item.id, ...invalid.issue }); setFocused(invalid.item.id); setQuery(''); setStatus('');
      requestAnimationFrame(() => document.getElementById('gp-' + invalid.issue!.field)?.focus()); return;
    }
    setValidation(undefined);
    try {
      if (dirty && !await persist()) return;
      if (editable(draftRef.current) !== editable(stateRef.current?.batches.find(item => item.id === draftRef.current?.id))) { setNotice('Your latest edits are still saving. Try exporting once saved.'); return; }
      const exportedDraft = draftRef.current!, signature = editable(exportedDraft);
      const result = generatorBatchExport(exportedDraft, exportedDraft.entries.filter(item => exportEntries.some(entry => entry.id === item.id)), catalog, catalogData.taxonomy);
      setExportText(result.prompt); setError('');
      if (kind === 'view') return;
      if (kind === 'copy') {
        try { await navigator.clipboard.writeText(result.prompt); }
        catch { setError('Clipboard access failed. Copy the complete prompt from the text box below.'); return; }
      } else download(`generator-batch-${batch.id}.json`, JSON.stringify({ ...result.manifest, instructions: result.prompt.split('\nBATCH PLAN:')[0] }, null, 2), 'application/json');
      if (editable(draftRef.current) !== signature) { setNotice('The earlier saved version was exported. Export again to include your latest edits.'); return; }
      const next = await action({ action: 'export', batchId: batch.id, entryIds: exportEntries.map(item => item.id) }, false);
      if (next) { const saved = next.batches.find(item => item.id === batch.id); draftRef.current = saved; setDraft(saved); setNotice(`${exportEntries.length} requests ${kind === 'copy' ? 'copied. Paste the prompt into your coding chat.' : 'downloaded. Attach the JSON file in your coding chat.'}`); }
    } catch (reason) { setError((reason as Error).message); }
  }
  return <section className="gp-workspace" aria-label="My generator planner">
    <header className="gp-header"><div><h1>My generator planner</h1><p>Collect source questions across topics. Build the whole batch with one request.</p></div><div className="gp-actions"><button type="button" disabled={busy} onClick={() => { if (!dirty || window.confirm('Reload the saved planner and discard your unsaved edits?')) void load(); }}><RefreshCw size={16}/>Reload</button><button type="button" disabled={!data || busy} onClick={() => setCreating(!creating)}><Plus size={16}/>New batch</button>{onBrowse && <button type="button" disabled={busy || dirty} onClick={onBrowse}>Browse questions</button>}</div></header>
    <p className="gp-save-state" role="status">{busy ? 'Saving or loading…' : dirty ? 'Unsaved edits' : data ? 'Saved to your account' : 'Loading your planner…'} · Personal generator-building batches</p>
    {error && <div className="gp-error" role="alert">{error} {dirty && <button type="button" disabled={busy} onClick={() => void persist()}>Retry save</button>} <button type="button" disabled={!draft} onClick={() => draft && download(`planner-recovery-${draft.id}.json`, JSON.stringify(draft, null, 2), 'application/json')}>{dirty ? 'Download unsaved draft' : 'Download saved batch backup'}</button></div>}
    {validation && <p className="gp-error" role="alert">{entries.find(item => item.id === validation.entryId)?.source.id}: {validation.message} <button type="button" onClick={() => { setFocused(validation.entryId); setQuery(''); setStatus(''); requestAnimationFrame(() => document.getElementById('gp-' + validation.field)?.focus()); }}>Go to incomplete field</button><button type="button" onClick={() => setValidation(undefined)}>Dismiss</button></p>}
    {notice && <p role="status">{notice}</p>}
    {pendingQuestionIds.length > 0 && <div className="gp-add-panel"><p>{pendingQuestionIds.length} source question{pendingQuestionIds.length === 1 ? '' : 's'} selected in Content Studio. Choose a batch below.</p><AddToGeneratorPlanner questionIds={pendingQuestionIds} request={request} onAdded={next => {
      if (!working.current && editable(draftRef.current) === editable(stateRef.current?.batches.find(item => item.id === draftRef.current?.id))) accept(next);
      setPendingQuestionIds([]); setNotice('Selection saved to your account planner.');
      const url = new URL(window.location.href); url.searchParams.delete('plannerQuestionId'); window.history.replaceState(null, '', url);
    }}/></div>}
    {(creating || data?.batches.length === 0) && <form className="gp-new" onSubmit={event => { event.preventDefault(); void action({ action: 'create', name: newName }).then(next => { if (next) { setCreating(false); setNewName(''); } }); }}><label>Batch name<input maxLength={120} value={newName} onChange={event => setNewName(event.target.value)} placeholder="For example: November generator builds"/></label><button disabled={busy || !newName.trim()}>Create batch</button></form>}
    {data && data.batches.length === 0 && <p className="gp-empty">Start a batch, then use Add to planner beside questions in Math Center or student progress. Your questions, destinations, and instructions will be saved here.</p>}
    {batch && catalogData && catalog && <fieldset className="gp-batch-body" disabled={changingBatch}>
      <div className="gp-batch-controls"><label>Saved batch<select disabled={busy || Boolean(error && dirty)} value={batch.id} onChange={event => void action({ action: 'activate', batchId: event.target.value })}>{data?.batches.map(item => <option key={item.id} value={item.id}>{item.name} ({item.entries.length})</option>)}</select></label><button type="button" disabled={busy} onClick={() => void action({ action: 'duplicate', batchId: batch.id, name: `${batch.name.slice(0, 115)} copy` })}>Duplicate batch</button><button type="button" disabled={busy} onClick={() => setDeleteConfirm(!deleteConfirm)}>Delete batch</button></div>
      {deleteConfirm && <p className="gp-error">Delete this saved batch? <button type="button" disabled={busy} onClick={() => void action({ action: 'delete', batchId: batch.id })}>Delete this batch</button><button type="button" onClick={() => setDeleteConfirm(false)}>Cancel</button></p>}
      <details className="gp-batch-settings"><summary>Batch details &amp; shared instructions</summary><div className="gp-brief"><label>Batch name<input value={batch.name} maxLength={120} onChange={event => edit({ ...batch, name: event.target.value })}/></label><label>Instructions for the whole batch<textarea rows={3} maxLength={6000} value={batch.notes} onChange={event => edit({ ...batch, notes: event.target.value })} placeholder="For example: preserve answer formats, include worked explanations, emphasize sign errors."/></label></div></details>
      <div className="gp-export"><strong>{entries.length} source questions · {new Set(entries.map(item => item.destination.category)).size} {new Set(entries.map(item => item.destination.category)).size === 1 ? 'category' : 'categories'}</strong><div className="gp-actions"><button type="button" disabled={busy || !exportEntries.length} onClick={() => void exportBatch('copy')}><Copy size={16}/>Copy {selected.length ? 'prompt (' + selected.length + ')' : 'full batch prompt'}</button><button type="button" disabled={busy || !exportEntries.length} onClick={() => void exportBatch('download')}><Download size={16}/>Download plan</button><button type="button" disabled={busy || !exportEntries.length} onClick={() => void exportBatch('view')}>View prompt</button></div><small>{selected.length ? `Exporting ${selected.length} selected questions. ` : 'Exporting all questions. '}New generators still need implementation and review.</small></div>
      {exportText && <details className="gp-prompt" open><summary>Complete batch prompt</summary><textarea aria-label="Complete batch prompt" readOnly rows={12} value={exportText}/></details>}
      <div className="gp-columns"><div className="gp-queue"><div className="gp-filters"><label>Find a queued question<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Question, topic, or ID"/></label><label>Status<select value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option>{plannerStatuses.map(value => <option key={value} value={value}>{plannerStatusLabels[value]}</option>)}</select></label></div>
        <div className="gp-selection"><label><input type="checkbox" checked={shown.length > 0 && shown.every(item => selected.includes(item.id))} onChange={event => setSelected(event.target.checked ? [...new Set([...selected, ...shown.map(item => item.id)])] : selected.filter(id => !shown.some(item => item.id === id)))}/>Select shown ({shown.length})</label>{selected.length > 0 && <button type="button" onClick={() => setSelected([])}>Clear selection</button>}</div>
        <ol className="gp-entry-list">{shown.map(item => <li key={item.id} className={item.id === entry?.id ? 'is-current' : ''}><input type="checkbox" aria-label={`Select ${item.source.id}`} checked={selected.includes(item.id)} onChange={event => setSelected(event.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id))}/><button type="button" className="gp-entry-link" aria-pressed={item.id === entry?.id} onClick={() => setFocused(item.id)}><strong><ExamText text={item.source.question.prompt || item.source.id}/></strong><small>{item.destination.category} / {item.destination.topic}</small><small>{item.source.id} · {plannerStatusLabels[item.status]}</small><small>{plannerEntryIssue(item, catalog, catalogData.taxonomy)?.message ?? "Ready to export"}</small></button><div className="gp-order"><button type="button" aria-label={`Move ${item.source.id} up`} disabled={entries[0].id === item.id} onClick={() => reorder(item.id, -1)}><ArrowUp size={16}/></button><button type="button" aria-label={`Move ${item.source.id} down`} disabled={entries.at(-1)?.id === item.id} onClick={() => reorder(item.id, 1)}><ArrowDown size={16}/></button></div></li>)}</ol>
        {!shown.length && <p className="gp-empty">{entries.length ? 'No questions match these filters.' : 'Your batch is empty. Add questions from the question bank or student progress.'}</p>}
      </div><div className="gp-detail">{entry ? <>
        <header><h2>Request details</h2><small>{entry.source.id}</small></header>
        <div className="gp-fields"><label>Category<select id="gp-category" value={entry.destination.category} onChange={event => editEntry({ destination: { ...entry.destination, category: event.target.value, topic: catalogData.taxonomy.find(item => item.label === event.target.value)?.topics[0] ?? '', moduleId: '' } })}><option value="">Choose category</option>{catalogData.taxonomy.map(item => <option key={item.label}>{item.label}</option>)}</select></label><label>Subcategory<select id="gp-topic" value={entry.destination.topic} onChange={event => editEntry({ destination: { ...entry.destination, topic: event.target.value, moduleId: '' } })}><option value="">Choose subcategory</option>{catalogData.taxonomy.find(item => item.label === entry.destination.category)?.topics.map(topic => <option key={topic}>{topic}</option>)}</select></label></div>
        <label>Destination module<select id="gp-module" value={entry.destination.moduleId} onChange={event => { const module = catalog.modules.find(item => item.id === event.target.value); editEntry({ destination: { ...entry.destination, moduleId: event.target.value, ...(module ? { moduleTitle: module.title } : {}) } }); }}><option value="">New focused module</option>{entry.destination.moduleId && !catalog.modules.some(item => item.id === entry.destination.moduleId && item.category === entry.destination.category && item.topic === entry.destination.topic) && <option value={entry.destination.moduleId}>Destination changed — choose again</option>}{catalog.modules.filter(item => item.category === entry.destination.category && item.topic === entry.destination.topic).map(item => <option key={item.id} value={item.id}>{item.title}{practiceModuleKind(item) ? ' (practice group)' : ''}</option>)}</select></label>
        {!entry.destination.moduleId && <div className="gp-fields"><label>New module name<input id="gp-title" maxLength={120} value={entry.destination.moduleTitle} onChange={event => editEntry({ destination: { ...entry.destination, moduleTitle: event.target.value } })} placeholder="A short skill name"/></label><label>Practice group<select id="gp-group" value={entry.destination.group} onChange={event => editEntry({ destination: { ...entry.destination, group: event.target.value as 'general' | 'foundation' } })}><option value="general">General Practice</option><option value="foundation">Foundation Building</option></select></label></div>}
        {selected.length > 1 && <button type="button" onClick={() => edit({ ...batch, entries: entries.map(item => selected.includes(item.id) ? { ...item, destination: { ...entry.destination } } : item) })}>Use this destination for {selected.length} selected requests</button>}
        <details className="gp-source"><summary>Private teaching context · excluded from exports</summary><label>Why I chose this question<textarea maxLength={6000} rows={3} value={entry.context?.rationale ?? ''} onChange={event => editEntry({ context: { ...entry.context, rationale: event.target.value } })}/></label>{entry.context?.assessment && <p>{entry.context.assessment} · {entry.context.at ? new Date(entry.context.at).toLocaleDateString() : 'Date not recorded'}</p>}{entry.context?.answer && <p>Recorded answer: {entry.context.answer} · Correct: {entry.context.correctAnswer}</p>}{entry.context?.studentId && <a href={'/teacher/math-command?tab=students&studentId=' + encodeURIComponent(entry.context.studentId) + '&questionId=' + encodeURIComponent(entry.source.id) + '&evidenceId=' + encodeURIComponent(entry.context.evidenceId || '')}>Return to original student evidence</a>}<small>Use the generation instructions below for non-identifying requirements you want included in the build prompt.</small></details>
        <label>Instructions for this question<textarea maxLength={6000} rows={4} value={entry.notes} onChange={event => editEntry({ notes: event.target.value })} placeholder="What should vary? What mistake or reasoning should the generator target?"/></label>
        <label>Request status<select value={entry.status} onChange={event => editEntry({ status: event.target.value as PlannerEntry['status'] })}>{plannerStatuses.map(value => <option key={value} value={value}>{plannerStatusLabels[value]}</option>)}</select></label><small>Update review and availability after checking the implemented generator.</small>
        <section className="gp-coverage"><h3>Reuse an existing family</h3><p>Exact sources are listed first. Related families share this topic; review their reasoning, difficulty and answer format before using them.</p>{relatedGenerators(entry, catalog).map(({ generator, exact, modules }) => <div key={generator.id}><span><strong>{generator.title}</strong><small>{exact ? 'Exact source match' : 'Related topic · coverage unverified'} · {generator.enabled ? 'Enabled' : 'Disabled'} · {generator.reviewStatus ?? 'unreviewed'}</small><small>{generator.description}</small></span><button type="button" onClick={event => { previewTrigger.current = event.currentTarget; setSample(generatorPreviewCatalog(generator)); }}>Preview generator</button>{modules[0] && <button type="button" onClick={() => editEntry({ destination: { category: modules[0].category, topic: modules[0].topic, moduleId: modules[0].id, moduleTitle: modules[0].title, group: practiceModuleKind(modules[0]) === 'foundation' ? 'foundation' : 'general' } })}>Use existing destination</button>}<button type="button" onClick={() => editEntry({ notes: [entry.notes, 'Review and extend ' + generator.id + ' for this source; confirm reasoning and response format before reusing it.'].filter(Boolean).join('\n') })}>Request extension</button>{generator.enabled && <a href={infiniteAssignmentHref({ studentId: studentId || entry.context?.studentId, category: generator.category, topic: generator.topic, generatorId: generator.id, questionId: entry.source.id })}>Choose a module to assign</a>}</div>)}{!relatedGenerators(entry, catalog).length && <p>No exact or related topic families found. Prepare a new focused module below.</p>}</section>
        <details className="gp-source"><summary>Source question, answer, and explanation</summary><p>Snapshot captured when queued. The build request checks the current source before making changes.</p><ExamMathQuestion key={entry.id} question={entry.source.question} answer={undefined} onChange={() => undefined}/><p>Answer: {entry.source.question.correctChoiceId ?? entry.source.question.correctTextAnswers?.join(' or ') ?? 'See source answer data in the exported plan.'}</p><QuestionExplanation question={entry.source.question}/>{entry.source.sources.map((source, index) => <p key={index}>{source.title} · Question {source.number}</p>)}</details>
        <button type="button" disabled={busy} onClick={() => void action({ action: 'remove', batchId: batch.id, entryId: entry.id })}>Remove from batch</button>
      </> : <p className="gp-empty">Choose a question to set its destination and generation instructions.</p>}</div></div>
    </fieldset>}
    {sample && <InequalityPractice catalog={sample} initialModuleId="generator-preview" previewOnly presentation="mini" onClose={() => { setSample(null); previewTrigger.current?.focus(); }}/>}
  </section>;
}
