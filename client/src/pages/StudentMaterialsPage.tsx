import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, BookOpen, FileText, Filter, KeyRound, Library, Search } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { StudentPortalShell } from "../components/StudentPortalShell";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import {
  studentMaterials,
  type MaterialSubject,
  type ReadingCollection,
  type ReadingFormat,
  type StudentMaterial,
} from "../lib/studentMaterials";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";

type CollectionFilter = ReadingCollection | "All collections";
type PassageFilter = Exclude<ReadingFormat, "Long reading"> | "All passage types";

const collectionFilters: CollectionFilter[] = ["All collections", "SHSAT", "Advanced Reading"];
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
  const [activeCollection, setActiveCollection] = useState<CollectionFilter>("All collections");
  const [activePassageType, setActivePassageType] = useState<PassageFilter>("All passage types");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [query, setQuery] = useState(getInitialQuery);
  const normalizedQuery = query.trim().toLowerCase();

  const topicMaterials = useMemo(
    () => studentMaterials.filter((material) => (
      material.subject === activeSubject &&
      material.kind !== "Passage practice" &&
      material.kind !== "Long reading" &&
      materialMatchesQuery(material, normalizedQuery)
    )),
    [activeSubject, normalizedQuery],
  );

  const passageMaterials = useMemo(
    () => studentMaterials.filter((material) => {
      if (material.subject !== "English" || material.kind !== "Passage practice") return false;
      if (activeCollection !== "All collections" && material.libraryCollection !== activeCollection) return false;
      if (activePassageType !== "All passage types" && material.readingFormat !== activePassageType) return false;
      return materialMatchesQuery(material, normalizedQuery);
    }),
    [activeCollection, activePassageType, normalizedQuery],
  );

  const longReadingMaterials = useMemo(
    () => studentMaterials.filter((material) => (
      material.subject === "English" &&
      material.kind === "Long reading" &&
      (activeCollection === "All collections" || material.libraryCollection === activeCollection) &&
      materialMatchesQuery(material, normalizedQuery)
    )),
    [activeCollection, normalizedQuery],
  );

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession) return <main className="loading-shell">Loading Study Hall...</main>;
  if (!isSupabaseConfigured) return <main className="loading-shell">Supabase auth is not configured. Add your Vite Supabase env vars, then log in.</main>;

  function selectSubject(subject: MaterialSubject) {
    setActiveSubject(subject);
    setActiveCollection("All collections");
    setActivePassageType("All passage types");
  }

  const activeFilterCount = Number(activeCollection !== "All collections") + Number(activePassageType !== "All passage types");

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
          {activeSubject === "English" ? <button aria-expanded={isFiltersOpen} onClick={() => setIsFiltersOpen((current) => !current)} type="button"><Filter size={16} /> Library filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}</button> : null}
        </div>

        <div className="student-subject-switcher" aria-label="Choose a subject">
          {(["English", "Math"] as MaterialSubject[]).map((subject) => <button aria-pressed={activeSubject === subject} key={subject} onClick={() => selectSubject(subject)} type="button">{subject}</button>)}
        </div>

        <TopicCatalog materials={topicMaterials} previewContext={previewContext} subject={activeSubject} />

        {activeSubject === "English" ? (
          <EnglishLibrary
            activeCollection={activeCollection}
            activePassageType={activePassageType}
            isFiltersOpen={isFiltersOpen}
            longReadingMaterials={longReadingMaterials}
            materials={passageMaterials}
            onCollectionChange={setActiveCollection}
            onPassageTypeChange={setActivePassageType}
            previewContext={previewContext}
            query={normalizedQuery}
          />
        ) : null}
      </div>
    </StudentPortalShell>
  );
}

function TopicCatalog({ materials, previewContext, subject }: { materials: StudentMaterial[]; previewContext: StudentPreviewContext; subject: MaterialSubject }) {
  return (
    <section className="study-hall-topic-catalog" aria-labelledby="study-hall-topic-title">
      <header className="study-hall-section-heading">
        <div><p>Topic catalog</p><h2 id="study-hall-topic-title">{subject === "English" ? "Build a reading skill" : "Choose a math topic"}</h2><span>{subject === "English" ? "Short, focused practice organized by the exact skill you want to strengthen." : "Open a topic to practice the question types collected there."}</span></div>
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
  activeCollection: CollectionFilter;
  activePassageType: PassageFilter;
  isFiltersOpen: boolean;
  longReadingMaterials: StudentMaterial[];
  materials: StudentMaterial[];
  onCollectionChange: (collection: CollectionFilter) => void;
  onPassageTypeChange: (format: PassageFilter) => void;
  previewContext: StudentPreviewContext;
  query: string;
};

function EnglishLibrary({ activeCollection, activePassageType, isFiltersOpen, longReadingMaterials, materials, onCollectionChange, onPassageTypeChange, previewContext, query }: EnglishLibraryProps) {
  return (
    <section className="study-hall-library" aria-labelledby="study-hall-library-title">
      <header className="study-hall-section-heading">
        <div><p>Digital library</p><h2 id="study-hall-library-title">Library</h2><span>Browse teacher-selected passages by collection and reading type.</span></div>
        <strong>{materials.length} {materials.length === 1 ? "passage" : "passages"}</strong>
      </header>

      <div className={`study-hall-library-filters${isFiltersOpen ? " is-open" : ""}`}>
        <fieldset><legend>Collection</legend><div>{collectionFilters.map((collection) => <button aria-pressed={activeCollection === collection} key={collection} onClick={() => onCollectionChange(collection)} type="button">{collection}</button>)}</div></fieldset>
        <fieldset><legend>Passage type</legend><div>{passageFilters.map((format) => <button aria-pressed={activePassageType === format} key={format} onClick={() => onPassageTypeChange(format)} type="button">{format}</button>)}</div></fieldset>
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
      <span className="study-hall-book-tags"><small>{material.libraryCollection}</small><small>{material.readingFormat}</small></span>
      <strong className="study-hall-book-title">{material.title}</strong>
      <span className="study-hall-book-author">{material.author || "Teacher selection"}</span>
      <span className="study-hall-book-access"><KeyRound size={12} /> Teacher code required</span>
      <span className="study-hall-book-meta">{material.questionCount} questions <ArrowRight size={15} /></span>
    </AppLink>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="student-material-empty"><Search size={24} /><h3>{label}</h3></div>;
}
