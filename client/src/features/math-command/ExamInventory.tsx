import { useEffect, useState } from 'react';
import { AddToGeneratorPlanner } from './AddToGeneratorPlanner';
import { type MathCommandRequest } from './client';
import type { ExamInventoryRow, QuestionRate } from '../../../../server/src/shared/examInventory';

export function ExamInventory({request,studio}:{request:MathCommandRequest;studio:boolean}){
  const [exams,setExams]=useState<{id:string;title:string}[]>([]),[exam,setExam]=useState('');
  const [rows,setRows]=useState<ExamInventoryRow[]>(),[rates,setRates]=useState<Record<string,QuestionRate>>();
  const [subject,setSubject]=useState(''),[category,setCategory]=useState(''),[subcategory,setSubcategory]=useState('');
  const [error,setError]=useState(''),[rateError,setRateError]=useState(''),[retry,setRetry]=useState(0);
  useEffect(()=>{
    let active=true;
    request<{exams:typeof exams}>('/exam-inventory').then(data=>{if(active)setExams(data.exams)}).catch(e=>{if(active)setError(e.message)});
    return ()=>{active=false};
  },[request,retry]);
  useEffect(()=>{
    if(!exam)return;
    let active=true;const query='?exam='+encodeURIComponent(exam);
    request<{rows:ExamInventoryRow[]}>('/exam-inventory'+query).then(data=>{if(active)setRows(data.rows)}).catch(e=>{if(active)setError(e.message)});
    request<{rates:Record<string,QuestionRate>}>('/exam-question-rates'+query).then(data=>{if(active)setRates(data.rates)}).catch(e=>{if(active)setRateError(e.message)});
    return ()=>{active=false};
  },[request,exam,retry]);
  const bySubject=(rows??[]).filter(r=>!subject||r.subject===subject);
  const byCategory=bySubject.filter(r=>!category||r.category===category);
  const visible=byCategory.filter(r=>!subcategory||r.subcategory===subcategory);
  function options(values:string[]){return [...new Set(values.filter(Boolean))].sort().map(v=><option key={v}>{v}</option>)}
  return <section className="mc-panel mc-exam-inventory"><h2>Exam questions</h2>
    <div className="mc-inventory-filters"><label>Select exam<select aria-label="Select exam" value={exam} onChange={e=>{setExam(e.target.value);setRows(undefined);setRates(undefined);setError('');setRateError('');setCategory('');setSubcategory('')}}><option value="">Choose an exam</option>{exams.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}</select></label>
    <label>Subject<select aria-label="Subject" value={subject} onChange={e=>{setSubject(e.target.value);setCategory('');setSubcategory('')}}><option value="">English and math</option><option>English</option><option>Math</option></select></label>
    <label>Category<select aria-label="Category" value={category} onChange={e=>{setCategory(e.target.value);setSubcategory('')}}><option value="">All categories</option>{options(bySubject.map(r=>r.category))}</select></label>
    <label>Subcategory<select aria-label="Subcategory" value={subcategory} onChange={e=>setSubcategory(e.target.value)}><option value="">All subcategories</option>{options(byCategory.map(r=>r.subcategory))}</select></label></div>
    {(error||rateError)&&<p role="alert">{error||'Student performance could not be loaded. '+rateError} <button onClick={()=>{setRetry(n=>n+1);setError('');setRateError('')}}>Retry</button></p>}
    {exam&&!rows&&!error&&<p role="status">Loading questions…</p>}
    {rows&&<><p>{visible.length} questions. Percent correct counts each student’s first scored response across linked appearances. Blank and pending responses are excluded.</p>
    <div className="mc-inventory-scroll"><table><thead><tr>{['Question','Category','Subcategory','Skill','Students correct','Planner','TEI'].map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{visible.map(r=>{
      const rate=rates?.[r.id];return <tr key={r.subject+r.number}><th scope="row"><small>{r.subject} · Q{r.number}</small>{r.prompt||r.id}</th><td>{r.category||'—'}</td><td>{r.subcategory||'—'}</td><td>{r.skill||'Unclassified'}</td><td>{rate?Math.round(100*rate.correct/rate.total)+'% ('+rate.correct+'/'+rate.total+')':rates?'No graded responses':rateError?'Unavailable':'Loading…'}</td><td>{r.subject==='Math'?<AddToGeneratorPlanner studio={studio} request={request} questionIds={[r.plannerId]}/>: '—'}</td><td>{r.tei?'Yes':'No'}</td></tr>
    })}</tbody></table></div>{!visible.length&&<p>No questions match these filters.</p>}</>}
  </section>
}
