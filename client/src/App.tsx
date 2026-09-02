import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { getStudentClasses } from "./lib/api";
import { rememberAccountSession } from "./lib/accountSwitching";
import { getUserRole } from "./lib/auth";
import { cacheActiveSession, cacheStudentClasses, getActiveSession, getCachedStudentClasses, peekActiveSession } from "./lib/sessionCache";
import { getSupabaseClient, isSupabaseConfigured } from "./lib/supabase";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StudentAssignmentsPage } from "./pages/StudentAssignmentsPage";
import { StudentAssessmentsPage } from "./pages/StudentAssessmentsPage";
import { StudentClassroomPage } from "./pages/StudentClassroomPage";
import { StudentMaterialsPage } from "./pages/StudentMaterialsPage";
import { StudentResultsPage } from "./pages/StudentResultsPage";
import { StudentTopicHubPage } from "./pages/StudentTopicHubPage";

const AdminDashboardPage = lazy(() =>
  import("./pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })),
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
const StaffDashboardPage = lazy(() =>
  import("./pages/StaffDashboardPage").then((module) => ({ default: module.StaffDashboardPage })),
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/TeacherDashboardPage").then((module) => ({ default: module.TeacherDashboardPage })),
);
const TeacherLibraryPage = lazy(() =>
  import("./pages/TeacherLibraryPage").then((module) => ({ default: module.TeacherLibraryPage })),
);
const TopicPracticePage = lazy(() =>
  import("./pages/TopicPracticePage").then((module) => ({ default: module.TopicPracticePage })),
);

function ClassAccessGate({ children }: { children: ReactNode }) {
  const cachedSession = peekActiveSession();
  const hasCachedAccess = Boolean(cachedSession && getCachedStudentClasses(cachedSession.user.id)?.some((studentClass) => studentClass.id === "shsat"));
  const [isChecking, setIsChecking] = useState(isSupabaseConfigured && !hasCachedAccess);
  const isTeacherPreview = new URLSearchParams(window.location.search).get("preview") === "student";

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getActiveSession().then(async (session) => {
      if (!session) {
        window.location.assign("/login");
        return;
      }
      if (getUserRole(session.user) !== "student" || isTeacherPreview) {
        setIsChecking(false);
        return;
      }
      const cachedClasses = getCachedStudentClasses(session.user.id);
      if (cachedClasses) {
        if (!cachedClasses.some((studentClass) => studentClass.id === "shsat")) window.location.assign("/study-hall/classroom");
        else setIsChecking(false);
        return;
      }
      try {
        const classes = await getStudentClasses(session.access_token);
        cacheStudentClasses(session.user.id, classes);
        if (!classes.some((studentClass) => studentClass.id === "shsat")) {
          window.location.assign("/study-hall/classroom");
          return;
        }
        setIsChecking(false);
      } catch {
        window.location.assign("/study-hall/classroom");
      }
    });
  }, [isTeacherPreview]);

  return isChecking ? <main className="loading-shell">Checking class access...</main> : children;
}

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

  if (path === "/dashboard" || path === "/study-hall") {
    return <LegacyStudentHomeRedirect />;
  }

  if (path.startsWith("/study-hall/")) {
    if (path === "/study-hall/classroom") {
      return <StudentClassroomPage />;
    }
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
    <Suspense fallback={<main className="loading-shell">Loading...</main>}>
      <CurrentPage key={location} />
    </Suspense>
  );
}

export default App;
