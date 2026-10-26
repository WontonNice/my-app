/* Review UI around the existing passage and Math editors and publication endpoints. */
const DocumentStudio = {
  state: { revision: 0, entries: [] }, entry: null, index: 0,
  initialize() {
    const button = document.querySelector('#open-document-drafts');
    button.disabled = false;
    button.onclick = () => this.library();
    if (window.location.hash === '#document-drafts') this.library();
  },
  taxonomy() { return { reading: app.state.readingTopics, revising_editing_a: app.state.revisingEditingTopics, math: app.state.mathTopics, mathSpecificTopics: Object.fromEntries((app.state.mathTopicConfiguration?.categories || []).map(category => [category.label, category.topics.map(topic => topic.label)])) }; },
  async library() {
    try {
      this.state = await api('/api/document-drafts');
      this.entry = null;
      this.render();
      if (!document.querySelector('#document-review-dialog').open) document.querySelector('#document-review-dialog').showModal();
    } catch (error) { setStatus(error.message, 'error'); }
  },
  async accept(source, { openInEditor = false } = {}) {
    if (openInEditor && !confirmDiscard()) return;
    try {
      this.state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ source, destination: app.passageImportDestination || 'exam' }) });
      document.querySelector('#official-passage-dialog').close();
      document.querySelector('#sat-passage-dialog').close();
      if (openInEditor) {
        const incoming = DocumentImport.parse(source)[0];
        const importedIds = this.state.lastImport?.entryIds || [];
        const destination = app.passageImportDestination || 'exam';
        const entry = this.state.entries.find(entry => importedIds.includes(entry.id) && entry.kind === 'passage') || this.state.entries.find(entry => entry.kind === 'passage' && (entry.destination || 'exam') === destination && entry.content.id === incoming.content.id);
        if (!entry) throw new Error('The imported passage was saved. Open it from Saved import drafts.');
        this.entry = clone(entry);
        this.openPassageDraft(entry);
        const needsEditing = entry.content.questions.filter(question => question.review?.warnings?.length).length;
        setStatus(`Imported ${entry.content.questions.length} questions into the Content Editor.${needsEditing ? ` ${needsEditing} ${needsEditing === 1 ? 'question needs' : 'questions need'} manual editing; captured wording and choices were retained.` : ''} Your draft is saved.`, 'success');
        return;
      }
      await this.library();
      setStatus('Import saved as teacher-only drafts. Identical reimports reuse their saved drafts.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
  },
  renderImportReview(review, container) {
    if (!review) { container.hidden = true; return; }
    container.hidden = false;
    container.innerHTML = `<h2>Review ${review.entries.length} imported section(s)</h2><p>Nothing is published. Every section and question will be saved for review.</p>
      ${review.entries.map(entry => `<details open><summary>${escapeHtml(entry.content.title || 'Untitled section')} · ${entry.content.questions.length} questions</summary><pre style="white-space:pre-wrap">${escapeHtml(entry.content.text || '')}</pre>
        ${entry.content.questions.map(q => `<article><strong>${escapeHtml(q.review?.sourceQuestion || q.id)}. ${escapeHtml(q.prompt)}</strong><ol>${(q.choices || []).map(c => `<li>${escapeHtml(c.id)}. ${escapeHtml(c.text)}</li>`).join('')}</ol><p>Key: ${escapeHtml(q.correctChoiceId || q.correctChoiceIds?.join(', ') || q.correctTextAnswers?.join(', ') || 'Not provided')}</p><p>Explanation: ${escapeHtml(q.explanation || 'Not provided')}</p></article>`).join('')}</details>`).join('')}
      <div class="math-import-warnings"><strong>Review before publication</strong><ul>${review.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul></div>
      <button type="button" class="primary" id="document-accept">${app.passageImportKind === 'sat' ? 'Import into Content Editor' : 'Save all as review drafts'}</button>`;
    container.querySelector('#document-accept').onclick = () => this.accept(app.passageImportSource || document.querySelector('#official-passage-import-source').value, { openInEditor: app.passageImportKind === 'sat' });
  },
  openPassageDraft(entry) {
    const destination = entry.destination || 'exam';
    app.passageMode = destination; app.selectedPassageId = ''; app.passageDraft = clone(entry.content);
    app.passageDraft.preserveSourceLayout = true; app.passageDirty = false;
    studioUI.passageContext = '';
    studioUI.preparePassage();
    const firstProblem = app.passageDraft.questions.findIndex(question => question.review?.warnings?.length);
    studioUI.selectedQuestionIndex = Math.max(0, firstProblem);
    studioUI.selectedQuestionId = app.passageDraft.questions[studioUI.selectedQuestionIndex]?.id || '';
    updatePassageWorkspaceLabels(); renderPassageList(); renderPassageEditor(); switchTab(destination === 'advanced' ? 'advanced' : 'passages');
    if (firstProblem >= 0) studioUI.showSupportPanel('question');
    document.querySelector('#document-review-dialog')?.close();
  },
  open(id) { if (this.state.entries.find(e=>e.id===id)?.batch) { MathBatchStudio.open(id); return; } this.entry = clone(this.state.entries.find(e => e.id === id)); this.index = 0; this.render(); },
  async save() {
    this.state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ revision: this.state.revision, entry: this.entry }) });
    this.entry = clone(this.state.entries.find(e => e.id === this.entry.id));
  },
  async saveCurrentPassage() {
    if (app.saving) return false;
    app.saving = true;
    try {
      this.state = await api('/api/document-drafts');
      this.entry = clone(this.state.entries.find(e => e.id === app.passageDraft.importDraftId));
      this.entry.content = clone(app.passageDraft);
      await this.save(); app.passageDirty = false;
      setStatus('Review draft saved. Students cannot see it until you publish.', 'success');
      studioUI.updatePassageSummary();
      return true;
    } catch (error) { setStatus(error.message, 'error'); return false; }
    finally { app.saving = false; }
  },
  async deleteDraft(id = app.passageDraft?.importDraftId) {
    if (app.saving) return;
    const entry = this.state.entries.find(entry => entry.id === id);
    if (!entry || entry.status === 'published' || entry.batch) return;
    const current = app.passageDraft?.importDraftId === id;
    if (!window.confirm(`Delete the imported draft “${entry.content.title || 'Untitled'}” and its ${entry.content.questions.length} questions?\n\n${current && app.passageDirty ? 'Unsaved edits to this draft will also be discarded. ' : ''}You can import the source again later.`)) return;
    app.saving = true;
    const editor = document.getElementById('passage-editor');
    editor.inert = true;
    try {
      this.state = await api('/api/document-drafts', { method: 'DELETE', body: JSON.stringify({ id, revision: this.state.revision }) });
      if (this.entry?.id === id) this.entry = null;
      if (current) {
        const advanced = app.passageMode === 'advanced';
        const next = (advanced ? app.state.advancedPassages : app.state.passages)[0];
        app.selectedPassageId = next?.id || '';
        app.passageDraft = next ? clone(next) : advanced ? defaultAdvancedPassage() : defaultPassage();
        app.passageDirty = false;
        studioUI.passageContext = '';
        renderPassageList(); renderPassageEditor();
      }
      if (document.querySelector('#document-review-dialog')?.open) this.render();
      setStatus('Import draft deleted.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
    finally { app.saving = false; editor.inert = false; studioUI.syncSaveState(); }
  },
  openPublishedPassage(passage, destination = 'exam') {
    if (app.passageDirty) return false;
    app.passageMode = destination; app.selectedPassageId = passage.id; app.passageDraft = clone(passage);
    studioUI.passageContext = ''; updatePassageWorkspaceLabels(); renderPassageList(); renderPassageEditor();
    switchTab(destination === 'advanced' ? 'advanced' : 'passages');
    document.querySelector('#document-review-dialog')?.close();
    return true;
  },
  async upload(visual, file) {
    if (!file) return;
    const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
    const result = await api('/api/images', { method: 'POST', body: JSON.stringify({ passageId: `${this.entry.id}-${Date.now()}`, imageRole: 'passage', fileName: file.name, mimeType: imageUploadMimeType(file), dataUrl }) });
    visual.image = { src: result.image.src, alt: visual.description };
    visual.state = 'resolved'; await this.save(); this.render();
  },
  render() {
    let dialog = document.querySelector('#document-review-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'document-review-dialog'; dialog.className = 'studio-import-dialog'; document.body.append(dialog); }
    const e = this.entry, p = e?.content, q = p?.questions[this.index];
    const destination = e?.destination || 'exam';
    const destinationLabel = destination === 'advanced' ? 'SAT passages' : 'Exam passages';
    const field = (label, key, value, multiline = false) => `<label class="field"><span>${label}</span>${multiline ? `<textarea data-doc-field="${key}" rows="5">${escapeHtml(value || '')}</textarea>` : `<input data-doc-field="${key}" value="${escapeHtml(value || '')}">`}</label>`;
    const reviewMarkup = (r, path) => `<small>Source: ${escapeHtml(r?.sourceFile || 'Not recorded')} · PDF pages ${escapeHtml((r?.sourcePages || []).join(', '))} ${escapeHtml(r?.printedPages || '')}</small>
      ${(r?.warnings || []).map((w, i) => `<label class="field"><span>${escapeHtml(w.code)}: ${escapeHtml(w.message)}</span><select data-warning="${path}:${i}"><option value="unresolved" ${w.state === 'unresolved' ? 'selected' : ''}>Unresolved</option><option value="acknowledged" ${w.state === 'acknowledged' ? 'selected' : ''}>Reviewed / acknowledged</option><option value="resolved" ${w.state === 'resolved' ? 'selected' : ''}>Resolved</option></select></label>`).join('')}`;
    const vs = p ? [...(p.visuals || []), ...(q?.visuals || [])] : [];
    const issues = e ? DocumentImport.issues(e, this.taxonomy()) : [];
    dialog.innerHTML = `<section class="panel"><div class="panel-head"><h2>${e ? 'Document review' : 'Saved document drafts'}</h2><button type="button" id="doc-close">Close</button></div><div id="doc-message" role="status"></div>
      ${!e ? `<p>Drafts are private to this Content Studio checkout. Publish uses the existing content files and student renderers.</p>${this.state.entries.filter(entry => entry.status !== 'published').map(entry => `<p><button data-doc-open="${entry.id}">${escapeHtml(entry.content.title || 'Untitled')} · ${entry.kind === 'math' ? 'Math' : entry.destination === 'advanced' ? 'SAT passages' : 'Exam passages'} · ${entry.content.questions.length} questions · ${entry.status}</button></p>`).join('') || '<p>No unpublished document drafts. In Exam passages or SAT passages, choose Import documents, paste the JSON returned by ChatGPT, then Validate and review → Save all as review drafts.</p>'}` : `
      ${e.kind === 'passage' ? `<p>Publish to <strong>${destinationLabel}</strong>${destination === 'advanced' ? ' · Students will find it under Advanced readings in English Study Hall.' : ''}</p>` : ''}
      <div class="math-import-actions"><button id="doc-library">Back to drafts</button><button id="doc-save">Save review draft</button>${e.kind === 'passage' ? '<button id="doc-editor">Open passage editor / Student view</button>' : `<label>Destination exam <select id="doc-assessment"><option value="">Choose an exam</option>${app.state.assessments.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.title)}</option>`).join('')}</select></label>`}<button class="primary" id="doc-publish">${e.kind === 'passage' ? 'Publish passage' : 'Publish reviewed Math questions'}</button></div>
      ${e.kind === 'passage' && destination === 'exam' ? studioUI.publishExamMarkup(e.id) : ''}
      <details class="studio-review-summary" ${e.kind === 'math' && issues.some(i => i.blocking) ? 'open' : ''}><summary>Review · ${issues.length} issues${e.kind === 'math' ? ` · ${issues.filter(i => i.blocking).length} publication checks` : ''}</summary><p>${e.kind === 'passage' ? 'Existing passage rules allow publishing with review notes. Missing source data stays blank.' : 'Resolve publication checks before publishing Math.'}</p><div>${issues.map((issue, index) => `<button type="button" class="studio-review-issue" data-doc-issue="${index}">${issue.blocking ? '⚠ ' : ''}${escapeHtml(issue.scope)}: ${escapeHtml(issue.message)}</button>`).join('') || '<p>No review issues.</p>'}</div></details>
      ${field('Title', 'title', p.title)}${e.kind === 'passage' ? `${field('Author name', 'author', p.author)}${field('Exact printed byline', 'byline', p.byline)}${field('Subtitle', 'subtitle', p.subtitle)}${field('Introductory blurb', 'blurb', p.blurb, true)}${field('Complete passage text', 'text', p.text, true)}` : ''}
      ${e.kind === 'passage' && destination === 'advanced' ? `<label class="field"><span>Reading genre</span><select data-doc-field="genre">${app.state.advancedGenres.map(genre => `<option ${genre === p.genre ? 'selected' : ''}>${escapeHtml(genre)}</option>`).join('')}</select></label>${field('Library card excerpt', 'excerpt', p.excerpt, true)}` : ''}
      ${reviewMarkup(p.review, 'passage')}
      <label><input type="checkbox" data-review="sourceReviewed" ${p.review?.sourceReviewed ? 'checked' : ''}> I checked source wording, key and explanations against the supplied files.</label><br>
      <label><input type="checkbox" data-review="completenessReviewed" ${p.review?.completenessReviewed ? 'checked' : ''}> I verified all requested pages, questions and choices are included.</label>
      <hr><label>Question <select id="doc-question">${p.questions.map((item, i) => `<option value="${i}" ${this.index === i ? 'selected' : ''}>${i + 1} · Source ${escapeHtml(item.review?.sourceQuestion || item.id)}</option>`).join('')}</select></label>
      ${q ? `${e.kind === 'math' ? `<label class="field"><span>Response type</span><select id="doc-response-type">${DocumentImport.mathResponseTypes.map(type => `<option value="${type}" ${q.type === type ? 'selected' : ''}>${type === 'short_response' ? 'Short answer (plain text)' : type.replaceAll('_',' ')}</option>`).join('')}</select></label>` : ''}${field('Question', 'question.prompt', q.prompt, true)}${field('Instructions', 'question.instructions', q.instructions, true)}
      <label class="field"><span>Skill / topic</span><select data-doc-field="question.topic"><option value="">Unclassified</option>${(e.kind === 'math' ? app.state.mathTopics : this.taxonomy()[p.section] || []).map(t => `<option ${t === q.topic ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}</select></label>
      ${e.kind === 'math' ? `<label class="field"><span>Specific math topic</span><select data-doc-field="question.subtopic">${mathSubtopicOptions(q.topic, q.subtopic)}</select></label>` : ''}
      <p>Classification: ${escapeHtml(q.review?.topicSource || 'unknown')} · confidence ${q.review?.topicConfidence ?? 'unrated'} · difficulty ${escapeHtml(q.review?.difficulty || 'unrated')} (${escapeHtml(q.review?.difficultySource || 'unknown')})</p>
      <label><input type="checkbox" id="doc-classification" ${q.review?.classificationReviewed ? 'checked' : ''}> I reviewed this question’s classification.</label>
      ${(q.choices || []).map((c, i) => field(`Choice ${escapeHtml(c.id)}`, `choice.${i}`, c.text, true)).join('')}
      ${['multiple_choice','multi_select','numeric_entry','expression_entry','short_response','grid_in','transition_drop'].includes(q.type) ? field('Verified answer (choice ID; multi-select / accepted answers separated by |)', 'answer', q.correctChoiceId || q.correctChoiceIds?.join('|') || q.correctTextAnswers?.join('|')) : '<p>Structured response: review each keyed dropdown, drag slot, graph point, or endpoint in Complete draft JSON below.</p>'}
      ${field('Source explanation (leave blank when absent)', 'question.explanation', q.explanation, true)}${reviewMarkup(q.review, 'question')}
      <details><summary>Answer and explanation source references</summary><pre>${escapeHtml(JSON.stringify({ answerSource: q.review?.answerSource || null, explanationSource: q.review?.explanationSource || null }, null, 2))}</pre></details>` : '<p>No questions. Restore them in the JSON below.</p>'}
      ${vs.map((v, i) => `<div class="math-import-warnings"><strong>${v.state === 'resolved' ? 'Visual attached' : '⚠ SOURCE IMAGE REQUIRED'}</strong><p>${escapeHtml(v.scope || v.questionId || 'Passage')} · ${escapeHtml(v.sourceFile || '')} · PDF page ${v.sourcePage || '?'} · ${escapeHtml(v.location || '')}</p><p>${escapeHtml(v.description)}</p>${v.image ? `<img style="max-width:100%;max-height:240px" src="${escapeHtml(v.image.src)}" alt="${escapeHtml(v.image.alt)}">` : ''}<label>Upload original image / prepared crop <input type="file" data-doc-visual="${i}" accept="image/png,image/jpeg,image/webp,image/gif,.svgz"></label></div>`).join('')}
      <details><summary>Complete draft JSON / advanced fields and source metadata</summary><p>Edit structured fields here when needed, then apply. Nothing is dropped from the draft.</p><textarea id="doc-json" rows="18" style="width:100%">${escapeHtml(JSON.stringify(p, null, 2))}</textarea><button id="doc-apply">Apply JSON</button></details>`}</section>`;
    const handle = fn => async () => {
      if (this.busy) return;
      this.busy = true; dialog.inert = true; dialog.setAttribute('aria-busy', 'true');
      try { await fn(); } catch (error) { dialog.querySelector('#doc-message').textContent = error.message; }
      finally { this.busy = false; dialog.inert = false; dialog.setAttribute('aria-busy', 'false'); }
    };
    dialog.querySelector('#doc-close').onclick = () => { if (!e || window.confirm('Close review? Save your draft first to keep edits.')) dialog.close(); };
    dialog.querySelectorAll('[data-doc-open]').forEach(button => button.onclick = () => this.open(button.dataset.docOpen));
    const deleteButton = entry => {
      if (entry.status === 'published' || entry.batch) return null;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'danger'; button.textContent = 'Delete draft';
      button.setAttribute('aria-label', `Delete draft ${entry.content.title || 'Untitled'}`);
      button.onclick = handle(() => this.deleteDraft(entry.id));
      return button;
    };
    dialog.querySelectorAll('[data-doc-open]').forEach(button => {
      const remove = deleteButton(this.state.entries.find(entry => entry.id === button.dataset.docOpen));
      if (remove) button.after(remove);
    });
    if (e) { const remove = deleteButton(e); if (remove) dialog.querySelector('.math-import-actions').append(remove); }
    if (!e) return;
    if (e.kind === 'passage' && destination === 'exam') studioUI.bindPublishExam(dialog, e.id);
    dialog.querySelectorAll('[data-doc-issue]').forEach(button => button.onclick = () => this.locateIssue(issues[Number(button.dataset.docIssue)]));
    dialog.querySelector('#doc-library').onclick = handle(async () => { await this.save(); this.entry = null; this.render(); });
    dialog.querySelector('#doc-save').onclick = handle(async () => { await this.save(); this.render(); dialog.querySelector('#doc-message').textContent = 'Draft saved.'; });
    dialog.querySelectorAll('[data-doc-field]').forEach(input => input.oninput = () => {
      const key = input.dataset.docField;
      if (key.startsWith('question.')) { const name = key.slice(9); q[name] = input.value; delete q[name + 'Html']; if (e.kind === "math" && name === "topic") { q.subtopic = ""; this.render(); } }
      else if (key.startsWith('choice.')) { const choice = q.choices[Number(key.slice(7))]; choice.text = input.value; delete choice.html; delete choice.math; }
      else if (key === 'answer') {
        if (q.type === 'multiple_choice') q.correctChoiceId = input.value;
        else if (q.type === 'multi_select') q.correctChoiceIds = input.value.split('|').map(s => s.trim()).filter(Boolean);
        else q.correctTextAnswers = input.value.split('|').map(s => s.trim()).filter(Boolean);
      } else { p[key] = input.value; if (key === "text") p.richText = ""; }
    });
    dialog.querySelectorAll('[data-review]').forEach(input => input.onchange = () => { p.review ||= {}; p.review[input.dataset.review] = input.checked; });
    const responseType = dialog.querySelector('#doc-response-type');
    if (responseType) responseType.onchange = () => { q.type = DocumentImport.normalizeResponseType(responseType.value); if (q.type === 'short_response') { delete q.entryLayout; delete q.entryVariable; } this.render(); };
    if (q) dialog.querySelector('#doc-classification').onchange = event => { q.review ||= {}; q.review.classificationReviewed = event.target.checked; };
    dialog.querySelectorAll('[data-warning]').forEach(input => input.onchange = () => { const [target, i] = input.dataset.warning.split(':'); (target === 'passage' ? p : q).review.warnings[Number(i)].state = input.value; });
    dialog.querySelector('#doc-question').onchange = event => { this.index = Number(event.target.value); this.render(); };
    dialog.querySelectorAll('[data-doc-visual]').forEach(input => input.onchange = handle(() => this.upload(vs[Number(input.dataset.docVisual)], input.files[0])));
    dialog.querySelector('#doc-apply').onclick = handle(() => { const content = JSON.parse(dialog.querySelector('#doc-json').value); if (!Array.isArray(content.questions)) throw new Error('questions must remain an array.'); content.questions.forEach(question => { question.type = DocumentImport.normalizeResponseType(question.type); if (question.type === 'short_response') { delete question.entryLayout; delete question.entryVariable; } }); this.entry.content = content; this.index = 0; this.render(); });
    if (e.kind === 'passage') dialog.querySelector('#doc-editor').onclick = handle(async () => {
      if (!confirmDiscard()) return;
      if (this.entry.status === 'published') {
        const saved = (destination === 'advanced' ? app.state.advancedPassages : app.state.passages).find(passage => passage.id === p.id);
        if (saved) { app.passageDirty = false; this.openPublishedPassage(saved, destination); return; }
      }
      await this.save(); app.passageMode = destination; app.selectedPassageId = ''; app.passageDraft = clone(this.entry.content); app.passageDraft.preserveSourceLayout = true; app.passageDirty = false;
      studioUI.passageContext = ''; updatePassageWorkspaceLabels(); renderPassageList(); renderPassageEditor(); switchTab(destination === 'advanced' ? 'advanced' : 'passages'); dialog.close();
    });
    dialog.querySelector('#doc-publish').onclick = handle(async () => {
      const target = dialog.querySelector('#doc-assessment')?.value;
      const publishKey = this.entry.id;
      const publishToExamId = destination === 'exam' ? studioUI.publishExamTargets.get(publishKey) || '' : '';
      await this.save();
      if (e.kind === 'passage') {
        const result = await api(destination === 'advanced' ? '/api/advanced-passages' : '/api/passages', { method: 'POST', body: JSON.stringify({ ...this.entry.content, publishNow: true, ...(publishToExamId ? {publishToExamId} : {}) }) });
        await reloadState();
        const message = studioUI.completePassagePublication(result, publishKey);
        if (this.openPublishedPassage(result.passage, destination)) { setStatus(message || `${result.passage.title} published to ${destinationLabel}. Make further changes in the passage editor.`, result.examAssignment?.error ? 'error' : 'success'); return; }
        await this.library();
        setStatus(message || `${result.passage.title} published to ${destinationLabel}.`, result.examAssignment?.error ? 'error' : 'success');
        return;
      } else await api('/api/document-publish-math', { method: 'POST', body: JSON.stringify({ entryId: e.id, assessmentId: target, revision: this.state.revision }) });
      await reloadState(); await this.library(); setStatus('Reviewed content published through the existing content editor.', 'success');
    });
  },
  locateIssue(issue) {
    const content = this.entry.content;
    let index = content.questions.findIndex((question, i) => `Question ${question.review?.sourceQuestion || i + 1}` === issue.scope || (question.visuals || []).some(visual => issue.code === 'IMAGE_REQUIRED' && issue.message.includes(visual.description)));
    if (index >= 0) this.index = index;
    this.render();
    const dialog = document.querySelector('#document-review-dialog');
    let field;
    if (issue.code === 'IMAGE_REQUIRED') {
      const visuals = [...(content.visuals || []), ...(content.questions[this.index]?.visuals || [])];
      const visualIndex = visuals.findIndex(visual => issue.message.includes(visual.description));
      field = dialog.querySelector(`[data-doc-visual="${Math.max(0, visualIndex)}"]`);
    } else if (issue.code === 'ANSWER_KEY_MISSING' || issue.code === 'SOURCE_KEY_AMBIGUOUS') field = dialog.querySelector('[data-doc-field="answer"]');
    else if (issue.code === 'EXPLANATION_MISSING') field = dialog.querySelector('[data-doc-field="question.explanation"]');
    else if (issue.code === 'LOW_CONFIDENCE_QUESTION_TYPE') field = dialog.querySelector('[data-doc-field="question.topic"]');
    else if (index >= 0) field = dialog.querySelector('[data-doc-field="question.prompt"]');
    else field = dialog.querySelector(issue.code === 'POSSIBLE_MISSING_QUESTION' ? '[data-review="completenessReviewed"]' : '[data-review="sourceReviewed"]');
    field?.focus({ preventScroll: true }); field?.scrollIntoView({ block: 'center' });
  },
};
