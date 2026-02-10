import { useState } from "react";
import HomePage from "./components/HomePage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

type UserRole = "student" | "teacher";

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  if (userRole === "student") {
    return <StudentDashboard />;
  }

  if (userRole === "teacher") {
    return <TeacherDashboard />;
  }

  return <HomePage onLoginSuccess={setUserRole} />;
}

export default App;