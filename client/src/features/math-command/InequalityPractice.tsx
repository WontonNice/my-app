import { flushPracticeAccount, usePracticeAccount } from './usePracticeAccount';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAccountProfile } from '../account/account';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { moduleGeneratorIds, practiceGenerators, practiceModules, type PracticeModule } from '../../../../server/src/shared/infinitePractice';
import { isExamQuestionCorrect } from '../../../../server/src/shared/examGrading';
import { ExamSessionPage, type ExamGameSession } from '../../pages/ExamSessionPage';
import { appendStudentPreview, getStudentPreviewContext } from '../../lib/studentPreview';
import { checkPracticeAnswer, currentPracticeGeneratorId, createPracticeState, formatPracticeTime, nextPracticeQuestion, practiceSummary } from './inequalitySession';
import { useInfinitePracticeSession } from './useInfinitePracticeSession';
import { browsePreviewGeneration, practiceQuestion, previewCorrectAnswer, simulatePreviewAnswers } from './practicePreview';
import { ExamAnswer } from '../../components/ExamReviewQuestion';
import './math-player.css';
import '../../styles/study-hall-navigation.css';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type ManagedPracticeModule, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import { PracticeModuleList } from './PracticeModuleList';
import { PracticeFeedback, PracticeStats } from './PracticeFeedback';
import { PracticeStars } from './PracticeStars';
import { readPracticeProgress, readSavedPractice } from './practiceSessionStorage';

