import { useEffect, useState } from 'react';
import type { DuplicateDecision } from '../../../../server/src/shared/mathDuplicateReview';
import type { MathDuplicateKind } from '../../../../server/src/shared/mathCommandTypes';
import { mathCorrectAnswer } from '../../../../server/src/shared/mathCommandAnalytics';
import { ExamMathQuestion } from '../../components/ExamMathQuestion';
import { ExamAnswer } from '../../components/ExamReviewQuestion';
import { jsonRequest, type MathCommandRequest, type MathQuestionDetail } from './client';

type Pair={left:string;right:string;kind:MathDuplicateKind;reason:string};
type Queue={pairs:Pair[];revision:string;signature:string;lastDecision:DuplicateDecision|null};
export function DuplicateReview({request,onChanged}:{request:MathCommandRequest;onChanged:()=>void}){
  const [queue,setQueue]=useState<Queue>(),[details,setDetails]=useState<{pair:Pair;items:MathQuestionDetail[]}>(),[kind,setKind]=useState('exact');
  const [index,setIndex]=useState(0),[reload,setReload]=useState(0),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{let active=true;
    request<Queue>('/duplicate-review').then(q=>{if(active)setQueue(q)}).catch(e=>{if(active)setError(e.message)});
    return ()=>{active=false};
  },[request,reload]);
  const pairs=queue?.pairs.filter(p=>p.kind===kind)??[],position=Math.min(index,Math.max(0,pairs.length-1)),pair=pairs[position];
  useEffect(()=>{if(!pair)return;let active=true;
    Promise.all([pair.left,pair.right].map(id=>request<MathQuestionDetail>('/catalog/'+encodeURIComponent(id)))).then(items=>{if(active)setDetails({pair,items})}).catch(e=>{if(active)setError(e.message)});
    return ()=>{active=false};
  },[request,pair,reload]);
  async function decide(decision:'link'|'separate'|'undo'){
    if(!queue||busy)return;
    setBusy(true);setError('');
    try{await request('/duplicate-review',jsonRequest('POST',{left:pair?.left,right:pair?.right,decision,revision:queue.revision,signature:queue.signature}));setQueue(undefined);setReload(n=>n+1);onChanged();}
    catch(e){setError((e as Error).message)}finally{setBusy(false)}
  }
  return <section className="mc-panel"><header><h2>Duplicate review</h2></header>
    <p>Compare the wording, figures and keys. Confirming a match gives the bank one entry with both exam appearances and their performance history.</p>
    <label>Match type <select value={kind} onChange={e=>{setKind(e.target.value);setIndex(0)}}>{['exact','possible','template'].map(k=><option key={k} value={k}>{k} ({queue?.pairs.filter(p=>p.kind===k).length??'…'})</option>)}</select></label>
    {error&&<p role="alert">{error} <button onClick={()=>{setError('');setReload(n=>n+1)}}>Reload review</button></p>}
    {!queue&&!error&&<p role="status">Loading comparisons…</p>}
    {queue&&!pair&&<p>No pending {kind} comparisons.</p>}
    {pair&&<><p>{pair.reason}</p><nav aria-label="Comparison navigation"><button disabled={!position||busy} onClick={()=>setIndex(position-1)}>Previous</button> {position+1} of {pairs.length} <button disabled={position+1>=pairs.length||busy} onClick={()=>setIndex(position+1)}>Next</button></nav>
    {details?.pair===pair?<><div className="mc-duplicate-sides">{details.items.map(({record},i)=><article key={record.id}><h3>{i===0?'Bank copy':'Comparison copy'}</h3><small>{record.id}</small><ul>{record.sources.map(s=><li key={s.assessmentId+':'+s.number}>{s.title} · Math Q{s.number}</li>)}</ul><ExamMathQuestion question={record.question} answer="" onChange={()=>{}}/><p><strong>Answer key</strong></p><ExamAnswer question={record.question} answer={mathCorrectAnswer(record.question)??undefined}/></article>)}</div>
      <button className="mc-primary" disabled={busy} onClick={()=>void decide('link')}>Confirm duplicate</button> <button disabled={busy} onClick={()=>void decide('separate')}>Keep separate</button></>:<p>Loading both questions…</p>}</>}
    {queue?.lastDecision&&<details><summary>Last review decision</summary><p>{queue.lastDecision.left} and {queue.lastDecision.right} · {queue.lastDecision.decision==='link'?'Linked':'Kept separate'}</p><button disabled={busy} onClick={()=>void decide('undo')}>Undo last decision</button></details>}
  </section>
}
