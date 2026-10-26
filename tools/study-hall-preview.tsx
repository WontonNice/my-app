// Isolated presentation QA: the preview builder supplies a fictional session.
import { createRoot } from "react-dom/client";
import { useEffect, useState } from 'react';
import { InfinitePracticePage } from '../client/src/pages/InfinitePracticePage';
import { PracticeStudioPage } from "../client/src/pages/PracticeStudioPage";
import { StudentDashboardPage } from "../client/src/pages/StudentDashboardPage";
import { StudentMaterialsPage } from "../client/src/pages/StudentMaterialsPage";
import { StudentTopicHubPage } from "../client/src/pages/StudentTopicHubPage";
import { AdvancedPassagePage } from "../client/src/pages/AdvancedPassagePage";
import "../client/src/styles/global.css";
function Preview() {
  const [path, setPath] = useState(location.pathname + location.search);
  useEffect(() => { const update = () => setPath(location.pathname + location.search); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  return path.split('?')[0]==='/study-hall/shsat' ? <StudentDashboardPage/> : path.startsWith('/teacher/practice-studio') ? <PracticeStudioPage/> : path.startsWith('/math-practice/inequalities') || path.startsWith('/math-practice/infinite') ? <InfinitePracticePage key={path} /> : path.includes('/library/') ? <AdvancedPassagePage /> : path.includes('/topics/') ? <StudentTopicHubPage /> : <StudentMaterialsPage key={path + location.search} teacherWorkspace={path.startsWith("/teacher/study-hall")} />;
}
createRoot(document.getElementById("root")!).render(<Preview />);
