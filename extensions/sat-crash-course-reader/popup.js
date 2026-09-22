const state = {
  data: null,
};

const elements = {
  scan: document.querySelector("#scan"),
  includePageText: document.querySelector("#include-page-text"),
  includeAnswer: document.querySelector("#include-answer"),
  status: document.querySelector("#status"),
  results: document.querySelector("#results"),
  testCount: document.querySelector("#test-count"),
  questionCount: document.querySelector("#question-count"),
  tableCount: document.querySelector("#table-count"),
  linkCount: document.querySelector("#link-count"),
  copy: document.querySelector("#copy"),
  json: document.querySelector("#json"),
  csv: document.querySelector("#csv"),
  preview: document.querySelector("#preview"),
};

function setStatus(message, kind = "") {
  elements.status.textContent = message;
  elements.status.className = `status${kind ? ` ${kind}` : ""}`;
}

function safeFilename(value) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function csvCell(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(data) {
  if (data.testPreview?.question) {
    const question = data.testPreview.question;
    const choiceLabels = [...new Set(question.choices.map((choice) => choice.label))];
    const headers = [
      "testTitle",
      "module",
      "questionNumber",
      "totalQuestions",
      "passageId",
      "passage",
      "question",
      ...choiceLabels.map((label) => `choice${label}`),
      "correctAnswer",
      "explanation",
    ];
    const row = [
      data.testPreview.testTitle,
      data.testPreview.module,
      question.number,
      question.total,
      question.passage?.id || "",
      question.passage?.text || "",
      question.prompt,
      ...choiceLabels.map(
        (label) => question.choices.find((choice) => choice.label === label)?.text || "",
      ),
      question.correctAnswer
        ? `${question.correctAnswer.label}. ${question.correctAnswer.text}`
        : "",
      question.explanation,
    ];
    return [headers, row].map((values) => values.map(csvCell).join(",")).join("\r\n");
  }

  if (data.tests.length) {
    const fieldNames = [...new Set(data.tests.flatMap((test) => Object.keys(test.fields || {})))];
    const headers = ["name", "url", "text", "actions", ...fieldNames];
    const rows = data.tests.map((test) => [
      test.name,
      test.url,
      test.text,
      (test.actions || []).join(" | "),
      ...fieldNames.map((field) => test.fields?.[field] || ""),
    ]);
    return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  const firstTable = data.tables[0];
  if (firstTable?.rows.length) {
    const headers = firstTable.headers.length
      ? firstTable.headers
      : firstTable.rows[0].map((_, index) => `Column ${index + 1}`);
    const rows = firstTable.rows.map((row) =>
      Array.isArray(row) ? row : headers.map((header) => row[header] ?? ""),
    );
    return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  const headers = ["text", "url"];
  const rows = data.links.map((link) => [link.text, link.url]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function scanPage() {
  elements.scan.disabled = true;
  elements.results.hidden = true;
  setStatus("Reading the current page…");

  try {
    const tab = await currentTab();
    if (!tab?.id || !tab.url?.startsWith("https://tutor.thesatcrashcourse.com/")) {
      throw new Error("Open a tutor.thesatcrashcourse.com page first.");
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "SAT_READER_SCAN",
      options: {
        includePageText: elements.includePageText.checked,
        includeAnswer: elements.includeAnswer.checked,
      },
    });

    if (!response?.ok) throw new Error(response?.error || "The page did not respond.");

    state.data = response.data;
    elements.testCount.textContent = String(state.data.tests.length);
    elements.questionCount.textContent = String(state.data.testPreview?.question ? 1 : 0);
    elements.tableCount.textContent = String(state.data.tables.length);
    elements.linkCount.textContent = String(state.data.links.length);
    elements.preview.textContent = JSON.stringify(state.data, null, 2);
    elements.results.hidden = false;

    if (!state.data.signedInLikely) {
      setStatus("This looks like the sign-in page. Sign in, open Tests, and scan again.", "error");
    } else if (state.data.testPreview?.question) {
      const question = state.data.testPreview.question;
      const answerNote = question.correctAnswer ? " with its correct answer" : "";
      setStatus(
        `Captured Question ${question.number || "?"} of ${question.total || "?"}${answerNote}.`,
        "success",
      );
    } else {
      setStatus("Page read successfully. Nothing was sent off your computer.", "success");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "The page could not be read.";
    setStatus(message, "error");
  } finally {
    elements.scan.disabled = false;
  }
}

elements.scan.addEventListener("click", scanPage);

elements.copy.addEventListener("click", async () => {
  if (!state.data) return;
  await navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
  setStatus("JSON copied to the clipboard.", "success");
});

elements.json.addEventListener("click", () => {
  if (!state.data) return;
  const name = safeFilename(state.data.source.path || "page") || "page";
  downloadFile(`${name}-${Date.now()}.json`, JSON.stringify(state.data, null, 2), "application/json");
  setStatus("JSON download started.", "success");
});

elements.csv.addEventListener("click", () => {
  if (!state.data) return;
  const name = safeFilename(state.data.source.path || "page") || "page";
  downloadFile(`${name}-${Date.now()}.csv`, toCsv(state.data), "text/csv;charset=utf-8");
  setStatus("CSV download started.", "success");
});
