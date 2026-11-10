import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ExamQuestion, ExamPassage } from '../content/exams/types';
import { questionDuplicateCandidates, groupDuplicateCandidates } from '../../../server/src/shared/questionDuplicateCandidates';
import { correctExamAnswer } from '../lib/examReviewAnswer';
import { ExamResponse } from './ExamResponse';
import { ExamAnswer, ExamText } from './ExamReviewQuestion';
import '../styles/teacher-question-review.css';

type QuestionSelection = { ids: string[]; onToggle: (id: string, enabled: boolean) => void; disabled?: boolean; onKeepOnly?: (group: string[], keep: string) => void };
function QuestionToggle({id, number, selection}: {id: string; number: number; selection: QuestionSelection}) {
  const enabled = selection.ids.includes(id);
  return <label className={`teacher-question-toggle ${enabled ? 'is-enabled' : 'is-disabled'}`}><input type="checkbox" checked={enabled} disabled={selection.disabled} onChange={event=>selection.onToggle(id,event.target.checked)} />Include Question {number} in this book <strong>{enabled ? 'Enabled' : 'Disabled'}</strong></label>;
}
export function TeacherQuestionPreview({ question, number, showAnswers, passage, selection }: { question: ExamQuestion; number: number; showAnswers: boolean; passage?: ExamPassage; selection?: QuestionSelection }) {
  const instance = useId();
  // A question can appear in both the list and the comparison. Radio names and
  // response labels must be unique to each rendered preview.
  const previewQuestion = {...question, id:`${question.id}-${instance}`};
  const type = question.selectionHtml ? 'Hot text' : question.hotSpot ? 'Hot spot' : question.type.replaceAll('_', ' ');
  return <article className="teacher-question-preview">
    <h3>Question {number} <small>{type}</small></h3>{selection && <QuestionToggle id={question.id} number={number} selection={selection} />}
    <p className="teacher-question-source">{[question.source?.publisher, question.source?.year, question.source?.form, question.source?.sourceQuestion].filter(Boolean).join(' · ') || question.id}</p>
    {passage && <details><summary>Read this question’s passage: {passage.title}</summary>{passage.lines.map((line,index)=><div key={index}><ExamText text={line.text} html={line.html} />{line.image && <img src={line.image.src} alt={line.image.alt} />}</div>)}</details>}
    <fieldset disabled aria-label={`Question ${number} preview`}><h4 id={`math-title-${previewQuestion.id}`}><ExamText text={question.prompt} html={question.promptHtml} /></h4><ExamText text={question.instructions} html={question.instructionsHtml} /><ExamText text={question.stimulus} html={question.stimulusHtml} />{question.image && !question.hotSpot && <img src={question.image.src} alt={question.image.alt} />}<ExamResponse question={previewQuestion} answer={showAnswers ? correctExamAnswer(question) : undefined} onChange={() => {}} standalone /></fieldset>
    {showAnswers && <div className="teacher-question-key"><h4>Correct answer</h4><ExamAnswer question={question} answer={correctExamAnswer(question)} />{(question.explanation || question.explanationHtml) && <><h4>Explanation</h4><ExamText text={question.explanation} html={question.explanationHtml} /></>}</div>}
  </article>;
}


