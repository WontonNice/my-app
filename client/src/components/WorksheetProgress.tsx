import { useState } from 'react';
import type { StudentAssessment, ExamSessionProgress } from '../lib/api';
import { worksheetPlacement, worksheetLibraryHref } from '../lib/examLibrary';
import { buildStudentAnalytics } from '../lib/studentAnalytics';
import { resolveExamContent } from '../content/exams';
import { getAllExamQuestions, type ExamResult, type ExamSubjectResult, type ExamPassageResult } from '../lib/examResults';
import { ExamReviewQuestion } from './ExamReviewQuestion';
import { AppLink } from './AppLink';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';
import { examCorrectionsHref } from '../lib/correctionNavigation';
import { hasFullyAnsweredExam } from '../../../server/src/shared/examCorrectionAccess';
import '../styles/student-analytics.css';
import '../styles/worksheet-workspace.css';
import { worksheetScope, worksheetEducationalArea } from '../../../server/src/shared/studyHallWorksheets';
import { learningAreas } from '../../../server/src/shared/learningTaxonomy';

type Item = Pick<StudentAssessment, 'id' | 'title' | 'studyHallWorksheet' | 'examLabel' | 'correctionsOpen' | 'assembly'>;
export function WorksheetProgress({ assessments, results, sessions = {}, teacher = false, previewContext }: { assessments: Item[]; results: Record<string, unknown>[]; sessions?: Record<string, ExamSessionProgress>; teacher?: boolean; previewContext: StudentPreviewContext }) {
  const [category, setCategory] = useState('');
  const [area,setArea]=useState('');
  const [scope,setScope]=useState('');
  const [query,setQuery]=useState('');
  const [completion,setCompletion]=useState('');
  const worksheets = assessments.filter(item => worksheetPlacement(item));
  const categories = [...new Set(worksheets.filter(item=>!area||worksheetEducationalArea(worksheetPlacement(item)!)===area).map(item => worksheetPlacement(item)!.category))].sort();
  const filtered=worksheets.filter(item=>{const placement=worksheetPlacement(item)!;const attempts=results.filter(result=>result.assessmentId===item.id);const state=sessions[item.id]&&sessions[item.id].status!=='submitted'?'in-progress':attempts.length?'submitted':'not-started';return (!area||worksheetEducationalArea(placement)===area)&&(!scope||worksheetScope(placement)===scope)&&(!category||placement.category===category)&&(!completion||state===completion)&&[item.title,placement.category,placement.topic,placement.collection].join(' ').toLowerCase().includes(query.toLowerCase().trim());});
  return <section className="sa-workstation" aria-label="Study Hall Worksheets"><h2>Study Hall Worksheets</h2><p>Worksheet completion and responses are separate from full-length exam scores.</p>
    <div className="worksheet-filters"><label>Search worksheets<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Title, topic, or collection"/></label><label>Area<select value={area} onChange={event=>{setArea(event.target.value);setCategory('');}}><option value="">All areas</option>{learningAreas.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Category <select value={category} onChange={event => setCategory(event.target.value)}><option value="">All worksheet categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label><label>Scope<select value={scope} onChange={event=>setScope(event.target.value)}><option value="">All scopes</option><option value="focused">Focused practice</option><option value="mixed">General / Mixed Review</option></select></label><label>Status<select value={completion} onChange={event=>setCompletion(event.target.value)}><option value="">All statuses</option><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="submitted">Submitted</option></select></label><button type="button" onClick={()=>{setQuery('');setArea('');setCategory('');setScope('');setCompletion('');}}>Clear filters</button></div><p role="status">{filtered.length} of {worksheets.length} worksheets</p>
    <div className="sa-table-scroll"><table><thead><tr><th>Worksheet / category</th><th>Status</th><th>First / latest score</th><th>Last activity</th><th>Responses</th></tr></thead><tbody>{filtered.map(item => {
      const placement = worksheetPlacement(item)!;
      const attempts = results.filter(result => result.assessmentId === item.id).sort((a, b) => Date.parse(String(b.completedAt)) - Date.parse(String(a.completedAt)));
      const result = attempts[0];
      const session = sessions[item.id];
      const inProgress = session && session.status !== 'submitted';
      const date = inProgress ? session.updatedAt : typeof result?.completedAt === 'string' ? result.completedAt : null;
      const first=attempts.at(-1);
      return <tr key={item.id}><th scope="row"><AppLink href={appendStudentPreview(worksheetLibraryHref(placement), previewContext)}>{item.title}</AppLink><small>{[worksheetScope(placement)==='mixed'?'General / Mixed Review':'Focused practice',placement.category, placement.topic, placement.collection].filter(Boolean).join(' · ')}</small></th>
        <td>{inProgress ? 'In progress' : result ? 'Submitted' : 'Not started'}</td><td>{first&&<small>First: {String(first.correct??'—')} / {String(first.total??'—')}</small>}{result ? `Latest: ${result.correct ?? '—'} / ${result.total ?? '—'}${typeof result.percentage === 'number' ? ` · ${result.percentage}%` : ''}` : '—'}{result&&<small>{attempts.length} saved {attempts.length===1?'submission':'submissions'}</small>}{inProgress && result && <small>New attempt in progress</small>}</td><td>{date && Number.isFinite(Date.parse(date)) ? new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) : '—'}</td>
        <td>{teacher ? <>
          {attempts.map((attempt, index) => {
            const content = resolveExamContent({ id:item.id, title:item.title, assembly:item.assembly, passages:[], questions:[] });
            const analytics = buildStudentAnalytics([{ result:attempt, content, subjects:(attempt.subjects ?? []) as ExamSubjectResult[], passages:(attempt.passages ?? []) as ExamPassageResult[] }]);
            return <details key={String(attempt.attemptId || attempt.completedAt || index)}><summary>{index === 0 ? 'Latest responses' : 'Earlier submission'} · {analytics.evidence.length} saved</summary>{analytics.evidence.map(row => <div key={row.key}><strong>Question {row.number} · {row.status}</strong><ExamReviewQuestion item={row} /></div>)}{!analytics.evidence.length && <p>Only summary scores were saved for this submission.</p>}</details>;
          })}
          {inProgress && <details><summary>{Object.keys(session.answers).length} answers saved · in progress</summary><p>These answers have not been graded.</p>{getAllExamQuestions(resolveExamContent({ id:item.id, title:item.title, assembly:session.navigation?.activityReleaseId?{publishedReleaseId:session.navigation.activityReleaseId}:item.assembly, passages:[], questions:[] })).filter(question => Object.hasOwn(session.answers, question.id)).map((question, index) => <ExamReviewQuestion key={question.id} showAnswers={false} item={{ question, number:index + 1, section:placement.subject, submittedAnswer:session.answers[question.id] as import("../../../server/src/shared/examGrading").SelectedAnswer, isCorrect:false }} />)}</details>}
          {!result && !inProgress && 'No responses yet'}
        </> : result && (item.correctionsOpen || hasFullyAnsweredExam(result as unknown as ExamResult)) ? <AppLink href={examCorrectionsHref(item.id, previewContext)}>Review responses</AppLink> : <AppLink href={appendStudentPreview(worksheetLibraryHref(placement), previewContext)}>{inProgress ? 'Resume worksheet' : result ? 'Open worksheet' : 'Find worksheet'}</AppLink>}</td></tr>;
    })}</tbody></table></div>{!filtered.length && <p>{worksheets.length?'No worksheets match these filters. Clear filters to see all worksheets.':'No Study Hall worksheets yet.'}</p>}
  </section>;
}
