import { useEffect, useState } from "react";
import { StudentAssessmentLibrary } from "../components/StudentAssessmentLibrary";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentAssessments, updateTeacherAssessmentSectionAccess, type StudentAssessment } from "../lib/api";
import { grade9MathCollectionLabel, isStudyHallWorksheet, worksheetPlacement } from '../lib/examLibrary';
import { AppLink } from '../components/AppLink';
import { appendStudentPreview } from '../lib/studentPreview';
import { studyHallHref, worksheetArea } from '../lib/studyHallNavigation';
import { worksheetCategoryMatches, worksheetTopicMatches, worksheetScope, canonicalWorksheetCollection } from '../../../server/src/shared/studyHallWorksheets';
import { learningAreas } from '../../../server/src/shared/learningTaxonomy';
import '../styles/worksheet-workspace.css';

export function StudentAssessmentsPage() {
  const [search,setSearch]=useState(window.location.search);
  const params = new URLSearchParams(search);
  const legacyGrade9 = params.get('collection') === 'grade-9-math';
  const worksheets = window.location.pathname.endsWith('/worksheets') || legacyGrade9;
  const collection = legacyGrade9 ? grade9MathCollectionLabel : canonicalWorksheetCollection(params.get('collection') || '');
  const category = collection === grade9MathCollectionLabel && params.get('category') === "Nathan Teacher's Recommended" && !params.get('categoryId') ? null : params.get('category');
  const topic = params.get('topic');
  const subject = params.get('subject') || '';
  const scope=params.get('scope')||'';
  const area = params.get('area') || worksheetArea({ subject: subject === 'math' ? 'math' : 'english', category: category || '', topic: topic || undefined });
  const studyHallBack = subject === 'math' ? studyHallHref('math', category === "Nathan Teacher's Recommended" ? 'recommended' : 'categories') + (category && category !== "Nathan Teacher's Recommended" ? '&category=' + encodeURIComponent(category) + (topic ? '&topic=' + encodeURIComponent(topic) : '') : '') : studyHallHref(area === 'standalone'||area==='revising_editing_b'?'standalone':area === 'editing'||area==='revising_editing_a' ? 'editing' : 'reading', area === 'advanced' ? 'advanced' : 'categories');
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [savingWorksheet, setSavingWorksheet] = useState('');
  const [saveError, setSaveError] = useState('');
  async function toggleWorksheet(item: StudentAssessment) {
    const placement = worksheetPlacement(item);
    if (!placement || !accessToken || savingWorksheet) return;
    setSavingWorksheet(item.id); setSaveError('');
    try {
      const updated = await updateTeacherAssessmentSectionAccess(accessToken, item.id, placement.subject, !item.sectionAccess[placement.subject]);
      setAssessments(current => current.map(existing => existing.id === item.id ? { ...existing, sectionAccess: updated.sectionAccess, status: updated.status } : existing));
    } catch (reason) { setSaveError(reason instanceof Error ? reason.message : 'Student access could not be saved. Try again.'); }
    finally { setSavingWorksheet(''); }
  }
  const items = assessments.filter(item => {
    if (!worksheets) return !isStudyHallWorksheet(item);
    const placement = worksheetPlacement(item);
    const requestedArea=params.get('area');
    const expectedArea=requestedArea==='revising_editing_a'?'editing':requestedArea==='revising_editing_b'?'standalone':requestedArea;
    return Boolean(placement&&(!subject||placement.subject===subject)&&(!expectedArea||worksheetArea(placement)===expectedArea)&&(!scope||worksheetScope(placement)===scope)&&worksheetCategoryMatches(placement,params.get('categoryId')||category)&&worksheetTopicMatches(placement,params.get('topicId')||topic)&&(!collection||placement.collection===collection));
  });
  function filterWorksheet(key:string,value:string){const next=new URLSearchParams(search);if(value)next.set(key,value);else next.delete(key);if(key==='subject'){for(const field of ['area','category','categoryId','topic','topicId','collection'])next.delete(field);}if(key==='area'){for(const field of ['category','categoryId','topic','topicId','collection'])next.delete(field);}window.history.replaceState({},'',window.location.pathname+'?'+next);setSearch('?'+next);}

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    getStudentAssessments(accessToken).then(items => { if (isMounted) { setAssessments(items); setError(false); } })
      .catch(() => { if (isMounted) setError(true); }).finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [accessToken, reload]);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading assessments...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return (
    <StudentPortalShell activeId={worksheets ? 'materials' : 'assessments'} onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      {worksheets && <AppLink href={appendStudentPreview(studyHallBack, previewContext)}>← Back to Study Hall</AppLink>}
      {worksheets&&<div className="worksheet-filters" aria-label="Worksheet filters"><label>Subject<select value={subject} onChange={event=>filterWorksheet('subject',event.target.value)}><option value="">All subjects</option><option value="english">English</option><option value="math">Math</option></select></label><label>Area<select value={params.get('area')==='revising_editing_a'?'editing':params.get('area')==='revising_editing_b'?'standalone':params.get('area')||''} onChange={event=>filterWorksheet('area',event.target.value)}><option value="">All areas</option>{learningAreas.filter(item=>!subject||(subject==='math')===(item.id==='math')).map(item=><option key={item.id} value={item.id==='revising_editing_a'?'editing':item.id==='revising_editing_b'?'standalone':item.id}>{item.label}</option>)}</select></label><label>Scope<select value={scope} onChange={event=>filterWorksheet('scope',event.target.value)}><option value="">Focused and mixed review</option><option value="focused">Focused practice</option><option value="mixed">General / Mixed Review</option></select></label>{(category||topic||params.get('categoryId')||params.get('topicId'))&&<button type="button" onClick={()=>{const next=new URLSearchParams(search);for(const key of ['category','categoryId','topic','topicId'])next.delete(key);window.history.replaceState({},'',window.location.pathname+'?'+next);setSearch('?'+next);}}>Show all categories</button>}{collection&&<button type="button" onClick={()=>filterWorksheet('collection','')}>Show all collections</button>}</div>}
      {saveError && <p role="alert">{saveError}</p>}
      <StudentAssessmentLibrary key={worksheets?'worksheets':'all'} assessments={items} worksheetMode={worksheets} onToggleWorksheet={toggleWorksheet} savingWorksheet={savingWorksheet} heading={worksheets ? collection || topic || category || 'Study Hall Worksheets' : undefined} description={worksheets?'Short worksheets in your Study Hall category. Open a worksheet to start or continue your saved work.':undefined} previewContext={previewContext} loading={loading} error={error} onRetry={() => { setLoading(true); setError(false); setReload(value => value + 1); }} />
    </StudentPortalShell>
  );
}
