import { useState } from 'react';
import type { GeneratorPlannerState, PlannerContext } from '../../../../server/src/shared/generatorPlanner';
import type { MathCommandRequest } from './client';
import { accountPlannerDestination, changePlanner, personalPlannerRequest, plannerHref, readPlanner } from './generatorPlannerClient';
import './generator-planner.css';

export function AddToGeneratorPlanner({ questionIds, context, request = personalPlannerRequest, onOpenPlanner, onAdded, studio = false }: { questionIds: string[]; context?: PlannerContext; request?: MathCommandRequest; onOpenPlanner?: () => void; onAdded?: (next: GeneratorPlannerState) => void; studio?: boolean }) {
  const [rationale, setRationale] = useState(context?.rationale ?? '');
  const [open, setOpen] = useState(false), [data, setData] = useState<GeneratorPlannerState>();
  const [batchId, setBatchId] = useState(''), [name, setName] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  async function load() {
    setOpen(true); setBusy(true); setError(''); setNotice('');
    try {
      if (studio) { const { url } = await accountPlannerDestination(request, questionIds); (window.top || window).location.assign(url); return; }
      const next = await readPlanner(request); setData(next); setBatchId(next.activeBatchId);
    }
    catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  async function add() {
    if (!data || busy) return;
    setBusy(true); setError('');
    try {
      let next = data, targetId = batchId;
      if (!targetId) { next = await changePlanner(request, next, { action: 'create', name: name.trim() || 'New generator batch' }); setData(next); targetId = next.activeBatchId; setBatchId(targetId); }
      const before = next.batches.find(batch => batch.id === targetId)?.entries.length ?? 0;
      next = await changePlanner(request, next, { action: 'add', batchId: targetId, questionIds, ...(context || rationale ? { contexts: Object.fromEntries(questionIds.map(id => [id, { ...context, rationale }])) } : {}) });
      setData(next); const batch = next.batches.find(batch => batch.id === targetId)!;
      onAdded?.(next);
      const count = batch.entries.length - before;
      setNotice(count ? `Added ${count} question${count === 1 ? '' : 's'} to ${batch.name}.` : `These questions are already in ${batch.name}.`); setOpen(false);
    } catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="gp-add">
    <button type="button" disabled={!questionIds.length || busy} aria-expanded={open} onClick={() => open ? setOpen(false) : void load()}>Add {questionIds.length > 1 ? `${questionIds.length} questions ` : ''}to planner</button>
    {open && <div className="gp-add-panel">
      <strong>Collect in your generator planner</strong>
      <small>The current source question is saved with your batch.</small>
      {busy && <p role="status">Saving or loading your batches…</p>}
      {data && <><label>Batch<select disabled={busy} value={batchId} onChange={event => setBatchId(event.target.value)}><option value="">Create a new batch</option>{data.batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name} ({batch.entries.length})</option>)}</select></label>
        {!batchId && <label>New batch name<input maxLength={120} value={name} onChange={event => setName(event.target.value)} placeholder="For example: November generator builds"/></label>}
        <label>Why I chose this question · private<textarea maxLength={6000} rows={2} value={rationale} onChange={event => setRationale(event.target.value)}/><small>Saved only in your planner. Response context and this note are excluded from batch exports.</small></label>
        <div className="gp-actions"><button type="button" disabled={busy || (!batchId && !name.trim())} onClick={() => void add()}>Add to batch</button><button type="button" disabled={busy} onClick={() => setOpen(false)}>Cancel</button></div></>}
      {error && <p role="alert">{error} <button type="button" disabled={busy} onClick={() => void load()}>Reload batches</button></p>}
    </div>}
    {notice && <span role="status">{notice} {onOpenPlanner ? <button type="button" onClick={onOpenPlanner}>Open planner</button> : <a href={plannerHref}>Open planner</a>}</span>}
  </div>;
}
