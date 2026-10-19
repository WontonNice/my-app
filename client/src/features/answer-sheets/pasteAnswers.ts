import { validateResponse, type SheetItem } from "../../../../server/src/shared/answerSheets";
import type { Change } from "./api";

function columnCells(text: string): string[] {
  const cells: string[] = []; let cell = "", quoted = false, closed = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index++; }
      else if (character === '"') { quoted = false; closed = true; }
      else cell += character;
    } else if (character === "\t") throw new Error("Copy one answer column, without question numbers or extra columns.");
    else if (character === "\n") { cells.push(cell); cell = ""; closed = false; }
    else if (character === '"' && !cell && !closed) quoted = true;
    else { if (closed) throw new Error("The pasted column has an invalid quoted cell. Check it before applying."); cell += character; }
  }
  if (quoted) throw new Error("A quoted spreadsheet cell is incomplete. Copy the whole cell, or paste directly into its answer field.");
  if (cell || !text.endsWith("\n")) cells.push(cell);
  return cells;
}

/** Explicit one-column TSV paste. Quoted multiline cells retain their full contents. */
export function parseAnswerColumn(items: SheetItem[], text: string): { changes: Change[]; errors: string[] } {
  const changes: Change[] = [], errors: string[] = [];
  let lines: string[];
  try { lines = columnCells(text.replaceAll("\r\n", "\n").replaceAll("\r", "\n")); }
  catch (error) { return { changes, errors: [(error as Error).message] }; }
  if (lines.length > items.length) return { changes, errors: [`You pasted ${lines.length} rows, but this section has ${items.length} questions.`] };
  lines.forEach((line, index) => {
    const item = items[index];
    const option = (label: string) => item.options.find(option => option.label.toLocaleLowerCase() === label.trim().toLocaleLowerCase());
    const answer = item.type === "short_response" ? line : item.type === "multi_select" ? line.trim() ? line.split(/[,;\s]+/).filter(Boolean).map(label => option(label)?.id ?? label) : [] : line.trim() ? option(line)?.id ?? line : "";
    try { changes.push({ itemId: item.id, answer: validateResponse(item, answer) }); }
    catch { errors.push(`Question ${item.number}: ${item.type === "short_response" ? "answer exceeds 10,000 characters" : `use ${item.options.map(option => option.label).join(", ")}`}.`); }
  });
  return { changes, errors };
}
