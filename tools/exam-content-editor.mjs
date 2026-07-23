import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const passageSetsRoot = join(workspaceRoot, "client", "src", "content", "exams", "passageSets");
const mathSetsRoot = join(workspaceRoot, "client", "src", "content", "exams", "mathSets");
const testsRoot = join(workspaceRoot, "client", "src", "content", "exams", "tests");
const examsIndexPath = join(workspaceRoot, "client", "src", "content", "exams", "index.ts");
const standaloneItemsPath = join(workspaceRoot, "client", "src", "content", "exams", "standaloneItems.ts");
const examImagesRoot = join(workspaceRoot, "client", "public", "exam-images");
const katexDistRoot = join(workspaceRoot, "node_modules", "katex", "dist");
const assessmentsPath = join(workspaceRoot, "server", "data", "assessments.json");
const editorHtmlPath = join(workspaceRoot, "tools", "exam-content-editor.html");
const appStylesPath = join(workspaceRoot, "client", "src", "styles", "global.css");
const editToken = randomBytes(24).toString("hex");
const passageFormats = ["prose", "poem", "sentence_prose"];
const topics = [
  "Author's Point of View",
  "Central Idea & Theme",
  "Supporting Evidence",
  "Inference",
  "Vocabulary in Context",
  "Text Structure & Purpose",
  "Figurative Language & Imagery",
  "Tone & Mood",
  "Revising & Editing",
  "Grammar & Usage",
  "Conventions & Grammar",
  "Pronouns",
  "Sentence Construction",
  "Uncategorized",
];
const mathTopics = [
  "Arithmetic",
  "Algebra",
  "Geometry",
  "Measurement",
  "Number Sense",
  "Percent",
  "Probability & Statistics",
  "Rates & Unit Conversion",
  "Ratios & Proportions",
  "Uncategorized",
];

