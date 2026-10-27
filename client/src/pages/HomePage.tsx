import { ArrowDown, ArrowRight, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import "./HomePage.css";

const learningBenefits = [
  { number: "01", title: "Know where to put your effort.", text: "Find your teacher’s assignments, due dates, and study materials together. Spend less time figuring out what’s next and more time learning." },
  { number: "02", title: "Make mistakes make sense.", text: "Return to missed questions, work through corrections, and build understanding beyond the original answer." },
  { number: "03", title: "Give your next lesson a head start.", text: "Topic results and past attempts help you and your teacher see what’s improving and where a little more practice could help." },
] as const;

export function HomePage() {
  return (
    <div className="nt-landing">
      <a className="nt-skip-link" href="#nt-main">Skip to content</a>
      <header className="nt-header">
        <div className="nt-container nt-header-inner">
          <a className="nt-brand" href="/" aria-label="Nathan Tutors home"><span className="nt-brand-mark" aria-hidden="true">n<span>.</span></span><span>Nathan Tutors</span></a>
          <nav className="nt-navigation" aria-label="Primary"><a href="#portal">The platform</a><a href="#how-it-works">How it works</a><a href="#rewards">Rewards</a></nav>
          <div className="nt-header-actions"><a className="nt-login" href="/login">Log in</a><a className="nt-button nt-button-small" href="/signup">Get started <ArrowRight size={16} aria-hidden="true" /></a></div>
        </div>
      </header>
      <main id="nt-main" tabIndex={-1}>
        <section className="nt-hero nt-container" aria-labelledby="nt-home-title">
          <div className="nt-hero-copy">
            <h1 id="nt-home-title">A little practice.<br /><span>A bigger future.</span></h1>
            <p className="nt-hero-description">Personal tutoring. Purposeful practice. A place to put it all together.</p>
            <p className="nt-hero-detail">From SHSAT prep to AP classes, Nathan Tutors connects your lessons, practice, and progress—so the next step feels a little clearer.</p>
            <div className="nt-hero-actions"><a className="nt-button" href="/signup">Start your next chapter <ArrowRight size={18} aria-hidden="true" /></a><a className="nt-text-link" href="#portal">Take a look inside <ArrowDown size={16} aria-hidden="true" /></a></div>
            <p className="nt-returning">Already learning with us? <a href="/login">Open your student portal <ChevronRight size={14} aria-hidden="true" /></a></p>
          </div>
        </section>
        <div className="nt-programs nt-container" aria-label="Tutoring programs"><span>Different goals. <br />The same commitment.</span><ul><li>SHSAT</li><li>PSAT</li><li>SAT</li><li>AP <span>classes</span></li></ul></div>
        <section className="nt-platform nt-container" id="portal" aria-labelledby="nt-platform-title">
          <div className="nt-section-intro"><h2 id="nt-platform-title">More than a place<br />to turn in homework.</h2><p>Your learning doesn’t stop when a lesson ends. The student portal keeps the important pieces connected between sessions.</p><div className="nt-teacher-note"><BookOpen size={24} aria-hidden="true" /><p><strong>Your goals. Your teacher. Your next step.</strong>Teachers can use your results to assign focused work, with a plan and pace that make sense for you.</p></div></div>
          <div className="nt-benefits">{learningBenefits.map((benefit) => <article className="nt-benefit" key={benefit.number}><span className="nt-benefit-number" aria-hidden="true">{benefit.number}</span><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></article>)}</div>
        </section>
        <section className="nt-process" id="how-it-works" aria-labelledby="nt-process-title">
          <div className="nt-container">
            <div className="nt-process-heading"><h2 id="nt-process-title">A clear next step.<br /><span>Every time you log in.</span></h2><p>A simple rhythm that connects your time with a tutor to the work you do on your own.</p></div>
            <ol className="nt-steps">
              <li><span className="nt-step-number" aria-hidden="true">01 /</span><h3>Make yourself at home.</h3><p>Create your student account and join your class. Your portal brings your assigned work and resources together.</p></li>
              <li><span className="nt-step-number" aria-hidden="true">02 /</span><h3>Put learning into practice.</h3><p>Work through assignments, explore study materials, and take assessments to put your understanding to the test.</p></li>
              <li><span className="nt-step-number" aria-hidden="true">03 /</span><h3>Learn. Adjust. Go again.</h3><p>Review your results, revisit missed questions, and bring what you learn into your next practice session.</p></li>
            </ol>
            <div className="nt-rewards" id="rewards"><div className="nt-reward-icon"><Sparkles size={25} aria-hidden="true" /></div><div><h3>A little momentum goes a long way.</h3><p>XP, achievements, and classroom games give students more reasons to keep showing up.</p></div><a href="/login">Back to your progress <ArrowRight size={17} aria-hidden="true" /></a></div>
          </div>
        </section>
        <section className="nt-final nt-container" aria-labelledby="nt-final-title"><div><h2 id="nt-final-title">Your next chapter<br />starts with one step.</h2><p>Bring your questions. We’ll help you work toward the answers.</p></div><div className="nt-final-action"><a className="nt-button" href="/signup">Create your student account <ArrowRight size={18} aria-hidden="true" /></a><span>Already have an account? <a href="/login">Log in</a></span></div></section>
      </main>
      <footer className="nt-footer nt-container"><div><a className="nt-brand" href="/" aria-label="Nathan Tutors home"><span className="nt-brand-mark" aria-hidden="true">n<span>.</span></span><span>Nathan Tutors</span></a><p>A little clearer. A little further. Every day.</p></div><nav aria-label="Footer"><a href="#portal">The platform</a><a href="#how-it-works">How it works</a><a href="/login">Log in</a><a href="/signup">Sign up</a></nav><span className="nt-copyright">© {new Date().getFullYear()} Nathan Tutors</span></footer>
    </div>
  );
}
