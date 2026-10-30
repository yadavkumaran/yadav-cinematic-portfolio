import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface CinematicIntroProps {
  onTransitionStart: () => void;
  onComplete: () => void;
}

export function CinematicIntro({ onTransitionStart, onComplete }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const figureWrapRef = useRef<HTMLDivElement>(null);
  const figureImgRef = useRef<HTMLImageElement>(null);
  const lightGlowRef = useRef<HTMLDivElement>(null);
  const lightRayRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  const [dismissed, setDismissed] = useState(false);
  const isDismissingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reduced = usePrefersReducedMotion();

  const onTransitionStartRef = useRef(onTransitionStart);
  const onCompleteRef = useRef(onComplete);
  onTransitionStartRef.current = onTransitionStart;
  onCompleteRef.current = onComplete;

  const triggerDismissRef = useRef<() => void>(() => {});
  const handleSkip = useCallback(() => {
    triggerDismissRef.current();
  }, []);

  useLayoutEffect(() => {
    if (reduced) {
      document.body.classList.remove('is-locked');
      onTransitionStartRef.current();
      onCompleteRef.current();
      setDismissed(true);
      return;
    }

    // Keep scroll locked only during the initial intro sequence
    document.body.classList.add('is-locked');

    const removeEventListeners = () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-locked');
    };

    let accumulatedDelta = 0;
    const onWheel = (e: WheelEvent) => {
      if (isDismissingRef.current) {
        e.preventDefault();
        return;
      }
      accumulatedDelta += Math.abs(e.deltaY);
      if (accumulatedDelta > 28) {
        e.preventDefault();
        triggerDismiss();
      }
    };

    const onTouchMove = () => {
      if (!isDismissingRef.current) {
        triggerDismiss();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
        triggerDismiss();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    function triggerDismiss() {
      if (isDismissingRef.current) return;
      isDismissingRef.current = true;

      if (containerRef.current) {
        containerRef.current.style.pointerEvents = 'none';
      }

      // Remove scroll blocker immediately so user has mouse scroll back
      removeEventListeners();

      onTransitionStartRef.current();

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const container = containerRef.current;
      if (container) {
        gsap.to(container, {
          opacity: 0,
          yPercent: -2,
          scale: 1.02,
          duration: 0.65,
          ease: 'power2.out',
          onComplete: () => {
            document.body.classList.remove('is-locked');
            setDismissed(true);
            onCompleteRef.current();
          },
        });
      } else {
        document.body.classList.remove('is-locked');
        setDismissed(true);
        onCompleteRef.current();
      }
    }

    triggerDismissRef.current = triggerDismiss;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          removeEventListeners();
          setDismissed(true);
          onCompleteRef.current();
        },
      });
      timelineRef.current = tl;

      // ─────────────────────────────────────────────────────────────
      // INITIAL STAGING: High-resolution positioning with zero clipping
      // ─────────────────────────────────────────────────────────────
      gsap.set(cameraRef.current, {
        scale: 0.985,
        transformOrigin: '50% 65%',
        willChange: 'transform',
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 12,
        letterSpacing: '0.45em',
        willChange: 'transform, opacity',
      });

      gsap.set('.cinematic-intro__letter', {
        yPercent: 104,
        opacity: 0,
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity',
      });

      gsap.set(figureWrapRef.current, {
        opacity: 0,
        xPercent: -50,
        yPercent: 14,
        scale: 0.98,
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity',
      });

      gsap.set(lightGlowRef.current, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: '50% 50%',
      });

      gsap.set(lightRayRef.current, {
        opacity: 0,
        scaleY: 0,
        transformOrigin: '50% 0%',
      });

      gsap.set(flashOverlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
      });

      // ─────────────────────────────────────────────────────────────
      // PHASE 1: Continuous Slow Camera Glide (0.0s -> 5.2s)
      // Gentle forward camera momentum throughout the entire scene
      // ─────────────────────────────────────────────────────────────
      tl.to(
        cameraRef.current,
        {
          scale: 1.045,
          duration: 5.2,
          ease: 'sine.inOut',
        },
        0,
      );

      // Atmospheric crimson-amber volumetric illumination
      tl.to(
        lightGlowRef.current,
        {
          opacity: 0.95,
          scale: 1.15,
          duration: 2.2,
          ease: 'power2.out',
        },
        0.1,
      );

      tl.to(
        lightRayRef.current,
        {
          opacity: 0.45,
          scaleY: 1,
          duration: 2.0,
          ease: 'sine.out',
        },
        0.2,
      );

      // "WELCOME TO MY WORLD" tracking reveal
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.36em',
          duration: 1.2,
          ease: 'power2.out',
        },
        0.3,
      );

      // ─────────────────────────────────────────────────────────────
      // PHASE 2: Monumental Typography "YADAV KUMARAN" (0.65s -> 2.0s)
      // Buttery smooth staggered emergence from center
      // ─────────────────────────────────────────────────────────────
      tl.to(
        '.cinematic-intro__letter',
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          stagger: {
            each: 0.035,
            from: 'center',
          },
          ease: 'power3.out',
        },
        0.65,
      );

      // ─────────────────────────────────────────────────────────────
      // PHASE 3: Portrait Reveal (1.05s -> 2.8s)
      // GPU-accelerated vertical drift settling into stage
      // ─────────────────────────────────────────────────────────────
      tl.to(
        figureWrapRef.current,
        {
          opacity: 1,
          xPercent: -50,
          yPercent: 0,
          scale: 1.0,
          duration: 1.8,
          ease: 'power3.out',
        },
        1.05,
      );

      // ─────────────────────────────────────────────────────────────
      // PHASE 4: Seamless Optical Handoff to SolarHero (3.8s -> 5.0s)
      // Warm, filmic cross-dissolve with zero frame drops or harsh cuts
      // ─────────────────────────────────────────────────────────────
      tl.call(
        () => {
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = 'none';
          }
          removeEventListeners();
          onTransitionStartRef.current();
        },
        [],
        3.8,
      );

      // Soft warm ember bloom (gentle illumination, no blinding flash)
      tl.to(
        flashOverlayRef.current,
        {
          opacity: 0.28,
          duration: 0.55,
          ease: 'sine.inOut',
        },
        3.8,
      );

      // Elements dissolve smoothly into the awakening SolarHero
      tl.to(
        subtitleRef.current,
        {
          opacity: 0,
          y: -14,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        3.85,
      );

      tl.to(
        headlineRef.current,
        {
          opacity: 0,
          y: -16,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        3.9,
      );

      tl.to(
        figureWrapRef.current,
        {
          opacity: 0,
          xPercent: -50,
          scale: 1.03,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        3.9,
      );

      tl.to(
        flashOverlayRef.current,
        {
          opacity: 0,
          duration: 0.65,
          ease: 'sine.out',
        },
        4.35,
      );

      // Master container dissolves smoothly into the hero
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        4.25,
      );
    }, containerRef);

    return () => {
      ctx.revert();
      removeEventListeners();
    };
  }, [reduced]);

  if (dismissed) return null;

  return (
    <div
      ref={containerRef}
      className="cinematic-intro"
      role="region"
      aria-label="Cinematic opening sequence"
    >
      <div ref={apertureRef} className="cinematic-intro__aperture">
        <div className="cinematic-intro__backdrop" />

        <div ref={cameraRef} className="cinematic-intro__camera">
          <div ref={lightGlowRef} className="cinematic-intro__glow" aria-hidden="true" />
          <div ref={lightRayRef} className="cinematic-intro__rays" aria-hidden="true" />
          <div className="cinematic-intro__vignette" aria-hidden="true" />

          <div ref={subtitleRef} className="cinematic-intro__eyebrow">
            WELCOME TO MY WORLD
          </div>

          <div ref={headlineRef} className="cinematic-intro__headline" aria-hidden="true">
            <div className="cinematic-intro__name-row cinematic-intro__name-row--first">
              {'YADAV'.split('').map((char, i) => (
                <span key={i} className="cinematic-intro__letter-box">
                  <span className="cinematic-intro__letter">{char}</span>
                </span>
              ))}
            </div>
            <div className="cinematic-intro__name-row cinematic-intro__name-row--second">
              {'KUMARAN'.split('').map((char, i) => (
                <span key={i} className="cinematic-intro__letter-box">
                  <span className="cinematic-intro__letter">{char}</span>
                </span>
              ))}
            </div>
          </div>

          <div ref={figureWrapRef} className="cinematic-intro__figure">
            <img
              ref={figureImgRef}
              src="/images/yadav-standing-suit.png"
              alt="Yadav Kumaran standing portrait in suit"
              className="cinematic-intro__figure-img"
              loading="eager"
              decoding="async"
            />
            <div className="cinematic-intro__figure-ground" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div ref={flashOverlayRef} className="cinematic-intro__flash" aria-hidden="true" />

      <button
        type="button"
        className="cinematic-intro__skip"
        onClick={handleSkip}
        aria-label="Skip cinematic introduction"
      >
        <span>SKIP INTRO</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
