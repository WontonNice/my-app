import { examLibraryMetadata, type ExamLibraryFilter, type ExamLibraryItem } from "../lib/examLibrary";
import "../styles/exam-library.css";
export function ExamLibraryFilters({ exams, value, onChange }: { exams: ExamLibraryItem[]; value: ExamLibraryFilter; onChange: (value: ExamLibraryFilter) => void }) {
  const metadata = exams.map(examLibraryMetadata);
  const options = (key: keyof ExamLibraryFilter) => [...new Set(metadata.map(item => item[key]).filter(Boolean))].sort((a, b) => key === "year" ? b.localeCompare(a, undefined, { numeric: true }) : a.localeCompare(b, undefined, { numeric: true }));
  return <div className="exam-library-dimensions">
    {(["year", "form", "category"] as const).map(key => <label key={key}>{key === "year" ? "Test year" : key === "form" ? "Form" : "Category"}<select value={value[key]} onChange={event => onChange({ ...value, [key]: event.target.value })}>
      <option value="">{key === "year" ? "All years" : key === "form" ? "All forms" : "All categories"}</option>
      {options(key).map(option => <option key={option} value={option}>{key === "form" ? "Form " + option : option}</option>)}
    </select></label>)}
    {Object.values(value).some(Boolean) && <button type="button" onClick={() => onChange({ year: "", form: "", category: "" })}>Reset filters</button>}
  </div>;
}

