import { useEffect, useRef } from 'react';
import { ProjectArtwork } from '../projects/ProjectArtwork';
import type { Project } from '../../data/portfolio';

// Card positions (and their responsive variants) live in hero.css under [data-pos].

interface OrbitProjectGalleryProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onOpen: (project: Project) => void;
  onNavigate: (direction: -1 | 1) => void;
}

export function OrbitProjectGallery({
  projects,
  activeIndex,
  onSelect,
  onOpen,
  onNavigate,
}: OrbitProjectGalleryProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const active = projects[activeIndex];

  useEffect(() => {
    const carousel = carouselRef.current;
    const card = carousel?.querySelector<HTMLElement>(`[data-mobile-index="${activeIndex}"]`);
    if (!carousel || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    carousel.scrollTo({
      left: card.offsetLeft - carousel.clientWidth / 2 + card.clientWidth / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [activeIndex]);

  const handleCard = (project: Project, index: number) => {
    if (index === activeIndex) {
      onOpen(project);
    } else {
      onSelect(index);
    }
  };

  return (
    <>
      <div
        className="orbit hero__orbit-desktop"
        role="group"
        aria-label="Selected project previews"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            onNavigate(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              type="button"
              className="orbit__card"
              data-active={isActive}
              data-dim={!isActive}
              data-pos={index}
              data-orbit-card
              aria-pressed={isActive}
              aria-label={`${project.title}, ${project.category}. ${isActive ? 'Active — open details' : 'Select project'}.`}
              data-cursor="view"
              data-cursor-label={isActive ? 'Open' : 'Select'}
              onClick={() => handleCard(project, index)}
            >
              <span className="orbit__inner">
                <span className="orbit__art">
                  <ProjectArtwork project={project} compact />
                </span>
                <span className="orbit__corner orbit__corner--tl" aria-hidden="true" />
                <span className="orbit__corner orbit__corner--br" aria-hidden="true" />
                <span className="orbit__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="orbit__label">
                <span>{project.title}</span>
                <span className="orbit__dot" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="orbit--mobile"
        ref={carouselRef}
        role="group"
        aria-label="Selected project previews"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              type="button"
              className="orbit__mobile-card"
              data-active={isActive}
              data-mobile-index={index}
              aria-pressed={isActive}
              aria-label={`${project.title}, ${project.category}. ${isActive ? 'Active — open details' : 'Select project'}.`}
              onClick={() => handleCard(project, index)}
            >
              <span className="orbit__inner">
                <span className="orbit__art">
                  <ProjectArtwork project={project} />
                </span>
                <span className="orbit__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="orbit__label">
                <span>{project.title}</span>
                <span className="orbit__dot" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="sr-only" aria-live="polite">
        Active preview: {active?.title} — {active?.category}
      </div>
    </>
  );
}
