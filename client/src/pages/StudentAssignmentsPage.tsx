import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, Clock3, FileText } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";
import { appendStudentPreview } from "../lib/studentPreview";

type AssignmentFilter = "All" | "Assessments" | "Materials" | "Practice";

export function StudentAssignmentsPage() {
  const { accessToken, hasMultipleClasses, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [filter, setFilter] = useState<AssignmentFilter>("All");

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getStudentAssessments(accessToken).then((items) => { if (isMounted) setAssessments(items); }).catch(() => undefined);
    return () => { isMounted = false; };
  }, [accessToken]);

  const assignedItems = useMemo(() => [
    {
      description: "Reading comprehension · Medium · 10 questions",
      href: appendStudentPreview("/practice/authors-point-of-view", previewContext),
      id: "authors-point-of-view",
      kind: "Practice" as AssignmentFilter,
      status: "In progress",
      title: "Author's Point of View",
    },
    {
      description: "English · Reading comprehension directory",
      href: appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext),
      id: "reading-skills-review",
      kind: "Materials" as AssignmentFilter,
      status: "Assigned",
      title: "Reading Skills Review",
    },
    ...assessments.map((assessment) => ({
      description: `${assessment.questionCount} questions · ${assessment.durationMinutes} minutes`,
      href: appendStudentPreview("/study-hall/shsat/assessments", previewContext),
      id: assessment.id,
      kind: "Assessments" as AssignmentFilter,
      status: assessment.status === "open" ? "Open" : "Locked",
      title: assessment.title,
    })),
  ], [assessments, previewContext]);
  const visibleItems = filter === "All" ? assignedItems : assignedItems.filter((item) => item.kind === filter);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading assignments...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <StudentPortalShell activeId="assignments" hasMultipleClasses={hasMultipleClasses} onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-section-page">
        <header className="student-section-heading"><div><p>Teacher-assigned work</p><h1>Assignments</h1><span>Everything your teacher expects you to complete or review.</span></div><strong>{assignedItems.length} items</strong></header>
        <div className="student-section-tabs" aria-label="Filter assignments">
          {(["All", "Practice", "Materials", "Assessments"] as AssignmentFilter[]).map((option) => <button aria-pressed={filter === option} key={option} onClick={() => setFilter(option)} type="button">{option}</button>)}
        </div>
        <section className="student-assignment-list" aria-label="Assigned work">
          {visibleItems.map((item) => {
            const Icon = item.kind === "Practice" ? BookOpen : item.kind === "Materials" ? FileText : ClipboardList;
            return (
              <AppLink href={item.href} key={item.id}>
                <span className={`student-assignment-kind is-${item.kind.toLowerCase()}`}><Icon size={19} /></span>
                <span><small>{item.kind}</small><strong>{item.title}</strong><em>{item.description}</em></span>
                <span className={`student-assignment-status is-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status === "In progress" ? <Clock3 size={14} /> : item.status === "Open" ? <CheckCircle2 size={14} /> : null}{item.status}</span>
                <ArrowRight size={18} />
              </AppLink>
            );
          })}
        </section>
      </div>
    </StudentPortalShell>
  );
}
