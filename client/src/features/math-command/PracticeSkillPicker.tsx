import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Plus, Search, Trash2 } from 'lucide-react';
import type { ManagedPracticeModule } from '../../../../server/src/shared/practiceCatalog';
import type { MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';
import { jsonRequest, type MathCommandRequest } from './client';
import type { SkilledSnapshot } from './SkilledManager';

type Props = {
  module: ManagedPracticeModule;
  request: MathCommandRequest;
  onChoose: (skill: MathClassificationSkill) => void;
  onSkillsChanged: (snapshot: SkilledSnapshot) => void;
  onBusyChange: (busy: boolean) => void;
};

export function PracticeSkillPicker({ module, request, onChoose, onSkillsChanged, onBusyChange }: Props) {
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<SkilledSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [candidateId, setCandidateId] = useState(module.skilled ?? '');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [newCategory, setNewCategory] = useState(module.category);
  const [newTopic, setNewTopic] = useState(module.topic);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    request<SkilledSnapshot>('/classification-skills').then(next => {
      if (active) { setSnapshot(next); onSkillsChanged(next); }
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Skills could not be loaded.'); });
    return () => { active = false; };
  }, [request, onSkillsChanged]);

  const selected = snapshot?.skills.find(skill => skill.id === module.skilled);
  const matches = snapshot?.skills.filter(skill => (!category || skill.category === category)
    && (!topic || skill.subcategory === topic)
    && `${skill.label} ${skill.category} ${skill.subcategory}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())) ?? [];
  const candidate = matches.find(skill => skill.id === candidateId);
  const hasGenerators = module.includeAll || module.generatorIds.length > 0;
  const differentScope = candidate && (candidate.category !== module.category || candidate.subcategory !== module.topic);
  const deleteSkill = snapshot?.skills.find(skill => skill.id === deleting);
  const topics = [...new Set(snapshot?.categories.filter(item => !category || item.label === category).flatMap(item => item.topics) ?? [])];
  const duplicate = snapshot?.skills.some(skill => skill.category === newCategory && skill.subcategory === newTopic && skill.label.toLocaleLowerCase() === name.trim().toLocaleLowerCase());

  async function reload() {
    setBusy(true); onBusyChange(true); setError(''); setDeleting(null);
    try { const next = await request<SkilledSnapshot>('/classification-skills'); setSnapshot(next); onSkillsChanged(next); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Skills could not be loaded.'); }
    finally { setBusy(false); onBusyChange(false); }
  }
  async function saveSkills(skills: MathClassificationSkill[], created?: MathClassificationSkill) {
    if (!snapshot || busy) return;
    setBusy(true); onBusyChange(true); setError(''); setNotice('');
    try {
      const next = await request<SkilledSnapshot>('/classification-skills', jsonRequest('POST', { revision: snapshot.revision, skills }));
      setSnapshot(next); onSkillsChanged(next); setDeleting(null);
      if (created) {
        onChoose(created); setCandidateId(created.id); setCreating(false); setName(''); setSearch(''); setCategory(created.category); setTopic(created.subcategory); setOpen(false); trigger.current?.focus();
        setNotice('Skill created in your shared list. Save changes to apply it to this module.');
      } else {
        setCandidateId('');
        setNotice('Skill deleted from the shared list. Existing modules and generators are kept; assign a replacement where needed.');
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Skills could not be saved.'); }
    finally { setBusy(false); onBusyChange(false); }
  }
  function create() {
    if (!snapshot || !name.trim() || !newCategory || !newTopic || duplicate) return;
    const skill = { id: crypto.randomUUID(), label: name.trim(), category: newCategory, subcategory: newTopic };
    void saveSkills([...snapshot.skills, skill], skill);
  }
  return <section className="ps-skill-picker" aria-label="Module skill">
    <span className="ps-skill-label" id={`${panelId}-label`}>Skill</span>
    <button ref={trigger} className="ps-skill-trigger" type="button" aria-labelledby={`${panelId}-label ${panelId}-value`} aria-expanded={open} aria-controls={panelId} disabled={busy} onClick={() => setOpen(!open)}>
      <span id={`${panelId}-value`}>{selected?.label ?? 'Choose a skill'}<small>{selected ? `${selected.category} / ${selected.subcategory}` : 'Search your shared skills or create one'}</small></span><ChevronDown size={18} aria-hidden="true" />
    </button>
    {!selected && snapshot && <p className="ps-note">This module keeps its current name, “{module.title}”, until you assign a saved skill.</p>}
    {error && <p className="ps-message is-error" role="alert">{error}<button type="button" disabled={busy} onClick={() => void reload()}>Reload skills</button></p>}
    {notice && <p className="ps-note" role="status">{notice}</p>}
    {open && <div className="ps-skill-panel" id={panelId}>
      {!snapshot ? <p role="status">{error ? 'Skills are unavailable. Reload to try again.' : 'Loading your skills…'}</p> : <fieldset disabled={busy}>
        <label>Search skills<div className="ps-skill-search"><Search size={16} aria-hidden="true"/><input type="search" value={search} onChange={event => { setSearch(event.target.value); setDeleting(null); }} placeholder="Find a saved skill…" /></div></label>
        <div className="ps-fields">
          <label>Filter skills by category<select value={category} onChange={event => { setCategory(event.target.value); setTopic(''); setDeleting(null); }}><option value="">All categories</option>{snapshot.categories.map(item => <option key={item.label}>{item.label}</option>)}</select></label>
          <label>Filter skills by subcategory<select value={topic} onChange={event => { setTopic(event.target.value); setDeleting(null); }}><option value="">All subcategories</option>{topics.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <label>Existing skills<select size={Math.min(6, Math.max(2, matches.length + 1))} value={candidate?.id ?? ''} onChange={event => { setCandidateId(event.target.value); setDeleting(null); }}>
          <option value="" disabled>Choose a skill from the results</option>
          {matches.map(skill => <option key={skill.id} value={skill.id}>{skill.label} · {skill.category} / {skill.subcategory}</option>)}
        </select></label>
        <p className="ps-note" role="status">{matches.length ? `${matches.length} skill${matches.length === 1 ? '' : 's'} found` : 'No skills match. Clear the filters or create a skill.'}</p>
        {candidate && <p className="ps-note">Selected: {candidate.label} · {candidate.category} / {candidate.subcategory}</p>}
        <div className="ps-skill-actions">
          <button className="ps-primary" type="button" disabled={!candidate || Boolean(hasGenerators && differentScope)} onClick={() => { if (candidate) { onChoose(candidate); setOpen(false); trigger.current?.focus(); setNotice('Skill selected. Save changes to apply the module name and category.'); } }}>Use selected skill</button>
          <button type="button" onClick={() => { setCreating(!creating); setDeleting(null); setNewCategory(hasGenerators ? module.category : category || module.category); setNewTopic(hasGenerators ? module.topic : topic || (category && category !== module.category ? snapshot.categories.find(item => item.label === category)?.topics[0] ?? '' : module.topic)); }}><Plus size={15}/>Create skill</button>
          <button className="ps-delete" type="button" disabled={!candidate} onClick={() => setDeleting(candidate!.id)}><Trash2 size={15}/>Delete selected skill</button>
          {(category || topic || search) && <button type="button" onClick={() => { setCategory(''); setTopic(''); setSearch(''); setDeleting(null); }}>Clear skill filters</button>}
          <button type="button" onClick={() => void reload()}>Refresh skills</button>
        </div>
        {hasGenerators && differentScope && <p className="ps-note">This module already contains generators in {module.category} / {module.topic}. Choose a skill there, or add a new module for this skill.</p>}
        {deleteSkill && <div className="ps-skill-confirm" role="alert">
          <p>Delete “{deleteSkill.label}” from your shared skills? Linked question classifications return to TBD. Practice modules and generators remain, and can be assigned another skill.</p>
          <div className="ps-skill-actions"><button type="button" className="ps-delete" onClick={() => void saveSkills(snapshot.skills.filter(skill => skill.id !== deleteSkill.id))}>Delete skill</button><button type="button" onClick={() => setDeleting(null)}>Cancel deletion</button></div>
        </div>}
        {creating && <div className="ps-skill-create">
          <h3>Create a skill</h3>
          <label>New skill name<input value={name} maxLength={120} onChange={event => setName(event.target.value)} /></label>
          <div className="ps-fields"><label>New skill category<select disabled={hasGenerators} value={newCategory} onChange={event => { setNewCategory(event.target.value); setNewTopic(snapshot.categories.find(item => item.label === event.target.value)?.topics[0] ?? ''); }}>{snapshot.categories.map(item => <option key={item.label}>{item.label}</option>)}</select></label>
          <label>New skill subcategory<select disabled={hasGenerators} value={newTopic} onChange={event => setNewTopic(event.target.value)}>{snapshot.categories.find(item => item.label === newCategory)?.topics.map(item => <option key={item}>{item}</option>)}</select></label></div>
          {duplicate && <p role="alert">That skill already exists in this subcategory. Select it from the list above.</p>}
          <div className="ps-skill-actions"><button type="button" disabled={!name.trim() || !newCategory || !newTopic || duplicate} onClick={create}>Create and use skill</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>
        </div>}
        <p className="ps-note">Shared skill creation and deletion save immediately. Choosing a skill also sets this module’s Category and Subcategory; save the module with Save changes.</p>
      </fieldset>}
    </div>}
  </section>;
}
