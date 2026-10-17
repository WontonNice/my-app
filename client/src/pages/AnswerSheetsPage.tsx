import { useEffect, useState } from "react";
import { getActiveSession } from "../lib/sessionCache";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { AppLink } from "../components/AppLink";
import { answerSheetApi, type AnswerSheet } from "../features/answer-sheets/api";
import { emptySheet } from "../features/answer-sheets/editorDefaults";
import { TeacherSheet } from "../features/answer-sheets/TeacherSheet";
import { StudentSheet } from "../features/answer-sheets/StudentSheet";
import "../features/answer-sheets/answer-sheets.css";

export function AnswerSheetsPage() {
  const isTeacher = location.pathname.startsWith("/teacher/"), segment = location.pathname.split("/").filter(Boolean).at(-1) ?? "";
  const [session, setSession] = useState<{ token: string; userId: string } | null>(null), [error, setError] = useState(isSupabaseConfigured ? "" : "Configure the existing platform authentication to use answer sheets."), [reload, setReload] = useState(0);
  const [data, setData] = useState<Awaited<ReturnType<ReturnType<typeof answerSheetApi>["teacher"]>> | null>(null), [sheet, setSheet] = useState<AnswerSheet | null>(null);
  useEffect(() => {
    let mounted = true;
    if (!isSupabaseConfigured) return;
    getActiveSession().then(async active => {
      if (!active) { location.assign("/login"); return; }
      if (isTeacher && !["teacher", "admin"].includes(getUserRole(active.user))) { location.assign(getDashboardPath(getUserRole(active.user))); return; }
      if (!mounted) return;
      setSession({ token: active.access_token, userId: active.user.id });
      if (isTeacher) { const api = answerSheetApi(active.access_token), loaded = await api.teacher(); if (!mounted) return; setData(loaded); if (segment.startsWith("answer-sheet-")) { const detail = await api.detail(segment); if (mounted) setSheet(detail.sheet); } }
    }).catch(error => { if (mounted) setError(error instanceof Error ? error.message : "Answer sheets could not be loaded."); });
    const { data: subscription } = getSupabaseClient().auth.onAuthStateChange((_event, active) => {
      if (session && active?.user.id !== session.userId) { setSession(null); location.assign(active ? getDashboardPath(getUserRole(active.user)) : "/login"); }
      else if (active) setSession(current => current && current.userId === active.user.id && current.token !== active.access_token ? { ...current, token: active.access_token } : current);
    });
    return () => { mounted = false; subscription.subscription.unsubscribe(); };
    // Route navigation remounts this page; session is only used to detect a subsequent account change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher, segment, reload, session?.userId]);
  if (error) return <main className="as-shell"><h1>Digital answer sheets</h1><p role="alert" className="as-alert">{error}</p><button onClick={() => { setError(""); setReload(value => value + 1); }}>Retry</button></main>;
  if (!session || isTeacher && !data || segment.startsWith("answer-sheet-") && isTeacher && !sheet) return <main className="as-shell">Loading answer sheets…</main>;
  if (!isTeacher) return <StudentSheet token={session.token} userId={session.userId} assignmentId={segment} key={`${session.userId}:${segment}`} />;
  return <main className="as-shell as-teacher"><nav className="as-app-nav" aria-label="Teacher navigation"><AppLink href="/teacher">Teacher dashboard</AppLink><AppLink href="/teacher/students">Students & insights</AppLink><AppLink href="/teacher/assessments">Assessments</AppLink><AppLink href="/teacher/answer-sheets">Answer sheets</AppLink><AppLink href="/teacher/library">English library</AppLink></nav>
    {segment === "new" || sheet ? <TeacherSheet key={sheet?.id || "new"} token={session.token} initial={sheet ?? emptySheet()} students={data!.students} assessments={data!.assessments} preselectedStudent={new URLSearchParams(location.search).get("student") || ""} onSaved={value => { if (!sheet) { history.replaceState({}, "", `/teacher/answer-sheets/${value.id}${location.search}`); } setSheet(value); setData(current => current ? { ...current, sheets: [value, ...current.sheets.filter(sheet => sheet.id !== value.id)] } : current); }} /> : <><header className="as-page-heading"><div><p>Nathan Tutors · Assessments</p><h1>Digital answer sheets</h1><span>Take the test now. Save answers reliably. Digitize and grade later.</span></div><AppLink className="as-primary" href={`/teacher/answer-sheets/new${location.search}`}>Create Answer Sheet</AppLink></header><section className="as-panel"><p>For printed booklets, separate PDFs, or another teacher-provided source. Question text, PDF uploads, and answer keys are optional.</p><div className="as-sheet-list">{data!.sheets.map(sheet => <AppLink key={sheet.id} href={`/teacher/answer-sheets/${sheet.id}${location.search}`}><div><strong>{sheet.title}</strong><small>{sheet.sourceVersion || "No version supplied"} · {sheet.sections.reduce((sum, section) => sum + section.items.length, 0)} items · {sheet.issued ? "Issued" : "Draft"} · key revision {sheet.keyVersion}</small></div><span>Open →</span></AppLink>)}</div>{!data!.sheets.length && <p>No answer sheets yet. Create one and add ranges of question numbers.</p>}</section></>}
  </main>;
}
