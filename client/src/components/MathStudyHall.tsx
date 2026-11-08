import { usePracticeAccount } from '../features/math-command/usePracticeAccount';
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, Infinity as InfinityIcon, Layers3, Play, Star } from "lucide-react";
import { AppLink } from "./AppLink";
import { mathStudyHref } from "../lib/mathStudyHall";
import { StudyHallWorksheetLinks } from './StudyHallWorksheetLinks';
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { recommendedSectionTitle, recommendedPracticeCatalog, type PracticeCatalog, managedGeneratorIds, practiceModuleKind, type PracticeSelection } from "../../../server/src/shared/practiceCatalog";
import { PracticeModuleList } from "../features/math-command/PracticeModuleList";
import { PracticeVideoList } from "../features/math-command/PracticeVideoList";
import { usePracticeCatalog } from "../features/math-command/usePracticeCatalog";
import { useAccountProfile } from "../features/account/account";
import { practiceProgressEvent, readPracticeProgress } from "../features/math-command/practiceSessionStorage";
import "../styles/math-study-hall.css";
const PracticePlayer = lazy(() => import("../features/math-command/InequalityPractice").then(module => ({ default: module.InequalityPractice })));

export function MathStudyHall({ query, previewContext, view }: { query: string; previewContext: StudentPreviewContext; view?: 'categories' | 'recommended' }) {
  const [search, setSearch] = useState(() => window.location.search);
  const [selectedModule, setSelectedModule] = useState<{id:string;selection:PracticeSelection;startNew?:boolean;catalog?:PracticeCatalog} | null>(null);
  const [launchError,setLaunchError]=useState('');
  const {catalog,taxonomy,error,loading,reload}=usePracticeCatalog();
  const {profile}=useAccountProfile();
  const owner=previewContext.isPreview?'preview:'+previewContext.mode+':'+(previewContext.studentId||'teacher'):profile?.id;
  usePracticeAccount(previewContext.isPreview?undefined:owner);
  const [,refreshProgress]=useState(0);
  const mathStudyCategories=taxonomy??[];
  useEffect(() => {
    const update = () => setSearch(window.location.search);
    const updateProgress = () => refreshProgress(value=>value+1);
    window.addEventListener("popstate", update);
    window.addEventListener("storage", updateProgress);
    window.addEventListener(practiceProgressEvent, updateProgress);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("storage", updateProgress);
      window.removeEventListener(practiceProgressEvent, updateProgress);
    };
  }, []);
  const params = new URLSearchParams(search);
  const categoryName = params.get("category"), topicName = params.get("topic");
  const category = mathStudyCategories.find(item => item.label === categoryName);
  const topic = category?.topics.find(item => item === topicName);
  const href = (main?: string, specific?: string) => appendStudentPreview(mathStudyHref(main, specific), previewContext);
  const matches = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());
  function generalPracticeStars(topicName:string) {
    const general=catalog?.modules.find(module=>module.published&&!module.parentId&&practiceModuleKind(module)==='general'&&module.category===category?.label&&module.topic===topicName);
    try {
      return owner&&general?Math.min(5,Math.floor(Math.max(...[general.id,...(general.selectionAliases??[])].map(id=>readPracticeProgress(localStorage,owner,id).longestStreak))/10)):0;
    } catch { return 0; }
  }
  const modules=catalog?.modules.filter(module=>module.published&&module.category===category?.label&&module.topic===topic)??[];
  const videos=catalog?.videos.filter(video=>video.published&&video.category===category?.label&&video.topic===topic)??[];
  async function startModule(id:string,selection:PracticeSelection,startNew=false) {
    setLaunchError('');
    const next=await reload();
    if(next?.modules.some(module=>module.id===id&&module.published&&managedGeneratorIds(module,next,selection).length>0))setSelectedModule({id,selection,startNew});
    else if(next)setLaunchError('This practice module no longer has available questions. Choose another module or refresh the page.');
  }
  async function startRecommended(id:string) {
    const fresh=await reload();
    const playerCatalog=fresh&&recommendedPracticeCatalog(fresh,id);
    if(playerCatalog)setSelectedModule({id,selection:{},catalog:playerCatalog});
  }
  const recommended=(catalog?.recommended??[]).map(c=>({...c,modules:c.modules.filter(m=>m.published&&matches(c.title+' '+m.title))})).filter(c=>c.modules.length);
  const resourceStatus=loading?<p className="math-study-resource-status" role="status">Loading resources…</p>:error?<div className="math-study-resource-status" role="alert"><p>{error}</p><button type="button" onClick={()=>void reload()}>Try again</button></div>:null;

  if(!taxonomy)return <section className="math-study-hall" aria-labelledby="math-study-title"><h2 id="math-study-title">Math categories</h2>{error?<div className="math-study-resource-status" role="alert"><p>{error}</p><button type="button" onClick={()=>void reload()}>Try again</button></div>:<p role="status">Loading math categories…</p>}</section>;

  return <section className="math-study-hall" aria-labelledby={view === 'recommended' ? 'recommended-heading' : 'math-study-title'}>
    <div hidden={view === 'recommended'}>
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
        <section aria-labelledby="math-infinite-title" className="math-study-resource-section math-study-practice-section">
          <header><InfinityIcon size={28} aria-hidden="true" /><div><h3 id="math-infinite-title">Infinite practice</h3><p>Practice the full topic in General Practice, or choose modules and earn module stars in Foundation Building.</p></div></header>
          {launchError&&<p role="alert">{launchError}</p>}
          {resourceStatus??(modules.length?<PracticeModuleList catalog={catalog!} previewContext={previewContext} category={category.label} topic={topic} onStart={(id,selection,startNew)=>void startModule(id,selection,startNew)}/>:<div className="math-study-resource-empty"><InfinityIcon size={34} aria-hidden="true" /><strong>No practice modules yet</strong><p>Modules published by your teacher will appear here.</p></div>)}
        </section>
        <section aria-labelledby="math-worksheets-title" className="math-study-resource-section">
          <header><FileText size={21} aria-hidden="true" /><div><h3 id="math-worksheets-title">Worksheets</h3><p>Work through a focused set at your own pace.</p></div></header>
          <StudyHallWorksheetLinks subject="math" category={category.label} topic={topic} query={query} previewContext={previewContext} />
        </section>
        <section aria-labelledby="math-videos-title" className="math-study-resource-section">
          <header><Play size={23} aria-hidden="true"/><div><h3 id="math-videos-title">YouTube videos</h3><p>Educational references for this topic.</p></div></header>
          {resourceStatus??(videos.length?<PracticeVideoList videos={videos}/>:<div className="math-study-resource-empty"><Play size={30} aria-hidden="true"/><strong>No videos yet</strong><p>Video references selected by your teacher will appear here.</p></div>)}
        </section>
      </div>
    </> : <>
      <header className="study-hall-section-heading"><div><p>{category ? "Subcategories" : "Math topics"}</p><h2 id="math-study-title">{category?.label || "Choose a main category"}</h2><span>{category ? "Choose a specific topic to find its worksheets and practice." : "Start with a main category, then choose the skill you want to work on."}</span></div></header>
      {category ? <div className="math-study-topic-list">
        {category.topics.filter(name => matches(`${category.label} ${name}`)).map((name, index) => {
          const stars=generalPracticeStars(name);
          return <AppLink className="math-study-topic" href={href(category.label, name)} key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><span className="math-study-topic-stars" role="img" aria-label={`General Practice stars: ${stars} of 5`} title="Stars earned in General Practice"><b>{stars}/5</b>{[1,2,3,4,5].map(star=><Star key={star} size={18} className={star<=stars?'is-earned':undefined} aria-hidden="true"/>)}</span><ArrowRight size={18} aria-hidden="true" /></AppLink>;
        })}
        {!category.topics.some(name => matches(`${category.label} ${name}`)) && <p className="math-study-empty">No subcategories match your search.</p>}
      </div> : <div className="math-study-category-grid">
        {mathStudyCategories.filter(item => matches(`${item.label} ${item.topics.join(" ")}`)).map(item => <AppLink className="math-study-category" href={href(item.label)} key={item.label}><Layers3 size={23} aria-hidden="true" /><span>{item.topics.length} subcategories</span><h3>{item.label}</h3><p>{item.topics.slice(0, 3).join(" · ")}{item.topics.length > 3 ? "…" : ""}</p><strong>Explore topics <ArrowRight size={17} aria-hidden="true" /></strong></AppLink>)}
        {!mathStudyCategories.some(item => matches(`${item.label} ${item.topics.join(" ")}`)) && <p className="math-study-empty">No math categories match your search.</p>}
      </div>}
    </>}
    {!category && view === "categories" && <section className="math-study-resource-section"><h3>General & mixed review worksheets</h3><p>Find official Grade 9 collections and worksheets covering several topics.</p><StudyHallWorksheetLinks subject="math" scope="mixed" query={query} previewContext={previewContext} /></section>}
    {category && !topic && <section className="math-study-resource-section"><h3>Worksheets</h3><StudyHallWorksheetLinks subject="math" category={category.label} query={query} previewContext={previewContext} /></section>}
    </div>
    {view !== 'categories'&&!categoryName&&!topicName&&<section className="math-recommended" aria-labelledby="recommended-heading">
      <header><h2 id="recommended-heading">{recommendedSectionTitle}</h2>{previewContext.isPreview&&<AppLink href="/teacher/practice-studio#recommended">Manage recommendations</AppLink>}</header>
      <StudyHallWorksheetLinks subject="math" category={recommendedSectionTitle} query={query} previewContext={previewContext} />
      {recommended.map(c=><details key={c.id}><summary>{c.title} <small>{c.modules.length} {c.modules.length===1?'module':'modules'}</small></summary>
        {c.modules.map(m=><button key={m.id} type="button" onClick={()=>void startRecommended(m.id)}><span>{m.title}</span><small>{m.generatorIds.length} {m.generatorIds.length===1?'template':'templates'}</small><Play size={16} aria-hidden="true"/></button>)}
      </details>)}
      {!recommended.length&&<p>{query?'No recommended practice modules match your search.':'No recommended practice modules published yet.'}</p>}
      {error&&<p role="alert">{error}</p>}
    </section>}
    {selectedModule && catalog && <Suspense fallback={<p role="status">Opening practice…</p>}><PracticePlayer key={selectedModule.id} initialModuleId={selectedModule.id} initialSelection={selectedModule.selection} initialStartNew={selectedModule.startNew} catalog={selectedModule.catalog??catalog} onClose={() => setSelectedModule(null)} /></Suspense>}
  </section>;
}
