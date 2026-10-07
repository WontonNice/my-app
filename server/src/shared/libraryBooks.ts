import type { ExamPassage, ExamPassageSet, ExamQuestion } from "./examTypes";
import { isExamQuestionCorrect, type SelectedAnswer } from "./examGrading";

export type PassageBook = { id: string; passageSet: ExamPassageSet; versions: { id: string; label: string; category?: ExamPassage["passageCategory"] }[]; questionPassages: Record<string, ExamPassage> };
function text(value: string) {
  return value.normalize("NFKC").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
}
function presentation(value: unknown): unknown {
  if (typeof value === "string") return text(value);
  if (Array.isArray(value)) return value.map(presentation);
  if (!value || typeof value !== "object") return value;
  const item = value as Record<string, unknown>;
  const htmlText = (value: unknown) => typeof value === "string" ? text(value.replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, " [image:$1] ").replace(/<[^>]+>/g, " ")) : value;
  return Object.fromEntries(Object.keys(item).sort().filter(key => {
    if (item[key] === undefined) return false;
    const base = key === "html" ? "text" : key.endsWith("Html") ? key.slice(0, -4) : "";
    return !base || !item[base] || presentation(item[base]) !== htmlText(item[key]);
  }).map(key => [key, key === "html" || key.endsWith("Html") ? htmlText(item[key]) : presentation(item[key])]));
}
export function libraryQuestionKey(question: ExamQuestion) {
  const item = { ...question } as Record<string, unknown>;
  for (const key of ["id", "topic", "points", "explanation", "explanationHtml"]) delete item[key];
  if (question.choices) {
    const choices = new Map(question.choices.map(choice => { const { id, ...content } = choice; return [id, JSON.stringify(presentation(content))]; }));
    item.choices = [...choices.values()].sort();
    if (question.correctChoiceId) item.correctChoiceId = choices.get(question.correctChoiceId);
    if (question.correctChoiceIds) item.correctChoiceIds = question.correctChoiceIds.map(id => choices.get(id)).sort();
  }
  return JSON.stringify(presentation(item));
}
/** Library books combine versions; assessment sets and their IDs stay intact. */
export function groupPassageBooks(sets: ExamPassageSet[]): PassageBook[] {
  const groups = new Map<string, ExamPassageSet[]>();
  for (const set of sets) {
    const author = set.passage.lines.find(line => line.kind === "byline")?.text ?? "";
    const key = `${text(set.passage.title).toLowerCase()}|${text(author).toLowerCase().replace(/\s*-\s*/g, "-")}`;
    const group = groups.get(key) ?? []; group.push(set); groups.set(key, group);
  }
  return [...groups.values()].map(versions => {
    const first = versions[0], id = versions.length > 1 ? `book-${first.passage.id}` : first.passage.id;
    const seen = new Set<string>(), questions: ExamQuestion[] = [], questionPassages: Record<string, ExamPassage> = {};
    for (const version of versions) for (const question of version.questions) {
      const key = libraryQuestionKey(question); if (seen.has(key)) continue;
      let questionId = question.id;
      if (questionPassages[questionId]) questionId = `${question.id}::${version.passage.id}`;
      while (questionPassages[questionId]) questionId += "-copy";
      seen.add(key); questions.push(questionId === question.id ? question : { ...question, id: questionId }); questionPassages[questionId] = version.passage;
    }
    return { id, passageSet: { ...first, id, passage: { ...first.passage, id }, questions, questionCount: questions.length }, versions: versions.map(version => ({ id: version.passage.id, label: version.passage.versionLabel || version.passage.title, category: version.passage.passageCategory })), questionPassages };
  });
}
export function libraryAnswer(value: string): SelectedAnswer {
  if (value.startsWith("{") || value.startsWith("[")) { try { return JSON.parse(value) as SelectedAnswer; } catch { return ""; } }
  return value;
}
export function libraryQuestionAnswered(question: ExamQuestion, value: string) {
  const answer = libraryAnswer(value);
  if (typeof answer === "string") return Boolean(answer.trim());
  if (Array.isArray(answer)) return answer.length === (question.requiredSelections || question.correctChoiceIds?.length || question.correctPointIds?.length || 1);
  if (!answer || typeof answer !== "object") return false;
  if (question.type === "inline_dropdown") return Boolean(question.dropdowns?.every(menu => answer[menu.id]));
  if (question.type === "math_drag_drop") return Boolean(question.dragDropSlots?.every(slot => answer[slot.id]));
  if (question.type === "number_line_response") return Boolean(typeof answer.value === "string" && answer.value.trim() && answer.direction && answer.endpoint);
  return Object.keys(answer).length === (question.requiredPlacements || Object.keys(question.correctPlacements ?? {}).length);
}
export function libraryCorrectAnswer(question: ExamQuestion): SelectedAnswer {
  if (question.correctChoiceId) return question.correctChoiceId;
  if (question.correctChoiceIds || question.correctPointIds) return question.correctChoiceIds || question.correctPointIds!;
  if (question.correctPlacements) return question.correctPlacements;
  if (question.correctTextAnswers) return question.correctTextAnswers.join(" or ");
  if (question.dropdowns) return Object.fromEntries(question.dropdowns.map(menu => [menu.id, menu.correctChoiceId || ""]));
  if (question.dragDropSlots) return Object.fromEntries(question.dragDropSlots.map(slot => [slot.id, slot.correctItemId]));
  if (question.numberLineResponse) return { value: String(question.numberLineResponse.correctValue), direction: question.numberLineResponse.correctDirection, endpoint: question.numberLineResponse.correctEndpoint };
  return "";
}
export function gradeLibraryBook(book: PassageBook, input: unknown) {
  if (!Array.isArray(input) || input.length !== book.passageSet.questions.length || new Set(input.map(row => row?.questionId)).size !== input.length) throw new Error("Complete every unique question in this book.");
  return book.passageSet.questions.map((question, index) => {
    const row = input.find(row => row?.questionId === question.id);
    if (!row || typeof row.selectedAnswerId !== "string" || !libraryQuestionAnswered(question, row.selectedAnswerId)) throw new Error("Answer every question in this book.");
    const answer = libraryAnswer(row.selectedAnswerId);
    if (["multiple_choice", "transition_drop"].includes(question.type) && !question.choices?.some(choice => choice.id === answer)) throw new Error("Choose an included answer.");
    if (question.type === "multi_select" && (!Array.isArray(answer) || new Set(answer).size !== answer.length || answer.some(id => !question.choices?.some(choice => choice.id === id)))) throw new Error("Choose included answers.");
    const correct = libraryCorrectAnswer(question);
    return { questionId: question.id, questionNumber: index + 1, selectedAnswerId: row.selectedAnswerId, correctAnswerId: typeof correct === "string" ? correct : JSON.stringify(correct), isCorrect: isExamQuestionCorrect(question, answer), timeSpentSeconds: typeof row.timeSpentSeconds === "number" && Number.isFinite(row.timeSpentSeconds) ? Math.max(0, Math.min(86400, Math.round(row.timeSpentSeconds))) : 0 };
  });
}
