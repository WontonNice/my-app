import type { ExamQuestion } from "../content/exams";
import type { SelectedAnswer, SelectedAnswers } from "./examResults";
import type { ReviewQuestion } from "../../../server/src/shared/examCorrections";

export function formatAnswerCell(answer: SelectedAnswer | undefined): string {
  if (typeof answer === "string") return answer;
  if (Array.isArray(answer)) return answer.join(", ");
  return answer ? Object.entries(answer).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join("; ") : "";
}

export function answerCellHint(question: ExamQuestion): string {
  if (question.type === "number_line_response") return "value=2; direction=right; endpoint=closed";
  if (question.dropdowns?.length) return question.dropdowns.map(menu => `${menu.id}=${menu.options.map(option => option.id).join("/")}`).join("; ");
  if (question.dragDropSlots?.length) return question.dragDropSlots.map(slot => `${slot.id}=${question.items?.map(item => item.id).join("/")}`).join("; ");
  if (question.categories?.length) return question.items?.map(item => `${item.id}=${question.categories?.map(category => category.id).join("/")}`).join("; ") || "";
  if (question.type === "graph_point_select") return question.graph?.points.map(point => `${point.id} (${point.x}, ${point.y})`).join(" · ") || "Point IDs separated by commas";
  if (question.choices?.length) return `${question.choices.map(choice => choice.id).join(" / ")}${question.type === "multi_select" ? " · separate selections with commas" : ""}`;
  return "Type the student's response; leave empty for blank";
}

export function parseAnswerCell(question: ExamQuestion, raw: string): SelectedAnswer {
  const text = raw.trim();
  const structured = ["inline_dropdown", "category_sort", "matrix_choice", "table_match", "math_drag_drop", "number_line_response"].includes(question.type);
  const multiple = ["multi_select", "graph_point_select"].includes(question.type);
  if (!text || text === "—" || text === "-") return structured ? {} : multiple ? [] : "";
  function option(value: string, ids: string[], normalizePaperChoice = false) {
    const label = value.trim().toLowerCase();
    const normalized = normalizePaperChoice && /^[e-h]$/.test(label) ? String.fromCharCode(label.charCodeAt(0) - 4) : label;
    const found = ids.find(id => id.toLowerCase() === label) ?? ids.find(id => id.toLowerCase() === normalized);
    if (!found) throw new Error(`Use ${ids.join(", ")} or leave blank.`);
    return found;
  }
  if (multiple) {
    const ids = question.type === "graph_point_select" ? question.graph?.points.map(point => point.id) || [] : question.choices?.map(choice => choice.id) || [];
    const values = text.split(/[,\s]+/).filter(Boolean).map(value => option(value, ids, question.type === "multi_select"));
    if (new Set(values).size !== values.length) throw new Error("Enter each selection once.");
    return values;
  }
  if (["multiple_choice", "transition_drop"].includes(question.type)) return option(text, question.choices?.map(choice => choice.id) || [], true);
  if (structured) {
    const fields: { id: string; options?: string[] }[] = question.type === "number_line_response"
      ? [{ id: "value" }, { id: "direction", options: ["left", "right"] }, { id: "endpoint", options: ["open", "closed"] }]
      : question.type === "inline_dropdown" ? (question.dropdowns || []).map(menu => ({ id: menu.id, options: menu.options.map(option => option.id) }))
      : question.type === "math_drag_drop" ? (question.dragDropSlots || []).map(slot => ({ id: slot.id, options: question.items?.map(item => item.id) || [] }))
      : (question.items || []).map(item => ({ id: item.id, options: question.categories?.map(category => category.id) || [] }));
    const result: Record<string, string> = {};
    for (const pair of text.split(";")) {
      const [key, value, ...extra] = pair.split("=");
      const field = fields.find(field => field.id.toLowerCase() === key.trim().toLowerCase());
      if (!field || value === undefined || extra.length || Object.hasOwn(result, field.id)) throw new Error(`Use ${answerCellHint(question)}.`);
      if (value.trim()) result[field.id] = field.options ? option(value, field.options) : value.trim();
    }
    return result;
  }
  return text;
}

// Validate the entire paste first: an invalid row never partially replaces answers.
export function pasteAnswerCells(items: ReviewQuestion[], start: number, source: string): SelectedAnswers {
  const rows = source.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n").map(row => row.split("\t"));
  const numbered = rows.every(row => row.length === 2 && /^\d+$/.test(row[0].trim()));
  const cells = numbered ? rows.map(row => row[1]) : rows.every(row => row.length === 1) ? rows.map(row => row[0]) : rows.length === 1 ? rows[0] : null;
  if (!cells) throw new Error("Paste one answer column, or two columns containing question number and answer.");
  if (start < 0 || start + cells.length > items.length) throw new Error("The pasted answers extend past the last question. Start earlier or paste fewer rows.");
  return Object.fromEntries(cells.map((cell, offset) => {
    const item = items[start + offset];
    if (numbered && Number(rows[offset][0]) !== item.number) throw new Error(`Pasted question ${rows[offset][0]} does not match ${item.section} question ${item.number}.`);
    try { return [item.question.id, parseAnswerCell(item.question, cell)]; }
    catch (reason) { throw new Error(`${item.section === "math" ? "Math" : "English"} question ${item.number}: ${(reason as Error).message}`); }
  }));
}
