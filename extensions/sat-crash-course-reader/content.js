(() => {
  const MAX_PAGE_TEXT_LENGTH = 250_000;
  const MAX_ITEM_TEXT_LENGTH = 10_000;

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

    const choices = choiceWrappers.map((wrapper, index) => {
      const label = textOf(wrapper.querySelector(".testSHSATPreview__choiceText")) ||
        String.fromCharCode(65 + index);
      const normalizedLabel = label.replace(/\.$/, "");
      return {
        label: normalizedLabel,
        text: textOf(wrapper.querySelector(".testSHSATPreview__questionChoiceText")),
        isCorrect: Boolean(wrapper.querySelector(".testSHSATPreview__radioButton--selected")),
        media: readMedia(wrapper),
      };
    });

    const selectedChoice = choices.find((choice) => choice.isCorrect);
    const passageId = (passage?.id || "").replace(/^(?:passage|definition)\s+/i, "");

    return {
      number: progress ? Number(progress[1]) : Number(textOf(preview.querySelector(".testSHSATPreview__questionNumber"))) || null,
      total: progress ? Number(progress[2]) : null,
      passage: passage
        ? {
            id: passageId,
            text: textOf(passage),
            glossaryTerms: [...new Set(
              [...preview.querySelectorAll(".testSHSATPreview__definitionMark")]
                .map(textOf)
                .filter(Boolean),
            )],
            media: readMedia(preview.querySelector(".testSHSATPreview__passage")),
          }
        : null,
      prompt: textOf(preview.querySelector(".testSHSATPreview__questionQuestion")),
      choices,
      correctAnswer: selectedChoice
        ? { label: selectedChoice.label, text: selectedChoice.text }
        : null,
      explanation: textOf(explanation),
      media: readMedia(questionRoot),
    };
  }

  function nextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function readTestPreview(options = {}) {
    const preview = document.querySelector(".testSHSATPreview");
    if (!preview) return null;

    const showAnswerButton = [...preview.querySelectorAll("button")].find(
      (button) => textOf(button).toLowerCase() === "show answer",
    );
    let restoredAnswerState = false;

    if (options.includeAnswer && showAnswerButton) {
      showAnswerButton.click();
      restoredAnswerState = true;
      await nextPaint();
    }

    const title = [...document.querySelectorAll("h1")]
      .filter((heading) => !preview.contains(heading))
      .map(textOf)
      .find(Boolean) || document.title;
    const result = {
      testTitle: title,
      module: textOf(preview.querySelector(".testSHSATPreview__moduleSelect h1, .testSHSATPreview__moduleSelect")),
      question: readCurrentPreviewQuestion(),
    };

    if (restoredAnswerState) {
      const hideAnswerButton = [...preview.querySelectorAll("button")].find(
        (button) => textOf(button).toLowerCase() === "hide answer",
      );
      hideAnswerButton?.click();
      await nextPaint();
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
      schemaVersion: 2,
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

    readPage(message.options)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "The page could not be read.",
        });
      });
    return true;
  });
})();
