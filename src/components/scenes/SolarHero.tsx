import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { heroProjects, site, type Project } from '../../data/portfolio';
import { HeroPortrait } from '../visual/HeroPortrait';
import { OrbitProjectGallery } from './OrbitProjectGallery';

interface SolarHeroProps {
  started: boolean;
  onOpenProject: (project: Project) => void;
}

export function SolarHero({ started, onOpenProject }: SolarHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const active = heroProjects[activeIndex];

  const embers = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const drift = (index % 2 === 0 ? 1 : -1) * (8 + (index % 4) * 9);
        return {
          left: `${(index * 19 + 7) % 94}%`,
          size: `${1 + (index % 3) * 0.8}px`,
          dur: `${10 + (index % 5) * 2.6}s`,
          delay: `${-(index * 1.4)}s`,
          drift: `${drift}px`,
        };
      }),
    [],
  );

  // A handful of large, defocused motes sitting in front of the scene.
  const bokeh = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        left: `${6 + ((index * 27 + 11) % 88)}%`,
        top: `${34 + ((index * 41) % 52)}%`,
        size: `${18 + (index % 4) * 16}px`,
        dur: `${26 + (index % 3) * 9}s`,
        delay: `${-(index * 5.5)}s`,
        drift: `${(index % 2 === 0 ? 1 : -1) * (26 + index * 7)}px`,
        opacity: `${0.05 + (index % 3) * 0.025}`,
      })),
    [],
  );

  const navigate = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + heroProjects.length) % heroProjects.length);
  };

  useLayoutEffect(() => {
    if (!started) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          '[data-hero-eyebrow], [data-hero-intro], [data-hero-rail], [data-hero-scroll], [data-hero-line], .orbit__inner, .orbit__label, [data-hero-portrait], .hero__haze, .hero__bokeh',
          { clearProps: 'all' },
        );
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('[data-hero-eyebrow]', { autoAlpha: 0, y: 14, duration: 0.7 }, 0)
        .from(
          '[data-hero-line]',
          {
            yPercent: 112,
            duration: 1.15,
            stagger: 0.1,
            ease: 'expo.out',
          },
          0.08,
        )
        .from('[data-hero-intro]', { autoAlpha: 0, y: 14, duration: 0.85 }, 0.42)
        .from('.hero__portrait-bleed', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0)
        .from('.hero__haze-layer', { autoAlpha: 0, duration: 2.1, ease: 'power2.out' }, 0.2)
        .from('.hero__bokeh', { autoAlpha: 0, duration: 2.2, ease: 'power2.out' }, 0.5)
        // A slow camera push-in: the shot settles rather than sliding into place.
        .from(
          '[data-hero-portrait]',
          { autoAlpha: 0, scale: 1.06, yPercent: 1.5, duration: 2.5, ease: 'power2.out' },
          0.1,
        )
        .from(
          '.orbit__inner, .orbit__mobile-card .orbit__inner',
          {
            autoAlpha: 0,
            y: 22,
            scale: 0.94,
            duration: 1.05,
            stagger: { each: 0.055, from: 'center' },
          },
          0.42,
        )
        .from(
          '.orbit__label',
          { autoAlpha: 0, duration: 0.65, stagger: { each: 0.04, from: 'center' } },
          0.68,
        )
        .from('[data-hero-rail]', { autoAlpha: 0, y: 14, duration: 0.8 }, 0.72)
        .from('[data-hero-scroll]', { autoAlpha: 0, duration: 0.9 }, 0.9);

      gsap.to('.hero__portrait-bleed', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Slight separation between the subject and the atmosphere behind it.
      gsap.to('.hero__haze', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-portrait]', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-copy]', {
        autoAlpha: 0,
        yPercent: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: '18% top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-hero-rail]', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: '15% top',
          end: '55% top',
          scrub: true,
        },
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced, started]);

  // Shared pointer response across the orbit and figure.
  useLayoutEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const orbit = rootRef.current?.querySelector<HTMLElement>('.hero__orbit-desktop');
    const portrait = rootRef.current?.querySelector<HTMLElement>('[data-hero-portrait]');
    const bleed = rootRef.current?.querySelector<HTMLElement>('.hero__portrait-bleed');
    const haze = rootRef.current?.querySelector<HTMLElement>('.hero__haze-far');
    const side = rootRef.current?.querySelector<HTMLElement>('.hero__side');
    if (!orbit || !portrait) return;

    const orbitX = gsap.quickTo(orbit, 'x', { duration: 0.9, ease: 'power3.out' });
    const orbitY = gsap.quickTo(orbit, 'y', { duration: 0.9, ease: 'power3.out' });
    const portraitX = gsap.quickTo(portrait, 'x', { duration: 1.2, ease: 'power3.out' });
    const bleedX = bleed ? gsap.quickTo(bleed, 'x', { duration: 1.4, ease: 'power3.out' }) : null;
    const hazeX = haze ? gsap.quickTo(haze, 'x', { duration: 1.8, ease: 'power3.out' }) : null;
    const sideY = side ? gsap.quickTo(side, 'y', { duration: 1.1, ease: 'power3.out' }) : null;

    const onPointer = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      orbitX(nx * 14);
      orbitY(ny * 8);
      portraitX(nx * -6);
      bleedX?.(nx * 10);
      hazeX?.(nx * -20);
      sideY?.(ny * 12);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      gsap.killTweensOf([orbit, portrait, bleed, haze, side]);
    };
  }, [reduced]);

  return (
    <section className="hero" id="top" ref={rootRef} aria-labelledby="hero-title">
      <div className="hero__stage">
        <HeroPortrait />

        {/* Atmosphere between the image and the orbiting cards. */}
        <div className="hero__haze" aria-hidden="true">
          <span className="hero__haze-layer hero__haze-far" />
          <span className="hero__haze-layer hero__haze-near" />
        </div>

        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__embers" aria-hidden="true">
          {embers.map((ember, index) => (
            <span
              className="ember"
              key={index}
              style={
                {
                  '--left': ember.left,
                  '--size': ember.size,
                  '--dur': ember.dur,
                  '--delay': ember.delay,
                  '--drift': ember.drift,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="hero__bokeh" aria-hidden="true">
          {bokeh.map((mote, index) => (
            <span
              className="ember-bokeh"
              key={index}
              style={
                {
                  '--left': mote.left,
                  '--top': mote.top,
                  '--size': mote.size,
                  '--dur': mote.dur,
                  '--delay': mote.delay,
                  '--drift': mote.drift,
                  '--opacity': mote.opacity,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <OrbitProjectGallery
          projects={heroProjects}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onOpen={onOpenProject}
          onNavigate={navigate}
        />
      </div>

      <div className="hero__copy" data-hero-copy>
        <p className="hero__eyebrow label" data-hero-eyebrow>
          {site.eyebrow}
        </p>
        <h1 className="hero__headline" id="hero-title">
          <span className="hero__copy-line">
            <span data-hero-line>{site.headline[0]}</span>
          </span>
          <span className="hero__copy-line">
            <span data-hero-line>
              <em>{site.headline[1]}</em>
            </span>
          </span>
        </h1>
        <p className="hero__intro" data-hero-intro>
          {site.intro}
        </p>
      </div>

      <div className="hero__rail" data-hero-rail>
        <button
          type="button"
          className="hero__rail-btn"
          onClick={() => navigate(-1)}
          aria-label="Previous project"
          data-cursor="action"
          data-cursor-label="Prev"
        >
          <ArrowLeft aria-hidden="true" />
        </button>

        <div className="hero__rail-center">
          <span className="hero__rail-count" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, '0')}/{String(heroProjects.length).padStart(2, '0')}
          </span>
          <span className="hero__rail-name">
            <strong>{active.title}</strong>
            <span>{active.category}</span>
          </span>
          <button
            type="button"
            className="hero__rail-open"
            onClick={() => onOpenProject(active)}
            data-cursor="action"
            data-cursor-label="Open"
          >
            View
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="hero__rail-btn"
          onClick={() => navigate(1)}
          aria-label="Next project"
          data-cursor="action"
          data-cursor-label="Next"
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      <span className="hero__side" aria-hidden="true">
        Full-stack · Applied AI · Data
      </span>

      <a className="hero__scroll" href="#cosmic" data-hero-scroll>
        <span>Scroll to selected work</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
