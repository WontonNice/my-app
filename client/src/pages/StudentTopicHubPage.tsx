import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
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
import { StudentLearningPlan } from "../components/StudentLearningPlan";
import { getPracticeTopicBySlug, type PracticeDifficulty } from "../content/practice";
import { getTopicBankSets } from "../content/questionBank";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { appendStudentPreview } from "../lib/studentPreview";

const difficultyOrder: PracticeDifficulty[] = ["easy", "medium", "hard", "elite"];

function getTopicSlugFromPath() {
  return window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
}

export function StudentTopicHubPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const topic = getPracticeTopicBySlug(getTopicSlugFromPath());

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading topic...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  if (!topic) {
    return (
      <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
        <section className="student-topic-missing">
          <FolderOpen size={30} />
          <h1>Topic not found</h1>
          <p>This topic may have moved or is no longer available.</p>
          <AppLink href={appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext)}>Return to English Study Hall</AppLink>
        </section>
      </StudentPortalShell>
    );
  }

  const difficultyCounts = Object.fromEntries(
    difficultyOrder.map((difficulty) => [
      difficulty,
      topic.questionBank.filter((question) => question.difficulty === difficulty).length,
    ]),
  ) as Record<PracticeDifficulty, number>;
  const catalogHref = appendStudentPreview("/study-hall/shsat/materials?subject=english", previewContext);
  const practiceHref = appendStudentPreview(`/practice/${topic.slug}`, previewContext);
  const practiceSets = getTopicBankSets(topic.key);
  const practiceCount = practiceSets.length + Number(topic.questionBank.length > 0);

  return (
    <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-topic-hub">
        <AppLink className="student-topic-back" href={catalogHref}><ArrowLeft size={15} /> English topic catalog</AppLink>

        <header className="student-topic-hero">
          <div className="student-topic-hero-copy">
            <span><GraduationCap size={16} /> English skill hub</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div>
              <a className="student-topic-primary-action" href="#topic-practice"><Play fill="currentColor" size={15} /> Explore practice</a>
              <a className="student-topic-secondary-action" href="#topic-assignments">See topic materials</a>
            </div>
          </div>
          <aside className="student-topic-hero-summary" aria-label="Topic overview">
            <small>Inside this topic</small>
            <strong>{practiceCount}</strong>
            <span>practice {practiceCount === 1 ? "activity" : "activities"}</span>
            <div><span>Personalized homework</span><span>4 module types</span></div>
          </aside>
        </header>

        <nav className="student-topic-jump-nav" aria-label="Topic sections">
          <a href="#topic-assignments"><ClipboardList size={16} /><span>Assignments</span><small>Your plan</small></a>
          <a href="#topic-lessons"><GraduationCap size={16} /><span>Lessons</span><small>0</small></a>
          <a href="#topic-resources"><Library size={16} /><span>Resources</span><small>0</small></a>
          <a href="#topic-practice"><BookOpen size={16} /><span>Practice</span><small>{practiceCount}</small></a>
        </nav>

        <main className="student-topic-content">
          <TopicSectionHeader
            description="Work your teacher has connected to this skill."
            eyebrow="Teacher directed"
            icon={ClipboardList}
            id="topic-assignments"
            title="Assignments"
          />
          <StudentLearningPlan accessToken={accessToken} previewContext={previewContext} contentId={topic.slug} />

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

          <section id="topic-practice" className="student-topic-practice-section" aria-labelledby="topic-practice-heading">
            <TopicSectionHeader description={`Practice sets connected to ${topic.title}.`} eyebrow="Build your skill" icon={BookOpen} title="Practice" headingId="topic-practice-heading" />
            {practiceSets.length > 0 && <div className="student-material-list student-topic-practice-sets">{practiceSets.map(set => <AppLink key={set.id} href={appendStudentPreview(set.href, previewContext)}><BookOpen size={20} /><span><small>{set.contentSource || "Teacher practice set"}</small><strong>{set.title}</strong><em>{set.questionCount} {set.questionCount === 1 ? "question" : "questions"} · {set.skills.join(" · ")}</em></span><span>Open practice set</span><ArrowRight size={18} /></AppLink>)}</div>}
            {topic.questionBank.length > 0 && <div className="student-topic-practice-module">
              <div className="student-topic-practice-copy">
                <span><BookOpen size={16} /> Practice module</span>
                <h2>Strengthen {topic.title}</h2>
                <p>Choose the practice module when your teacher assigns it or when you want extra reinforcement. Your level progress stays inside the practice experience.</p>
                <div className="student-topic-difficulty-list">
                  {difficultyOrder.map((difficulty) => <span key={difficulty}><strong>{difficulty}</strong><small>{difficultyCounts[difficulty]} {difficultyCounts[difficulty] === 1 ? "question" : "questions"}</small></span>)}
                </div>
              </div>
              <AppLink href={practiceHref}><Play fill="currentColor" size={16} /><span><small>Interactive practice</small><strong>Open practice module</strong></span><ArrowRight size={18} /></AppLink>
            </div>}
            {!practiceCount && <TopicEmptyState description="Practice sets your teacher publishes for this topic will appear here." icon={BookOpen} title="Practice shelf ready" />}
          </section>
        </main>
      </div>
    </StudentPortalShell>
  );
}

function TopicSectionHeader({ description, eyebrow, icon: Icon, id, headingId, title }: { description: string; eyebrow: string; icon: typeof BookOpen; id?: string; headingId?: string; title: string }) {
  return (
    <header className="student-topic-section-heading" id={id}>
      <span><Icon size={18} /></span>
      <div><small>{eyebrow}</small><h2 id={headingId}>{title}</h2><p>{description}</p></div>
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
