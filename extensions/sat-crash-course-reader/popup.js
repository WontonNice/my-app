const state = {
  data: null,
};
const READER_VERSION = "0.8.5";

const elements = {
  scan: document.querySelector("#scan"),
  captureMode: document.querySelector('#capture-mode'),
  questionRange: document.querySelector('#question-range'),
  includePageText: document.querySelector("#include-page-text"),
  includeAnswer: document.querySelector("#include-answer"),
  includeExplanations: document.querySelector("#include-explanations"),
  includePassageQuestions: document.querySelector("#include-passage-questions"),
  status: document.querySelector("#status"),
  results: document.querySelector("#results"),
  testCount: document.querySelector("#test-count"),
  questionCount: document.querySelector("#question-count"),
  explanationCount: document.querySelector("#explanation-count"),
  tableCount: document.querySelector("#table-count"),
  linkCount: document.querySelector("#link-count"),
  copy: document.querySelector("#copy"),
  json: document.querySelector("#json"),
  csv: document.querySelector("#csv"),
  preview: document.querySelector("#preview"),
};

const optionElements = {
  captureMode: elements.captureMode,
  questionRange: elements.questionRange,
  includePageText: elements.includePageText,
  includeAnswer: elements.includeAnswer,
  includeExplanations: elements.includeExplanations,
  includePassageQuestions: elements.includePassageQuestions,
};
const previewDetails = document.querySelector("#results details");

function readOptions() {
  return Object.fromEntries(Object.entries(optionElements).map(([key, element]) => [key,
    key.startsWith("include") ? element.checked : element.value]));
}

async function savePreferences() {
  try {
    await chrome.storage.local.set({ satReaderPreferences: { ...readOptions(), previewOpen: previewDetails.open } });
  } catch {
    // Capturing and downloading remain usable when Chrome cannot save preferences.
  }
}

