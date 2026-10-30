import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, Gauge } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const TOUR_SPEEDS = {
  slow: { id: 'slow', label: 'Slow', speed: 35, badge: '0.6×' },
  cinematic: { id: 'cinematic', label: 'Cinematic', speed: 55, badge: '1.0×' },
  fast: { id: 'fast', label: 'Fast', speed: 85, badge: '1.5×' },
} as const;

export type TourSpeedKey = keyof typeof TOUR_SPEEDS;

export type TourState = 'idle' | 'playing' | 'paused';

interface CinematicTourProps {
  isModalOpen?: boolean;
}

/**
 * CinematicTour
 *
 * Floating bottom-right control enabling an optional, slow-paced cinematic auto-scroll
 * through the portfolio's 3D scenes and scroll-driven GSAP choreographies.
 *
 * Safety & UX:
 * - High-precision subpixel requestAnimationFrame engine
 * - Pauses immediately if the user touches the screen, wheels, or presses nav keys
 * - Pauses when tab visibility changes or when a project modal is open
 * - Automatically stops at document end
 * - Full reduced-motion awareness and accessible keyboard controls
 */
export function CinematicTour({ isModalOpen = false }: CinematicTourProps) {
  const [tourState, setTourState] = useState<TourState>('idle');
  const [speedKey, setSpeedKey] = useState<TourSpeedKey>('cinematic');
  const [scrollProgress, setScrollProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  const tourRootRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const subpixelAccumulatorRef = useRef(0);
  const tourStateRef = useRef<TourState>('idle');
  const speedRef = useRef<TourSpeedKey>('cinematic');

  // Keep refs in sync with state for zero-latency frame loop access
  useEffect(() => {
    tourStateRef.current = tourState;
  }, [tourState]);

  useEffect(() => {
    speedRef.current = speedKey;
  }, [speedKey]);

  // Track document scroll progress percentage
  const updateProgress = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const current = window.scrollY;
    setScrollProgress(Math.min(100, Math.max(0, (current / maxScroll) * 100)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  // Main high-precision auto-scrolling loop
  const startLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    lastTimeRef.current = performance.now();
    subpixelAccumulatorRef.current = 0;

    const tick = (now: number) => {
      if (tourStateRef.current !== 'playing') return;

      const last = lastTimeRef.current ?? now;
      // Clamp delta to 100ms to prevent giant leaps if system pauses/throttles
      const deltaSec = Math.min((now - last) / 1000, 0.1);
      lastTimeRef.current = now;

      const pxPerSec = TOUR_SPEEDS[speedRef.current].speed;
      subpixelAccumulatorRef.current += pxPerSec * deltaSec;

      const wholePixels = Math.floor(subpixelAccumulatorRef.current);
      if (wholePixels > 0) {
        subpixelAccumulatorRef.current -= wholePixels;
        window.scrollBy({ top: wholePixels, behavior: 'auto' });
      }

      // Check if reached bottom of document
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 4) {
        setTourState('idle');
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    lastTimeRef.current = null;
    subpixelAccumulatorRef.current = 0;
  }, []);

  // Handle tour state changes
  useEffect(() => {
    if (tourState === 'playing') {
      startLoop();
    } else {
      stopLoop();
    }
    return () => stopLoop();
  }, [tourState, startLoop, stopLoop]);

  // Pause if modal dialog opens while tour is running
  useEffect(() => {
    if (isModalOpen && tourState === 'playing') {
      setTourState('paused');
    }
  }, [isModalOpen, tourState]);

  // Safety: Pause if tab visibility is hidden
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && tourStateRef.current === 'playing') {
        setTourState('paused');
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Safety: Instant pause on ANY manual user interaction (wheel, touch, keyboard)
  // NEVER fight the user
  useEffect(() => {
    const handleUserInteraction = (event: Event) => {
      // If event originated inside the tour control, allow button clicks
      if (tourRootRef.current && tourRootRef.current.contains(event.target as Node)) {
        return;
      }

      if (tourStateRef.current === 'playing') {
        setTourState('paused');
      }
    };

    const handleKeyNav = (event: KeyboardEvent) => {
      const navKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'];
      if (navKeys.includes(event.code) && tourStateRef.current === 'playing') {
        setTourState('paused');
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleKeyNav, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('keydown', handleKeyNav);
    };
  }, []);

  // User Actions
  const handlePlayResume = () => {
    if (reduced && tourState === 'idle') {
      // Still allow intentional click even with reduced motion preference
    }
    setTourState('playing');
  };

  const handlePause = () => {
    setTourState('paused');
  };

  const handleStop = () => {
    setTourState('idle');
  };

  const cycleSpeed = () => {
    const speedKeys: TourSpeedKey[] = ['slow', 'cinematic', 'fast'];
    const nextIndex = (speedKeys.indexOf(speedKey) + 1) % speedKeys.length;
    setSpeedKey(speedKeys[nextIndex]);
  };

  const currentSpeedConfig = TOUR_SPEEDS[speedKey];

  return (
    <div
      ref={tourRootRef}
      className={`cinematic-tour ${tourState !== 'idle' ? 'is-active' : ''}`}
      role="region"
      aria-label="Cinematic Auto-Scroll Tour"
    >
      <div className="cinematic-tour__glass">
        {/* Real-time progress bar along bottom of capsule */}
        <div
          className="cinematic-tour__progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Status Indicator & Label */}
        <div className="cinematic-tour__status-row">
          <span
            className={`cinematic-tour__indicator ${
              tourState === 'playing' ? 'is-playing' : tourState === 'paused' ? 'is-paused' : ''
            }`}
            aria-hidden="true"
          />
          <span className="cinematic-tour__label">
            {tourState === 'playing'
              ? 'TOURING'
              : tourState === 'paused'
              ? 'PAUSED'
              : 'CINEMATIC TOUR'}
          </span>
          <span className="cinematic-tour__speed-badge" title={`Speed: ${currentSpeedConfig.speed} px/sec`}>
            {currentSpeedConfig.badge}
          </span>
        </div>

        {/* Tour Control Buttons */}
        <div className="cinematic-tour__controls">
          {tourState === 'playing' ? (
            <button
              type="button"
              className="cinematic-tour__btn cinematic-tour__btn--primary"
              onClick={handlePause}
              aria-label="Pause cinematic tour"
              title="Pause auto-scroll"
              data-cursor="action"
              data-cursor-label="Pause"
            >
              <Pause className="cinematic-tour__icon" />
              <span className="sr-only">Pause</span>
            </button>
          ) : (
            <button
              type="button"
              className="cinematic-tour__btn cinematic-tour__btn--primary"
              onClick={handlePlayResume}
              aria-label={tourState === 'paused' ? 'Resume cinematic tour' : 'Start cinematic tour'}
              title={tourState === 'paused' ? 'Resume auto-scroll' : 'Start slow cinematic auto-scroll'}
              data-cursor="action"
              data-cursor-label="Play"
            >
              <Play className="cinematic-tour__icon cinematic-tour__icon--play" />
              <span className="sr-only">Play</span>
            </button>
          )}

          {/* Stop / Reset Button (visible when running or paused) */}
          {tourState !== 'idle' && (
            <button
              type="button"
              className="cinematic-tour__btn"
              onClick={handleStop}
              aria-label="Stop cinematic tour"
              title="Stop auto-scroll"
              data-cursor="action"
              data-cursor-label="Stop"
            >
              <Square className="cinematic-tour__icon" />
              <span className="sr-only">Stop</span>
            </button>
          )}

          {/* Speed Selector Toggle */}
          <button
            type="button"
            className="cinematic-tour__btn cinematic-tour__btn--speed"
            onClick={cycleSpeed}
            aria-label={`Tour speed: ${currentSpeedConfig.label} (${currentSpeedConfig.speed} px per second). Click to cycle.`}
            title={`Speed: ${currentSpeedConfig.label} (${currentSpeedConfig.speed} px/s). Click to cycle.`}
            data-cursor="action"
            data-cursor-label="Speed"
          >
            <Gauge className="cinematic-tour__icon cinematic-tour__icon--gauge" />
            <span className="cinematic-tour__speed-text">{currentSpeedConfig.label}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