class EditorError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function quote(value) {
  return JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function hashSource(source) {
  return createHash("sha256").update(source).digest("hex");
}

function relativePath(filePath) {
  return relative(workspaceRoot, filePath).replace(/\\/g, "/");
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function identifierFrom(value, suffix = "") {
  const words = value.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const identifier = words
    .map((word, index) =>
      index === 0
        ? `${word.charAt(0).toLowerCase()}${word.slice(1)}`
        : `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join("");
  const safeIdentifier = /^[a-zA-Z_$]/.test(identifier) ? identifier : `content${identifier}`;
  return `${safeIdentifier || "content"}${suffix}`;
}

function requiredText(value, label, { preserve = false } = {}) {
  if (typeof value !== "string" || !value.trim()) throw new EditorError(400, `${label} is required.`);
  const normalized = value.replace(/\r\n?/g, "\n");
  return preserve ? normalized : normalized.trim();
}

const allowedRichTags = new Set([
  "p",
  "div",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "sub",
  "sup",
  "ul",
  "ol",
  "li",
]);

function sanitizeRichText(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?([a-z0-9-]+)(?:\s[^>]*)?>/gi, (match, rawTag) => {
      const tag = rawTag.toLowerCase();
      if (!allowedRichTags.has(tag)) return "";
      const isClosing = match.startsWith("</");
      if (tag === "br") return "<br>";
      const normalizedTag = tag === "b" ? "strong" : tag === "i" ? "em" : tag === "strike" ? "s" : tag;
      return `<${isClosing ? "/" : ""}${normalizedTag}>`;
    })
    .trim();
}

function sanitizeInlineRichText(value) {
  return sanitizeRichText(value)
    .replace(/<(p|div)>/gi, "<br>")
    .replace(/<\/(p|div)>/gi, "")
    .replace(/(?:<br>){2,}/gi, "<br>")
    .replace(/^(?:<br>)+|(?:<br>)+$/gi, "")
    .trim();
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return null;
}

function collectEnvironment(sourceFile) {
  const environment = new Map();
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        environment.set(declaration.name.text, declaration.initializer);
      }
    }
  }
  return environment;
}

function resolveNode(node, environment, seen = new Set()) {
  if (!node) return undefined;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return resolveNode(node.expression, environment, seen);
  }
  if (ts.isIdentifier(node) && environment.has(node.text)) {
    if (seen.has(node.text)) throw new Error(`Circular value reference: ${node.text}`);
    return resolveNode(environment.get(node.text), environment, new Set([...seen, node.text]));
  }
  return node;
}

function valueFromNode(node, environment, seen = new Set()) {
  const resolved = resolveNode(node, environment, seen);
  if (!resolved) return undefined;
  if (ts.isStringLiteral(resolved) || ts.isNoSubstitutionTemplateLiteral(resolved)) return resolved.text;
  if (ts.isNumericLiteral(resolved)) return Number(resolved.text);
  if (resolved.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (resolved.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (resolved.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(resolved) && resolved.text === "undefined") return undefined;
  if (ts.isPrefixUnaryExpression(resolved) && resolved.operator === ts.SyntaxKind.MinusToken) {
    const operand = valueFromNode(resolved.operand, environment, seen);
    return typeof operand === "number" ? -operand : undefined;
  }
  if (ts.isArrayLiteralExpression(resolved)) {
    return resolved.elements.map((element) => valueFromNode(element, environment, seen));
  }
  if (ts.isObjectLiteralExpression(resolved)) {
    const value = {};
    for (const property of resolved.properties) {
      if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property.name);
        if (name !== null) value[name] = valueFromNode(property.initializer, environment, seen);
      } else if (ts.isShorthandPropertyAssignment(property)) {
        value[property.name.text] = valueFromNode(property.name, environment, seen);
      }
    }
    return value;
  }
  throw new Error(`Unsupported source expression: ${ts.SyntaxKind[resolved.kind]}`);
}

function objectProperty(objectNode, name) {
  if (!objectNode || !ts.isObjectLiteralExpression(objectNode)) return undefined;
  return objectNode.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  );
}

function exportedObject(sourceFile, environment, predicate) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      const initializer = resolveNode(declaration.initializer, environment);
      if (ts.isObjectLiteralExpression(initializer) && predicate(initializer)) {
        return { exportName: declaration.name.text, initializer };
      }
    }
  }
  return null;
}

async function parsePassageFile(filePath) {
  const source = await readFile(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const environment = collectEnvironment(sourceFile);
  const exported = exportedObject(
    sourceFile,
    environment,
    (objectNode) => Boolean(objectProperty(objectNode, "passage") && objectProperty(objectNode, "questions")),
  );
  if (!exported) throw new Error("No exported ExamPassageSet object was found.");

  const passageProperty = objectProperty(exported.initializer, "passage");
  const passageExpression = resolveNode(passageProperty.initializer, environment);
  if (!ts.isCallExpression(passageExpression) || !passageExpression.arguments[0]) {
    throw new Error("The passage must be created with an exam passage formatter.");
  }
  const formatterName = ts.isIdentifier(passageExpression.expression) ? passageExpression.expression.text : "";
  const format =
    formatterName === "createPlainTextPassage"
      ? "poem"
      : formatterName === "createSentenceNumberedPassage"
        ? "sentence_prose"
        : "prose";
  const passageInput = valueFromNode(passageExpression.arguments[0], environment);
  const questionsProperty = objectProperty(exported.initializer, "questions");
  const questions = valueFromNode(questionsProperty.initializer, environment);
  const directionsProperty = objectProperty(exported.initializer, "directions");
  const idProperty = objectProperty(exported.initializer, "id");
  const labelProperty = objectProperty(exported.initializer, "label");

  if (!passageInput || typeof passageInput !== "object" || !Array.isArray(questions)) {
    throw new Error("The passage or question data could not be read.");
  }

  return {
    author: typeof passageInput.author === "string" ? passageInput.author : "",
    blurb:
      typeof passageInput.blurb === "string"
        ? passageInput.blurb
        : typeof passageInput.header === "string"
          ? passageInput.header
          : "",
    directions: directionsProperty ? valueFromNode(directionsProperty.initializer, environment) : undefined,
    exportName: exported.exportName,
    fileName: filePath.slice(passageSetsRoot.length + 1),
    format,
    id: String(passageInput.id ?? ""),
    label: labelProperty ? valueFromNode(labelProperty.initializer, environment) : undefined,
    image: passageInput.image && typeof passageInput.image === "object" ? passageInput.image : undefined,
    passageSetId: idProperty ? String(valueFromNode(idProperty.initializer, environment) ?? "") : "",
    questions,
    richText: typeof passageInput.richText === "string" ? passageInput.richText : "",
    sourceHash: hashSource(source),
    sourceNote: typeof passageInput.sourceNote === "string" ? passageInput.sourceNote : "",
    text: typeof passageInput.text === "string" ? passageInput.text : "",
    title: typeof passageInput.title === "string" ? passageInput.title : "",
  };
}

async function listPassages() {
  const entries = await readdir(passageSetsRoot, { withFileTypes: true });
  const passages = [];
  const passageErrors = [];
  for (const entry of entries.filter((candidate) => candidate.isFile() && extname(candidate.name) === ".ts")) {
    try {
      passages.push(await parsePassageFile(join(passageSetsRoot, entry.name)));
    } catch (error) {
      passageErrors.push({
        fileName: entry.name,
        message: error instanceof Error ? error.message : "The passage could not be read.",
      });
    }
  }
  passages.sort((left, right) => left.title.localeCompare(right.title));
  return { passageErrors, passages };
}

async function parseMathFile(filePath) {
  const source = await readFile(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const environment = collectEnvironment(sourceFile);
  const exported = exportedObject(
    sourceFile,
    environment,
    (objectNode) =>
      Boolean(
        objectProperty(objectNode, "directions") &&
          objectProperty(objectNode, "id") &&
          objectProperty(objectNode, "questions"),
      ),
  );
  if (!exported) throw new Error("No exported ExamMathSection object was found.");
  const value = valueFromNode(exported.initializer, environment);
  if (!value || typeof value !== "object" || !Array.isArray(value.questions)) {
    throw new Error("The math section or its questions could not be read.");
  }
  return {
    ...value,
    exportName: exported.exportName,
    fileName: filePath.slice(mathSetsRoot.length + 1),
    sourceHash: hashSource(source),
  };
}

async function listMathSections() {
  await mkdir(mathSetsRoot, { recursive: true });
  const entries = await readdir(mathSetsRoot, { withFileTypes: true });
  const mathErrors = [];
  const mathSections = [];
  for (const entry of entries.filter((candidate) => candidate.isFile() && extname(candidate.name) === ".ts")) {
    try {
      mathSections.push(await parseMathFile(join(mathSetsRoot, entry.name)));
    } catch (error) {
      mathErrors.push({
        fileName: entry.name,
        message: error instanceof Error ? error.message : "The math section could not be read.",
      });
    }
  }
  mathSections.sort((left, right) => String(left.label || left.id).localeCompare(String(right.label || right.id)));
  return { mathErrors, mathSections };
}

function normalizeChoice(choice, index) {
  const id = String.fromCharCode(65 + index);
  const text = requiredText(choice?.text, `Answer ${id}`);
  const html = sanitizeInlineRichText(choice?.html);
  return { id, ...(html ? { html } : {}), text };
}

function normalizeQuestion(question, passageId, index) {
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    throw new EditorError(400, `Question ${index + 1} is invalid.`);
  }
  const id = requiredText(question.id, `Question ${index + 1} ID`).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new EditorError(400, `Question ${index + 1} ID may use lowercase letters, numbers, and hyphens.`);
  }
  if (!id.startsWith(`${passageId}-`) && id !== passageId) {
    // IDs may be intentionally shared with an imported official source, so this is advisory rather than destructive.
  }
  const promptHtml = sanitizeInlineRichText(question.promptHtml);
  const baseQuestion = {
    id,
    points: Number.isFinite(Number(question.points)) ? Math.max(1, Number(question.points)) : 1,
    prompt: requiredText(question.prompt, `Question ${index + 1}`),
    ...(promptHtml ? { promptHtml } : {}),
    topic: requiredText(question.topic, `Question ${index + 1} topic`),
  };

  if (
    question.type === "multiple_choice" ||
    question.type === "multi_select" ||
    question.type === "transition_drop"
  ) {
    const allowedChoiceCounts = question.type === "multi_select" ? [4, 5] : [4];
    if (!Array.isArray(question.choices) || !allowedChoiceCounts.includes(question.choices.length)) {
      throw new EditorError(
        400,
        question.type === "multi_select"
          ? `Question ${index + 1} must have four or five answer choices.`
          : `Question ${index + 1} must have exactly four answer choices.`,
      );
    }
    const choices = question.choices.map(normalizeChoice);
    if (question.type === "multiple_choice" || question.type === "transition_drop") {
      const correctChoiceId = requiredText(question.correctChoiceId, `Question ${index + 1} correct answer`).toUpperCase();
      if (!["A", "B", "C", "D"].includes(correctChoiceId)) {
        throw new EditorError(400, `Question ${index + 1} correct answer must be A, B, C, or D.`);
      }
      if (question.type === "transition_drop") {
        const transitionBlankBefore =
          typeof question.transitionBlankBefore === "string" ? question.transitionBlankBefore.trim() : "";
        const transitionBlankAfter =
          typeof question.transitionBlankAfter === "string" ? question.transitionBlankAfter.trim() : "";
        if (!transitionBlankBefore && !transitionBlankAfter) {
          throw new EditorError(
            400,
            `Question ${index + 1} needs sentence text before or after the transition answer box.`,
          );
        }
        return {
          ...baseQuestion,
          choices,
          correctChoiceId,
          instructions:
            typeof question.instructions === "string" && question.instructions.trim()
              ? question.instructions.trim()
              : "Move the correct answer to the box.",
          transitionBlankAfter,
          transitionBlankBefore,
          ...(typeof question.transitionSentenceNumber === "string" && question.transitionSentenceNumber.trim()
            ? { transitionSentenceNumber: question.transitionSentenceNumber.trim() }
            : {}),
          type: "transition_drop",
        };
      }
      return { ...baseQuestion, choices, correctChoiceId, type: "multiple_choice" };
    }

    const correctChoiceIds = Array.isArray(question.correctChoiceIds)
      ? Array.from(new Set(question.correctChoiceIds.map((choiceId) => String(choiceId).toUpperCase())))
      : [];
    const availableChoiceIds = new Set(choices.map((choice) => choice.id));
    if (
      correctChoiceIds.length < 2 ||
      correctChoiceIds.some((choiceId) => !availableChoiceIds.has(choiceId))
    ) {
      throw new EditorError(400, `Question ${index + 1} needs at least two correct answer bubbles.`);
    }
    return {
      ...baseQuestion,
      choices,
      correctChoiceIds,
      ...(typeof question.instructions === "string" &&
      question.instructions.trim() &&
      !/^Select the \d+ correct answers\.$/i.test(question.instructions.trim())
        ? { instructions: question.instructions.trim() }
        : {}),
      requiredSelections: correctChoiceIds.length,
      type: "multi_select",
    };
  }

  if (question.type === "category_sort" || question.type === "table_match") {
    const isTableMatch = question.type === "table_match";
    if (!Array.isArray(question.categories) || question.categories.length < 2) {
      throw new EditorError(
        400,
        `Question ${index + 1} needs at least two ${isTableMatch ? "table rows" : "categories"}.`,
      );
    }
    const categories = question.categories.map((category, categoryIndex) => ({
      id: slugify(String(category?.id || `category-${categoryIndex + 1}`)),
      title: requiredText(category?.title, `Question ${index + 1} category ${categoryIndex + 1}`),
    }));
    if (categories.some((category) => !category.id) || new Set(categories.map((category) => category.id)).size !== categories.length) {
      throw new EditorError(400, `Question ${index + 1} category names must be unique.`);
    }
    if (!Array.isArray(question.items) || question.items.length < 2) {
      throw new EditorError(400, `Question ${index + 1} needs at least two answer cards.`);
    }
    const items = question.items.map((item, itemIndex) => {
      const html = sanitizeInlineRichText(item?.html);
      return {
        ...(html ? { html } : {}),
        id: slugify(String(item?.id || `item-${itemIndex + 1}`)),
        text: requiredText(item?.text, `Question ${index + 1} answer card ${itemIndex + 1}`),
      };
    });
    if (items.some((item) => !item.id) || new Set(items.map((item) => item.id)).size !== items.length) {
      throw new EditorError(400, `Question ${index + 1} answer cards must be unique.`);
    }
    const categoryIds = new Set(categories.map((category) => category.id));
    const placementsInput =
      question.correctPlacements && typeof question.correctPlacements === "object" && !Array.isArray(question.correctPlacements)
        ? question.correctPlacements
        : {};
    const categoryCapacity = isTableMatch || Number(question.categoryCapacity) === 1 ? 1 : undefined;
    const correctPlacements =
      categoryCapacity === 1
        ? Object.fromEntries(
            items.flatMap((item) => {
              const categoryId = String(placementsInput[item.id] ?? "");
              if (!categoryId) return [];
              if (!categoryIds.has(categoryId)) {
                throw new EditorError(400, `Choose a valid correct box for every used answer card in question ${index + 1}.`);
              }
              return [[item.id, categoryId]];
            }),
          )
        : Object.fromEntries(
            items.map((item) => {
              const categoryId = String(placementsInput[item.id] ?? "");
              if (!categoryIds.has(categoryId)) {
                throw new EditorError(400, `Choose a correct category for every answer card in question ${index + 1}.`);
              }
              return [item.id, categoryId];
            }),
          );
    if (categoryCapacity === 1) {
      const assignedCategoryIds = Object.values(correctPlacements);
      if (assignedCategoryIds.length !== categories.length) {
        throw new EditorError(
          400,
          `Question ${index + 1} needs one correct answer card for every category box. Mark extra cards as not used.`,
        );
      }
      if (new Set(assignedCategoryIds).size !== assignedCategoryIds.length) {
        throw new EditorError(
          400,
          `Question ${index + 1} may assign only one correct answer card to each category box.`,
        );
      }
    }
    return {
      ...baseQuestion,
      categories,
      ...(categoryCapacity ? { categoryCapacity } : {}),
      correctPlacements,
      instructions:
        typeof question.instructions === "string" && question.instructions.trim()
          ? question.instructions.trim()
          : isTableMatch
            ? "Move the correct answer to each box in the table."
            : categoryCapacity === 1
            ? "Move one answer to each box. Each box accepts only one answer."
            : "Move each answer to the correct box.",
      items,
      requiredPlacements: categoryCapacity === 1 ? Object.keys(correctPlacements).length : items.length,
      ...(isTableMatch
        ? {
            tableHeaders: {
              answer: requiredText(
                question.tableHeaders?.answer || "Answer",
                `Question ${index + 1} answer column header`,
              ),
              row: requiredText(
                question.tableHeaders?.row || "Rows",
                `Question ${index + 1} row column header`,
              ),
            },
          }
        : {}),
      type: question.type,
    };
  }

  return question;
}

function normalizePassage(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Passage data is invalid.");
  }
  const id = slugify(requiredText(input.id, "Passage ID"));
  if (!id) throw new EditorError(400, "Passage ID must contain letters or numbers.");
  const format = requiredText(input.format, "Passage format");
  if (!passageFormats.includes(format)) throw new EditorError(400, "Choose a valid passage format.");
  const fileName = input.fileName
    ? requiredText(input.fileName, "Source file")
    : `${id}.ts`;
  if (fileName !== fileName.split(/[\\/]/).pop() || extname(fileName) !== ".ts") {
    throw new EditorError(400, "The passage source file must be a .ts file in the passageSets folder.");
  }
  const exportName = input.exportName
    ? requiredText(input.exportName, "Export name")
    : identifierFrom(id, "PassageSet");
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(exportName)) throw new EditorError(400, "The export name is invalid.");
  const passageSetId = slugify(String(input.passageSetId || `ela-${id}`));
  const questions = Array.isArray(input.questions)
    ? input.questions.map((question, index) => normalizeQuestion(question, id, index))
    : [];
  if (!questions.length) throw new EditorError(400, "Add at least one question before saving.");
  const questionIds = new Set(questions.map((question) => question.id));
  if (questionIds.size !== questions.length) throw new EditorError(400, "Every question needs a unique ID.");

  return {
    author: typeof input.author === "string" ? input.author.trim() : "",
    blurb: typeof input.blurb === "string" ? input.blurb.trim() : "",
    directions:
      input.directions && typeof input.directions === "object" && !Array.isArray(input.directions)
        ? input.directions
        : {
            body:
              "Read each text and answer the related questions. Base your answers only on the content within the text.",
            breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
            subject: "English Language Arts",
            title: "READING COMPREHENSION",
          },
    exportName,
    fileName,
    format,
    id,
    image:
      input.image && typeof input.image === "object" && !Array.isArray(input.image)
        ? {
            alt: requiredText(input.image.alt, "Passage image alt text"),
            ...(typeof input.image.caption === "string" && input.image.caption.trim()
              ? { caption: input.image.caption.trim() }
              : {}),
            src: /^\/exam-images\/[a-zA-Z0-9._-]+$/.test(String(input.image.src ?? ""))
              ? String(input.image.src)
              : (() => {
                  throw new EditorError(400, "Upload the passage image through the studio before saving.");
                })(),
          }
        : undefined,
    label: typeof input.label === "string" ? input.label.trim() : "",
    passageSetId,
    questions,
    richText: sanitizeRichText(input.richText),
    sourceHash: typeof input.sourceHash === "string" ? input.sourceHash : "",
    sourceNote: typeof input.sourceNote === "string" ? input.sourceNote.trim() : "",
    text: requiredText(input.text, "Passage text", { preserve: true }),
    title: requiredText(input.title, "Passage title"),
  };
}

function buildPassageSource(passage) {
  const formatter =
    passage.format === "poem"
      ? "createPlainTextPassage"
      : passage.format === "sentence_prose"
        ? "createSentenceNumberedPassage"
        : "createProsePassage";
  const textName = identifierFrom(passage.id, "PassageText");
  const questionsName = identifierFrom(passage.id, "Questions");
  const passageOptions = [
    `    id: ${quote(passage.id)},`,
    `    title: ${quote(passage.title)},`,
    ...(passage.author ? [`    author: ${quote(passage.author)},`] : []),
    ...(passage.blurb ? [`    blurb: ${quote(passage.blurb)},`] : []),
    ...(passage.image ? [`    image: ${JSON.stringify(passage.image)},`] : []),
    ...(passage.richText ? [`    richText: ${quote(passage.richText)},`] : []),
    ...(passage.sourceNote ? [`    sourceNote: ${quote(passage.sourceNote)},`] : []),
    `    text: ${textName},`,
  ].join("\n");
  return [
    `import { ${formatter} } from "../formatters";`,
    'import type { ExamPassageSet, ExamQuestion } from "../types";',
    "",
    `const ${textName} = ${quote(passage.text)};`,
    "",
    `const ${questionsName}: ExamQuestion[] = ${JSON.stringify(passage.questions, null, 2)};`,
    "",
    `export const ${passage.exportName}: ExamPassageSet = {`,
    `  id: ${quote(passage.passageSetId)},`,
    ...(passage.label ? [`  label: ${quote(passage.label)},`] : []),
    `  questionCount: ${questionsName}.length,`,
    `  directions: ${JSON.stringify(passage.directions, null, 2)},`,
    `  passage: ${formatter}({`,
    passageOptions,
    "  }),",
    `  questions: ${questionsName},`,
    "};",
    "",
  ].join("\n");
}

async function savePassage(input) {
  const passage = normalizePassage(input);
  const filePath = join(passageSetsRoot, passage.fileName);
  let existingSource = "";
  try {
    existingSource = await readFile(filePath, "utf8");
  } catch {
    // A new file has no source hash.
  }
  if (existingSource) {
    if (!passage.sourceHash || hashSource(existingSource) !== passage.sourceHash) {
      throw new EditorError(409, "This passage file changed after it was loaded. Refresh the editor before saving.");
    }
  } else {
    const { passages } = await listPassages();
    if (passages.some((candidate) => candidate.id === passage.id || candidate.exportName === passage.exportName)) {
      throw new EditorError(409, "That passage ID or export name already exists.");
    }
  }

  await writeFile(filePath, buildPassageSource(passage), "utf8");
  return parsePassageFile(filePath);
}

const imageExtensions = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function savePassageImage(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Image data is invalid.");
  }
  const passageId = slugify(requiredText(input.passageId, "Passage ID"));
  if (!passageId) throw new EditorError(400, "Passage ID must contain letters or numbers.");
  const mimeType = requiredText(input.mimeType, "Image type").toLowerCase();
  const extension = imageExtensions[mimeType];
  if (!extension) throw new EditorError(400, "Use a PNG, JPEG, GIF, or WebP image.");
  const dataUrl = requiredText(input.dataUrl, "Image file", { preserve: true });
  const match = dataUrl.match(/^data:[^;]+;base64,([a-zA-Z0-9+/=\s]+)$/);
  if (!match) throw new EditorError(400, "The uploaded image could not be read.");
  const bytes = Buffer.from(match[1].replace(/\s/g, ""), "base64");
  if (!bytes.length || bytes.length > 5_000_000) {
    throw new EditorError(413, "Passage images must be smaller than 5 MB.");
  }

  const fileName = `${passageId}-passage.${extension}`;
  await mkdir(examImagesRoot, { recursive: true });
  await writeFile(join(examImagesRoot, fileName), bytes);
  return {
    src: `/exam-images/${fileName}`,
    target: relativePath(join(examImagesRoot, fileName)),
  };
}

function normalizeMathImage(image, questionNumber) {
  if (!image || typeof image !== "object" || Array.isArray(image) || !String(image.src || "").trim()) {
    return undefined;
  }
  return {
    alt: requiredText(image.alt, `Math question ${questionNumber} image description`),
    ...(typeof image.caption === "string" && image.caption.trim()
      ? { caption: image.caption.trim() }
      : {}),
    src: requiredText(image.src, `Math question ${questionNumber} image`),
  };
}

function normalizeMathChoice(choice, index, questionNumber) {
  const fallbackId = String.fromCharCode(65 + index);
  const id = String(choice?.id || fallbackId).trim().toUpperCase();
  if (!/^[A-Z]$/.test(id)) {
    throw new EditorError(400, `Math question ${questionNumber} answer IDs must be letters.`);
  }
  const math = typeof choice?.math === "string" ? choice.math.trim() : "";
  const text = requiredText(choice?.text || math, `Math question ${questionNumber} answer ${id}`);
  const html = sanitizeInlineRichText(choice?.html);
  return { id, ...(html ? { html } : {}), ...(math ? { math } : {}), text };
}

function normalizeMathDropdownOption(option, optionIndex, questionNumber, dropdownNumber) {
  const id = requiredText(
    option?.id || `option-${optionIndex + 1}`,
    `Math question ${questionNumber} dropdown ${dropdownNumber} option ${optionIndex + 1} ID`,
  );
  if (/[{}]/.test(id)) {
    throw new EditorError(
      400,
      `Math question ${questionNumber} dropdown ${dropdownNumber} option IDs cannot contain braces.`,
    );
  }
  const math = typeof option?.math === "string" ? option.math.trim() : "";
  const text = requiredText(
    option?.text || math,
    `Math question ${questionNumber} dropdown ${dropdownNumber} option ${optionIndex + 1}`,
  );
  return { id, ...(math ? { math } : {}), text };
}

function normalizeMathQuestion(question, assessmentId, index) {
  const questionNumber = index + 1;
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    throw new EditorError(400, `Math question ${questionNumber} is invalid.`);
  }
  const id = slugify(requiredText(question.id, `Math question ${questionNumber} ID`));
  if (!id) throw new EditorError(400, `Math question ${questionNumber} needs a valid ID.`);
  const type = requiredText(question.type, `Math question ${questionNumber} type`);
  const instructionsHtml = sanitizeRichText(question.instructionsHtml);
  const promptHtml = sanitizeRichText(question.promptHtml);
  const baseQuestion = {
    id,
    ...(normalizeMathImage(question.image, questionNumber)
      ? { image: normalizeMathImage(question.image, questionNumber) }
      : {}),
    ...(typeof question.instructions === "string" && question.instructions.trim()
      ? { instructions: question.instructions.trim() }
      : {}),
    ...(instructionsHtml ? { instructionsHtml } : {}),
    points: Number.isFinite(Number(question.points)) ? Math.max(1, Number(question.points)) : 1,
    prompt: requiredText(question.prompt, `Math question ${questionNumber}`, { preserve: true }),
    ...(promptHtml ? { promptHtml } : {}),
    topic: requiredText(question.topic || "Uncategorized", `Math question ${questionNumber} topic`),
  };

  if (type === "multiple_choice" || type === "multi_select") {
    if (!Array.isArray(question.choices) || question.choices.length < 2 || question.choices.length > 8) {
      throw new EditorError(400, `Math question ${questionNumber} needs between two and eight answer choices.`);
    }
    const choices = question.choices.map((choice, choiceIndex) =>
      normalizeMathChoice(choice, choiceIndex, questionNumber),
    );
    if (new Set(choices.map((choice) => choice.id)).size !== choices.length) {
      throw new EditorError(400, `Math question ${questionNumber} answer IDs must be unique.`);
    }
    const availableChoiceIds = new Set(choices.map((choice) => choice.id));
    if (type === "multiple_choice") {
      const correctChoiceId = requiredText(
        question.correctChoiceId,
        `Math question ${questionNumber} correct answer`,
      ).toUpperCase();
      if (!availableChoiceIds.has(correctChoiceId)) {
        throw new EditorError(400, `Choose a valid correct answer for math question ${questionNumber}.`);
      }
      return { ...baseQuestion, choices, correctChoiceId, type };
    }
    const correctChoiceIds = Array.isArray(question.correctChoiceIds)
      ? Array.from(new Set(question.correctChoiceIds.map((choiceId) => String(choiceId).toUpperCase())))
      : [];
    if (
      correctChoiceIds.length < 2 ||
      correctChoiceIds.some((choiceId) => !availableChoiceIds.has(choiceId))
    ) {
      throw new EditorError(400, `Math question ${questionNumber} needs at least two correct answer bubbles.`);
    }
    return {
      ...baseQuestion,
      choices,
      correctChoiceIds,
      requiredSelections: correctChoiceIds.length,
      type,
    };
  }

  if (type === "numeric_entry" || type === "short_response" || type === "grid_in") {
    const correctTextAnswers = Array.isArray(question.correctTextAnswers)
      ? Array.from(
          new Set(
            question.correctTextAnswers
              .map((answer) => String(answer).trim())
              .filter(Boolean),
          ),
        )
      : [];
    if (!correctTextAnswers.length) {
      throw new EditorError(400, `Math question ${questionNumber} needs at least one accepted answer.`);
    }
    return { ...baseQuestion, correctTextAnswers, type };
  }

  if (type === "inline_dropdown") {
    const dropdownContent = Array.isArray(question.dropdownContent)
      ? question.dropdownContent.map((line, lineIndex) =>
          requiredText(
            line,
            `Math question ${questionNumber} dropdown sentence ${lineIndex + 1}`,
            { preserve: true },
          ),
        )
      : [];
    if (!dropdownContent.length) {
      throw new EditorError(400, `Math question ${questionNumber} needs at least one dropdown sentence.`);
    }
    if (!Array.isArray(question.dropdowns) || !question.dropdowns.length) {
      throw new EditorError(400, `Math question ${questionNumber} needs at least one dropdown menu.`);
    }
    if (dropdownContent.length !== question.dropdowns.length) {
      throw new EditorError(
        400,
        `Math question ${questionNumber} needs one dropdown sentence for each answer menu.`,
      );
    }
    const dropdowns = question.dropdowns.map((dropdown, dropdownIndex) => {
      const dropdownNumber = dropdownIndex + 1;
      const dropdownId = requiredText(
        dropdown?.id,
        `Math question ${questionNumber} dropdown ${dropdownNumber} ID`,
      );
      if (!/^[\w-]+$/.test(dropdownId)) {
        throw new EditorError(
          400,
          `Math question ${questionNumber} dropdown ${dropdownNumber} has an invalid internal ID.`,
        );
      }
      if (!Array.isArray(dropdown?.options) || dropdown.options.length < 2 || dropdown.options.length > 12) {
        throw new EditorError(
          400,
          `Math question ${questionNumber} dropdown ${dropdownNumber} needs between two and twelve options.`,
        );
      }
      const options = dropdown.options.map((option, optionIndex) =>
        normalizeMathDropdownOption(option, optionIndex, questionNumber, dropdownNumber),
      );
      if (new Set(options.map((option) => option.id)).size !== options.length) {
        throw new EditorError(
          400,
          `Math question ${questionNumber} dropdown ${dropdownNumber} option IDs must be unique.`,
        );
      }
      const correctChoiceId = requiredText(
        dropdown.correctChoiceId,
        `Math question ${questionNumber} dropdown ${dropdownNumber} correct answer`,
      );
      if (!options.some((option) => option.id === correctChoiceId)) {
        throw new EditorError(
          400,
          `Choose a valid correct answer for math question ${questionNumber} dropdown ${dropdownNumber}.`,
        );
      }
      return { correctChoiceId, id: dropdownId, options };
    });
    if (new Set(dropdowns.map((dropdown) => dropdown.id)).size !== dropdowns.length) {
      throw new EditorError(400, `Math question ${questionNumber} dropdown IDs must be unique.`);
    }
    dropdownContent.forEach((line, lineIndex) => {
      const placeholders = Array.from(line.matchAll(/\{\{([\w-]+)\}\}/g), (match) => match[1]);
      if (placeholders.length !== 1 || placeholders[0] !== dropdowns[lineIndex].id) {
        throw new EditorError(
          400,
          `Math question ${questionNumber} dropdown sentence ${lineIndex + 1} must contain its one answer menu.`,
        );
      }
    });
    const dropdownIds = new Set(dropdowns.map((dropdown) => dropdown.id));
    const referencedIds = dropdownContent.flatMap((line) =>
      Array.from(line.matchAll(/\{\{([\w-]+)\}\}/g), (match) => match[1]),
    );
    const unknownId = referencedIds.find((dropdownId) => !dropdownIds.has(dropdownId));
    if (unknownId) {
      throw new EditorError(
        400,
        `Math question ${questionNumber} contains an answer menu that is no longer available.`,
      );
    }
    const unreferencedDropdown = dropdowns.find((dropdown) => !referencedIds.includes(dropdown.id));
    if (unreferencedDropdown) {
      throw new EditorError(
        400,
        `Math question ${questionNumber} dropdown ${unreferencedDropdown.id} is missing from its sentence.`,
      );
    }
    return { ...baseQuestion, dropdownContent, dropdowns, type };
  }

  if (["category_sort", "transition_drop"].includes(type)) {
    return {
      ...question,
      ...baseQuestion,
      id,
      type,
    };
  }

  throw new EditorError(400, `Math question ${questionNumber} uses an unsupported question type.`);
}

function normalizeMathSection(input, assessment) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Math section data is invalid.");
  }
  const questions = Array.isArray(input.questions)
    ? input.questions.map((question, index) => normalizeMathQuestion(question, assessment.id, index))
    : [];
  if (!questions.length) throw new EditorError(400, "Add at least one math question before saving.");
  if (new Set(questions.map((question) => question.id)).size !== questions.length) {
    throw new EditorError(400, "Every math question needs a unique question ID.");
  }
  const directionsInput =
    input.directions && typeof input.directions === "object" && !Array.isArray(input.directions)
      ? input.directions
      : {};
  return {
    assessmentId: assessment.id,
    directions: {
      body:
        typeof directionsInput.body === "string" && directionsInput.body.trim()
          ? directionsInput.body.trim()
          : "Solve each problem. Select the answer from the choices given or enter your answer in the space provided.",
      breadcrumbLabel:
        typeof directionsInput.breadcrumbLabel === "string" && directionsInput.breadcrumbLabel.trim()
          ? directionsInput.breadcrumbLabel.trim()
          : "MATH DIRECTIONS",
      notes:
        Array.isArray(directionsInput.notes) && directionsInput.notes.some((note) => String(note).trim())
          ? directionsInput.notes.map((note) => String(note).trim()).filter(Boolean)
          : [
              "Formulas and definitions of mathematical terms and symbols are not provided.",
              "Diagrams other than graphs are not necessarily drawn to scale.",
            ],
      subject:
        typeof directionsInput.subject === "string" && directionsInput.subject.trim()
          ? directionsInput.subject.trim()
          : "MATHEMATICS",
      title:
        typeof directionsInput.title === "string" && directionsInput.title.trim()
          ? directionsInput.title.trim()
          : "IMPORTANT NOTES",
    },
    exportName:
      typeof input.exportName === "string" && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(input.exportName)
        ? input.exportName
        : identifierFrom(assessment.id, "MathSection"),
    fileName:
      typeof input.fileName === "string" &&
      input.fileName === input.fileName.split(/[\\/]/).pop() &&
      extname(input.fileName) === ".ts"
        ? input.fileName
        : `${slugify(assessment.id)}Math.ts`,
    id: slugify(String(input.id || `${assessment.id}-math`)),
    label: typeof input.label === "string" && input.label.trim() ? input.label.trim() : "Math",
    questions,
    sourceHash: typeof input.sourceHash === "string" ? input.sourceHash : "",
  };
}

function buildMathSource(section) {
  return [
    'import type { ExamMathSection } from "../types";',
    "",
    `export const ${section.exportName}: ExamMathSection = {`,
    `  directions: ${JSON.stringify(section.directions, null, 2)},`,
    `  id: ${quote(section.id)},`,
    `  label: ${quote(section.label)},`,
    `  questionCount: ${section.questions.length},`,
    `  questions: ${JSON.stringify(section.questions, null, 2)},`,
    "};",
    "",
  ].join("\n");
}

function replaceOrInsertMathSection(source, mathExportName) {
  const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const environment = collectEnvironment(sourceFile);
  const exported = exportedObject(
    sourceFile,
    environment,
    (objectNode) => Boolean(objectProperty(objectNode, "assessmentId") && objectProperty(objectNode, "passageSets")),
  );
  if (!exported) throw new EditorError(500, "The test file does not contain a recognizable ExamContent object.");
  const property = objectProperty(exported.initializer, "mathSection");
  if (property) {
    return `${source.slice(0, property.initializer.getStart(sourceFile))}${mathExportName}${source.slice(property.initializer.getEnd())}`;
  }
  const insertionIndex = exported.initializer.getStart(sourceFile) + 1;
  return `${source.slice(0, insertionIndex)}\n  mathSection: ${mathExportName},${source.slice(insertionIndex)}`;
}

async function saveMathImage(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Image data is invalid.");
  }
  const assessmentId = slugify(requiredText(input.assessmentId, "Assessment"));
  const questionId = slugify(requiredText(input.questionId, "Math question ID"));
  const mimeType = requiredText(input.mimeType, "Image type").toLowerCase();
  const extension = imageExtensions[mimeType];
  if (!extension) throw new EditorError(400, "Use a PNG, JPEG, GIF, or WebP image.");
  const dataUrl = requiredText(input.dataUrl, "Image file", { preserve: true });
  const match = dataUrl.match(/^data:[^;]+;base64,([a-zA-Z0-9+/=\s]+)$/);
  if (!match) throw new EditorError(400, "The uploaded image could not be read.");
  const bytes = Buffer.from(match[1].replace(/\s/g, ""), "base64");
  if (!bytes.length || bytes.length > 5_000_000) {
    throw new EditorError(413, "Math question images must be smaller than 5 MB.");
  }
  const fileName = `${assessmentId}-${questionId}-math.${extension}`;
  await mkdir(examImagesRoot, { recursive: true });
  await writeFile(join(examImagesRoot, fileName), bytes);
  return {
    src: `/exam-images/${fileName}`,
    target: relativePath(join(examImagesRoot, fileName)),
  };
}

async function saveMath(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Math section data is invalid.");
  }
  const state = await getState();
  const assessmentId = requiredText(input.assessmentId, "Assessment");
  const assessment = state.assessments.find((candidate) => candidate.id === assessmentId);
  if (!assessment) throw new EditorError(404, "The selected assessment was not found.");
  const existingTest = state.tests.find((candidate) => candidate.assessmentId === assessmentId);
  const existingSection = existingTest?.mathSectionFileName
    ? state.mathSections.find((candidate) => candidate.fileName === existingTest.mathSectionFileName)
    : undefined;
  const section = normalizeMathSection(
    {
      ...input,
      exportName: existingSection?.exportName || input.exportName,
      fileName: existingSection?.fileName || input.fileName,
      id: existingSection?.id || input.id,
    },
    assessment,
  );
  const mathFilePath = join(mathSetsRoot, section.fileName);
  if (existingSection) {
    const currentSource = await readFile(mathFilePath, "utf8");
    if (!section.sourceHash || hashSource(currentSource) !== section.sourceHash) {
      throw new EditorError(409, "This math file changed after it was loaded. Refresh the studio before saving.");
    }
  }
  await mkdir(mathSetsRoot, { recursive: true });
  await writeFile(mathFilePath, buildMathSource(section), "utf8");

  const test =
    existingTest ??
    {
      assessmentId,
      exportName: identifierFrom(assessmentId, "Content"),
      fileName: `${slugify(assessmentId)}.ts`,
      title: String(assessment.title ?? assessmentId),
    };
  const testFilePath = join(testsRoot, test.fileName);
  const mathImport = `import { ${section.exportName} } from ${quote(`../mathSets/${section.fileName.replace(/\.ts$/, "")}`)};`;
  let testSource;
  if (existingTest) {
    testSource = await readFile(testFilePath, "utf8");
    testSource = testSource.replace(/^import\s+.*\s+from\s+["']\.\.\/mathSets\/[^"']+["'];\r?\n/gm, "");
    testSource = `${mathImport}\n${replaceOrInsertMathSection(testSource, section.exportName)}`;
  } else {
    testSource = [
      mathImport,
      'import type { ExamContent } from "../types";',
      "",
      `export const ${test.exportName}: ExamContent = {`,
      `  assessmentId: ${quote(assessmentId)},`,
      `  title: ${quote(String(assessment.title ?? assessmentId))},`,
      `  mathSection: ${section.exportName},`,
      "  passageSets: [],",
      "};",
      "",
    ].join("\n");
  }
  await writeFile(testFilePath, testSource, "utf8");
  await ensureTestRegistration(test);

  const previousMathQuestionIds = new Set((existingSection?.questions || []).map((question) => String(question.id)));
  const updatedAssessment = {
    ...assessment,
    questions: [
      ...assessment.questions.filter((question) => !previousMathQuestionIds.has(question.id)),
      ...section.questions.map(assessmentQuestionFrom),
    ],
    updatedAt: new Date().toISOString(),
  };
  await writeFile(
    assessmentsPath,
    `${JSON.stringify(
      state.assessments.map((candidate) => (candidate.id === assessmentId ? updatedAssessment : candidate)),
      null,
      2,
    )}\n`,
    "utf8",
  );
  return {
    assessmentId,
    questionCount: section.questions.length,
    target: relativePath(mathFilePath),
  };
}

function parseTestFile(filePath, passages, mathSections) {
  return readFile(filePath, "utf8").then((source) => {
    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const environment = collectEnvironment(sourceFile);
    const exported = exportedObject(
      sourceFile,
      environment,
      (objectNode) => Boolean(objectProperty(objectNode, "assessmentId") && objectProperty(objectNode, "passageSets")),
    );
    if (!exported) throw new Error("No exported ExamContent object was found.");

    const importByIdentifier = new Map();
    const mathImportByIdentifier = new Map();
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const modulePath = statement.moduleSpecifier.text;
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      if (modulePath.startsWith("../passageSets/")) {
        for (const element of bindings.elements) importByIdentifier.set(element.name.text, modulePath);
      }
      if (modulePath.startsWith("../mathSets/")) {
        for (const element of bindings.elements) mathImportByIdentifier.set(element.name.text, modulePath);
      }
    }

    const passageSetsProperty = objectProperty(exported.initializer, "passageSets");
    const passageSetsNode = resolveNode(passageSetsProperty.initializer, environment);
    const passageIds = ts.isArrayLiteralExpression(passageSetsNode)
      ? passageSetsNode.elements.flatMap((element) => {
          const resolved = resolveNode(element, environment);
          if (!ts.isIdentifier(resolved)) return [];
          const passage = passages.find((candidate) => candidate.exportName === resolved.text);
          return passage ? [passage.id] : [];
        })
      : [];
    const passageSectionsProperty = objectProperty(exported.initializer, "passageSections");
    const passageSectionsValue = passageSectionsProperty
      ? valueFromNode(passageSectionsProperty.initializer, environment)
      : {};
    const passageSections =
      passageSectionsValue && typeof passageSectionsValue === "object" && !Array.isArray(passageSectionsValue)
        ? passageSectionsValue
        : {};
    const readingPassageIds = passageIds.filter(
      (passageId) => !passageSections[passageId] || passageSections[passageId] === "reading",
    );
    const revisingEditingPartAPassageIds = passageIds.filter(
      (passageId) =>
        passageSections[passageId] === "revising_editing_a" ||
        passageSections[passageId] === "revising_editing_b",
    );
    const standaloneSectionProperty = objectProperty(exported.initializer, "standaloneSection");
    const standaloneSectionNode = standaloneSectionProperty
      ? resolveNode(standaloneSectionProperty.initializer, environment)
      : undefined;
    const standaloneQuestionsProperty = standaloneSectionNode && ts.isObjectLiteralExpression(standaloneSectionNode)
      ? objectProperty(standaloneSectionNode, "questions")
      : undefined;
    const standaloneQuestionsNode = standaloneQuestionsProperty
      ? resolveNode(standaloneQuestionsProperty.initializer, environment)
      : undefined;
    const standaloneIdsNode =
      standaloneQuestionsNode &&
      ts.isCallExpression(standaloneQuestionsNode) &&
      standaloneQuestionsNode.arguments[0]
        ? resolveNode(standaloneQuestionsNode.arguments[0], environment)
        : undefined;
    const standaloneItemIds = standaloneIdsNode && ts.isArrayLiteralExpression(standaloneIdsNode)
      ? standaloneIdsNode.elements
          .map((element) => valueFromNode(element, environment))
          .filter((value) => typeof value === "string")
      : [];
    const mathSectionProperty = objectProperty(exported.initializer, "mathSection");
    const mathSectionNode = mathSectionProperty
      ? resolveNode(mathSectionProperty.initializer, environment)
      : undefined;
    const mathSection =
      mathSectionNode && ts.isIdentifier(mathSectionNode)
        ? mathSections.find((candidate) => candidate.exportName === mathSectionNode.text)
        : undefined;
    return {
      assessmentId: String(valueFromNode(objectProperty(exported.initializer, "assessmentId").initializer, environment)),
      exportName: exported.exportName,
      fileName: filePath.slice(testsRoot.length + 1),
      mathSectionExportName:
        mathSectionNode && ts.isIdentifier(mathSectionNode) ? mathSectionNode.text : "",
      mathSectionFileName:
        mathSection?.fileName ??
        (mathSectionNode && ts.isIdentifier(mathSectionNode)
          ? `${mathImportByIdentifier.get(mathSectionNode.text)?.replace("../mathSets/", "") ?? ""}.ts`
          : ""),
      passageIds,
      readingPassageIds,
      revisingEditingPartAPassageIds,
      sourceHash: hashSource(source),
      standaloneItemIds,
      title: String(valueFromNode(objectProperty(exported.initializer, "title").initializer, environment)),
    };
  });
}

async function listTests(passages, mathSections) {
  const entries = await readdir(testsRoot, { withFileTypes: true });
  const tests = [];
  const testErrors = [];
  for (const entry of entries.filter((candidate) => candidate.isFile() && extname(candidate.name) === ".ts")) {
    try {
      tests.push(await parseTestFile(join(testsRoot, entry.name), passages, mathSections));
    } catch (error) {
      testErrors.push({
        fileName: entry.name,
        message: error instanceof Error ? error.message : "The test could not be read.",
      });
    }
  }
  return { testErrors, tests };
}

async function readAssessments() {
  const assessments = JSON.parse(await readFile(assessmentsPath, "utf8"));
  if (!Array.isArray(assessments)) throw new EditorError(500, "The assessment registry is invalid.");
  return assessments;
}

async function listStandaloneItems() {
  const source = await readFile(standaloneItemsPath, "utf8");
  const sourceFile = ts.createSourceFile(
    standaloneItemsPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const environment = collectEnvironment(sourceFile);
  const initializer = environment.get("standaloneItems");
  const items = initializer ? valueFromNode(initializer, environment) : undefined;
  if (!Array.isArray(items)) {
    throw new EditorError(500, "The stand-alone question bank could not be read.");
  }
  return items;
}

function normalizeStandaloneItem(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new EditorError(400, "Part B question data is invalid.");
  }
  const id = slugify(requiredText(input.id, "Question ID"));
  if (!id) throw new EditorError(400, "Question ID must contain letters or numbers.");
  const promptHtml = sanitizeInlineRichText(input.promptHtml);
  const stimulusHtml = sanitizeRichText(input.stimulusHtml);
  const baseItem = {
    id,
    points: Number.isFinite(Number(input.points)) ? Math.max(1, Number(input.points)) : 1,
    prompt: requiredText(input.prompt, "Question prompt", { preserve: true }),
    ...(promptHtml ? { promptHtml } : {}),
    stimulus: requiredText(input.stimulus, "Question paragraph", { preserve: true }),
    ...(stimulusHtml ? { stimulusHtml } : {}),
    topic: requiredText(input.topic, "Question topic"),
  };

  if (input.type === "multiple_choice") {
    if (!Array.isArray(input.choices) || input.choices.length !== 4) {
      throw new EditorError(400, "Part B multiple-choice questions need exactly four answers.");
    }
    const choices = input.choices.map(normalizeChoice);
    const correctChoiceId = requiredText(input.correctChoiceId, "Correct answer").toUpperCase();
    if (!choices.some((choice) => choice.id === correctChoiceId)) {
      throw new EditorError(400, "Choose A, B, C, or D as the correct answer.");
    }
    return { ...baseItem, choices, correctChoiceId, type: "multiple_choice" };
  }

  if (input.type === "category_sort") {
    if (!Array.isArray(input.categories) || input.categories.length !== 1) {
      throw new EditorError(400, "This Part B drag-and-drop question needs exactly one answer box.");
    }
    const category = {
      id: slugify(String(input.categories[0]?.id || "answer-box")),
      title: requiredText(input.categories[0]?.title, "Answer box label"),
    };
    if (!category.id) throw new EditorError(400, "The answer box needs a valid label.");
    if (!Array.isArray(input.items) || input.items.length < 2) {
      throw new EditorError(400, "Add at least two draggable answer cards.");
    }
    const items = input.items.map((item, itemIndex) => {
      const html = sanitizeInlineRichText(item?.html);
      const itemId = slugify(String(item?.id || `answer-card-${itemIndex + 1}`));
      if (!itemId) throw new EditorError(400, `Answer card ${itemIndex + 1} needs a valid ID.`);
      return {
        ...(html ? { html } : {}),
        id: itemId,
        text: requiredText(item?.text, `Answer card ${itemIndex + 1}`, { preserve: true }),
      };
    });
    if (new Set(items.map((item) => item.id)).size !== items.length) {
      throw new EditorError(400, "Every draggable answer card needs a unique ID.");
    }
    const correctItemIds = items
      .filter((item) => String(input.correctPlacements?.[item.id] ?? "") === category.id)
      .map((item) => item.id);
    if (correctItemIds.length !== 1) {
      throw new EditorError(400, "Choose exactly one correct draggable answer card.");
    }
    return {
      ...baseItem,
      categories: [category],
      categoryCapacity: 1,
      correctPlacements: { [correctItemIds[0]]: category.id },
      instructions:
        typeof input.instructions === "string" && input.instructions.trim()
          ? input.instructions.trim()
          : "Move the answer to the box. There is only one correct answer.",
      items,
      requiredPlacements: 1,
      type: "category_sort",
    };
  }

  throw new EditorError(400, "Choose multiple choice or one-box drag and drop for this Part B question.");
}

function buildStandaloneItemsSource(items) {
  return [
    'import type { ExamQuestion } from "./types";',
    "",
    `export const standaloneItems: ExamQuestion[] = ${JSON.stringify(items, null, 2)};`,
    "",
    "export function getStandaloneItemsById(ids: string[]) {",
    "  return ids.map((id) => {",
    "    const item = standaloneItems.find((candidate) => candidate.id === id);",
    "",
    "    if (!item) {",
    "      throw new Error(`Unknown standalone item: ${id}`);",
    "    }",
    "",
    "    return item;",
    "  });",
    "}",
    "",
  ].join("\n");
}

async function saveStandaloneItem(input) {
  const source = await readFile(standaloneItemsPath, "utf8");
  if (!input?.sourceHash || input.sourceHash !== hashSource(source)) {
    throw new EditorError(409, "The Part B bank changed after it was loaded. Refresh the Studio before saving.");
  }
  const item = normalizeStandaloneItem(input.item);
  const originalId = typeof input.originalId === "string" ? input.originalId : "";
  const items = await listStandaloneItems();
  const duplicate = items.find((candidate) => candidate.id === item.id && candidate.id !== originalId);
  if (duplicate) throw new EditorError(409, `Question ID ${item.id} is already in the Part B bank.`);

  const existingIndex = originalId
    ? items.findIndex((candidate) => candidate.id === originalId)
    : -1;
  if (originalId && existingIndex < 0) {
    throw new EditorError(404, "The Part B question being edited was not found.");
  }
  const nextItems = [...items];
  if (existingIndex >= 0) nextItems[existingIndex] = item;
  else nextItems.push(item);
  const nextSource = buildStandaloneItemsSource(nextItems);
  await writeFile(standaloneItemsPath, nextSource, "utf8");
  return {
    item,
    sourceHash: hashSource(nextSource),
    target: relativePath(standaloneItemsPath),
  };
}

async function getState() {
  const { passageErrors, passages } = await listPassages();
  const { mathErrors, mathSections } = await listMathSections();
  const { testErrors, tests } = await listTests(passages, mathSections);
  const standaloneSource = await readFile(standaloneItemsPath, "utf8");
  return {
    assessments: await readAssessments(),
    editToken,
    mathErrors,
    mathSections,
    mathTopics,
    passageErrors,
    passageFormats,
    passages,
    standaloneItems: await listStandaloneItems(),
    standaloneSourceHash: hashSource(standaloneSource),
    testErrors,
    tests,
    topics,
  };
}

function replacePassageSetArray(source, passageIdentifiers) {
  const sourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const environment = collectEnvironment(sourceFile);
  const exported = exportedObject(
    sourceFile,
    environment,
    (objectNode) => Boolean(objectProperty(objectNode, "assessmentId") && objectProperty(objectNode, "passageSets")),
  );
  if (!exported) throw new EditorError(500, "The test file does not contain a recognizable ExamContent object.");
  const property = objectProperty(exported.initializer, "passageSets");
  const replacement =
    passageIdentifiers.length <= 1
      ? `[${passageIdentifiers.join(", ")}]`
      : `[\n${passageIdentifiers.map((identifier) => `    ${identifier},`).join("\n")}\n  ]`;
  return `${source.slice(0, property.initializer.getStart(sourceFile))}${replacement}${source.slice(property.initializer.getEnd())}`;
}

async function ensureTestRegistration(test) {
  let source = await readFile(examsIndexPath, "utf8");
  const importPath = `./tests/${test.fileName.replace(/\.ts$/, "")}`;
  if (!source.includes(`from ${quote(importPath)}`) && !source.includes(`from '${importPath}'`)) {
    const firstImportEnd = source.indexOf("\n") + 1;
    source = `${source.slice(0, firstImportEnd)}import { ${test.exportName} } from ${quote(importPath)};\n${source.slice(firstImportEnd)}`;
  }
  const registration = `[${test.exportName}.assessmentId]: ${test.exportName},`;
  if (!source.includes(registration)) {
    const marker = "const examContentByAssessmentId: Record<string, ExamContent> = {";
    const markerIndex = source.indexOf(marker);
    if (markerIndex < 0) throw new EditorError(500, "The exam registry map could not be found.");
    const insertionIndex = source.indexOf("\n", markerIndex) + 1;
    source = `${source.slice(0, insertionIndex)}  ${registration}\n${source.slice(insertionIndex)}`;
  }
  await writeFile(examsIndexPath, source, "utf8");
}

function assessmentQuestionFrom(question) {
  return {
    answer:
      typeof question.correctChoiceId === "string"
        ? question.correctChoiceId
        : Array.isArray(question.correctChoiceIds)
          ? question.correctChoiceIds.join(",")
          : Array.isArray(question.correctTextAnswers)
            ? question.correctTextAnswers[0] ?? ""
            : "",
    choices: Array.isArray(question.choices) ? question.choices.map((choice) => String(choice.text ?? "")) : [],
    id: String(question.id ?? ""),
    imageUrl: typeof question.image?.src === "string" ? question.image.src : "",
    points: Number.isFinite(Number(question.points)) ? Number(question.points) : 1,
    prompt: String(question.prompt ?? ""),
    topic: String(question.topic ?? "Uncategorized"),
    type: String(question.type ?? "multiple_choice"),
  };
}

async function saveTest(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new EditorError(400, "Test data is invalid.");
  const assessmentId = requiredText(input.assessmentId, "Assessment");
  const normalizeIds = (value, label) =>
    Array.isArray(value) ? value.map((id) => requiredText(id, label)) : [];
  const readingPassageIds = normalizeIds(
    input.readingPassageIds ?? input.passageIds,
    "Reading passage",
  );
  const revisingEditingPartAPassageIds = normalizeIds(
    [
      ...(Array.isArray(input.revisingEditingPartAPassageIds) ? input.revisingEditingPartAPassageIds : []),
      ...(Array.isArray(input.revisingEditingPartBPassageIds) ? input.revisingEditingPartBPassageIds : []),
    ],
    "Revising/Editing Part A passage",
  );
  const standaloneItemIds = normalizeIds(input.standaloneItemIds, "Revising/Editing Part B question");
  const passageIds = [
    ...readingPassageIds,
    ...revisingEditingPartAPassageIds,
  ];
  if (!passageIds.length && !standaloneItemIds.length) {
    throw new EditorError(400, "Add at least one English passage or Revising/Editing Part B question.");
  }
  if (new Set(passageIds).size !== passageIds.length) {
    throw new EditorError(400, "A passage can appear in only one English section.");
  }
  if (new Set(standaloneItemIds).size !== standaloneItemIds.length) {
    throw new EditorError(400, "A stand-alone question can appear only once in a test.");
  }

  const state = await getState();
  const assessment = state.assessments.find((candidate) => candidate.id === assessmentId);
  if (!assessment) throw new EditorError(404, "The selected assessment was not found.");
  const selectedPassages = passageIds.map((id) => {
    const passage = state.passages.find((candidate) => candidate.id === id);
    if (!passage) throw new EditorError(404, `Passage ${id} was not found.`);
    return passage;
  });
  const selectedStandaloneItems = standaloneItemIds.map((id) => {
    const item = state.standaloneItems.find((candidate) => candidate.id === id);
    if (!item) throw new EditorError(404, `Stand-alone question ${id} was not found.`);
    return item;
  });
  const existingTest = state.tests.find((candidate) => candidate.assessmentId === assessmentId);
  const test = existingTest ?? {
    assessmentId,
    exportName: identifierFrom(assessmentId, "Content"),
    fileName: `${slugify(assessmentId)}.ts`,
    title: String(assessment.title ?? assessmentId),
  };
  const filePath = join(testsRoot, test.fileName);
  const existingMathSection = existingTest?.mathSectionFileName
    ? state.mathSections.find((candidate) => candidate.fileName === existingTest.mathSectionFileName)
    : undefined;
  const importBlock = selectedPassages
    .map(
      (passage) =>
        `import { ${passage.exportName} } from ${quote(`../passageSets/${passage.fileName.replace(/\.ts$/, "")}`)};`,
    )
    .join("\n");
  if (existingTest) {
    const source = await readFile(filePath, "utf8");
    if (input.sourceHash && input.sourceHash !== hashSource(source)) {
      throw new EditorError(409, "This test file changed after it was loaded. Refresh the editor before saving.");
    }
  }
  const passageById = new Map(selectedPassages.map((passage) => [passage.id, passage]));
  const passageIdentifiers = passageIds.map((id) => passageById.get(id).exportName);
  const passageSections = Object.fromEntries([
    ...readingPassageIds.map((id) => [id, "reading"]),
    ...revisingEditingPartAPassageIds.map((id) => [id, "revising_editing_a"]),
  ]);
  const mathImport = existingMathSection
    ? `import { ${existingMathSection.exportName} } from ${quote(`../mathSets/${existingMathSection.fileName.replace(/\.ts$/, "")}`)};`
    : "";
  const standaloneImport = standaloneItemIds.length
    ? 'import { getStandaloneItemsById } from "../standaloneItems";'
    : "";
  const selectedStandaloneDeclaration = standaloneItemIds.length
    ? [
        `const selectedStandaloneItems = getStandaloneItemsById(${JSON.stringify(standaloneItemIds, null, 2)});`,
        "",
      ]
    : [];
  const standaloneSectionSource = standaloneItemIds.length
    ? [
        "  standaloneSection: {",
        '    id: "ela-revising-editing-part-b",',
        '    label: "ELA - Revising/Editing Part B",',
        "    questionCount: selectedStandaloneItems.length,",
        "    directions: {",
        '      subject: "English Language Arts",',
        '      title: "REVISING/EDITING PART B",',
        '      breadcrumbLabel: "ELA REV/EDIT B DIRECTIONS",',
        "      body:",
        '        "Read and answer the following stand-alone questions. You will be asked to recognize and correct errors so that the sentences or short paragraphs follow the conventions of standard written English. Reread each sentence or paragraph as needed before selecting the best answer.",',
        "    },",
        "    questions: selectedStandaloneItems,",
        "  },",
      ]
    : [];
  const nextSource = [
    importBlock,
    mathImport,
    standaloneImport,
    'import type { ExamContent } from "../types";',
    "",
    ...selectedStandaloneDeclaration,
    `export const ${test.exportName}: ExamContent = {`,
    `  assessmentId: ${quote(assessmentId)},`,
    `  title: ${quote(String(assessment.title ?? assessmentId))},`,
    ...(existingMathSection ? [`  mathSection: ${existingMathSection.exportName},`] : []),
    `  passageSections: ${JSON.stringify(passageSections, null, 2)},`,
    passageIdentifiers.length <= 1
      ? `  passageSets: [${passageIdentifiers.join(", ")}],`
      : `  passageSets: [\n${passageIdentifiers.map((identifier) => `    ${identifier},`).join("\n")}\n  ],`,
    ...standaloneSectionSource,
    "};",
    "",
  ]
    .filter((line, index, lines) => line || (index > 0 && lines[index - 1]))
    .join("\n");
  await writeFile(filePath, nextSource, "utf8");
  await ensureTestRegistration(test);

  const timestamp = new Date().toISOString();
  const readingPassages = readingPassageIds.map((id) => passageById.get(id));
  const updatedAssessment = {
    ...assessment,
    formAssignments: {},
    forms: [],
    passages: readingPassages.map((passage) => ({
      id: passage.id,
      imageUrl: "",
      text: "The complete passage is provided by the registered exam content.",
      title: passage.title,
    })),
    questions: [
      ...selectedPassages.flatMap((passage) => passage.questions.map(assessmentQuestionFrom)),
      ...selectedStandaloneItems.map(assessmentQuestionFrom),
      ...(existingMathSection?.questions || []).map(assessmentQuestionFrom),
    ],
    updatedAt: timestamp,
  };
  const updatedAssessments = state.assessments.map((candidate) =>
    candidate.id === assessmentId ? updatedAssessment : candidate,
  );
  await writeFile(assessmentsPath, `${JSON.stringify(updatedAssessments, null, 2)}\n`, "utf8");
  return {
    assessmentId,
    passageCount: passageIds.length,
    standaloneQuestionCount: standaloneItemIds.length,
    target: relativePath(filePath),
  };
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 8_000_000) throw new EditorError(413, "The pasted content is too large.");
  }
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new EditorError(400, "The request was not valid JSON.");
  }
}

function verifyEditRequest(request) {
  if (request.headers["x-editor-token"] !== editToken) {
    throw new EditorError(403, "Editor token is missing or invalid.");
  }
  const origin = request.headers.origin;
  if (origin && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) {
    throw new EditorError(403, "Only the local editor may write exam files.");
  }
}

async function handleRequest(request, response) {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      });
      response.end(await readFile(editorHtmlPath, "utf8"));
      return;
    }
    if (request.method === "GET" && url.pathname === "/app-styles.css") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/css; charset=utf-8",
      });
      response.end(await readFile(appStylesPath, "utf8"));
      return;
    }
    if (request.method === "GET" && url.pathname === "/vendor/katex.min.css") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/css; charset=utf-8",
      });
      response.end(await readFile(join(katexDistRoot, "katex.min.css")));
      return;
    }
    if (request.method === "GET" && url.pathname === "/vendor/katex.min.js") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/javascript; charset=utf-8",
      });
      response.end(await readFile(join(katexDistRoot, "katex.min.js")));
      return;
    }
    if (request.method === "GET" && url.pathname.startsWith("/vendor/fonts/")) {
      const fileName = decodeURIComponent(url.pathname.slice("/vendor/fonts/".length));
      if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) throw new EditorError(404, "Font not found.");
      const extension = extname(fileName).toLowerCase();
      const contentType = {
        ".ttf": "font/ttf",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
      }[extension];
      if (!contentType) throw new EditorError(404, "Font not found.");
      response.writeHead(200, { "Cache-Control": "public, max-age=86400", "Content-Type": contentType });
      response.end(await readFile(join(katexDistRoot, "fonts", fileName)));
      return;
    }
    if (request.method === "GET" && url.pathname.startsWith("/exam-images/")) {
      const fileName = decodeURIComponent(url.pathname.slice("/exam-images/".length));
      if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) throw new EditorError(404, "Image not found.");
      const extension = extname(fileName).toLowerCase();
      const contentType = {
        ".gif": "image/gif",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      }[extension];
      if (!contentType) throw new EditorError(404, "Image not found.");
      response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": contentType });
      response.end(await readFile(join(examImagesRoot, fileName)));
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/state") {
      sendJson(response, 200, await getState());
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/passages") {
      verifyEditRequest(request);
      sendJson(response, 201, { passage: await savePassage(await readJson(request)) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/images") {
      verifyEditRequest(request);
      sendJson(response, 201, { image: await savePassageImage(await readJson(request)) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/math-images") {
      verifyEditRequest(request);
      sendJson(response, 201, { image: await saveMathImage(await readJson(request)) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/math") {
      verifyEditRequest(request);
      sendJson(response, 201, { math: await saveMath(await readJson(request)) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/tests") {
      verifyEditRequest(request);
      sendJson(response, 201, { test: await saveTest(await readJson(request)) });
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/standalone-items") {
      verifyEditRequest(request);
      sendJson(response, 201, { standalone: await saveStandaloneItem(await readJson(request)) });
      return;
    }
    sendJson(response, 404, { message: "Not found." });
  } catch (error) {
    const status = error instanceof EditorError ? error.status : 500;
    sendJson(response, status, {
      message: error instanceof Error ? error.message : "Unexpected exam editor error.",
    });
  }
}

async function validateSetup() {
  await readFile(editorHtmlPath, "utf8");
  await readFile(appStylesPath, "utf8");
  await readFile(join(katexDistRoot, "katex.min.js"), "utf8");
  const featureFixture = normalizePassage({
    blurb: "Context above the title.",
    format: "prose",
    id: "editor-feature-validation",
    questions: [
      {
        choices: ["A", "B", "C", "D", "E"].map((id) => ({ id, text: `Choice ${id}` })),
        correctChoiceIds: ["A", "E"],
        id: "editor-feature-validation-1",
        points: 1,
        prompt: "Choose two answers.",
        promptHtml: "Choose two answers.<div>Keep this on a new line.</div>",
        topic: "Central Idea & Theme",
        type: "multi_select",
      },
      {
        categories: [
          { id: "first-box", title: "First box" },
          { id: "second-box", title: "Second box" },
        ],
        categoryCapacity: 1,
        correctPlacements: { "first-card": "first-box", "second-card": "second-box" },
        id: "editor-feature-validation-2",
        items: [
          { id: "first-card", text: "First card" },
          { id: "second-card", text: "Second card" },
          { id: "unused-card", text: "Unused distractor card" },
        ],
        points: 1,
        prompt: "Place one answer in each box.",
        topic: "Central Idea & Theme",
        type: "category_sort",
      },
      {
        categories: [
          { id: "paragraphs-1-2", title: "1-2" },
          { id: "paragraphs-7-8", title: "7-8" },
          { id: "paragraphs-9-10", title: "9-10" },
        ],
        correctPlacements: {
          calm: "paragraphs-1-2",
          worried: "paragraphs-7-8",
          wistful: "paragraphs-9-10",
        },
        id: "editor-feature-validation-3",
        items: [
          { id: "calm", text: "Calm" },
          { id: "affectionate", text: "Affectionate" },
          { id: "worried", text: "Worried" },
          { id: "jealous", text: "Jealous" },
          { id: "wistful", text: "Wistful" },
        ],
        points: 1,
        prompt: "What is the character's mood at key points?",
        tableHeaders: {
          answer: "Primary Mood",
          row: "Paragraphs",
        },
        topic: "Tone & Mood",
        type: "table_match",
      },
      {
        choices: ["A", "B", "C", "D"].map((id) => ({ id, text: `Transition ${id}` })),
        correctChoiceId: "B",
        id: "editor-feature-validation-4",
        instructions: "Move the correct answer to the box.",
        points: 1,
        prompt: "Which transition best completes the sentence?",
        topic: "Transitions & Organization",
        transitionBlankAfter: "the conclusion follows from the evidence.",
        transitionBlankBefore: "The examples support the claim;",
        transitionSentenceNumber: "(5)",
        type: "transition_drop",
      },
    ],
    text: "Validation passage text.",
    title: "Validation Passage",
  });
  const featureSource = buildPassageSource(featureFixture);
  if (
    featureFixture.questions[0].choices.length !== 5 ||
    featureFixture.questions[0].correctChoiceIds.at(-1) !== "E" ||
    featureFixture.questions[0].instructions !== undefined ||
    featureFixture.questions[0].promptHtml !== "Choose two answers.<br>Keep this on a new line." ||
    featureFixture.questions[1].categoryCapacity !== 1 ||
    featureFixture.questions[1].items.length !== 3 ||
    featureFixture.questions[1].requiredPlacements !== 2 ||
    featureFixture.questions[2].type !== "table_match" ||
    featureFixture.questions[2].categoryCapacity !== 1 ||
    featureFixture.questions[2].requiredPlacements !== 3 ||
    featureFixture.questions[2].tableHeaders.answer !== "Primary Mood" ||
    featureFixture.questions[3].type !== "transition_drop" ||
    featureFixture.questions[3].correctChoiceId !== "B" ||
    featureFixture.questions[3].transitionSentenceNumber !== "(5)" ||
    !featureSource.includes('blurb: "Context above the title."')
  ) {
    throw new Error("Exam editor feature validation failed.");
  }
  const mathFixture = normalizeMathSection(
    {
      assessmentId: "math-editor-validation",
      questions: [
        {
          choices: [
            { id: "A", math: "\\frac{1}{2}", text: "one half" },
            { html: "<em>2</em>", id: "B", text: "2" },
          ],
          correctChoiceId: "A",
          id: "math-editor-validation-1",
          instructions: "Choose one answer.",
          instructionsHtml: "Choose <em>one</em> answer.",
          points: 1,
          prompt: "Which value equals \\(\\frac{1}{2}\\)?\nUse the choices below.",
          promptHtml: "Which <strong>value</strong> equals \\(\\frac{1}{2}\\)?<div>Use the choices below.</div>",
          topic: "Number Sense",
          type: "multiple_choice",
        },
        {
          correctTextAnswers: ["12", "twelve"],
          id: "math-editor-validation-2",
          image: {
            alt: "A sample math diagram",
            src: "/exam-images/sample.png",
          },
          points: 1,
          prompt: "Write the answer.",
          topic: "Arithmetic",
          type: "short_response",
        },
        {
          dropdownContent: [
            "The relationship is \\(L\\) = {{relationship}} \\(K\\).",
            "Liam started with {{startingAmount}} stamps.",
          ],
          dropdowns: [
            {
              correctChoiceId: "2",
              id: "relationship",
              options: [
                { id: "1/2", text: "1/2" },
                { id: "2", text: "2" },
              ],
            },
            {
              correctChoiceId: "56",
              id: "startingAmount",
              options: [
                { id: "40", text: "40" },
                { id: "56", text: "56" },
              ],
            },
          ],
          id: "math-editor-validation-3",
          instructions: "Select the correct answer from each drop-down.",
          points: 1,
          prompt: "Complete each sentence.",
          topic: "Algebra",
          type: "inline_dropdown",
        },
      ],
    },
    { id: "math-editor-validation" },
  );
  const mathSource = buildMathSource(mathFixture);
  if (
    mathFixture.questions.length !== 3 ||
    mathFixture.questions[0].choices[0].math !== "\\frac{1}{2}" ||
    mathFixture.questions[0].choices[1].html !== "<em>2</em>" ||
    mathFixture.questions[0].instructionsHtml !== "Choose <em>one</em> answer." ||
    !mathFixture.questions[0].promptHtml.includes("<strong>value</strong>") ||
    mathFixture.questions[1].correctTextAnswers.length !== 2 ||
    mathFixture.questions[2].dropdowns[0].correctChoiceId !== "2" ||
    !mathFixture.questions[2].dropdownContent[0].includes("{{relationship}}") ||
    !mathSource.includes("ExamMathSection")
  ) {
    throw new Error("Math editor feature validation failed.");
  }
  const standaloneDragFixture = normalizeStandaloneItem({
    categories: [{ id: "construction-error", title: "Contains an error in construction" }],
    correctPlacements: { "sentence-4": "construction-error" },
    id: "standalone-drag-validation",
    instructions: "Move the answer to the box. There is only one error in construction.",
    items: [1, 2, 3, 4].map((number) => ({ id: `sentence-${number}`, text: `Sentence ${number}` })),
    points: 1,
    prompt: "Which sentence contains an error in construction?",
    stimulus: "(1) First sentence. (2) Second sentence. (3) Third sentence. (4) Fourth sentence.",
    topic: "Sentence Construction",
    type: "category_sort",
  });
  if (
    standaloneDragFixture.type !== "category_sort" ||
    standaloneDragFixture.categories.length !== 1 ||
    standaloneDragFixture.correctPlacements["sentence-4"] !== "construction-error" ||
    standaloneDragFixture.requiredPlacements !== 1
  ) {
    throw new Error("Part B drag-and-drop validation failed.");
  }
  const state = await getState();
  if (state.passageErrors.length || state.mathErrors.length || state.testErrors.length) {
    const errors = [...state.passageErrors, ...state.mathErrors, ...state.testErrors]
      .map((error) => `${error.fileName}: ${error.message}`)
      .join("\n");
    throw new Error(`Exam editor could not read every source file:\n${errors}`);
  }
  const diagnosticTest = state.tests.find((test) => test.assessmentId === "shsat-diagnostic-1");
  if (
    state.standaloneItems.length < 4 ||
    !state.standaloneSourceHash ||
    !state.standaloneItems.some(
      (item) =>
        item.id === "standalone-pangaea-sentence-structure-1" &&
        item.type === "multiple_choice" &&
        item.correctChoiceId === "A",
    ) ||
    diagnosticTest?.standaloneItemIds.length !== 3 ||
    diagnosticTest.readingPassageIds.length !== diagnosticTest.passageIds.length
  ) {
    throw new Error("English section and stand-alone bank validation failed.");
  }
  console.log(
    `Exam editor validated ${state.passages.length} passages, ${state.mathSections.length} math sections, ${state.tests.length} tests, and ${state.assessments.length} assessments.`,
  );
}

if (process.argv.includes("--validate")) {
  await validateSetup();
  process.exit(0);
}

const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
const port = portArgument ? Number(portArgument.slice("--port=".length)) : 4319;
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error("Use a port between 1024 and 65535.");
}

const server = createServer(handleRequest);
server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Exam Content Studio is running at ${url}`);
  console.log("Press Ctrl+C when you are finished.");
  if (process.argv.includes("--no-open")) return;
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  }
});
