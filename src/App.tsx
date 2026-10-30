import { useCallback, useEffect, useState } from 'react';
import { SiteNav } from './components/navigation/SiteNav';
import { LoadingIntro } from './components/ui/LoadingIntro';
import { CinematicIntro } from './components/ui/CinematicIntro';
import { CustomCursor } from './components/ui/CustomCursor';
import { CinematicTour } from './components/ui/CinematicTour';
import { SolarHero } from './components/scenes/SolarHero';
import { AIUniverseScene } from './components/scenes/AIUniverseScene';
import { CosmicTransition } from './components/scenes/CosmicTransition';
import { ProjectShowcase } from './components/scenes/ProjectShowcase';
import { AboutSection } from './components/scenes/AboutSection';
import { PortraitOutro } from './components/scenes/PortraitOutro';
import { ContactSection } from './components/scenes/ContactSection';
import {
  EngineeringMindset,
  GrowthSection,
  TechnicalUniverse,
} from './components/scenes/EngineeringSections';
import { ProjectDialog } from './components/projects/ProjectDialog';
import { projects, type Project } from './data/portfolio';

export default function App() {
  const hasDirectAnchor =
    typeof window !== 'undefined' &&
    Boolean(window.location.hash || window.location.search.includes('no-intro'));
  const [loaderDone, setLoaderDone] = useState(hasDirectAnchor);
  const [introDone, setIntroDone] = useState(hasDirectAnchor);
  const [heroActive, setHeroActive] = useState(hasDirectAnchor);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (hasDirectAnchor) {
      document.body.classList.remove('is-locked');
    } else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => setLoaderDone(true), []);
  const handleTransitionStart = useCallback(() => {
    setHeroActive(true);
    document.body.classList.remove('is-locked');
  }, []);
  const handleCinematicIntroComplete = useCallback(() => {
    setHeroActive(true);
    setIntroDone(true);
    document.body.classList.remove('is-locked');
  }, []);
  const openProject = useCallback((project: Project) => setActiveProject(project), []);
  const closeProject = useCallback(() => setActiveProject(null), []);

  const activeIndex = activeProject
    ? projects.findIndex((project) => project.id === activeProject.id)
    : -1;
  const nextProject =
    activeIndex >= 0 ? projects[(activeIndex + 1) % projects.length] : projects[0];

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>

      <div className="grain" aria-hidden="true" />
      <CustomCursor />
      <SiteNav />
      <CinematicTour isModalOpen={activeProject !== null} />
      {!hasDirectAnchor && !loaderDone && <LoadingIntro onComplete={handleLoadingComplete} />}
      {!hasDirectAnchor && loaderDone && !introDone && (
        <CinematicIntro
          onTransitionStart={handleTransitionStart}
          onComplete={handleCinematicIntroComplete}
        />
      )}

      <main id="main">
        <SolarHero started={heroActive} onOpenProject={openProject} />
        <AIUniverseScene />
        <CosmicTransition />
        <AboutSection />
        <TechnicalUniverse />
        <ProjectShowcase onOpenProject={openProject} />
        <EngineeringMindset />
        <GrowthSection />
        <PortraitOutro />
        <ContactSection />
      </main>

      <ProjectDialog
        project={activeProject}
        onClose={closeProject}
        onNext={openProject}
        nextProject={nextProject ?? null}
      />
    </>
  );
}
