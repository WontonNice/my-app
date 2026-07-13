import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const questionBanksRoot = join(workspaceRoot, "client", "src", "content", "practice", "questionBanks");
const editorHtmlPath = join(workspaceRoot, "tools", "question-bank-editor.html");
const difficulties = ["easy", "medium", "hard", "elite"];
const topics = [
  { folder: "authorsPointOfView", label: "Author's Point of View", prefix: "pov", slug: "authors-point-of-view" },
  { folder: "centralIdeaTheme", label: "Central Idea & Theme", prefix: "central", slug: "central-idea-theme" },
  { folder: "wordPhraseMeaning", label: "Word & Phrase Meaning", prefix: "words", slug: "word-phrase-meaning" },
  { folder: "figurativeLanguageImagery", label: "Figurative Language & Imagery", prefix: "figurative", slug: "figurative-language-imagery" },
  { folder: "toneMood", label: "Tone & Mood", prefix: "tone", slug: "tone-mood" },
  { folder: "textStructure", label: "Text Structure", prefix: "structure", slug: "text-structure" },
  { folder: "evidenceSupport", label: "Evidence & Support", prefix: "evidence", slug: "evidence-support" },
  { folder: "inference", label: "Inference", prefix: "inference", slug: "inference" },
];
const editToken = randomBytes(24).toString("hex");

function getTarget(topicSlug, difficulty) {
  const topic = topics.find((candidate) => candidate.slug === topicSlug);
  if (!topic) throw new EditorError(400, "Choose a valid topic.");
  if (!difficulties.includes(difficulty)) throw new EditorError(400, "Choose a valid difficulty.");
  return { filePath: join(questionBanksRoot, topic.folder, `${difficulty}.ts`), topic };
}

class EditorError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new EditorError(400, `${label} is required.`);
  return value.trim().replace(/\r\n?/g, "\n");
}

function normalizeQuestion(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new EditorError(400, "Question data is invalid.");
  const topic = requiredText(input.topic, "Topic");
  const difficulty = requiredText(input.difficulty, "Difficulty");
  const id = requiredText(input.id, "Question ID").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new EditorError(400, "Question ID may contain only lowercase letters, numbers, and hyphens.");

  const correctChoiceId = requiredText(input.correctChoiceId, "Correct answer").toUpperCase();
  if (!["A", "B", "C", "D"].includes(correctChoiceId)) throw new EditorError(400, "Correct answer must be A, B, C, or D.");

  const choices = ["A", "B", "C", "D"].map((choiceId) => ({
    id: choiceId,
    text: requiredText(input.choices?.[choiceId], `Answer ${choiceId}`),
  }));
  const incorrectChoiceExplanations = {};
  for (const choice of choices) {
    if (choice.id === correctChoiceId) continue;
    incorrectChoiceExplanations[choice.id] = requiredText(input.incorrectChoiceExplanations?.[choice.id], `Explanation for wrong answer ${choice.id}`);
  }

  getTarget(topic, difficulty);
  return {
    choices,
    correctChoiceId,
    difficulty,
    explanation: requiredText(input.explanation, "Correct-answer explanation"),
    id,
    incorrectChoiceExplanations,
    prompt: requiredText(input.prompt, "Question"),
    stimulus: requiredText(input.stimulus, "Passage"),
    topic,
  };
}

