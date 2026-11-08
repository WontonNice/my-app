/* Math imports go straight into the selected test; editing stays in the Math workspace. */
const MathBatchStudio = {
  dialog() {
    let dialog = document.getElementById('math-batch-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'math-batch-dialog'; dialog.className = 'studio-import-dialog math-batch-dialog'; document.body.append(dialog); }
    return dialog;
  },
  open(id) { document.querySelector('#document-review-dialog')?.close(); return this.importDialog(id); },
  async importDialog(entryId = '', newWorksheet = false) {
    try {
      const dialog = this.dialog();
      const previousSource = dialog.querySelector('#batch-source')?.value || '';
      dialog.setAttribute('aria-labelledby', 'math-json-import-title');
      dialog.innerHTML = `<section class="panel math-json-panel"><header class="panel-head"><div><h2 id="math-json-import-title">Import Math JSON</h2><p>Paste the JSON from ChatGPT or upload a file. Questions go into your selected worksheet or assessment, marked red as <strong>Needs editing</strong>.</p></div><button class="secondary" type="button" id="batch-close">Close</button></header>
        <div class="math-json-body"><div class="math-json-targets">
        <label>Destination<select id="batch-assessment"><option value="__new_worksheet__" ${newWorksheet?'selected':''}>New Math worksheet</option>${app.state.assessments.map(assessment => `<option value="${escapeHtml(assessment.id)}" ${!newWorksheet && assessment.id === app.selectedMathAssessmentId ? 'selected' : ''}>${assessment.studyHallWorksheet?'Worksheet':'Assessment'} · ${escapeHtml(assessment.title)}</option>`).join('')}</select></label>
        <label>Import format<select id="batch-format"><option value="document">Math question / batch JSON</option><option value="satcc">SAT Crash Course Reader · All 50 math questions</option></select></label>
        </div>
        <fieldset id="batch-worksheet" ${newWorksheet?'':'hidden'}><legend>New worksheet · General / Mixed Review</legend><label>Worksheet title<input id="batch-title" maxlength="160" required></label><label>Collection (optional)<input id="batch-collection" maxlength="160" placeholder="For example, Grade 9 Mathematics Sample Questions"></label><p>Publisher, SHSAT level and year come from the JSON source metadata. Review them below before importing. You can refine the worksheet scope in its builder.</p></fieldset>
        <p id="batch-sat-help" hidden>On the source test page, select Mathematics. In SAT Crash Course Reader select All 50 math questions, then copy or download JSON and import it here. Hot Spot, Fill In The Blank, Equation Editor, Multiple Response, and Inline Choice questions keep their response formats. Formulas and available source diagrams are preserved. Missing keys, unsupported interactions, and partial captures are flagged for review.</p>
        ${entryId ? '<p>Your saved import will be added to the test you choose. Previously added questions are kept.</p>' : ''}
        <label>Paste Math JSON<textarea id="batch-source" rows="6" spellcheck="false" aria-describedby="batch-json-help batch-message" placeholder="Paste the complete JSON returned by ChatGPT here.">${escapeHtml(previousSource)}</textarea></label>
        <small id="batch-json-help">Accepts one question or a batch. Choose an existing activity or create a new worksheet, review the key, then import.</small>
        <div class="math-json-files"><label>Or upload JSON files<input id="batch-files" type="file" accept=".json,.txt,application/json,text/plain" multiple></label><button class="secondary" type="button" id="batch-prompt">Copy extraction prompt</button></div>
        </div>
        <div id="batch-key-review" class="math-json-body"></div>
        <footer class="math-json-footer"><p id="batch-message" role="status"></p><div><button class="secondary" type="button" id="batch-review">Review JSON and answer key</button><button class="primary" type="button" id="batch-import">Import questions</button>
        <button class="secondary" type="button" id="batch-open-editor" hidden>Open imported questions in editor</button></div></footer></section>`;
      dialog.querySelector('#batch-close').onclick = () => dialog.close();
      dialog.querySelector('#batch-assessment').onchange=()=>{dialog.querySelector('#batch-worksheet').hidden=dialog.querySelector('#batch-assessment').value!=='__new_worksheet__';};
      dialog.querySelector('#batch-review').onclick=async()=>{
        try {
          const sources=[dialog.querySelector('#batch-source').value,...await Promise.all([...dialog.querySelector('#batch-files').files].map(file=>file.text()))].filter(value=>value.trim());
          if(!sources.length)throw new Error('Paste JSON or choose a file to review.');
          const rows=[], provenance=[];
          for(const source of sources){
            const payload=JSON.parse(source);provenance.push(payload.source||{});
            const questions=payload.mathQuestions || (payload.question?[payload.question]:payload.choices?[payload]:[]);
            for(const question of questions){const normalized=DocumentImport.normalizeChoiceLabels(question),labels=normalized.review?.sourceChoiceIds||question.choices?.map(choice=>choice.id)||[];
              const keys=normalized.correctChoiceIds||[normalized.correctChoiceId];
              rows.push(`<tr><td>${escapeHtml(question.review?.sourceQuestion||question.id)}</td><td>${escapeHtml(labels.join(', '))}</td><td>${escapeHtml(keys.map(key=>labels[normalized.choices?.findIndex(choice=>choice.id===key)]||'Unknown').join(', '))}</td><td>${escapeHtml(keys.filter(Boolean).join(', ')||'Unknown')}</td></tr>`);
            }
          }
          dialog.querySelector('#batch-key-review').innerHTML=`<h3>Import review · ${rows.length} questions</h3>${provenance.map(source=>`<p>${escapeHtml(source.label||source.publisher||source.sourceFamily||'Source not specified')} · SHSAT ${escapeHtml(source.shsatLevel||source.form||'level not specified')} · ${escapeHtml(source.year||'year not specified')}</p>`).join('')}<table><thead><tr><th>Source question</th><th>Printed choices</th><th>Original key</th><th>Normalized key</th></tr></thead><tbody>${rows.join('')}</tbody></table><p>Missing keys remain blank. Review against your supplied key; this does not mark questions finished.</p>`;
        }catch(error){dialog.querySelector('#batch-message').textContent=error.message;}
      };
      dialog.querySelector('#batch-format').onchange = event => {
        const sat = event.target.value === 'satcc';
        dialog.querySelector('#batch-sat-help').hidden = !sat;
        dialog.querySelector('#batch-prompt').hidden = sat;
        dialog.querySelector('#batch-source').placeholder = sat ? 'Paste the complete SAT Crash Course Reader math JSON export here' : 'Paste Math question or batch JSON here';
      };
      dialog.oncancel = event => { if (dialog.querySelector('#batch-import')?.disabled) event.preventDefault(); };
      dialog.querySelector('#batch-prompt').onclick = () => navigator.clipboard.writeText(studioUI.buildOfficialPassagePrompt({subject:'math',target:'One Math question or a batch, matching the requested scope. For one question, use the question envelope without batch metadata. Preserve source question numbers.'})).then(() => { dialog.querySelector('#batch-message').textContent = 'Math extraction prompt copied.'; }).catch(error => { dialog.querySelector('#batch-message').textContent = error.message; });
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
        message.textContent = 'Importing questions and updating the activity question list…';
        try {
          let assessmentId = dialog.querySelector('#batch-assessment').value;
          const creating=assessmentId==='__new_worksheet__';
          if(creating&&!dialog.querySelector('#batch-title').value.trim())throw new Error('Enter a worksheet title before importing.');
          const sources = [];
          for (const file of dialog.querySelector('#batch-files').files) sources.push(await file.text());
          const pasted = dialog.querySelector('#batch-source').value;
          if (pasted.trim()) sources.push(pasted);
          if (!sources.length && !entryId) throw new Error('Choose JSON files or paste import JSON.');
          // Keep existing unsaved authoring work before replacing the editor's section.
          if (app.mathDirty) { await saveMath(); if (app.mathDirty) throw new Error('Save your current Math edits before importing. Your edits are still in the editor.'); }
          const added = [], existing = [], errors = [];
          let retainedRecords = false;
          for (const body of [...(entryId ? [{entryId}] : []), ...sources.map(source => ({source}))]) {
            try {
              const result = await api('/api/math/import', {method:'POST', body:JSON.stringify({...body, assessmentId, ...(assessmentId==='__new_worksheet__'?{newWorksheet:{title:dialog.querySelector('#batch-title').value.trim(),collection:dialog.querySelector('#batch-collection').value.trim()}}:{})})});
              if(result.assessmentId && result.assessmentId!=='__new_worksheet__'){
                assessmentId=result.assessmentId;
                if(![...dialog.querySelector('#batch-assessment').options].some(option=>option.value===assessmentId))dialog.querySelector('#batch-assessment').add(new Option(dialog.querySelector('#batch-title').value,assessmentId));
                dialog.querySelector('#batch-assessment').value=assessmentId;
              }
              added.push(...result.added); existing.push(...result.existing); errors.push(...result.errors);
              if (result.errors.length && result.retainedDrafts) retainedRecords = true;
            } catch (error) { errors.push(error.message); }
          }
          const openEditor = async () => {
            await reloadState(); app.mathDirty = false;
            studioUI.filters.set('math-questions', ''); studioUI.filters.set('math-main', ''); studioUI.filters.set('math-detail', ''); studioUI.filters.set('math-needs-editing', false);
            const activity=app.state.assessments.find(item=>item.id===assessmentId);
            if(activity?.studyHallWorksheet&&activity.assembly)await LearningCatalog.openActivity(assessmentId);
            else {selectMathAssessment(assessmentId, {selectedQuestionId:added[0] || existing[0], revealSelected:true});switchTab('math');}
            if (!errors.length) { sourceField.value = ''; dialog.querySelector('#batch-files').value = ''; }
            dialog.close();
            setStatus(`${added.length} ${added.length === 1 ? 'question' : 'questions'} added to the ${activity?.studyHallWorksheet?'worksheet':'assessment'}. Review their content before publishing.${existing.length ? ` ${existing.length} already present; existing edits kept.` : ''}${errors.length ? ` ${errors.length} records could not be imported; their input was retained.` : ''}`, errors.length ? 'error' : 'success');
          };
          if (errors.length) {
            const counts = added.length || existing.length ? `${added.length} added. ${existing.length} already in the test.\n` : '';
            message.textContent = counts + errors.join('\n') + (retainedRecords ? '\nReview the retained records in Saved import drafts.' : '');
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
    this.decorateBulkFinish(root);
    LearningCatalog.decorateReturn();
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
      await this.finishQuestions([app.selectedMathQuestionIndex]);
    };
  },
  decorateBulkFinish(root) {
    const pane = root.querySelector('.studio-math-edit-pane');
    if (!pane || !app.mathDraft?.questions.length) return;
    root.querySelector('.math-bulk-finish')?.remove();
    const pending = app.mathDraft.questions.filter(q => q.importNeedsEditing).length;
    const controls = document.createElement('details'); controls.className = 'math-bulk-finish';
    controls.innerHTML = `<summary>Finish multiple questions · ${pending} need editing</summary><p>Use the math question numbers shown in the list, regardless of filters. This saves your current math edits and validates every question you finish.</p><div class="review-bulk-controls"><label>Question numbers<input id="math-finish-range" placeholder="1–5, 8, 10–12" autocomplete="off"></label><button type="button" class="secondary" data-finish-range ${pending ? '' : 'disabled'}>Mark range finished</button><button type="button" class="secondary" data-finish-all ${pending ? '' : 'disabled'}>Mark all ${pending} finished</button></div><p role="status" class="math-finish-message"></p>`;
    pane.prepend(controls);
    const images=document.createElement('button');images.type='button';images.className='secondary';images.textContent='Attach source diagrams in a batch';images.onclick=()=>studioImages.batch();controls.before(images);
    const run = async all => {
      try {
        const indices = all ? app.mathDraft.questions.map((_, i) => i) : ReviewRanges.parse(controls.querySelector('input').value, app.mathDraft.questions.length);
        const count = indices.filter(i => app.mathDraft.questions[i].importNeedsEditing).length;
        if (!count) throw new Error('Those questions are already finished.');
        controls.querySelectorAll('button,input').forEach(el => el.disabled = true);
        controls.querySelector('[role="status"]').textContent = `Saving ${count} reviewed questions…`;
        await this.finishQuestions(indices);
      } catch (error) { controls.querySelector('[role="status"]').textContent = error.message; }
      finally { controls.querySelectorAll('button,input').forEach(el => el.disabled = false); }
    };
    controls.querySelector('[data-finish-range]').onclick = () => run(false);
    controls.querySelector('[data-finish-all]').onclick = () => run(true);
  },
  async finishQuestions(indices) {
    if (app.saving) return;
    const ids = new Set(indices.filter(i => app.mathDraft.questions[i]?.importNeedsEditing).map(i => app.mathDraft.questions[i].id));
    if (!ids.size) return;
    for (const question of app.mathDraft.questions) if (ids.has(question.id)) question.importNeedsEditing = false;
    markMathDirty();
    try { await saveMath(); }
    finally {
      // Failed validation or saving must retain the review flags and all edits.
      if (app.mathDirty) {
        for (const question of app.mathDraft.questions) if (ids.has(question.id)) question.importNeedsEditing = true;
        renderMathBuilder();
      }
    }
    if (!app.mathDirty) setStatus(`${ids.size} math question${ids.size === 1 ? '' : 's'} marked finished.`, 'success');
  },
};
