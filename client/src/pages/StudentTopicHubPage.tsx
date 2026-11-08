import { ArrowLeft, ArrowRight, BookOpen, FileText, Play } from 'lucide-react';
import { AppLink } from '../components/AppLink';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { StudentLearningPlan } from '../components/StudentLearningPlan';
import { StudyHallWorksheetLinks } from '../components/StudyHallWorksheetLinks';
import { getPracticeTopicBySlug, revisingEditingTopics, type PracticeDifficulty } from '../content/practice';
import { getTopicBankSets } from '../content/questionBank';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { appendStudentPreview } from '../lib/studentPreview';
import { studyHallHref } from '../lib/studyHallNavigation';
import '../styles/study-hall-catalog.css';
import {learningCategories} from '../../../server/src/shared/learningTaxonomy';

const difficultyOrder: PracticeDifficulty[] = ['easy', 'medium', 'hard', 'elite'];
export function StudentTopicHubPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const topic = getPracticeTopicBySlug(window.location.pathname.split('/').filter(Boolean).at(-1) ?? '');
  const editing = revisingEditingTopics.some(item => item.slug === topic?.slug);
  const standalone=new URLSearchParams(window.location.search).get('area')==='standalone';
  const area = standalone?'standalone':editing ? 'editing' : 'reading';
  const category=learningCategories.find(item=>item.id===new URLSearchParams(window.location.search).get('categoryId')&&item.area===(standalone?'revising_editing_b':editing?'revising_editing_a':'reading'));
  const areaTitle = standalone?'Stand Alone Items':editing ? 'Revising/Editing A' : 'Reading Comprehension';
  const backHref = appendStudentPreview(studyHallHref(area, 'categories'), previewContext);
  async function handleSignOut() { if (isSupabaseConfigured) await signOutCurrentAccount(); window.location.assign('/'); }
  if (isCheckingSession) return <main className="loading-shell">Loading topic…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;
  if (!topic) return <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}><h1>Topic not found</h1><AppLink href={backHref}>Return to Study Hall</AppLink></StudentPortalShell>;
  const sets = standalone?[]:getTopicBankSets(topic.key);
  return <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
    <div className="study-hall-catalog study-hall-topic-page">
      <AppLink className="student-topic-back" href={backHref}><ArrowLeft size={15} /> {areaTitle} categories</AppLink>
      <header className="study-hall-heading"><h1>{category?.label??topic.title}</h1><p>{topic.description}</p></header>
      <nav className="study-hall-sections" aria-label="Topic resources">
        {!!topic.questionBank.length&&!standalone && <a href="#topic-practice">Passage Practice</a>}
        <a href="#topic-worksheets">Worksheets</a><a href="#topic-assignments">Assignments</a>
      </nav>
      {!!topic.questionBank.length&&!standalone && <section id="topic-practice" className="study-hall-topic-practice" aria-labelledby="topic-practice-heading">
        <div><h2 id="topic-practice-heading">Passage Practice</h2><p>Practice from a finite question pool organized by difficulty. Questions may repeat as you return for review.</p>
          <div className="study-hall-difficulties">{difficultyOrder.map(difficulty => { const count = topic.questionBank.filter(question => question.difficulty === difficulty).length; return <span key={difficulty}>{difficulty}<small>{count} {count === 1 ? 'question' : 'questions'}</small></span>; })}</div>
        </div>
        <AppLink className="study-hall-practice-start" href={appendStudentPreview(`/practice/${topic.slug}`, previewContext)}><Play size={16} aria-hidden="true" />Start practice<ArrowRight size={17} aria-hidden="true" /></AppLink>
      </section>}
      <section id="topic-worksheets" className="study-hall-worksheet-section" aria-labelledby="topic-worksheets-title">
        <header className="study-hall-section-title"><div><h2 id="topic-worksheets-title">Worksheets</h2><p>Focused sets connected to {topic.title}.</p></div></header>
        <StudyHallWorksheetLinks subject="english" area={area} scope="focused" topicAliases={[topic.key, topic.title, topic.slug,...(category?[category.label,...category.aliases]:[])]} previewContext={previewContext} />
        {!!sets.length && <><h3 className="study-hall-existing-sets">Practice sets</h3><div className="student-material-list">{sets.map(set => <AppLink key={set.id} href={appendStudentPreview(set.href, previewContext)}><FileText size={20} /><span><small>{set.contentSource || 'Teacher practice set'}</small><strong>{set.title}</strong><em>{set.questionCount} questions · {set.skills.join(' · ')}</em></span><span>Open set</span><ArrowRight size={18} /></AppLink>)}</div></>}
      </section>
      <section id="topic-assignments" className="study-hall-worksheet-section" aria-labelledby="topic-assignments-title"><header className="study-hall-section-title"><div><h2 id="topic-assignments-title">Assignments</h2><p>Work your teacher has connected to this skill.</p></div></header><StudentLearningPlan accessToken={accessToken} previewContext={previewContext} contentId={topic.slug} /></section>
      <AppLink className="student-topic-back" href={appendStudentPreview(studyHallHref('reading', 'library'), previewContext)}><BookOpen size={16} /> Browse the passage library</AppLink>
    </div>
  </StudentPortalShell>;
}
