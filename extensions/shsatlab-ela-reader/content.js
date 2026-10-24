// Runs start only from this extension's explicit controls. AFK progress belongs
// to this page, so closing the popup does not stop a run or lose saved questions.
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
const bulkController = NathanLabElaBulk.create({
  controller: captureController, reader: NathanLabElaReader, identity: NathanLabElaQueue.identity,
  getUrl: () => location.href,
  readJob: async () => (await chrome.storage.local.get('elaBulkJob')).elaBulkJob,
  writeJob: job => chrome.storage.local.set({ elaBulkJob: job })
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message?.type === 'NATHAN_START_ELA_BULK') {
    bulkController.start({ count: message.count, delayMs: message.delayMs, allowSubmit: message.allowSubmit === true })
      .then(job => sendResponse({ job }), error => sendResponse({ error: error.message }));
    return true;
  }
  if (message?.type !== 'NATHAN_CAPTURE_ELA') return;
  if (bulkController.active) { sendResponse({ error: 'Stop the AFK run before capturing manually.' }); return; }
  captureController.run({ reveal: message.reveal === true, advance: message.advance === true, allowSubmit: message.allowSubmit === true })
    .then(sendResponse, error => sendResponse({ error: error.message }));
  return true;
});
