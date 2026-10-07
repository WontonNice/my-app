(function (root) {
  // One item per explicit extension click. No background loop or private source API.
  function create({ reader, identity, document, getUrl, save, wait = ms => new Promise(resolve => setTimeout(resolve, ms)), now = () => Date.now(), timeoutMs = 15000, intervalMs = 250 }) {
    let busy = false;
    const visible = el => Boolean(el?.getClientRects().length) && !el.closest('[hidden], [aria-hidden="true"]');
    const label = el => el.innerText.replace(/\r\n?/g, "\n").trim();
    const revealedSignature = q => JSON.stringify([q.correctChoiceId, q.explanation, q.incorrectChoiceExplanations]);
    const controls = pattern => [...document.querySelectorAll("button")].filter(el => visible(el) && pattern.test(label(el)));
    function button(pattern, description, optional = false) {
      const matches = controls(pattern);
      if (matches.length === 0 && optional) return null;
      if (matches.length !== 1) throw new Error(`Could not uniquely identify ${description}. Stopped without advancing.`);
      return matches[0];
    }
    function supported() {
      if (!reader.unitForUrl(getUrl())) throw new Error("Automation is available only on verified SHSATLab ELA practice units 1–16. Math and tests are not read.");
    }
    function sameQuestion(originalUrl, expected) {
      supported();
      if (getUrl() !== originalUrl) throw new Error("The source page changed during capture. Stopped without advancing.");
      const q = reader.read(document, getUrl());
      if (identity(q) !== expected) throw new Error("The source question changed during capture. Stopped without advancing.");
      return q;
    }
    async function poll(check, failure) {
      const deadline = now() + timeoutMs;
      do {
        const result = check();
        if (result) return result;
        await wait(intervalMs);
      } while (now() < deadline);
      throw new Error(failure);
    }
    async function run({ reveal = false, advance = false, allowSubmit = false } = {}) {
      supported(); // Always reject Math/unknown URLs before touching the DOM.
      if (busy) throw new Error("A capture is already running. Wait for it to finish.");
      if ((reveal || advance) && allowSubmit !== true) throw new Error("Enable the temporary-answer consent checkbox first. Submission changes SHSATLab practice history.");
      if (advance && !reveal) throw new Error("Advancing requires a complete revealed capture.");
      busy = true;
      let question;
      try {
        const originalUrl = getUrl();
        question = reader.read(document, originalUrl);
        const expected = identity(question);
        if (reveal && !question.correctChoiceId) {
          const { buttons } = reader.questionElements(document, originalUrl);
          if (buttons.some(b => b.disabled)) throw new Error("The source is already submitting or has not revealed a key. Wait and retry; no answer was submitted.");
          // Verify the Submit control BEFORE selecting anything; never click a level/test control.
          button(/^Submit Answer$/i, "Submit Answer");
          sameQuestion(originalUrl, expected);
          buttons[0].click(); // Temporary A, not an inferred or imported correct answer.
          const submit = await poll(() => {
            sameQuestion(originalUrl, expected);
            const el = button(/^Submit Answer$/i, "Submit Answer");
            return !el.disabled && el;
          }, "Submit Answer did not become available. Nothing was saved or advanced.");
          submit.click(); // Exactly once; retries never resubmit a revealed item.
        }
        if (reveal) {
          let opened = false; let stable = ""; let repeats = 0;
          question = await poll(() => {
            const q = sameQuestion(originalUrl, expected);
            if (!q.correctChoiceId) return null;
            if (!reader.explanationComplete(document, q)) {
              if (!opened) {
                const show = button(/^(?:.* — )?See explanation$/i, "See explanation", true);
                if (show && !show.disabled) { show.click(); opened = true; }
              }
              stable = ""; repeats = 0; return null;
            }
            const signature = revealedSignature(q);
            repeats = signature === stable ? repeats + 1 : 0; stable = signature;
            return repeats >= 2 ? q : null;
          }, "A complete revealed key and explanation did not appear. The question was not saved or advanced. Expand the explanation and retry, or use manual capture for a draft.");
        }
        const beforeSave = sameQuestion(originalUrl, expected);
        if (reveal && revealedSignature(beforeSave) !== revealedSignature(question)) throw new Error("The revealed answer or explanation changed before saving. Stopped without advancing; retry capture.");
        let saved;
        try { saved = await save(question); }
        catch (error) { return { question, error: `Capture could not be saved: ${error.message}. The source was NOT advanced. Copy the ready JSON to keep this item.`, saved: false }; }
        // The durable queue is saved before any Next click, even if the popup closes.
        const result = { question, saved: true, updated: saved?.updated ?? false, advanced: false };
        if (advance) {
          try {
            const current = sameQuestion(originalUrl, expected);
            if (!reader.explanationComplete(document, current) || revealedSignature(current) !== revealedSignature(question)) throw new Error("The revealed answer or explanation changed. Saved capture retained; source was not advanced.");
            const next = button(/^(Next Question|Try Another)$/i, "Next Question / Try Another");
            if (next.disabled) throw new Error("Next Question is disabled. Saved capture retained.");
            next.click();
            await poll(() => {
              supported();
              if (reader.unitForUrl(getUrl()) !== reader.unitForUrl(originalUrl)) throw new Error("The source navigated away from this ELA unit. Saved capture retained; no further action taken.");
              try { return identity(reader.read(document, getUrl())) !== expected; }
              catch { return false; } // Allow the visible question's loading transition only.
            }, "Next did not reveal a different readable question. Saved capture retained; no automatic retry.");
            result.advanced = true;
          } catch (error) { result.nextError = error.message; }
        }
        return result;
      } finally { busy = false; }
    }
    return { run };
  }
  const api = { create };
  if (typeof module !== "undefined") module.exports = api;
  else root.NathanLabElaAutomation = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
