import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, FileCheck2, LockKeyhole } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, type StudentAssessment } from "../lib/api";
import { appendStudentPreview } from "../lib/studentPreview";

export function StudentAssessmentsPage() {
  const { accessToken, hasMultipleClasses, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getStudentAssessments(accessToken).then((items) => { if (isMounted) setAssessments(items); }).catch(() => undefined);
    return () => { isMounted = false; };
  }, [accessToken]);

  const openCount = useMemo(() => assessments.filter((assessment) => assessment.status === "open").length, [assessments]);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading assessments...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <StudentPortalShell activeId="assessments" hasMultipleClasses={hasMultipleClasses} onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-section-page">
        <header className="student-section-heading"><div><p>Teacher-controlled access</p><h1>Assessments</h1><span>Your teacher decides when each assessment and subject section is available.</span></div><strong>{openCount} open</strong></header>
        {assessments.length > 0 ? (
          <section className="student-assessment-grid" aria-label="Assigned assessments">
            {assessments.map((assessment) => <AssessmentCard assessment={assessment} key={assessment.id} previewContext={previewContext} />)}
          </section>
        ) : (
          <section className="student-section-empty"><FileCheck2 size={28} /><h2>No assessments have been assigned</h2><p>Your teacher will make assessments appear here when they are ready.</p></section>
        )}
      </div>
    </StudentPortalShell>
  );
}

function AssessmentCard({ assessment, previewContext }: { assessment: StudentAssessment; previewContext: ReturnType<typeof import("../lib/studentPreview").getStudentPreviewContext> }) {
  const isOpen = assessment.status === "open";
  return (
    <article className={`student-assessment-card ${isOpen ? "is-open" : "is-locked"}`}>
      <header><span>{isOpen ? <FileCheck2 size={16} /> : <LockKeyhole size={16} />}{isOpen ? "Open" : "Locked by teacher"}</span><small><Clock3 size={14} /> {assessment.durationMinutes} minutes</small></header>
      <h2>{assessment.title}</h2><p>{assessment.description}</p>
      <div className="student-assessment-sections"><span className={assessment.sectionAccess.english ? "is-available" : ""}>English</span><span className={assessment.sectionAccess.math ? "is-available" : ""}>Math</span></div>
      <dl><div><dt>Questions</dt><dd>{assessment.questionCount}</dd></div><div><dt>Passages</dt><dd>{assessment.passageCount}</dd></div></dl>
      {isOpen ? <AppLink href={appendStudentPreview(`/exam/${assessment.id}`, previewContext)}>Open assessment <ArrowRight size={16} /></AppLink> : <button disabled type="button"><LockKeyhole size={15} /> Waiting for teacher</button>}
    </article>
  );
}
