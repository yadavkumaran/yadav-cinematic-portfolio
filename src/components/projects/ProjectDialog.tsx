import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { ProjectArtwork } from './ProjectArtwork';
import { hasLink, type Project } from '../../data/portfolio';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  onNext: (project: Project) => void;
  nextProject: Project | null;
}

export function ProjectDialog({ project, onClose, onNext, nextProject }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
    } else if (!project && dialog.open) {
      dialog.close();
    }

    return () => {
      if (!dialog.open) document.documentElement.classList.remove('dialog-open');
    };
  }, [project]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('dialog-open');
    };
  }, []);

  const links = project
    ? [
        { href: project.links.live, label: 'Live project' },
        { href: project.links.github, label: 'GitHub' },
        { href: project.links.caseStudy, label: 'Full case study' },
      ].filter((link): link is { href: string; label: string } => hasLink(link.href))
    : [];

  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby={project ? 'project-dialog-title' : undefined}
      onClose={() => {
        document.documentElement.classList.remove('dialog-open');
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      {project && (
        <div className="dialog__inner">
          <div className="dialog__visual">
            <div className="dialog__topline">
              <span>{project.category}</span>
              <span className="dialog__status">{project.status}</span>
            </div>
            <button
              type="button"
              className="dialog__close"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close project details"
            >
              <X aria-hidden="true" />
            </button>
            <ProjectArtwork project={project} />
          </div>

          <div className="dialog__body">
            <div className="dialog__heading">
              <div>
                <h2 className="dialog__title" id="project-dialog-title">
                  {project.title}
                </h2>
                <p className="dialog__subtitle">{project.subtitle}</p>
              </div>
              <span className="dialog__index" aria-hidden="true">
                {project.kind === 'experiment' ? 'Studio' : 'Case study'}
              </span>
            </div>

            <div className="dialog__grid">
              <div>
                <p className="dialog__desc">{project.description}</p>

                <h3 className="dialog__h3">In this build</h3>
                <ul className="dialog__list">
                  {project.contributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="dialog__meta">
                <div className="dialog__meta-block">
                  <span className="dialog__meta-label">Role</span>
                  <p className="dialog__meta-value">{project.role}</p>
                </div>
                <div className="dialog__meta-block">
                  <span className="dialog__meta-label">Status</span>
                  <p className="dialog__meta-value">{project.status}</p>
                </div>
                <div className="dialog__meta-block">
                  <span className="dialog__meta-label">Stack</span>
                  <ul className="dialog__stack">
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="dialog__actions">
                  {links.map((link) => (
                    <a
                      className="btn btn--ghost"
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                  {nextProject && (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => onNext(nextProject)}
                    >
                      Next — {nextProject.title}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  )}
                </div>

                {links.length === 0 && (
                  <p className="dialog__note">
                    No public repository or live link is attached to this build yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
