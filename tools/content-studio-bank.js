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
  }
};
if (typeof module !== "undefined") module.exports = contentStudioBankModel;
(() => {
  if (typeof document === "undefined") return;
  const root = document.getElementById("question-bank-workspace");
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let bank = { revision: 0, questions: [], sets: [] }; let sourceTopics = []; const selected = new Set(); let review; let page = 0; let busy = false; let publishIds = [];
  root.className = "bank-workspace";
  root.innerHTML = `<h2>Question Bank · SHSAT Lab</h2><p>English only: Reading and Revising/Editing. Math stays in the separate Math editor. Import captures as drafts, review the source, then publish and build a fixed practice set for assignments.</p>
    <div class="bank-overview"><p id="bank-summary"></p><button id="bank-show-all" type="button">Show all questions</button><button id="bank-publish-all" class="bank-primary" type="button" disabled>Publish all matching drafts</button></div>
    <details class="bank-import"><summary>Import SHSATLab ELA captures</summary><p>Install or reload the unpacked extension from <code>extensions/shsatlab-ela-reader</code>. For manual capture, reveal the answer yourself and click Capture visible ELA question. For one-click capture, enable the temporary-answer consent and click Capture &amp; next: it submits A if needed, reads the revealed correct key and full explanation, saves, then opens one new question. This changes your SHSATLab practice results. No Math, tests, or crawling. Copy its ready JSON and paste below, or upload the downloaded queue.</p><label>Upload capture JSON <input id="bank-file" type="file" accept="application/json,.json"></label><textarea id="bank-json" aria-label="SHSATLab ELA capture JSON" placeholder="Paste the extension queue JSON here"></textarea><button id="bank-import" type="button">Import as review drafts</button></details>
    <div class="bank-toolbar"><label>Subject<select id="bank-subject"><option>English</option><option>Math</option></select></label><label>Source<select id="bank-source"><option>SHSAT Lab</option></select></label><label>Section<select id="bank-section"><option value="">All ELA</option><option value="reading">Reading comprehension</option><option value="revising_editing_a">Revising/Editing</option></select></label><label>Topic<select id="bank-topic"><option value="">All topics</option></select></label><label>Difficulty<select id="bank-difficulty"><option value="">All levels</option>${["easy", "medium", "hard", "elite", "unknown"].map(v => `<option>${v}</option>`).join("")}</select></label><label>Status<select id="bank-status"><option value="">Drafts + published</option><option value="draft">Needs review</option><option value="published">Published</option></select></label><label>Search<input id="bank-search" type="search" placeholder="Question or passage"></label><button id="bank-reload" type="button">Reload bank</button></div>
    <p id="bank-notice" class="bank-notice" role="status" aria-live="polite"></p><p id="bank-count"></p><div class="bank-table"><table><thead><tr><th>Select</th><th>Question / passage</th><th>Source topic</th><th>Level / review</th><th>Actions</th></tr></thead><tbody id="bank-rows"></tbody></table></div>
    <div class="bank-toolbar"><label>Set size<input id="bank-size" type="number" value="10" min="1" max="100"></label><button id="bank-generate" type="button">Select random matching questions</button><button id="bank-clear" type="button">Clear selection</button><label>Practice-set title<input id="bank-set-title" placeholder="Evidence & Support · Practice 1" maxlength="300"></label><button id="bank-create-set" type="button">Save selected as practice set</button></div><p>Checkboxes select published questions for a set. Random selection uses the current filters and never includes review drafts. Fewer than the requested count will not silently create a shorter set.</p><section class="bank-sets"><h3>Saved practice sets</h3><p>Assign these in a student's Learning plan → Available content → Skill practice, Subject English, Source SHSAT Lab. Saved sets and published questions are immutable. Rebuild the app when deploying content changes.</p><div id="bank-sets"></div></section>
    <dialog id="bank-review" class="bank-review"><form><h2 id="bank-review-title">Review captured question</h2><p id="bank-review-meta"></p><p id="bank-review-notes" class="bank-preview"></p><label>Passage title<input name="title" maxlength="300"></label><label>Passage format<select name="format"><option>prose</option><option>poem</option><option>sentence_prose</option></select></label><label>Passage text<textarea name="passage" rows="9"></textarea></label><label>Question<textarea name="prompt" required></textarea></label>${["A", "B", "C", "D"].map(id => `<label>Choice ${id}<textarea name="choice-${id}" required></textarea></label>`).join("")}<label>Correct answer (not your selected answer)<select name="correct"><option value="">Not revealed</option>${["A", "B", "C", "D"].map(id => `<option>${id}</option>`).join("")}</select></label><label>Difficulty<select name="difficulty">${["unknown", "easy", "medium", "hard", "elite"].map(v => `<option>${v}</option>`).join("")}</select></label><label>Source explanation<textarea name="explanation" rows="7" required></textarea></label>${["A", "B", "C", "D"].map(id => `<label>Why ${id} is wrong (leave correct choice blank)<textarea name="wrong-${id}"></textarea></label>`).join("")}<label>Supporting visual path (upload using editor Media first)<input name="image" placeholder="/exam-images/figure.png"></label><label>Visual alt text<input name="alt"></label><label class="bank-check"><input name="verified" type="checkbox" required> I checked the passage, formatting, all choices, answer key, explanation, and required visuals against the source.</label><p id="bank-review-error" role="alert"></p><div class="bank-row-actions"><button class="primary bank-publish" type="submit">Publish reviewed question</button><button id="bank-close" type="button">Close without publishing</button></div></form></dialog>
    <dialog id="bank-bulk-review" class="bank-review"><form><h2>Publish all matching drafts</h2><p id="bank-bulk-summary"></p><p>This includes matching drafts across every page, not just the visible 50. Published questions will not be changed. Incomplete questions remain drafts with a reason.</p><div id="bank-bulk-items" class="bank-preview"></div><label class="bank-check"><input id="bank-bulk-verified" type="checkbox" required> I reviewed every listed draft against its source, including the passage, choices, correct key, explanations, formatting, and required visuals.</label><p id="bank-bulk-error" role="alert"></p><div class="bank-row-actions"><button id="bank-bulk-submit" class="bank-primary" type="submit" disabled>Publish reviewed drafts</button><button id="bank-bulk-cancel" type="button">Cancel</button></div></form></dialog>`;
  const $ = id => document.getElementById(id);
  const notice = message => { $("bank-notice").textContent = message; };
  const paging = document.createElement("div"); paging.className = "bank-toolbar"; paging.innerHTML = '<button id="bank-prev" type="button">Previous questions</button><span id="bank-page"></span><button id="bank-next" type="button">Next questions</button>'; $("bank-rows").closest(".bank-table").after(paging);
  async function api(path, body) { const r = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revision: bank.revision, ...body }) } : { cache: "no-store" }); const data = await r.json(); if (!r.ok) throw new Error(data.message || "Bank request failed."); return data; }
  function matching() { return contentStudioBankModel.matching(bank, Object.fromEntries(["subject", "source", "section", "topic", "difficulty", "status", "search"].map(key => [key, $(`bank-${key}`).value]))); }
  function showAll() { $("bank-subject").value = "English"; for (const id of ["bank-section", "bank-topic", "bank-difficulty", "bank-status", "bank-search"]) $(id).value = ""; page = 0; selected.clear(); render(); }
  function render() {
    const isEnglish = $("bank-subject").value === "English";
    root.querySelector(".bank-import").hidden = !isEnglish;
    $("bank-generate").disabled = $("bank-create-set").disabled = !isEnglish || busy;
    for (const id of ["bank-import", "bank-reload", "bank-clear", "bank-show-all"]) $(id).disabled = busy;
    const topic = $("bank-topic").value; const topics = sourceTopics.filter((_, index) => !$("bank-section").value || ($("bank-section").value === "reading" ? index < 8 : index >= 8));
    $("bank-topic").innerHTML = `<option value="">All topics</option>${topics.map(t => `<option>${esc(t)}</option>`).join("")}`; if (topics.includes(topic)) $("bank-topic").value = topic;
    const allRows = matching(); page = Math.max(0, Math.min(page, Math.ceil(allRows.length / 50) - 1)); const rows = allRows.slice(page * 50, (page + 1) * 50); $("bank-count").textContent = `${allRows.length} matching · ${bank.questions.length} total · ${selected.size} selected`;
    const drafts = bank.questions.filter(q => q.status === "draft").length;
    $("bank-summary").textContent = `${bank.questions.length} stored questions · ${bank.questions.length - drafts} published · ${drafts} drafts`;
    const matchingDrafts = allRows.filter(q => q.status === "draft").length;
    $("bank-publish-all").textContent = `Publish all matching drafts (${matchingDrafts})`;
    $("bank-publish-all").disabled = !isEnglish || busy || !matchingDrafts;
    $("bank-bulk-submit").disabled = busy || !publishIds.length || !$("bank-bulk-verified").checked;
    $("bank-bulk-cancel").disabled = busy;
    $("bank-page").textContent = `Page ${page + 1} of ${Math.max(1, Math.ceil(allRows.length / 50))} · 50 per page`; $("bank-prev").disabled = page === 0; $("bank-next").disabled = (page + 1) * 50 >= allRows.length;
    $("bank-rows").innerHTML = rows.length ? rows.map(q => `<tr><td><input type="checkbox" aria-label="Select ${esc(q.id)}" data-bank-select="${esc(q.id)}" ${selected.has(q.id) ? "checked" : ""} ${q.status !== "published" ? "disabled" : ""}></td><td>${esc(q.prompt)}<small>${esc(q.passage?.title || "Standalone ELA item")}</small></td><td>${esc(q.sourceTopic)}<small>${esc(q.topic)} · ${esc(q.section)}</small></td><td>${esc(q.difficulty)}<small>${esc(q.status)}${!q.correctChoiceId ? " · missing key" : ""}${!q.explanation ? " · missing explanation" : ""}</small></td><td><button type="button" data-bank-review="${esc(q.id)}">${q.status === "draft" ? "Review & publish" : "View"}</button></td></tr>`).join("") : `<tr><td colspan="5">${esc(contentStudioBankModel.emptyMessage(bank, $("bank-subject").value))}</td></tr>`;
    $("bank-sets").innerHTML = bank.sets.filter(set => set.subject === $("bank-subject").value && set.source === $("bank-source").value).map(set => `<p><strong>${esc(set.title)}</strong> · ${set.questionIds.length} questions · ${esc(set.source)}<br><code>/study-hall/shsat/library/${esc(set.id)}</code></p>`).join("") || "<p>No saved sets match this subject/source.</p>";
  }
  async function reload() { bank = await api("/api/question-bank"); sourceTopics = bank.topics ?? sourceTopics; selected.clear(); render(); }
  async function action(fn) { if (busy) return; busy = true; render(); try { await fn(); } catch (error) { notice(error.message); } finally { busy = false; render(); } }
  for (const id of ["bank-subject", "bank-source", "bank-section", "bank-topic", "bank-difficulty", "bank-status", "bank-search"]) $(id).addEventListener(id === "bank-search" ? "input" : "change", () => { page = 0; selected.clear(); render(); });
  $("bank-prev").onclick = () => { page--; render(); }; $("bank-next").onclick = () => { page++; render(); };
  $("bank-reload").onclick = () => action(reload);
  $("bank-show-all").onclick = () => { showAll(); notice("Showing all stored English / SHSAT Lab questions, including published items."); };
  $("bank-file").onchange = () => action(async () => { const file = $("bank-file").files[0]; if (!file) return; if (file.size > 7_000_000) throw new Error("Capture JSON must be under 7 MB."); $("bank-json").value = await file.text(); notice("Capture file loaded. Import as drafts to review it."); });
  $("bank-import").onclick = () => action(async () => { const result = await api("/api/question-bank/import", { capture: JSON.parse($("bank-json").value) }); bank = result.bank; showAll(); root.querySelector(".bank-import").open = false; notice(`${result.summary.added} new drafts, ${result.summary.enriched} enriched, ${result.summary.duplicates} duplicates skipped. Showing drafts and published questions. Review drafts before publishing.`); });
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
  $("bank-generate").onclick = () => action(async () => { const count = Number($("bank-size").value); const candidates = matching().filter(q => q.status === "published"); if (!Number.isInteger(count) || count < 1 || count > 100) throw new Error("Choose 1–100 questions."); if (candidates.length < count) throw new Error(`Only ${candidates.length} published matching questions. Import/review more, adjust filters, or choose a smaller set size.`); for (let i = candidates.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [candidates[i], candidates[j]] = [candidates[j], candidates[i]]; } selected.clear(); candidates.slice(0, count).forEach(q => selected.add(q.id)); render(); });
  $("bank-create-set").onclick = () => action(async () => { const result = await api("/api/question-bank/sets", { title: $("bank-set-title").value, questionIds: [...selected] }); bank = result.bank; selected.clear(); render(); notice("Practice set saved. It is now available in the learning-plan catalog; refresh Available content. Published student app content requires a rebuild for deployment."); });
  $("bank-rows").onchange = event => { const id = event.target.dataset.bankSelect; if (!id) return; if (event.target.checked) selected.add(id); else selected.delete(id); $("bank-count").textContent = `${matching().length} matching · ${bank.questions.length} total · ${selected.size} selected`; };
  $("bank-rows").onclick = event => {
    const id = event.target.dataset.bankReview; if (!id) return; review = bank.questions.find(q => q.id === id); const form = $("bank-review").querySelector("form"); form.reset();
    const set = (name, value) => { form.elements.namedItem(name).value = value ?? ""; };
    set("title", review.passage?.title); set("passage", review.passage?.text); set("format", review.passage?.format || "prose"); set("prompt", review.prompt); set("correct", review.correctChoiceId); set("difficulty", review.difficulty); set("explanation", review.explanation); set("image", review.visualImage?.src); set("alt", review.visualImage?.alt);
    for (const c of review.choices) { set(`choice-${c.id}`, c.text); set(`wrong-${c.id}`, review.incorrectChoiceExplanations[c.id]); }
    $("bank-review-meta").textContent = `English · SHSAT Lab · ${review.sourceTopic} · ${review.id}`; $("bank-review-notes").textContent = [...review.reviewNotes, ...review.visuals].join("\n") || "Check every field against the source."; $("bank-review-error").textContent = "";
    const published = review.status === "published"; [...form.elements].forEach(el => { if (el.id !== "bank-close") el.disabled = published; }); $("bank-review-title").textContent = published ? "Published question · read only" : "Review captured question"; $("bank-review").showModal();
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
  action(async () => { await reload(); const topic = new URLSearchParams(location.search).get("bankTopic"); if (sourceTopics.includes(topic)) { $("bank-topic").value = topic; $("bank-status").value = "published"; $("bank-set-title").value = `${topic} · 10-question practice`; render(); } });
})();
