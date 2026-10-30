import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  hasLink,
  projects,
  selectedProjects,
  type Project,
} from '../../data/portfolio';
import { ProjectArtwork } from '../projects/ProjectArtwork';

interface ProjectShowcaseProps {
  onOpenProject: (project: Project) => void;
}

export function ProjectShowcase({ onOpenProject }: ProjectShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const archiveProjects = projects.filter(
    (project) => !selectedProjects.some((selected) => selected.id === project.id),
  );

  useLayoutEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-work-header] > *', {
        y: 26,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-work-header]', start: 'top 82%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('[data-project-row]').forEach((row) => {
        const visual = row.querySelector<HTMLElement>('[data-project-visual]');
        const inner = row.querySelector<HTMLElement>('[data-project-inner]');
        const reveals = row.querySelectorAll<HTMLElement>('[data-reveal]');
        if (visual) {
          gsap.fromTo(
            visual,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0% 0 0% 0)',
              duration: 1.25,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: row, start: 'top 82%', once: true },
            },
          );
        }

        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.12 },
            {
              scale: 1,
              duration: 1.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: row, start: 'top 82%', once: true },
            },
          );

          gsap.to(inner, {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        if (reveals.length) {
          gsap.from(reveals, {
            y: 22,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 76%', once: true },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="work" id="work" ref={rootRef} aria-labelledby="work-title">
      <div className="shell">
        <header className="work__header" data-work-header>
          <div>
            <span className="label muted">04 / Selected work</span>
            <h2 className="work__title" id="work-title">
              Built to be <em>used.</em>
            </h2>
          </div>
          <div className="work__aside">
            <p>
              Four concise case studies: health, climate, procurement, and household finance.
              Each project is presented with its actual scope and status.
            </p>
            <div className="work__meta">
              <span>{selectedProjects.length} case studies</span>
              <span>AI · Data · Full-stack</span>
              <span>Details on every build</span>
            </div>
            <a className="text-action work__archive-link" href="#work-archive">
              Explore all projects
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className="work__projects">
          {selectedProjects.map((project, index) => {
            const archiveIndex = index + 1;

            return (
            <article className="project" key={project.id} data-project-row>
              <div className="project__grid">
                <div className="project__visual" data-project-visual>
                  <div className="project__visual-inner" data-project-inner>
                    <ProjectArtwork project={project} />
                  </div>
                  <button
                    type="button"
                    className="project__visual-open"
                    onClick={() => onOpenProject(project)}
                    aria-label={`Open ${project.title} project details`}
                    data-cursor="view"
                    data-cursor-label="Open"
                  />
                </div>

                <div className="project__content">
                  <div className="project__topline" data-reveal>
                    <span className="project__number" aria-hidden="true">
                      {String(archiveIndex).padStart(2, '0')}
                    </span>
                    <span className="label muted">{project.category}</span>
                  </div>

                  <h3 className="project__title" data-reveal>
                    {project.title}
                    <span>{project.subtitle}</span>
                  </h3>

                  <p className="project__desc" data-reveal>
                    {project.description}
                  </p>

                  <ul className="project__stack" data-reveal aria-label="Technology">
                    {project.stack.slice(0, 4).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  <div className="project__actions" data-reveal>
                    <button
                      type="button"
                      className="text-action"
                      onClick={() => onOpenProject(project)}
                      data-cursor="action"
                      data-cursor-label="Read"
                    >
                      Project details
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                    {hasLink(project.links.github) && (
                      <a
                        className="project__external"
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        GitHub
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                    {hasLink(project.links.live) && (
                      <a
                        className="project__external"
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Live
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>

        <div className="work__foot" id="work-archive">
          <div className="work__archive-heading">
            <span className="label muted">Project archive</span>
            <span className="label muted">Additional builds &amp; studio studies</span>
          </div>
          <div className="work__experiments" aria-label="Additional projects and experiments">
            {archiveProjects.map((project) => (
              <button
                type="button"
                key={project.id}
                className="work__experiment"
                onClick={() => onOpenProject(project)}
                data-cursor="action"
                data-cursor-label="Open"
              >
                <span>{project.title}</span>
                <small>{project.kind === 'experiment' ? 'Studio study' : project.status}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
