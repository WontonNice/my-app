import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import PrecalcHomePage from "./components/Courses/PreCalc/PrecalcHomePage";
import PrecalcLearnPage from "./components/Courses/PreCalc/PrecalcLearnPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

import { getStoredAuthUser, setStoredAuthUser } from "./authStorage";
import type { AuthUser } from "./authStorage";

type StudentView = "dashboard" | "precalc" | "precalc-learn";

function normalizeCourseName(course: string) {
  return course.trim().toLowerCase();
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);
  const [studentView, setStudentView] = useState<StudentView>("dashboard");

  useEffect(() => {
    setStoredAuthUser(authUser);
  }, [authUser]);


  const handleLogout = () => {
    setStudentView("dashboard");
    setAuthUser(null);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setStudentView("dashboard");
    setAuthUser(user);
  };

  if (authUser?.role === "student") {
    if (studentView === "precalc") {
      return (
        <PrecalcHomePage
          authUser={authUser}
          onBack={() => setStudentView("dashboard")}
          onOpenLearn={() => setStudentView("precalc-learn")}
          onLogout={handleLogout}
        />
      );
    }

    if (studentView === "precalc-learn") {
      return <PrecalcLearnPage onBack={() => setStudentView("precalc")} />;
    }

    return (
      <StudentDashboard
        authUser={authUser}
        onOpenCoursePage={(course) => {
          const normalizedCourse = normalizeCourseName(course);
          if (
            normalizedCourse === "precalc" ||
            normalizedCourse === "precalculus" ||
            normalizedCourse === "a"
          ) {
            setStudentView("precalc");
          }
        }}
        onLogout={handleLogout}
      />
    );
  }

  if (authUser?.role === "teacher") {
    return (
      <TeacherDashboard
        authUser={authUser}
        onLogout={handleLogout}
      />
    );
  }

  return <HomePage onLoginSuccess={handleLoginSuccess} />;
}

export default App;