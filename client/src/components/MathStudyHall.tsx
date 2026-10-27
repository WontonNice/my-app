import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, Infinity as InfinityIcon, Layers3, Play } from "lucide-react";
import { AppLink } from "./AppLink";
import { mathStudyHref } from "../lib/mathStudyHall";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { managedGeneratorIds, type PracticeSelection } from "../../../server/src/shared/practiceCatalog";
import { PracticeModuleList } from "../features/math-command/PracticeModuleList";
import { PracticeVideoList } from "../features/math-command/PracticeVideoList";
import { usePracticeCatalog } from "../features/math-command/usePracticeCatalog";
import "../styles/math-study-hall.css";
const PracticePlayer = lazy(() => import("../features/math-command/InequalityPractice").then(module => ({ default: module.InequalityPractice })));

export function MathStudyHall({ query, previewContext }: { query: string; previewContext: StudentPreviewContext }) {
  const [search, setSearch] = useState(() => window.location.search);
  const [selectedModule, setSelectedModule] = useState<{id:string;selection:PracticeSelection} | null>(null);
  const {catalog,taxonomy,error,loading,reload}=usePracticeCatalog();
  const mathStudyCategories=taxonomy??[];
  useEffect(() => {
    const update = () => setSearch(window.location.search);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const params = new URLSearchParams(search);
  const categoryName = params.get("category"), topicName = params.get("topic");
  const category = mathStudyCategories.find(item => item.label === categoryName);
  const topic = category?.topics.find(item => item === topicName);
  const href = (main?: string, specific?: string) => appendStudentPreview(mathStudyHref(main, specific), previewContext);
  const matches = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());
  const modules=catalog?.modules.filter(module=>module.published&&module.category===category?.label&&module.topic===topic)??[];
  const videos=catalog?.videos.filter(video=>video.published&&video.category===category?.label&&video.topic===topic)??[];
  async function startModule(id:string,selection:PracticeSelection) {
    const next=await reload();
    if(next?.modules.some(module=>module.id===id&&module.published&&managedGeneratorIds(module,next,selection).length>0))setSelectedModule({id,selection});
  }
  const resourceStatus=loading?<p className="math-study-resource-status" role="status">Loading resources…</p>:error?<div className="math-study-resource-status" role="alert"><p>{error}</p><button type="button" onClick={()=>void reload()}>Try again</button></div>:null;

  if(!taxonomy)return <section className="math-study-hall" aria-labelledby="math-study-title"><h2 id="math-study-title">Math categories</h2>{error?<div className="math-study-resource-status" role="alert"><p>{error}</p><button type="button" onClick={()=>void reload()}>Try again</button></div>:<p role="status">Loading math categories…</p>}</section>;

  return <section className="math-study-hall" aria-labelledby="math-study-title">
    <nav className="math-study-breadcrumbs" aria-label="Math topic navigation">
      <AppLink href={href()}>Math categories</AppLink>
      {category && <><span aria-hidden="true">/</span><AppLink href={href(category.label)} aria-current={!topic ? "page" : undefined}>{category.label}</AppLink></>}
      {topic && <><span aria-hidden="true">/</span><span aria-current="page">{topic}</span></>}
    </nav>

    {(categoryName && !category) || (topicName && !topic) ? <div className="math-study-empty">
      <h2 id="math-study-title">This topic is no longer available</h2>
      <p>Browse the current math categories to find your topic.</p>
      <AppLink href={href()}><ArrowLeft size={16} />All math categories</AppLink>
    </div> : topic && category ? <>
      <header className="study-hall-section-heading"><div><p>{category.label}</p><h2 id="math-study-title">{topic}</h2><span>Worksheets and practice for this topic, together in one place.</span></div></header>
      {previewContext.mode==='teacher'&&<AppLink className="math-study-manage" href={`/teacher/practice-studio?${new URLSearchParams({category:category.label,topic})}`}>Manage practice &amp; videos <ArrowRight size={15}/></AppLink>}
      <div className="math-study-resources">
        <section aria-labelledby="math-worksheets-title" className="math-study-resource-section">
          <header><FileText size={21} aria-hidden="true" /><div><h3 id="math-worksheets-title">Worksheets</h3><p>Work through a focused set at your own pace.</p></div></header>
          <div className="math-study-resource-empty"><FileText size={30} aria-hidden="true" /><strong>No worksheets yet</strong><p>Worksheets from your teacher will appear here.</p></div>
        </section>
        <section aria-labelledby="math-infinite-title" className="math-study-resource-section">
          <header><InfinityIcon size={24} aria-hidden="true" /><div><h3 id="math-infinite-title">Infinite practice</h3><p>Keep practicing with fresh questions.</p></div></header>
          {resourceStatus??(modules.length?<PracticeModuleList catalog={catalog!} previewContext={previewContext} category={category.label} topic={topic} onStart={(id,selection)=>void startModule(id,selection)}/>:<div className="math-study-resource-empty"><InfinityIcon size={34} aria-hidden="true" /><strong>No practice modules yet</strong><p>Modules published by your teacher will appear here.</p></div>)}
        </section>
        <section aria-labelledby="math-videos-title" className="math-study-resource-section">
          <header><Play size={23} aria-hidden="true"/><div><h3 id="math-videos-title">YouTube videos</h3><p>Educational references for this topic.</p></div></header>
          {resourceStatus??(videos.length?<PracticeVideoList videos={videos}/>:<div className="math-study-resource-empty"><Play size={30} aria-hidden="true"/><strong>No videos yet</strong><p>Video references selected by your teacher will appear here.</p></div>)}
        </section>
      </div>
    </> : <>
      <header className="study-hall-section-heading"><div><p>{category ? "Subcategories" : "Math topics"}</p><h2 id="math-study-title">{category?.label || "Choose a main category"}</h2><span>{category ? "Choose a specific topic to find its worksheets and practice." : "Start with a main category, then choose the skill you want to work on."}</span></div></header>
      {category ? <div className="math-study-topic-list">
        {category.topics.filter(name => matches(`${category.label} ${name}`)).map((name, index) => <AppLink className="math-study-topic" href={href(category.label, name)} key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><ArrowRight size={18} aria-hidden="true" /></AppLink>)}
        {!category.topics.some(name => matches(`${category.label} ${name}`)) && <p className="math-study-empty">No subcategories match your search.</p>}
      </div> : <div className="math-study-category-grid">
        {mathStudyCategories.filter(item => matches(`${item.label} ${item.topics.join(" ")}`)).map(item => <AppLink className="math-study-category" href={href(item.label)} key={item.label}><Layers3 size={23} aria-hidden="true" /><span>{item.topics.length} subcategories</span><h3>{item.label}</h3><p>{item.topics.slice(0, 3).join(" · ")}{item.topics.length > 3 ? "…" : ""}</p><strong>Explore topics <ArrowRight size={17} aria-hidden="true" /></strong></AppLink>)}
        {!mathStudyCategories.some(item => matches(`${item.label} ${item.topics.join(" ")}`)) && <p className="math-study-empty">No math categories match your search.</p>}
      </div>}
    </>}
    {selectedModule && catalog && <Suspense fallback={<p role="status">Opening practice…</p>}><PracticePlayer key={selectedModule.id} initialModuleId={selectedModule.id} initialSelection={selectedModule.selection} catalog={catalog} onClose={() => setSelectedModule(null)} /></Suspense>}
  </section>;
}