type PracticeProps = { onClose?: () => void; renderOverview?: (overview: ReactNode) => ReactNode; initialModuleId?: string; catalog?:PracticeCatalog; initialSelection?:PracticeSelection; initialStartNew?:boolean; previewOnly?:boolean; presentation?:'fullscreen'|'mini' };
export function InequalityPractice(props:PracticeProps) {
  const {profile,error}=useAccountProfile(),context=getStudentPreviewContext();
  const owner=props.previewOnly?'generator-preview':context.isPreview?'preview:'+context.mode+':'+(context.studentId||'teacher'):profile?.id;
  const accountOwner = props.previewOnly || context.isPreview ? undefined : owner;
  const sync = usePracticeAccount(accountOwner);
  if(accountOwner && sync==='loading')return <p role="status">Loading saved streaks…</p>;
  if(accountOwner && sync==='unavailable' && props.initialModuleId && !props.initialStartNew) {
    let cached;
    try { cached=readSavedPractice(localStorage,accountOwner,props.initialModuleId); } catch { /* Account sync will retry. */ }
    if(!cached)return <div role="status"><p>Reconnect to check your saved streak before starting this module.</p>{props.onClose&&<button onClick={props.onClose}>Back to practice</button>}</div>;
  }
  if(!owner)return <p role="status">{error||'Loading your practice session…'}</p>;
  return <PracticeContent key={owner} {...props} owner={owner} sync={accountOwner ? sync : undefined}/>;
}
function PracticeContent({ onClose, renderOverview, initialModuleId, catalog, initialSelection, initialStartNew=false, previewOnly=false, presentation='fullscreen',owner,sync }: PracticeProps & {owner:string;sync?:ReturnType<typeof usePracticeAccount>}) {
  const mini=previewOnly&&presentation==='mini',previewRef=useRef<HTMLElement>(null);
  const { session: state, update, save, saveError, resume, personalBest } = useInfinitePracticeSession(initialModuleId,catalog,initialSelection,!previewOnly,owner,initialStartNew);
  const [previewMode, setPreviewMode] = useState<'browse'|'streak'>('browse');
  const [choosing, setChoosing] = useState(false);
  const playing = Boolean(state && !state.finished && !choosing);
  useEffect(() => { if (!onClose||mini) return; const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = before; }; }, [onClose,mini]);
  useEffect(()=>{if(mini)previewRef.current?.focus({preventScroll:true});},[mini]);
  const leave = () => onClose ? onClose() : window.location.assign(appendStudentPreview('/study-hall/shsat/materials?subject=math'));
  const saveAndExit = async () => {
    if(!save())return;
    if(sync && state)await flushPracticeAccount(owner,state.moduleId);
    leave();
  };
  const end = () => update(previous => previous ? { ...previous, finished: true } : previous);
  const start = (id: string,selection:PracticeSelection={},startNew=false) => { update(() => (!previewOnly&&!startNew?resume(id):null)??createPracticeState(id, crypto.randomUUID().slice(0, 8),catalog,selection)); setChoosing(false); };
  const modules=catalog?catalog.modules.filter(module=>module.published):practiceModules;
  const module = state?.moduleTitle?{title:state.moduleTitle==='All Question Types'?'General Practice':state.moduleTitle}:modules.find(item => item.id === state?.moduleId);
  const foundation=state?.practiceMode==='foundation'||Boolean(state&&catalog&&practiceModuleKind(catalog.modules.find(item=>item.id===state.moduleId)??{id:state.moduleId} as ManagedPracticeModule)==='foundation');
  const moduleRecords=(currentOnly=false)=><div className="mc-module-records" aria-label="Module progress">{Object.keys(state?.moduleGeneratorIds??{}).filter(id=>!currentOnly||state?.moduleGeneratorIds?.[id].includes(currentPracticeGeneratorId(state))).map(id=>{
    let best=state?.moduleLongestStreaks?.[id]??0;
    try{if(!previewOnly)best=Math.max(best,readPracticeProgress(localStorage,owner,id).longestStreak);}catch{/* Session record remains visible without storage. */}
    return <div className="mc-module-record" key={id}><span>{state?.moduleTitles?.[id]??id} · {state?.moduleStreaks?.[id]??0} in a row</span><PracticeStars longestStreak={best} step={5} compact label={state?.moduleTitles?.[id]??id}/></div>;
  })}</div>;
  const card = (item: PracticeModule|ManagedPracticeModule) => {
    const ids = 'generatorIds' in item?managedGeneratorIds(item,catalog!):moduleGeneratorIds(item);
    return <article className="mc-practice-module" key={item.id}><h3>{item.title}</h3><p>{item.description}</p><ul>{(catalog?.generators??practiceGenerators).filter(generator => ids.includes(generator.id)).map(generator => <li key={generator.id}>{generator.title}</li>)}</ul><button disabled={!ids.length} onClick={() => start(item.id)}>Start {item.title}</button></article>;
  };
  let body;
  if (!state || choosing) {
    body = catalog?<main className="mc-practice-hub"><header><button className="mc-practice-back" onClick={leave}>← Back</button><p>Math · No calculator</p><h1>Infinite practice</h1><p>Choose a module. Use Foundation Building settings to choose which modules to practice.</p></header><PracticeModuleList catalog={catalog} previewContext={getStudentPreviewContext()} onStart={start}/></main>:<main className="mc-practice-hub"><header><button className="mc-practice-back" onClick={leave}>← Back</button><p>Math · No calculator</p><h1>Infinite practice</h1><p>Choose a module and practice at your own pace.</p></header><div className="mc-practice-module-grid">{modules.filter(item => 'selection' in item?!Array.isArray(item.selection):item.includeAll||item.id==='foundation').map(card)}</div><section><h2>Targeted practice</h2><p>Focus on a specific question type.</p><div className="mc-practice-module-grid">{modules.filter(item => 'selection' in item?Array.isArray(item.selection):!item.includeAll&&item.id!=='foundation').map(card)}</div><p className="mc-practice-note">More targeted modules will appear here as they are added.</p></section></main>;
  } else if (state.finished) {
    const summary = practiceSummary(state);
    body = <main className="mc-practice-hub mc-practice-summary"><header><p>Practice complete</p><h1>{module?.title}</h1><p>{state.checked} question{state.checked === 1 ? '' : 's'} checked · {state.correct} correct</p></header>{foundation?moduleRecords():<PracticeStars longestStreak={personalBest} step={state.practiceMode==='focused'?5:10}/>}<dl className="mc-practice-metrics"><div><dt>Accuracy</dt><dd>{summary.accuracy}</dd></div><div><dt>Best streak</dt><dd>{summary.longestStreak}</dd></div><div><dt>Average time per question</dt><dd>{summary.averageMs === null ? '—' : formatPracticeTime(summary.averageMs)}</dd></div><div><dt>Total time spent</dt><dd>{formatPracticeTime(summary.totalMs)}</dd></div></dl><p className="mc-practice-note">Accuracy and average time include checked answers only. Total time includes feedback and unfinished questions, and pauses while this tab is hidden.</p>{!state.submitted && (state.answer || state.questionMs > 0) && <p className="mc-practice-note">Your unfinished question was not scored.</p>}<div className="mc-practice-summary-actions"><button disabled={!modules.some(item=>item.id===state.moduleId)} onClick={() => start(state.moduleId,state.moduleSelection)}>Practice this module again</button><button onClick={() => initialModuleId && onClose ? onClose() : setChoosing(true)}>Choose another module</button><button className="mc-practice-back" onClick={leave}>Back to Study Hall</button></div></main>;
  } else {
    const question = practiceQuestion(state);
    const correct = state.submitted ? isExamQuestionCorrect(question, state.answer) : undefined;
    const title = `${previewOnly ? 'Preview: ' : ''}${module?.title || 'Infinite practice'}`;
    const exam: ExamGameSession = {
      assessment: { id: 'infinite-practice', title, classId: 'shsat', createdAt: '', updatedAt: '', description: '', durationMinutes: 0, allowCompletedAccess: false, passages: [], questions: [], sectionAccess: { english: false, math: true }, split: false, status: 'open' },
      content: { assessmentId: 'infinite-practice', title, passageSets: [], mathSection: { id: state.moduleId, label: 'Math', questionCount: 1, questions: [question], directions: { subject: 'Mathematics', title: '', body: '', notes: [] } } },
      screen: 'mathQuestion', studentName: '', timerText: '', subjectPosition: { current: (previewOnly&&previewMode==='browse'?(state.sequenceIndex??state.index):state.index) + 1, total: 0 },
      answers: state.answer ? { [question.id]: state.answer } : {}, lockedQuestionIds: state.submitted ? [question.id] : [],
      onAnswersChange: answers => { const answer = answers[question.id] ?? ''; update(previous => previous && !previous.submitted ? { ...previous, answer } : previous); },
      onSubmit: async () => { update(previous => previous ? previous.submitted ? nextPracticeQuestion(previous) : checkPracticeAnswer(previous, isExamQuestionCorrect(question, previous.answer)) : previous); return true; },
      practice: {
        onExit: previewOnly ? leave : saveAndExit,
        exitLabel: previewOnly ? 'Close preview' : 'Save and exit',
        result: correct === undefined ? undefined : correct ? 'correct' : 'incorrect',
        stats: <><PracticeStats state={state} correct={correct} personalBest={personalBest} showStars={!foundation}/>{!previewOnly&&<button className="mc-practice-save" type="button" onClick={saveAndExit}>Save and exit</button>}</>,
        feedback: correct===undefined?null:<PracticeFeedback question={question} correct={correct}/>,
        controls: (!previewOnly||previewMode==='streak')&&<section className="mc-session-options" aria-label="Session progress">
          {foundation?moduleRecords(true):<p>This question type: {state.generatorStreaks?.[currentPracticeGeneratorId(state)]??0} correct in a row</p>}
          {previewOnly?<p>Preview session · progress is not saved</p>:<p role="status">{(sync==='offline'||sync==='unavailable')?'Saved on this device. Account sync will retry.':sync==='saving'?'Saving streaks to your account…':sync==='saved'?'Streaks saved to your account':'Saved on this device'}</p>}
          <button className="mc-session-finish" type="button" onClick={end}>Finish session</button>
          {saveError&&<p role="alert">{saveError}</p>}
        </section>,
      },
    };
    body = <>{previewOnly&&<section className="mc-preview-tools" aria-label="Preview tools">
      <div className="mc-preview-toolbar"><div role="group" aria-label="Preview mode">{(['browse','streak'] as const).map(mode=><button type="button" key={mode} aria-pressed={previewMode===mode} onClick={()=>{if(mode!==previewMode){setPreviewMode(mode);update(previous=>previous?browsePreviewGeneration(previous,previous.sequenceIndex??previous.index):previous);}}}>{mode==='browse'?'Browse generations':'Test streaks'}</button>)}</div><span>Generation {(state.sequenceIndex??state.index)+1} · {(state.generatorDefinitions?.find(generator=>generator.id===currentPracticeGeneratorId(state))?.title??practiceGenerators.find(generator=>generator.id===currentPracticeGeneratorId(state))?.title)}</span></div>
      {previewMode==='browse'?<div className="mc-preview-toolbar"><button type="button" disabled={(state.sequenceIndex??state.index)===0} onClick={()=>update(previous=>previous?browsePreviewGeneration(previous,(previous.sequenceIndex??previous.index)-1):previous)}>← Previous generation</button><button type="button" onClick={()=>update(previous=>previous?browsePreviewGeneration(previous,(previous.sequenceIndex??previous.index)+1):previous)}>Next generation →</button><small>Switching modes starts a fresh preview session.</small></div>:<div className="mc-preview-toolbar"><button type="button" onClick={()=>update(previous=>previous?simulatePreviewAnswers(previous,1,true):previous)}>Simulate correct</button><button type="button" onClick={()=>update(previous=>previous?simulatePreviewAnswers(previous,1,false):previous)}>Simulate incorrect</button><button type="button" onClick={()=>update(previous=>previous?simulatePreviewAnswers(previous,10,true):previous)}>Simulate 10 correct</button><button type="button" onClick={()=>update(previous=>previous?browsePreviewGeneration(previous,0):previous)}>Reset streak test</button><small>Or answer below to test streaks and module stars.</small></div>}
      <div className="mc-preview-answer"><strong>Correct answer</strong><ExamAnswer question={question} answer={previewCorrectAnswer(question)}/></div>
    </section>}<ExamSessionPage key={state.seed} gameSession={exam} /></>;
  }
  const content = <section ref={previewRef} tabIndex={mini?-1:undefined} className={mini?'mc-exam-mini mc-infinite-page':onClose ? 'mc-exam-viewer mc-infinite-page' : 'mc-infinite-page'} role={mini?'region':onClose ? 'dialog' : undefined} aria-modal={onClose&&!mini ? true : undefined} aria-label={previewOnly ? 'Generated question preview' : 'Infinite math practice'} onKeyDown={event => { if (event.key === 'Escape' && (previewOnly || !playing)) {event.stopPropagation();onClose?.();} }}>{mini?<><header className="mc-mini-heading"><strong>Question preview</strong><button aria-label="Close question preview" onClick={onClose} type="button"><X size={18}/></button></header><div className="mc-mini-viewport">{body}</div></>:body}</section>;
  return onClose ? createPortal(content, document.body) : !playing && renderOverview ? renderOverview(content) : content;
}
