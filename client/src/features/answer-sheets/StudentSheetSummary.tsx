import { useEffect, useState } from "react";
import { AppLink } from "../../components/AppLink";
import { answerSheetApi, type Task } from "./api";
import { sheetCounts } from "../../../../server/src/shared/answerSheets";
import "./answer-sheets.css";
export function StudentSheetSummary({ token, studentId }: { token: string; studentId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]), [error, setError] = useState("");
  useEffect(() => { let mounted = true; answerSheetApi(token).summary(studentId).then(value => { if (mounted) setTasks(value.assignments); }).catch(error => { if (mounted) setError(error instanceof Error ? error.message : "Answer sheets could not be loaded."); }); return () => { mounted = false; }; }, [token, studentId]);
  return <section className="as-panel as-workspace-summary"><header className="as-section-heading"><div><h3>Digital answer sheets</h3><p>Paper/PDF responses, active sessions, pending grading, and released results.</p></div><AppLink href={`/teacher/answer-sheets?student=${studentId}`}>Assign / create answer sheet →</AppLink></header>{error && <p role="alert">{error}</p>}{tasks.map(task => { const counts = task.attempt ? sheetCounts(task.attempt.sheet, task.attempt.answers, task.attempt.flags) : null; return <AppLink className="as-summary-task" href={`/teacher/answer-sheets/${task.contentId}?review=${task.id}`} key={task.id}><strong>{task.title}</strong><span>{task.attempt?.status ?? "Not started"}{task.status === "completed" ? " · released" : task.attempt?.status === "submitted" ? " · awaiting grading/release" : ""} · {counts?.answered ?? 0} saved responses</span><small>{task.attempt?.savedAt ? `Last server save: ${new Date(task.attempt.savedAt).toLocaleString()}` : "No response activity yet"}</small></AppLink>; })}{!tasks.length && !error && <p>No answer-sheet assignments for this student yet.</p>}</section>;
}
