import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  Layers3,
  Library,
  Play,
} from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { getPracticeTopicBySlug, type PracticeDifficulty } from "../content/practice";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { appendStudentPreview } from "../lib/studentPreview";

const difficultyOrder: PracticeDifficulty[] = ["easy", "medium", "hard", "elite"];

type TopicAssignment = {
  description: string;
  status: "Assigned" | "In progress";
  title: string;
};

const topicAssignments: Partial<Record<string, TopicAssignment[]>> = {
  "authors-point-of-view": [
    {
      description: "Reading comprehension · Medium · 10 questions",
      status: "In progress",
      title: "Author's Point of View",
    },
  ],
};

function getTopicSlugFromPath() {
  return window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
}

export function StudentTopicHubPage() {
  const { hasMultipleClasses, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const topic = getPracticeTopicBySlug(getTopicSlugFromPath());

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading topic...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  if (!topic) {
    return (
      <StudentPortalShell activeId="materials" hasMultipleClasses={hasMultipleClasses} onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
        <section className="student-topic-missing">
          <FolderOpen size={30} />
          <h1>Topic not found</h1>
          <p>This topic may have moved or is no longer available.</p>
          <AppLink href={appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext)}>Return to English Study Hall</AppLink>
        </section>
      </StudentPortalShell>
    );
  }

  const assignments = topicAssignments[topic.slug] ?? [];
  const difficultyCounts = Object.fromEntries(
    difficultyOrder.map((difficulty) => [
      difficulty,
      topic.questionBank.filter((question) => question.difficulty === difficulty).length,
    ]),
  ) as Record<PracticeDifficulty, number>;
  const catalogHref = appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext);
  const practiceHref = appendStudentPreview(`/practice/${topic.slug}`, previewContext);
  const assignmentsHref = appendStudentPreview("/study-hall/shsat/assignments", previewContext);

  return (
    <StudentPortalShell activeId="materials" hasMultipleClasses={hasMultipleClasses} onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-topic-hub">
        <AppLink className="student-topic-back" href={catalogHref}><ArrowLeft size={15} /> English topic catalog</AppLink>

        <header className="student-topic-hero">
          <div className="student-topic-hero-copy">
            <span><GraduationCap size={16} /> English skill hub</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div>
              <AppLink className="student-topic-primary-action" href={practiceHref}><Play fill="currentColor" size={15} /> Open practice module</AppLink>
              <a className="student-topic-secondary-action" href="#topic-assignments">See topic materials</a>
            </div>
          </div>
          <aside className="student-topic-hero-summary" aria-label="Topic overview">
            <small>Inside this topic</small>
            <strong>{topic.questionBank.length}</strong>
            <span>practice questions</span>
            <div><span>{assignments.length} assigned</span><span>4 module types</span></div>
          </aside>
        </header>

        <nav className="student-topic-jump-nav" aria-label="Topic sections">
          <a href="#topic-assignments"><ClipboardList size={16} /><span>Assignments</span><small>{assignments.length}</small></a>
          <a href="#topic-lessons"><GraduationCap size={16} /><span>Lessons</span><small>0</small></a>
          <a href="#topic-resources"><Library size={16} /><span>Resources</span><small>0</small></a>
          <a href="#topic-practice"><BookOpen size={16} /><span>Practice</span><small>{topic.questionBank.length}</small></a>
        </nav>

        <main className="student-topic-content">
          <TopicSectionHeader
            description="Work your teacher has connected to this skill."
            eyebrow="Teacher directed"
            icon={ClipboardList}
            id="topic-assignments"
            title="Assignments"
          />
          {assignments.length ? (
            <div className="student-topic-assignment-list">
              {assignments.map((assignment) => (
                <AppLink href={practiceHref} key={assignment.title}>
                  <span className="student-topic-item-icon"><ClipboardList size={19} /></span>
                  <span><small>Practice assignment</small><strong>{assignment.title}</strong><em>{assignment.description}</em></span>
                  <span className="student-topic-item-status"><CheckCircle2 size={14} /> {assignment.status}</span>
                  <ArrowRight size={18} />
                </AppLink>
              ))}
            </div>
          ) : (
            <TopicEmptyState
              actionHref={assignmentsHref}
              actionLabel="View all assignments"
              description="Your teacher has not attached an assignment to this topic yet."
              icon={ClipboardList}
              title="No topic assignment right now"
            />
          )}

          <div className="student-topic-resource-grid">
            <section id="topic-lessons">
              <TopicSectionHeader description="Teacher-led instruction, examples, and class notes." eyebrow="Learn" icon={GraduationCap} title="Lessons" />
              <TopicEmptyState description="Lessons your teacher publishes for this skill will be organized here." icon={Layers3} title="Lesson shelf ready" />
            </section>
            <section id="topic-resources">
              <TopicSectionHeader description="Study guides, handouts, reference sheets, and links." eyebrow="Review" icon={Library} title="Resources" />
              <TopicEmptyState description="Study materials connected to this topic will appear here." icon={FileText} title="Resource shelf ready" />
            </section>
          </div>

          <section className="student-topic-practice-module" id="topic-practice">
            <div className="student-topic-practice-copy">
              <span><BookOpen size={16} /> Practice module</span>
              <h2>Strengthen {topic.title}</h2>
              <p>Choose the practice module when your teacher assigns it or when you want extra reinforcement. Your level progress stays inside the practice experience.</p>
              <div className="student-topic-difficulty-list">
                {difficultyOrder.map((difficulty) => <span key={difficulty}><strong>{difficulty}</strong><small>{difficultyCounts[difficulty]} questions</small></span>)}
              </div>
            </div>
            <AppLink href={practiceHref}><Play fill="currentColor" size={16} /><span><small>Interactive practice</small><strong>Open practice module</strong></span><ArrowRight size={18} /></AppLink>
          </section>
        </main>
      </div>
    </StudentPortalShell>
  );
}

function TopicSectionHeader({ description, eyebrow, icon: Icon, id, title }: { description: string; eyebrow: string; icon: typeof BookOpen; id?: string; title: string }) {
  return (
    <header className="student-topic-section-heading" id={id}>
      <span><Icon size={18} /></span>
      <div><small>{eyebrow}</small><h2>{title}</h2><p>{description}</p></div>
    </header>
  );
}

function TopicEmptyState({ actionHref, actionLabel, description, icon: Icon, title }: { actionHref?: string; actionLabel?: string; description: string; icon: typeof BookOpen; title: string }) {
  return (
    <div className="student-topic-empty-state">
      <span><Icon size={21} /></span>
      <div><strong>{title}</strong><p>{description}</p></div>
      {actionHref && actionLabel ? <AppLink href={actionHref}>{actionLabel}<ArrowRight size={15} /></AppLink> : <small>Teacher curated</small>}
    </div>
  );
}
