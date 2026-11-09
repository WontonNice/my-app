import {learningCategories,categoryFor} from '../../../server/src/shared/learningTaxonomy';
import { getLibraryBookSettings } from '../lib/api';
import { getExamLibraryPassage } from '../content/exams/passageLibrary';
import { libraryBookNeedsReview, type LibraryBookSettings } from '../../../server/src/shared/libraryBooks';
import '../styles/library-book-settings.css';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { AppLink } from '../components/AppLink';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { MathStudyHall } from '../components/MathStudyHall';
import { StudyHallWorksheetLinks } from '../components/StudyHallWorksheetLinks';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { readingPracticeMaterials, editingPracticeMaterials, studentLibraryBooks, advancedPassageMaterials, materialMatchesQuery, type StudentMaterial } from '../lib/studentMaterials';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';
import { studyHallEntries, studyHallDirectories, studyHallSections, studyHallLocation, studyHallHref } from '../lib/studyHallNavigation';
import { PASSAGE_CATEGORIES, passageCategory, passageCategoryLabel } from '../../../server/src/shared/passageCategories';
import '../styles/learning-plan.css';
import '../styles/study-hall-navigation.css';
import '../styles/study-hall-catalog.css';

export function StudentMaterialsPage({ teacherWorkspace = false }: { teacherWorkspace?: boolean }) {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess(teacherWorkspace);
  const [bookSettings, setBookSettings] = useState<Record<string, LibraryBookSettings>>({});
  const [settingsError, setSettingsError] = useState('');
  useEffect(() => { if (!accessToken) return; let current = true; getLibraryBookSettings(accessToken).then(result => { if (current) setBookSettings(result.settings); }).catch(() => { if (current) setSettingsError('Book selections could not be loaded. Open Book settings to check the saved selection.'); }); return () => { current = false; }; }, [accessToken]);
  const [search, setSearch] = useState(() => window.location.search);
  useEffect(() => {
    const update = () => setSearch(window.location.search);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const params = new URLSearchParams(search);
  const { entry, section } = studyHallLocation(search);
  const current = studyHallEntries.find(item => item.id === entry)!;
  const query = params.get('q') || '';
  const type = params.get('type') === 'Long reading' ? '' : params.get('type') || '';
  const source = params.get('source') || '';
  const skill = params.get('skill') || '';
  const sort = params.get('sort') || 'title';
  const genre = params.get('genre') || '';
  function updateFilters(values: Record<string, string>) {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    window.history.replaceState({}, '', window.location.pathname + '?' + next.toString());
    setSearch(window.location.search);
  }
  const clearFilters = () => updateFilters({ q: '', type: '', source: '', skill: '', sort: '', genre: '' });
  const href = (target: typeof entry, tab?: string) => appendStudentPreview(studyHallHref(target, tab), previewContext);
  const library = studentLibraryBooks.filter(item => item.libraryCollection !== 'Advanced Reading');
  const passages = library.filter(item => (!type || item.readingFormat === type)
    && (!source || (item.passageCategories ?? [passageCategory(item.passageCategory)]).includes(passageCategory(source)))
    && (!skill || item.skills?.includes(skill)) && materialMatchesQuery(item, query))
    .sort((a, b) => sort === 'questions' ? a.questionCount - b.questionCount || a.title.localeCompare(b.title) : (sort === 'title-desc' ? -1 : 1) * a.title.localeCompare(b.title));
  const advanced = advancedPassageMaterials.filter(item => (!genre || item.questionType === genre) && materialMatchesQuery(item, query))
    .sort((a, b) => (sort === 'title-desc' ? -1 : 1) * a.title.localeCompare(b.title));
  const educationalArea=entry==='editing'?'revising_editing_a':entry==='standalone'?'revising_editing_b':'reading';
  const existingTopics=entry==='reading'?readingPracticeMaterials:editingPracticeMaterials;
  const topics:StudentMaterial[]=learningCategories.filter(category=>category.active&&category.area===educationalArea).map<StudentMaterial>(category=>{
    const existing=existingTopics.find(item=>categoryFor(educationalArea,item.title)?.id===category.id);
    return existing?{...existing,title:category.label,href:existing.href+'?categoryId='+encodeURIComponent(category.id)}:{id:category.id,title:category.label,subject:'English',category:category.label,kind:'Practice set',description:'Focused worksheets in this category.',questionCount:0,questionType:category.label,href:'/study-hall/shsat/worksheets?'+new URLSearchParams({subject:'english',area:educationalArea,category:category.label,scope:'focused'})};
  }).filter(item=>materialMatchesQuery(item,query));
  async function handleSignOut() { if (isSupabaseConfigured) await signOutCurrentAccount(); window.location.assign('/'); }
  if (isCheckingSession) return <main className="loading-shell">Loading Study Hall…</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  return <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
    <div className="study-hall-catalog">
      {previewContext.mode === 'teacher' && <details className="study-hall-management"><summary>Teacher tools</summary><nav aria-label="Teacher Study Hall tools"><AppLink href="/teacher"><ArrowLeft size={15} /> Teacher dashboard</AppLink><AppLink href="/teacher/practice-studio">Practice &amp; video studio</AppLink><AppLink href="/teacher/library">Manage English library</AppLink><AppLink href="/teacher/math-command">Math Command Center</AppLink></nav></details>}
      <header className="study-hall-heading"><h1>Study Hall</h1><p>{current.description}</p></header>
      <nav className="study-hall-entries" aria-label="Study Hall entries">
        {studyHallDirectories.map(item => <AppLink key={item.id} href={href(item.id)} aria-current={(entry === 'standalone' ? 'editing' : entry) === item.id ? 'page' : undefined}>{item.title}<ArrowRight size={17} aria-hidden="true" /></AppLink>)}
      </nav>
      {(entry === 'editing' || entry === 'standalone') && <nav className="study-hall-sections" aria-label="Revising/Editing practice types">
        {studyHallEntries.filter(item => item.id === 'editing' || item.id === 'standalone').map(item => <AppLink key={item.id} href={href(item.id, section)} aria-current={entry === item.id ? 'page' : undefined}>{item.title}</AppLink>)}
      </nav>}
      <h2 className="sr-only">{current.title}</h2>
      <nav className="study-hall-sections" aria-label={`${current.title} sections`}>
        {studyHallSections[entry].map(item => <AppLink key={item.id} href={href(entry, item.id)} aria-current={section === item.id ? 'page' : undefined}>{item.title}</AppLink>)}
      </nav>
      <div className="study-hall-find">
        <label className="study-hall-search"><Search size={19} aria-hidden="true" /><span className="sr-only">Search {section === 'library' ? 'passages' : current.title}</span><input type="search" value={query} onChange={event => updateFilters({ q: event.target.value })} placeholder={section === 'library' ? 'Search title, author, exam, skill, or passage text…' : 'Search categories and resources…'} /></label>
        {(query || type || source || skill || genre || sort !== 'title') && <button className="study-hall-clear" type="button" onClick={clearFilters}><X size={15} />Clear search &amp; filters</button>}
      </div>

      {entry === 'math' ? <MathStudyHall key={section} view={section === 'recommended' ? 'recommended' : 'categories'} query={query} previewContext={previewContext} /> : section === 'categories' ? <section aria-labelledby="study-hall-categories">
        <SectionHeading id="study-hall-categories" title={entry === 'reading' ? 'Reading Categories' : current.title+' categories'} description="Choose a focused topic or practice several topics together in General / Mixed Review." count={`${topics.length} categories`} />
        <section className="study-hall-mixed-review"><h3>General / Mixed Review</h3><p>Worksheets that intentionally bring several topics together.</p><StudyHallWorksheetLinks subject="english" area={entry} scope="mixed" query={query} previewContext={previewContext}/></section>
        <EnglishTopicGroups topics={topics} area={entry} previewContext={previewContext}/>
        {!topics.length && <EmptyState onClear={clearFilters} />}
      </section> : section === 'worksheets' ? <WorksheetSection area={entry} query={query} previewContext={previewContext} /> : section === 'advanced' ? <section aria-labelledby="advanced-readings-title">
        <SectionHeading id="advanced-readings-title" title="Advanced Readings" description="Challenging passages and worksheets selected by your teacher." count={`${advanced.length} ${advanced.length === 1 ? 'passage' : 'passages'}`} />
        <div className="study-hall-filters"><label>Reading genre<select value={genre} onChange={event => updateFilters({ genre: event.target.value })}><option value="">All genres</option>{[...new Set(advancedPassageMaterials.map(item => item.questionType))].sort().map(value => <option key={value}>{value}</option>)}</select></label><SortSelect value={sort} onChange={value => updateFilters({ sort: value })} /></div>
        <PassageList materials={advanced} previewContext={previewContext} onClear={clearFilters} />
        <WorksheetSection area="advanced" query={query} previewContext={previewContext} />
      </section> : <section aria-labelledby="study-hall-library-title">
        <SectionHeading id="study-hall-library-title" title="Library" description="Find a passage by title, author, source, exam, or reading skill. Versions stay together." count={`${passages.length} of ${library.length} readings`} />
        <div className="study-hall-filters">
          <label>Source<select value={source} onChange={event => updateFilters({ source: event.target.value })}><option value="">All sources</option>{PASSAGE_CATEGORIES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label>Passage type<select value={type} onChange={event => updateFilters({ type: event.target.value })}><option value="">All types</option>{['Informational', 'Literary', 'Poem', 'Revising/Editing'].map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Reading skill<select value={skill} onChange={event => updateFilters({ skill: event.target.value })}><option value="">All skills</option>{[...new Set(library.flatMap(item => item.skills ?? []))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
          <SortSelect value={sort} onChange={value => updateFilters({ sort: value })} questions />
        </div>
        {settingsError && <p role="status">{settingsError}</p>}
        <PassageList settings={bookSettings} materials={passages} previewContext={previewContext} onClear={clearFilters} />
      </section>}
    </div>
  </StudentPortalShell>;
}

function SectionHeading({ id, title, description, count }: { id: string; title: string; description: string; count?: string }) {
  return <header className="study-hall-section-title"><div><h3 id={id}>{title}</h3><p>{description}</p></div>{count && <span role="status">{count}</span>}</header>;
}
function SortSelect({ value, onChange, questions = false }: { value: string; onChange: (value: string) => void; questions?: boolean }) {
  return <label>Sort by<select value={value} onChange={event => onChange(event.target.value)}><option value="title">Title A–Z</option><option value="title-desc">Title Z–A</option>{questions && <option value="questions">Fewest questions</option>}</select></label>;
}
function WorksheetSection({ area, query, previewContext }: { area: 'reading' | 'editing' | 'standalone' | 'advanced'; query: string; previewContext: StudentPreviewContext }) {
  return <section className="study-hall-worksheet-section" aria-label="Worksheets"><SectionHeading id={`${area}-worksheets`} title="Worksheets" description="Short, focused sets organized by category. Your saved work stays with each worksheet." /><StudyHallWorksheetLinks subject="english" area={area} query={query} previewContext={previewContext} /></section>;
}
function EnglishTopicGroups({topics,area,previewContext}:{topics:StudentMaterial[];area:'reading'|'editing'|'standalone';previewContext:StudentPreviewContext}){
  const groups=area==='reading'?[{title:'Ideas & Evidence',matches:/central|point of view|evidence|inference/i},{title:'Language & Structure',matches:/./}]:[{title:'Sentence & Grammar',matches:/sentence|pronoun|verb|modifier|punctuation/i},{title:'Meaning & Organization',matches:/./}];
  const used=new Set<string>();
  return <div className="study-hall-topic-groups">{groups.map(group=>{const members=topics.filter(topic=>!used.has(topic.id)&&group.matches.test(topic.title));members.forEach(topic=>used.add(topic.id));return members.length?<section key={group.title}><h3>{group.title}</h3><div className="study-hall-topic-grid">{members.map(material=><AppLink key={material.id} href={appendStudentPreview(material.href+(area==='standalone'?(material.href.includes('?')?'&':'?')+'area=standalone':''),previewContext)}><strong>{material.title}</strong><span>View worksheets and practice</span><ArrowRight size={18} aria-hidden="true"/></AppLink>)}</div></section>:null;})}</div>;
}
function PassageList({ materials, previewContext, onClear, settings = {} }: { materials: StudentMaterial[]; previewContext: StudentPreviewContext; onClear: () => void; settings?: Record<string, LibraryBookSettings> }) {
  if (!materials.length) return <EmptyState onClear={onClear} />;
  return <ul className="study-hall-reading-list study-hall-cover-catalog">{materials.map(material => <li key={material.id}>
    <AppLink className={`study-hall-catalog-cover is-${material.tone ?? 'emerald'}`} aria-label={`Read ${material.title}`} href={appendStudentPreview(material.href, previewContext)}>
      {material.coverImage ? <img src={material.coverImage} alt={material.coverAlt || `${material.title} cover`} loading="lazy" /> : <span className="study-hall-title-cover"><BookOpen size={22} aria-hidden="true" /><strong>{material.title}</strong><span>{material.author && material.author !== 'SHSAT Library' ? material.author : 'SHSAT Library'}</span></span>}
    </AppLink>
    <div className="study-hall-reading-body"><div className="study-hall-reading-meta"><span>{(material.passageCategories ?? [passageCategory(material.passageCategory)]).map(passageCategoryLabel).join(' / ')}</span><span>{material.readingFormat}</span></div>
      <h4><AppLink href={appendStudentPreview(material.href, previewContext)}>{material.title}</AppLink></h4>
      {material.author && !['SHSAT Library', 'Nathan Tutors Editorial'].includes(material.author) && <p className="study-hall-reading-author">{material.author}</p>}
      {!!material.examLabels?.length && <details className="study-hall-appearances"><summary>Appears in {material.examLabels.length} {material.examLabels.length === 1 ? 'exam' : 'exams'}</summary><ul>{material.examLabels.map(label => <li key={label}>{label}</li>)}</ul></details>}
    </div>
    <div className="study-hall-reading-action"><span>{settings[material.href.split('/').at(-1) ?? '']?.questionIds.length ?? material.questionCount} {material.questionCount === 1 ? 'question' : 'questions'}{(material.versionCount ?? 0) > 1 && <small>{material.versionCount} versions combined</small>}</span><AppLink aria-label={`Open ${material.title}`} href={appendStudentPreview(material.href, previewContext)}>Open <ArrowRight size={16} aria-hidden="true" /></AppLink></div>
    {previewContext.mode === 'teacher' && material.libraryCollection === 'SHSAT' && <div className="study-hall-book-settings-link"><AppLink href={`/teacher/library/${encodeURIComponent(material.href.split('/').at(-1) ?? '')}#book-settings`}>Book settings</AppLink>{(() => { const book = getExamLibraryPassage(material.href.split('/').at(-1) ?? ''); return book && libraryBookNeedsReview(book, settings[book.id]) ? <span className="library-review-badge">Versions need review</span> : null; })()}</div>}
  </li>)}</ul>;
}
function EmptyState({ onClear }: { onClear: () => void }) {
  return <div className="study-hall-empty"><BookOpen size={26} aria-hidden="true" /><h3>No matching resources</h3><p>Try a shorter search or clear your filters to browse everything in this section.</p><button type="button" onClick={onClear}>Clear search &amp; filters</button></div>;
}
