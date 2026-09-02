import { useEffect, useState, type FormEvent } from "react";
import { registerStudent } from "../lib/api";
import { getDashboardPath, getStaffLoginEmail, getStudentLoginEmail, getUserRole } from "../lib/auth";
import { rememberAccountSession } from "../lib/accountSwitching";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type AuthPageProps = {
  mode: "login" | "signup";
};

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.assign(getDashboardPath(getUserRole(data.session.user)));
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();

      if (isSignup) {
        const registration = await registerStudent({
          username: email,
          password,
          fullName,
        });

        const { error } = await supabase.auth.signInWithPassword({
          email: registration.loginEmail,
          password,
        });

        if (error) {
          setMessage("Account created, but login failed. Try logging in manually.");
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) rememberAccountSession(data.session);
        window.location.assign("/study-hall/classroom");
        return;
      }

      const identifier = email.trim().toLowerCase();
      let login = await supabase.auth.signInWithPassword({
        email: identifier.includes("@") ? identifier : getStudentLoginEmail(identifier),
        password,
      });
      if (login.error && !identifier.includes("@")) {
        login = await supabase.auth.signInWithPassword({ email: getStaffLoginEmail(identifier), password });
      }
      const { data, error } = login;

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) rememberAccountSession(data.session);
      window.location.assign(getDashboardPath(getUserRole(data.user)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <a className="public-logo auth-logo" href="/">
        Promise Summer School
      </a>
      <section className="auth-panel" aria-labelledby="auth-title">
        {isSignup ? <p className="home-kicker">Create student account</p> : null}
        <h1 id="auth-title">{isSignup ? "Sign up" : "Login"}</h1>
        {isSignup ? <p>Student accounts are created by default.</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Full name
              <input
                autoComplete="name"
                required
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
          )}

          <label>
            Email or username
            <input
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="text"
              name={isSignup ? "username" : "login-identifier"}
              required
              spellCheck={false}
              title={isSignup ? "Enter an email, or use 3–32 letters, numbers, dots, dashes, or underscores for a username." : undefined}
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {message && <p className="auth-message">{message}</p>}

          <button className="home-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait" : isSignup ? "Create account" : "Login"}
          </button>
        </form>

        <a className="auth-switch" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Already have an account? Login" : "Need an account? Sign up"}
        </a>
      </section>
    </main>
  );
}
