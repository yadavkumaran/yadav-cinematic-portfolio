import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { about, site } from '../../data/portfolio';
import { PortraitFigure } from '../visual/PortraitFigure';

export function PortraitOutro() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Portrait print: a mask reveal, a slow settle of the photograph inside it.
      gsap.fromTo(
        '[data-print-frame]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: '[data-print]', start: 'top 84%', once: true },
        },
      );

      gsap.fromTo(
        '[data-print-img]',
        { scale: 1.12 },
        {
          scale: 1.02,
          duration: 2.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-print]', start: 'top 84%', once: true },
        },
      );

      gsap.from('[data-print-caption]', {
        y: 12,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.35,
        scrollTrigger: { trigger: '[data-print]', start: 'top 84%', once: true },
      });

      // Narrative column: quote first, then the supporting copy.
      gsap.from('[data-story-quote]', {
        y: 26,
        autoAlpha: 0,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 74%', once: true },
      });

      gsap.from('[data-story-item]', {
        y: 18,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.11,
        delay: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 68%', once: true },
      });

      // Signature band.
      gsap.from('[data-portrait-signature]', {
        yPercent: 14,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-portrait-signature]', start: 'top 96%', once: true },
      });

      gsap.from('[data-portrait-foot]', {
        autoAlpha: 0,
        duration: 0.9,
        scrollTrigger: { trigger: '[data-portrait-signature]', start: 'top 96%', once: true },
      });

      // Gentle depth: the photograph drifts against the frame as the section passes.
      gsap.fromTo(
        '[data-print-shift]',
        { yPercent: -3.5 },
        {
          yPercent: 3.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-print]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="portrait light-section"
      ref={rootRef}
      data-nav-theme="light"
      aria-labelledby="portrait-name"
    >
      <div className="shell">
        <header className="portrait__topline">
          <span className="label">07 / The person</span>
          <span className="portrait__topline-role">{site.role}</span>
        </header>

        <div className="portrait__grid">
          <div className="portrait__story">
            <blockquote className="portrait__quote" data-story-quote>
              “{site.portraitQuote}”
              <cite>
                {site.name} · Computer science
              </cite>
            </blockquote>

            <p className="portrait__intro" data-story-item>
              {about.intro}
            </p>

            <dl className="portrait__facts" data-story-item>
              <div>
                <dt>Focus</dt>
                <dd>Full-stack engineering · Applied AI</dd>
              </div>
              <div>
                <dt>Selected work</dt>
                <dd>Vaidhya · HeatGuard AI · BidLens</dd>
              </div>
              <div>
                <dt>Studying</dt>
                <dd>Computer science</dd>
              </div>
            </dl>

            <div className="portrait__note" data-story-item>
              <span className="label">Beyond the build</span>
              <p>
                Most of what I build begins with a constraint someone actually lives with — a
                clinic without a specialist, a city getting hotter, a procurement desk buried in
                paper. The work is turning that into something a person can open and use.
              </p>
            </div>
          </div>

          <figure className="portrait__print" data-print>
            <div className="portrait__print-frame" data-print-frame>
              <div className="portrait__print-shift" data-print-shift>
                {site.portrait ? (
                  <img
                    src={site.portrait}
                    alt={site.portraitAlt}
                    width={768}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    data-print-img
                  />
                ) : (
                  <PortraitFigure />
                )}
              </div>
            </div>
            <figcaption className="portrait__caption" data-print-caption>
              <span>Portrait / 01</span>
              <span>{site.eyebrow}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="portrait__band">
        <div className="shell portrait__band-inner">
          <h2 className="portrait__name" id="portrait-name" data-portrait-signature>
            <span>Yadav</span> <em>Kumaran</em>
          </h2>
          <div className="portrait__footer" data-portrait-foot>
            <span>A continuing story</span>
            <a href="#contact" data-cursor="action" data-cursor-label="Down">
              Continue
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
