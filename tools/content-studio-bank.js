const contentStudioBankModel = {
  matching(bank, filters) {
    return bank.questions.filter(q => q.subject === filters.subject && q.source === filters.source && ["section", "topic", "difficulty", "status"].every(key => !filters[key] || q[key] === filters[key]) && `${q.prompt} ${q.passage?.text || ""}`.toLowerCase().includes((filters.search || "").toLowerCase().trim()));
  },
  publishIssue(q) {
    if (!/^[A-D]$/.test(q.correctChoiceId) || !q.explanation?.trim() || !["easy", "medium", "hard", "elite"].includes(q.difficulty)) return "Needs a valid key, explanation, and difficulty.";
    if (q.visuals?.length && !q.visualImage) return "Required visual needs upload.";
    return "";
  },
  emptyMessage(bank, subject) {
    if (subject === "Math") return "SHSAT Lab has no Math captures. Use Exam math for the separate Math pipeline.";
    return bank.questions.length ? `No questions match these filters. ${bank.questions.length} questions are still stored. Click Show all questions to see them.` : "No questions have been imported yet. Import an authorized ELA capture queue to begin.";
  },
  selectQuestions(candidates, count, balanced = false, random = Math.random) {
    const published = candidates.filter(q => q.status === "published");
    if (!Number.isInteger(count) || count < 1 || count > 100) throw new Error("Choose 1–100 questions.");
    if (published.length < count) throw new Error(`Only ${published.length} published questions match. Choose a smaller size or broaden the filters.`);
    const shuffle = items => { const result = [...items]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
    if (!balanced) return shuffle(published).slice(0, count);
    const topics = new Map(); for (const q of shuffle(published)) { if (!topics.has(q.topic)) topics.set(q.topic, []); topics.get(q.topic).push(q); }
    const groups = shuffle([...topics.values()]), picked = [];
    while (picked.length < count) for (const group of groups) { if (group.length && picked.length < count) picked.push(group.shift()); }
    return picked;
  },
  suggestedTitle(questions) {
    const topics = [...new Set(questions.map(q => q.topic))];
    return `${topics.length === 1 ? topics[0] : "Mixed ELA"} · ${questions.length}-question practice`;
  }
};
if (typeof module !== "undefined") module.exports = contentStudioBankModel;
(() => {
  if (typeof document === "undefined") return;
  const root = document.getElementById("question-bank-workspace");
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let bank = { revision: 0, questions: [], sets: [] }; let sourceTopics = []; const selected = new Set(); let review; let page = 0; let busy = false; let publishIds = []; let captureInput = ""; let importPreview; let suggestedTitle = ""; let importSuggestedTitle = ""; let previewVersion = 0;
  root.className = "bank-workspace";
  root.innerHTML = `<header class="bank-heading"><div><small>CONTENT LIBRARY · ENGLISH</small><h2>SHSAT Lab question bank</h2><p id="bank-summary"></p></div><div class="bank-row-actions"><button id="bank-reload" type="button">Reload</button><button id="bank-open-import" class="bank-primary" type="button">Import questions</button></div></header>
    <p id="bank-notice" class="bank-notice" role="status" aria-live="polite"></p>
    <details class="bank-import"><summary>Import one question or a batch</summary><div id="bank-drop" class="bank-drop"><div><strong>Drop capture files here</strong><span>Single captures, queues, JSON arrays, or JSONL. Up to 1,000 questions.</span></div><label class="bank-file-button">Choose files<input id="bank-file" type="file" multiple accept="application/json,.json,.jsonl,application/x-ndjson"></label><button id="bank-paste" type="button">Paste from clipboard</button></div><p id="bank-file-status" class="bank-muted"></p><textarea id="bank-json" aria-label="SHSATLab capture JSON" placeholder="Or paste one capture or a full queue here. Source, topic, and section are detected automatically from the capture URL."></textarea><div class="bank-row-actions"><button id="bank-preview-import" type="button">Preview captures</button><details class="bank-help"><summary>How to capture</summary><p>Use the extension in <code>extensions/shsatlab-ela-reader</code> on SHSAT Lab's English topic practice pages (units 1–16). Capture the visible question, or use Reveal &amp; capture after allowing a temporary answer. Export one question or the saved queue, then drop it here. Math imports use the separate Math editor.</p></details></div><div id="bank-import-preview" hidden></div><fieldset id="bank-import-options" hidden><legend>Finish import</legend><label class="bank-check"><input id="bank-import-publish" type="checkbox"> Publish complete questions now; keep incomplete ones as drafts</label><label id="bank-import-verify-label" class="bank-check" hidden><input id="bank-import-verified" type="checkbox"> I reviewed these captures against the source, including answers, explanations, and required visuals.</label><label class="bank-check"><input id="bank-import-set" type="checkbox"> Also create a practice set from this batch's published questions (up to 100)</label><label id="bank-import-title-label" hidden>Practice-set title<input id="bank-import-title" maxlength="300"></label><label id="bank-import-skip-label" class="bank-check" hidden><input id="bank-import-skip" type="checkbox"> Skip the invalid captures listed above</label><button id="bank-import" class="bank-primary" type="button" disabled>Import captures</button></fieldset></details>
    <div class="bank-layout"><section class="bank-browser" aria-label="Question list"><input id="bank-subject" type="hidden" value="English"><input id="bank-source" type="hidden" value="SHSAT Lab"><div class="bank-search-row"><input id="bank-search" type="search" aria-label="Search questions" placeholder="Search questions or passages"><button id="bank-show-all" type="button">Show all questions</button></div><div class="bank-toolbar"><label>Section<select id="bank-section"><option value="">All ELA</option><option value="reading">Reading</option><option value="revising_editing_a">Revising / editing</option></select></label><label>Topic<select id="bank-topic"><option value="">All topics</option></select></label><label>Level<select id="bank-difficulty"><option value="">All levels</option>${["easy", "medium", "hard", "elite", "unknown"].map(v => `<option>${v}</option>`).join("")}</select></label><label>Status<select id="bank-status"><option value="">All questions</option><option value="draft">Needs review</option><option value="published">Published</option></select></label></div><div class="bank-list-toolbar"><span id="bank-count"></span><button id="bank-select-matching" type="button">Select matching</button><button id="bank-publish-all" type="button" disabled>Review drafts</button></div><div class="bank-table"><table><thead><tr><th><input id="bank-select-page" type="checkbox" aria-label="Select this page's published questions"></th><th>Question</th><th>Topic / level</th><th>Action</th></tr></thead><tbody id="bank-rows"></tbody></table></div></section>
    <aside class="bank-builder" aria-label="Practice set builder"><div class="bank-builder-heading"><div><small>PRACTICE BUILDER</small><h3>Your question set</h3></div><button id="bank-clear" type="button">Clear</button></div><p class="bank-muted">Choose questions across topics, or let the bank pick from your current filters.</p><div class="bank-generator"><label>Questions<input id="bank-size" type="number" value="10" min="1" max="100"></label><label>Selection<select id="bank-balance"><option value="balanced">Balance topics</option><option value="random">Random</option></select></label><button id="bank-generate" type="button">Pick questions</button></div><p id="bank-selection-summary"></p><ol id="bank-selected" class="bank-selected"></ol><label class="bank-title-label">Set title<input id="bank-set-title" maxlength="300" placeholder="Generated from your selection"></label><button id="bank-create-set" class="bank-primary" type="button" disabled>Save practice set</button><p class="bank-muted">Saved sets appear under Learning plan → Available content → Skill practice.</p></aside></div>
    <section class="bank-sets"><header><h3>Saved practice sets</h3><span id="bank-set-count"></span></header><div id="bank-sets"></div><p class="bank-muted">Published questions and saved sets stay fixed for existing assignments. Use a saved set as a starting point to make a new one. Rebuild the student app when deploying content changes.</p></section>
    <dialog id="bank-review" class="bank-review"><form><h2 id="bank-review-title">Review captured question</h2><p id="bank-review-meta"></p><p id="bank-review-notes" class="bank-preview"></p><label>Passage title<input name="title" maxlength="300"></label><label>Passage format<select name="format"><option>prose</option><option>poem</option><option>sentence_prose</option></select></label><label>Passage text<textarea name="passage" rows="9"></textarea></label><label>Question<textarea name="prompt" required></textarea></label>${["A", "B", "C", "D"].map(id => `<label>Choice ${id}<textarea name="choice-${id}" required></textarea></label>`).join("")}<label>Correct answer (not your selected answer)<select name="correct"><option value="">Not revealed</option>${["A", "B", "C", "D"].map(id => `<option>${id}</option>`).join("")}</select></label><label>Difficulty<select name="difficulty">${["unknown", "easy", "medium", "hard", "elite"].map(v => `<option>${v}</option>`).join("")}</select></label><label>Source explanation<textarea name="explanation" rows="7" required></textarea></label>${["A", "B", "C", "D"].map(id => `<label>Why ${id} is wrong (leave correct choice blank)<textarea name="wrong-${id}"></textarea></label>`).join("")}<label>Supporting visual path (upload using editor Media first)<input name="image" placeholder="/exam-images/figure.png"></label><label>Visual alt text<input name="alt"></label><label class="bank-check"><input name="verified" type="checkbox" required> I checked the passage, formatting, all choices, answer key, explanation, and required visuals against the source.</label><p id="bank-review-error" role="alert"></p><div class="bank-row-actions"><button class="primary bank-publish" type="submit">Publish reviewed question</button><button id="bank-close" type="button">Close without publishing</button></div></form></dialog>
    <dialog id="bank-bulk-review" class="bank-review"><form><h2>Publish all matching drafts</h2><p id="bank-bulk-summary"></p><p>This includes matching drafts across every page, not just the visible 50. Published questions will not be changed. Incomplete questions remain drafts with a reason.</p><div id="bank-bulk-items" class="bank-preview"></div><label class="bank-check"><input id="bank-bulk-verified" type="checkbox" required> I reviewed every listed draft against its source, including the passage, choices, correct key, explanations, formatting, and required visuals.</label><p id="bank-bulk-error" role="alert"></p><div class="bank-row-actions"><button id="bank-bulk-submit" class="bank-primary" type="submit" disabled>Publish reviewed drafts</button><button id="bank-bulk-cancel" type="button">Cancel</button></div></form></dialog>`;
  const $ = id => document.getElementById(id);
  const notice = message => { $("bank-notice").textContent = message; };
  let syncRefreshing = false;
  window.addEventListener('nathanlab-bank-updated', async () => {
    if (busy || syncRefreshing || root.querySelector('dialog[open], .bank-import[open]')) return;
    syncRefreshing = true;
    try { await load(); notice('SHSAT Lab captures were imported automatically as editable drafts.'); }
    catch (error) { notice(error.message); }
    finally { syncRefreshing = false; }
  });
  const paging = document.createElement("div"); paging.className = "bank-paging"; paging.innerHTML = '<button id="bank-prev" type="button">Previous</button><span id="bank-page"></span><button id="bank-next" type="button">Next</button>'; $("bank-rows").closest(".bank-table").after(paging);
  async function api(path, body) { const r = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revision: bank.revision, ...body }) } : { cache: "no-store" }); const data = await r.json(); if (!r.ok) throw new Error(data.message || "Bank request failed."); return data; }
  let personal = {labels: [], questions: {}};
  const tagsBar = document.createElement('div'); tagsBar.className = 'bank-toolbar';
  tagsBar.innerHTML = '<label>My Tags<select id="bank-my-label"><option value="">All labels</option></select></label><label><input id="bank-my-favorites" type="checkbox"> Favorites only</label><label>Sort<select id="bank-my-sort"><option value="">Source order</option><option value="favorite">Favorites first</option><option value="recent">Recently tagged</option></select></label><div id="bank-bulk-tags"></div>';
  root.querySelector('.bank-toolbar').after(tagsBar);
  for (const input of tagsBar.querySelectorAll('select,input')) input.onchange = () => {page=0;render();};
  window.addEventListener('studio:teacher-labels', event => { personal=event.detail;const value=$('bank-my-label').value;$('bank-my-label').innerHTML='<option value="">All labels</option>'+personal.labels.map(label=>'<option value="'+esc(label.id)+'">'+esc(label.name)+'</option>').join('');$('bank-my-label').value=value;render(); });
  function matching() {
    const filters=Object.fromEntries(["subject", "source", "section", "topic", "difficulty", "status"].map(key => [key, $(`bank-${key}`).value]));
    const query=$('bank-search').value.toLowerCase().trim(), label=$('bank-my-label').value;
    const rows=contentStudioBankModel.matching(bank, filters).filter(q => {
      const own=personal.questions[q.id];
      return (!label || own?.labelIds.includes(label)) && (!$('bank-my-favorites').checked || own?.favorite) && [q.prompt,q.passage?.text,own?.note,...personal.labels.filter(l=>own?.labelIds.includes(l.id)).map(l=>l.name)].join(' ').toLowerCase().includes(query);
    });
    if($('bank-my-sort').value==='favorite')rows.sort((a,b)=>Number(!!personal.questions[b.id]?.favorite)-Number(!!personal.questions[a.id]?.favorite));
    if($('bank-my-sort').value==='recent')rows.sort((a,b)=>(personal.questions[b.id]?.updatedAt||'').localeCompare(personal.questions[a.id]?.updatedAt||''));
    return rows;
  }
  function showAll() { $('bank-my-label').value='';$('bank-my-favorites').checked=false;$('bank-my-sort').value=''; $("bank-subject").value = "English"; for (const id of ["bank-section", "bank-topic", "bank-difficulty", "bank-status", "bank-search"]) $(id).value = ""; page = 0; render(); }
  function selectedQuestions() { return [...selected].map(id => bank.questions.find(q => q.id === id)).filter(Boolean); }
  function renderImportOptions() {
    const publish = $("bank-import-publish").checked;
    const eligible = importPreview ? [...new Map(importPreview.rows.filter(row => row.question && (row.status === "published" || publish && !row.issue)).map(row => [row.id, row.question])).values()] : [];
    $("bank-import-set").disabled = busy || !eligible.length || eligible.length > 100;
    $("bank-import-set").title = eligible.length > 100 ? "This batch has more than 100 eligible questions. Import it, then use the practice builder to choose a subset." : !eligible.length ? "Publish complete questions first to create a practice set." : `${eligible.length} published questions will be included.`;
    if (!eligible.length || eligible.length > 100) $("bank-import-set").checked = false;
    const makeSet = $("bank-import-set").checked;
    if (eligible.length && (!$("bank-import-title").value || $("bank-import-title").value === importSuggestedTitle)) { importSuggestedTitle = contentStudioBankModel.suggestedTitle(eligible); $("bank-import-title").value = importSuggestedTitle; }
    $("bank-import-verify-label").hidden = !publish; $("bank-import-title-label").hidden = !makeSet;
    $("bank-import").disabled = busy || !importPreview || Boolean(importPreview.summary.invalid && !$("bank-import-skip").checked) || publish && !$("bank-import-verified").checked;
    $("bank-import").textContent = makeSet ? "Import & create practice set" : publish ? "Import & publish ready questions" : "Import as drafts";
  }
  function renderSelection() {
    const questions = selectedQuestions(), topics = [...new Set(questions.map(q => q.topic))];
    $("bank-selection-summary").textContent = `${questions.length} / 100 selected${topics.length ? ` · ${topics.length} topic${topics.length === 1 ? "" : "s"}` : ""}`;
    $("bank-selected").innerHTML = questions.length ? questions.map((q, i) => `<li><span><strong title="${esc(q.prompt)}">${esc(q.prompt)}</strong><small>${esc(q.topic)} · ${esc(q.difficulty)}</small></span><div><button data-move="${i}" data-direction="-1" aria-label="Move question ${i + 1} earlier" ${i === 0 ? "disabled" : ""}>↑</button><button data-move="${i}" data-direction="1" aria-label="Move question ${i + 1} later" ${i === questions.length - 1 ? "disabled" : ""}>↓</button><button data-remove="${esc(q.id)}" aria-label="Remove question ${i + 1}">×</button></div></li>`).join("") : '<li class="bank-selection-empty">Select a question to start. Your selection stays while you change filters.</li>';
    const nextTitle = questions.length ? contentStudioBankModel.suggestedTitle(questions) : "";
    if (!$("bank-set-title").value || $("bank-set-title").value === suggestedTitle) $("bank-set-title").value = nextTitle;
    suggestedTitle = nextTitle;
    $("bank-create-set").disabled = busy || !questions.length;
  }
  function render() {
    const isEnglish = $("bank-subject").value === "English";
    root.querySelector(".bank-import").hidden = !isEnglish;
    $("bank-generate").disabled = !isEnglish || busy;
    for (const id of ["bank-reload", "bank-clear", "bank-show-all", "bank-select-matching", "bank-select-page", "bank-preview-import", "bank-paste", "bank-file"]) $(id).disabled = busy;
    const topic = $("bank-topic").value; const topics = sourceTopics.filter((_, index) => !$("bank-section").value || ($("bank-section").value === "reading" ? index < 8 : index >= 8));
    $("bank-topic").innerHTML = `<option value="">All topics</option>${topics.map(t => `<option>${esc(t)}</option>`).join("")}`; if (topics.includes(topic)) $("bank-topic").value = topic;
    const allRows = matching(); page = Math.max(0, Math.min(page, Math.ceil(allRows.length / 50) - 1)); const rows = allRows.slice(page * 50, (page + 1) * 50); $("bank-count").textContent = `${allRows.length} matching · ${bank.questions.length} total · ${selected.size} selected`;
    const drafts = bank.questions.filter(q => q.status === "draft").length;
    $("bank-summary").textContent = `${bank.questions.length} stored questions · ${bank.questions.length - drafts} published · ${drafts} drafts`;
    const matchingDrafts = allRows.filter(q => q.status === "draft").length;
    $("bank-publish-all").textContent = `Review drafts (${matchingDrafts})`;
    $("bank-publish-all").disabled = !isEnglish || busy || !matchingDrafts;
    $("bank-bulk-submit").disabled = busy || !publishIds.length || !$("bank-bulk-verified").checked;
    $("bank-bulk-cancel").disabled = busy;
    $("bank-page").textContent = `Page ${page + 1} of ${Math.max(1, Math.ceil(allRows.length / 50))} · 50 per page`; $("bank-prev").disabled = page === 0; $("bank-next").disabled = (page + 1) * 50 >= allRows.length;
    $("bank-rows").innerHTML = rows.length ? rows.map(q => `<tr class="${selected.has(q.id) ? "is-selected" : ""}"><td><input type="checkbox" aria-label="Select ${esc(q.prompt.slice(0, 100))}" data-bank-select="${esc(q.id)}" ${selected.has(q.id) ? "checked" : ""} ${q.status !== "published" || busy ? "disabled" : ""}></td><td><span class="bank-question-prompt" title="${esc(q.prompt)}">${esc(q.prompt)}</span><small>${esc(q.passage?.title || "Standalone item")} ${q.status === "draft" ? `<span class="bank-draft">Draft${contentStudioBankModel.publishIssue(q) ? " · needs details" : " · ready to review"}</span>` : ""}</small></td><td><span class="bank-topic-name">${esc(q.topic)}</span><small>${esc(q.difficulty)}</small></td><td><button type="button" data-bank-review="${esc(q.id)}">${q.status === "draft" ? "Review" : "View"}</button></td></tr>`).join("") : `<tr><td colspan="4">${esc(contentStudioBankModel.emptyMessage(bank, $("bank-subject").value))}</td></tr>`;
    const selectablePage = rows.filter(q => q.status === "published"); $("bank-select-page").checked = selectablePage.length > 0 && selectablePage.every(q => selected.has(q.id)); $("bank-select-page").indeterminate = selectablePage.some(q => selected.has(q.id)) && !$("bank-select-page").checked;
    $("bank-set-count").textContent = `${bank.sets.length} sets`;
    $("bank-sets").innerHTML = bank.sets.map(set => `<article><div><strong>${esc(set.title)}</strong><span>${set.questionIds.length} questions · ${new Set(set.questionIds.map(id => bank.questions.find(q => q.id === id)?.topic).filter(Boolean)).size} topics</span></div><div class="bank-row-actions"><button type="button" data-use-set="${esc(set.id)}">Use as starting point</button><button type="button" data-copy-set="${esc(set.id)}">Copy student path</button></div></article>`).join("") || '<p class="bank-muted">Your saved practice sets will appear here.</p>';
    renderSelection(); renderImportOptions();
    studioUI.mountTeacherTags($("bank-bulk-tags"), [...selected]);
  }
  async function reload() { bank = await api("/api/question-bank"); sourceTopics = bank.topics ?? sourceTopics; for (const id of selected) if (!bank.questions.some(q => q.id === id && q.status === "published")) selected.delete(id); invalidatePreview(); render(); }
  async function action(fn) { if (busy) return; busy = true; render(); try { await fn(); } catch (error) { notice(error.message); } finally { busy = false; render(); } }
  for (const id of ["bank-subject", "bank-source", "bank-section", "bank-topic", "bank-difficulty", "bank-status", "bank-search"]) $(id).addEventListener(id === "bank-search" ? "input" : "change", () => { page = 0; render(); });
  $("bank-prev").onclick = () => { page--; render(); }; $("bank-next").onclick = () => { page++; render(); };
  $("bank-reload").onclick = () => action(reload);
  $("bank-show-all").onclick = () => { showAll(); notice("Showing all stored English / SHSAT Lab questions, including published items."); };
  function invalidatePreview() { previewVersion++; importPreview = undefined; $("bank-import-preview").hidden = true; $("bank-import-options").hidden = true; $("bank-import-verified").checked = false; $("bank-import-skip").checked = false; renderImportOptions(); }
  function questionPreview(q) { return `${q.passage ? `<div class="bank-import-passage"><strong>${esc(q.passage.title)}</strong><p>${esc(q.passage.text)}</p></div>` : ""}<strong>${esc(q.prompt)}</strong><ol type="A">${q.choices.map(c => `<li>${esc(c.text)}${c.id === q.correctChoiceId ? " ✓" : ""}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(q.correctChoiceId || "Not revealed")}</p><p>${esc(q.explanation || "Explanation not captured")}</p>${Object.entries(q.incorrectChoiceExplanations ?? {}).map(([id, text]) => `<p>${esc(id)}: ${esc(text)}</p>`).join("")}${q.visualImage ? `<img alt="${esc(q.visualImage.alt)}" src="${esc(q.visualImage.src)}">` : ""}`; }
  async function previewCaptures() {
    const version = ++previewVersion; importPreview = undefined; renderImportOptions();
    const result = await api("/api/question-bank/import-preview", { capture: captureInput || $("bank-json").value });
    if (version !== previewVersion) return;
    importPreview = result;
    const s = result.summary;
    $("bank-import-preview").hidden = false;
    $("bank-import-preview").innerHTML = `<div class="bank-import-summary"><span><strong>${s.added}</strong> new</span><span><strong>${s.enriched}</strong> enriched</span><span><strong>${s.duplicates}</strong> duplicates skipped</span><span><strong>${s.invalid}</strong> invalid</span><span><strong>${s.ready}</strong> ready to publish</span><span><strong>${s.needsReview}</strong> need details</span></div><div class="bank-import-rows">${result.rows.map(row => `<details class="${row.action === "invalid" ? "is-invalid" : ""}"><summary><span class="bank-import-status">${esc(row.action)}</span><span>${esc(row.prompt)}<small>${esc(row.source)}${row.topic ? ` · ${esc(row.topic)}` : ""}</small></span></summary>${row.issue ? `<p class="bank-import-issue">${esc(row.issue)}</p>` : ""}${row.question ? `<div class="bank-capture-details">${questionPreview(row.question)}</div>` : `<p>${esc(row.issue)}</p>`}</details>`).join("")}</div>`;
    $("bank-import-options").hidden = false; $("bank-import-skip-label").hidden = !s.invalid;
    const incoming = [...new Map(result.rows.filter(row => row.question).map(row => [row.id, row.question])).values()];
    importSuggestedTitle = contentStudioBankModel.suggestedTitle(incoming); $("bank-import-title").value = importSuggestedTitle;
    renderImportOptions();
  }
  async function loadFiles(fileList) {
    const files = [...fileList]; if (!files.length) return;
    if (files.reduce((sum, file) => sum + file.size, 0) > 7_000_000) throw new Error("Choose capture files totaling under 7 MB.");
    if (files.length > 100) throw new Error("Choose at most 100 capture files at a time.");
    invalidatePreview(); captureInput = await Promise.all(files.map(async file => ({ name: file.name, text: await file.text() })));
    $("bank-json").value = ""; $("bank-file-status").textContent = `${files.length} file${files.length === 1 ? "" : "s"}: ${files.map(file => file.name).join(", ")}`;
    await previewCaptures();
  }
  $("bank-open-import").onclick = () => { root.querySelector(".bank-import").open = true; $("bank-json").focus(); };
  $("bank-file").onchange = () => action(() => loadFiles($("bank-file").files));
  $("bank-drop").addEventListener("dragover", event => { event.preventDefault(); $("bank-drop").classList.add("is-dragging"); });
  $("bank-drop").addEventListener("dragleave", () => $("bank-drop").classList.remove("is-dragging"));
  $("bank-drop").addEventListener("drop", event => { event.preventDefault(); $("bank-drop").classList.remove("is-dragging"); action(() => loadFiles(event.dataTransfer.files)); });
  let previewTimeout;
  $("bank-json").addEventListener("input", () => { captureInput = $("bank-json").value; $("bank-file-status").textContent = ""; invalidatePreview(); clearTimeout(previewTimeout); previewTimeout = setTimeout(() => { if (captureInput.trim() && !busy) action(previewCaptures); }, 500); });
  $("bank-preview-import").onclick = () => action(previewCaptures);
  $("bank-paste").onclick = () => action(async () => { try { const value = await navigator.clipboard.readText(); invalidatePreview(); captureInput = value; $("bank-json").value = value; $("bank-file-status").textContent = ""; await previewCaptures(); } catch (error) { $("bank-json").focus(); throw new Error(`Paste into the capture box if clipboard access is unavailable. ${error.message}`); } });
  for (const id of ["bank-import-publish", "bank-import-verified", "bank-import-set", "bank-import-skip"]) $(id).onchange = renderImportOptions;
  $("bank-import").onclick = () => action(async () => {
    if (!importPreview) throw new Error("Preview the capture first.");
    const result = await api("/api/question-bank/import-batch", { capture: captureInput || $("bank-json").value, previewToken: importPreview.previewToken, publishReady: $("bank-import-publish").checked, verified: $("bank-import-verified").checked, skipInvalid: $("bank-import-skip").checked, createSet: $("bank-import-set").checked, setTitle: $("bank-import-title").value });
    bank = result.bank; const s = result.summary; invalidatePreview(); showAll(); root.querySelector(".bank-import").open = false;
    if (!s.set) for (const id of s.importedIds) if (selected.size < 100 && bank.questions.some(q => q.id === id && q.status === "published")) selected.add(id);
    notice(`${s.added} added · ${s.enriched} enriched · ${s.duplicates} duplicates skipped · ${s.published} published${s.invalid ? ` · ${s.invalid} invalid skipped` : ""}.${s.set ? ` Practice set “${s.set.title}” saved with ${s.set.questionIds.length} questions.` : " Published captures are selected in the practice builder."}${s.skipped.length ? ` ${s.skipped.length} incomplete questions saved as drafts. Use Review to finish them.` : ""}`);
  });
  $("bank-publish-all").onclick = () => {
    if (busy || $("bank-subject").value !== "English") return;
    const drafts = matching().filter(q => q.status === "draft"); if (!drafts.length) return;
    publishIds = drafts.map(q => q.id); const blocked = drafts.filter(q => contentStudioBankModel.publishIssue(q)).length;
    $("bank-bulk-summary").textContent = `${drafts.length} matching drafts · ${drafts.length - blocked} ready for validation · ${blocked} incomplete. Only this listed batch will be considered.`;
    $("bank-bulk-items").innerHTML = drafts.map(q => `<p><strong>${esc(q.prompt.slice(0, 180))}</strong><br>${esc(q.sourceTopic)} · ${esc(q.difficulty)} · ${esc(contentStudioBankModel.publishIssue(q) || "Ready for validation")}</p>`).join("");
    $("bank-bulk-verified").checked = false; $("bank-bulk-error").textContent = ""; render(); $("bank-bulk-review").showModal();
  };
  $("bank-bulk-verified").onchange = render;
  $("bank-bulk-cancel").onclick = () => { if (!busy) $("bank-bulk-review").close(); };
  $("bank-bulk-review").addEventListener("cancel", event => { if (busy) event.preventDefault(); });
  $("bank-bulk-review").querySelector("form").onsubmit = async event => {
    event.preventDefault(); if (busy || !$("bank-bulk-verified").checked) return;
    busy = true; render(); $("bank-bulk-error").textContent = "Publishing the reviewed batch…";
    try {
      const result = await api("/api/question-bank/publish-all", { questionIds: [...publishIds], verified: true }); bank = result.bank;
      $("bank-bulk-review").close(); publishIds = []; showAll();
      notice(`${result.summary.published} draft${result.summary.published === 1 ? "" : "s"} published. ${result.summary.skipped.length} incomplete draft${result.summary.skipped.length === 1 ? "" : "s"} left unchanged.${result.summary.skipped.length ? "\n" + result.summary.skipped.map(item => `${bank.questions.find(q => q.id === item.id)?.prompt.slice(0, 100) || item.id}: ${item.reason}`).join("\n") : ""}`);
    } catch (error) { $("bank-bulk-error").textContent = error.message; }
    finally { busy = false; render(); }
  };
  $("bank-clear").onclick = () => { selected.clear(); render(); };
  $("bank-generate").onclick = () => action(async () => { const candidates = contentStudioBankModel.selectQuestions(matching(), Number($("bank-size").value), $("bank-balance").value === "balanced"); selected.clear(); candidates.forEach(q => selected.add(q.id)); render(); notice(`Picked ${candidates.length} questions. Adjust their order or save your practice set.`); });
  $("bank-create-set").onclick = () => action(async () => { const result = await api("/api/question-bank/sets", { title: $("bank-set-title").value, questionIds: [...selected] }); bank = result.bank; selected.clear(); render(); notice("Practice set saved. It is now available in the learning-plan catalog; refresh Available content. Published student app content requires a rebuild for deployment."); });
  function addSelection(questions) { const newQuestions = questions.filter(q => q.status === "published" && !selected.has(q.id)); if (newQuestions.length + selected.size > 100) { notice("A practice set supports up to 100 questions. Use Pick questions to choose a smaller sample, or narrow the filters."); render(); return; } newQuestions.forEach(q => selected.add(q.id)); render(); }
  $("bank-select-matching").onclick = () => addSelection(matching());
  $("bank-select-page").onchange = event => { const rows = matching().slice(page * 50, (page + 1) * 50); if (event.target.checked) addSelection(rows); else { rows.forEach(q => selected.delete(q.id)); render(); } };
  $("bank-rows").onchange = event => { const id = event.target.dataset.bankSelect; if (!id) return; if (event.target.checked) addSelection([bank.questions.find(q => q.id === id)]); else { selected.delete(id); render(); } };
  $("bank-selected").onclick = event => { const button = event.target.closest("button"); if (!button || busy) return; if (button.dataset.remove) selected.delete(button.dataset.remove); else if (button.dataset.move != null) { const ids = [...selected], index = Number(button.dataset.move), target = index + Number(button.dataset.direction); if (target < 0 || target >= ids.length) return; [ids[index], ids[target]] = [ids[target], ids[index]]; selected.clear(); ids.forEach(id => selected.add(id)); } render(); };
  $("bank-sets").onclick = event => { const button = event.target.closest("button"); if (!button || busy) return; const set = bank.sets.find(set => set.id === (button.dataset.useSet || button.dataset.copySet)); if (!set) return; if (button.dataset.useSet) { selected.clear(); set.questionIds.forEach(id => selected.add(id)); $("bank-set-title").value = `${set.title} · copy`; render(); root.querySelector(".bank-builder").scrollIntoView({ behavior: "smooth", block: "nearest" }); notice("Set loaded into the builder. Change its selection or title to save a new set."); } else action(async () => { const path = `/study-hall/shsat/library/${set.id}`; try { await navigator.clipboard.writeText(path); notice(`Student path copied: ${path}`); } catch { notice(`Student path: ${path}`); } }); };
  $("bank-rows").onclick = event => {
    const id = event.target.dataset.bankReview; if (!id) return; review = bank.questions.find(q => q.id === id); const form = $("bank-review").querySelector("form"); form.reset();
    const set = (name, value) => { form.elements.namedItem(name).value = value ?? ""; };
    set("title", review.passage?.title); set("passage", review.passage?.text); set("format", review.passage?.format || "prose"); set("prompt", review.prompt); set("correct", review.correctChoiceId); set("difficulty", review.difficulty); set("explanation", review.explanation); set("image", review.visualImage?.src); set("alt", review.visualImage?.alt);
    for (const c of review.choices) { set(`choice-${c.id}`, c.text); set(`wrong-${c.id}`, review.incorrectChoiceExplanations[c.id]); }
    $("bank-review-meta").textContent = `English · SHSAT Lab · ${review.sourceTopic} · ${review.id}`; $("bank-review-notes").textContent = [...review.reviewNotes, ...review.visuals].join("\n") || "Check every field against the source."; $("bank-review-error").textContent = "";
    const published = review.status === "published"; [...form.elements].forEach(el => { if (el.id !== "bank-close" && !el.closest("[data-teacher-tags]")) el.disabled = published; }); $("bank-review-title").textContent = published ? "Published question · read only" : "Review captured question"; studioUI.mountTeacherTags($("bank-review-title").parentElement, review.id); $("bank-review-title").after($("bank-review").querySelector("[data-teacher-tags]")); $("bank-review").showModal();
  };
  $("bank-close").onclick = () => $("bank-review").close();
  $("bank-review").querySelector("form").onsubmit = async event => {
    event.preventDefault(); if (busy) return; const form = event.target; const value = name => form.elements.namedItem(name).value; const incorrectChoiceExplanations = {};
    for (const id of ["A", "B", "C", "D"]) if (value(`wrong-${id}`).trim()) incorrectChoiceExplanations[id] = value(`wrong-${id}`);
    busy = true; form.querySelector(".bank-publish").disabled = true; render();
    try { const result = await api("/api/question-bank/publish", { id: review.id, verified: form.elements.namedItem("verified").checked, question: { ...review, prompt: value("prompt"), choices: review.choices.map(c => ({ id: c.id, text: value(`choice-${c.id}`) })), correctChoiceId: value("correct"), explanation: value("explanation"), difficulty: value("difficulty"), incorrectChoiceExplanations, passage: value("passage").trim() ? { title: value("title"), text: value("passage"), format: value("format") } : null, visualImage: value("image").trim() ? { src: value("image").trim(), alt: value("alt") } : undefined } }); bank = result.bank; $("bank-review").close(); render(); notice("Reviewed question published. Select it to build a practice set."); }
    catch (error) { $("bank-review-error").textContent = error.message; }
    finally { busy = false; form.querySelector(".bank-publish").disabled = false; render(); }
  };
  action(async () => { await reload(); const params = new URLSearchParams(location.search), topic = params.get("bankTopic"); if (sourceTopics.includes(topic)) { $("bank-topic").value = topic; $("bank-status").value = "published"; $("bank-set-title").value = `${topic} · 10-question practice`; render(); } if (params.get("bankImport") === "1") { root.querySelector(".bank-import").open = true; $("bank-paste").focus(); notice("Your captures are on the clipboard. Click Paste from clipboard to preview them."); } });
})();
