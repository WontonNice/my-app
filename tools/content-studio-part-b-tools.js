const PartBTools = {
  records() {
    const records = [...app.state.standaloneItems.filter(q => !q.duplicateOf), ...(app.state.standaloneImportDrafts || []).map(entry => ({ ...entry.question, importDraftId: entry.id }))];
    return app.standaloneDirty && app.standaloneDraft ? [...records.filter(q => q.id !== app.standaloneDraft.id), { ...app.standaloneDraft, unsaved: true }] : records;
  },
  tagsMarkup(item) {
    return `<span class="studio-part-b-tags">${PartBBank.labels(item).map(label => `<span class="passage-version-tag">${escapeHtml(label)}</span>`).join('') || '<small>No source tags yet</small>'}</span>`;
  },
  mount() {
    this.renderTags();
    const root = document.querySelector('.studio-part-b-workspace');
    if (!root) return;
    const summary = document.createElement('section');
    summary.className = 'studio-part-b-sources'; summary.id = 'studio-part-b-sources';
    root.querySelector('.studio-part-b-toolbar').before(summary);
    const button = studioUI.element('button', 'secondary', 'Check repeats');
    button.type = 'button'; button.onclick = () => this.openRepeats(app.standaloneDraft.id);
    root.querySelector('.standalone-item-actions').append(button);
    this.renderSummary();
  },
  setTags(values) {
    Object.assign(app.standaloneDraft, PartBBank.withLabels(app.standaloneDraft, values));
    markStandaloneDirty(); this.renderTags(); this.renderSummary();
  },
  renderTags() {
    const root = document.getElementById('standalone-version-tags'); if (!root) return;
    const values = PartBBank.labels(app.standaloneDraft);
    const suggestions = PartBBank.labels({ versionLabels: [...app.state.standaloneItems.flatMap(PartBBank.labels), ...(app.state.tests || []).map(test => test.title)] }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    root.innerHTML = `<strong>Source tests / versions <small>Teacher only</small></strong><div class="studio-part-b-tags">${values.map((value, i) => `<span class="passage-version-tag">${escapeHtml(value)} <button type="button" data-remove-tag="${i}" aria-label="Remove tag ${escapeHtml(value)}">×</button></span>`).join('')}</div><div class="studio-part-b-add-tag"><input id="part-b-tag-input" aria-label="Add a source test or version tag" list="part-b-tag-suggestions" placeholder="Choose or type an exam / form"><button type="button" id="part-b-tag-add">Add tag</button></div><datalist id="part-b-tag-suggestions">${suggestions.map(value => `<option value="${escapeHtml(value)}">`).join('')}</datalist><small>Press Enter or Add tag. A reused question can have several tags. Tags do not assign it to an exam.</small>`;
    const add = () => {
      const input = root.querySelector('input');
      if (!input.value.trim()) return;
      this.setTags([...values, input.value]); document.getElementById('part-b-tag-input')?.focus();
    };
    root.querySelector('#part-b-tag-add').onclick = add;
    root.querySelector('input').onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); add(); } };
    root.querySelectorAll('[data-remove-tag]').forEach(button => button.onclick = () => this.setTags(values.filter((_, i) => i !== Number(button.dataset.removeTag))));
  },
  renderSummary() {
    const root = document.getElementById('studio-part-b-sources'); if (!root) return;
    const draft = app.standaloneDraft, items = app.state.standaloneItems;
    const usage = PartBBank.usage(draft, items, app.state.tests || []);
    const versions = PartBBank.versions(draft, items);
    const repeats = this.records().filter(item => item.id !== draft.id && PartBBank.match(draft, item));
    root.innerHTML = `<div><strong>Source versions</strong> ${this.tagsMarkup(draft)}</div><small>Used in saved exams: ${usage.length ? usage.map(test => escapeHtml(test.title)).join(' · ') : 'Not assigned yet'}</small><div>${versions.length > 1 ? `<button type="button" data-view-sources>${versions.length} retained source versions</button>` : ''}${repeats.length ? `<button type="button" class="studio-part-b-repeat-alert" data-view-repeats>${repeats.length} possible repeat${repeats.length === 1 ? '' : 's'} · Compare</button>` : ''}</div>`;
    root.querySelectorAll('button').forEach(button => button.onclick = () => this.openRepeats(draft.id));
  },
  card(item) {
    const usage = PartBBank.usage(item, app.state.standaloneItems, app.state.tests || []);
    const choices = item.choices || item.items || [];
    return `<article class="studio-part-b-repeat-copy">${this.tagsMarkup(item)}<small>${item.unsaved ? 'Current unsaved question' : item.importDraftId ? 'Imported draft' : 'Saved source version'} · ${escapeHtml(item.topic || 'Unclassified')}</small><p><strong>${escapeHtml(PartBBank.text(item.promptHtml || item.prompt))}</strong></p><p>${escapeHtml(PartBBank.text(item.stimulusHtml || item.stimulus))}</p><ol type="A">${choices.map(choice => `<li>${escapeHtml(PartBBank.text(choice.html || choice.text))}${choice.id === item.correctChoiceId || item.correctPlacements?.[choice.id] ? ' ✓' : ''}</li>`).join('')}</ol>${item.explanation ? `<details><summary>Source explanation</summary><p>${escapeHtml(item.explanation).replaceAll('\n', '<br>')}</p></details>` : '<small>No explanation</small>'}<small>Saved exams: ${usage.map(test => escapeHtml(test.title)).join(', ') || 'Not assigned yet'}</small>${item.unsaved ? '' : `<button type="button" data-open-copy="${escapeHtml(item.id)}">Open in editor</button>`}</article>`;
  },
  openRepeats(focusId = '') {
    let dialog = document.getElementById('part-b-repeats-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'part-b-repeats-dialog'; dialog.className = 'studio-import-dialog'; document.body.append(dialog); }
    this.focusId = focusId;
    this.renderRepeats();
    if (!dialog.open) dialog.showModal();
  },
  renderRepeats(query = '') {
    const dialog = document.getElementById('part-b-repeats-dialog');
    const records = this.records(), pairs = PartBBank.pairs(records);
    const focused = app.state.standaloneItems.find(q => q.id === this.focusId);
    const sources = focused ? PartBBank.versions(focused, app.state.standaloneItems) : [];
    const search = query.toLowerCase();
    const matches = pairs.filter(pair => (!this.focusId || [pair.left.id, pair.right.id].includes(this.focusId)) && [pair.left, pair.right].some(q => `${q.prompt} ${q.stimulus} ${PartBBank.labels(q).join(' ')}`.toLowerCase().includes(search)));
    dialog.innerHTML = `<section class="panel"><div class="panel-head"><div><h2>Part B repeats</h2><p>${pairs.filter(p => p.canCombine).length} matching pairs · ${pairs.filter(p => !p.canCombine).length} pairs to check</p></div><button type="button" id="part-b-repeats-close">Close</button></div><p>Compare saved content before combining. The chosen copy becomes the bank question with both sets of source tags. Existing exam question IDs and source versions stay intact.</p>${app.standaloneDirty ? '<p class="studio-part-b-repeat-alert">You have unsaved edits. Save them before combining copies.</p>' : ''}<div class="studio-part-b-add-tag"><input id="part-b-repeat-search" aria-label="Search repeats" placeholder="Search a sentence or source test" value="${escapeHtml(query)}">${this.focusId ? '<button type="button" id="part-b-show-all">Show all questions</button>' : ''}</div><p role="status" id="part-b-repeat-status"></p>${sources.length > 1 ? `<details open><summary>Retained source versions (${sources.length})</summary><p>One bank question, with the original versions kept for existing exam references.</p><div class="studio-part-b-repeat-grid">${sources.map(q => this.card(q)).join('')}</div></details>` : ''}${matches.slice(0, 100).map((pair, i) => `<section class="studio-part-b-repeat-group"><h3>${escapeHtml(pair.label)}</h3><p>${escapeHtml(pair.reason)}</p><div class="studio-part-b-repeat-grid">${this.card(pair.left)}${this.card(pair.right)}</div>${pair.canCombine && !pair.left.importDraftId && !pair.right.importDraftId ? `<div class="studio-part-b-add-tag"><button type="button" data-keep-pair="${i}:left" ${app.standaloneDirty ? 'disabled' : ''}>Keep left bank copy</button><button type="button" data-keep-pair="${i}:right" ${app.standaloneDirty ? 'disabled' : ''}>Keep right bank copy</button></div>` : pair.canCombine ? '<p>Finish & save the imported draft to reuse the matching bank question and combine its source tags.</p>' : ''}</section>`).join('') || '<p>No uncombined repeats match this view.</p>'}${matches.length > 100 ? '<p>Showing the first 100 pairs. Use search to narrow the results.</p>' : ''}</section>`;
    dialog.querySelector('#part-b-repeats-close').onclick = () => dialog.close();
    dialog.querySelector('#part-b-show-all')?.addEventListener('click', () => { this.focusId = ''; this.renderRepeats(query); });
    dialog.querySelector('#part-b-repeat-search').oninput = event => {
      const position = event.target.selectionStart;
      this.renderRepeats(event.target.value);
      const input = dialog.querySelector('#part-b-repeat-search'); input.focus(); input.setSelectionRange(position, position);
    };
    dialog.querySelectorAll('[data-open-copy]').forEach(button => button.onclick = () => {
      if (app.saving) return;
      selectStandaloneItem(button.dataset.openCopy);
      // A retained source version opens its editable primary bank question.
      if (!app.standaloneDirty) { switchTab('standalone'); dialog.close(); }
    });
    dialog.querySelectorAll('[data-keep-pair]').forEach(button => button.onclick = () => {
      const [index, side] = button.dataset.keepPair.split(':');
      const pair = matches[Number(index)]; this.combine(pair[side], pair[side === 'left' ? 'right' : 'left']);
    });
  },
  async combine(keep, other) {
    if (app.saving || app.standaloneDirty) return;
    if (!window.confirm(`Use the ${PartBBank.labels(keep).join(' / ') || 'selected'} copy as the bank question?\n\nSource tags will be combined. Existing exam questions retain their current wording, answers and IDs.`)) return;
    const dialog = document.getElementById('part-b-repeats-dialog');
    app.saving = true; dialog.inert = true;
    try {
      const result = await api('/api/standalone-items/combine', { method: 'POST', body: JSON.stringify({ keepId: keep.id, removeId: other.id, sourceHash: app.state.standaloneSourceHash }) });
      app.state.standaloneItems = result.items; app.state.standaloneSourceHash = result.sourceHash;
      app.selectedStandaloneItemId = result.item.id; app.standaloneDraft = clone(result.item); app.standaloneDirty = false;
      renderStandaloneList(); renderStandaloneEditor(); this.focusId = result.item.id; this.renderRepeats();
      setStatus('Repeated question combined. Both source tags and existing exam versions were kept.', 'success');
    } catch (error) { dialog.querySelector('#part-b-repeat-status').textContent = error.message; }
    finally { app.saving = false; dialog.inert = false; studioUI.syncSaveState(); }
  },
};
