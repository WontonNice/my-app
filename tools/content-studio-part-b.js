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
      app.passageDraft = { ...defaultPassage(), id: `part-b-editor-${question.id}`, title: '', format: 'prose', preserveSourceLayout: true, text: question.stimulus || '', richText: question.stimulusHtml || '', questions: [question], section: 'revising_editing_b', partBEditor: true };
      app.selectedPassageId = app.passageDraft.id;
      app.passageMode = 'exam'; app.passageDirty = app.standaloneDirty;
      studioUI.passageContext = '';
    }
    const host = document.getElementById('standalone-editor');
    if (editor.parentNode !== host) { host.replaceChildren(editor); }
    renderPassageEditor();
    // The shared editor normalizes questions by cloning them. All Part B
    // metadata controls must edit that same normalized question instance.
    this.sync();
    editor.querySelector('.editor-head h1').textContent = 'Part B question';
    const destination = editor.querySelector('.studio-publish-destination');
    if (destination) destination.hidden = true;
    editor.querySelector('#save-passage').textContent = question.documentDraftId || question.importDraftId ? 'Save draft' : 'Save Part B question';
    editor.querySelector('#open-student-preview').removeEventListener('click', openStudentPreview);
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
      destination.querySelector('[aria-label="Publish destination"] option').textContent = 'Choose an exam or worksheet';
      editor.querySelector('#save-passage').className = 'secondary';
      const publish = studioUI.element('button', 'primary', 'Publish this question');
      publish.type = 'button'; publish.id = 'publish-part-b-question';
      publish.onclick = () => this.publish();
      editor.querySelector('.studio-item-actions').append(publish);
    }
    this.mountMetadata(editor);
    if (question.importDraftId) {
      const remove = studioUI.element('button', 'danger', 'Delete draft');
      remove.type = 'button'; remove.onclick = () => PartBImport.deleteCurrent();
      editor.querySelector('.studio-item-actions').append(remove);
    } else {
      const remove = studioUI.element('button', 'danger', question.documentDraftId ? 'Delete draft' : 'Delete question');
      remove.type = 'button'; remove.id = 'delete-part-b-question'; remove.onclick = () => this.deleteCurrent();
      editor.querySelector('.studio-item-actions').append(remove);
    }
  },
  async deleteCurrent() {
    if (app.saving || !app.standaloneDraft) return;
    this.sync();
    const question = app.standaloneDraft;
    const isDraft = Boolean(question.documentDraftId);
    const saved = app.state.standaloneItems.find(q => q.id === question.id);
    const usage = saved ? PartBBank.usage(saved, app.state.standaloneItems, app.state.tests || []) : [];
    if (usage.length) {
      studioUI.showSupportPanel('passage');
      setStatus(`This question appears in ${usage.map(exam=>exam.title || exam.id).join(', ')}. Remove it from those exams in the exam builder before deleting it from the bank.`, 'error');
      return;
    }
    if (!window.confirm(`Delete this ${isDraft?'draft':'question'}?${app.standaloneDirty?' Unsaved edits will also be discarded.':''}\n\n${isDraft?'Other questions in this import will be kept.':saved?'A recovery copy will be kept.':''}`)) return;
    app.saving = true;
    const editor = document.getElementById('standalone-editor'); editor.inert = true;
    try {
      if (isDraft) {
        const base = PartBImport.documentBase;
        if (base?.entry.id !== question.documentDraftId) throw new Error('Reopen this draft before deleting.');
        const state = await api('/api/document-drafts',{method:'DELETE',body:JSON.stringify({id:question.documentDraftId,questionId:question.id,revision:base.revision})});
        PartBImport.documentState = state; PartBImport.documentBase = null;
      } else if (saved) {
        const result = await api('/api/standalone-items',{method:'DELETE',body:JSON.stringify({id:question.id,sourceHash:app.state.standaloneSourceHash})});
        const removed = new Set(result.deleted.removedIds);
        app.state.standaloneItems = app.state.standaloneItems.filter(q=>!removed.has(q.id));
      }
      app.standaloneDirty = false; app.passageDirty = false;
      this.leave();
      app.standaloneDraft = null; app.selectedStandaloneItemId = '';
      await reloadState();
      renderStandaloneList(); renderStandaloneEditor();
      setStatus(isDraft?'Part B draft deleted. Other questions were kept.':saved?'Part B question deleted. A recovery copy was kept.':'Unsaved Part B question discarded.', 'success');
    } catch(error) { setStatus(error.message,'error'); }
    finally { app.saving = false; editor.inert = false; studioUI.syncSaveState(); }
  },
  mountMetadata(editor) {
    editor.querySelector('#passage-version-indicator')?.remove();
    editor.querySelectorAll('.source-path').forEach(node => node.hidden = true);
    editor.querySelector('#save-passage').title = 'Save Part B question (Ctrl / ⌘ + S)';
    for (const field of ['title','author','blurb','section','versionLabel','versionLabels','teacherSource','passageCategory','passageType','format','label','sourceNote']) {
      editor.querySelector(`[data-field="${field}"]`)?.closest('.field')?.setAttribute('hidden','');
    }
    const information = editor.querySelector('#passage-information');
    information.querySelector('.panel-head').hidden = true;
    const settings = editor.querySelector('[data-option-group="settings"]');
    if (settings) { settings.open = true; settings.querySelector('summary').hidden = true; }
    const question = app.standaloneDraft;
    const source = this.sourceInfo(question);
    const usage = PartBBank.usage(question, app.state.standaloneItems, app.state.tests || []);
    const details = studioUI.element('div', 'studio-part-b-details');
    const categories = app.state.passageCategories || [{value:'official_handbook',label:'Official Handbook'},{value:'prestige',label:'Prestige'},{value:'kaplan',label:'Kaplan'},{value:'miscellaneous',label:'Miscellaneous'}];
    details.innerHTML = `<p class="studio-part-b-section">Revising/Editing Part B · Stand-alone items</p>
      <label class="field"><span>Source collection</span><select id="part-b-source-collection">${categories.map(category=>`<option value="${escapeHtml(category.value)}"${category.value===this.collection(question)?' selected':''}>${escapeHtml(category.label)}</option>`).join('')}</select></label>
      <section class="studio-part-b-exam-usage" aria-label="Exam appearances">
        <h3>Appears in exams <span>${usage.length}</span></h3>
        ${usage.length ? `<ul>${usage.map(test=>`<li>${escapeHtml(test.title || test.id)}</li>`).join('')}</ul>` : '<p>Not added to an exam yet.</p>'}
      </section>
      <details class="studio-part-b-source-extra"><summary>Import details</summary>
        <label class="field"><span>Original source title</span><input id="part-b-source-label" value="${escapeHtml(source.label || '')}" placeholder="Test, form, or book title"></label>
        <label class="field"><span>Source URL</span><input data-part-b-source="url" type="url" value="${escapeHtml(source.url || '')}"></label>
        <label class="field"><span>Original question number</span><input data-part-b-source="sourceQuestion" value="${escapeHtml(source.sourceQuestion || '')}"></label>
        <div id="standalone-version-tags"></div>
      </details>`;
    information.append(details); PartBTools.renderTags();
    const updateSource = (field,value) => { question.source={...this.sourceInfo(question),[field]:value}; markStandaloneDirty(); };
    details.querySelector('#part-b-source-collection').onchange = event => updateSource('collection',event.target.value);
    details.querySelector('#part-b-source-label').oninput = event => updateSource('label',event.target.value);
    details.querySelectorAll('[data-part-b-source]').forEach(input=>input.oninput=event=>updateSource(input.dataset.partBSource,event.target.value));
    editor.querySelector('[data-support-tool="media"]')?.setAttribute('hidden','');
    editor.querySelector('[data-option-group="media"]')?.setAttribute('hidden','');
    const options = editor.querySelector('[data-support-tool="passage"]');
    if (options) options.textContent = 'Source & details';
    const reviewTitle = editor.querySelector('[data-option-group="review"] > summary');
    if (reviewTitle) reviewTitle.textContent = 'Validation';
    this.renderReview();
  },
  sourceInfo(question) {
    const entry = question.documentDraftId && (PartBImport.documentBase?.entry?.id === question.documentDraftId ? PartBImport.documentBase.entry : PartBImport.documentState.entries.find(entry=>entry.id===question.documentDraftId));
    return {...entry?.content.source,...question.source};
  },
  collection(question) {
    const source = this.sourceInfo(question);
    if (source.collection) return source.collection;
    if (/official|testnav/i.test(source.sourceFamily || '')) return 'official_handbook';
    const labels = PartBImport.sourceLabels({...question,source});
    if (labels.some(label=>/^kaplan$/i.test(label))) return 'kaplan';
    if (labels.some(label=>/^prestige$/i.test(label))) return 'prestige';
    if (labels.some(label=>/^official[ -](?:practice|handbook)$/i.test(label))) return 'official_handbook';
    const exams = PartBBank.usage(question,app.state.standaloneItems,app.state.tests || []);
    const groups = exams.map(test=>{
      const exam = app.state.assessments.find(exam=>exam.id===test.id) || test;
      return studioUI.assessmentLabel?.(exam) || exam.examLabel || (/^\d{4}-\d{4}-form-[a-z]$/i.test(exam.id) ? 'Official practice':'');
    });
    if (groups.length && groups.every(group=>/^official[ -](?:practice|handbook)$/i.test(group || ''))) return 'official_handbook';
    if (groups.length && groups.every(group=>/^prestige$/i.test(group || ''))) return 'prestige';
    if (groups.length && groups.every(group=>/^kaplan$/i.test(group || ''))) return 'kaplan';
    return 'miscellaneous';
  },
  collectionLabel(question) {
    const collection = this.collection(question);
    return {official_handbook:'Official',prestige:'Prestige',kaplan:'Kaplan',miscellaneous:'Miscellaneous'}[collection] || collection;
  },
  reviewEntry() {
    const question = app.standaloneDraft;
    const base = question?.documentDraftId && PartBImport.documentBase?.entry;
    // Preview validation assumes the review confirmation supplied by Publish.
    // These copies never mark an unsaved draft as reviewed.
    return {kind:'standalone',content:{...(base?.content || {}),section:'revising_editing_b',questions:[{...question,review:{...question.review,classificationReviewed:true,warnings:[]}}],
      visuals:(base?.content.visuals || []).filter(v => !v.questionId || v.questionId === question.id),
      review:{...base?.content.review,expectedQuestionCount:1,sourceReviewed:true,completenessReviewed:true,warnings:[]}}};
  },
  renderReview() {
    const panel = document.querySelector('.studio-review-panel');
    if (!panel || !app.passageDraft?.partBEditor) return;
    const question = app.standaloneDraft;
    const entry = this.reviewEntry();
    // Publishing is the teacher's review confirmation. Show content problems,
    // never a separate checklist or verification gate.
    const issues = DocumentImport.issues(entry, {...DocumentStudio.taxonomy(),revising_editing_b:questionTopicsForSection('revising_editing_b')});
    panel.innerHTML = '';
    if (!issues.some(issue=>issue.blocking)) panel.append(studioUI.element('p','','Ready to publish. Publishing confirms your review of this question.'));
    for (const issue of issues) { const line = studioUI.element('p','field-note'); line.textContent = `${issue.blocking?'Fix before publishing':'Note'}: ${issue.message}`; panel.append(line); }
    document.querySelectorAll('[data-review-count]').forEach(node => node.textContent = issues.filter(i=>i.blocking).length);
  },
  async publish() {
    if (app.saving) return;
    this.sync();
    const question = app.standaloneDraft;
    const assessmentId = document.querySelector('#standalone-editor [aria-label="Publish destination"]').value;
    if (!assessmentId) { setStatus('Choose an exam or worksheet next to Publish this question.', 'error'); return; }
    if (!questionTopicsForSection('revising_editing_b').includes(question.topic)) {
      setStatus('Choose a topic in Question options, then publish. Your edits are retained.', 'error');
      studioUI.showSupportPanel('question');
      document.querySelector('.studio-question-inspector [data-question-field="topic"]')?.focus();
      return;
    }
    if (!await this.save()) return;
    app.saving = true; document.getElementById('standalone-editor').inert = true; studioUI.syncSaveState();
    try {
      const state = await api('/api/document-publish-english', {method:'POST',body:JSON.stringify({entryId:question.documentDraftId,questionIds:[question.id],assessmentId,confirmReview:true,revision:PartBImport.documentBase.revision})});
      app.standaloneDirty=false; app.passageDirty=false;
      await reloadState(); PartBImport.setDocumentState(state);
      renderStandaloneList(); renderStandaloneEditor();
      setStatus('This Part B question was published to the selected exam or worksheet. Other drafts remain unpublished.', 'success');
    } catch(error) { setStatus(error.message, 'error'); studioUI.showSupportPanel('review'); this.renderReview(); }
    finally { app.saving=false; document.getElementById('standalone-editor').inert=false; studioUI.syncSaveState(); }
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
      document.getElementById?.('standalone-editor')?.setAttribute('inert','');
      try {
        const base = PartBImport.documentBase;
        if (base?.entry.id !== question.documentDraftId) throw new Error('Reopen the Part B draft before saving. Your edits are retained.');
        const entry = clone(base.entry), saved = clone(question);
        delete saved.documentDraftId;
        const index = entry.content.questions.findIndex(q => q.id === saved.id);
        if (index < 0) throw new Error('The saved question could not be found. Your edits are retained.');
        entry.content.questions[index] = saved;
        const state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ revision: base.revision, entry, reviewedQuestionIds:['sourceReviewed','completenessReviewed','classificationReviewed'].every(key => question.review?.[key] === true) ? [question.id] : [] }) });
        PartBImport.documentBase = { revision: state.revision, entry: clone(state.entries.find(e => e.id === entry.id)) };
        app.standaloneDirty = false; app.passageDirty = false;
        PartBImport.setDocumentState(state);
        renderStandaloneList(); renderStandaloneEditor();
        setStatus('Part B draft saved.', 'success');
        return true;
      } catch (error) { setStatus(error.message, 'error'); return false; }
      finally { app.saving = false; document.getElementById?.('standalone-editor')?.removeAttribute('inert'); studioUI.syncSaveState(); }
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
    const question = entry?.content.questions.find(question => question.id === current.id && !entry.publishedQuestionIds?.includes(question.id));
    if (question) app.standaloneDraft = { ...clone(question), documentDraftId: entry.id };
    else {
      const publication = state.entries.find(entry => entry.id === current.documentDraftId);
      const savedId = Object.values(publication?.publications || {}).map(p => p.questionMap?.[current.id]).find(Boolean) || current.id;
      const saved = app.state.standaloneItems.find(question => question.id === savedId);
      app.selectedStandaloneItemId = saved?.id || '';
      app.standaloneDraft = saved ? clone(saved) : null;
    }
  },
  documentRecords() {
    return this.documentState.entries.filter(entry => entry.kind === 'standalone' && entry.status !== 'published')
      .flatMap(entry => entry.content.questions.filter(question => !entry.publishedQuestionIds?.includes(question.id)).map(question => ({
        ...question, documentDraftId: entry.id,
        versionLabels: PartBBank.labels(question),
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
      const question = entry?.content.questions.find(question => question.id === questionId && !entry.publishedQuestionIds?.includes(question.id));
      if (!question) throw new Error('This imported draft has changed or was published. Refresh the Part B library.');
      app.selectedStandaloneItemId = '';
      app.standaloneDraft = { ...clone(question), documentDraftId: entry.id };
      app.standaloneDirty = false;
      this.documentBase = { revision: state.revision, entry: clone(entry) };
      renderStandaloneList(); renderStandaloneEditor();
      setStatus('Editing saved Part B draft. Use Save draft to keep your changes.');
      return true;
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
