import ts from "typescript";
import { readFileSync } from "node:fs";

export const passageCategories = JSON.parse(readFileSync(new URL("../server/src/shared/passage-category-options.json", import.meta.url), "utf8"));
export function normalizePassageCategory(value) {
  if (value == null || value === "") return "miscellaneous";
  if (!passageCategories.some(category => category.value === value)) throw new Error("Choose a valid Passage Category.");
  return value;
}

/** Change only the formatter's metadata, retaining every other source byte. */
export function patchPassageCategory(source, value) {
  const category = normalizePassageCategory(value);
  const file = ts.createSourceFile("passage.ts", source, ts.ScriptTarget.Latest, true);
  const inputs = [];
  function visit(node) {
    if (ts.isCallExpression(node) && /^(createPlainTextPassage|createProsePassage|createSentenceNumberedPassage)$/.test(node.expression.getText(file)) && node.arguments[0] && ts.isObjectLiteralExpression(node.arguments[0])) inputs.push(node.arguments[0]);
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (inputs.length !== 1) throw new Error("Cannot safely locate a single passage formatter. Edit this passage individually.");
  const input = inputs[0];
  const property = input.properties.find(property => property.name?.getText(file).replace(/["']/g, "") === "passageCategory");
  if (property) {
    if (!ts.isPropertyAssignment(property)) throw new Error("Cannot safely edit the passage category expression.");
    return source.slice(0, property.initializer.getStart(file)) + JSON.stringify(category) + source.slice(property.initializer.end);
  }
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const indent = source.slice(0, input.getStart(file)).split(/\r?\n/).at(-1).match(/^\s*/)[0];
  return source.slice(0, input.getStart(file) + 1) + `${newline}${indent}  passageCategory: ${JSON.stringify(category)},` + source.slice(input.getStart(file) + 1);
}
