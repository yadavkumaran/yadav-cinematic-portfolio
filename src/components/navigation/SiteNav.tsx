import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { hasLink, navLinks, site } from '../../data/portfolio';

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 28);
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      const lightSections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-nav-theme="light"]'),
      );
      const navLine = 76;
      setLight(
        lightSections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= navLine && rect.bottom >= navLine;
        }),
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add('is-locked');
    const overlay = overlayRef.current;
    const focusables = overlay
      ? Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button'))
      : [];
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-locked');
      previousFocus?.focus();
    };
  }, [open]);

  const socialLinks = [
    { href: site.github as string, label: 'GitHub' },
    { href: site.linkedin as string, label: 'LinkedIn' },
  ].filter((link) => hasLink(link.href));

  return (
    <>
      <header
        className="site-nav"
        data-scrolled={scrolled}
        data-light={light}
        data-overlay={open}
      >
        <div className="site-nav__progress" ref={progressRef} aria-hidden="true" />
        <a
          className="brand"
          href="#top"
          aria-label={`${site.name} — back to top`}
          onClick={() => setOpen(false)}
        >
          <span className="brand__mark" aria-hidden="true">
            {site.monogram}
          </span>
          <span className="brand__text">
            <span className="brand__name">{site.name}</span>
            <span className="brand__role">{site.role}</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((link, index) => (
            <a className="nav-link" href={link.href} key={link.href}>
              <span className="nav-link__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {link.label}
            </a>
          ))}
          {hasLink(site.github) && (
            <a
              className="nav-link"
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="nav-link__index" aria-hidden="true">
                ↗
              </span>
              GitHub
            </a>
          )}
        </nav>

        <button
          type="button"
          className="nav-menu-btn"
          ref={menuButtonRef}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {open && (
        <div
          className="nav-overlay"
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav className="nav-overlay__links" aria-label="Sections">
            {navLinks.map((link, index) => (
              <a
                className="nav-overlay__link"
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <span>{String(index + 1).padStart(2, '0')}</span>
              </a>
            ))}
          </nav>

          <div className="nav-overlay__foot">
            <span>
              {site.name} / {site.role}
            </span>
            <span className="flex items-center gap-4">
              {hasLink(site.email) && <a href={`mailto:${site.email}`}>Email</a>}
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer noopener">
                  {link.label}
                </a>
              ))}
              <span>© {site.year}</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
