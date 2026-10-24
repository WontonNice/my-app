// Fictional QA identity and in-memory API only; used by preview-exam-sections.cjs.
import {createRoot} from "react-dom/client";
import {ExamSessionPage} from "../client/src/pages/ExamSessionPage";
import "../client/src/styles/global.css";
const id="qa-section-exam";
if (!sessionStorage.getItem("qa-section-initialized")) { sessionStorage.setItem("qa-section-initialized","yes");sessionStorage.setItem(`exam-start-subject:${id}`,"math"); }
createRoot(document.getElementById("root")!).render(<ExamSessionPage/>);