function quote(value) {
  return JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function formatStimulus(value) {
  if (!value.includes("\n")) return quote(value);
  const escaped = value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return `\`${escaped}\``;
}

function buildSnippet(question) {
  const lines = [
    "  {",
    `    id: ${quote(question.id)},`,
    `    difficulty: ${quote(question.difficulty)},`,
    `    stimulus: ${formatStimulus(question.stimulus)},`,
    `    prompt: ${quote(question.prompt)},`,
    "    choices: [",
    ...question.choices.map((choice) => `      { id: ${quote(choice.id)}, text: ${quote(choice.text)} },`),
    "    ],",
    `    correctChoiceId: ${quote(question.correctChoiceId)},`,
    `    explanation: ${quote(question.explanation)},`,
    "    incorrectChoiceExplanations: {",
    ...Object.entries(question.incorrectChoiceExplanations).map(([choiceId, explanation]) => `      ${choiceId}: ${quote(explanation)},`),
    "    },",
    "  },",
  ];
  return lines.join("\n");
}

async function getQuestionBankFiles() {
  const entries = await readdir(questionBanksRoot, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts")
    .map((entry) => join(entry.parentPath, entry.name));
}

async function assertUniqueId(questionId) {
  for (const filePath of await getQuestionBankFiles()) {
    const source = await readFile(filePath, "utf8");
    if (source.includes(`id: "${questionId}"`) || source.includes(`id: '${questionId}'`)) {
      throw new EditorError(409, `Question ID ${questionId} already exists in ${relative(workspaceRoot, filePath)}.`);
    }
  }
}

async function getSuggestedId(topic, difficulty) {
  const { filePath } = getTarget(topic.slug, difficulty);
  const source = await readFile(filePath, "utf8");
  const pattern = new RegExp(`id:\\s*["']${topic.prefix}-${difficulty}-(\\d+)["']`, "g");
  let highest = 0;
  for (const match of source.matchAll(pattern)) highest = Math.max(highest, Number(match[1]));
  return `${topic.prefix}-${difficulty}-${highest + 1}`;
}

async function getSuggestions() {
  const suggestions = {};
  for (const topic of topics) {
    suggestions[topic.slug] = {};
    for (const difficulty of difficulties) suggestions[topic.slug][difficulty] = await getSuggestedId(topic, difficulty);
  }
  return suggestions;
}

async function previewQuestion(input) {
  const question = normalizeQuestion(input);
  await assertUniqueId(question.id);
  const { filePath } = getTarget(question.topic, question.difficulty);
  const source = await readFile(filePath, "utf8");
  if (!source.includes("PracticeQuestion[] = [") || source.lastIndexOf("\n];") < 0) {
    throw new EditorError(500, `The target file does not have the expected PracticeQuestion array format: ${relative(workspaceRoot, filePath)}`);
  }
  return {
    question,
    snippet: buildSnippet(question),
    sourceHash: createHash("sha256").update(source).digest("hex"),
    target: relative(workspaceRoot, filePath).replace(/\\/g, "/"),
  };
}

async function saveQuestion(input, expectedSourceHash) {
  const preview = await previewQuestion(input);
  const { filePath, topic } = getTarget(preview.question.topic, preview.question.difficulty);
  const source = await readFile(filePath, "utf8");
  const currentHash = createHash("sha256").update(source).digest("hex");
  if (!expectedSourceHash || currentHash !== expectedSourceHash) {
    throw new EditorError(409, "The target file changed after preview. Preview again before writing.");
  }

  const closingIndex = source.lastIndexOf("\n];");
  const updated = `${source.slice(0, closingIndex).trimEnd()}\n${preview.snippet}${source.slice(closingIndex)}`;
  await writeFile(filePath, updated, "utf8");
  return {
    id: preview.question.id,
    nextId: await getSuggestedId(topic, preview.question.difficulty),
    target: preview.target,
  };
}

function sendJson(response, status, value) {
  response.writeHead(status, { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new EditorError(413, "The pasted content is too large.");
  }
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new EditorError(400, "The request was not valid JSON.");
  }
}

function verifyEditRequest(request) {
  if (request.headers["x-editor-token"] !== editToken) throw new EditorError(403, "Editor token is missing or invalid.");
  const origin = request.headers.origin;
  if (origin && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) throw new EditorError(403, "Only the local editor may write question files.");
}

async function handleRequest(request, response) {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": "text/html; charset=utf-8" });
      response.end(await readFile(editorHtmlPath, "utf8"));
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/config") {
      sendJson(response, 200, { difficulties, editToken, suggestions: await getSuggestions(), topics });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/preview") {
      verifyEditRequest(request);
      sendJson(response, 200, await previewQuestion(await readJson(request)));
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/questions") {
      verifyEditRequest(request);
      const body = await readJson(request);
      sendJson(response, 201, await saveQuestion(body.question, body.sourceHash));
      return;
    }
    sendJson(response, 404, { message: "Not found." });
  } catch (error) {
    const status = error instanceof EditorError ? error.status : 500;
    sendJson(response, status, { message: error instanceof Error ? error.message : "Unexpected editor error." });
  }
}

async function validateSetup() {
  await readFile(editorHtmlPath, "utf8");
  for (const topic of topics) {
    for (const difficulty of difficulties) {
      const { filePath } = getTarget(topic.slug, difficulty);
      const source = await readFile(filePath, "utf8");
      if (!source.includes("PracticeQuestion[] = [") || source.lastIndexOf("\n];") < 0) throw new Error(`Unexpected question bank format: ${relative(workspaceRoot, filePath)}`);
    }
  }
  console.log(`Question editor validated ${topics.length * difficulties.length} question-bank files.`);
}

if (process.argv.includes("--validate")) {
  await validateSetup();
  process.exit(0);
}

const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
const port = portArgument ? Number(portArgument.slice("--port=".length)) : 4318;
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Use a port between 1024 and 65535.");

const server = createServer(handleRequest);
server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Question Bank Editor is running at ${url}`);
  console.log("Press Ctrl+C when you are finished.");
  if (process.argv.includes("--no-open")) return;
  if (process.platform === "win32") spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore", windowsHide: true }).unref();
  else if (process.platform === "darwin") spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  else spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
});
