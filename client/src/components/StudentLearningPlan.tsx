import { useEffect, useMemo, useState } from "react";
import { getStudentLearningPlan, getStudentPlanAssignments, updateStudentPlanAssignment } from "../lib/api";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { isOverdue, statusLabels, todayInNewYork, type AssignmentPage, type PlanAssignment, type PlanOverview } from "../lib/learningPlan";
import { AppLink } from "./AppLink";
import "../styles/learning-plan.css";
import { passageCategoryLabel } from "../../../server/src/shared/passageCategories";

export type StudentPlanClient = { overview: () => Promise<PlanOverview>; list: (status: string, page: number) => Promise<AssignmentPage>; update: (assignment: PlanAssignment, action: "start" | "submit") => Promise<unknown> };
export function StudentLearningPlan({ accessToken, previewContext, compact = false, contentId, client: injectedClient }: { accessToken: string; previewContext: StudentPreviewContext; compact?: boolean; contentId?: string; client?: StudentPlanClient }) {
  const client = useMemo<StudentPlanClient>(() => injectedClient ?? { overview: () => getStudentLearningPlan(accessToken, previewContext.isPreview ? previewContext.studentId : undefined), list: (status, page) => getStudentPlanAssignments(accessToken, status, page, previewContext.isPreview ? previewContext.studentId : undefined, contentId), update: (item, action) => updateStudentPlanAssignment(accessToken, item, action) }, [injectedClient, accessToken, previewContext.isPreview, previewContext.studentId, contentId]);
  const [overview, setOverview] = useState<PlanOverview | null>(null);
  const [tasks, setTasks] = useState<AssignmentPage | null>(null);
  const [filter, setFilter] = useState("active");
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const noPreviewStudent = previewContext.isPreview && !previewContext.studentId && !injectedClient;
  useEffect(() => { if (noPreviewStudent || !accessToken && !injectedClient) return; let active = true; client.overview().then(data => { if (active) { setOverview(data); setError(""); } }).catch(error => { if (active) setError(error instanceof Error ? error.message : "Could not load your plan."); }); return () => { active = false; }; }, [client, accessToken, injectedClient, revision, noPreviewStudent]);
  useEffect(() => { if (noPreviewStudent || !accessToken && !injectedClient) return; let active = true; client.list(filter, page).then(data => { if (active) setTasks(data); }).catch(error => { if (active) setError(error instanceof Error ? error.message : "Could not load homework."); }); return () => { active = false; }; }, [client, filter, page, revision, accessToken, injectedClient, noPreviewStudent]);
  async function update(item: PlanAssignment, action: "start" | "submit", href?: string) {
    if (previewContext.isPreview) return;
    setBusy(true); setError("");
    try { await client.update(item, action); setRevision(value => value + 1); if (href) window.location.assign(href); } catch (error) { setError(error instanceof Error ? error.message : "Could not update this task."); } finally { setBusy(false); }
  }
  const visible = (tasks?.assignments ?? []).filter(item => item.status !== "planned" && item.assignedAt && (!contentId || item.contentId === contentId)).slice(0, compact ? 3 : 50);
  return <section className="lp-student-plan" aria-label="My personalized learning plan">
    <header><div><h2>{compact ? "Your personalized homework" : "My learning plan"}</h2><small>Your own assignments, due dates, and completed work.</small></div>{compact && <AppLink href={appendStudentPreview("/study-hall/shsat/assignments", previewContext)}>View full plan →</AppLink>}</header>
    {previewContext.isPreview && <p>Teacher preview · Read-only. {previewContext.studentId ? "Viewing this student's published work." : "Choose a student from their record to preview their homework."}</p>}
    {error && <p className="lp-error" role="alert">{error} <button onClick={() => setRevision(value => value + 1)} type="button">Retry plan</button></p>}
    {!noPreviewStudent && !overview && !error && <p>Loading your assignments…</p>}
    {overview && <div className="lp-summary-strip"><span><small>Current work</small><strong>{overview.summary.assigned}</strong></span><span><small>Due this week</small><strong>{overview.summary.dueThisWeek}</strong></span><span><small>Overdue</small><strong>{overview.summary.overdue}</strong></span><span><small>Completed</small><strong>{overview.summary.completed}</strong></span></div>}
    {!compact && <nav className="lp-student-filters" aria-label="Homework filters">{[["active", "Up next / due soon"], ["week", "This week"], ["overdue", "Overdue"], ["review", "Awaiting review"], ["completed", "Completed"], ["all", "History"]].map(([value, label]) => <button aria-pressed={filter === value} key={value} onClick={() => { setFilter(value); setPage(0); }} type="button">{label}</button>)}</nav>}
    {visible.map(item => {
      const content = overview?.catalog.find(content => content.kind === item.kind && content.id === item.contentId);
      const href = content ? appendStudentPreview(content.href, previewContext) : item.url;
      return <article className="lp-student-task" key={item.id}><div><h3>{item.title}</h3>{content?.kind === "passage" && <small>English · {passageCategoryLabel(content.passageCategory)}</small>}<span className={`lp-chip is-${isOverdue(item) ? "overdue" : item.status}`}>{isOverdue(item) ? "Overdue · " : ""}{statusLabels[item.status]}</span><small>{item.dueDate ? `Due ${item.dueDate}${item.dueDate === todayInNewYork() ? " · Today" : ""}` : "No due date set"}{item.estimatedMinutes !== null ? ` · ${item.estimatedMinutes} min expected` : ""}</small>{item.questionTarget && <small>Complete {item.questionTarget} new practice questions after assignment.</small>}{item.instructions && <p>{item.instructions}</p>}{item.completedAt && <small>Completed {todayInNewYork(new Date(item.completedAt))} · {item.completion?.source === "teacher" ? "Teacher verified" : "Saved platform work"}</small>}</div><div>
        {href && (content ? <AppLink href={href}>Open {item.kind} →</AppLink> : <a href={href} target="_blank" rel="noopener noreferrer">Open resource ↗</a>)}
        {!["completed", "cancelled", "skipped", "review"].includes(item.status) && <><button disabled={busy || previewContext.isPreview || item.status === "in_progress"} onClick={() => update(item, "start", content ? href ?? undefined : undefined)} type="button">{item.status === "in_progress" ? "Started" : "Mark started"}</button><button disabled={busy || previewContext.isPreview} onClick={() => update(item, "submit")} type="button">Submit for teacher review</button></>}
        {item.status === "review" && <small>You reported completion. Your teacher will verify it.</small>}
      </div></article>;
    })}
    {tasks && visible.length === 0 && <p>No homework in this view. Your teacher can add your next task; completed work stays in History.</p>}
    {!compact && <footer><button disabled={page === 0} onClick={() => setPage(value => value - 1)} type="button">Previous homework</button><span>Page {page + 1} · {tasks?.total ?? 0} tasks</span><button disabled={!tasks || (page + 1) * 50 >= tasks.total} onClick={() => setPage(value => value + 1)} type="button">Next homework</button></footer>}
  </section>;
}
