// Isolated presentation QA: the preview builder supplies a fictional session.
import { createRoot } from "react-dom/client";
import { StudentMaterialsPage } from "../client/src/pages/StudentMaterialsPage";
import { StudentTopicHubPage } from "../client/src/pages/StudentTopicHubPage";
import { AdvancedPassagePage } from "../client/src/pages/AdvancedPassagePage";
import "../client/src/styles/global.css";
const path = location.pathname;
createRoot(document.getElementById("root")!).render(path.includes("/library/") ? <AdvancedPassagePage /> : path.includes("/topics/") ? <StudentTopicHubPage /> : <StudentMaterialsPage />);
