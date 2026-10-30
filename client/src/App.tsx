import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { ClassAccessGate } from "./components/ClassAccessGate";
import { rememberAccountSession } from "./lib/accountSwitching";
import { cacheActiveSession } from "./lib/sessionCache";
import { getSupabaseClient, isSupabaseConfigured } from "./lib/supabase";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StudentAssignmentsPage } from "./pages/StudentAssignmentsPage";
import { StudentAssessmentsPage } from "./pages/StudentAssessmentsPage";
import { StudentClassroomPage } from "./pages/StudentClassroomPage";
import { StudentMaterialsPage } from "./pages/StudentMaterialsPage";
import { StudentResultsPage } from "./pages/StudentResultsPage";
import { StudentTopicHubPage } from "./pages/StudentTopicHubPage";
import { studentCorrectionRoute } from "./lib/correctionNavigation";
import { AccountProvider } from "./features/account/account";
const ProfileSettingsPage = lazy(() => import("./pages/ProfileSettingsPage").then(module => ({ default: module.ProfileSettingsPage })));
const AccountEmailPage = lazy(() => import("./pages/ProfileSettingsPage").then(module => ({ default: module.AccountEmailPage })));

const AnswerSheetsPage = lazy(() => import("./pages/AnswerSheetsPage").then(module => ({ default: module.AnswerSheetsPage })));
const StudentAnswerSheetsPage = lazy(() => import("./pages/StudentAnswerSheetsPage").then(module => ({ default: module.StudentAnswerSheetsPage })));

const AdminDashboardPage = lazy(() =>
  import("./pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })),
);
const AdvancedPassagePage = lazy(() =>
  import("./pages/AdvancedPassagePage").then((module) => ({ default: module.AdvancedPassagePage })),
);
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const BoardPage = lazy(() => import("./pages/BoardPage").then(module => ({ default: module.BoardPage })));
const StudentBoardsPage = lazy(() => import("./pages/StudentBoardsPage").then(module => ({ default: module.StudentBoardsPage })));
const StudentAchievementsPage = lazy(() => import("./pages/StudentAchievementsPage").then(module => ({ default: module.StudentAchievementsPage })));
const StudentGameRoomsPage = lazy(() => import("./pages/StudentGameRoomsPage").then(module => ({ default: module.StudentGameRoomsPage })));
const ExamLaunchPage = lazy(() =>
  import("./pages/ExamLaunchPage").then((module) => ({ default: module.ExamLaunchPage })),
);
const ExamResultsPage = lazy(() =>
  import("./pages/ExamResultsPage").then((module) => ({ default: module.ExamResultsPage })),
);
const ExamCorrectionsPage = lazy(() => import("./pages/ExamCorrectionsPage").then(module => ({ default: module.ExamCorrectionsPage })));
const TeacherCorrectionsPage = lazy(() => import("./pages/TeacherCorrectionsPage").then(module => ({ default: module.TeacherCorrectionsPage })));
const LibraryCorrectionsPage = lazy(() => import("./pages/LibraryCorrectionsPage").then(module => ({ default: module.LibraryCorrectionsPage })));
const ExamSessionPage = lazy(() =>
  import("./pages/ExamSessionPage").then((module) => ({ default: module.ExamSessionPage })),
);
const StaffDashboardPage = lazy(() =>
  import("./pages/StaffDashboardPage").then((module) => ({ default: module.StaffDashboardPage })),
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/TeacherDashboardPage").then((module) => ({ default: module.TeacherDashboardPage })),
);
const TeacherLibraryPage = lazy(() =>
  import("./pages/TeacherLibraryPage").then((module) => ({ default: module.TeacherLibraryPage })),
);
const MathCommandPage = lazy(() => import("./features/math-command/MathCommandPage").then(module => ({ default: module.MathCommandPage })));
const InfinitePracticePage = lazy(() => import("./pages/InfinitePracticePage").then(module => ({ default: module.InfinitePracticePage })));
const ClassroomMealsPage = lazy(() => import("./pages/ClassroomMealsPage").then(module => ({ default: module.ClassroomMealsPage })));
const TeacherMealsPage = lazy(() => import("./pages/TeacherMealsPage").then(module => ({ default: module.TeacherMealsPage })));
const PracticeStudioPage = lazy(() => import("./pages/PracticeStudioPage").then(module => ({ default: module.PracticeStudioPage })));
const MathPracticePage = lazy(() => import("./features/math-command/MathPracticePage").then(module => ({ default: module.MathPracticePage })));
const InfiniteHomeworkPage = lazy(() => import("./features/math-command/InfiniteHomeworkPage").then(module => ({ default: module.InfiniteHomeworkPage })));
const TopicPracticePage = lazy(() =>
  import("./pages/TopicPracticePage").then((module) => ({ default: module.TopicPracticePage })),
);

function withClassAccess(page: ReactNode) {
  return <ClassAccessGate>{page}</ClassAccessGate>;
}

function LegacyStudentHomeRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    params.delete("section");
    const destination = section === "results"
      ? "/study-hall/shsat/results"
      : section === "assessments"
        ? "/study-hall/shsat/assessments"
        : section === "advanced"
          ? "/study-hall/shsat/materials?subject=english"
          : "/study-hall/shsat";
    const destinationUrl = new URL(destination, window.location.origin);
    params.forEach((value, key) => destinationUrl.searchParams.set(key, value));
    window.location.replace(`${destinationUrl.pathname}${destinationUrl.search}${window.location.hash}`);
  }, []);

  return <main className="loading-shell">Opening your dashboard...</main>;
}

