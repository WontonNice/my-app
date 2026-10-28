import { useState } from 'react';
import type { PracticeCatalog, PracticeGeneratorDefinition } from '../../../../server/src/shared/practiceCatalog';
import { practiceDifficulties, practicePrograms } from '../../../../server/src/shared/practiceOrganization';
import type { GeneratorFilters } from './studioOrganization';
import type { MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';

type Taxonomy={label:string;topics:string[]}[];
const title=(value:string)=>value[0].toUpperCase()+value.slice(1);
export function GeneratorLibraryTools({catalog,filters,onFilters,sort,onSort,classificationSkills=[]}:{catalog:PracticeCatalog;filters:GeneratorFilters;onFilters:(filters:GeneratorFilters)=>void;sort:string;onSort:(sort:string)=>void;classificationSkills?:MathClassificationSkill[]}) {
  return <div className="ps-library-filters" aria-label="Generator library filters">
    <label>Skilled<select value={filters.skilled??''} onChange={event=>onFilters({...filters,skilled:event.target.value})}><option value="">All Skilled</option><option value="TBD">TBD</option>{classificationSkills.map(skill=><option key={skill.id} value={skill.id}>{skill.label} · {skill.subcategory}</option>)}</select></label>
    <label>Status<select value={filters.status} onChange={event=>onFilters({...filters,status:event.target.value})}>
      <option value="">All statuses</option><option value="enabled">Enabled</option><option value="disabled">Disabled</option><option value="unreviewed">Unreviewed</option><option value="in-review">In review</option><option value="approved">Approved</option><option value="unused">No focused module</option>
    </select></label>
    <label>Difficulty<select value={filters.difficulty} onChange={event=>onFilters({...filters,difficulty:event.target.value})}><option value="">All difficulties</option>{practiceDifficulties.map(value=><option key={value} value={value}>{title(value)}</option>)}</select></label>
    <label>Program<select value={filters.program} onChange={event=>onFilters({...filters,program:event.target.value})}><option value="">All programs</option>{practicePrograms.map(value=><option key={value}>{value}</option>)}</select></label>
    <label>Subject<select value={filters.subject} onChange={event=>onFilters({...filters,subject:event.target.value})}><option value="">All subjects</option>{[...new Set(catalog.generators.map(item=>item.subject??'Math'))].sort().map(value=><option key={value}>{value}</option>)}</select></label>
    <label>Sort<select value={sort} onChange={event=>onSort(event.target.value)}><option value="manual">Manual order</option><option value="title">Title A–Z</option><option value="review">Review status</option></select></label>
    {Object.values(filters).some(Boolean)&&<button onClick={()=>onFilters({status:'',difficulty:'',program:'',subject:''})}>Reset library filters</button>}
  </div>;
}

export function GeneratorBulkActions({count,taxonomy,onApply,onClear}:{count:number;taxonomy:Taxonomy;onApply:(patch:Partial<PracticeGeneratorDefinition>,skill?:string)=>void;onClear:()=>void}) {
  const [action,setAction]=useState('enable'),[category,setCategory]=useState(taxonomy[0]?.label??''),[topic,setTopic]=useState(taxonomy[0]?.topics[0]??''),[difficulty,setDifficulty]=useState('unassigned'),[program,setProgram]=useState('SHSAT'),[value,setValue]=useState('');
  const valid=action==='move'?Boolean(category&&topic):['skill','subject'].includes(action)?Boolean(value.trim()):true;
  function apply(){
    if(action==='skill'){onApply({},value.trim());return;}
    const patch:Partial<PracticeGeneratorDefinition>=action==='enable'?{enabled:true}:action==='disable'?{enabled:false}:action==='approve'?{reviewStatus:'approved'}:action==='review'?{reviewStatus:'unreviewed'}:action==='difficulty'?{difficulty:difficulty as PracticeGeneratorDefinition['difficulty']}:action==='program'?{programs:[program]}:action==='subject'?{subject:value.trim()}:{category,topic};
    onApply(patch);
  }
  return <div className="ps-bulk" aria-label="Bulk generator actions"><strong>{count} selected</strong>
    <label>Action<select value={action} onChange={event=>{setAction(event.target.value);setValue('');}}><option value="enable">Enable</option><option value="disable">Disable</option><option value="approve">Mark approved</option><option value="review">Mark unreviewed</option><option value="difficulty">Set difficulty</option><option value="move">Move to topic</option><option value="skill">Add skill tag</option><option value="program">Set program</option><option value="subject">Set subject</option></select></label>
    {action==='difficulty'&&<label>New difficulty<select value={difficulty} onChange={event=>setDifficulty(event.target.value)}>{practiceDifficulties.map(value=><option key={value} value={value}>{title(value)}</option>)}</select></label>}
    {action==='program'&&<label>New program<select value={program} onChange={event=>setProgram(event.target.value)}>{practicePrograms.map(value=><option key={value}>{value}</option>)}</select></label>}
    {action==='move'&&<><label>New category<select value={category} onChange={event=>{setCategory(event.target.value);setTopic(taxonomy.find(item=>item.label===event.target.value)?.topics[0]??'');}}>{taxonomy.map(item=><option key={item.label}>{item.label}</option>)}</select></label><label>New topic<select value={topic} onChange={event=>setTopic(event.target.value)}>{taxonomy.find(item=>item.label===category)?.topics.map(value=><option key={value}>{value}</option>)}</select></label></>}
    {['skill','subject'].includes(action)&&<label>{action==='skill'?'Skill tag':'New subject'}<input value={value} maxLength={action==='skill'?120:80} onChange={event=>setValue(event.target.value)}/></label>}
    <button disabled={!count||!valid} onClick={apply}>Apply to selected</button><button onClick={onClear}>Clear selection</button>
    <p>Changes are staged until Save changes.{action==='program'?' Set program replaces existing program labels.':''}{action==='move'?' Existing focused module references are retained; automatic topic groups follow the new location.':''}</p>
  </div>;
}
