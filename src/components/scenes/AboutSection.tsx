import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { about, hasLink, site } from '../../data/portfolio';

export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const links = [
    { href: site.github as string, label: 'GitHub' },
    { href: site.linkedin as string, label: 'LinkedIn' },
    { href: site.resume as string, label: 'Résumé' },
  ].filter((link) => hasLink(link.href));

  useLayoutEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-about-head] > *', {
        y: 22,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-about-head]', start: 'top 85%', once: true },
      });

      gsap.from('[data-about-reveal]', {
        y: 26,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-about-grid]', start: 'top 78%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="about" id="about" ref={rootRef} aria-labelledby="about-title">
      <div className="shell">
        <header className="about__header" data-about-head>
          <span className="label muted">02 / Developer identity</span>
          <span className="label about__index">Computer science · Full-stack · Applied AI</span>
        </header>

        <div className="about__grid" data-about-grid>
          <h2 className="about__statement" data-about-reveal id="about-title">
            I like the whole shape of a <em>problem.</em>
          </h2>

          <div className="about__bio">
            <p data-about-reveal>{about.intro}</p>
            <p data-about-reveal>{about.paragraphs[0]}</p>
            <div className="about__links" data-about-reveal>
              {links.map((link) => (
                <a
                  className="text-action"
                  key={link.label}
                  href={link.href}
                  target={link.label === 'Résumé' ? undefined : '_blank'}
                  rel={link.label === 'Résumé' ? undefined : 'noreferrer noopener'}
                  data-cursor="action"
                  data-cursor-label={link.label === 'Résumé' ? 'Open PDF' : 'Visit'}
                >
                  {link.label === 'Résumé' && <FileText aria-hidden="true" />}
                  {link.label}
                  {link.label !== 'Résumé' && <ArrowUpRight aria-hidden="true" />}
                </a>
              ))}
              <a className="text-action" href="#contact" data-cursor="action" data-cursor-label="Go">
                Start a conversation
                <ArrowDown aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
