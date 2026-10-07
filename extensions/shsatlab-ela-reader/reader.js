(function (root) {
  const topics = ["Central Idea & Theme", "Author's Point of View", "Word & Phrase Meaning", "Figurative Language & Imagery", "Tone & Mood", "Text Structure", "Evidence & Support", "Inference", "Sentence Structure", "Pronouns", "Verbs", "Modifiers", "Punctuation", "Word Choice & Precision", "Topic & Transitions", "Relevance & Conclusion"];
  function unitForUrl(url) {
    try {
      const parsed = new URL(url); const match = parsed.pathname.match(/^\/units\/unit-(\d+)\/practice\/?$/);
      return parsed.protocol === "https:" && ["shsatlab.com", "www.shsatlab.com"].includes(parsed.hostname) && !parsed.port && !parsed.username && !parsed.password && match && +match[1] >= 1 && +match[1] <= 16 ? +match[1] : null;
    } catch { return null; }
  }
  const visible = el => Boolean(el?.getClientRects().length) && !el.closest('[hidden], [aria-hidden="true"]');
  const text = el => el?.innerText?.replace(/\r\n?/g, "\n").trim() ?? "";
  function questionElements(document, url) {
    const unit = unitForUrl(url);
    // Reject unsupported/Math URLs BEFORE examining any page content.
    if (!unit) throw new Error("Capture is available only on verified SHSATLab ELA practice units 1–16. Math is not supported.");
    const bannerTopics = [...document.querySelectorAll("header p")].filter(visible).map(text);
    if (!bannerTopics.includes(topics[unit - 1])) throw new Error("The visible ELA topic does not match this unit. Capture stopped; review the page layout.");
    const main = document.querySelector("main"); if (!main) throw new Error("Open a visible ELA question first.");
    const groups = [...main.querySelectorAll('div[class*="space-y-2"]')].filter(el => {
      const buttons = [...el.children].filter(child => child.tagName === "BUTTON");
      return buttons.length === 4 && buttons.every(button => visible(button) && button.querySelector(".math-text"));
    });
    if (groups.length !== 1) throw new Error("Could not uniquely identify four answer choices. No content was captured; review the source layout.");
    const group = groups[0]; const buttons = [...group.children].filter(el => el.tagName === "BUTTON");
    const promptEl = group.previousElementSibling?.querySelector("p .math-text");
    if (!visible(promptEl) || !text(promptEl)) throw new Error("The visible question wording could not be located.");
    return { unit, main, group, buttons, promptEl };
  }
  function read(document, url) {
    const { unit, main, group, buttons, promptEl } = questionElements(document, url);
    const choices = buttons.map((button, i) => ({ id: String.fromCharCode(65 + i), text: text(button.querySelector(".math-text")) }));
    if (choices.some(c => !c.text)) throw new Error("An answer choice is unreadable; no partial item was captured.");
    const marked = buttons.map((button, i) => ({ id: choices[i].id, correct: /✓\s*Correct answer\s*$/i.test(text(button)) })).filter(q => q.correct);
    const summaries = [...document.querySelectorAll("p")].filter(el => visible(el) && /^Correct Answer:\s*[A-D]\)/i.test(text(el)));
    const summaryKeys = [...new Set(summaries.map(el => text(el).match(/^Correct Answer:\s*([A-D])\)/i)?.[1]))];
    const summaryKey = summaryKeys.length === 1 ? summaryKeys[0] : "";
    let correctChoiceId = marked.length === 1 ? marked[0].id : "";
    if (summaryKey && correctChoiceId && summaryKey !== correctChoiceId || marked.length > 1 || summaryKeys.length > 1) throw new Error("The displayed correct-answer signals disagree. Review the source before capturing.");
    correctChoiceId ||= summaryKey || "";
    const passageEls = [...main.querySelectorAll(".prose")].filter(visible);
    if (passageEls.length > 1) throw new Error("Multiple visible passages detected; capture cannot choose one safely.");
    const passageEl = passageEls[0];
    const passageText = passageEl ? [...passageEl.children].map(el => el.innerText.replace(/\r\n?/g, "\n")).join("\n\n") || passageEl.innerText.replace(/\r\n?/g, "\n") : "";
    if (unit <= 8 && !passageText) throw new Error("The reading passage is collapsed or unavailable. Expand it, then capture again.");
    const headings = [...document.querySelectorAll("h3")].filter(visible);
    const card = label => {
      const heading = headings.find(el => text(el) === label);
      return heading?.closest('div[class*="rounded-2xl"]');
    };
    const solution = card("Step-by-step solution");
    const quick = card("Iko's Quick Read"); const tip = card("Concept tip"); const wrong = card("Why the other choices don't work");
    const explanation = [quick, solution, tip].filter(Boolean).map(text).join("\n\n");
    const incorrectChoiceExplanations = {};
    for (const li of wrong?.querySelectorAll("li") ?? []) {
      const id = text(li.querySelector("span")); const value = text(li.querySelector("p"));
      if (/^[A-D]$/.test(id) && id !== correctChoiceId && value) incorrectChoiceExplanations[id] = value;
    }
    const bannerDifficulty = [...document.querySelectorAll("header button")].map(text).find(value => /^(easy|medium|hard|elite)$/i.test(value));
    const reviewNotes = [];
    if (!correctChoiceId) reviewNotes.push("No revealed correct answer was visible. This is an unkeyed draft, not a verified answer.");
    if (!explanation) reviewNotes.push("No revealed explanation was visible. Expand the explanation or review it manually.");
    if (!bannerDifficulty) reviewNotes.push("Difficulty was not visible; choose it during review.");
    const sourceTopic = topics[unit - 1];
    if (passageText) reviewNotes.push("The displayed heading is a skill label, not necessarily an original passage title. Review title and passage format.");
    if ([promptEl, passageEl, group].some(el => el?.querySelector("em, i, strong, b, u"))) reviewNotes.push("Source emphasis is present. Check that meaning-bearing emphasis is retained during review.");
    const visuals = [];
    for (const container of [passageEl, group.previousElementSibling, group]) {
      for (const el of container?.querySelectorAll("img, canvas, table, svg:not([aria-hidden='true'])") ?? []) {
        if (visible(el)) visuals.push(`${el.tagName.toLowerCase()}: ${el.getAttribute("alt") || el.getAttribute("aria-label") || "Supporting visual requires separate upload and review"}`);
      }
    }
    return { subject: "English", source: "SHSAT Lab", sourceUrl: `https://www.shsatlab.com/units/unit-${unit}/practice`, sourceUnit: unit, sourceTopic,
      difficulty: bannerDifficulty?.toLowerCase() || "unknown", prompt: text(promptEl), choices, correctChoiceId, explanation, incorrectChoiceExplanations,
      passage: passageText ? { title: sourceTopic, text: passageText, format: unit <= 8 ? "prose" : "sentence_prose" } : null,
      reviewNotes, visuals, capturedAt: new Date().toISOString() };
  }
  function explanationComplete(document, question) {
    const headings = [...document.querySelectorAll("h3")].filter(visible);
    // Require the complete, observed explanation layout, not a loading placeholder.
    const cardsReady = ["Iko's Quick Read", "Step-by-step solution", "Concept tip", "Why the other choices don't work"].every(label => {
      const card = headings.find(el => text(el) === label)?.closest('div[class*="rounded-2xl"]');
      return visible(card) && text(card).replace(label, "").trim().length > 0;
    });
    return cardsReady && Boolean(question.correctChoiceId && question.explanation) && question.choices.filter(c => c.id !== question.correctChoiceId).every(c => question.incorrectChoiceExplanations[c.id]);
  }
  const api = { topics, unitForUrl, questionElements, explanationComplete, read };
  if (typeof module !== "undefined") module.exports = api;
  else root.NathanLabElaReader = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
