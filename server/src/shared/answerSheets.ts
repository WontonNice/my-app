import { isExamQuestionCorrect, type SelectedAnswer, type SelectedAnswers } from "./examGrading";
import type { ExamContent, ExamQuestion } from "./examTypes";

export const answerSheetPrefix = "answer-sheet:";
export type SheetItem = { id: string; number: string; type: "multiple_choice" | "multi_select" | "short_response"; options: { id: string; label: string }[]; minSelections?: number; maxSelections?: number; multiline?: boolean };
export type SheetSection = { id: string; title: string; subject: "english" | "math" | "other"; items: SheetItem[] };
export type SheetStructure = { id: string; title: string; sourceVersion: string; instructions: string; sourceUrl: string; allowUnanswered: boolean; sections: SheetSection[] };
export type SheetKey = { points: number; mode: "automatic" | "manual" | "exact" | "normalized"; answer?: SelectedAnswer; accepted?: string[] };
export type SheetMapping = { itemId: string; questionId: string; optionMap: Record<string, string> };
export type AnswerSheet = SheetStructure & { ownerId: string; revision: number; issued: boolean; createdAt: string; keys: Record<string, SheetKey>; keyVersion: number; keyHistory: { version: number; at: string; actor: string; keys: Record<string, SheetKey> }[]; mapping?: { assessmentId: string; sourceVersion: string; items: SheetMapping[]; at: string; actor: string; contentSnapshot?: ExamContent }; mappingHistory?: { assessmentId: string; at: string; actor: string; items: SheetMapping[] }[] };
export type SheetSubmission = { id: string; at: string; answers: SelectedAnswers; flags: string[] };
export type SheetAttempt = { id: string; assignmentId: string; studentId: string; sheet: SheetStructure; revision: number; answers: SelectedAnswers; responseRevisions: Record<string, number>; flags: string[]; sectionId: string; savedAt: string; startedAt: string; status: "in_progress" | "submitted"; submissions: SheetSubmission[]; events: { at: string; action: string; actor: string }[]; lease: { sessionId: string; expiresAt: string }; mutations: string[] };
export type SheetGrade = { submissionId: string; keyVersion: number; gradedAt: string; actor: string; items: { itemId: string; status: "unanswered" | "correct" | "incorrect" | "pending"; earned: number | null; possible: number; key?: SheetKey }[]; pending: number; earned: number | null; possible: number };
export const sheetItems = (sheet: SheetStructure) => sheet.sections.flatMap(section => section.items);
export const sheetError = (message: string, status = 400) => Object.assign(new Error(message), { status });
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, max: number) => typeof value === "string" && value.length <= max ? value : (() => { throw sheetError(`Text must be at most ${max} characters.`); })();
export function validateSheet(value: unknown): SheetStructure {
  if (!record(value)) throw sheetError("A sheet is required.");
  const title = text(value.title, 200).trim();
  if (!title || !Array.isArray(value.sections) || !value.sections.length || value.sections.length > 20) throw sheetError("Enter a title and 1–20 sections.");
  const ids = new Set<string>();
  const identity = (id: unknown) => { if (typeof id !== "string" || !/^[\w-]{1,100}$/.test(id) || ["__proto__", "constructor", "prototype"].includes(id) || ids.has(id)) throw sheetError("Every section, question, and option needs a distinct stable identity."); ids.add(id); return id; };
  const sections = value.sections.map(raw => {
    if (!record(raw) || !Array.isArray(raw.items) || !raw.items.length) throw sheetError("Each section needs questions.");
    const section: SheetSection = { id: identity(raw.id), title: text(raw.title, 120).trim(), subject: raw.subject === "english" || raw.subject === "math" ? raw.subject : "other", items: [] };
    if (!section.title) throw sheetError("Each section needs a title.");
    const numbers = new Set<string>();
    section.items = raw.items.map(entry => {
      if (!record(entry) || !["multiple_choice", "multi_select", "short_response"].includes(String(entry.type))) throw sheetError("Choose a supported response type.");
      const item: SheetItem = { id: identity(entry.id), number: text(entry.number, 30).trim(), type: entry.type as SheetItem["type"], options: [], multiline: Boolean(entry.multiline) };
      if (!item.number || numbers.has(item.number)) throw sheetError("Question numbers must be unique within each section."); numbers.add(item.number);
      if (item.type !== "short_response") {
        if (!Array.isArray(entry.options) || entry.options.length < 2 || entry.options.length > 12) throw sheetError("Choose 2–12 option labels.");
        const labels = new Set<string>();
        item.options = entry.options.map(option => { if (!record(option)) throw sheetError("Invalid option."); const label = text(option.label, 20).trim(); if (!label || labels.has(label)) throw sheetError("Option labels must be distinct."); labels.add(label); return { id: identity(option.id), label }; });
      }
      if (item.type === "multi_select") {
        item.minSelections = entry.minSelections === undefined ? 1 : Number(entry.minSelections);
        item.maxSelections = entry.maxSelections === undefined ? item.options.length : Number(entry.maxSelections);
        if (!Number.isInteger(item.minSelections) || !Number.isInteger(item.maxSelections) || item.minSelections < 1 || item.maxSelections < item.minSelections || item.maxSelections > item.options.length) throw sheetError("Invalid multiple-selection requirements.");
      }
      return item;
    });
    return section;
  });
  if (sections.reduce((sum, section) => sum + section.items.length, 0) > 500) throw sheetError("A sheet supports up to 500 questions.");
  const sourceUrl = text(value.sourceUrl ?? "", 2000).trim();
  if (sourceUrl) { let url: URL; try { url = new URL(sourceUrl); } catch { throw sheetError("Use an http/https source link."); } if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw sheetError("Use an http/https source link without credentials."); }
  return { id: String(value.id ?? ""), title, sourceVersion: text(value.sourceVersion ?? "", 200), instructions: text(value.instructions ?? "", 8000), sourceUrl, allowUnanswered: value.allowUnanswered !== false, sections };
}
export function publicSheet(sheet: SheetStructure): SheetStructure {
  return { id: sheet.id, title: sheet.title, sourceVersion: sheet.sourceVersion, instructions: sheet.instructions, sourceUrl: sheet.sourceUrl, allowUnanswered: sheet.allowUnanswered, sections: sheet.sections };
}
export function validateResponse(item: SheetItem, value: unknown): SelectedAnswer {
  if (item.type === "short_response") return text(value, 10000); // Never normalize the stored text.
  const ids = new Set(item.options.map(option => option.id));
  if (item.type === "multiple_choice") { if (typeof value !== "string" || value !== "" && !ids.has(value)) throw sheetError("Choose a configured option."); return value; }
  if (!Array.isArray(value) || value.some(id => typeof id !== "string" || !ids.has(id)) || new Set(value).size !== value.length) throw sheetError("Choose distinct configured options.");
  return value as string[]; // Partial selections are valid saved drafts.
}
export function responseState(item: SheetItem, answer: SelectedAnswer | undefined): "unanswered" | "answered" | "attention" {
  if (answer === undefined || typeof answer === "string" && !answer.trim() || Array.isArray(answer) && !answer.length) return "unanswered";
  if (item.type === "multi_select" && Array.isArray(answer) && (answer.length < (item.minSelections ?? 1) || answer.length > (item.maxSelections ?? item.options.length))) return "attention";
  return "answered";
}
export function sheetCounts(sheet: SheetStructure, answers: SelectedAnswers, flags: string[]) {
  const counts = { answered: 0, unanswered: 0, attention: 0, flagged: flags.length };
  sheetItems(sheet).forEach(item => counts[responseState(item, answers[item.id])]++);
  return counts;
}
export function validateKeys(sheet: SheetStructure, value: unknown): Record<string, SheetKey> {
  if (!record(value)) throw sheetError("A key object is required.");
  const result: Record<string, SheetKey> = {};
  for (const [id, raw] of Object.entries(value)) {
    const item = sheetItems(sheet).find(item => item.id === id);
    if (!item || !record(raw) || typeof raw.points !== "number" || raw.points <= 0 || raw.points > 100) throw sheetError("Each keyed item needs 0–100 positive points.");
    const key: SheetKey = { points: raw.points, mode: raw.mode as SheetKey["mode"] };
    if (key.mode === "manual") { result[id] = key; continue; }
    if (item.type === "short_response") {
      if (!["exact", "normalized"].includes(key.mode) || !Array.isArray(raw.accepted) || !raw.accepted.length || raw.accepted.length > 20) throw sheetError("Short answers need manual grading or explicit accepted responses.");
      key.accepted = raw.accepted.map(value => text(value, 2000));
      if (key.accepted.some(value => !value.trim())) throw sheetError("Accepted answers cannot be blank.");
    } else {
      if (key.mode !== "automatic") throw sheetError("Choice keys use exact matching.");
      key.answer = validateResponse(item, raw.answer);
      if (responseState(item, key.answer) !== "answered") throw sheetError("The keyed selection must meet this item's requirements.");
    }
    result[id] = key;
  }
  return result;
}
export function gradeSheet(sheet: AnswerSheet, submission: SheetSubmission, manual: Record<string, number>, actor: string, at: string): SheetGrade {
  for (const id of Object.keys(manual)) if (!sheetItems(sheet).some(item => item.id === id)) throw sheetError("Unknown manual grade item.");
  const items: SheetGrade["items"] = sheetItems(sheet).map(item => {
    const key = sheet.keys[item.id], answer = submission.answers[item.id], blank = responseState(item, answer) === "unanswered", possible = key?.points ?? 1;
    let earned: number | null = null;
    if (manual[item.id] !== undefined) { if (!key || key.mode !== "manual" || !Number.isFinite(manual[item.id]) || manual[item.id] < 0 || manual[item.id] > possible) throw sheetError("Manual points must match a manual key and be within the possible points."); earned = manual[item.id]; }
    else if (key && key.mode !== "manual") {
      const question = { id: item.id, type: item.type, topic: "", prompt: "", correctChoiceId: typeof key.answer === "string" ? key.answer : undefined, correctChoiceIds: Array.isArray(key.answer) ? key.answer : undefined } as ExamQuestion;
      const correct = isExamQuestionCorrect(item.type === "short_response" ? { ...question, correctTextAnswers: key.accepted, textMatchMode: key.mode as "exact" | "normalized" } : question, answer);
      earned = correct ? possible : 0;
    }
    return { itemId: item.id, status: earned === null ? "pending" : blank ? "unanswered" : earned === possible ? "correct" : "incorrect", earned, possible, key };
  });
  const pending = items.filter(item => item.earned === null).length;
  return { submissionId: submission.id, keyVersion: sheet.keyVersion, gradedAt: at, actor, items, pending, possible: items.reduce((sum, item) => sum + item.possible, 0), earned: pending ? null : items.reduce((sum, item) => sum + (item.earned ?? 0), 0) };
}
