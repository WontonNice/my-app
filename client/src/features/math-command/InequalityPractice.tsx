import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { generatePracticeQuestion, moduleGeneratorIds, practiceGenerators, practiceModules, type PracticeModule } from '../../../../server/src/shared/infinitePractice';
import { isExamQuestionCorrect } from '../../../../server/src/shared/examGrading';
import { ExamSessionPage, type ExamGameSession } from '../../pages/ExamSessionPage';
import { appendStudentPreview, getStudentPreviewContext } from '../../lib/studentPreview';
import { checkPracticeAnswer, createPracticeState, formatPracticeTime, nextPracticeQuestion, practiceSummary } from './inequalitySession';
import { useInfinitePracticeSession } from './useInfinitePracticeSession';
import './math-player.css';
import '../../styles/study-hall-navigation.css';
import { generateCatalogQuestion, managedGeneratorIds, type PracticeCatalog, type ManagedPracticeModule, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import { PracticeModuleList } from './PracticeModuleList';
import { PracticeFeedback, PracticeStats } from './PracticeFeedback';

export function InequalityPractice({ onClose, renderOverview, initialModuleId, catalog, initialSelection, previewOnly=false, presentation='fullscreen' }: { onClose?: () => void; renderOverview?: (overview: ReactNode) => ReactNode; initialModuleId?: string; catalog?:PracticeCatalog; initialSelection?:PracticeSelection; previewOnly?:boolean; presentation?:'fullscreen'|'mini' }) {
  const mini=previewOnly&&presentation==='mini',previewRef=useRef<HTMLElement>(null);
  const { session: state, update } = useInfinitePracticeSession(initialModuleId,catalog,initialSelection,!previewOnly);
  const [choosing, setChoosing] = useState(false);
  const playing = Boolean(state && !state.finished && !choosing);
  useEffect(() => { if (!onClose||mini) return; const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = before; }; }, [onClose,mini]);
  useEffect(()=>{if(mini)previewRef.current?.focus({preventScroll:true});},[mini]);
  const leave = () => onClose ? onClose() : window.location.assign(appendStudentPreview('/study-hall/shsat/materials?subject=math'));
  const end = () => update(previous => previous ? { ...previous, finished: true } : previous);
  const start = (id: string,selection:PracticeSelection={}) => { update(() => createPracticeState(id, crypto.randomUUID().slice(0, 8),catalog,selection)); setChoosing(false); };
  const modules=catalog?catalog.modules.filter(module=>module.published):practiceModules;
  const module = state?.moduleTitle?{title:state.moduleTitle==='All Question Types'?'General Practice':state.moduleTitle}:modules.find(item => item.id === state?.moduleId);
  const card = (item: PracticeModule|ManagedPracticeModule) => {
    const ids = 'generatorIds' in item?managedGeneratorIds(item,catalog!):moduleGeneratorIds(item);
    return <article className="mc-practice-module" key={item.id}><h3>{item.title}</h3><p>{item.description}</p><ul>{(catalog?.generators??practiceGenerators).filter(generator => ids.includes(generator.id)).map(generator => <li key={generator.id}>{generator.title}</li>)}</ul><button disabled={!ids.length} onClick={() => start(item.id)}>Start {item.title}</button></article>;
  };
  let body;
  if (!state || choosing) {
    body = catalog?<main className="mc-practice-hub"><header><button className="mc-practice-back" onClick={leave}>← Back</button><p>Math · No calculator</p><h1>Infinite practice</h1><p>Choose a module. Use Settings to customize your practice.</p></header><PracticeModuleList catalog={catalog} previewContext={getStudentPreviewContext()} onStart={start}/></main>:<main className="mc-practice-hub"><header><button className="mc-practice-back" onClick={leave}>← Back</button><p>Math · No calculator</p><h1>Infinite practice</h1><p>Choose a module and practice at your own pace.</p></header><div className="mc-practice-module-grid">{modules.filter(item => 'selection' in item?!Array.isArray(item.selection):item.includeAll||item.id==='foundation').map(card)}</div><section><h2>Targeted practice</h2><p>Focus on a specific question type.</p><div className="mc-practice-module-grid">{modules.filter(item => 'selection' in item?Array.isArray(item.selection):!item.includeAll&&item.id!=='foundation').map(card)}</div><p className="mc-practice-note">More targeted modules will appear here as they are added.</p></section></main>;
  } else if (state.finished) {
    const summary = practiceSummary(state);
    body = <main className="mc-practice-hub mc-practice-summary"><header><p>Practice complete</p><h1>{module?.title}</h1><p>{state.checked} question{state.checked === 1 ? '' : 's'} checked · {state.correct} correct</p></header><dl className="mc-practice-metrics"><div><dt>Accuracy</dt><dd>{summary.accuracy}</dd></div><div><dt>Best streak</dt><dd>{summary.longestStreak}</dd></div><div><dt>Average time per question</dt><dd>{summary.averageMs === null ? '—' : formatPracticeTime(summary.averageMs)}</dd></div><div><dt>Total time spent</dt><dd>{formatPracticeTime(summary.totalMs)}</dd></div></dl><p className="mc-practice-note">Accuracy and average time include checked answers only. Total time includes feedback and unfinished questions, and pauses while this tab is hidden.</p>{!state.submitted && (state.answer || state.questionMs > 0) && <p className="mc-practice-note">Your unfinished question was not scored.</p>}<div className="mc-practice-summary-actions"><button disabled={!modules.some(item=>item.id===state.moduleId)} onClick={() => start(state.moduleId,state.moduleSelection)}>Practice this module again</button><button onClick={() => initialModuleId && onClose ? onClose() : setChoosing(true)}>Choose another module</button><button className="mc-practice-back" onClick={leave}>Back to Study Hall</button></div></main>;
  } else {
    const definition=state.generatorDefinitions?.find(generator=>generator.id===state.generatorIds[state.index%state.generatorIds.length]);
    const question = definition?generateCatalogQuestion(definition,Math.floor(state.index/state.generatorIds.length),state.seed):generatePracticeQuestion(state.generatorIds, state.index, state.seed);
    const correct = state.submitted ? isExamQuestionCorrect(question, state.answer) : undefined;
    const title = `${previewOnly ? 'Preview: ' : ''}${module?.title || 'Infinite practice'}`;
    const exam: ExamGameSession = {
      assessment: { id: 'infinite-practice', title, classId: 'shsat', createdAt: '', updatedAt: '', description: '', durationMinutes: 0, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: false, math: true }, split: false, status: 'open' },
      content: { assessmentId: 'infinite-practice', title, passageSets: [], mathSection: { id: state.moduleId, label: 'Math', questionCount: 1, questions: [question], directions: { subject: 'Mathematics', title: '', body: '', notes: [] } } },
      screen: 'mathQuestion', studentName: '', timerText: '', subjectPosition: { current: state.index + 1, total: 0 },
      answers: state.answer ? { [question.id]: state.answer } : {}, lockedQuestionIds: state.submitted ? [question.id] : [],
      onAnswersChange: answers => { const answer = answers[question.id] ?? ''; update(previous => previous && !previous.submitted ? { ...previous, answer } : previous); },
      onSubmit: async () => { update(previous => previous ? previous.submitted ? nextPracticeQuestion(previous) : checkPracticeAnswer(previous, isExamQuestionCorrect(question, previous.answer)) : previous); return true; },
      practice: {
        onExit: previewOnly ? leave : end,
        exitLabel: previewOnly ? 'Close preview' : 'End practice',
        result: correct === undefined ? undefined : correct ? 'correct' : 'incorrect',
        stats: <PracticeStats state={state} correct={correct}/>,
        feedback: correct === undefined ? null : <PracticeFeedback question={question} correct={correct}/>,
      },
    };
    body = <ExamSessionPage key={state.seed} gameSession={exam} />;
  }
  const content = <section ref={previewRef} tabIndex={mini?-1:undefined} className={mini?'mc-exam-mini mc-infinite-page':onClose ? 'mc-exam-viewer mc-infinite-page' : 'mc-infinite-page'} role={mini?'region':onClose ? 'dialog' : undefined} aria-modal={onClose&&!mini ? true : undefined} aria-label={previewOnly ? 'Generated question preview' : 'Infinite math practice'} onKeyDown={event => { if (event.key === 'Escape' && (previewOnly || !playing)) {event.stopPropagation();onClose?.();} }}>{mini?<><header className="mc-mini-heading"><strong>Question preview</strong><button aria-label="Close question preview" onClick={onClose} type="button"><X size={18}/></button></header><div className="mc-mini-viewport">{body}</div></>:body}</section>;
  return onClose ? createPortal(content, document.body) : !playing && renderOverview ? renderOverview(content) : content;
}
