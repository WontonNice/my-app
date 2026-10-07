import fs from "node:fs";
import path from "node:path";
import type { QuestionBank } from "../shared/questionBank";

export function readQuestionBank(): QuestionBank {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/question-bank.json"), "utf8")) as QuestionBank;
}
export function libraryContentKind(id: string): "practice" | "passage" {
  return readQuestionBank().sets.some(set => set.id === id) ? "practice" : "passage";
}
