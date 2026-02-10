import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

import { getStoredUserRole, setStoredUserRole } from "./authStorage";
import type { UserRole } from "./authStorage";

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(getStoredUserRole);

  useEffect(() => {
    setStoredUserRole(userRole);
  }, [userRole]);

  if (userRole === "student") {
    return <StudentDashboard onLogout={() => setUserRole(null)} />;
  }

  if (userRole === "teacher") {
    return <TeacherDashboard onLogout={() => setUserRole(null)} />;
  }

  return <HomePage onLoginSuccess={setUserRole} />;
}

export default App;