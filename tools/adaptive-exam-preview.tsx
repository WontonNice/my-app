// Isolated presentation QA: the preview builder supplies a fictional student and in-memory storage.
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { AdaptiveMathExamPage } from "../client/src/pages/AdaptiveMathExamPage";
import { StudentAssessmentsPage } from "../client/src/pages/StudentAssessmentsPage";
import "../client/src/styles/global.css";

function Preview() {
  const [path, setPath] = useState(location.pathname + location.search);
  useEffect(() => { const update = () => setPath(location.pathname + location.search); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
  return path.split("?")[0] === "/study-hall/shsat/assessments/adaptive-math" ? <AdaptiveMathExamPage key={path} /> : <StudentAssessmentsPage key={path} />;
}
createRoot(document.getElementById("root")!).render(<Preview />);
