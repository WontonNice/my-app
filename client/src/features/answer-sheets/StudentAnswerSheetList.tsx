import { useEffect, useState } from "react";
import { AppLink } from "../../components/AppLink";
import { appendStudentPreview, type StudentPreviewContext } from "../../lib/studentPreview";
import { answerSheetApi, type Task } from "./api";
import { sheetCounts } from "../../../../server/src/shared/answerSheets";
import "./answer-sheets.css";

export function StudentAnswerSheetList({ token, previewContext, compact = false }: { token: string; previewContext: StudentPreviewContext; compact?: boolean }) {
  const scope = `${token}:${previewContext.isPreview ? previewContext.studentId : "self"}`;
  const [saved, setSaved] = useState<{ scope: string; tasks: Task[] } | null>(null), [failure, setFailure] = useState<{ scope: string; message: string } | null>(null);
  const tasks = saved?.scope === scope ? saved.tasks : null, error = failure?.scope === scope ? failure.message : "";
  useEffect(() => {
    let active = true;
    const api = answerSheetApi(token);
    const request = previewContext.isPreview ? previewContext.studentId ? api.summary(previewContext.studentId) : Promise.resolve({ assignments: [] }) : api.student();
    request.then(value => { if (active) { setSaved({ scope, tasks: value.assignments }); setFailure(null); } }).catch(error => { if (active) setFailure({ scope, message: error instanceof Error ? error.message : "Answer sheets could not be loaded." }); });
    return () => { active = false; };
  }, [token, previewContext.isPreview, previewContext.studentId, scope]);
  const ordered = [...tasks ?? []].sort((a, b) => Number(a.attempt?.status === "submitted") - Number(b.attempt?.status === "submitted") || (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  return <section className="as-student-library" aria-label="Your answer sheets">
    <header><div><h2>{compact ? "Answer sheets" : "Your answer sheets"}</h2><p>Taking a paper or PDF test? Record your answers here.</p></div>{compact && <AppLink href={appendStudentPreview("/study-hall/shsat/answer-sheets", previewContext)}>All answer sheets →</AppLink>}</header>
    {error && <p role="alert">{error}</p>}{!tasks && !error && <p>Loading your answer sheets…</p>}
    {tasks?.length === 0 && <p className="as-library-empty">Your teacher hasn't assigned an answer sheet yet. Assigned sheets will appear here.</p>}
    {ordered.slice(0, compact ? 2 : undefined).map(task => {
      const count = task.attempt ? sheetCounts(task.attempt.sheet, task.attempt.answers, task.attempt.flags).answered : 0;
      const submitted = task.attempt?.status === "submitted";
      const href = previewContext.isPreview ? `/teacher/answer-sheets/${task.contentId}?review=${task.id}` : `/answer-sheets/${task.id}`;
      return <article key={task.id}><div><strong>{task.title}</strong><small>{submitted ? task.status === "completed" ? "Results released" : "Submitted · awaiting grading" : task.attempt ? `${count} answers saved · continue where you left off` : "Ready to start"}{task.dueDate ? ` · Due ${new Date(task.dueDate + "T12:00:00").toLocaleDateString()}` : ""}</small></div><AppLink href={href}>{previewContext.isPreview ? "Teacher review" : submitted ? "View" : task.attempt ? "Continue" : "Start"} →</AppLink></article>;
    })}
  </section>;
}
