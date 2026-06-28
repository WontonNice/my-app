import { lazy, Suspense } from "react";

const AdaptivePracticePage = lazy(() =>
  import("./pages/AdaptivePracticePage").then((module) => ({ default: module.AdaptivePracticePage })),
);
const AdvancedPassagePage = lazy(() =>
  import("./pages/AdvancedPassagePage").then((module) => ({ default: module.AdvancedPassagePage })),
);
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const ExamLaunchPage = lazy(() =>
  import("./pages/ExamLaunchPage").then((module) => ({ default: module.ExamLaunchPage })),
);
const ExamResultsPage = lazy(() =>
  import("./pages/ExamResultsPage").then((module) => ({ default: module.ExamResultsPage })),
);
const ExamSessionPage = lazy(() =>
  import("./pages/ExamSessionPage").then((module) => ({ default: module.ExamSessionPage })),
);
const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const StudentDashboardPage = lazy(() =>
  import("./pages/StudentDashboardPage").then((module) => ({ default: module.StudentDashboardPage })),
);
const StudyHallPage = lazy(() =>
  import("./pages/StudyHallPage").then((module) => ({ default: module.StudyHallPage })),
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/TeacherDashboardPage").then((module) => ({ default: module.TeacherDashboardPage })),
);
const TopicPracticePage = lazy(() =>
  import("./pages/TopicPracticePage").then((module) => ({ default: module.TopicPracticePage })),
);

function CurrentPage() {
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

  if (path.startsWith("/advanced-practice/")) {
    return <AdvancedPassagePage />;
  }

  if (path.startsWith("/practice/")) {
    return <TopicPracticePage />;
  }

  if (path.startsWith("/exam/") && path.endsWith("/session")) {
    return <ExamSessionPage />;
  }

  if (path.startsWith("/results/")) {
    return <ExamResultsPage />;
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

function App() {
  return (
    <Suspense fallback={<main className="loading-shell">Loading...</main>}>
      <CurrentPage />
    </Suspense>
  );
}

export default App;
