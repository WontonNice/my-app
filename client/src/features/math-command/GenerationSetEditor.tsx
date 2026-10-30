import { useState } from 'react';
import { Eye } from 'lucide-react';
import { managedGeneratorIds, practiceModuleKind, type ManagedPracticeModule, type PracticeCatalog, type PracticeGeneratorDefinition } from '../../../../server/src/shared/practiceCatalog';
import { generationSetEntries, type GenerationSetFilters } from './generationSet';

type Props={module:ManagedPracticeModule;catalog:PracticeCatalog;taxonomy:{label:string;topics:string[]}[];onChange:(patch:Partial<ManagedPracticeModule>)=>void;onPreview:(generator:PracticeGeneratorDefinition,trigger:HTMLButtonElement)=>void;onPreviewModule:(trigger:HTMLButtonElement)=>void;onEdit?:(generator:PracticeGeneratorDefinition)=>void};
const emptyFilters:GenerationSetFilters={included:'all',category:'',topic:'',search:''};
export function GenerationSetEditor({module,catalog,taxonomy,onChange,onPreview,onPreviewModule,onEdit}:Props) {
  const [filters,setFilters]=useState<GenerationSetFilters>(emptyFilters);
  const kind=practiceModuleKind(module),count=managedGeneratorIds(module,catalog).length;
  const entries=generationSetEntries(module,catalog,filters);
  const categories=taxonomy.filter(category=>!kind||category.label===module.category);
  const topics=[...new Set(categories.filter(category=>!filters.category||category.label===filters.category).flatMap(category=>category.topics).filter(topic=>!kind||topic===module.topic))];
  return <section className="ps-generator-picker" aria-label="Generation set">
    <div className="ps-generation-heading"><h3>Generation set</h3><button className="ps-preview-button" disabled={!count} onClick={event=>onPreviewModule(event.currentTarget)}><Eye size={15}/>Preview module question</button></div>
    <p>Choose the generators for this skill. Questions alternate between the selected generators. For a focused skill module, leave automatic inclusion off.</p>
    <label className="ps-check"><input type="checkbox" disabled={kind==='general'||kind==='foundation'&&catalog.modules.some(child=>child.parentId===module.id)} checked={kind==='general'||module.includeAll} onChange={event=>onChange({includeAll:event.target.checked})}/>Automatically include enabled generators, including future additions</label>
    {kind&&<p className="ps-note">This group uses generators in {module.category} / {module.topic}.{kind==='general'?' General Practice includes every enabled generator in this subcategory.':''}</p>}
    <div className="ps-generation-filters">
      <label>Show generators<select value={filters.included} onChange={event=>setFilters({...filters,included:event.target.value as GenerationSetFilters['included']})}><option value="all">All generators</option><option value="included">Included only</option></select></label>
      <label>Generator category filter<select value={filters.category} onChange={event=>setFilters({...filters,category:event.target.value,topic:''})}><option value="">All categories</option>{categories.map(category=><option key={category.label}>{category.label}</option>)}</select></label>
      <label>Generator subcategory filter<select value={filters.topic} onChange={event=>setFilters({...filters,topic:event.target.value})}><option value="">All subcategories</option>{topics.map(topic=><option key={topic}>{topic}</option>)}</select></label>
    </div>
    <label className="ps-generator-search">Find a generator<input type="search" value={filters.search} placeholder="Search by title, tag or source question…" onChange={event=>setFilters({...filters,search:event.target.value})}/></label>
    <div className="ps-generation-results"><span role="status">{entries.length} generator{entries.length===1?'':'s'} shown · {count} enabled in this module</span>{Object.values(filters).some(value=>value&&value!=='all')&&<button onClick={()=>setFilters(emptyFilters)}>Clear generation set filters</button>}</div>
    <div className="ps-generator-options">{entries.map(({generator,included,locked,contained})=><div className="ps-generator-option" key={generator.id}>
      <label className="ps-check ps-generator-check"><input type="checkbox" disabled={locked} checked={included} onChange={event=>onChange({generatorIds:event.target.checked?[...new Set([...module.generatorIds,generator.id])]:module.generatorIds.filter(id=>id!==generator.id)})}/><span><strong>{generator.title}{!generator.enabled?' · Disabled':''}</strong><small>{generator.category} / {generator.topic}</small><small>{contained?'Assigned through a contained module. Student settings control it there.':generator.description}</small></span></label>
      <button className="ps-generator-example" aria-label={`Preview example from ${generator.title}`} onClick={event=>onPreview(generator,event.currentTarget)}><Eye size={14}/>Preview example</button>
      {onEdit&&<button type="button" aria-label={`Edit generator ${generator.title}`} onClick={()=>onEdit(generator)}>Edit</button>}
    </div>)}</div>
    {!entries.length&&<p className="ps-note">No generators match these filters. Try All generators or clear the filters.</p>}
    <p className="ps-note">Preview uses the current draft without saving. Module preview uses the full enabled generation set, regardless of these filters.{!count?' Include an enabled generator to preview the module.':''} New sessions use your saved changes; running sessions keep their original question set.</p>
  </section>;
}
