const $ = id => document.getElementById(id);
let tab; let queue = []; let latest; let recovery; let busy = false; let supported = false;
function render() {
  $("count").textContent = `${queue.length} saved · ${queue.filter(q => !q.correctChoiceId || !q.explanation).length} need answer/explanation review`;
  const questions = recovery ? [recovery] : $("all-queue").checked ? queue : latest ? [latest] : [];
  $("ready").value = questions.length ? JSON.stringify(NathanLabElaQueue.envelope(questions), null, 2) : "";
  $("download").disabled = !queue.length || busy;
  $("copy").disabled = !questions.length || busy;
  $("clear").disabled = busy;
  $("capture").disabled = busy || !supported;
  $("automation").hidden = !supported;
  $("allow-submit").disabled = busy;
  $("reveal").disabled = $("capture-next").disabled = busy || !supported || !$("allow-submit").checked;
}
async function refreshQueue() {
  const stored = await chrome.storage.local.get(["elaQueue", "elaLatest"]);
  queue = stored.elaQueue ?? [];
  latest = stored.elaLatest && queue.some(q => NathanLabElaQueue.identity(q) === NathanLabElaQueue.identity(stored.elaLatest)) ? stored.elaLatest : queue.at(-1); render();
}
async function init() {
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  supported = Boolean(NathanLabElaReader.unitForUrl(tab?.url));
  $("page").textContent = supported ? `English · ${NathanLabElaReader.topics[NathanLabElaReader.unitForUrl(tab.url) - 1]}` : "Capture disabled. Open an ELA topic practice page (units 1–16). Math and unknown pages are not read.";
  await refreshQueue();
}
async function capture({ reveal = false, advance = false } = {}) {
  if (busy || !supported || (reveal && !$("allow-submit").checked)) return;
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
$("clear").addEventListener("click", async () => {
  if (busy || !confirm("Clear the local queue? Download it first if needed.")) return;
  try { await chrome.storage.local.set({ elaQueue: [], elaLatest: null }); queue = []; latest = recovery = null; render(); $("status").textContent = "Local queue cleared."; }
  catch (error) { $("status").textContent = `Could not clear the queue: ${error.message}`; }
});
init().catch(error => { $("status").textContent = error.message; });
