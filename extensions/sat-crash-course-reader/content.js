(() => {
  const MAX_PAGE_TEXT_LENGTH = 250_000;
  const MAX_ITEM_TEXT_LENGTH = 10_000;
  const MAX_PASSAGE_QUESTIONS = 50;
  const READER_VERSION = "0.7.1";
  let scanInProgress = false;

  function cleanText(value) {
    return String(value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/[\t\r ]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number(style.opacity) === 0) return false;
    return element.getClientRects().length > 0;
  }

  function uniqueBy(items, keyFor) {
    const seen = new Set();
    return items.filter((item) => {
      const key = keyFor(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function absoluteUrl(value) {
    try {
      return new URL(value, location.href).href;
    } catch {
      return value || "";
    }
  }

  function readLinks(root = document) {
    return uniqueBy(
      [...root.querySelectorAll("a[href]")]
        .filter(isVisible)
        .map((link) => ({
          text: cleanText(link.innerText || link.getAttribute("aria-label")),
          url: absoluteUrl(link.getAttribute("href")),
        }))
        .filter((link) => link.text || link.url),
      (link) => `${link.text}\n${link.url}`,
    );
  }

  function readHeadings(root = document) {
    return [...root.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter(isVisible)
      .map((heading) => ({
        level: Number(heading.tagName.slice(1)),
        text: cleanText(heading.innerText),
      }))
      .filter((heading) => heading.text);
  }

  function readFields(root) {
    const fields = {};

    for (const term of root.querySelectorAll("dt")) {
      const description = term.nextElementSibling;
      if (!description?.matches("dd") || !isVisible(term) || !isVisible(description)) continue;
      const key = cleanText(term.innerText).replace(/:$/, "");
      const value = cleanText(description.innerText);
      if (key && value && !(key in fields)) fields[key] = value;
    }

    for (const row of root.querySelectorAll("tr")) {
      const cells = [...row.querySelectorAll(":scope > th, :scope > td")].filter(isVisible);
      if (cells.length !== 2) continue;
      const key = cleanText(cells[0].innerText).replace(/:$/, "");
      const value = cleanText(cells[1].innerText);
      if (key && value && key.length <= 80 && !(key in fields)) fields[key] = value;
    }

    for (const element of root.querySelectorAll("[data-label]")) {
      if (!isVisible(element)) continue;
      const key = cleanText(element.getAttribute("data-label")).replace(/:$/, "");
      const value = cleanText(element.innerText);
      if (key && value && !(key in fields)) fields[key] = value;
    }

    return fields;
  }

  function readTables() {
    return [...document.querySelectorAll("table")]
      .filter(isVisible)
      .map((table, tableIndex) => {
        const rows = [...table.querySelectorAll("tr")].filter(isVisible);
        const firstRowCells = rows[0]
          ? [...rows[0].querySelectorAll(":scope > th, :scope > td")].filter(isVisible)
          : [];
        const explicitHeaders = [...table.querySelectorAll("thead th")].filter(isVisible);
        const headerCells = explicitHeaders.length ? explicitHeaders : firstRowCells;
        const headers = headerCells.map((cell, index) => cleanText(cell.innerText) || `Column ${index + 1}`);
        const firstRowIsHeader =
          explicitHeaders.length > 0 || firstRowCells.some((cell) => cell.tagName === "TH");
        const dataRows = firstRowIsHeader ? rows.slice(1) : rows;
        const values = dataRows
          .map((row) => [...row.querySelectorAll(":scope > th, :scope > td")].filter(isVisible))
          .filter((cells) => cells.length)
          .map((cells) => {
            const valueList = cells.map((cell) => cleanText(cell.innerText));
            if (!headers.length) return valueList;
            return Object.fromEntries(
              valueList.map((value, index) => [headers[index] || `Column ${index + 1}`, value]),
            );
          });

        const caption = cleanText(table.querySelector("caption")?.innerText);
        return {
          index: tableIndex,
          caption: caption || `Table ${tableIndex + 1}`,
          headers,
          rows: values,
        };
      })
      .filter((table) => table.rows.length || table.headers.length);
  }

  function nearestRecordContainer(element) {
    const selector = [
      "tr",
      "article",
      "li",
      "[role='row']",
      "[role='listitem']",
      "[data-testid]",
      "[class*='card' i]",
      "[class*='item' i]",
    ].join(",");

    const candidate = element.closest(selector);
    if (!candidate || candidate === document.body || candidate === document.documentElement) {
      return element;
    }
    return candidate;
  }

  function readTests() {
    const testLinks = [...document.querySelectorAll("a[href]")].filter((link) => {
      if (!isVisible(link)) return false;
      try {
        const url = new URL(link.getAttribute("href"), location.href);
        return (
          url.origin === location.origin &&
          /\/tests?(?:\/|$)/i.test(url.pathname) &&
          url.pathname !== "/tests"
        );
      } catch {
        return false;
      }
    });

    return uniqueBy(
      testLinks.map((link) => {
        const container = nearestRecordContainer(link);
        const heading = container.querySelector("h1, h2, h3, h4, h5, h6");
        const name = cleanText(heading?.innerText || link.innerText || link.getAttribute("aria-label"));
        const text = cleanText(container.innerText).slice(0, MAX_ITEM_TEXT_LENGTH);
        const buttons = [...container.querySelectorAll("button, [role='button']")]
          .filter(isVisible)
          .map((button) => cleanText(button.innerText || button.getAttribute("aria-label")))
          .filter(Boolean);

        return {
          name,
          url: absoluteUrl(link.getAttribute("href")),
          text,
          fields: readFields(container),
          actions: [...new Set(buttons)],
        };
      }),
      (test) => test.url,
    );
  }

  function readCatalog(tables) {
    if (!/^\/tests\/?$/i.test(location.pathname)) return null;

    const categories = [...document.querySelectorAll(".tab, .tab--active")]
      .map((tab) => cleanText(tab.innerText))
      .filter(Boolean);
    const activeCategory = cleanText(document.querySelector(".tab--active")?.innerText);
    const testTable = tables.find(
      (table) => table.headers.includes("Name") && table.headers.includes("Type"),
    );

    if (!testTable) return null;

    const visibleTests = testTable.rows
      .filter((row) => !Array.isArray(row) && row.Name)
      .map((row) => ({
        name: row.Name,
        averageScore: row["Avg Score"] || "",
        type: row.Type || "",
        canAssign: /assign/i.test(row.Assign || ""),
      }));

    return {
      activeCategory,
      categories,
      visibleTests,
    };
  }

  function readMedia(root) {
    if (!root) return [];
    return uniqueBy(
      [...root.querySelectorAll("img[src]")].map((image) => ({
        type: "image",
        url: absoluteUrl(image.currentSrc || image.getAttribute("src")),
        alt: cleanText(image.getAttribute("alt")),
      })),
      (item) => `${item.type}\n${item.url}\n${item.alt}`,
    );
  }

  function textOf(element) {
    return cleanText(element?.innerText || element?.textContent);
  }

  function readCurrentPreviewQuestion() {
    const preview = document.querySelector(".testSHSATPreview");
    if (!preview) return null;

    const navigatorText = textOf(preview.querySelector(".testSHSATPreview__navigatorToggle"));
    const progress = navigatorText.match(/Question\s+(\d+)\s*\/\s*(\d+)/i);
    const questionRoot = preview.querySelector(".testSHSATPreview__question");
    const passage =
      preview.querySelector(".testSHSATPreview__passageTextPassage") ||
      preview.querySelector(".testSHSATPreview__passageText") ||
      preview.querySelector(".testSHSATPreview__passage");
    const explanation = preview.querySelector(".testSHSATPreview__explanationBox");
    const choiceWrappers = [...preview.querySelectorAll(".testSHSATPreview__questionChoiceWrapper")];

    const choices = choiceWrappers.filter(wrapper => wrapper.querySelector(".testSHSATPreview__questionChoiceText")).map((wrapper, index) => {
      const label = textOf(wrapper.querySelector(".testSHSATPreview__choiceText")) ||
        String.fromCharCode(65 + index);
      const normalizedLabel = label.replace(/\.$/, "");
      return {
        label: normalizedLabel,
        text: textOf(wrapper.querySelector(".testSHSATPreview__questionChoiceText")),
        html: NathanSatRichText.fromElement(wrapper.querySelector(".testSHSATPreview__questionChoiceText"), getComputedStyle),
        isCorrect: Boolean(previewButton('Hide answer') && wrapper.querySelector(".testSHSATPreview__radioButton--selected")),
        media: readMedia(wrapper),
      };
    });

    const selectedChoice = choices.find((choice) => choice.isCorrect);
    const passageId = (passage?.id || "").replace(/^(?:passage|definition)\s+/i, "");
    const richPassage = passage ? NathanSatRichText.passage(passage, getComputedStyle) : null;
    const hotWords = [...preview.querySelectorAll('.testSHSATPreview__questionHelperHotText')];
    const blankHelper = preview.querySelector('.digitalSHSATPreview__blankQuestionHelperText');
    const blankBoxes = blankHelper ? [...blankHelper.querySelectorAll('[data-index]')] : [];
    const rich = node => NathanSatRichText.fromElement(node, getComputedStyle);
    const helper = preview.querySelector('.testSHSATPreview__questionHelperText');
    const entries = [...preview.querySelectorAll('.testSHSATPreview__questionHelperFB, .testSHSATPreview__questionHelperFBBox')];
    const menus = [...preview.querySelectorAll('.testSHSATPreview__questionHelperIC')];
    const mathField = preview.querySelector('.testSHSATPreview__eeContainer math-field');
    const answerShown = Boolean(previewButton('Hide answer'));
    const controls = [...entries, ...menus];
    const primaryPrompt = preview.querySelector('.testSHSATPreview__questionQuestion');
    const helperPromptHtml = NathanSatRichText.fromElement(helper, getComputedStyle, null, node => controls.includes(node) ? '' : undefined);
    const promptHtml = rich(primaryPrompt) || helperPromptHtml;
    const promptText = textOf(primaryPrompt) || NathanSatRichText.plain(promptHtml);
    const selectionCount = promptText.match(/\b(?:select|choose)\s+(two|three|four|five|six|seven|eight|[2-8])\b/i)?.[1]?.toLowerCase();
    const requiredSelections = selectionCount ? ({two:2,three:3,four:4,five:5,six:6,seven:7,eight:8}[selectionCount] || Number(selectionCount)) : null;
    const interaction = entries.length ? {
      type: 'short_response',
      contentHtml: NathanSatRichText.fromElement(helper, getComputedStyle, null, node => entries.includes(node) ? `{{answer-${entries.indexOf(node) + 1}}}` : undefined),
      // Never read an input's value: it may be a teacher's attempted answer.
      slots: entries.map((node, i) => ({ id: `answer-${i + 1}`, answer: answerShown ? textOf(node.querySelector('.testSHSATPreview__fbCorrectAnswer')) : '' })),
    } : menus.length ? {
      type: 'inline_dropdown',
      contentHtml: NathanSatRichText.fromElement(helper, getComputedStyle, null, node => menus.includes(node) ? `{{dropdown-${menus.indexOf(node) + 1}}}` : undefined),
      dropdowns: menus.map((node, i) => ({ id: `dropdown-${i + 1}`, options: [...node.querySelectorAll('[value]')].filter(option => textOf(option)).map((option, index) => ({id: `option-${index + 1}`, text: textOf(option), html: rich(option), isCorrect: answerShown && option.classList.contains('testSHSATPreview__fbCorrectAnswer')})) })),
    } : mathField ? {
      type: 'expression_entry',
      // MathLive's value getter is unavailable in Chrome's isolated content-script
      // world. Read its rendered answer from the open shadow DOM instead.
      answer: answerShown ? NathanSatRichText.expressionAnswer(mathField.shadowRoot?.querySelector('.ML__content')) : '',
    } : hotWords.length ? {
      type: 'hot_text',
      text: textOf(preview.querySelector('.testSHSATPreview__questionHelperText')),
      options: hotWords.map((node, i) => ({ id: `word-${i + 1}`, text: textOf(node), html: rich(node), isCorrect: answerShown && node.classList.contains('correct') })),
    } : blankHelper ? {
      type: 'sentence_blank',
      contentHtml: NathanSatRichText.fromElement(blankHelper, getComputedStyle, null, node => blankBoxes.includes(node) ? `{{blank-${blankBoxes.indexOf(node) + 1}}}` : undefined),
      options: [...preview.querySelectorAll('.digitalSHSATPreview__blankItem')].map((node, i) => ({ id: `option-${i + 1}`, text: textOf(node), html: rich(node) })),
      slots: blankBoxes.map((node, i) => ({ id: `blank-${i + 1}`, answer: answerShown && node.className.includes('Filled--correct') ? textOf(node) : '', answerHtml: answerShown && node.className.includes('Filled--correct') ? rich(node) : '' })),
    } : null;

    return {
      number: progress ? Number(progress[1]) : Number(textOf(preview.querySelector(".testSHSATPreview__questionNumber"))) || null,
      total: progress ? Number(progress[2]) : null,
      sourceNumber: Number(textOf(preview.querySelector('.testSHSATPreview__questionNumber'))) || null,
      ...(interaction ? { interaction } : {}),
      ...(choices.length && (requiredSelections || /\b(?:select|choose)\s+all\b/i.test(promptText)) ? {responseType:'multi_select', requiredSelections} : {}),
      passage: passage
        ? {
            id: passageId,
            text: richPassage.text || textOf(passage),
            ...(richPassage.format ? { format: richPassage.format } : {}),
            formattedBlocks: richPassage.formattedBlocks,
            glossaryTerms: [...new Set(
              [...preview.querySelectorAll(".testSHSATPreview__definitionMark")]
                .map(textOf)
                .filter(Boolean),
            )],
            media: readMedia(preview.querySelector(".testSHSATPreview__passage")),
          }
        : null,
      prompt: promptText,
      promptHtml,
      choices,
      correctAnswer: selectedChoice
        ? { label: selectedChoice.label, text: selectedChoice.text }
        : null,
      explanation: textOf(explanation),
      explanationHtml: NathanSatRichText.fromElement(explanation, getComputedStyle),
      media: readMedia(questionRoot),
    };
  }

  function nextPaint() {
    // Unlike animation frames, this also finishes when the popup leaves the tab unfocused.
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  function previewButton(label) {
    const preview = document.querySelector(".testSHSATPreview");
    return [...(preview?.querySelectorAll("button") || [])].find(
      (button) => textOf(button).toLowerCase() === label.toLowerCase(),
    );
  }

  async function setAnswerVisible(visible) {
    const button = previewButton(visible ? "Show answer" : "Hide answer");
    if (button) {
      button.click();
      await nextPaint();
    }
  }

  function explanationVisible() {
    const panel = document.querySelector(".testSHSATPreview__popup--explanation");
    return Boolean(panel && isVisible(panel));
  }

  async function setExplanationVisible(visible) {
    if (explanationVisible() === visible) return true;
    const button = previewButton("Explanation");
    if (!button || button.disabled) return false;
    button.click();
    const deadline = Date.now() + 1_000;
    do {
      await nextPaint();
      if (explanationVisible() === visible) return true;
    } while (Date.now() < deadline);
    return false;
  }

  async function waitForExplanation(question, module) {
    const deadline = Date.now() + 3_000;
    do {
      const current = readCurrentPreviewQuestion();
      if (current?.number !== question.number || current.prompt !== question.prompt || previewModule() !== module) {
        throw new Error("The question changed while reading its explanation. Please avoid navigating during capture.");
      }
      const box = document.querySelector(".testSHSATPreview__explanationBox");
      if (explanationVisible() && box && isVisible(box) && current.explanation && !/^(?:loading(?:[.\u2026 ]*)|please wait(?:[.\u2026 ]*))$/i.test(current.explanation)) return current.explanation;
      await nextPaint();
    } while (Date.now() < deadline);
    return "";
  }

  function previewModule() {
    return textOf(document.querySelector(".testSHSATPreview__moduleSelect"));
  }

  function samePassage(first, next) {
    if (!first || !next) return false;
    if (first.id && next.id) return first.id === next.id;
    if (first.text && next.text) return first.text === next.text;
    return first.media.length > 0 &&
      JSON.stringify(first.media) === JSON.stringify(next.media);
  }

  async function navigateQuestion(direction, expectedNumber, module) {
    // A fresh panel for each question prevents the preceding question's
    // explanation from being exported while the source page updates.
    await setExplanationVisible(false);
    const button = previewButton(direction);
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") {
      throw new Error(`The ${direction} question control is unavailable.`);
    }
    button.click();
    const deadline = Date.now() + 8_000;
    while (Date.now() < deadline) {
      await nextPaint();
      const question = readCurrentPreviewQuestion();
      if (previewModule() !== module) throw new Error("The test module changed during capture.");
      // Navigation identity is independent of response layout. Capture performs
      // its own bounded content wait and flags unknown controls for review.
      if (question?.number === expectedNumber) return question;
      if (question?.number && question.number !== expectedNumber &&
          question.number !== expectedNumber + (direction === "NEXT" ? -1 : 1)) {
        throw new Error("The question changed unexpectedly. Please avoid navigating during capture.");
      }
    }
    throw new Error(`Timed out waiting for Question ${expectedNumber}.`);
  }

  async function captureQuestion(options, warnings) {
    const wasVisible = Boolean(previewButton("Hide answer"));
    const wasExplanationVisible = explanationVisible();
    let question = readCurrentPreviewQuestion();
    const module = previewModule();
    try {
      // Read the complete word bank before Show answer moves a correct tile into its blank.
      await setAnswerVisible(false);
      question = await waitForStableQuestion(question.number, module);
      const unkeyed = question;
      if (options.includeAnswer) await setAnswerVisible(true);
      await waitForStableQuestion(question.number, module);
      let explanation = "";
      const requested = options.includeExplanations !== false;
      if (requested) {
        if (await setExplanationVisible(true)) explanation = await waitForExplanation(question, module);
        if (!explanation) warnings.push(`Question ${question.number || "?"}: No source explanation was available after opening Explanation. Its explanation was left blank; the question was still captured.`);
      }
      const captured = readCurrentPreviewQuestion();
      if (captured.number !== question.number || previewModule() !== module) throw new Error('The question or module changed during capture.');
      if (captured.interaction?.type === 'sentence_blank') {
        captured.interaction.options = unkeyed.interaction?.options || [];
        captured.interaction.contentHtml = unkeyed.interaction?.contentHtml || captured.interaction.contentHtml;
      }
      if (captured.interaction) {
        const answers = captured.interaction.type === 'hot_text'
          ? captured.interaction.options.filter(item => item.isCorrect).map(item => item.text)
          : captured.interaction.type === 'inline_dropdown'
            ? captured.interaction.dropdowns.flatMap(menu => menu.options.filter(item => item.isCorrect).map(item => item.text))
            : captured.interaction.type === 'expression_entry' ? [captured.interaction.answer].filter(Boolean)
            : (captured.interaction.slots || []).map(slot => slot.answer).filter(Boolean);
        captured.correctAnswer = answers.length ? { label: '', text: answers.join(' | ') } : null;
      }
      if (captured.responseType === 'multi_select') {
        const answers = captured.choices.filter(choice => choice.isCorrect);
        captured.correctAnswer = answers.length ? {label:answers.map(c=>c.label).join(', '), text:answers.map(c=>c.text).join(' | ')} : null;
      }
      if (!captured.prompt) warnings.push(`Question ${question.number}: Source prompt could not be read. Record retained for manual review.`);
      if (!captured.choices.length && !captured.interaction) warnings.push(`Question ${question.number}: Unrecognized source response. Question retained for manual setup.`);
      if (options.includeAnswer && !captured.correctAnswer) warnings.push(`Question ${question.number}: No verified source answer was captured; its key is blank.`);
      return { ...captured, explanation, explanationHtml: explanation ? captured.explanationHtml : "", explanationStatus: requested ? explanation ? "captured" : "missing" : "not-requested" };
    } finally {
      if (!await setExplanationVisible(wasExplanationVisible)) warnings.push(`Question ${question.number || "?"}: Could not restore its explanation panel visibility.`);
      await setAnswerVisible(wasVisible);
    }
  }

  async function waitForStableQuestion(number, module) {
    let last = '', stable = 0;
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline) {
      await nextPaint();
      const current = readCurrentPreviewQuestion();
      if (current?.number !== number || previewModule() !== module) throw new Error('The question or module changed during capture.');
      const signature = JSON.stringify([current.promptHtml, current.choices, current.interaction, current.media]);
      stable = signature === last ? stable + 1 : 0;
      if (current.prompt && (current.choices.length || current.interaction) && stable >= 3) return current;
      last = signature;
    }
    // Preserve an unsupported response for teacher review rather than dropping it.
    return readCurrentPreviewQuestion();
  }

  function requestedNumbers(value, total) {
    const numbers = new Set();
    for (const part of String(value || '').split(',')) {
      const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!match) throw new Error('Enter Part B numbers such as 47-50 or 47,48,49.');
      const start = Number(match[1]), end = Number(match[2] || match[1]);
      if (start < 1 || end < start || end > total) throw new Error(`Use question numbers 1–${total} in the English module. Math has its own capture option.`);
      for (let n = start; n <= end; n++) numbers.add(n);
    }
    return [...numbers].sort((a, b) => a - b);
  }

  async function readTestPreview(options = {}) {
    const preview = document.querySelector(".testSHSATPreview");
    if (!preview) return null;

    const originalQuestion = readCurrentPreviewQuestion();
    const originalModule = previewModule();
    const originalAnswerVisible = Boolean(previewButton("Hide answer"));
    const originalExplanationVisible = explanationVisible();
    const batchMode = ['part-b', 'math-all'].includes(options.captureMode) ? options.captureMode : null;
    if (batchMode === 'math-all' && !/math/i.test(originalModule)) throw new Error('Select Mathematics on the test page, then read all 50 math questions.');
    if (batchMode === 'part-b' && !/english/i.test(originalModule)) throw new Error('Select English Language Arts on the test page, then read Part B.');
    const expected = batchMode === 'part-b' ? requestedNumbers(options.questionRange, originalQuestion.total)
      : batchMode === 'math-all' ? Array.from({ length: originalQuestion.total }, (_, i) => i + 1) : null;
    if (batchMode === 'math-all' && originalQuestion.total !== 50) throw new Error(`This Math module reports ${originalQuestion.total} questions, not 50. Select the intended 50-question module.`);

    const title = [...document.querySelectorAll("h1")]
      .filter((heading) => !preview.contains(heading))
      .map(textOf)
      .find(Boolean) || document.title;
    const result = {
      testTitle: title,
      module: originalModule,
      question: null, // Retained for older consumers expecting the starting question.
      questions: [],
      capture: {
        mode: batchMode || (options.includePassageQuestions === false ? "current-question" : "passage-all"),
        ...(expected ? { expectedNumbers: expected, complete: false } : {}),
        stopReason: "current-question",
        restoredStartingQuestion: false,
        warnings: [],
        explanationsRequested: options.includeExplanations !== false,
      },
    };

    try {
      if (expected) {
        const deadline = Date.now() + 300_000;
        for (const number of expected) {
          let current = readCurrentPreviewQuestion();
          while (current.number !== number) {
            if (Date.now() >= deadline) throw new Error('Capture reached its five-minute limit. Partial results are retained.');
            const forward = current.number < number;
            current = await navigateQuestion(forward ? 'NEXT' : 'BACK', current.number + (forward ? 1 : -1), originalModule);
          }
          const captured = await captureQuestion(options, result.capture.warnings);
          result.questions.push(captured);
          result.question ||= captured;
        }
        result.capture.complete = expected.every(number => result.questions.some(q => q.number === number));
        result.capture.stopReason = result.capture.complete ? 'requested-questions-complete' : 'incomplete';
      } else {
      result.question = await captureQuestion(options, result.capture.warnings);
      if (result.question) result.questions.push(result.question);
      if (options.includePassageQuestions !== false && originalQuestion?.passage && originalQuestion.number) {
        const deadline = Date.now() + 60_000;
        let current = originalQuestion;
        // Find the first question for this passage, collecting preceding questions too.
        while (current.number > 1 && result.questions.length < MAX_PASSAGE_QUESTIONS) {
          if (Date.now() >= deadline) throw new Error("The passage capture reached its time limit.");
          const previous = await navigateQuestion("BACK", current.number - 1, originalModule);
          if (!samePassage(originalQuestion.passage, previous.passage)) {
            current = await navigateQuestion("NEXT", previous.number + 1, originalModule);
            break;
          }
          result.questions.push(await captureQuestion(options, result.capture.warnings));
          current = previous;
        }
        while (result.questions.length < MAX_PASSAGE_QUESTIONS) {
          if (readCurrentPreviewQuestion()?.number !== current.number || previewModule() !== originalModule) {
            throw new Error("The question changed unexpectedly. Please avoid navigating during capture.");
          }
          const nextButton = previewButton("NEXT");
          if (current.total && current.number >= current.total) {
            result.capture.stopReason = "end-of-module";
            break;
          }
          if (!nextButton || nextButton.disabled || nextButton.getAttribute("aria-disabled") === "true") {
            throw new Error("Cannot continue: the NEXT question control is unavailable.");
          }
          if (Date.now() >= deadline) throw new Error("The passage capture reached its time limit.");
          const next = await navigateQuestion("NEXT", current.number + 1, originalModule);
          if (!samePassage(originalQuestion.passage, next.passage)) {
            result.capture.stopReason = "next-passage";
            break;
          }
          if (!result.questions.some((question) => question.number === next.number)) {
            result.questions.push(await captureQuestion(options, result.capture.warnings));
          }
          current = next;
        }
        if (result.questions.length === MAX_PASSAGE_QUESTIONS) {
          const last = [...result.questions].sort((a, b) => a.number - b.number).at(-1);
          if (last.total && last.number === last.total) {
            result.capture.stopReason = "end-of-module";
          } else {
            result.capture.stopReason = "question-limit";
            result.capture.warnings.push("Stopped at the 50-question safety limit.");
          }
        }
      } else if (options.includePassageQuestions !== false) {
        result.capture.stopReason = "no-passage";
      }
      }
    } catch (error) {
      result.capture.stopReason = "interrupted";
      result.capture.warnings.push(error.message || "Passage capture was interrupted.");
    } finally {
      result.questions.sort((a, b) => a.number - b.number);
      if (expected) {
        result.capture.missingNumbers = expected.filter(number => !result.questions.some(q => q.number === number));
        if (result.capture.missingNumbers.length) result.capture.warnings.push(`Missing questions: ${result.capture.missingNumbers.join(', ')}. This is a partial export.`);
      }
      try {
        // Restore through the same visible navigation controls, even after a partial scan.
        let current = readCurrentPreviewQuestion();
        let steps = 0;
        while (current?.number !== originalQuestion?.number) {
          if (!current?.number || !originalQuestion?.number || previewModule() !== originalModule ||
              steps++ >= MAX_PASSAGE_QUESTIONS) throw new Error("Cannot safely restore the starting question.");
          const forward = current.number < originalQuestion.number;
          current = await navigateQuestion(forward ? "NEXT" : "BACK", current.number + (forward ? 1 : -1), originalModule);
        }
        await setAnswerVisible(originalAnswerVisible);
        if (!await setExplanationVisible(originalExplanationVisible)) result.capture.warnings.push("Could not restore the original explanation panel visibility.");
        result.capture.restoredStartingQuestion = true;
      } catch (error) {
        result.capture.warnings.push(`${error.message} Return to Question ${originalQuestion?.number || "?"} manually.`);
      }
    }

    return result;
  }

  async function readPage(options = {}) {
    const main = document.querySelector("main, [role='main']") || document.body;
    const visibleText = options.includePageText
      ? cleanText(main.innerText).slice(0, MAX_PAGE_TEXT_LENGTH)
      : undefined;
    const tables = readTables();
    const catalog = readCatalog(tables);
    const linkedTests = readTests();
    const tests = linkedTests.length
      ? linkedTests
      : (catalog?.visibleTests || []).map((test) => ({
          name: test.name,
          url: "",
          text: `${test.name} ${test.averageScore} ${test.type}`.trim(),
          fields: {
            "Avg Score": test.averageScore,
            Type: test.type,
          },
          actions: test.canAssign ? ["Assign"] : [],
        }));

    return {
      schemaVersion: 3,
      readerVersion: READER_VERSION,
      capturedAt: new Date().toISOString(),
      source: {
        title: document.title,
        url: location.href,
        origin: location.origin,
        path: location.pathname,
      },
      signedInLikely: !/\/(?:sign-in|login)\/?$/i.test(location.pathname),
      headings: readHeadings(main),
      tests,
      catalog,
      testPreview: await readTestPreview(options),
      tables,
      links: readLinks(main),
      ...(visibleText === undefined ? {} : { visibleText }),
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "SAT_READER_SCAN") return false;
    if (scanInProgress) {
      sendResponse({ ok: false, error: "A capture is already running. Wait for it to finish." });
      return false;
    }
    scanInProgress = true;

    readPage(message.options)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "The page could not be read.",
        });
      })
      .finally(() => { scanInProgress = false; });
    return true;
  });
})();
