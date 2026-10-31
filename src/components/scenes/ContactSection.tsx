import { useLayoutEffect, useRef } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { hasLink, site } from '../../data/portfolio';

export function ContactSection() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const socials = [
    { href: site.github as string, label: 'GitHub' },
    { href: site.linkedin as string, label: 'LinkedIn' },
    { href: site.resume as string, label: 'Résumé' },
    { href: 'tel:+919842647947', label: '+91 98426 47947' },
  ].filter((link) => hasLink(link.href));

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('[data-contact-reveal]', {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  useLayoutEffect(() => {
    if (reduced) return;
    const glow = glowRef.current;
    const root = rootRef.current;
    if (!glow || !root) return;

    const moveX = gsap.quickTo(glow, 'x', { duration: 1.4, ease: 'power3.out' });
    const moveY = gsap.quickTo(glow, 'y', { duration: 1.4, ease: 'power3.out' });

    const onPointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      moveX((event.clientX - rect.left - rect.width * 0.78) * 0.22);
      moveY((event.clientY - rect.top - rect.height * 0.25) * 0.16);
    };

    root.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      root.removeEventListener('pointermove', onPointer);
      gsap.killTweensOf(glow);
    };
  }, [reduced]);

  return (
    <section className="contact" id="contact" ref={rootRef} aria-labelledby="contact-title">
      <div className="contact__glow" ref={glowRef} aria-hidden="true" />

      <div className="shell contact__inner">
        <div className="contact__topline" data-contact-reveal>
          <span className="label">08 / Contact</span>
          <span className="label">End of transmission</span>
        </div>

        <div className="contact__name" data-contact-reveal>
          {site.name.toUpperCase()}
        </div>

        <h2 className="contact__title" id="contact-title" data-contact-reveal>
          Let&apos;s build something <em>worth keeping.</em>
        </h2>

        <p className="contact__lede" data-contact-reveal>
          I&apos;m always glad to talk about full-stack systems, applied AI, data problems, or a
          project that doesn&apos;t fit neatly into one of those boxes.
        </p>

        <div className="contact__primary" data-contact-reveal>
          {hasLink(site.email) ? (
            <a
              className="contact__email"
              href={`mailto:${site.email}`}
              data-cursor="action"
              data-cursor-label="Write"
            >
              {site.email}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : (
            <div className="contact__pending">
              <span className="contact__email">Say hello.</span>
              <p>
                Direct contact channels are being connected. Email and profile links live in{' '}
                <code>src/data/portfolio.ts</code>; once added, the actions here activate
                automatically.
              </p>
              <a className="contact__pending-link" href="#work">
                Revisit selected work
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          )}

          {socials.length > 0 && (
            <div className="contact__socials">
              {socials.map((link) => (
                <a
                  className="contact__social"
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="action"
                  data-cursor-label="Visit"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <footer className="contact__foot">
          <div className="contact__foot-left">
            <span>
              © {site.year} {site.name}
            </span>
            <span>Designed &amp; built with React, Three.js, GSAP</span>
          </div>
          <a className="contact__top" href="#top" data-cursor="action" data-cursor-label="Top">
            Back to top
            <ArrowUp aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
