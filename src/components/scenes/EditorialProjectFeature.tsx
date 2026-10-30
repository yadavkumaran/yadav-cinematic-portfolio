import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { hasLink, redFeatureProject, type Project } from '../../data/portfolio';
import { ProjectArtwork } from '../projects/ProjectArtwork';

interface EditorialProjectFeatureProps {
  onOpenProject: (project: Project) => void;
}

export function EditorialProjectFeature({ onOpenProject }: EditorialProjectFeatureProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const project = redFeatureProject;
  const archiveIndex = 2;

  useLayoutEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-feature-visual]',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );

      gsap.from('[data-feature-content] > *', {
        y: 26,
        autoAlpha: 0,
        duration: 0.95,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 68%', once: true },
      });

      gsap.fromTo(
        '[data-feature-inner]',
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );

      gsap.to('[data-feature-visual]', {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="red-feature" ref={rootRef} aria-labelledby="feature-title">
      <div className="red-feature__panel">
        <div className="red-feature__inner">
          <div>
            <div className="red-feature__visual" data-feature-visual>
              <div data-feature-inner style={{ height: '100%' }}>
                <ProjectArtwork project={project} />
              </div>
            </div>
            <div className="red-feature__caption">
              <span>Land surface / mitigation</span>
              <span>{project.status}</span>
            </div>
          </div>

          <div className="red-feature__content" data-feature-content>
            <span className="red-feature__kicker label">
              Featured study / {String(archiveIndex).padStart(2, '0')}
            </span>
            <h2 className="red-feature__title" id="feature-title">
              Heat, made <em>legible.</em>
            </h2>
            <p className="red-feature__desc">{project.description}</p>

            <div className="red-feature__facts">
              <span>{project.role}</span>
              <span>{project.category}</span>
            </div>

            <div className="red-feature__facts" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
              {project.stack.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="red-feature__actions">
              <button
                type="button"
                className="btn"
                onClick={() => onOpenProject(project)}
                data-cursor="action"
                data-cursor-label="Open"
              >
                Inspect the build
                <ArrowUpRight aria-hidden="true" />
              </button>
              {hasLink(project.links.live) && (
                <a
                  className="btn btn--ghost"
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Live project
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}
              {hasLink(project.links.github) && (
                <a
                  className="btn btn--ghost"
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
