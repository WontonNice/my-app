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
      const previousSource = dialog.querySelector('#batch-source')?.value || '';
      dialog.setAttribute('aria-labelledby', 'math-json-import-title');
      dialog.innerHTML = `<section class="panel math-json-panel"><header class="panel-head"><div><h2 id="math-json-import-title">Import Math JSON</h2><p>Paste the JSON from ChatGPT or upload a file. Questions go straight into your test, marked red as <strong>Needs editing</strong>.</p></div><button class="secondary" type="button" id="batch-close">Close</button></header>
        <div class="math-json-body"><div class="math-json-targets">
        <label>Destination test<select id="batch-assessment">${app.state.assessments.map(assessment => `<option value="${escapeHtml(assessment.id)}" ${assessment.id === app.selectedMathAssessmentId ? 'selected' : ''}>${escapeHtml(assessment.title)}</option>`).join('')}</select></label>
        <label>Import format<select id="batch-format"><option value="document">Math question / batch JSON</option><option value="satcc">SAT Crash Course Reader · All 50 math questions</option></select></label>
        </div>
        <p id="batch-sat-help" hidden>On the source test page, select Mathematics. In SAT Crash Course Reader select All 50 math questions, then copy or download JSON and import it here. Short answers, expression entry, multiple selections, dropdowns, and drag blanks stay editable in their matching question types. Formulas and available source diagrams are preserved. Missing keys, unsupported interactions, and partial captures are flagged for review.</p>
        ${entryId ? '<p>Your saved import will be added to the test you choose. Previously added questions are kept.</p>' : ''}
        <label>Paste Math JSON<textarea id="batch-source" rows="6" spellcheck="false" aria-describedby="batch-json-help batch-message" placeholder="Paste the complete JSON returned by ChatGPT here.">${escapeHtml(previousSource)}</textarea></label>
        <small id="batch-json-help">Accepts one question or a batch. Select a destination test above, then use Import into Math test below.</small>
        <div class="math-json-files"><label>Or upload JSON files<input id="batch-files" type="file" accept=".json,.txt,application/json,text/plain" multiple></label><button class="secondary" type="button" id="batch-prompt">Copy extraction prompt</button></div>
        </div>
        <footer class="math-json-footer"><p id="batch-message" role="status"></p><div><button class="primary" type="button" id="batch-import">Import into Math test</button>
        <button class="secondary" type="button" id="batch-open-editor" hidden>Open imported questions in editor</button></div></footer></section>`;
      dialog.querySelector('#batch-close').onclick = () => dialog.close();
      dialog.querySelector('#batch-format').onchange = event => {
        const sat = event.target.value === 'satcc';
        dialog.querySelector('#batch-sat-help').hidden = !sat;
        dialog.querySelector('#batch-prompt').hidden = sat;
        dialog.querySelector('#batch-source').placeholder = sat ? 'Paste the complete SAT Crash Course Reader math JSON export here' : 'Paste Math question or batch JSON here';
      };
      dialog.oncancel = event => { if (dialog.querySelector('#batch-import')?.disabled) event.preventDefault(); };
      dialog.querySelector('#batch-prompt').onclick = () => navigator.clipboard.writeText(studioUI.buildOfficialPassagePrompt({target:'One Math question or a batch, matching the requested scope. For one question, use the question envelope without batch metadata. Preserve source question numbers.'})).then(() => { dialog.querySelector('#batch-message').textContent = 'Extraction prompt copied.'; }).catch(error => { dialog.querySelector('#batch-message').textContent = error.message; });
      dialog.querySelector('#batch-import').onclick = async () => {
        const message = dialog.querySelector('#batch-message');
        const sourceField = dialog.querySelector('#batch-source');
        if (!entryId && !sourceField.value.trim() && !dialog.querySelector('#batch-files').files.length) {
          message.textContent = 'Paste your Math JSON or choose a JSON file before importing.';
          sourceField.setAttribute('aria-invalid', 'true'); sourceField.focus(); return;
        }
        sourceField.removeAttribute('aria-invalid');
        const controls = [...dialog.querySelectorAll('button, input, textarea, select')];
        controls.forEach(control => { control.disabled = true; });
        message.textContent = 'Importing questions into the selected Math test…';
        try {
          const assessmentId = dialog.querySelector('#batch-assessment').value;
          const sources = [];
          for (const file of dialog.querySelector('#batch-files').files) sources.push(await file.text());
          const pasted = dialog.querySelector('#batch-source').value;
          if (pasted.trim()) sources.push(pasted);
          if (!sources.length && !entryId) throw new Error('Choose JSON files or paste import JSON.');
          // Keep existing unsaved authoring work before replacing the editor's section.
          if (app.mathDirty) { await saveMath(); if (app.mathDirty) throw new Error('Save your current Math edits before importing. Your edits are still in the editor.'); }
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
            switchTab('math');
            if (!errors.length) { sourceField.value = ''; dialog.querySelector('#batch-files').value = ''; }
            dialog.close();
            setStatus(`${added.length} ${added.length === 1 ? 'question' : 'questions'} added to the Math test and marked red.${existing.length ? ` ${existing.length} already in this test; existing edits kept.` : ''}${errors.length ? ` ${errors.length} records could not be imported; their input was retained.` : ''}`, errors.length ? 'error' : 'success');
          };
          if (errors.length) {
            message.textContent = `${added.length} ${added.length === 1 ? 'question' : 'questions'} added and marked red. ${existing.length} already in the test.\n${errors.join('\n')}\nYour JSON remains here for retry. Unusable source records are also retained in Saved import drafts; correct their JSON or edit the existing question in the Content Editor.`;
            const openButton = dialog.querySelector('#batch-open-editor'); openButton.hidden = !(added.length || existing.length); openButton.onclick = openEditor;
            if (added.length || existing.length) dialog.querySelector('#batch-close').onclick = openEditor;
          } else { await openEditor(); }
        } catch (error) { message.textContent = error.message; }
        finally { controls.forEach(control => { control.disabled = false; }); }
      };
      dialog.querySelector('#batch-source').oninput = event => event.target.removeAttribute('aria-invalid');
      dialog.querySelector('#batch-files').onchange = () => dialog.querySelector('#batch-source').removeAttribute('aria-invalid');
      if (!dialog.open) dialog.showModal();
      if (!entryId) dialog.querySelector('#batch-source').focus();
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
