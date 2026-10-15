import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, BookOpen, FileText, Filter, KeyRound, Library, Search } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import {
  studentMaterials,
  readingPracticeMaterials,
  editingPracticeMaterials,
  revisingEditingMaterial,
  studentLibraryBooks,
  advancedPassageMaterials,
  type MaterialSubject,
  type ReadingFormat,
  type StudentMaterial,
} from "../lib/studentMaterials";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { PASSAGE_CATEGORIES, passageCategory, passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import "../styles/learning-plan.css";

type PassageFilter = Exclude<ReadingFormat, "Long reading"> | "All passage types";

const passageFilters: PassageFilter[] = ["All passage types", "Poem", "Literary", "Informational"];

function getInitialSubject(): MaterialSubject {
  return new URLSearchParams(window.location.search).get("subject") === "math" ? "Math" : "English";
}

function getInitialQuery() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function materialMatchesQuery(material: StudentMaterial, query: string) {
  if (!query) return true;
  return [
    material.title,
    material.author,
    material.description,
    material.category,
    material.questionType,
    material.libraryCollection,
    material.readingFormat,
  ].join(" ").toLowerCase().includes(query);
}

export function StudentMaterialsPage() {
  const { isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [activeSubject, setActiveSubject] = useState<MaterialSubject>(getInitialSubject);
  const [activePassageType, setActivePassageType] = useState<PassageFilter>("All passage types");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [query, setQuery] = useState(getInitialQuery);
  const [sourceCategory, setSourceCategory] = useState("");
  const [passageSort, setPassageSort] = useState("title");
  const [advancedGenre, setAdvancedGenre] = useState("");
  const [advancedSort, setAdvancedSort] = useState("title");
  const normalizedQuery = query.trim().toLowerCase();

  const topicMaterials = useMemo(
    () => (activeSubject === "English" ? readingPracticeMaterials : studentMaterials).filter((material) => (
      material.subject === activeSubject &&
      material.kind !== "Passage practice" &&
      material.kind !== "Long reading" &&
      materialMatchesQuery(material, normalizedQuery)
    )),
    [activeSubject, normalizedQuery],
  );

  const passageMaterials = useMemo(
    () => studentLibraryBooks.filter((material) => {
      if (material.subject !== "English" || material.kind !== "Passage practice" || material.libraryCollection === "Advanced Reading") return false;
      if (activePassageType !== "All passage types" && material.readingFormat !== activePassageType) return false;
      if (sourceCategory && !(material.passageCategories ?? [passageCategory(material.passageCategory)]).includes(passageCategory(sourceCategory))) return false;
      return materialMatchesQuery(material, normalizedQuery);
    }).sort((a, b) => passageSort === "category" ? passageCategoryLabel(a.passageCategory).localeCompare(passageCategoryLabel(b.passageCategory)) || a.title.localeCompare(b.title) : (passageSort === "title-desc" ? -1 : 1) * a.title.localeCompare(b.title)),
    [activePassageType, normalizedQuery, sourceCategory, passageSort],
  );

  const longReadingMaterials = useMemo(
    () => studentLibraryBooks.filter((material) => (
      material.subject === "English" &&
      material.kind === "Long reading" &&
      (!sourceCategory || passageCategory(material.passageCategory) === sourceCategory) &&
      materialMatchesQuery(material, normalizedQuery)
    )),
    [normalizedQuery, sourceCategory],
  );

  const advancedMaterials = useMemo(() => advancedPassageMaterials
    .filter(material => (!advancedGenre || material.questionType === advancedGenre) && materialMatchesQuery(material, normalizedQuery))
    .sort((a, b) => (advancedSort === "title-desc" ? -1 : 1) * a.title.localeCompare(b.title)),
  [advancedGenre, advancedSort, normalizedQuery]);

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading Study Hall...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  function selectSubject(subject: MaterialSubject) {
    setActiveSubject(subject);
    setActivePassageType("All passage types");
  }

  const activeFilterCount = Number(activePassageType !== "All passage types") + Number(Boolean(sourceCategory));

  return (
    <StudentPortalShell activeId="materials" onSignOut={handleSignOut} previewContext={previewContext} studentName={studentName}>
      <div className="student-materials-page study-hall-catalog-page">
        <header className="student-materials-heading">
          <p>Study Hall / {activeSubject}</p>
          <h1>{activeSubject} Study Hall</h1>
          <span>{activeSubject === "English" ? "Practice individual skills, then explore passages and books from your teacher's library." : "Browse focused math practice by topic and question type."}</span>
        </header>

        <div className="student-materials-tools">
          <label>
            <Search aria-hidden="true" size={18} />
            <span className="sr-only">Search the {activeSubject} Study Hall</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeSubject} topics and resources`} type="search" value={query} />
          </label>
        </div>

        <div className="student-subject-switcher" aria-label="Choose a subject">
          {(["English", "Math"] as MaterialSubject[]).map((subject) => <button aria-pressed={activeSubject === subject} key={subject} onClick={() => selectSubject(subject)} type="button">{subject}</button>)}
        </div>

        {activeSubject === "English" && <nav className="student-topic-jump-nav" aria-label="English Study Hall sections">
          <a href="#study-hall-topic-title"><BookOpen size={16} />Reading skills</a>
          <a href="#editing-topic-title"><FileText size={16} />Revising &amp; Editing</a>
          <a href="#advanced-readings"><BookMarked size={16} />Advanced readings</a>
          <a href="#study-hall-library-title"><Library size={16} />Library</a>
        </nav>}

        <TopicCatalog materials={topicMaterials} previewContext={previewContext} subject={activeSubject} />

        {activeSubject === "English" && <section aria-label="Revising & Editing"><TopicCatalog materials={editingPracticeMaterials.filter(material => materialMatchesQuery(material, normalizedQuery))} previewContext={previewContext} subject="English" title="Revising & Editing" headingId="editing-topic-title" description="Practice grammar, sentence structure, usage, and organization by topic." /><AppLink className="study-hall-editing-assessment" href={appendStudentPreview(revisingEditingMaterial.href, previewContext)}><FileText size={18} /><span><strong>{revisingEditingMaterial.title}</strong><small>Open assigned assessments for revising and editing practice.</small></span><ArrowRight size={18} /></AppLink></section>}
        {activeSubject === "English" && <section className="study-hall-library study-hall-advanced-readings" id="advanced-readings" aria-labelledby="advanced-readings-title">
          <header className="study-hall-section-heading"><div><p>SAT passages</p><h2 id="advanced-readings-title">Advanced readings</h2><span>Explore more challenging passages and complete question sets selected by your teacher.</span></div><strong>{advancedMaterials.length} {advancedMaterials.length === 1 ? "passage" : "passages"}</strong></header>
          <div className="study-hall-library-toolbar">
            <label>Reading genre<select value={advancedGenre} onChange={event => setAdvancedGenre(event.target.value)}><option value="">All genres</option>{[...new Set(advancedPassageMaterials.map(material => material.questionType))].sort().map(genre => <option key={genre}>{genre}</option>)}</select></label>
            <label>Sort advanced readings<select value={advancedSort} onChange={event => setAdvancedSort(event.target.value)}><option value="title">Title A–Z</option><option value="title-desc">Title Z–A</option></select></label>
            <button onClick={() => { setAdvancedGenre(""); setAdvancedSort("title"); }} type="button">Clear filters</button>
          </div>
          {advancedMaterials.length ? <div className="study-hall-book-scroll">{advancedMaterials.map(material => <LibraryBook key={material.id} material={material} previewContext={previewContext} />)}</div> : <EmptyState label={normalizedQuery ? "No advanced readings match that search" : advancedGenre ? "No advanced readings match that genre" : "Your teacher's SAT passages will appear here"} />}
        </section>}
        {activeSubject === "English" ? (
          <EnglishLibrary
            activePassageType={activePassageType}
            isFiltersOpen={isFiltersOpen}
            longReadingMaterials={longReadingMaterials}
            materials={passageMaterials}
            onPassageTypeChange={setActivePassageType}
            previewContext={previewContext}
            query={normalizedQuery}
            sourceCategory={sourceCategory}
            passageSort={passageSort}
            onCategoryChange={setSourceCategory}
            onSortChange={setPassageSort}
            onClearFilters={() => { setSourceCategory(""); setActivePassageType("All passage types"); setPassageSort("title"); }}
            activeFilterCount={activeFilterCount}
            onToggleFilters={() => setIsFiltersOpen(current => !current)}
          />
        ) : null}
      </div>
    </StudentPortalShell>
  );
}

function TopicCatalog({ materials, previewContext, subject, title, headingId = "study-hall-topic-title", description }: { materials: StudentMaterial[]; previewContext: StudentPreviewContext; subject: MaterialSubject; title?: string; headingId?: string; description?: string }) {
  return (
    <section className="study-hall-topic-catalog" aria-labelledby={headingId}>
      <header className="study-hall-section-heading">
        <div><p>Topic catalog</p><h2 id={headingId}>{title || (subject === "English" ? "Build a reading skill" : "Choose a math topic")}</h2><span>{description || (subject === "English" ? "Short, focused practice organized by the exact skill you want to strengthen." : "Open a topic to practice the question types collected there.")}</span></div>
        <strong>{materials.length} {materials.length === 1 ? "topic" : "topics"}</strong>
      </header>
      {materials.length ? (
        <div className={`study-hall-topic-grid${subject === "Math" ? " is-math" : ""}`}>
          {materials.map((material, index) => <TopicCard index={index} key={material.id} material={material} previewContext={previewContext} />)}
        </div>
      ) : <EmptyState label="No topics match that search" />}
    </section>
  );
}

function TopicCard({ index, material, previewContext }: { index: number; material: StudentMaterial; previewContext: StudentPreviewContext }) {
  const Icon = material.kind === "Practice set" ? BookOpen : FileText;
  return (
    <AppLink className="study-hall-topic-card" href={appendStudentPreview(material.href, previewContext)}>
      <span className="study-hall-topic-number">{String(index + 1).padStart(2, "0")}</span>
      <span className="study-hall-topic-icon"><Icon aria-hidden="true" size={18} /></span>
      <small>{material.category}</small>
      <strong>{material.title}</strong>
      <em>{material.description}</em>
      <span className="study-hall-topic-count">{material.questionCount} {material.questionCount === 1 ? "question" : "questions"}<ArrowRight size={16} /></span>
    </AppLink>
  );
}

type EnglishLibraryProps = {
  activePassageType: PassageFilter;
  isFiltersOpen: boolean;
  longReadingMaterials: StudentMaterial[];
  materials: StudentMaterial[];
  onPassageTypeChange: (format: PassageFilter) => void;
  previewContext: StudentPreviewContext;
  query: string;
  sourceCategory: string; passageSort: string; activeFilterCount: number;
  onCategoryChange: (value: string) => void; onSortChange: (value: string) => void;
  onClearFilters: () => void; onToggleFilters: () => void;
};

function EnglishLibrary({ activePassageType, isFiltersOpen, longReadingMaterials, materials, onPassageTypeChange, previewContext, query, sourceCategory, passageSort, onCategoryChange, onSortChange, onClearFilters, activeFilterCount, onToggleFilters }: EnglishLibraryProps) {
  return (
    <section className="study-hall-library" aria-labelledby="study-hall-library-title">
      <header className="study-hall-section-heading">
        <div><p>SHSAT library</p><h2 id="study-hall-library-title">Library</h2><span>Browse teacher-selected SHSAT passages by category and reading type.</span></div>
        <div className="study-hall-library-header-actions"><strong>{materials.length} {materials.length === 1 ? "passage" : "passages"}</strong><button aria-expanded={isFiltersOpen} aria-controls="library-passage-filters" onClick={onToggleFilters} type="button"><Filter size={16} /> Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}</button></div>
      </header>

      <div id="library-passage-filters" className={`study-hall-library-filters${isFiltersOpen ? " is-open" : ""}`}>
        <fieldset><legend>Passage type</legend><div>{passageFilters.map((format) => <button aria-pressed={activePassageType === format} key={format} onClick={() => onPassageTypeChange(format)} type="button">{format}</button>)}</div></fieldset>
        <div className="study-hall-library-toolbar"><label>Passage category<select value={sourceCategory} onChange={event => onCategoryChange(event.target.value)}><option value="">All categories</option>{PASSAGE_CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label><label>Sort passages<select value={passageSort} onChange={event => onSortChange(event.target.value)}><option value="title">Title A–Z</option><option value="title-desc">Title Z–A</option><option value="category">Passage category</option></select></label><button onClick={onClearFilters} type="button">Clear filters</button></div>
      </div>

      <div className="study-hall-shelf-heading"><div><BookOpen size={18} /><span><strong>Single passages</strong><small>Choose a cover to start reading</small></span></div><em>Scroll to explore →</em></div>
      {materials.length ? (
        <div className="study-hall-book-scroll">
          {materials.map((material) => <LibraryBook key={material.id} material={material} previewContext={previewContext} />)}
        </div>
      ) : <EmptyState label={query ? "No library passages match that search" : "No passages match those filters"} />}

      <div className="study-hall-long-reading" id="long-reading">
        <div className="study-hall-shelf-heading"><div><BookMarked size={18} /><span><strong>Long reading</strong><small>Books, novellas, and extended works</small></span></div><em>{longReadingMaterials.length ? `${longReadingMaterials.length} available` : "Teacher curated"}</em></div>
        {longReadingMaterials.length ? <div className="study-hall-book-scroll">{longReadingMaterials.map((material) => <LibraryBook key={material.id} material={material} previewContext={previewContext} />)}</div> : (
          <div className="study-hall-long-reading-empty"><span><Library size={28} /></span><div><small>Long reading shelf</small><h3>Your next book will appear here</h3><p>Books and longer readings uploaded by your teacher will display with their cover, collection, and reading progress.</p></div></div>
        )}
      </div>
    </section>
  );
}

function LibraryBook({ material, previewContext }: { material: StudentMaterial; previewContext: StudentPreviewContext }) {
  return (
    <AppLink className="study-hall-book-card" href={appendStudentPreview(material.href, previewContext)}>
      <span aria-label={material.coverAlt || `${material.title} book cover`} className={`study-hall-book-cover is-${material.tone ?? "emerald"}`} role="img">
        {material.coverImage ? <img alt="" aria-hidden="true" src={material.coverImage} /> : null}
        <span className="study-hall-generated-cover"><small>Nathan Tutors Library</small><strong>{material.title}</strong><em>{material.author || "Teacher selection"}</em></span>
        <span className="study-hall-cover-shadow" />
      </span>
      <span className="study-hall-book-tags"><small>English · {(material.passageCategories ?? [passageCategory(material.passageCategory)]).map(passageCategoryLabel).join(" / ")}</small><small>{material.readingFormat}</small></span>
      <strong className="study-hall-book-title">{material.title}</strong>
      <span className="study-hall-book-author">{material.author || "Teacher selection"}</span>
      <span className="study-hall-book-access"><KeyRound size={12} /> Teacher code required</span>
      <span className="study-hall-book-meta">{material.questionCount} questions{(material.versionCount ?? 0) > 1 ? ` · ${material.versionCount} versions` : ""} <ArrowRight size={15} /></span>
    </AppLink>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="student-material-empty"><Search size={24} /><h3>{label}</h3></div>;
}
