import { ArrowRight } from 'lucide-react';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import type { StudentPreviewContext } from '../../lib/studentPreview';
import './practice-modules.css';

export function PracticeModuleList({catalog,onStart,category,topic}:{catalog:PracticeCatalog;previewContext:StudentPreviewContext;onStart:(id:string,selection:PracticeSelection)=>void;category?:string;topic?:string}) {
  const modules=catalog.modules.filter(module=>module.published&&Boolean(practiceModuleKind(module))&&!module.parentId&&(!category||module.category===category)&&(!topic||module.topic===topic)&&(Boolean(category||topic)||managedGeneratorIds(module,catalog).length>0));
  return <div className="math-study-modules practice-module-list" role="region" aria-label="Infinite practice modules" tabIndex={0}>{modules.map(module=>{
    const ids=managedGeneratorIds(module,catalog), count=ids.length;
    const focused=catalog.modules.filter(child=>child.published&&child.parentId===module.id&&managedGeneratorIds(child,catalog).length);
    return <article className="practice-module-group" key={module.id}><div className="practice-module-heading"><div>{!category&&<small className="practice-module-topic">{module.category} / {module.topic}</small>}<h4>{module.title}</h4><p>{module.description}</p><small>{count} generator{count===1?'':'s'} · No calculator</small></div><button disabled={!count} type="button" onClick={()=>onStart(module.id,{})} aria-label={`Start or resume ${module.title}`}>Start / resume <ArrowRight size={16}/></button></div><details className="practice-module-contents"><summary>See included families ({count}){focused.length ? ' and focused modules' : ''}</summary><ul>{catalog.generators.filter(generator=>ids.includes(generator.id)).map(generator=><li key={generator.id}><strong>{generator.title}</strong><p>{generator.description}</p></li>)}</ul>{focused.map(child=><div className="practice-focused-module" key={child.id}><div><strong>{child.title}</strong><p>{child.description}</p><small>Focused module · {managedGeneratorIds(child,catalog).length} generators</small></div><button type="button" onClick={()=>onStart(child.id,{})}>Practice {child.title}<ArrowRight size={14}/></button></div>)}</details></article>;
  })}{!modules.length&&<p className="math-study-resource-status">No practice modules are published here yet.</p>}</div>;
}
