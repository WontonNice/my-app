// Both frames share an ephemeral in-memory Chrome API substitute.
window.chrome = {
  runtime: { id: 'local-fixture', onMessage: { addListener: fn => parent.fixtureState.listeners.push(fn) } },
  tabs: {
    query: async () => [{ id: 1, url: 'https://www.shsatlab.com/units/unit-1/practice?fixture=local' }],
    sendMessage: async (_id, message) => new Promise((resolve, reject) => {
      if (!parent.fixtureState.listeners.length) { reject(new Error('Source fixture not ready')); return; }
      parent.fixtureState.listeners[0](message, { id: 'local-fixture' }, resolve);
    })
  },
  storage: {
    local: {
      get: async () => ({ elaQueue: structuredClone(parent.fixtureState.queue), elaLatest: structuredClone(parent.fixtureState.latest) }),
      set: async ({ elaQueue, elaLatest }) => {
        parent.fixtureState.queue = structuredClone(elaQueue); parent.fixtureEvent(`Saved ${elaQueue.length} question(s)`);
        parent.fixtureState.latest = structuredClone(elaLatest);
        for (const fn of parent.fixtureState.changes) fn({ elaQueue: { newValue: structuredClone(elaQueue) }, elaLatest: { newValue: structuredClone(elaLatest) } }, 'local');
      }
    },
    onChanged: { addListener: fn => parent.fixtureState.changes.push(fn) }
  }
};
