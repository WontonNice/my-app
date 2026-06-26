import { featuredSlides } from "../content/landingPage";

const homeHighlights = [
  "Assignments",
  "Assessments",
  "XP Rewards",
  "Progress",
] as const;

export function HomePage() {
  const previewSlides = featuredSlides.slice(0, 3);

  return (
    <main className="public-shell">
      <header className="public-header" aria-label="Main navigation">
        <a className="public-logo" href="/">
          Nathan Tutors
        </a>
        <nav className="public-nav" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#portal">Portal</a>
          <a href="#rewards">Rewards</a>
        </nav>
        <div className="auth-actions">
          <a className="auth-link" href="/login">
            Login
          </a>
          <a className="auth-button" href="/signup">
            Sign up
          </a>
        </div>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="home-kicker">Math and code tutoring portal</p>
          <h1 id="home-title">Practice, progress, and rewards in one student hub.</h1>
          <p>
            Students get a clear place to see assigned work, finish assessments, earn XP,
            and know exactly what to study next.
          </p>
          <div className="home-actions">
            <a className="home-primary" href="/signup">
              Create account
            </a>
            <a className="home-secondary" href="/login">
              Student login
            </a>
          </div>
        </div>

        <div className="home-preview" id="portal" aria-label="Portal preview">
          <div className="home-preview-stack">
            {previewSlides.map((slide, index) => (
              <article className={`home-preview-card home-preview-card-${slide.accent}`} key={slide.title}>
                <span>{slide.category}</span>
                <strong>{slide.title}</strong>
                <p>{slide.metric}</p>
                <small>{index + 1}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-strip" id="how-it-works" aria-label="Portal highlights">
        {homeHighlights.map((highlight) => (
          <article key={highlight}>
            {highlight}
          </article>
        ))}
      </section>

      <a className="dashboard-shortcut" href="/login">
        Student dashboard opens after login
      </a>
    </main>
  );
}
