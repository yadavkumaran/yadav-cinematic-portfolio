import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/motion';
import { ScrollTrigger } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { about, expertise } from '../../data/portfolio';
import { TechnicalUniverseCanvas } from '../visual/TechnicalUniverseCanvas';

export function TechnicalUniverse() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const activeIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reduced = usePrefersReducedMotion();

  const selectCategory = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('[data-tu-head] > *', {
          y: 20,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-tu-head]',
            start: 'top 86%',
            once: true,
          },
        });
      }

      if (!reduced) {
        ScrollTrigger.create({
          trigger: root,
          start: 'top 82%',
          end: 'bottom 55%',
          scrub: 0.7,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        });
      } else {
        progressRef.current = 0.7;
      }

      gsap.from('[data-tu-card]', {
        y: reduced ? 0 : 22,
        autoAlpha: 0,
        duration: reduced ? 0 : 0.75,
        stagger: 0.075,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-tu-layout]',
          start: 'top 78%',
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="expertise tu-section"
      id="expertise"
      ref={rootRef}
      aria-labelledby="expertise-title"
    >
      <div className="shell tu-header" data-tu-head>
        <div>
          <span className="label muted">03 / Technical universe</span>
          <h2 className="expertise__title tu-title" id="expertise-title">
            Tools with <em>purpose.</em>
          </h2>
        </div>
        <p className="tu-sub">
          A connected system of tools, each chosen for the kind of work it supports.
        </p>
      </div>

      <div className="shell tu-layout" data-tu-layout>
        <div className="tu-stage" aria-hidden="true">
          <TechnicalUniverseCanvas
            progressRef={progressRef}
            activeIndexRef={activeIndexRef}
            className="tu-stage__canvas"
          />
          <div className="tu-stage__vignette" />
          <div className="tu-stage__caption">
            <span>INFERENCE / COMPUTE</span>
            <span>FIVE CONNECTED DOMAINS</span>
          </div>
        </div>

        <div className="tu-panels" role="group" aria-label="Technology domains">
          {expertise.map((group, index) => (
            <article
              key={group.label}
              className="tu-card"
              data-tu-card
              data-index={index}
              data-active={activeIndex === index}
              tabIndex={0}
              onPointerEnter={() => selectCategory(index)}
              onPointerLeave={() => selectCategory(-1)}
              onFocus={() => selectCategory(index)}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                  selectCategory(-1);
                }
              }}
            >
              <div className="tu-card__top">
                <span className="tu-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="tu-card__rule" aria-hidden="true" />
              </div>
              <h3 className="tu-card__label">{group.label}</h3>
              {group.technologies.length > 0 ? (
                <ul className="tu-card__tags">
                  {group.technologies.map((tech) => (
                    <li key={tech} className="tu-card__tag">{tech}</li>
                  ))}
                </ul>
              ) : (
                <p className="tu-card__note">{group.note}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EngineeringMindset() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const root = rootRef.current;
    const context = gsap.context(() => {
      gsap.from('[data-mindset-line]', {
        x: -22,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 76%', once: true },
      });
    }, root);

    return () => context.revert();
  }, [reduced]);

  return (
    <section className="mindset" ref={rootRef} aria-labelledby="mindset-title">
      <div className="shell">
        <header className="mindset__header">
          <span className="label">05 / Engineering mindset</span>
          <h2 id="mindset-title">
            How I think <em>through it.</em>
          </h2>
          <p>
            The work is not only choosing a stack. It is deciding what matters, making the
            system understandable, and keeping the experience useful.
          </p>
        </header>

        <ol className="mindset__list">
          {about.principles.map((principle, index) => (
            <li key={principle} data-mindset-line>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{principle}</p>
              <span className="mindset__mark" aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export { MilestoneArchive as GrowthSection } from './MilestoneArchive';

