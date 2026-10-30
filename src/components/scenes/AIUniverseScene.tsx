import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { AIUniverseCanvas } from '../visual/AIUniverseCanvas';

export function AIUniverseScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const cosmicMorphRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced) {
      // Matches the frozen 3D frame: the settled end of the choreography.
      progressRef.current = 0.40;
      gsap.set([figureRef.current, haloRef.current, washRef.current, headlineRef.current], {
        opacity: 1,
        clearProps: 'transform',
      });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Single unified timeline mapped 1:1 to the extended pinned scroll distance.
      // scrub: 0.8 provides silky, luxurious, responsive cinematic deceleration.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // -------------------------------------------------------------
      // SCENE A: PORTAL AWAKENING (0.00 -> 0.22)
      // Environment wash ignites, halo ring emerges, figure grounds itself, headline reveals
      // -------------------------------------------------------------
      tl.fromTo(washRef.current, { opacity: 0.12 }, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.0)
        .fromTo(
          haloRef.current,
          { opacity: 0.18, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' },
          0.0,
        )
        .fromTo(
          figureRef.current,
          { opacity: 0.35, scale: 1.035, yPercent: 3.5 },
          { opacity: 1, scale: 1, yPercent: 0, duration: 0.22, ease: 'power2.out' },
          0.0,
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.20, ease: 'power2.out' },
          0.04,
        )

        // -------------------------------------------------------------
        // SCENE B: AI UNIVERSE ACTIVATION (0.22 -> 0.52)
        // Command presence: energetic breathing halo, figure anchors the 3D amphitheater
        // -------------------------------------------------------------
        .to(haloRef.current, { scale: 1.05, duration: 0.30, ease: 'sine.inOut' }, 0.22)
        .to(figureRef.current, { scale: 1.015, yPercent: -0.5, duration: 0.30, ease: 'sine.inOut' }, 0.22)

        // -------------------------------------------------------------
        // SCENE C: ENERGY CONVERGENCE (0.52 -> 0.82)
        // Headline dissolves upward; background shifts to cosmic violet;
        // halo ring expands and softens as WebGL singularity beam surges behind figure
        // -------------------------------------------------------------
        .to(headlineRef.current, { opacity: 0, y: -24, duration: 0.16, ease: 'power2.in' }, 0.52)
        .to(cosmicMorphRef.current, { opacity: 1, duration: 0.30, ease: 'sine.inOut' }, 0.52)
        .to(haloRef.current, { scale: 1.25, opacity: 0.45, duration: 0.30, ease: 'sine.inOut' }, 0.52)
        .to(figureRef.current, { scale: 1.03, yPercent: -1.2, duration: 0.30, ease: 'sine.inOut' }, 0.52)

        // -------------------------------------------------------------
        // SCENE D: TRANSITION INTO FIND THE SIGNAL (0.82 -> 1.00)
        // Figure dissolves gently forward into the singularity beam,
        // leaving the radiant focal point as the bridge to the cosmic signal
        // -------------------------------------------------------------
        .to(figureRef.current, { opacity: 0, scale: 1.06, yPercent: -2.2, duration: 0.18, ease: 'power2.in' }, 0.82)
        .to(haloRef.current, { opacity: 0, duration: 0.18, ease: 'power2.in' }, 0.82)
        .to(washRef.current, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.82);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="ai-universe" id="ai-universe" ref={sectionRef} aria-label="AI Universe & Spatial Architecture">
      <div className="ai-universe__sticky">
        {/* Layered red-orange environment */}
        <div className="ai-universe__env" aria-hidden="true" />
        <div ref={washRef} className="ai-universe__wash" aria-hidden="true" />
        {/* Seamless metamorphosis overlay into the cosmic transition palette */}
        <div ref={cosmicMorphRef} className="ai-universe__cosmic-morph" aria-hidden="true" />

        {/* 3D: environment haze, procedural portal singularity, flowing energy trails, 3D technology cubes, fragments */}
        <AIUniverseCanvas progressRef={progressRef} />

        {/* Central figure with the violet halo behind it, composited between
            the two 3D passes */}
        <div ref={figureRef} className="ai-universe__figure">
          <div ref={haloRef} className="ai-universe__halo" aria-hidden="true">
            <span className="ai-universe__halo-ring" />
          </div>
          <div className="ai-universe__rim-aura" aria-hidden="true" />
          <img
            src="/images/yadav-back-suit.png"
            alt="Yadav Kumaran"
            className="ai-universe__figure-img"
            width={682}
            height={1024}
            loading="eager"
            decoding="async"
            draggable={false}
          />
          {/* Faint floor reflection so the figure stands on the stage */}
          <img
            src="/images/yadav-back-suit.png"
            alt=""
            aria-hidden="true"
            className="ai-universe__figure-reflect"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="ai-universe__vignette" aria-hidden="true" />

        {/* Editorial overlay matching reference video */}
        <div ref={headlineRef} className="ai-universe__content">
          <span className="ai-universe__tag label">SCENE 02</span>
          <h2 className="ai-universe__title">THE AI UNIVERSE</h2>
          <p className="ai-universe__desc">
            SYSTEMS · MODELS · INTERFACES · ARCHITECTURE
          </p>
        </div>
      </div>
    </section>
  );
}