function CurrentPage() {
  const path = window.location.pathname;
  if (path === "/") return <HomePage />;
  if (path === "/profile") return <ProfileSettingsPage />;
  if (path === "/account/verify-email") return <AccountEmailPage mode="verify" />;
  if (path === "/forgot-password") return <AccountEmailPage mode="forgot" />;
  if (path === "/reset-password") return <AccountEmailPage mode="reset" />;
  if (/^\/teacher\/corrections\/[^/]+\/?$/.test(path)) return <TeacherCorrectionsPage />;
  if (path.startsWith("/teacher/answer-sheets")) return <AnswerSheetsPage />;
  if (path.startsWith("/answer-sheets/")) return withClassAccess(<AnswerSheetsPage />);
  if (path === "/math-practice/inequalities" || path === "/math-practice/infinite") return withClassAccess(<InfinitePracticePage />);
  if (path === "/teacher/study-hall") return <StudentMaterialsPage teacherWorkspace />;
  if (path === "/teacher/meals") return <TeacherMealsPage />;
  if (path === "/study-hall/shsat/meals") return withClassAccess(<ClassroomMealsPage />);
  if (path === "/teacher/practice-studio") return <PracticeStudioPage />;
  if (path.startsWith("/math-practice/")) return withClassAccess(<MathPracticePage />);
  if (path.startsWith("/infinite-homework/")) return withClassAccess(<InfiniteHomeworkPage />);
  if (path === "/teacher/math-command") return <MathCommandPage />;
  const correctionRoute = studentCorrectionRoute(path);
  if (correctionRoute === "exam") return withClassAccess(<ExamCorrectionsPage />);
  if (correctionRoute === "library") return withClassAccess(<LibraryCorrectionsPage />);
  if (path.startsWith("/boards/")) return <BoardPage />;

  if (path === "/dashboard" || path === "/study-hall") {
    return <LegacyStudentHomeRedirect />;
  }

  if (path.startsWith("/study-hall/")) {
    if (path === "/study-hall/shsat/achievements") return withClassAccess(<StudentAchievementsPage />);
    if (path === "/study-hall/shsat/games") return withClassAccess(<StudentGameRoomsPage />);
    if (path === "/study-hall/shsat/boards") return withClassAccess(<StudentBoardsPage />);
    if (path === "/study-hall/classroom") {
      return <StudentClassroomPage />;
    }
    if (path === "/study-hall/shsat/answer-sheets") return withClassAccess(<StudentAnswerSheetsPage />);
    if (path === "/study-hall/shsat/assignments") {
      return withClassAccess(<StudentAssignmentsPage />);
    }
    if (path === "/study-hall/shsat/assessments") {
      return withClassAccess(<StudentAssessmentsPage />);
    }
    if (path === "/study-hall/shsat/materials") {
      return withClassAccess(<StudentMaterialsPage />);
    }
    if (path.startsWith("/study-hall/shsat/topics/")) {
      return withClassAccess(<StudentTopicHubPage />);
    }
    if (path.startsWith("/study-hall/shsat/library/")) {
      return withClassAccess(<AdvancedPassagePage />);
    }
    if (path === "/study-hall/shsat/results") {
      return withClassAccess(<StudentResultsPage />);
    }
    return withClassAccess(<StudentDashboardPage />);
  }

  if (path.startsWith("/advanced-practice/")) {
    return withClassAccess(<AdvancedPassagePage />);
  }

  if (path.startsWith("/practice/")) {
    return withClassAccess(<TopicPracticePage />);
  }

  if (path.startsWith("/exam/") && path.endsWith("/session")) {
    return withClassAccess(<ExamSessionPage />);
  }

  if (path.startsWith("/results/")) {
    return withClassAccess(<ExamResultsPage />);
  }

  if (path.startsWith("/exam/")) {
    return withClassAccess(<ExamLaunchPage />);
  }

  if (path === "/teacher" || path.startsWith("/teacher/")) {
    return path.startsWith("/teacher/library") ? <TeacherLibraryPage /> : <TeacherDashboardPage />;
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return <AdminDashboardPage />;
  }

  if (path === "/staff") {
    return <StaffDashboardPage />;
  }

  if (path === "/login") {
    return <AuthPage mode="login" />;
  }

  if (path === "/signup") {
    return <AuthPage mode="signup" />;
  }

  return <AuthPage mode="login" />;
}

function App() {
  const [location, setLocation] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`);

  useEffect(() => {
    function handleNavigation() {
      setLocation(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    }
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => cacheActiveSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      cacheActiveSession(session);
      if (session) rememberAccountSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AccountProvider><Suspense fallback={<main className="loading-shell">Loading...</main>}>
      <CurrentPage key={location} />
    </Suspense></AccountProvider>
  );
}

export default App;
