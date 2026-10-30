import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * A two-part pointer: a small dot that tracks the pointer almost exactly and a
 * hairline ring that trails it with a little inertia. Both are driven from a
 * single requestAnimationFrame loop that writes transforms directly to the DOM
 * — no React state is involved in pointer movement.
 */

/** Untransformed size of the ring box; the visible size is driven by scale. */
const RING_BASE = 56;

/** Anything that should read as interactive to the pointer. */
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor]',
].join(', ');

/** Surfaces whose palette needs a different treatment (paper, bright red). */
const THEME_SELECTOR = [
  '.light-section',
  '[data-nav-theme="light"]',
  '.btn:not(.btn--ghost)',
  '.red-feature__panel',
].join(', ');

type Mode = 'idle' | 'link' | 'view';
type Theme = 'dark' | 'light' | 'warm';

const RING_SCALE: Record<Mode, number> = { idle: 0.6, link: 0.86, view: 1 };
const DOT_SCALE: Record<Mode, number> = { idle: 1, link: 0.5, view: 0 };

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  // Track the pointer type so plugging in a mouse activates the cursor without
  // a reload, and a touch device never does.
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => setFinePointer(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced || !finePointer) return;

    const root = document.documentElement;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    root.dataset.finePointer = 'true';
    root.dataset.pointerHidden = 'true';

    // Pointer, ring and dot positions.
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px;
    let ry = py;
    let dx = px;
    let dy = py;

    let mode: Mode = 'idle';
    let theme: Theme = 'dark';
    let ringScale = RING_SCALE.idle;
    let dotScale = DOT_SCALE.idle;
    let pressed = false;
    let started = false;
    let hidden = true;
    let modal = false;
    let hitTest = false;
    let lastTarget: EventTarget | null = null;
    let raf = 0;
    let last = performance.now();

    const damp = (from: number, to: number, lambda: number, dt: number) =>
      from + (to - from) * (1 - Math.exp(-lambda * dt));

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      if (next === 'idle') delete root.dataset.pointerMode;
      else root.dataset.pointerMode = next;
    };

    const setTheme = (next: Theme) => {
      if (next === theme) return;
      theme = next;
      if (next === 'dark') delete root.dataset.pointerTheme;
      else root.dataset.pointerTheme = next;
    };

    /** Reads the element under the pointer and updates mode, label and palette. */
    const evaluate = (target: EventTarget | null) => {
      const node = target instanceof Element ? target : null;
      if (!node) {
        setMode('idle');
        setTheme('dark');
        label.textContent = '';
        return;
      }

      const flagged = node.closest<HTMLElement>('[data-cursor]');
      const interactive = node.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      const isView = flagged?.dataset.cursor === 'view';

      setMode(isView ? 'view' : interactive ? 'link' : 'idle');

      if (isView) {
        const text = flagged?.dataset.cursorLabel || 'VIEW';
        if (label.textContent !== text) label.textContent = text;
      } else if (label.textContent) {
        label.textContent = '';
      }

      const surface = node.closest<HTMLElement>(THEME_SELECTOR);
      if (surface?.classList.contains('red-feature__panel')) setTheme('warm');
      else if (surface) setTheme('light');
      else setTheme('dark');
    };

    const show = () => {
      if (hidden) {
        hidden = false;
        root.dataset.pointerHidden = 'false';
      }
    };

    const hide = () => {
      if (!hidden) {
        hidden = true;
        root.dataset.pointerHidden = 'true';
      }
    };

    const onMove = (event: PointerEvent) => {
      px = event.clientX;
      py = event.clientY;
      if (!started) {
        // Snap on the first move so the ring never flies in from the centre.
        started = true;
        rx = px;
        ry = py;
        dx = px;
        dy = py;
      }
      show();
      if (event.target !== lastTarget) {
        lastTarget = event.target;
        evaluate(event.target);
      }
    };

    const onOver = (event: PointerEvent) => {
      const node = event.target;
      if (node === lastTarget) return;
      // pointerover bubbles, so ancestors report too — ignore those.
      if (
        node instanceof Node &&
        lastTarget instanceof Node &&
        node.contains(lastTarget)
      ) {
        return;
      }
      lastTarget = node;
      evaluate(node);
    };

    const onScroll = () => {
      // The element under a stationary pointer changes while scrolling.
      hitTest = true;
    };

    const onDown = () => {
      pressed = true;
      root.dataset.pointerPressed = 'true';
    };

    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      delete root.dataset.pointerPressed;
    };

    const onLeave = () => {
      hide();
      started = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        hide();
        return;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onBlur = () => {
      onUp();
      hide();
    };

    const onModalChange = () => {
      const open = root.classList.contains('dialog-open');
      if (open === modal) return;
      modal = open;
      if (open) root.dataset.pointerModal = 'true';
      else delete root.dataset.pointerModal;
    };

    const modalObserver = new MutationObserver(onModalChange);
    modalObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    onModalChange();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      if (hitTest) {
        hitTest = false;
        evaluate(document.elementFromPoint(px, py));
      }

      const pressedScale = pressed ? 0.9 : 1;
      const ringTarget = RING_SCALE[mode] * pressedScale;

      rx = damp(rx, px, 11, dt);
      ry = damp(ry, py, 11, dt);
      dx = damp(dx, px, 42, dt);
      dy = damp(dy, py, 42, dt);

      ringScale = damp(ringScale, ringTarget, 14, dt);
      dotScale = damp(dotScale, DOT_SCALE[mode], 18, dt);

      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) scale(${ringScale.toFixed(3)})`;
      dot.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${dotScale.toFixed(3)})`;

      const labelOffset = (RING_BASE * ringScale) / 2 + 13;
      label.style.transform = `translate3d(${(rx + labelOffset).toFixed(2)}px, ${ry.toFixed(2)}px, 0) translateY(-50%)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    document.documentElement.addEventListener('pointerleave', onLeave);

    last = performance.now();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      modalObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('visibilitychange', onVisibility);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onBlur);
      delete root.dataset.finePointer;
      delete root.dataset.pointerMode;
      delete root.dataset.pointerHidden;
      delete root.dataset.pointerTheme;
      delete root.dataset.pointerPressed;
      delete root.dataset.pointerModal;
    };
  }, [reduced, finePointer]);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ringRef} />
      <div className="cursor__dot" ref={dotRef} />
      <span className="cursor__label" ref={labelRef} />
    </div>
  );
}
