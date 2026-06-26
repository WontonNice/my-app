import { useEffect, useState } from "react";

type FeaturedSlide = {
  accent: "blue" | "emerald" | "orange" | "violet";
  category: string;
  description: string;
  eyebrow: string;
  href: string;
  label: string;
  metric: string;
  title: string;
};

type FeaturedCarouselProps = {
  slides: readonly FeaturedSlide[];
};

function getNextIndex(currentIndex: number, slideCount: number) {
  return (currentIndex + 1) % slideCount;
}

function getPreviousIndex(currentIndex: number, slideCount: number) {
  return (currentIndex - 1 + slideCount) % slideCount;
}

export function FeaturedCarousel({ slides }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => getNextIndex(currentIndex, slides.length));
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="hero-carousel" aria-label="Featured student portal previews">
      <div className="hero-carousel-stage">
        {slides.map((slide, index) => {
          const offset = (index - activeIndex + slides.length) % slides.length;
          const positionClass =
            offset === 0 ? "is-active" : offset === 1 ? "is-next" : offset === slides.length - 1 ? "is-prev" : "is-hidden";

          return (
            <article className={`hero-slide ${positionClass}`} key={slide.title} aria-hidden={offset !== 0}>
              <div className={`hero-slide-image hero-slide-image-${slide.accent}`} role="img" aria-label={slide.title}>
                <div className="scene-skyline">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="scene-grid">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="scene-orbit" />
                <div className="scene-dashboard">
                  <span>{slide.label}</span>
                  <strong>{slide.metric}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hero-slide-copy" aria-live="polite">
        <div className="slide-meta">
          <span className="slide-flame" aria-hidden="true">
            *
          </span>
          <span>{activeSlide.eyebrow}</span>
          <span className="slide-pill">{activeSlide.category}</span>
        </div>
        <h1>{activeSlide.title}</h1>
        <p>{activeSlide.description}</p>
        <a className="launch-button" href={activeSlide.href}>
          Launch
        </a>
      </div>

      <div className="hero-controls" aria-label="Carousel controls">
        <button
          className="round-control"
          type="button"
          aria-label="Next preview"
          onClick={() => setActiveIndex((currentIndex) => getNextIndex(currentIndex, slides.length))}
        >
          {">"}
        </button>
        <button
          className="round-control"
          type="button"
          aria-label="Previous preview"
          onClick={() => setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, slides.length))}
        >
          {"<"}
        </button>
      </div>

      <div className="hero-footer">
        <a className="see-all-link" href="/study-hall">
          Study hall <span aria-hidden="true">{">"}</span>
        </a>
        <div className="thumbnail-strip" aria-label="Choose a preview">
          {slides.map((slide, index) => (
            <button
              className={`thumbnail thumbnail-${slide.accent}`}
              type="button"
              key={slide.title}
              aria-current={activeIndex === index}
              aria-label={`Show ${slide.title}`}
              onClick={() => setActiveIndex(index)}
            >
              <span>{slide.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="sr-status" aria-live="polite">
        Showing {activeSlide.title}
      </p>
    </section>
  );
}
