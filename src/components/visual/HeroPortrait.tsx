import { useState } from 'react';

const SIZES = '(max-width: 767px) 100vw, (max-width: 1023px) 96vh, 52vw';

export function HeroPortrait() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  return (
    <figure className="hero__portrait" data-state={state}>
      {/* Soft field of the same image so the frame dissolves into the hero. */}
      <div className="hero__portrait-bleed" aria-hidden="true" />
      <div className="hero__portrait-halo" aria-hidden="true" />

      <div className="hero__portrait-frame" data-hero-portrait>
        <picture>
          <source
            type="image/webp"
            srcSet="/images/hero-portrait-640.webp 640w, /images/hero-portrait.webp 1084w"
            sizes={SIZES}
          />
          <img
            className="hero__portrait-img"
            src="/images/hero-portrait.png"
            alt="Yadav Kumaran in a dark jacket, looking back over a lava field beneath a burning red moon"
            width={1122}
            height={1402}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
          />
        </picture>
      </div>
    </figure>
  );
}
