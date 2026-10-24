const $ = id => document.getElementById(id);
let tab; let queue = []; let latest; let recovery; let busy = false; let supported = false;
let bulkJob; let editorSync;
function render() {
  const running = ['running', 'stopping'].includes(bulkJob?.status);
  $("count").textContent = `${queue.length} saved · ${queue.filter(q => !q.correctChoiceId || !q.explanation).length} need answer/explanation review`;
  const questions = recovery ? [recovery] : $("all-queue").checked ? queue : latest ? [latest] : [];
  $("ready").value = questions.length ? JSON.stringify(NathanLabElaQueue.envelope(questions), null, 2) : "";
  $("download").disabled = !queue.length || busy;
  $("copy").disabled = !questions.length || busy;
  $("copy-open").disabled = !questions.length || busy;
  $("clear").disabled = busy || running;
  $("capture").disabled = busy || running || !supported;
  $("automation").hidden = !supported;
  $("allow-submit").disabled = busy || running;
  $("reveal").disabled = $("capture-next").disabled = busy || running || !supported || !$("allow-submit").checked;
  $("bulk-start").disabled = busy || running || !supported || !$("allow-submit").checked;
  $("bulk-stop").disabled = !running;
  $("bulk-count").disabled = $("bulk-delay").disabled = busy || running;
  $("bulk-progress").textContent = bulkJob ? `${bulkJob.status.toUpperCase()} · ${bulkJob.captured}/${bulkJob.target} saved · ${bulkJob.newQuestions} new · ${bulkJob.duplicates} already queued. ${bulkJob.message}` : 'No AFK run started.';
  $("sync-progress").textContent = editorSync ? `${editorSync.message}${editorSync.imported ? ` ${editorSync.imported} new drafts imported.` : ''}` : 'Start Content Studio on port 4319 for automatic draft imports.';
}
async function refreshQueue() {
  const stored = await chrome.storage.local.get(["elaQueue", "elaLatest", "elaBulkJob", "elaEditorSync", "elaSyncEnabled"]);
  queue = stored.elaQueue ?? [];
  bulkJob = stored.elaBulkJob; editorSync = stored.elaEditorSync;
  if (typeof stored.elaSyncEnabled === 'boolean') $("bulk-sync").checked = stored.elaSyncEnabled;
  latest = stored.elaLatest && queue.some(q => NathanLabElaQueue.identity(q) === NathanLabElaQueue.identity(stored.elaLatest)) ? stored.elaLatest : queue.at(-1); render();
}
async function init() {
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  supported = Boolean(NathanLabElaReader.unitForUrl(tab?.url));
  $("page").textContent = supported ? `English · ${NathanLabElaReader.topics[NathanLabElaReader.unitForUrl(tab.url) - 1]}` : "Capture disabled. Open an ELA topic practice page (units 1–16). Math and unknown pages are not read.";
  await refreshQueue();
}
async function capture({ reveal = false, advance = false } = {}) {
  if (busy || ['running', 'stopping'].includes(bulkJob?.status) || !supported || (reveal && !$("allow-submit").checked)) return;
  busy = true; recovery = null; render();
  $("status").textContent = reveal ? "Revealing the current question, then waiting for its full explanation…" : "Capturing the visible question…";
  try {
    const result = await chrome.tabs.sendMessage(tab.id, { type: "NATHAN_CAPTURE_ELA", reveal, advance, allowSubmit: reveal && $("allow-submit").checked });
    if (!result) throw new Error("No response from the ELA page.");
    if (result.error) { recovery = result.question; throw new Error(result.error); }
    await refreshQueue(); latest = result.question;
    $("status").textContent = `${result.updated ? "Updated existing capture" : "Saved"}. ${result.question.correctChoiceId ? `Revealed correct answer: ${result.question.correctChoiceId}.` : "No visible key; saved as a draft."}${result.advanced ? " Next question is ready. Click Capture & next again when ready." : ""}${result.nextError ? `\n${result.nextError}` : ""}`;
  } catch (error) { $("status").textContent = `${error.message}${recovery ? "" : " If newly installed or updated, reload the extension and the ELA page after saving your source-site work."}`; }
  finally { busy = false; render(); }
}
$("capture").addEventListener("click", () => capture());
$("reveal").addEventListener("click", () => capture({ reveal: true }));
$("capture-next").addEventListener("click", () => capture({ reveal: true, advance: true }));
$("allow-submit").addEventListener("change", render);
$("bulk-start").addEventListener('click', async () => {
  if (busy || !supported || !$("allow-submit").checked || ['running', 'stopping'].includes(bulkJob?.status)) return;
  const count = Number($("bulk-count").value), delayMs = Math.round(Number($("bulk-delay").value) * 1000);
  if (!Number.isInteger(count) || count < 1 || count > 500 || !Number.isFinite(delayMs) || delayMs < 1500 || delayMs > 30000) { $("status").textContent = 'Choose 1–500 questions and a pause of 1.5–30 seconds.'; return; }
  busy = true; recovery = null; render();
  try {
    const sync = $("bulk-sync").checked;
    await chrome.storage.local.set({ elaSyncEnabled: sync });
    if (sync) await chrome.tabs.create({ url: 'http://127.0.0.1:4319/#question-bank', active: false });
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'NATHAN_START_ELA_BULK', count, delayMs, allowSubmit: true });
    if (!result?.job) throw new Error(result?.error || 'The AFK reader is not connected. Reload the extension and source page first.');
    await refreshQueue();
    $("status").textContent = 'AFK capture started. Each question is saved before Next. You can close this popup and return here to stop or check progress.';
  } catch (error) { $("status").textContent = error.message; }
  finally { busy = false; render(); }
});
$("bulk-stop").addEventListener('click', async () => {
  const current = (await chrome.storage.local.get('elaBulkJob')).elaBulkJob;
  if (!current || !['running', 'stopping'].includes(current.status)) return;
  await chrome.storage.local.set({ elaBulkJob: { ...current, status: 'stopped', updatedAt: Date.now(), message: 'Stop requested. No further answer submissions or Next clicks will be made.' } });
  await refreshQueue();
});
$("bulk-sync").addEventListener('change', async () => { await chrome.storage.local.set({ elaSyncEnabled: $("bulk-sync").checked }); });
$("all-queue").addEventListener("change", render);
chrome.storage.onChanged.addListener((changes, area) => { if (area === "local" && (changes.elaQueue || changes.elaLatest)) { queue = changes.elaQueue?.newValue ?? queue; latest = changes.elaLatest?.newValue ?? queue.at(-1); render(); } });
$("download").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(NathanLabElaQueue.envelope(queue), null, 2)], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = "shsatlab-ela-capture.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("ready").value); $("status").textContent = "Ready import JSON copied. Paste it in Content Studio → Question Bank."; }
  catch { $("ready").focus(); $("ready").select(); $("status").textContent = "Select and copy the ready JSON, or download the saved queue."; }
});
$("copy-open").addEventListener("click", async () => {
  if (busy || !$("ready").value) return;
  try {
    await navigator.clipboard.writeText($("ready").value);
    await chrome.tabs.create({ url: "http://127.0.0.1:4319/?bankImport=1#question-bank" });
    $("status").textContent = "Captures copied. In Content Studio, click Paste from clipboard to preview and import.";
  } catch (error) { $("ready").focus(); $("ready").select(); $("status").textContent = `Could not open the editor: ${error.message}. Copy the ready JSON into Content Studio manually.`; }
});
$("clear").addEventListener("click", async () => {
  if (busy || !confirm("Clear the local queue? Download it first if needed.")) return;
  try { await chrome.storage.local.set({ elaQueue: [], elaLatest: null }); queue = []; latest = recovery = null; render(); $("status").textContent = "Local queue cleared."; }
  catch (error) { $("status").textContent = `Could not clear the queue: ${error.message}`; }
});
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.elaQueue || changes.elaLatest || changes.elaBulkJob || changes.elaEditorSync || changes.elaSyncEnabled)) refreshQueue().catch(error => { $("status").textContent = error.message; }); });
init().catch(error => { $("status").textContent = error.message; });