function DuplicateCleanup({questions, groups, passages, selection, showAnswers, onShowAll}: {questions: ExamQuestion[]; groups: ReturnType<typeof groupDuplicateCandidates>; passages?: Record<string, ExamPassage>; selection: QuestionSelection; showAnswers: boolean; onShowAll:()=>void}) {
  const [active,setActive]=useState(0), [notice,setNotice]=useState(''), [expanded,setExpanded]=useState<string[]>([]);
  const heading=useRef<HTMLHeadingElement>(null), previewId=useId();
  const remaining=groups.filter(group=>group.questionIds.filter(id=>selection.ids.includes(id)).length>1).length;
  const group=groups[active], sharedQuestion=questions.find(q=>q.id===group?.questionIds[0]);
  useEffect(()=>{if(active>0){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'nearest'});}},[active]);
  function keep(id:string){if(!group)return;selection.onKeepOnly?.(group.questionIds,id);setNotice('Kept Q'+(questions.findIndex(q=>q.id===id)+1)+' only in group '+(active+1)+'. Save to apply.');if(active<groups.length-1)setActive(active+1);}
  return <section className="teacher-question-review duplicate-cleanup" aria-label="Duplicate cleanup">
    <header><div><h2>Duplicate review</h2><p>{remaining ? remaining+' of '+groups.length+' groups to review' : 'No groups with multiple enabled versions'}</p></div><button type="button" onClick={onShowAll}>All {questions.length} questions</button></header>
    <p className="duplicate-help">Choose one version to keep, or use the checkboxes to keep several. Preview to compare wording, answers and passages.</p>
    {notice && <p className="duplicate-notice" role="status">{notice}</p>}
    {group ? <><nav className="duplicate-group-nav" aria-label="Duplicate groups"><label>Group <select aria-label="Duplicate group" value={active} onChange={event=>setActive(Number(event.target.value))}>{groups.map((item,index)=>{const enabled=item.questionIds.filter(id=>selection.ids.includes(id)).length;return <option key={index} value={index}>{index+1} of {groups.length} · {enabled>1 ? enabled+' enabled' : enabled===1 ? '1 kept' : 'all disabled'}</option>;})}</select></label><div><button type="button" disabled={!active} onClick={()=>setActive(active-1)}>Previous</button><button type="button" disabled={active>=groups.length-1} onClick={()=>setActive(active+1)}>Next</button></div></nav>
    <h3 ref={heading} tabIndex={-1} className="duplicate-shared-prompt"><ExamText text={sharedQuestion?.prompt} html={sharedQuestion?.promptHtml}/></h3>
    <div className="duplicate-version-options">{group.questionIds.slice().sort((a,b)=>questions.findIndex(q=>q.id===a)-questions.findIndex(q=>q.id===b)).map(id=>{
      const question=questions.find(q=>q.id===id)!,number=questions.indexOf(question)+1,enabled=selection.ids.includes(id),open=expanded.includes(id);
      const version=passages?.[id]?.versionLabel || [question.source?.year,question.source?.form].filter(Boolean).join(' · ');
      const source=[question.source?.publisher,version].filter(Boolean).join(' · ') || 'Source version '+number;
      const type=question.selectionHtml ? 'Hot text' : question.hotSpot ? 'Hot spot' : question.type.replaceAll('_',' ');
      return <article key={id} className={enabled?'is-enabled':'is-disabled'}>
        <label className="duplicate-version-toggle"><input type="checkbox" aria-label={'Include Question '+number+' in this book'} checked={enabled} disabled={selection.disabled} onChange={event=>selection.onToggle(id,event.target.checked)}/><span><strong>Q{number}</strong><small>{enabled?'Enabled':'Disabled'}</small></span></label>
        <div className="duplicate-version-source"><strong>{source}</strong><small>{type}</small></div>
        <button type="button" className="duplicate-keep" disabled={selection.disabled} aria-label={'Keep Q'+number+' only'+(active<groups.length-1?' & next':'')} onClick={()=>keep(id)}>Keep only{active<groups.length-1?' & next':''}</button>
        <button type="button" className="duplicate-preview-button" aria-label={(open?'Close':'Preview')+' Question '+number} aria-expanded={open} aria-controls={previewId+'-'+number} onClick={()=>setExpanded(current=>open ? current.filter(value=>value!==id) : [...current,id])}>{open?'Close':'Preview'}</button>
        <div id={previewId+'-'+number} hidden={!open} className="duplicate-expanded-preview">{open&&<TeacherQuestionPreview question={question} number={number} passage={passages?.[id]} showAnswers={showAnswers}/>}</div>
      </article>;
    })}</div></> : <p>No potential duplicates found.</p>}
  </section>;
}

