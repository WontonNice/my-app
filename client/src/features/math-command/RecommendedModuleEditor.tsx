import { useState } from 'react';
import { Plus } from 'lucide-react';
import { recommendedSectionTitle, type PracticeCatalog, type RecommendedCategory, type RecommendedModule } from '../../../../server/src/shared/practiceCatalog';

type Props = {catalog: PracticeCatalog; disabled: boolean; onChange: (categories: RecommendedCategory[]) => void};

export function RecommendedModuleEditor({catalog, disabled, onChange}: Props) {
  const categories = catalog.recommended ?? [];
  const [categoryId,setCategoryId] = useState('');
  const [moduleId,setModuleId] = useState('');
  const [query,setQuery] = useState('');
  const category = categories.find(item => item.id === categoryId) ?? categories[0];
  const module = category?.modules.find(item => item.id === moduleId) ?? category?.modules[0];
  const canPublish = catalog.generators.some(g=>g.enabled&&module?.generatorIds.includes(g.id));
  const matches = catalog.generators.filter(g => [g.title,g.category,g.topic].join(' ').toLowerCase().includes(query.trim().toLowerCase()));

  function updateCategory(patch:Partial<RecommendedCategory>) {
    onChange(categories.map(c => c.id === category?.id ? {...c,...patch} : c));
  }
  function updateModule(patch:Partial<RecommendedModule>) {
    updateCategory({modules:category.modules.map(m => m.id === module?.id ? {...m,...patch} : m)});
  }
  function addCategory() {
    const id=crypto.randomUUID();
    onChange([...categories,{id,title:'New category',modules:[]}]);
    setCategoryId(id); setModuleId(''); setQuery('');
  }
  function addModule() {
    const id=crypto.randomUUID();
    updateCategory({modules:[...category.modules,{id,title:'New module',generatorIds:[],published:false}]});
    setModuleId(id); setQuery('');
  }
  return <details className="ps-recommended" id="recommended" open={window.location.hash==='#recommended'||undefined}>
    <summary>{recommendedSectionTitle}</summary>
    <fieldset disabled={disabled}>
      <p>Group infinite templates from any math topic. Publish a module and save changes to show it in Study Hall.</p>
      <div className="ps-recommended-row"><label>Custom category<select value={category?.id??''} onChange={e=>{setCategoryId(e.target.value);setModuleId('');setQuery('');}}>
        {!categories.length&&<option value="">No categories yet</option>}{categories.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
        <button type="button" onClick={addCategory}><Plus size={14}/> Add category</button></div>
      {category&&<>
        <div className="ps-recommended-row"><label>Category name<input value={category.title} maxLength={120} onChange={e=>updateCategory({title:e.target.value})}/></label>
        <button type="button" onClick={()=>{if(window.confirm('Remove this category and its recommended modules?'))onChange(categories.filter(c=>c.id!==category.id));}}>Remove category</button></div>
        <div className="ps-recommended-row"><label>Custom module<select value={module?.id??''} onChange={e=>{setModuleId(e.target.value);setQuery('');}}>
          {!category.modules.length&&<option value="">No modules yet</option>}{category.modules.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label>
          <button type="button" onClick={addModule}><Plus size={14}/> Add module</button></div>
        {module&&<>
          <div className="ps-recommended-row"><label>Module name<input value={module.title} maxLength={120} onChange={e=>updateModule({title:e.target.value})}/></label>
          <button type="button" onClick={()=>{if(window.confirm('Remove this recommended module?'))updateCategory({modules:category.modules.filter(m=>m.id!==module.id)});}}>Remove module</button></div>
          <label>Find infinite templates<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name or math topic"/></label>
          <fieldset className="ps-recommended-templates"><legend>Templates · {module.generatorIds.length} selected</legend>
            {matches.map(g=><label key={g.id}><input type="checkbox" checked={module.generatorIds.includes(g.id)} onChange={e=>{
              const ids=e.target.checked?[...module.generatorIds,g.id]:module.generatorIds.filter(id=>id!==g.id);
              updateModule({generatorIds:ids,published:module.published&&ids.length>0});
            }}/><span>{g.title}<small>{g.category} / {g.topic}{!g.enabled?' · Disabled':''}</small></span></label>)}
            {!matches.length&&<p>No templates match this search.</p>}
          </fieldset>
          <label className="ps-check"><input type="checkbox" disabled={!canPublish} checked={module.published&&canPublish} onChange={e=>updateModule({published:e.target.checked})}/>Publish in Study Hall</label>
          {!canPublish&&<small>Select an enabled template to publish this module.</small>}
        </>}
      </>}
    </fieldset>
  </details>;
}
