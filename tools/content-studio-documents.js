/* Review UI around the existing passage and Math editors and publication endpoints. */
const DocumentStudio = {
  state: { revision: 0, entries: [] }, entry: null, index: 0,
  initialize() {
    const button = document.querySelector('#open-document-drafts');
    button.disabled = false;
    button.onclick = () => this.library();
    if (window.location.hash === '#document-drafts') this.library();
  },
  taxonomy() { return { reading: app.state.readingTopics, revising_editing_a: app.state.revisingEditingTopics, math: app.state.mathTopics }; },
  async library() {
    try {
      this.state = await api('/api/document-drafts');
      this.entry = null;
      this.render();
      if (!document.querySelector('#document-review-dialog').open) document.querySelector('#document-review-dialog').showModal();
    } catch (error) { setStatus(error.message, 'error'); }
  },
  async accept(source) {
    try {
      this.state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ source }) });
      document.querySelector('#official-passage-dialog').close();
      document.querySelector('#sat-passage-dialog').close();
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
      <button type="button" class="primary" id="document-accept">Save all as review drafts</button>`;
    container.querySelector('#document-accept').onclick = () => this.accept(app.passageImportSource || document.querySelector('#official-passage-import-source').value);
  },
  open(id) { this.entry = clone(this.state.entries.find(e => e.id === id)); this.index = 0; this.render(); },
  async save() {
    this.state = await api('/api/document-drafts', { method: 'POST', body: JSON.stringify({ revision: this.state.revision, entry: this.entry }) });
    this.entry = clone(this.state.entries.find(e => e.id === this.entry.id));
  },
  async saveCurrentPassage() {
    try {
      this.state = await api('/api/document-drafts');
      this.entry = clone(this.state.entries.find(e => e.id === app.passageDraft.importDraftId));
      this.entry.content = clone(app.passageDraft);
      await this.save(); app.passageDirty = false;
      setStatus('Review draft saved. Students cannot see it until you publish.', 'success');
    } catch (error) { setStatus(error.message, 'error'); }
  },
  openPublishedPassage(passage) {
    if (app.passageDirty) return false;
    app.passageMode = 'exam'; app.selectedPassageId = passage.id; app.passageDraft = clone(passage);
    studioUI.passageContext = ''; updatePassageWorkspaceLabels(); renderPassageList(); renderPassageEditor();
    switchTab('passages');
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
    const field = (label, key, value, multiline = false) => `<label class="field"><span>${label}</span>${multiline ? `<textarea data-doc-field="${key}" rows="5">${escapeHtml(value || '')}</textarea>` : `<input data-doc-field="${key}" value="${escapeHtml(value || '')}">`}</label>`;
    const reviewMarkup = (r, path) => `<small>Source: ${escapeHtml(r?.sourceFile || 'Not recorded')} · PDF pages ${escapeHtml((r?.sourcePages || []).join(', '))} ${escapeHtml(r?.printedPages || '')}</small>
      ${(r?.warnings || []).map((w, i) => `<label class="field"><span>${escapeHtml(w.code)}: ${escapeHtml(w.message)}</span><select data-warning="${path}:${i}"><option value="unresolved" ${w.state === 'unresolved' ? 'selected' : ''}>Unresolved</option><option value="acknowledged" ${w.state === 'acknowledged' ? 'selected' : ''}>Reviewed / acknowledged</option><option value="resolved" ${w.state === 'resolved' ? 'selected' : ''}>Resolved</option></select></label>`).join('')}`;
    const vs = p ? [...(p.visuals || []), ...(q?.visuals || [])] : [];
    const issues = e ? DocumentImport.issues(e, this.taxonomy()) : [];
    dialog.innerHTML = `<section class="panel"><div class="panel-head"><h2>${e ? 'Document review' : 'Saved document drafts'}</h2><button type="button" id="doc-close">Close</button></div><div id="doc-message" role="status"></div>
      ${!e ? `<p>Drafts are private to this Content Studio checkout. Publish uses the existing content files and student renderers.</p>${this.state.entries.map(entry => `<p><button data-doc-open="${entry.id}">${escapeHtml(entry.content.title || 'Untitled')} · ${entry.kind} · ${entry.content.questions.length} questions · ${entry.status}</button></p>`).join('') || '<p>No saved document import drafts yet. In Exam passages, choose Import documents, paste the JSON returned by ChatGPT, then Validate and review → Save all as review drafts.</p>'}` : `
      <div class="math-import-actions"><button id="doc-library">Back to drafts</button><button id="doc-save">Save review draft</button>${e.kind === 'passage' ? '<button id="doc-editor">Open passage editor / Student view</button>' : `<label>Destination exam <select id="doc-assessment"><option value="">Choose an exam</option>${app.state.assessments.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.title)}</option>`).join('')}</select></label>`}<button class="primary" id="doc-publish">${e.kind === 'passage' ? 'Publish passage' : 'Publish reviewed Math questions'}</button></div>
      <div class="math-import-warnings"><strong>${issues.filter(i => i.blocking).length} ${e.kind === 'passage' ? 'items to review — you can publish now and edit afterward' : 'publication checks remaining'}</strong><ul>${issues.map(i => `<li>${i.blocking ? '⚠ ' : ''}${escapeHtml(i.scope)}: ${escapeHtml(i.message)}</li>`).join('')}</ul></div>
      ${field('Title', 'title', p.title)}${e.kind === 'passage' ? `${field('Author name', 'author', p.author)}${field('Exact printed byline', 'byline', p.byline)}${field('Subtitle', 'subtitle', p.subtitle)}${field('Introductory blurb', 'blurb', p.blurb, true)}${field('Complete passage text', 'text', p.text, true)}` : ''}
      ${reviewMarkup(p.review, 'passage')}
      <label><input type="checkbox" data-review="sourceReviewed" ${p.review?.sourceReviewed ? 'checked' : ''}> I checked source wording, key and explanations against the supplied files.</label><br>
      <label><input type="checkbox" data-review="completenessReviewed" ${p.review?.completenessReviewed ? 'checked' : ''}> I verified all requested pages, questions and choices are included.</label>
      <hr><label>Question <select id="doc-question">${p.questions.map((item, i) => `<option value="${i}" ${this.index === i ? 'selected' : ''}>${i + 1} · Source ${escapeHtml(item.review?.sourceQuestion || item.id)}</option>`).join('')}</select></label>
      ${q ? `${field('Question', 'question.prompt', q.prompt, true)}${field('Instructions', 'question.instructions', q.instructions, true)}
      <label class="field"><span>Skill / topic</span><select data-doc-field="question.topic"><option value="">Unclassified</option>${(e.kind === 'math' ? app.state.mathTopics : this.taxonomy()[p.section] || []).map(t => `<option ${t === q.topic ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}</select></label>
      <p>Classification: ${escapeHtml(q.review?.topicSource || 'unknown')} · confidence ${q.review?.topicConfidence ?? 'unrated'} · difficulty ${escapeHtml(q.review?.difficulty || 'unrated')} (${escapeHtml(q.review?.difficultySource || 'unknown')})</p>
      <label><input type="checkbox" id="doc-classification" ${q.review?.classificationReviewed ? 'checked' : ''}> I reviewed this question’s classification.</label>
      ${(q.choices || []).map((c, i) => field(`Choice ${escapeHtml(c.id)}`, `choice.${i}`, c.text, true)).join('')}
      ${field('Verified answer (choice ID; multi-select / accepted answers separated by |)', 'answer', q.correctChoiceId || q.correctChoiceIds?.join('|') || q.correctTextAnswers?.join('|'))}
      ${field('Source explanation (leave blank when absent)', 'question.explanation', q.explanation, true)}${reviewMarkup(q.review, 'question')}
      <details><summary>Answer and explanation source references</summary><pre>${escapeHtml(JSON.stringify({ answerSource: q.review?.answerSource || null, explanationSource: q.review?.explanationSource || null }, null, 2))}</pre></details>` : '<p>No questions. Restore them in the JSON below.</p>'}
      ${vs.map((v, i) => `<div class="math-import-warnings"><strong>${v.state === 'resolved' ? 'Visual attached' : '⚠ SOURCE IMAGE REQUIRED'}</strong><p>${escapeHtml(v.scope || v.questionId || 'Passage')} · ${escapeHtml(v.sourceFile || '')} · PDF page ${v.sourcePage || '?'} · ${escapeHtml(v.location || '')}</p><p>${escapeHtml(v.description)}</p>${v.image ? `<img style="max-width:100%;max-height:240px" src="${escapeHtml(v.image.src)}" alt="${escapeHtml(v.image.alt)}">` : ''}<label>Upload original image / prepared crop <input type="file" data-doc-visual="${i}" accept="image/png,image/jpeg,image/webp,image/gif,.svgz"></label></div>`).join('')}
      <details><summary>Complete draft JSON / advanced fields and source metadata</summary><p>Edit structured fields here when needed, then apply. Nothing is dropped from the draft.</p><textarea id="doc-json" rows="18" style="width:100%">${escapeHtml(JSON.stringify(p, null, 2))}</textarea><button id="doc-apply">Apply JSON</button></details>`}</section>`;
    const handle = fn => async () => { try { await fn(); } catch (error) { dialog.querySelector('#doc-message').textContent = error.message; } };
    dialog.querySelector('#doc-close').onclick = () => { if (!e || window.confirm('Close review? Save your draft first to keep edits.')) dialog.close(); };
    dialog.querySelectorAll('[data-doc-open]').forEach(button => button.onclick = () => this.open(button.dataset.docOpen));
    if (!e) return;
    dialog.querySelector('#doc-library').onclick = handle(async () => { await this.save(); this.entry = null; this.render(); });
    dialog.querySelector('#doc-save').onclick = handle(async () => { await this.save(); this.render(); dialog.querySelector('#doc-message').textContent = 'Draft saved.'; });
    dialog.querySelectorAll('[data-doc-field]').forEach(input => input.oninput = () => {
      const key = input.dataset.docField;
      if (key.startsWith('question.')) { const name = key.slice(9); q[name] = input.value; delete q[name + 'Html']; }
      else if (key.startsWith('choice.')) { const choice = q.choices[Number(key.slice(7))]; choice.text = input.value; delete choice.html; delete choice.math; }
      else if (key === 'answer') {
        if (q.type === 'multiple_choice') q.correctChoiceId = input.value;
        else if (q.type === 'multi_select') q.correctChoiceIds = input.value.split('|').map(s => s.trim()).filter(Boolean);
        else q.correctTextAnswers = input.value.split('|').map(s => s.trim()).filter(Boolean);
      } else { p[key] = input.value; if (key === "text") p.richText = ""; }
    });
    dialog.querySelectorAll('[data-review]').forEach(input => input.onchange = () => { p.review ||= {}; p.review[input.dataset.review] = input.checked; });
    if (q) dialog.querySelector('#doc-classification').onchange = event => { q.review ||= {}; q.review.classificationReviewed = event.target.checked; };
    dialog.querySelectorAll('[data-warning]').forEach(input => input.onchange = () => { const [target, i] = input.dataset.warning.split(':'); (target === 'passage' ? p : q).review.warnings[Number(i)].state = input.value; });
    dialog.querySelector('#doc-question').onchange = event => { this.index = Number(event.target.value); this.render(); };
    dialog.querySelectorAll('[data-doc-visual]').forEach(input => input.onchange = handle(() => this.upload(vs[Number(input.dataset.docVisual)], input.files[0])));
    dialog.querySelector('#doc-apply').onclick = handle(() => { const content = JSON.parse(dialog.querySelector('#doc-json').value); if (!Array.isArray(content.questions)) throw new Error('questions must remain an array.'); this.entry.content = content; this.index = 0; this.render(); });
    if (e.kind === 'passage') dialog.querySelector('#doc-editor').onclick = handle(async () => {
      if (!confirmDiscard()) return;
      if (this.entry.status === 'published') {
        const saved = app.state.passages.find(passage => passage.id === p.id);
        if (saved) { app.passageDirty = false; this.openPublishedPassage(saved); return; }
      }
      await this.save(); app.passageMode = 'exam'; app.selectedPassageId = ''; app.passageDraft = clone(this.entry.content); app.passageDraft.preserveSourceLayout = true; app.passageDirty = false;
      studioUI.passageContext = ''; updatePassageWorkspaceLabels(); renderPassageList(); renderPassageEditor(); dialog.close();
    });
    dialog.querySelector('#doc-publish').onclick = handle(async () => {
      const target = dialog.querySelector('#doc-assessment')?.value;
      await this.save();
      if (e.kind === 'passage') {
        const result = await api('/api/passages', { method: 'POST', body: JSON.stringify({ ...this.entry.content, publishNow: true }) });
        await reloadState();
        if (this.openPublishedPassage(result.passage)) { setStatus(`${result.passage.title} published. Make further changes in the passage editor.`, 'success'); return; }
      } else await api('/api/document-publish-math', { method: 'POST', body: JSON.stringify({ entryId: e.id, assessmentId: target, revision: this.state.revision }) });
      await reloadState(); await this.library(); setStatus('Reviewed content published through the existing content editor.', 'success');
    });
  },
};
