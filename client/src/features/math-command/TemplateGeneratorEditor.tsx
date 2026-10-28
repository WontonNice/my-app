import { useState } from 'react';
import type { PracticeGeneratorDefinition } from '../../../../server/src/shared/practiceCatalog';
import { analyzeGeneratorTemplate, parseGeneratorImport } from './generatorAuthoring';

export function TemplateGeneratorEditor({generator,onChange,draft,onDraftChange}: {generator:PracticeGeneratorDefinition;onChange:(patch:Partial<PracticeGeneratorDefinition>)=>void;draft?:string;onDraftChange:(value?:string)=>void}) {
  const raw=draft??JSON.stringify({version:1,title:generator.title,description:generator.description,template:generator.template},null,2);
  const [error,setError]=useState('');
  const stats=analyzeGeneratorTemplate(generator.template);
  return <div className="ps-template-editor"><p>{stats.distinctStems.toLocaleString()} distinct stems · {stats.combinations.toLocaleString()} combinations validated. Cycles repeat in seeded order.</p><details open={draft!==undefined||undefined}><summary>Edit or export JSON template</summary><p>Edits are validated before they enter the draft. Replacing a template disables it for review; existing student sessions keep their saved version.</p><label>Generator JSON<textarea className="ps-template-json" spellCheck={false} rows={14} value={raw} onChange={event=>onDraftChange(event.target.value)}/></label><button type="button" onClick={()=>{try{
    const next=parseGeneratorImport(raw,{id:generator.id,category:generator.category!,topic:generator.topic!,sourceQuestionIds:generator.sourceQuestionIds??[],skilled:generator.skilled});
    onChange({title:next.title,description:next.description,template:next.template,enabled:false,reviewStatus:'unreviewed'});onDraftChange(undefined);setError('');
  }catch(reason){setError((reason as Error).message);}}}>Validate and replace draft template</button>{draft!==undefined&&<button type="button" onClick={()=>{onDraftChange(undefined);setError('');}}>Discard JSON edits</button>}{error&&<p role="alert" className="ps-message is-error">{error}</p>}</details></div>;
}
