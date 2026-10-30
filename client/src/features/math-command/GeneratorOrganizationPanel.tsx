import type { PracticeCatalog, PracticeGeneratorDefinition, ManagedPracticeModule } from '../../../../server/src/shared/practiceCatalog';
import { practiceDifficulties, practicePrograms, practiceReviewStatuses } from '../../../../server/src/shared/practiceOrganization';
import { generatorModuleUsage } from './studioOrganization';
import { useState } from 'react';
import { AppLink } from '../../components/AppLink';

const label=(value:string)=>value==='in-review'?'In review':value[0].toUpperCase()+value.slice(1);
function MetadataListField({name,value,onChange,help,placeholder}:{name:string;value:string[];onChange:(value:string[])=>void;help?:string;placeholder?:string}) {
  const [draft,setDraft]=useState<string|null>(null);
  return <label>{name}<textarea value={draft??value.join(', ')} rows={2} placeholder={placeholder}
    onFocus={()=>setDraft(value.join(', '))} onBlur={()=>setDraft(null)} onChange={event=>{setDraft(event.target.value);onChange(event.target.value.split(/[,\n]/).map(item=>item.trim()).filter(Boolean));}}/>{help&&<small>{help}</small>}</label>;
}
export function GeneratorOrganizationPanel({generator,catalog,onChange,onOpenModule,onOpenSource}:{generator:PracticeGeneratorDefinition;catalog:PracticeCatalog;onChange:(patch:Partial<PracticeGeneratorDefinition>)=>void;onOpenModule:(module:ManagedPracticeModule)=>void;onOpenSource?:(id:string)=>void}) {
  const usage=generatorModuleUsage(generator,catalog);
  return <>
    {!!generator.sourceQuestionIds?.length&&<section className="ps-usage" aria-label="Source questions"><h3>Source questions</h3>{generator.sourceQuestionIds.map(id=><div className="ps-usage-row" key={id}><strong>{id}</strong>{onOpenSource?<button type="button" onClick={()=>onOpenSource(id)}>Open in Math Center</button>:<AppLink href={'/teacher/math-command?tab=bank&questionId='+encodeURIComponent(id)}>Open in Math Center</AppLink>}</div>)}</section>}
    <section className="ps-organization" aria-label="Generator organization">
      <h3>Generator details and review</h3>
      <p className="ps-note">The modules below assign this generator to skills. Search tags and prerequisites are optional planning notes.</p>
      <div className="ps-fields">
        <label>Difficulty<select value={generator.difficulty??'unassigned'} onChange={event=>onChange({difficulty:event.target.value as PracticeGeneratorDefinition['difficulty']})}>{practiceDifficulties.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label>
        <label>Review status<select value={generator.reviewStatus??'unreviewed'} onChange={event=>onChange({reviewStatus:event.target.value as PracticeGeneratorDefinition['reviewStatus']})}>{practiceReviewStatuses.map(value=><option key={value} value={value}>{label(value)}</option>)}</select></label>
      </div>
      <MetadataListField key={`skills-${generator.id}`} name="Search tags" value={generator.skills??[]} onChange={skills=>onChange({skills})} placeholder="For example: sample spaces, ordered outcomes" help="Separate tags with commas. Tags help search; they do not assign a Skill."/>
      <MetadataListField key={`prerequisites-${generator.id}`} name="Prerequisite skills" value={generator.prerequisites??[]} onChange={prerequisites=>onChange({prerequisites})} placeholder="For example: fraction multiplication" help="Planning notes for teachers; these do not block student access."/>
      <MetadataListField key={`sources-${generator.id}`} name="Source question IDs" value={generator.sourceQuestionIds??[]} onChange={sourceQuestionIds=>onChange({sourceQuestionIds})} placeholder="For example: 2022-2023-form-b-q70"/>
      <details className="ps-program-details"><summary>Programs and subject</summary>
        <p className="ps-note">Library labels for reuse across courses. These labels do not publish content to other programs.</p>
        <div className="ps-programs">{practicePrograms.map(program=><label className="ps-check" key={program}><input type="checkbox" checked={(generator.programs??['SHSAT']).includes(program)} disabled={(generator.programs??['SHSAT']).length===1&&(generator.programs??['SHSAT']).includes(program)} onChange={event=>onChange({programs:event.target.checked?[...(generator.programs??['SHSAT']),program]:(generator.programs??['SHSAT']).filter(item=>item!==program)})}/>{program}</label>)}</div>
        <label>Subject<input value={generator.subject??'Math'} maxLength={80} onChange={event=>onChange({subject:event.target.value})}/></label>
      </details>
    </section>
    <section className="ps-usage" aria-label="Modules using this generator"><h3>Used in {usage.length} module{usage.length===1?'':'s'}</h3>
      <p className="ps-note">Includes automatic topic groups and hidden modules. Disabling a generator affects every active use below.</p>
      {usage.map(({module,reason,active})=><div className="ps-usage-row" key={module.id}><div><strong>{module.title}</strong><small>{module.category} / {module.topic} · {reason} · {active?'Active':'Inactive'}</small></div><button onClick={()=>onOpenModule(module)}>Open module</button></div>)}
      {!usage.some(item=>item.focused)&&<p className="ps-note">No Skill module selects this generator. Open a module and include it in that skill’s generation set. Automatic practice groups may still include it.</p>}
    </section>
  </>;
}
