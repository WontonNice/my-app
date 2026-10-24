(function (root) {
  const editorOrigin = origin => /^http:\/\/(127\.0\.0\.1|localhost):4319$/.test(origin);
  function create({ storage, fetch, origin, fingerprint, now = () => Date.now(), notify = () => {} }) {
    let busy = false;
    async function sync() {
      if (busy || !editorOrigin(origin)) return;
      busy = true;
      try {
        const initial = await storage.get(['elaSyncEnabled', 'elaQueue', 'elaSynced']);
        if (initial.elaSyncEnabled !== true) return;
        const questions = initial.elaQueue || [], acknowledged = initial.elaSynced || {};
        let processed = 0;
        for (const question of questions) {
          const key = await fingerprint(question);
          if (acknowledged[key]) continue;
          if ((await storage.get('elaSyncEnabled')).elaSyncEnabled !== true) break;
          let data;
          for (let attempt = 0; attempt < 3; attempt++) {
            const state = await request('/api/state');
            if (!state.editToken || !Array.isArray(state.assessments)) throw new Error('The local page is not the Content Editor.');
            const bank = await request('/api/question-bank');
            try {
              data = await request('/api/question-bank/import', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': state.editToken },
                body: JSON.stringify({ revision: bank.revision, capture: { format: 'nathan-tutors-shsatlab-ela-v1', questions: [question] } })
              });
              break;
            } catch (error) { if (attempt === 2 || !/changed in another window|token is missing/i.test(error.message)) throw error; }
          }
          // Acknowledge only after the editor's durable bank write succeeds.
          const latest = (await storage.get('elaSynced')).elaSynced || {};
          acknowledged[key] = now();
          const previous = (await storage.get('elaEditorSync')).elaEditorSync;
          await storage.set({ elaSynced: { ...latest, [key]: acknowledged[key] }, elaEditorSync: {
            status: 'synced', origin, imported: (previous?.imported || 0) + (data.summary?.added || 0),
            updatedAt: now(), message: 'Saved captures are imported as editable drafts.'
          } });
          processed++; notify('Saved captures are importing into the Question Bank as drafts.');
        }
        if (!processed) {
          const previous = (await storage.get('elaEditorSync')).elaEditorSync;
          await storage.set({ elaEditorSync: { ...previous, status: 'synced', origin, updatedAt: now(), message: 'Connected. Waiting for the next saved capture.' } });
        }
      } catch (error) {
        const previous = (await storage.get('elaEditorSync')).elaEditorSync;
        await storage.set({ elaEditorSync: { ...previous, status: 'error', origin, updatedAt: now(), message: `Import paused: ${error.message} Captures remain in the extension queue.` } });
        notify(`Import paused: ${error.message}. Saved captures are retained.`);
      } finally { busy = false; }
    }
    async function request(path, options = {}) {
      const response = await fetch(path, { ...options, credentials: 'omit', signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'The Content Editor could not save this capture.');
      return data;
    }
    return { sync };
  }
  const api = { create, editorOrigin };
  if (typeof module !== 'undefined') { module.exports = api; return; }
  if (!editorOrigin(location.origin) || window.top !== window) return;
  async function fingerprint(question) {
    const content = JSON.stringify([question.prompt, question.choices, question.passage?.text || '', question.correctChoiceId, question.explanation, question.incorrectChoiceExplanations]);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  let notice;
  function notify(message) {
    if (!notice) {
      notice = document.createElement('aside'); notice.setAttribute('role', 'status'); notice.id = 'nathanlab-import-status';
      Object.assign(notice.style, { position: 'fixed', bottom: '12px', right: '12px', zIndex: '10000', maxWidth: '330px', padding: '12px', background: '#edf8f0', border: '1px solid #b4d8ca', borderRadius: '8px', color: '#174c3c', font: '13px/1.4 system-ui' });
      document.body.append(notice);
    }
    notice.replaceChildren(document.createTextNode(`SHSAT Lab · ${message} `));
    const link = document.createElement('a'); link.href = '/#question-bank'; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Open imported drafts'; notice.append(link);
    if (message.startsWith('Saved captures')) window.dispatchEvent(new Event('nathanlab-bank-updated'));
  }
  const engine = create({ storage: chrome.storage.local, fetch: (...args) => fetch(...args), origin: location.origin, fingerprint, notify });
  const tick = () => navigator.locks ? navigator.locks.request('nathanlab-editor-import', { ifAvailable: true }, lock => lock ? engine.sync() : undefined) : engine.sync();
  chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.elaQueue || changes.elaSyncEnabled)) void tick(); });
  setInterval(tick, 5000); void tick();
})(typeof globalThis !== 'undefined' ? globalThis : this);
