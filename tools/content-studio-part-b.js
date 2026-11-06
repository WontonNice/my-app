/* Part B uses the same authoring surface as Reading and Part A. Only storage differs. */
const PartBWorkspace = {
  mount() {
    const question = app.standaloneDraft;
    if (!question) return;
    const editor = document.getElementById('passage-editor');
    if (!this.previous) {
      this.previous = { parent: editor.parentNode, next: editor.nextSibling, draft: app.passageDraft, id: app.selectedPassageId, dirty: app.passageDirty, mode: app.passageMode, library: app.passageLibrary };
    }
    if (!app.passageDraft?.partBEditor || app.passageDraft.questions[0] !== question) {
      app.passageDraft = { ...defaultPassage(), id: `part-b-editor-${question.id}`, title: '', format: 'prose', preserveSourceLayout: true, text: question.stimulus || '', richText: question.stimulusHtml || '', questions: [question], section: 'revising_editing_a', partBEditor: true };
      app.selectedPassageId = app.passageDraft.id;
      app.passageMode = 'exam'; app.passageDirty = app.standaloneDirty;
      studioUI.passageContext = '';
    }
    const host = document.getElementById('standalone-editor');
    if (editor.parentNode !== host) { host.replaceChildren(editor); }
    renderPassageEditor();
    editor.querySelector('.editor-head h1').textContent = 'Part B question';
    const destination = editor.querySelector('.studio-publish-exam');
    if (destination) destination.hidden = true;
    editor.querySelector('#save-passage').textContent = question.documentDraftId || question.importDraftId ? 'Save draft' : 'Save Part B question';
    editor.querySelector('#open-student-preview').onclick = openStandaloneStudentPreview;
    for (const id of ['create-passage-version', 'delete-passage', 'add-question']) editor.querySelector('#' + id)?.setAttribute('hidden', '');
    editor.querySelectorAll('.studio-direct-question button').forEach(button => { if (button.textContent === '+ Question') button.hidden = true; });
    if (question.importDraftId) {
      const finish = studioUI.element('button', 'secondary', 'Finish & save to bank');
      finish.type = 'button'; finish.onclick = () => { this.sync(); PartBImport.saveCurrent(true); };
      editor.querySelector('.studio-item-actions').append(finish);
    }
    if (question.documentDraftId && destination) {
      destination.hidden = false;
      destination.querySelector('option').textContent = 'Choose an exam';
      const count = PartBImport.documentBase.entry.content.questions.length;
      const publish = studioUI.element('button', 'secondary', `Publish ${count} reviewed questions`);
      publish.type = 'button';
      publish.onclick = async () => {
        const assessmentId = destination.querySelector('select').value;
        if (!assessmentId) { setStatus('Choose a destination exam before publishing.', 'error'); return; }
        if (!await this.save()) return;
        app.saving = true;
        try {
          await api('/api/document-publish-english', { method: 'POST', body: JSON.stringify({ entryId: question.documentDraftId, assessmentId, revision: PartBImport.documentBase.revision }) });
          await reloadState(); renderStandaloneEditor(); setStatus('Reviewed Part B questions published.', 'success');
        } catch (error) { setStatus(error.message, 'error'); }
        finally { app.saving = false; studioUI.syncSaveState(); }
      };
      editor.querySelector('.studio-item-actions').append(publish);
    }
  },
  sync() {
    if (!app.passageDraft?.partBEditor) return;
    const question = app.passageDraft.questions[0];
    question.stimulus = app.passageDraft.text;
    question.stimulusHtml = app.passageDraft.richText;
    app.standaloneDraft = question;
  },
  leave() {
    if (!this.previous) return;
    this.sync();
    const old = this.previous;
    old.parent.insertBefore(document.getElementById('passage-editor'), old.next?.parentNode === old.parent ? old.next : null);
    Object.assign(app, { passageDraft: old.draft, selectedPassageId: old.id, passageDirty: old.dirty, passageMode: old.mode, passageLibrary: old.library });
    this.previous = null; studioUI.passageContext = '';
    renderPassageEditor();
  },
  async save() {
    if (app.saving) return;
    this.sync();
    const question = app.standaloneDraft;
    if (question.documentDraftId) {
      app.saving = true;
      try {
        const base = PartBImport.documentBase;
        if (base?.entry.id !== question.documentDraftId) throw new Error('Reopen the Part B draft before saving. Your edits are retained.');
        const entry = clone(base.entry), saved = clone(question);
        delete saved.documentDraftId;
        const index = entry.content.questions.findIndex(q => q.id === saved.id);
        if (index < 0) throw new Error('The saved question could not be found. Your edits are retained.');
        entry.content.questions[index] = saved;
        const state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ revision: base.revision, entry }) });
        PartBImport.documentBase = { revision: state.revision, entry: clone(state.entries.find(e => e.id === entry.id)) };
        app.standaloneDirty = false; app.passageDirty = false;
        PartBImport.setDocumentState(state);
        renderStandaloneList(); renderStandaloneEditor();
        setStatus('Part B draft saved.', 'success');
        return true;
      } catch (error) { setStatus(error.message, 'error'); return false; }
      finally { app.saving = false; studioUI.syncSaveState(); }
    } else if (question.importDraftId) await PartBImport.saveCurrent();
    else {
      // The ordinary bank save also needs a button for its busy state.
      document.getElementById('save-passage').id = 'save-standalone';
      try { await saveStandaloneItem(); } finally { const button = document.getElementById('save-standalone'); if (button) button.id = 'save-passage'; }
    }
  },
};
const PartBImport = {
  documentState: { revision: 0, entries: [] },
  documentError: '',
  async refreshDocuments() {
    try { this.setDocumentState(await api('/api/document-drafts')); this.documentError = ''; }
    catch (error) { this.documentError = `Imported Part B drafts could not be loaded: ${error.message}`; }
  },
  setDocumentState(state) {
    this.documentState = state;
    const current = app.standaloneDraft;
    if (!current?.documentDraftId || app.standaloneDirty) return;
    const entry = state.entries.find(entry => entry.id === current.documentDraftId && entry.status !== 'published');
    const question = entry?.content.questions.find(question => question.id === current.id);
    if (question) app.standaloneDraft = { ...clone(question), documentDraftId: entry.id };
    else {
      const saved = app.state.standaloneItems.find(question => question.id === current.id);
      app.selectedStandaloneItemId = saved?.id || '';
      app.standaloneDraft = saved ? clone(saved) : null;
    }
  },
  documentRecords() {
    return this.documentState.entries.filter(entry => entry.kind === 'standalone' && entry.status !== 'published')
      .flatMap(entry => entry.content.questions.map(question => ({
        ...question, documentDraftId: entry.id,
        versionLabels: PartBBank.labels({ versionLabels: [...PartBBank.labels(question), ...PartBBank.labels(entry.content), question.source?.label || entry.content.source?.label || ''].filter(Boolean) }),
        source: { ...entry.content.source, ...question.source },
      })));
  },
  sourceLabels(question) {
    const labels = PartBBank.labels(question);
    if (question.source?.label && !labels.includes(question.source.label)) labels.push(question.source.label);
    const titleKey = title => String(title || '').replace(/\s*\((?:hard|medium|easy)\)\s*$/i, '').trim().toLowerCase();
    const exams = (app.state.assessments || []).filter(exam => labels.some(label => titleKey(label) === titleKey(exam.title)));
    return [...new Set([...labels, ...exams.map(exam => exam.examLabel).filter(Boolean), ...(question.source?.sourceFamily === 'sat_crash_course' ? ['SAT Crash Course'] : [])])];
  },
  async selectDocument(entryId, questionId) {
    if (app.saving || !confirmStandaloneDiscard()) return;
    try {
      // Load the revision with the selected content, so another editor's changes
      // cannot be overwritten by the library's older snapshot.
      const state = await api('/api/document-drafts');
      this.setDocumentState(state);
      const entry = state.entries.find(entry => entry.id === entryId && entry.kind === 'standalone' && entry.status !== 'published');
      const question = entry?.content.questions.find(question => question.id === questionId);
      if (!question) throw new Error('This imported draft has changed or was published. Refresh the Part B library.');
      app.selectedStandaloneItemId = '';
      app.standaloneDraft = { ...clone(question), documentDraftId: entry.id };
      app.standaloneDirty = false;
      this.documentBase = { revision: state.revision, entry: clone(entry) };
      renderStandaloneList(); renderStandaloneEditor();
      setStatus('Editing saved Part B draft. Use Save draft to keep your changes.');
    } catch (error) { setStatus(error.message, 'error'); }
  },
  async open() {
    let dialog = document.getElementById('part-b-import-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'part-b-import-dialog'; dialog.className = 'studio-import-dialog'; document.body.append(dialog); }
    if (!dialog.querySelector('#part-b-import-source')) {
      dialog.innerHTML = `<section class="panel"><div class="panel-head"><h2>Import Part B questions</h2><button type="button" id="part-b-import-close">Close</button></div>
        <label>Import format<select id="part-b-import-format"><option value="document">Part B / ChatGPT JSON</option><option value="satcc">SAT Crash Course Reader · Part B</option></select></label>
        <p id="part-b-import-help">Copy the prompt into ChatGPT with your source screenshots or PDF. Paste its JSON here or choose JSON files. Import one question or a batch directly into the Part B editor.</p>
        <button type="button" id="part-b-copy-prompt" disabled>Copy ChatGPT prompt</button>
        <details><summary>View extraction prompt</summary><textarea id="part-b-import-prompt" readonly rows="10" aria-label="Part B extraction prompt"></textarea></details>
        <label>JSON files<input type="file" id="part-b-import-files" accept=".json,application/json" multiple></label>
        <label>Or paste Part B JSON<textarea id="part-b-import-source" rows="12" spellcheck="false" placeholder='{"question":{"type":"multiple_choice","prompt":"…","stimulus":"…","choices":[],"correctChoiceId":""}}'></textarea></label>
        <p>Imports appear in red as <strong>Needs editing</strong>. Missing answers stay blank. Save your draft at any time; use <strong>Finish & save to bank</strong> when it is ready.</p>
        <button class="primary" type="button" id="part-b-import-submit">Import into Part B editor</button><p id="part-b-import-status" role="status"></p></section>`;
      const message = dialog.querySelector('#part-b-import-status');
      dialog.querySelector('#part-b-import-format').onchange = event => {
        const sat = event.target.value === 'satcc';
        dialog.querySelector('#part-b-import-help').textContent = sat
          ? 'In SAT Crash Course Reader, select Revising/Editing Part B, enter the source question range (Practice Test 3: 47–50), and copy or download JSON. Paste that complete export below. Each question keeps its own paragraph. Word selections become multiple choice; sentence blanks become drag-and-drop answer boxes, with the original interaction retained in source notes.'
          : 'Copy the extraction prompt into ChatGPT with your source. Paste one Part B question or a batch below.';
        dialog.querySelector('#part-b-copy-prompt').hidden = sat;
        dialog.querySelector('#part-b-import-source').placeholder = sat ? 'Paste the complete SAT Crash Course Reader JSON export here' : 'Paste Part B JSON here';
      };
      dialog.querySelector('#part-b-import-close').onclick = () => dialog.close();
      dialog.oncancel = event => { if (dialog.dataset.busy === 'true') event.preventDefault(); };
      dialog.querySelector('#part-b-copy-prompt').onclick = async () => {
        try { await navigator.clipboard.writeText(dialog.querySelector('#part-b-import-prompt').value); message.textContent = 'Part B extraction prompt copied.'; }
        catch { const field = dialog.querySelector('#part-b-import-prompt'); field.closest('details').open = true; field.focus(); field.select(); message.textContent = 'Press Ctrl+C / ⌘C to copy the selected prompt.'; }
      };
      dialog.querySelector('#part-b-import-submit').onclick = async () => {
        dialog.dataset.busy = 'true';
        dialog.querySelectorAll('button, input, textarea, select').forEach(node => node.disabled = true);
        message.textContent = 'Importing Part B questions…';
        try {
          const sources = [];
          for (const file of dialog.querySelector('#part-b-import-files').files) sources.push(await file.text());
          const pasted = dialog.querySelector('#part-b-import-source').value;
          if (pasted.trim()) sources.push(pasted);
          if (!sources.length) throw new Error('Choose JSON files or paste Part B JSON.');
          if (app.standaloneDirty) { await saveStandaloneItem(); if (app.standaloneDirty) throw new Error('Save or finish your current Part B edits before importing. Your edits and import JSON have been kept.'); }
          const result = await api('/api/standalone-import', { method: 'POST', body: JSON.stringify({ sources }) });
          await reloadState();
          const id = result.added[0] || result.existing[0];
          if (id) this.select(id);
          else if (result.published[0]) selectStandaloneItem(result.published[0]);
          switchTab('standalone'); dialog.close();
          setStatus(`${result.added.length} Part B questions imported. ${result.existing.length + result.published.length} already imported; existing edits kept.`, 'success');
          dialog.querySelector('#part-b-import-source').value = ''; dialog.querySelector('#part-b-import-files').value = '';
        } catch (error) { message.textContent = error.message; }
        finally { dialog.dataset.busy = 'false'; dialog.querySelectorAll('button, input, textarea, select').forEach(node => node.disabled = false); }
      };
    }
    if (!dialog.open) dialog.showModal();
    try {
      const result = await api('/api/standalone-import/prompt');
      dialog.querySelector('#part-b-import-prompt').value = result.prompt;
      dialog.querySelector('#part-b-copy-prompt').disabled = false;
    } catch (error) { dialog.querySelector('#part-b-import-status').textContent = `Could not load the Part B prompt: ${error.message}. Restart Content Studio to load the new importer.`; }
  },
  select(id) {
    if (app.saving || !confirmStandaloneDiscard()) return;
    const entry = app.state.standaloneImportDrafts?.find(item => item.id === id);
    if (!entry) return;
    app.selectedStandaloneItemId = '';
    app.standaloneDraft = { ...clone(entry.question), importDraftId: entry.id, importVersion: entry.version };
    app.standaloneDirty = false;
    renderStandaloneList(); renderStandaloneEditor();
    setStatus('Imported Part B draft ready to edit. Missing answers have not been guessed.');
  },
  decorate() {
    const root = document.querySelector('.studio-part-b-workspace, .studio-hot-standalone'); if (!root) return;
    const importButton = studioUI.element('button', 'secondary', 'Import Part B'); importButton.type = 'button'; importButton.onclick = () => this.open();
    root.querySelector('.standalone-item-actions').prepend(importButton);
    const draft = app.standaloneDraft;
    if (!draft.selectionHtml && draft.type === 'multiple_choice' && draft.choices.length > 4) {
      const extra = studioUI.element('section', 'studio-part-b-extra-choices', '<strong>Extra source choices</strong><p>Remove extra choices to leave four. Editing never guesses a replacement key.</p>');
      draft.choices.forEach((choice, index) => {
        const button = studioUI.element('button', 'secondary'); button.type = 'button'; button.textContent = `Remove ${choice.id}: ${choice.text.slice(0, 90)}`;
        button.onclick = () => {
          const keyed = draft.choices.find(item => item.id === draft.correctChoiceId);
          draft.choices.splice(index, 1); draft.choices.forEach((item, i) => { item.id = String.fromCharCode(65 + i); });
          draft.correctChoiceId = draft.choices.includes(keyed) ? keyed.id : '';
          markStandaloneDirty(); renderStandaloneEditor(); studioUI.showStandaloneOptions(true);
        }; extra.append(button);
      });
      root.querySelector('.standalone-bank-form').append(extra);
    }
    if (!draft.importDraftId) return;
    const entry = app.state.standaloneImportDrafts?.find(item => item.id === draft.importDraftId);
    root.querySelector('#standalone-id').disabled = true; root.querySelector('#generate-standalone-id').disabled = true;
    root.querySelector('h1').textContent = 'Imported Part B question · Needs editing';
    root.querySelector('#save-standalone').textContent = 'Save draft';
    const finish = studioUI.element('button', 'primary', 'Finish & save to bank'); finish.type = 'button'; finish.onclick = () => this.saveCurrent(true);
    root.querySelector('.studio-save-bar').append(finish);
    const remove = studioUI.element('button', 'danger', 'Delete draft'); remove.type = 'button'; remove.id = 'delete-standalone-draft'; remove.onclick = () => this.deleteCurrent();
    root.querySelector('.standalone-item-actions').append(remove);
    const notes = studioUI.element('details', 'studio-part-b-import-notes', '<summary>Imported source & notes</summary>');
    const info = studioUI.element('p'); info.textContent = 'This draft is saved separately from student exams. Verify its text and key, then finish saving it to the reusable bank.'; notes.append(info);
    for (const note of entry?.notes || []) { const p = studioUI.element('p'); p.textContent = note; notes.append(p); }
    const original = studioUI.element('pre'); original.textContent = JSON.stringify(entry?.original || {}, null, 2); notes.append(original);
    root.querySelector('.standalone-bank-form').append(notes);
  },
  async deleteCurrent() {
    const draft = app.standaloneDraft;
    if (app.saving || !draft?.importDraftId) return;
    const label = draft.prompt?.trim().slice(0, 160) || 'Untitled Part B question';
    if (!window.confirm(`Delete this imported Part B draft?\n\n${label}\n\n${app.standaloneDirty ? 'Its unsaved edits will also be discarded. ' : ''}You can import the source again later.`)) return;
    const index = (app.state.standaloneImportDrafts || []).findIndex(entry => entry.id === draft.importDraftId);
    let deleted = false;
    app.saving = true; document.getElementById('standalone-editor').inert = true;
    setStatus('Deleting the Part B draft…');
    try {
      const result = await api('/api/standalone-drafts', { method: 'DELETE', body: JSON.stringify({ id: draft.importDraftId, version: draft.importVersion }) });
      app.state.standaloneImportDrafts = result.drafts;
      const next = result.drafts[Math.max(0, Math.min(index, result.drafts.length - 1))];
      const saved = !next && app.state.standaloneItems.find(item => !item.duplicateOf);
      app.selectedStandaloneItemId = saved?.id || '';
      app.standaloneDraft = next ? { ...clone(next.question), importDraftId: next.id, importVersion: next.version } : saved ? clone(saved) : null;
      app.standaloneDirty = false;
      renderStandaloneList(); renderStandaloneEditor();
      deleted = true;
      setStatus('Part B draft deleted.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
    finally {
      app.saving = false; document.getElementById('standalone-editor').inert = false; studioUI.syncSaveState();
      if (deleted) document.getElementById(app.standaloneDraft ? 'studio-part-b-options' : 'new-standalone')?.focus();
    }
  },
  async saveCurrent(publish = false) {
    const draft = app.standaloneDraft;
    if (app.saving || !draft?.importDraftId) return;
    app.saving = true; document.getElementById('standalone-editor').inert = true;
    setStatus(publish ? 'Saving the completed Part B question to the bank…' : 'Saving the Part B draft…');
    try {
      const result = await api(publish ? '/api/standalone-drafts/publish' : '/api/standalone-drafts', { method: publish ? 'POST' : 'PUT', body: JSON.stringify({ id: draft.importDraftId, version: draft.importVersion, question: draft, sourceHash: app.state.standaloneSourceHash }) });
      await reloadState();
      app.standaloneDirty = false;
      if (publish) { app.selectedStandaloneItemId = result.id; app.standaloneDraft = clone(app.state.standaloneItems.find(item => item.id === result.id)); }
      else app.standaloneDraft = { ...clone(result.entry.question), importDraftId: result.entry.id, importVersion: result.entry.version };
      renderStandaloneList(); renderStandaloneEditor(true);
      setStatus(publish ? result.reused ? 'Matched an existing Part B question. Source tags were combined and the imported version was retained.' : 'Part B question saved to the bank. Add it to an exam in Exam builder.' : 'Part B draft saved. You can continue editing later.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
    finally {
      app.saving = false; document.getElementById('standalone-editor').inert = false;
      const button = document.getElementById('save-standalone'); if (button) { button.disabled = false; button.textContent = app.standaloneDraft?.importDraftId ? 'Save draft' : 'Save Part B question'; }
      studioUI.syncSaveState();
    }
  },
};
