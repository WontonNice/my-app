import { readCachedJson } from "./cachedJson";
import path from "node:path";
import type { QuestionBank } from "../shared/questionBank";

export function readQuestionBank(): QuestionBank {
  return readCachedJson<QuestionBank>(path.resolve(__dirname, "../../data/question-bank.json"));
}
export function libraryContentKind(id: string): "practice" | "passage" {
  return readQuestionBank().sets.some(set => set.id === id) ? "practice" : "passage";
}
