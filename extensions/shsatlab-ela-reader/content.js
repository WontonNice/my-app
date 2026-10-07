// Only an explicit message from this extension can start a one-question action.
// No automatic runs on page load, source-site network calls, or hidden-state access.
const captureController = NathanLabElaAutomation.create({
  reader: NathanLabElaReader, identity: NathanLabElaQueue.identity, document,
  getUrl: () => location.href,
  save: async question => {
    const queue = (await chrome.storage.local.get("elaQueue")).elaQueue ?? [];
    const merged = NathanLabElaQueue.merge(queue, question);
    const latest = merged.queue.find(q => NathanLabElaQueue.identity(q) === NathanLabElaQueue.identity(question));
    await chrome.storage.local.set({ elaQueue: merged.queue, elaLatest: latest });
    return merged;
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id || message?.type !== "NATHAN_CAPTURE_ELA") return;
  captureController.run({ reveal: message.reveal === true, advance: message.advance === true, allowSubmit: message.allowSubmit === true })
    .then(sendResponse, error => sendResponse({ error: error.message }));
  return true;
});
