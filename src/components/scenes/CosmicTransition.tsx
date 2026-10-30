import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { CosmicCanvas } from '../visual/CosmicCanvas';

export function CosmicTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reduced) {
      progressRef.current = 0.5;
      if (contentRef.current) gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      if (hintRef.current) gsap.set(hintRef.current, { autoAlpha: 0 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Single unified timeline pinned across the extended sticky scroll duration.
      // scrub: 0.9 gives an ultra-luxurious, slow, cushioned cinematic deceleration with responsive control.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      timeline
        // Phase 1: Hint gently fades out as user engages the cosmic voyage
        .fromTo(
          hintRef.current,
          { autoAlpha: 0.85, y: 0 },
          { autoAlpha: 0, y: -12, duration: 0.10, ease: 'power1.out' },
          0.02,
        )
        // Phase 2: Editorial entrance - text ascends smoothly from invisible zero into full brilliance
        .fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 28, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
          0.04,
        )
        // Phase 3: Grand Cinematic Hold - generous reading plateau with subtle cosmic float
        // Occupies 46% of the 500vh scroll travel so the user can leisurely read and absorb
        .to(
          contentRef.current,
          { y: -14, duration: 0.46, ease: 'none' },
          0.26,
        )
        // Phase 4: Hyperspace Departure - soft dissolve as camera glides into the singularity
        .to(
          contentRef.current,
          { autoAlpha: 0, y: -38, scale: 1.03, duration: 0.24, ease: 'power2.in' },
          0.72,
        );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="cosmic" id="cosmic" ref={sectionRef} aria-label="Transition to selected work">
      <div className="cosmic__sticky">
        <CosmicCanvas progressRef={progressRef} />
        <div className="cosmic__vignette" aria-hidden="true" />

        <div className="cosmic__content" ref={contentRef}>
          <span className="cosmic__eyebrow label">A way into the work</span>
          <h2 className="cosmic__title">
            Find<em>the signal.</em>
          </h2>
          <p className="cosmic__sub">
            Start with the decision someone needs to make. Trace the data, shape the system,
            and make the outcome legible.
          </p>
        </div>

        <div className="cosmic__hint" ref={hintRef} aria-hidden="true">
          Keep scrolling
          <ArrowDown />
        </div>
      </div>
    </section>
  );
}
