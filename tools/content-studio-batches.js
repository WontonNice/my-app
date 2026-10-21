/* Math imports go straight into the selected test; editing stays in the Math workspace. */
const MathBatchStudio = {
  dialog() {
    let dialog = document.getElementById('math-batch-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'math-batch-dialog'; dialog.className = 'studio-import-dialog math-batch-dialog'; document.body.append(dialog); }
    return dialog;
  },
  open(id) { document.querySelector('#document-review-dialog')?.close(); return this.importDialog(id); },
  async importDialog(entryId = '') {
    try {
      const dialog = this.dialog();
      dialog.innerHTML = `<section class="panel"><div class="panel-head"><h2>Import into Math test</h2><button id="batch-close">Close</button></div>
        <p>Questions are added directly to your selected test and marked red as <strong>Needs editing</strong>. Edit them here in the Content Editor, then use <strong>Mark finished</strong> to clear the red label.</p>
        <p>Import <strong>one question or a batch</strong>. A single question can be pasted directly as a question object or inside <code>{"question":{…}}</code>. No batch metadata is needed; a missing question ID is assigned automatically.</p>
        <label>Destination test<select id="batch-assessment">${app.state.assessments.map(assessment => `<option value="${escapeHtml(assessment.id)}" ${assessment.id === app.selectedMathAssessmentId ? 'selected' : ''}>${escapeHtml(assessment.title)}</option>`).join('')}</select></label>
        <button id="batch-prompt">Copy extraction prompt</button>
        ${entryId ? '<p>Your saved import will be added to the test you choose. Previously added questions are kept.</p>' : ''}
        <label>Import JSON files (single questions or batches)<input id="batch-files" type="file" accept=".json,application/json" multiple></label>
        <label>Or paste one question / batch JSON<textarea id="batch-source" rows="12" spellcheck="false" placeholder='{"type":"multiple_choice","prompt":"…","choices":[{"id":"A","text":"…"},{"id":"B","text":"…"}],"correctChoiceId":""}'></textarea></label>
        <button class="primary" id="batch-import">Import into Math test</button><p id="batch-message" role="status"></p>
        <button id="batch-open-editor" hidden>Open imported questions in editor</button></section>`;
      dialog.querySelector('#batch-close').onclick = () => dialog.close();
      dialog.oncancel = event => { if (dialog.querySelector('#batch-import')?.disabled) event.preventDefault(); };
      dialog.querySelector('#batch-prompt').onclick = () => navigator.clipboard.writeText(studioUI.buildOfficialPassagePrompt({target:'One Math question or a batch, matching the requested scope. For one question, use the question envelope without batch metadata. Preserve source question numbers.'})).then(() => { dialog.querySelector('#batch-message').textContent = 'Extraction prompt copied.'; }).catch(error => { dialog.querySelector('#batch-message').textContent = error.message; });
      dialog.querySelector('#batch-import').onclick = async () => {
        const button = dialog.querySelector('#batch-import'), message = dialog.querySelector('#batch-message');
        button.disabled = true;
        message.textContent = 'Importing questions into the selected Math test…';
        dialog.querySelector('#batch-close').disabled = true;
        try {
          // Keep existing unsaved authoring work before replacing the editor's section.
          if (app.mathDirty) { await saveMath(); if (app.mathDirty) throw new Error('Save your current Math edits before importing. Your edits are still in the editor.'); }
          const assessmentId = dialog.querySelector('#batch-assessment').value;
          const sources = [];
          for (const file of dialog.querySelector('#batch-files').files) sources.push(await file.text());
          const pasted = dialog.querySelector('#batch-source').value;
          if (pasted.trim()) sources.push(pasted);
          if (!sources.length && !entryId) throw new Error('Choose JSON files or paste import JSON.');
          const added = [], existing = [], errors = [];
          for (const body of [...(entryId ? [{entryId}] : []), ...sources.map(source => ({source}))]) {
            try {
              const result = await api('/api/math/import', {method:'POST', body:JSON.stringify({...body, assessmentId})});
              added.push(...result.added); existing.push(...result.existing); errors.push(...result.errors);
            } catch (error) { errors.push(error.message); }
          }
          const openEditor = async () => {
            await reloadState(); app.mathDirty = false;
            studioUI.filters.set('math-questions', ''); studioUI.filters.set('math-main', ''); studioUI.filters.set('math-detail', ''); studioUI.filters.set('math-needs-editing', false);
            selectMathAssessment(assessmentId, {selectedQuestionId:added[0] || existing[0], revealSelected:true});
            switchTab('math'); dialog.close();
            setStatus(`${added.length} ${added.length === 1 ? 'question' : 'questions'} added to the Math test and marked red.${existing.length ? ` ${existing.length} already in this test; existing edits kept.` : ''}${errors.length ? ` ${errors.length} records could not be imported; their input was retained.` : ''}`, errors.length ? 'error' : 'success');
          };
          if (errors.length) {
            message.textContent = `${added.length} ${added.length === 1 ? 'question' : 'questions'} added and marked red. ${existing.length} already in the test.\n${errors.join('\n')}\nYour JSON remains here for retry. Unusable source records are also retained in Saved import drafts; correct their JSON or edit the existing question in the Content Editor.`;
            const openButton = dialog.querySelector('#batch-open-editor'); openButton.hidden = !(added.length || existing.length); openButton.onclick = openEditor;
            if (added.length || existing.length) dialog.querySelector('#batch-close').onclick = openEditor;
          } else { await openEditor(); }
        } catch (error) { message.textContent = error.message; }
        finally { button.disabled = false; dialog.querySelector('#batch-close').disabled = false; }
      };
      if (!dialog.open) dialog.showModal();
    } catch (error) { setStatus(error.message, 'error'); }
  },
  decorateEditor() {
    const root = document.getElementById('math-builder');
    root.querySelectorAll('[data-math-question-index]').forEach(button => {
      const question = app.mathDraft.questions[Number(button.dataset.mathQuestionIndex)];
      if (!question.importNeedsEditing) return;
      button.classList.add('math-import-needs-editing');
      button.setAttribute('aria-label', `Needs editing. ${button.getAttribute('aria-label')}`);
      const badge = document.createElement('small'); badge.className = 'math-import-badge'; badge.textContent = 'Needs editing';
      button.querySelector('.math-question-nav-copy')?.append(badge);
    });
    const question = app.mathDraft.questions[app.selectedMathQuestionIndex];
    if (!question?.importNeedsEditing) return;
    const banner = document.createElement('div'); banner.className = 'math-import-editing-banner';
    banner.innerHTML = `<div><strong>Imported · Needs editing</strong><button id="math-import-finished" class="secondary" type="button">Mark finished</button></div>
      ${question.importSource ? `<small>${escapeHtml(question.importSource)}</small>` : ''}
      <p>Edit this question and save normally. Mark finished saves your changes and clears the red label.</p>
      ${question.importNotes?.length ? `<details><summary>Source notes</summary><ul>${question.importNotes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></details>` : ''}`;
    root.querySelector('.studio-math-edit-pane')?.prepend(banner);
    banner.querySelector('button').onclick = async () => {
      if (app.saving) return;
      question.importNeedsEditing = false; markMathDirty();
      await saveMath();
      if (app.mathDirty) { question.importNeedsEditing = true; renderMathBuilder(); }
    };
  },
};
