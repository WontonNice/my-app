import { AuthPage } from "./pages/AuthPage";
import { AdaptivePracticePage } from "./pages/AdaptivePracticePage";
import { ExamLaunchPage } from "./pages/ExamLaunchPage";
import { ExamSessionPage } from "./pages/ExamSessionPage";
import { HomePage } from "./pages/HomePage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StudyHallPage } from "./pages/StudyHallPage";
import { TeacherDashboardPage } from "./pages/TeacherDashboardPage";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <StudyHallPage />;
  }

  if (path === "/study-hall") {
    return <AdaptivePracticePage />;
  }

  if (path.startsWith("/study-hall/")) {
    return <StudentDashboardPage />;
  }

  if (path.startsWith("/exam/") && path.endsWith("/session")) {
    return <ExamSessionPage />;
  }

  if (path.startsWith("/exam/")) {
    return <ExamLaunchPage />;
  }

  if (path === "/teacher") {
    return <TeacherDashboardPage />;
  }

  if (path === "/login") {
    return <AuthPage mode="login" />;
  }

  if (path === "/signup") {
    return <AuthPage mode="signup" />;
  }

  return <HomePage />;
}

export default App;
