(function (root) {
  function create({ controller, reader, identity, getUrl, readJob, writeJob, wait = ms => new Promise(resolve => setTimeout(resolve, ms)), now = () => Date.now(), newId = () => crypto.randomUUID() }) {
    let active = false;
    async function start({ count = 50, delayMs = 1500, allowSubmit = false } = {}) {
      const unit = reader.unitForUrl(getUrl());
      if (!unit) throw new Error('AFK capture supports the current English practice unit only. Open an ELA unit 1–16.');
      if (allowSubmit !== true) throw new Error('Enable temporary-answer consent before starting an AFK run.');
      if (!Number.isInteger(count) || count < 1 || count > 500) throw new Error('Choose 1–500 questions per run.');
      if (!Number.isInteger(delayMs) || delayMs < 1500 || delayMs > 30000) throw new Error('Choose a delay of 1.5–30 seconds.');
      const previous = await readJob();
      if (active || ['running', 'stopping'].includes(previous?.status)) throw new Error('An AFK run is already active. Stop it before starting another.');
      const job = { id: newId(), status: 'running', unit, sourceUrl: getUrl(), target: count, captured: 0, newQuestions: 0, duplicates: 0, delayMs, startedAt: now(), updatedAt: now(), message: 'Starting capture…' };
      await writeJob(job); active = true;
      void run(job);
      return job;
    }
    async function run(job) {
      const seen = new Set(); let repeats = 0;
      const live = async () => { const current = await readJob(); return current?.id === job.id && current.status === 'running'; };
      async function update(patch) {
        const current = await readJob();
        if (current?.id !== job.id) return;
        Object.assign(job, patch, { updatedAt: now() });
        if (current.status !== 'running' && job.status === 'running') job.status = current.status;
        try { await writeJob({ ...job }); }
        catch (error) { if (!job.recovery) throw error; delete job.recovery; await writeJob({ ...job }); }
      }
      try {
        while (job.captured < job.target && await live()) {
          if (reader.unitForUrl(getUrl()) !== job.unit) throw new Error('The source unit changed. Saved questions were retained.');
          if (now() - job.startedAt >= 2 * 60 * 60 * 1000) throw new Error('The two-hour run limit was reached. Saved questions were retained.');
          const result = await controller.run({ reveal: true, advance: false, allowSubmit: true, shouldContinue: live });
          if (!result?.saved || result.error) {
            if (result?.question) job.recovery = result.question;
            throw new Error(result?.error || 'The capture was not saved. The source was not advanced.');
          }
          const key = identity(result.question), duplicate = seen.has(key);
          seen.add(key); repeats = duplicate ? repeats + 1 : 0;
          await update({ captured: job.captured + 1, newQuestions: job.newQuestions + (result.updated ? 0 : 1), duplicates: job.duplicates + (result.updated ? 1 : 0), message: `Saved ${job.captured + 1} of ${job.target}.` });
          if (!await live() || job.captured >= job.target) break;
          if (repeats >= 3) throw new Error('The source repeated saved questions three times. Stopped to avoid an endless run.');
          // Reuse the same controller for verified save-before-Next and loading checks.
          const advanced = await controller.run({ reveal: true, advance: true, allowSubmit: true, shouldContinue: live });
          if (advanced?.error || advanced?.nextError || !advanced?.advanced) throw new Error(advanced?.error || advanced?.nextError || 'The next question did not load.');
          for (let remaining = job.delayMs; remaining > 0 && await live(); remaining -= 250) await wait(Math.min(250, remaining));
        }
        await update({ status: job.captured >= job.target ? 'complete' : 'stopped', message: job.captured >= job.target ? `Completed ${job.captured} captures. All were saved before advancing.` : `Stopped after ${job.captured} saved captures.` });
      } catch (error) {
        const stopped = !await live();
        await update({ status: stopped ? 'stopped' : 'error', message: stopped ? `Stopped after ${job.captured} saved captures.` : error.message });
      } finally { active = false; }
    }
    return { start, get active() { return active; } };
  }
  const api = { create };
  if (typeof module !== 'undefined') module.exports = api;
  else root.NathanLabElaBulk = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
