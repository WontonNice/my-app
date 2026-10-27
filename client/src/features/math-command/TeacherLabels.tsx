import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bookmark, Tags } from 'lucide-react';
import type { TeacherLabels } from '../../../../server/src/shared/teacherLabels';
import { emptyTeacherQuestion } from '../../../../server/src/shared/teacherLabels';
import { jsonRequest, type MathCommandRequest } from './client';
import './teacher-labels.css';

import {Context, useTeacherLabels} from "./teacherLabelsContext";
export function TeacherLabelsProvider({ request, children, onChange }: { request: MathCommandRequest; children: ReactNode; onChange?: () => void }) {
  const [loaded, setLoaded] = useState<{ request: MathCommandRequest; data: TeacherLabels }>();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const data = loaded?.request === request ? loaded.data : undefined;
  useEffect(() => { let active = true; request<TeacherLabels>('/teacher-labels').then(data => { if (active) { setLoaded({ request, data }); setError(''); } }).catch(reason => { if (active) setError(String(reason.message)); }); return () => { active = false; }; }, [request]);
  useEffect(() => {
    const refresh = () => request<TeacherLabels>('/teacher-labels').then(data => {setLoaded({request, data});setError('');}).catch(reason => setError(String(reason.message)));
    window.addEventListener('studio:teacher-labels-changed', refresh);
    return () => window.removeEventListener('studio:teacher-labels-changed', refresh);
  }, [request]);
  async function save(action: Record<string, unknown>) {
    if (busy || !data) return false;
    setBusy(true); setError('');
    try { const next = await request<TeacherLabels>('/teacher-labels', jsonRequest('POST', { ...action, revision: data.revision })); setLoaded({ request, data: next }); onChange?.(); return true; }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save My Tags. Retry.'); try { setLoaded({ request, data: await request<TeacherLabels>('/teacher-labels') }); } catch { /* Keep the failure visible. */ } return false; }
    finally { setBusy(false); }
  }
  return <Context.Provider value={{ data, busy, error, save }}>{children}</Context.Provider>;
}

export function TeacherTags({ ids, compact = false }: { ids: string[]; compact?: boolean }) {
  const { data, busy, error, save } = useTeacherLabels();
  const [note, setNote] = useState<string | undefined>();
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: Event) => { const node=disclosure.current; if(node?.open && !node.contains(event.target as Node)) node.open=false; };
    const escape = (event: KeyboardEvent) => { if(event.key === 'Escape' && disclosure.current?.open) { event.stopPropagation(); disclosure.current.open=false; disclosure.current.querySelector('summary')?.focus(); } };
    document.addEventListener('pointerdown',close); document.addEventListener('keydown',escape,true);
    return () => {document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape,true);};
  }, []);
  const personal = data?.questions[ids[0]] ?? emptyTeacherQuestion();
  const patch = (fields: Record<string, unknown>) => save({ action: 'questions', questionIds: ids, ...fields });
  return <div className="teacher-tags">
    {ids.length === 1 && <button type="button" aria-label={personal.favorite ? 'Remove favorite' : 'Favorite question'} aria-pressed={personal.favorite} disabled={!data || busy} onClick={() => patch({ favorite: !personal.favorite })}><Bookmark size={15} fill={personal.favorite ? 'currentColor' : 'none'}/>{!compact && (personal.favorite ? 'Favorited' : 'Favorite')}</button>}
    <details ref={disclosure} onToggle={event => { const details = event.currentTarget, panel = details.querySelector<HTMLElement>(".teacher-tags-panel"); if (details.open && panel) { const rect = details.getBoundingClientRect(); panel.style.position = "fixed"; panel.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 350))}px`; panel.style.top = `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - Math.min(panel.scrollHeight, window.innerHeight * .65) - 20))}px`; } }}><summary><Tags size={15}/>My Tags{personal.labelIds.length > 0 && ids.length === 1 ? ` (${personal.labelIds.length})` : ''}</summary><div className="teacher-tags-panel">
      <strong>{ids.length > 1 ? `My Tags · ${ids.length} questions` : 'My Tags'}</strong><small>Private teaching preferences</small>
      {!data && !error && <p role="status">Loading tags…</p>}
      {!ids.length && <p>Select questions to apply labels.</p>}
      <div className="teacher-tags-list">{data?.labels.map(label => { const count = ids.filter(id => data.questions[id]?.labelIds.includes(label.id)).length; return <label key={label.id} title={label.description}><input type="checkbox" checked={Boolean(ids.length && count === ids.length)} ref={node => { if (node) node.indeterminate = count > 0 && count < ids.length; }} disabled={!ids.length || busy} onChange={event => patch(event.target.checked ? { add: [label.id] } : { remove: [label.id] })}/>{label.name}{count > 0 && ids.length > 1 ? ` (${count}/${ids.length})` : ''}</label>; })}</div>
      {ids.length > 1 && <div className="teacher-tags-actions"><button type="button" disabled={busy} onClick={() => patch({ favorite: true })}>Favorite all</button><button type="button" disabled={busy} onClick={() => patch({ favorite: false })}>Unfavorite all</button></div>}
      {ids.length === 1 && <label>Private note<textarea maxLength={3000} rows={3} placeholder="A teaching reminder for this question" value={note ?? personal.note} onChange={event => setNote(event.target.value)}/><button type="button" disabled={busy || note === undefined} onClick={async () => { if (await patch({ note })) setNote(undefined); }}>Save note</button></label>}
      <LabelManager />
      {error && <p role="alert">{error} <button type="button" onClick={() => window.dispatchEvent(new Event("studio:teacher-labels-changed"))}>Reload tags</button></p>}
    </div></details>
  </div>;
}

function LabelManager() {
  const { data, busy, save } = useTeacherLabels();
  const [id, setId] = useState(''), [name, setName] = useState(''), [description, setDescription] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  return <details className="teacher-label-manager"><summary>Create / manage labels</summary><label>Label<select value={id} onChange={event => { const label = data?.labels.find(item => item.id === event.target.value); setId(label?.id ?? ''); setName(label?.name ?? ''); setDescription(label?.description ?? ''); setConfirmDelete(false); }}><option value="">Create new label</option>{data?.labels.map(label => <option key={label.id} value={label.id}>{label.name}</option>)}</select></label><label>Name<input maxLength={120} value={name} onChange={event => setName(event.target.value)}/></label><label>Description · optional<input maxLength={500} value={description} onChange={event => setDescription(event.target.value)}/></label><div className="teacher-tags-actions"><button type="button" disabled={!data || busy || !name.trim()} onClick={async () => { if (await save({ action: id ? 'edit' : 'create', id, name, description })) { setId(''); setName(''); setDescription(''); } }}>{id ? 'Save label' : 'Create label'}</button>{id && <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)}>Delete label</button>}</div>{confirmDelete && <p>Remove this label from all your questions? Notes and favorites stay.<button type="button" disabled={busy} onClick={async () => { if (await save({ action: 'delete', id })) { setId(''); setName(''); setDescription(''); setConfirmDelete(false); } }}>Confirm delete</button><button type="button" onClick={() => setConfirmDelete(false)}>Cancel</button></p>}</details>;
}
