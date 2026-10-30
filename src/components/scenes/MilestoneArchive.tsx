import { useLayoutEffect, useRef, useState } from 'react';
import {
  Award,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react';
import { gsap } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  academicData,
  hackathonVictories,
  internshipData,
  realSystemProjects,
  certificationsData,
} from '../../data/milestones';
import { MilestoneArchiveCanvas } from '../visual/MilestoneArchiveCanvas';

export function MilestoneArchive() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const activeZoneRef = useRef(0);
  const [activeZone, setActiveZone] = useState(0);
  const [activeProject, setActiveProject] = useState<string>('vaidhya');
  const reduced = usePrefersReducedMotion();

  // Zone percentages for quick-jump navigation
  const ZONE_SCROLL_TARGETS = [0.05, 0.35, 0.60, 0.85];

  const navigateToZone = (zoneIndex: number) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollDistance = root.offsetHeight - window.innerHeight;
    const targetY = scrollTop + scrollDistance * ZONE_SCROLL_TARGETS[zoneIndex];
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      if (reduced) {
        progressRef.current = 0.35;
        gsap.set('[data-arch-zone]', { autoAlpha: 1, y: 0 });
        return;
      }

      // Master ScrollTrigger timeline pinned across the extended 480vh scroll track
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            let currentZone = 0;
            if (self.progress < 0.18) currentZone = 0;
            else if (self.progress < 0.49) currentZone = 1;
            else if (self.progress < 0.75) currentZone = 2;
            else currentZone = 3;

            activeZoneRef.current = currentZone;
            setActiveZone(currentZone);
          },
        },
      });

      // ─────────────────────────────────────────────────────────
      // ZONE 0: ENTRANCE — "A record of becoming." (0.00 -> 0.16)
      // ─────────────────────────────────────────────────────────
      masterTL
        .fromTo(
          '[data-zone-0]',
          { autoAlpha: 1, y: 0, scale: 1 },
          { autoAlpha: 0, y: -45, scale: 0.96, duration: 0.08, ease: 'power2.in' },
          0.08,
        )

        // ─────────────────────────────────────────────────────────
        // ZONE 1: THE ACADEMIC MONUMENT & 9.55 CGPA (0.18 -> 0.48)
        // Fully completes exit by 0.48 before Zone 2 enters at 0.51
        // ─────────────────────────────────────────────────────────
        .fromTo(
          '[data-zone-1]',
          { autoAlpha: 0, y: 40, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
          0.18,
        )
        // Dedicated reading hold while inspecting the 3D 9.55 sculpture
        .to('[data-zone-1]', { y: -6, duration: 0.16, ease: 'none' }, 0.26)
        // Clean exit to Zone 2 with zero ghosted overlap
        .to(
          '[data-zone-1]',
          { autoAlpha: 0, y: -40, scale: 0.97, duration: 0.06, ease: 'power2.in' },
          0.42,
        )

        // ─────────────────────────────────────────────────────────
        // ZONE 2: INDUSTRY BRIDGE & HACKATHONS (0.51 -> 0.74)
        // Enters at 0.51 after Zone 1 is 100% hidden
        // ─────────────────────────────────────────────────────────
        .fromTo(
          '[data-zone-2]',
          { autoAlpha: 0, y: 40, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
          0.51,
        )
        // Hold during dual pylons and victory totems inspection
        .to('[data-zone-2]', { y: -6, duration: 0.13, ease: 'none' }, 0.59)
        // Clean exit to Zone 3 with zero ghosted overlap
        .to(
          '[data-zone-2]',
          { autoAlpha: 0, y: -40, scale: 0.97, duration: 0.05, ease: 'power2.in' },
          0.70,
        )

        // ─────────────────────────────────────────────────────────
        // ZONE 3: REAL SYSTEMS SPATIAL EXHIBITION (0.78 -> 0.96)
        // Enters at 0.78 after Zone 2 is 100% hidden
        // ─────────────────────────────────────────────────────────
        .fromTo(
          '[data-zone-3]',
          { autoAlpha: 0, y: 40, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
          0.78,
        )
        // Hold during systems architectural breakdown
        .to('[data-zone-3]', { y: -4, duration: 0.10, ease: 'none' }, 0.86)
        // Gentle exit into Section 07
        .to(
          '[data-zone-3]',
          { autoAlpha: 0, y: -36, scale: 0.98, duration: 0.05, ease: 'power2.in' },
          0.94,
        );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const selectedSysProject =
    realSystemProjects.find((p) => p.id === activeProject) ?? realSystemProjects[0];

  return (
    <section
      className="milestones-archive"
      id="achievements"
      ref={rootRef}
      aria-labelledby="growth-title"
    >
      {/* Pinned 100vh Architectural Gallery Stage */}
      <div className="milestones-archive__sticky">
        {/* Continuous 3D Architectural WebGL Exhibition Canvas */}
        <MilestoneArchiveCanvas
          progressRef={progressRef}
          activeZoneRef={activeZoneRef}
          activeProject={activeProject}
        />

        {/* Ambient lighting & cinematic vignette */}
        <div className="milestones-archive__ambient" aria-hidden="true" />
        <div className="milestones-archive__vignette" aria-hidden="true" />

        {/* ────────────────────────────────────────────────────────── */}
        {/* FLOATING ARCHITECTURAL EDITORIAL OVERLAYS                 */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="milestones-deck">
          {/* ======================================================== */}
          {/* ZONE 0: ENTRANCE — "A record of becoming."               */}
          {/* Headline sits freely in foreground; 3D sculpture is 16u  */}
          {/* down-hall, completely clear of the text footprint        */}
          {/* ======================================================== */}
          <div className="arch-zone arch-zone--hero" data-arch-zone data-zone-0>
            <div className="arch-hero">
              <div className="arch-hero__eyebrow">
                <span className="arch-tag">SECTION 06</span>
                <span className="arch-line" aria-hidden="true" />
                <span className="arch-index">ARCHITECTURAL EXHIBITION</span>
              </div>

              <h2 id="growth-title" className="arch-hero__title">
                A record of <em className="arch-hero__em">becoming.</em>
              </h2>

              <p className="arch-hero__desc">
                An architectural exhibition of academic rigour at SKCET, competitive hackathon
                victories, industrial IoT telemetry, and verified offline-first intelligent systems.
              </p>

              <div className="arch-hero__conduit-prompt" aria-hidden="true">
                <span className="arch-hero__pulse-dot" />
                <span>Follow the copper conduit</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 1: THE ACADEMIC MONUMENT & SCULPTURAL 9.55          */}
          {/* Positioned on the right spatial third, framing the 3D     */}
          {/* 9.55 sculpture on the left with zero overlap              */}
          {/* ======================================================== */}
          <div
            className="arch-zone arch-zone--academic"
            data-arch-zone
            data-zone-1
            id="archive-academic"
          >
            <div className="arch-panel arch-panel--right">
              <div className="arch-panel__header">
                <div className="arch-panel__badge">
                  <GraduationCap className="arch-icon" aria-hidden="true" />
                  <span>EXHIBIT 01 · ACADEMIC MONOLITH</span>
                </div>
                <span className="arch-panel__period">{academicData.period}</span>
              </div>

              <div className="arch-panel__hero-metric">
                <div className="arch-metric">
                  <span className="arch-metric__val">9.55</span>
                  <span className="arch-metric__max">/{academicData.cgpaMax}</span>
                </div>
                <div className="arch-metric__legend">
                  <span className="arch-metric__label">{academicData.cgpaLabel}</span>
                  <span className="arch-metric__badge">TOP TIER ACADEMIC STANDING</span>
                </div>
              </div>

              <div className="arch-panel__body">
                <h3 className="arch-panel__title">{academicData.degree}</h3>
                <p className="arch-panel__sub">{academicData.field}</p>
                <p className="arch-panel__location">
                  <strong>{academicData.institution}</strong> · {academicData.location}
                </p>
                <div className="arch-panel__status-pill">
                  <span className="arch-status-dot" />
                  <span>{academicData.yearStatus} · Autonomous Institution</span>
                </div>
              </div>

              <div className="arch-panel__details">
                <div className="arch-detail-row">
                  <span className="arch-detail-label">Prior Foundation</span>
                  <p className="arch-detail-text">
                    <strong>{academicData.secondary.title}</strong> · {academicData.secondary.institution} ({academicData.secondary.board})
                  </p>
                </div>

                <div className="arch-detail-row">
                  <span className="arch-detail-label">Verified Core Competencies</span>
                  <div className="arch-chips">
                    {academicData.coreCompetencies.slice(0, 6).map((comp) => (
                      <span key={comp} className="arch-chip">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="arch-detail-row">
                  <span className="arch-detail-label">Programming Architecture</span>
                  <div className="arch-chips arch-chips--accent">
                    {academicData.programmingLanguages.map((lang) => (
                      <span key={lang} className="arch-chip arch-chip--glow">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 2: INDUSTRY BRIDGE & HACKATHON EXHIBITION           */}
          {/* ======================================================== */}
          <div
            className="arch-zone arch-zone--bridge-victories"
            data-arch-zone
            data-zone-2
            id="archive-experience"
          >
            <div className="arch-split">
              {/* Left Column: Dual Internship Pylons */}
              <div className="arch-panel arch-panel--bridge">
                <div className="arch-panel__header">
                  <div className="arch-panel__badge">
                    <Cpu className="arch-icon" aria-hidden="true" />
                    <span>INDUSTRY CONDUIT · 2 EXPERIENCES</span>
                  </div>
                  <span className="arch-panel__period">Applied Practice</span>
                </div>

                <div className="arch-pylon-list">
                  {internshipData.map((item) => (
                    <div key={item.id} className="arch-pylon-card">
                      <div className="arch-pylon-card__top">
                        <span className="arch-pylon-card__type">
                          {item.type === 'virtual' ? 'Applied AI Virtual' : 'Industrial IoT & Hardware'}
                        </span>
                        <span className="arch-pylon-card__period">{item.period}</span>
                      </div>
                      <h4 className="arch-pylon-card__company">{item.company}</h4>
                      <p className="arch-pylon-card__role">{item.role}</p>
                      <p className="arch-pylon-card__desc">{item.description}</p>
                      {item.credential && (
                        <div className="arch-pylon-card__cred">
                          <ShieldCheck className="arch-pylon-card__cred-icon" />
                          <span>ID: {item.credential.id}</span>
                        </div>
                      )}
                      <div className="arch-chips">
                        {item.technologies.map((t) => (
                          <span key={t} className="arch-chip arch-chip--sm">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Certification */}
                  {certificationsData.map((c) => (
                    <div key={c.title} className="arch-pylon-card arch-pylon-card--cert">
                      <div className="arch-pylon-card__top">
                        <span className="arch-pylon-card__type">Enterprise Certification</span>
                        <span className="arch-pylon-card__period">{c.status}</span>
                      </div>
                      <h4 className="arch-pylon-card__company">{c.title}</h4>
                      <p className="arch-pylon-card__desc">
                        Full-stack software engineering, object-oriented design & backend services.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Hackathon Victories & Accolades */}
              <div className="arch-panel arch-panel--victories" id="archive-hackathons">
                <div className="arch-panel__header">
                  <div className="arch-panel__badge arch-panel__badge--gold">
                    <Trophy className="arch-icon" aria-hidden="true" />
                    <span>HACKATHON MONUMENTS · 4 VICTORIES</span>
                  </div>
                  <span className="arch-panel__period">Competitive Track</span>
                </div>

                <div className="arch-victory-list">
                  {hackathonVictories
                    .filter((h) => h.isVictory)
                    .map((h) => (
                      <div key={h.id} className="arch-victory-card">
                        <div className="arch-victory-card__header">
                          <div className="arch-victory-card__rank-wrap">
                            <Award className="arch-victory-card__trophy" />
                            <span className="arch-victory-card__rank">{h.rank}</span>
                          </div>
                          {h.prize && <span className="arch-victory-card__prize">{h.prize}</span>}
                          {h.date && <span className="arch-victory-card__date">{h.date}</span>}
                        </div>
                        <h4 className="arch-victory-card__title">{h.title}</h4>
                        <p className="arch-victory-card__event">{h.event} · {h.organizer}</p>
                        <div className="arch-victory-card__meta">
                          <span><strong>Team:</strong> {h.team}</span>
                          {h.notes && <p className="arch-victory-card__notes">{h.notes}</p>}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Supporting National Participations */}
                <div className="arch-finalist-section">
                  <span className="arch-finalist-title">National Competitions</span>
                  <div className="arch-finalist-list">
                    {hackathonVictories
                      .filter((h) => !h.isVictory)
                      .map((h) => (
                        <div key={h.id} className="arch-finalist-item">
                          <span className="arch-finalist-rank">{h.rank}</span>
                          <span className="arch-finalist-name">{h.title}</span>
                          <span className="arch-finalist-event">{h.event} ({h.organizer})</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 3: REAL SYSTEMS SPATIAL EXHIBITION                  */}
          {/* ======================================================== */}
          <div
            className="arch-zone arch-zone--systems"
            data-arch-zone
            data-zone-3
            id="archive-systems"
          >
            <div className="arch-systems-layout">
              {/* Interactive System Installation Selector */}
              <div className="arch-systems-nav" role="tablist" aria-label="Flagship system installations">
                {realSystemProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={activeProject === p.id}
                    className={`arch-system-btn ${activeProject === p.id ? 'is-active' : ''}`}
                    onClick={() => setActiveProject(p.id)}
                  >
                    <div className="arch-system-btn__indicator" />
                    <div className="arch-system-btn__text">
                      <span className="arch-system-btn__title">{p.title}</span>
                      <span className="arch-system-btn__cat">{p.category}</span>
                    </div>
                    {p.featured && <span className="arch-system-btn__tag">3D EXHIBIT</span>}
                  </button>
                ))}
              </div>

              {/* Active System Spatial Blueprint Panel */}
              <div className="arch-blueprint" role="tabpanel">
                <div className="arch-blueprint__header">
                  <div>
                    <div className="arch-blueprint__meta-row">
                      <span className="arch-blueprint__year">{selectedSysProject.year}</span>
                      <span className="arch-blueprint__node-badge">
                        <Terminal className="arch-blueprint__icon" />
                        <span>3D SPATIAL ARCHITECTURE</span>
                      </span>
                    </div>
                    <h3 className="arch-blueprint__title">{selectedSysProject.title}</h3>
                    <p className="arch-blueprint__category">{selectedSysProject.category}</p>
                    {selectedSysProject.affiliation && (
                      <div className="arch-blueprint__affiliation">
                        <Sparkles className="arch-blueprint__sparkle" />
                        <span>{selectedSysProject.affiliation}</span>
                      </div>
                    )}
                  </div>

                  <div className="arch-blueprint__stack">
                    <span className="arch-blueprint__stack-label">System Stack</span>
                    <div className="arch-chips arch-chips--accent">
                      {selectedSysProject.stack.map((item) => (
                        <span key={item} className="arch-chip arch-chip--glow">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="arch-blueprint__summary">{selectedSysProject.summary}</p>

                {/* Architectural Pillars / Hardware & Telemetry Highlights */}
                <div className="arch-pillars">
                  {selectedSysProject.architecturalPillars.map((pillar) => (
                    <div key={pillar.label} className="arch-pillar">
                      <div className="arch-pillar__top">
                        <span className="arch-pillar__indicator" />
                        <h4 className="arch-pillar__label">{pillar.label}</h4>
                      </div>
                      <p className="arch-pillar__desc">{pillar.description}</p>
                    </div>
                  ))}
                </div>

                {selectedSysProject.awards && (
                  <div className="arch-blueprint__accolades">
                    <span className="arch-blueprint__accolades-label">Accolades:</span>
                    {selectedSysProject.awards.map((award) => (
                      <span key={award} className="arch-blueprint__award-tag">
                        <Trophy className="arch-blueprint__trophy" />
                        {award}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* EXHIBITION TIMELINE RAIL: QUICK-JUMP NAVIGATION           */}
        {/* ────────────────────────────────────────────────────────── */}
        <nav className="arch-rail" aria-label="Exhibition zones navigation">
          <button
            type="button"
            className={`arch-rail__btn ${activeZone === 0 ? 'is-active' : ''}`}
            onClick={() => navigateToZone(0)}
          >
            <span className="arch-rail__dot" />
            <span className="arch-rail__label">00 Entrance</span>
          </button>
          <button
            type="button"
            className={`arch-rail__btn ${activeZone === 1 ? 'is-active' : ''}`}
            onClick={() => navigateToZone(1)}
          >
            <span className="arch-rail__dot" />
            <span className="arch-rail__label">01 Academic (9.55)</span>
          </button>
          <button
            type="button"
            className={`arch-rail__btn ${activeZone === 2 ? 'is-active' : ''}`}
            onClick={() => navigateToZone(2)}
          >
            <span className="arch-rail__dot" />
            <span className="arch-rail__label">02 Bridge &amp; Victories</span>
          </button>
          <button
            type="button"
            className={`arch-rail__btn ${activeZone === 3 ? 'is-active' : ''}`}
            onClick={() => navigateToZone(3)}
          >
            <span className="arch-rail__dot" />
            <span className="arch-rail__label">03 Real Systems</span>
          </button>
        </nav>
      </div>
    </section>
  );
}
