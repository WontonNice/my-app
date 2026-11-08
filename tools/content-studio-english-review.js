/* Review metadata belongs to the saved bank; drafts remain in their import workflow. */
const EnglishReviewStudio = {
  rows: [], selected: new Set(), filters: {}, related: null, busy: false,
  async mount() {
    const root = document.getElementById('english-review-view');
    if (!root.dataset.mounted) {
      root.dataset.mounted = 'true';
      root.innerHTML = `<section class="english-review-panel"><header class="english-review-heading"><div><h1>English command center</h1><p>Review Rev/Edit A and standalone questions across your exams.</p></div><button type="button" class="secondary" data-review-refresh>Refresh library</button></header><p class="english-review-summary" role="status"></p><div class="english-review-filters"><label>Find a question<input type="search" data-review-filter="search" placeholder="Question, passage, source, or ID"></label><label>Section<select data-review-filter="section"><option value="">Both sections</option><option value="part-a">Rev/Edit A</option><option value="standalone">Standalone</option></select></label><label>Exam<select data-review-filter="exam"><option value="">All exams and unassigned</option><option value="unassigned">Unassigned</option></select></label><label>Review status<select data-review-filter="status"><option value="">All statuses</option><option value="needs-review">Needs review</option><option value="finished">Finished</option><option value="draft">Drafts</option></select></label><label>Topic<select data-review-filter="topic"><option value="">All topics</option></select></label><label class="review-check"><input type="checkbox" data-review-filter="duplicates">Possible repeats only</label></div><div class="english-review-actions"><label class="review-check"><input type="checkbox" data-review-select-all>Select all shown saved questions</label><span data-review-selected>0 selected</span><button type="button" data-review-finish>Mark selected finished</button><button type="button" class="secondary" data-review-reopen>Mark needs review</button><button type="button" class="secondary" data-review-reset hidden>Clear repeat group</button></div><p class="english-review-message" role="status">Loading questions…</p><p class="english-review-help">Finished applies to this saved version. Editing it requires review again. Drafts must be reviewed and published in their editor. Possible repeats are suggestions; source formatting can differ.</p><div class="english-review-table-wrap" tabindex="0" role="region" aria-label="English review questions"><table class="english-review-table"><thead><tr><th scope="col">Select</th><th scope="col">Question</th><th scope="col">Topic</th><th scope="col">Appears in exams</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody></tbody></table></div></section>`;
      root.querySelector('[data-review-refresh]').onclick = () => this.load();
      root.querySelectorAll('[data-review-filter]').forEach(el => el.addEventListener(el.type === 'search' ? 'input' : 'change', () => {
        this.filters[el.dataset.reviewFilter] = el.type === 'checkbox' ? el.checked : el.value; this.selected.clear(); this.render();
      }));
      root.querySelector('[data-review-select-all]').onchange = event => {
        this.selected = new Set(event.target.checked ? this.visible().filter(r => !r.draft).map(r => r.key) : []); this.render();
      };
      root.querySelector('[data-review-finish]').onclick = () => this.save(true);
      root.querySelector('[data-review-reopen]').onclick = () => this.save(false);
      root.querySelector('[data-review-reset]').onclick = () => { this.related = null; this.selected.clear(); this.render(); };
    }
    await this.load();
  },
  async load() {
    if (this.busy) return;
    this.busy = true; this.controls(); this.message('Loading review status…');
    try {
      const state = await api('/api/english-review'); this.rows = state.rows; this.revision = state.revision; this.selected.clear();
      const root = document.getElementById('english-review-view');
      const exams = new Map(this.rows.flatMap(r => r.exams).map(e => [e.id, e.title]));
      root.querySelector('[data-review-filter="exam"]').innerHTML = '<option value="">All exams and unassigned</option><option value="unassigned">Unassigned</option>' + [...exams].sort((a,b) => a[1].localeCompare(b[1], undefined, {numeric:true})).map(([id,title]) => `<option value="${escapeHtml(id)}">${escapeHtml(title)}</option>`).join('');
      root.querySelector('[data-review-filter="topic"]').innerHTML = '<option value="">All topics</option>' + [...new Set(this.rows.map(r => r.topic))].sort().map(topic => `<option>${escapeHtml(topic)}</option>`).join('');
      for (const name of ['exam', 'topic']) { const el = root.querySelector(`[data-review-filter="${name}"]`); el.value = this.filters[name] || ''; if (!el.value) this.filters[name] = ''; }
      this.message(''); this.render();
    } catch (error) { this.message(error.message + ' Use Refresh library to retry.', true); }
    finally { this.busy = false; this.controls(); }
  },
  visible() {
    const f = this.filters, query = (f.search || '').trim().toLowerCase();
    return this.rows.filter(r => (!f.section || r.section === f.section) && (!f.status || r.status === f.status) && (!f.topic || r.topic === f.topic)
      && (!f.exam || (f.exam === 'unassigned' ? !r.exams.length : r.exams.some(e => e.id === f.exam)))
      && (!f.duplicates || r.duplicates.length) && (!this.related || this.related.has(r.key))
      && (!query || [r.key,r.title,r.prompt,r.question.stimulus,r.context,r.topic,...r.exams.map(e=>e.title)].join(' ').toLowerCase().includes(query)));
  },
  message(value, error = false) {
    const el = document.querySelector('.english-review-message'); if (!el) return;
    el.textContent = value; el.classList.toggle('is-error', error);
  },
  controls() {
    const root = document.getElementById('english-review-view');
    root.querySelectorAll('button,input,select').forEach(el => el.disabled = this.busy);
    root.querySelector('[data-review-finish]').disabled = this.busy || !this.selected.size;
    root.querySelector('[data-review-reopen]').disabled = this.busy || !this.selected.size;
    root.querySelectorAll('[data-review-pick]').forEach(el => { if (this.rows.find(r=>r.key===el.dataset.reviewPick)?.draft) el.disabled = true; });
  },
  render() {
    const root = document.getElementById('english-review-view'), rows = this.visible(), saved = rows.filter(r=>!r.draft);
    root.querySelector('.english-review-summary').innerHTML = [
      [this.rows.length, 'Total questions'],
      [this.rows.filter(r=>r.status==='needs-review').length, 'Need review'],
      [this.rows.filter(r=>r.status==='finished').length, 'Finished'],
      [this.rows.filter(r=>r.draft).length, 'Drafts'],
    ].map(([count,label])=>`<span><strong>${count}</strong><span>${label}</span></span>`).join('');
    root.querySelector('[data-review-select-all]').closest('label').title = `${rows.length} questions shown; drafts cannot be selected`;
    root.querySelector('[data-review-selected]').textContent = `${this.selected.size} selected; ${rows.length} shown`;
    const all = root.querySelector('[data-review-select-all]'); all.checked = saved.length > 0 && saved.every(r=>this.selected.has(r.key)); all.indeterminate = this.selected.size > 0 && !all.checked;
    root.querySelector('[data-review-reset]').hidden = !this.related;
    root.querySelector('tbody').innerHTML = rows.length ? rows.map(r => `<tr><td><input type="checkbox" data-review-pick="${escapeHtml(r.key)}" aria-label="Select ${escapeHtml(r.title + ': ' + r.prompt.slice(0,70))}" ${this.selected.has(r.key) ? 'checked' : ''} ${r.draft ? 'disabled' : ''}></td><td><span class="review-section">${r.section === 'part-a' ? 'Rev/Edit A' : 'Standalone'}</span><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.prompt.slice(0,220))}${r.prompt.length > 220 ? '…' : ''}</p><details><summary>Question details</summary><p>${escapeHtml(r.prompt)}</p>${r.question.stimulus ? `<p>${escapeHtml(r.question.stimulus)}</p>` : ''}${r.context ? `<details><summary>Passage context</summary><p>${escapeHtml(r.context)}</p></details>` : ''}<ol type="A">${(r.question.choices || []).map(c=>`<li>${escapeHtml(c.text || PartBBank.text(c.html))}${c.id === r.question.correctChoiceId ? ' (correct)' : ''}</li>`).join('')}</ol><small>${escapeHtml(r.key)}</small><p>Open the editor to inspect source formatting and interactive answer types.</p></details></td><td>${escapeHtml(r.topic)}</td><td>${r.exams.length ? r.exams.map(e=>escapeHtml(e.title)).join('<br>') : 'Unassigned'}</td><td><span class="review-status review-status-${r.status}">${({draft:'Draft',finished:'Finished','needs-review':'Needs review'})[r.status]}</span>${r.blocked ? `<small>${escapeHtml(r.blocked)}</small>` : ''}</td><td><button type="button" class="secondary" data-review-open="${escapeHtml(r.key)}">Open editor</button>${r.duplicates.length ? `<button type="button" class="secondary" data-review-related="${escapeHtml(r.key)}">${r.duplicates.length} possible repeat${r.duplicates.length === 1 ? '' : 's'}</button>` : ''}</td></tr>`).join('') : '<tr><td colspan="6">No questions match these filters. Change a filter or clear the repeat group.</td></tr>';
    root.querySelectorAll('[data-review-pick]').forEach(el=>el.onchange=()=>{ if(el.checked)this.selected.add(el.dataset.reviewPick);else this.selected.delete(el.dataset.reviewPick);this.render(); });
    root.querySelectorAll('tbody tr').forEach(tr => [...tr.cells].forEach((cell,index) => { cell.dataset.label = ['Select', 'Question', 'Topic', 'Appears in exams', 'Status', 'Actions'][index]; }));
    root.querySelectorAll('[data-review-open]').forEach(el=>el.onclick=()=>this.open(this.rows.find(r=>r.key===el.dataset.reviewOpen)));
    root.querySelectorAll('[data-review-related]').forEach(el=>el.onclick=()=>{
      const r=this.rows.find(r=>r.key===el.dataset.reviewRelated); this.related = new Set([r.key,...r.duplicates]); this.selected.clear();
      this.filters={}; root.querySelectorAll('[data-review-filter]').forEach(el=>{if(el.type==='checkbox')el.checked=false;else el.value='';}); this.render();
    });
    this.controls();
  },
  async save(finished) {
    if (this.busy || !this.selected.size || app.saving) return;
    if (app.passageDirty || app.standaloneDirty || [...(app.passageWorkspaceDrafts?.values() || [])].some(d=>d.dirty)) { this.message('Save your English editor changes before changing review status.', true); return; }
    this.busy = true; this.controls(); this.message('Saving review status…');
    try {
      const items = this.rows.filter(r=>this.selected.has(r.key)).map(({key,hash})=>({key,hash}));
      const result = await api('/api/english-review', {method:'POST',body:JSON.stringify({revision:this.revision,items,finished})});
      this.revision = result.revision;
      for(const r of this.rows) if(this.selected.has(r.key))r.status=finished?'finished':'needs-review';
      this.selected.clear(); this.render(); this.message(`${result.changed} questions marked ${finished?'finished':'needs review'}.`);
    } catch(error) {this.message(error.message,true);}
    finally {this.busy=false;this.controls();}
  },
  async open(row) {
    if (this.busy || app.saving) return;
    const location=row.location;
    if(location.kind==='standalone'||location.kind==='legacy-draft') {switchTab('standalone');selectStandaloneItem(location.kind==='standalone'?location.id:app.state.standaloneImportDrafts.find(e=>e.id===location.id)?.question.id);}
    else if(location.kind==='document-draft') {await DocumentStudio.library();await DocumentStudio.open(location.id,location.questionId);}
    else {
      switchTab('part-a'); selectPassage(location.id);
      if (app.selectedPassageId === location.id) {
        const index = app.passageDraft.questions.findIndex(q=>q.id===location.questionId);
        if(index >= 0) {studioUI.selectedQuestionIndex=index;studioUI.selectedQuestionId=location.questionId;renderPassageEditor();}
      }
    }
  },
};
