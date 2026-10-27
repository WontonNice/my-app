import { useEffect, useState, type FormEvent } from "react";
import { registerStudent } from "../lib/api";
import { getDashboardPath, getStaffLoginEmail, getStudentLoginEmail, getUserRole } from "../lib/auth";
import { rememberAccountSession } from "../lib/accountSwitching";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { loginDestination } from '../lib/loginDestination';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Shuffle } from "lucide-react";
import { WaterPortrait } from "../components/auth/WaterPortrait";
import { MeadowScene } from "../components/auth/MeadowScene";
import { useReducedMotion } from "../components/auth/useReducedMotion";
import "./AuthPage.css";

type AuthPageProps = {
  mode: "login" | "signup";
};

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const [scene, setScene] = useState<"thinker" | "meadow">(() => Math.random() < 0.5 ? "thinker" : "meadow");
  const [showPassword, setShowPassword] = useState(false);
  const reducedMotion = useReducedMotion();
  const motionEnabled = !reducedMotion;
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
        window.location.assign(loginDestination(window.location.search, getDashboardPath(getUserRole(data.session.user))));
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
      window.location.assign(loginDestination(window.location.search, getDashboardPath(getUserRole(data.user))));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={`na-page na-page-${scene}`} data-auth-scene={scene}>
      <header className="na-header">
        <a className="na-back" href="/" aria-label="Back to home"><ArrowLeft size={16} aria-hidden="true" /><span>Back to home</span></a>
        <a className="na-brand" href="/" aria-label="Nathan Tutors home"><span aria-hidden="true">n.</span> Nathan Tutors</a>
        <button className="na-scene-switch" type="button" onClick={() => setScene(current => current === "thinker" ? "meadow" : "thinker")} aria-label={`Change scenery: switch to ${scene === "thinker" ? "landscape" : "Thinker"} scene`}>
          <Shuffle size={15} aria-hidden="true" /><span>Change scenery</span>
        </button>
      </header>

      <div className={`na-shell na-shell-${scene}`}>
        <div className="na-form-wrap">
          <section className="na-form-panel" aria-labelledby="auth-title">
            <h1 id="auth-title">{isSignup ? "A new chapter." : "Welcome back."}</h1>
            <p className="na-intro">{isSignup ? "Create your student account. Let’s see where learning takes you." : "A little focus. A little progress. Pick up where you left off."}</p>

            <form className="na-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
              {isSignup && (
                <label htmlFor="na-full-name">
                  Full name
                  <input id="na-full-name" autoComplete="name" name="full-name" required type="text" placeholder="Your full name" value={fullName} onChange={event => setFullName(event.target.value)} />
                </label>
              )}
              <label htmlFor="na-identifier">
                Email or username
                <input
                  id="na-identifier"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="text"
                  name={isSignup ? "username" : "login-identifier"}
                  required
                  spellCheck={false}
                  title={isSignup ? "Enter an email, or use 3–32 letters, numbers, dots, dashes, or underscores for a username." : undefined}
                  type="text"
                  placeholder="Your email or username"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </label>
              <div className="na-password-group">
                <div className="na-password-label"><label htmlFor="na-password">Password</label>{!isSignup && <a href="/forgot-password">Forgot password?</a>}</div>
                <div className="na-password-input">
                  <input id="na-password" name="password" autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} required type={showPassword ? "text" : "password"} placeholder={isSignup ? "At least 6 characters" : "Your password"} value={password} onChange={event => setPassword(event.target.value)} />
                  <button type="button" className="na-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-controls="na-password" onClick={() => setShowPassword(current => !current)}>{showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}</button>
                </div>
              </div>
              {message && <p className="na-message" role="alert">{message}</p>}
              <button className="na-submit" disabled={isSubmitting} type="submit"><span>{isSubmitting ? "Please wait…" : isSignup ? "Create your account" : "Sign in"}</span><ArrowRight size={17} aria-hidden="true" /></button>
            </form>

            <nav className="na-account-help" aria-label="Account help">
              <span>{isSignup ? "Already learning with us?" : "New to Nathan Tutors?"}</span>
              <a href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</a>
            </nav>
            <p className="na-form-footnote">{isSignup ? "Made for your next step." : "Good to have you here."}</p>
          </section>
        </div>
        {scene === "thinker" ? <WaterPortrait motionEnabled={motionEnabled} /> : <MeadowScene motionEnabled={motionEnabled} />}
      </div>
      <footer className="na-footer"><span>Room to think. Space to grow.</span><span>© {new Date().getFullYear()} Nathan Tutors</span></footer>
    </main>
  );
}
