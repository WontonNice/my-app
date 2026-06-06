import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import { getStoredAuthUser, setStoredAuthUser } from "./authStorage";
import type { AuthUser } from "./authStorage";

function getDisplayName(user: AuthUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);

  useEffect(() => {
    setStoredAuthUser(authUser);
  }, [authUser]);

  const handleLogout = () => {
    setAuthUser(null);
  };

  if (authUser) {
    return (
      <main className="app-shell">
        <section className="panel">
          <p className="eyebrow">{authUser.role}</p>
          <h1>Welcome, {getDisplayName(authUser)}</h1>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>
    );
  }

  return <HomePage onLoginSuccess={setAuthUser} />;
}

export default App;