async function restoreState() {
  elements.scan.disabled = true;
  try {
    const { satReaderPreferences: preferences, satReaderCapture: capture } = await chrome.storage.local.get(["satReaderPreferences", "satReaderCapture"]);
    for (const [key, element] of Object.entries(optionElements)) {
      const value = preferences?.[key];
      if (key.startsWith("include") && typeof value === "boolean") element.checked = value;
      else if (typeof value === "string" && (key !== "captureMode" || ["passage", "part-b", "ela-all", "math-all"].includes(value))) element.value = value;
    }
    updateCaptureMode();
    if (capture?.data && Array.isArray(capture.data.tests) && Array.isArray(capture.data.tables) && Array.isArray(capture.data.links)) {
      renderCapture(capture.data, capture.options ?? {});
      setStatus(`Restored saved scan from ${capture.data.source?.title || capture.data.source?.path || "the previous page"}. ${elements.status.textContent}`, elements.status.className.includes("error") ? "error" : "success");
    }
    previewDetails.open = preferences?.previewOpen === true;
  } catch {
    setStatus("Saved results could not be restored. You can still scan this page.", "error");
  } finally {
    elements.scan.disabled = false;
  }
}

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
  const questions = data.testPreview?.questions ||
    (data.testPreview?.question ? [data.testPreview.question] : []);
  if (questions.length) {
    const choiceLabels = [...new Set(questions.flatMap((question) => question.choices.map((choice) => choice.label)))];
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
    const rows = questions.map((question) => [
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
    ]);
    return [headers, ...rows].map((values) => values.map(csvCell).join(",")).join("\r\n");
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

function renderCapture(data, options) {
  state.data = data;
  elements.testCount.textContent = String(state.data.tests.length);
  const questions = state.data.testPreview?.questions ||
    (state.data.testPreview?.question ? [state.data.testPreview.question] : []);
  elements.questionCount.textContent = String(questions.length);
  const explanations = questions.filter(question => question.explanation?.trim()).length;
  elements.explanationCount.textContent = questions.length
    ? options.includeExplanations ? `Explanations captured: ${explanations} of ${questions.length}` : "Explanations were not requested."
    : "";
  elements.tableCount.textContent = String(state.data.tables.length);
  elements.linkCount.textContent = String(state.data.links.length);
  elements.preview.textContent = JSON.stringify(state.data, null, 2);
  elements.results.hidden = false;

  if (!state.data.signedInLikely) {
    setStatus("This looks like the sign-in page. Sign in, open Tests, and scan again.", "error");
  } else if (state.data.testPreview?.question) {
    const question = questions[0] || state.data.testPreview.question;
    const answerNote = questions.every((item) => item.correctAnswer) ? " with correct answers" : "";
    const explanationNote = options.includeExplanations ? ` ${explanations} of ${questions.length} explanations captured.` : "";
    const warnings = state.data.testPreview.capture?.warnings || [];
    const range = questions.length > 1
      ? `Questions ${question.number}–${questions.at(-1).number}`
      : `Question ${question.number || "?"}`;
    const batch = state.data.testPreview.capture;
    const countNote = batch.expectedNumbers ? `${questions.length}/${batch.expectedNumbers.length} requested questions. ${batch.complete ? 'Complete.' : 'PARTIAL EXPORT.'} ` : '';
    setStatus(
      `${countNote}Captured ${range} of ${question.total || "?"}${answerNote}.${explanationNote} ${warnings.join(" ") || "Starting question restored."}`,
      warnings.length ? "error" : "success",
    );
  } else if (state.data.testPreview?.capture?.warnings.length) {
    setStatus(state.data.testPreview.capture.warnings.join(" "), "error");
  } else {
    setStatus("Page read successfully. Nothing was sent off your computer.", "success");
  }
}

async function scanPage() {
  await ready;
  elements.scan.disabled = true;
  state.data = null;
  elements.results.hidden = true;
  setStatus(elements.captureMode.value !== 'passage' ? 'Reading the requested questions… Keep this popup open and avoid navigating. This may take several minutes.' : elements.includePassageQuestions.checked
    ? "Reading this passage’s questions… Keep this popup open and avoid navigating."
    : "Reading the current page…");

  try {
    const tab = await currentTab();
    if (!tab?.id || !tab.url?.startsWith("https://tutor.thesatcrashcourse.com/")) {
      throw new Error("Open a tutor.thesatcrashcourse.com page first.");
    }

    const options = readOptions();
    await savePreferences();
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "SAT_READER_SCAN",
      options,
    });

    if (!response?.ok) throw new Error(response?.error || "The page did not respond.");
    // 0.7.1 already supports passage, Part B and Math batch exports. Keep those
    // complete captures downloadable while the page still has that script.
    const compatibleLegacyBatch = response.data?.readerVersion === '0.7.1'
      && elements.captureMode.value !== 'ela-all'
      && Array.isArray(response.data?.testPreview?.questions);
    if (response.data?.readerVersion !== READER_VERSION && !compatibleLegacyBatch) {
      throw new Error("This test tab is using an older reader script. Reload SAT Crash Course Reader in chrome://extensions, then refresh the test tab and scan again.");
    }

    let saved = true;
    try {
      await chrome.storage.local.set({ satReaderCapture: { data: response.data, options } });
    } catch {
      saved = false;
    }
    renderCapture(response.data, options);
    if (!saved) setStatus("Scan completed, but Chrome could not save it. Download JSON before closing this popup.", "error");
  } catch (error) {
    const detail = error instanceof Error ? error.message : "The page could not be read.";
    const message = /Receiving end does not exist|Extension context invalidated/i.test(detail)
      ? "The page reader is not connected. Reload SAT Crash Course Reader in chrome://extensions, then refresh the test tab and scan again."
      : detail;
    setStatus(message, "error");
  } finally {
    elements.scan.disabled = false;
  }
}

elements.scan.addEventListener("click", scanPage);
function updateCaptureMode() {
  const mode = elements.captureMode.value;
  document.querySelector('#question-range-field').hidden = mode !== 'part-b';
  document.querySelector('#capture-help').hidden = !['math-all','ela-all'].includes(mode);
  document.querySelector('#capture-help').textContent = `Select ${mode === 'ela-all' ? 'English Language Arts' : 'Mathematics'} on the test page first. The reader captures the complete module and restores your starting question. Keep this popup open.`;
  elements.includePassageQuestions.closest('label').hidden = mode !== 'passage';
  elements.scan.textContent = mode === 'math-all' ? 'Read all 50 math questions' : mode === 'ela-all' ? 'Read all ELA questions' : mode === 'part-b' ? 'Read Part B questions' : 'Read current page';
}
elements.captureMode.addEventListener('change', updateCaptureMode);

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

for (const element of Object.values(optionElements)) element.addEventListener("change", savePreferences);
elements.questionRange.addEventListener("input", savePreferences);
previewDetails.addEventListener("toggle", savePreferences);
const ready = restoreState();
