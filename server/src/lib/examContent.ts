import fs from "node:fs";
import path from "node:path";
import type { ExamContent } from "../shared/examTypes";

const filename = path.resolve(__dirname, "../../data/exam-content.json");
let cached: { mtimeMs: number; size: number; contents: Record<string, ExamContent> } | undefined;
let released: {mtimeMs:number;size:number;contents:Record<string,{activityId:string;content:ExamContent}>}|undefined;
export function getActivityRelease(assessmentId:string,releaseId:string):ExamContent|null {
    const file=path.resolve(__dirname,'../../data/activity-releases.json'),stat=fs.statSync(file);
    if(!released||released.mtimeMs!==stat.mtimeMs||released.size!==stat.size)released={mtimeMs:stat.mtimeMs,size:stat.size,contents:JSON.parse(fs.readFileSync(file,'utf8'))};
    const entry=released.contents[releaseId];
    return entry?.activityId===assessmentId?structuredClone(entry.content):null;
}

export function getExamContent(assessmentId: string): ExamContent | null {
    // Only authored content is cached. Student responses and authorization are not.
    // Exporting a changed catalog invalidates the cache on the next lookup.
    const stat = fs.statSync(filename);
    if (!cached || cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
        cached = { mtimeMs: stat.mtimeMs, size: stat.size, contents: JSON.parse(fs.readFileSync(filename, "utf8")) as Record<string, ExamContent> };
    }
    const content = cached.contents[assessmentId];
    return content ? structuredClone(content) : null;
}
