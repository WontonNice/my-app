import { examLibraryMetadata, type ExamLibraryFilter, type ExamLibraryItem } from "../lib/examLibrary";
import "../styles/exam-library.css";
export function ExamLibraryFilters({ exams, value, onChange, hideForm = false }: { exams: ExamLibraryItem[]; hideForm?: boolean; value: ExamLibraryFilter; onChange: (value: ExamLibraryFilter) => void }) {
  const metadata = exams.map(examLibraryMetadata);
  const options = (key: keyof ExamLibraryFilter) => [...new Set(metadata.map(item => item[key]).filter(Boolean))].sort((a, b) => key === "year" ? b.localeCompare(a, undefined, { numeric: true }) : a.localeCompare(b, undefined, { numeric: true }));
  return <div className="exam-library-dimensions">
    {(["publisher", "shsatLevel", "year", "form", "category", "collection"] as const).filter(key => (!hideForm || key !== "form") && (!['publisher','shsatLevel','collection'].includes(key)||options(key).length>0)).map(key => <label key={key}>{{year:'Year',form:'Form',category:'Category',publisher:'Source',shsatLevel:'SHSAT level',collection:'Collection'}[key]}<select value={value[key] || ''} onChange={event => onChange({ ...value, [key]: event.target.value })}>
      <option value="">All {{year:'years',form:'forms',category:'categories',publisher:'sources',shsatLevel:'levels',collection:'collections'}[key]}</option>
      {options(key).map(option => <option key={option} value={option}>{key === "form" ? "Form " + option : key==='shsatLevel'?'SHSAT '+option:option}</option>)}
    </select></label>)}
    {Object.values(value).some(Boolean) && <button type="button" onClick={() => onChange({ year: "", form: "", category: "" })}>Reset filters</button>}
  </div>;
}

