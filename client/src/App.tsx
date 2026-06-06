import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import { getStoredAuthUser, setStoredAuthUser } from "./authStorage";
import type { AuthUser } from "./authStorage";

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);

  useEffect(() => {
    setStoredAuthUser(authUser);
  }, [authUser]);

  const handleLogout = () => {
    setAuthUser(null);
  };

  if (authUser?.role === "student") {
    return <StudentDashboard authUser={authUser} onLogout={handleLogout} />;
  }

  if (authUser?.role === "teacher") {
    return <TeacherDashboard authUser={authUser} onLogout={handleLogout} />;
  }

  return <HomePage onLoginSuccess={setAuthUser} />;
}

export default App;
