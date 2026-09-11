import fs from "node:fs";
import path from "node:path";
import type { ExamContent } from "../shared/examTypes";

export function getExamContent(assessmentId: string): ExamContent | null {
    const contents = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/exam-content.json"), "utf8")) as Record<string, ExamContent>;
    return contents[assessmentId] ?? null;
}
