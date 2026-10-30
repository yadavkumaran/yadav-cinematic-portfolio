import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { site } from '../../data/portfolio';

interface LoadingIntroProps {
  onComplete: () => void;
}

export function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const [hidden, setHidden] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    document.body.classList.add('is-locked');
    let cancelled = false;
    let finished = false;
    let raf = 0;
    let assetsReady = false;

    const start = performance.now();
    const minimum = reduced ? 80 : 750;
    const maximum = 1800;

    const fonts =
      typeof document.fonts?.ready?.then === 'function' ? document.fonts.ready : Promise.resolve();
    void Promise.race([fonts, new Promise((resolve) => window.setTimeout(resolve, 1500))]).then(() => {
      assetsReady = true;
    });

    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      if (countRef.current) countRef.current.textContent = '100';
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)';

      window.setTimeout(() => {
        if (cancelled) return;
        completeRef.current();

        const root = rootRef.current;
        if (!root || reduced) {
          setHidden(true);
          return;
        }

        gsap.to(root, {
          opacity: 0,
          scale: 1.02,
          duration: 0.75,
          ease: 'power2.inOut',
          onComplete: () => {
            setHidden(true);
            document.body.classList.remove('is-locked');
          },
        });
      }, reduced ? 60 : 160);
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / minimum);
      const eased = 1 - Math.pow(1 - ratio, 3);
      const value = Math.min(99, Math.round(eased * (assetsReady ? 100 : 94)));

      if (countRef.current) countRef.current.textContent = String(value).padStart(2, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;

      if ((assetsReady && elapsed >= minimum) || elapsed >= maximum) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.body.classList.remove('is-locked');
    };
  }, [reduced]);

  if (hidden) return null;

  return (
    <div className="intro" ref={rootRef} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="intro__top">
        <span>Portfolio / {site.year}</span>
        <span>Loading the observatory</span>
      </div>

      <div className="intro__center">
        <div className="intro__monogram" aria-hidden="true">
          {site.monogram}
          <span>.</span>
        </div>
        <div className="intro__name">{site.name}</div>
      </div>

      <div className="intro__bottom" aria-hidden="true">
        <div className="intro__line">
          <div className="intro__line-fill" ref={barRef} />
        </div>
        <div className="intro__count">
          <span ref={countRef}>00</span> <span>/100</span>
        </div>
      </div>
    </div>
  );
}