export function TeacherQuestionReview({ questions, showAnswers, passages, selection, visibleQuestionIds }: { questions: ExamQuestion[]; showAnswers: boolean; passages?: Record<string, ExamPassage>; selection?: QuestionSelection; visibleQuestionIds?: string[] }) {
  const candidates = useMemo(() => questionDuplicateCandidates(questions, passages), [questions, passages]);
  const groups = useMemo(() => groupDuplicateCandidates(candidates), [candidates]);
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);
  const [showAll,setShowAll]=useState(false);
  const [selected, setSelected] = useState('');
  const flagged = new Set(candidates.flatMap(pair => [pair.left, pair.right]));
  const pair = candidates.find(pair => JSON.stringify([pair.left, pair.right]) === selected);
  if(selection?.onKeepOnly && !showAll)return <DuplicateCleanup questions={questions} groups={groups} passages={passages} selection={selection} showAnswers={showAnswers} onShowAll={()=>setShowAll(true)}/>;
  return <section className="teacher-question-review" aria-label="Questions and potential duplicates">
    {selection?.onKeepOnly && <button type="button" onClick={()=>setShowAll(false)}>Back to duplicate cleanup</button>}
    <header><h2>Questions & potential duplicates</h2><p>{questions.length} questions · {flagged.size} flagged · {groups.length} potential duplicate groups</p><p>{selection ? "Uncheck unwanted versions beside their previews, then Save book questions to apply your changes." : "Compare suggestions before deciding whether to keep each question."}</p>
      <label><input type="checkbox" checked={onlyDuplicates} onChange={event => setOnlyDuplicates(event.target.checked)} /> Show potential duplicates only</label>
    </header>
    {candidates.length > 0 && <div className="teacher-duplicate-list" aria-label="Duplicate groups">{groups.map((group,index)=><details key={group.questionIds.join("|")} open={index===0}><summary>Compare {group.questionIds.map(id=>questions.findIndex(question=>question.id===id)+1).sort((a,b)=>a-b).map(number=>`Q${number}`).join(", ")}{selection && <small> · {group.questionIds.filter(id=>selection.ids.includes(id)).length} enabled</small>}</summary><div className="teacher-duplicate-pairs">{group.pairs.map(candidate => {
      const key = JSON.stringify([candidate.left, candidate.right]);
      return <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(selected === key ? '' : key)}>{candidate.kind === 'exact' ? 'Exact match' : 'Likely match'}: Q{questions.findIndex(question => question.id === candidate.left) + 1} & Q{questions.findIndex(question => question.id === candidate.right) + 1}</button>;
    })}</div></details>)}</div>}
    {pair && <section aria-label="Side-by-side question comparison"><p><strong>{pair.kind === 'exact' ? 'Exact content match' : `${pair.score}% text similarity`}</strong> · {pair.reason}</p><div className="teacher-question-comparison">{[pair.left, pair.right].map(id => <TeacherQuestionPreview selection={selection} key={id} passage={passages?.[id]} question={questions.find(question => question.id === id)!} number={questions.findIndex(question => question.id === id) + 1} showAnswers={showAnswers} />)}</div><button type="button" onClick={() => setSelected('')}>Close comparison</button></section>}
    {questions.map((question, index) => (!visibleQuestionIds || visibleQuestionIds.includes(question.id)) && (!onlyDuplicates || flagged.has(question.id)) && <div key={question.id} className="teacher-question-row">{selection && <QuestionToggle id={question.id} number={index+1} selection={selection} />}<details className="teacher-question-disclosure"><summary>Question {index + 1}{flagged.has(question.id) ? ' · Potential duplicate' : ''} · {question.prompt.replace(/<[^>]*>/g, '').slice(0,140)}</summary><TeacherQuestionPreview passage={passages?.[question.id]} question={question} number={index + 1} showAnswers={showAnswers} /></details></div>)}
    {onlyDuplicates && !candidates.length && <p>No potential duplicates found in this passage.</p>}
  </section>;
}
