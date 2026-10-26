/* Part B imports stay in the existing editor; incomplete questions are durable teacher drafts. */
const PartBImport = {
  async open() {
    let dialog = document.getElementById('part-b-import-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'part-b-import-dialog'; dialog.className = 'studio-import-dialog'; document.body.append(dialog); }
    if (!dialog.querySelector('#part-b-import-source')) {
      dialog.innerHTML = `<section class="panel"><div class="panel-head"><h2>Import Part B questions</h2><button type="button" id="part-b-import-close">Close</button></div>
        <p>Copy the prompt into ChatGPT with your source screenshots or PDF. Paste its JSON here or choose JSON files. Import one question or a batch directly into the Part B editor.</p>
        <button type="button" id="part-b-copy-prompt" disabled>Copy ChatGPT prompt</button>
        <details><summary>View extraction prompt</summary><textarea id="part-b-import-prompt" readonly rows="10" aria-label="Part B extraction prompt"></textarea></details>
        <label>JSON files<input type="file" id="part-b-import-files" accept=".json,application/json" multiple></label>
        <label>Or paste Part B JSON<textarea id="part-b-import-source" rows="12" spellcheck="false" placeholder='{"question":{"type":"multiple_choice","prompt":"…","stimulus":"…","choices":[],"correctChoiceId":""}}'></textarea></label>
        <p>Imports appear in red as <strong>Needs editing</strong>. Missing answers stay blank. Save your draft at any time; use <strong>Finish & save to bank</strong> when it is ready.</p>
        <button class="primary" type="button" id="part-b-import-submit">Import into Part B editor</button><p id="part-b-import-status" role="status"></p></section>`;
      const message = dialog.querySelector('#part-b-import-status');
      dialog.querySelector('#part-b-import-close').onclick = () => dialog.close();
      dialog.oncancel = event => { if (dialog.dataset.busy === 'true') event.preventDefault(); };
      dialog.querySelector('#part-b-copy-prompt').onclick = async () => {
        try { await navigator.clipboard.writeText(dialog.querySelector('#part-b-import-prompt').value); message.textContent = 'Part B extraction prompt copied.'; }
        catch { const field = dialog.querySelector('#part-b-import-prompt'); field.closest('details').open = true; field.focus(); field.select(); message.textContent = 'Press Ctrl+C / ⌘C to copy the selected prompt.'; }
      };
      dialog.querySelector('#part-b-import-submit').onclick = async () => {
        dialog.dataset.busy = 'true';
        dialog.querySelectorAll('button, input, textarea').forEach(node => node.disabled = true);
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
        finally { dialog.dataset.busy = 'false'; dialog.querySelectorAll('button, input, textarea').forEach(node => node.disabled = false); }
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
    const root = document.querySelector('.studio-part-b-workspace'); if (!root) return;
    const importButton = studioUI.element('button', 'secondary', 'Import Part B'); importButton.type = 'button'; importButton.onclick = () => this.open();
    root.querySelector('.standalone-item-actions').prepend(importButton);
    const draft = app.standaloneDraft;
    if (draft.type === 'multiple_choice' && draft.choices.length > 4) {
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
