import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { devicePixelRatioCap, supportsWebGL } from '../../lib/webgl';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AIUniverseCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

const LAYER_BACK = 0;
const LAYER_FRONT = 1;

/** Aspect of the baked panel face, so plates are never distorted. */
const PANEL_ASPECT = 512 / 460;
/** Camera FOV — wide and cinematic so panels surround the viewer. */
const FOV = 52;
/** Fixed reference distance for the layout. */
const LAYOUT_CAM_Z = 6.8;
/** Outer limit for panel edges — allows natural cropping of foreground panels. */
const FRAME_EDGE = 1.18;

interface NdcBox {
  /** NDC height of the plate. Width follows from PANEL_ASPECT. */
  h: number;
  /** NDC centre, measured in half-heights from the vertical centre. */
  y: number;
  side: -1 | 1;
  /** outer = edge-cropped frame; mid = mid-ground column; inner = flanking corridor. */
  anchor: 'outer' | 'mid' | 'inner';
  /** Extra authored rotation applied on top of the perspective tilt. */
  extraRotY?: number;
  extraRotX?: number;
}

interface PanelSpec {
  index: string;
  name: string;
  note: string;
  layer: typeof LAYER_BACK | typeof LAYER_FRONT;
  depth: number;
  wide: NdcBox;
  tablet?: NdcBox;
  phone?: NdcBox;
}

/**
 * 12 authentic skills of Yadav Kumaran arranged in an amphitheatrical 3D space:
 * - Large edge-cropped foreground panels (React & Three.js)
 * - Lower tier foreground panels (Spring Boot & Vite, clearly separated)
 * - Mid-ground tech pillars flanking the figure (Python, TypeScript)
 * - Flank corridor panels (Java, Applied AI, PostgreSQL, GSAP)
 * - Deep background pillars (Git / GitHub, System Design)
 */
const PANELS: PanelSpec[] = [
  // ── FOREGROUND LEFT (Edge-cropped, restrained scale so figure is the clear hero) ──
  {
    index: '01',
    name: 'React',
    note: 'Frontend Architecture',
    layer: LAYER_FRONT,
    depth: 1.6,
    wide: { h: 0.52, y: 0.02, side: -1, anchor: 'outer', extraRotY: 0.26, extraRotX: -0.05 },
    tablet: { h: 0.38, y: 0.04, side: -1, anchor: 'outer', extraRotY: 0.18 },
    phone: { h: 0.30, y: 0.08, side: -1, anchor: 'outer', extraRotY: 0.14 },
  },
  // ── FOREGROUND RIGHT (Edge-cropped, restrained scale) ──
  {
    index: '02',
    name: 'Three.js',
    note: '3D Web Experiences',
    layer: LAYER_FRONT,
    depth: 1.65,
    wide: { h: 0.50, y: 0.05, side: 1, anchor: 'outer', extraRotY: -0.24, extraRotX: -0.07 },
    tablet: { h: 0.38, y: 0.04, side: 1, anchor: 'outer', extraRotY: -0.18 },
    phone: { h: 0.30, y: 0.08, side: 1, anchor: 'outer', extraRotY: -0.14 },
  },
  // ── MID-GROUND UPPER LEFT (In open corridor beside heading, zero overlap with React) ──
  {
    index: '03',
    name: 'Python',
    note: 'AI / Machine Learning',
    layer: LAYER_BACK,
    depth: -0.3,
    wide: { h: 0.40, y: 0.36, side: -1, anchor: 'mid', extraRotY: 0.18, extraRotX: -0.06 },
    tablet: { h: 0.30, y: 0.32, side: -1, anchor: 'mid', extraRotY: 0.16 },
    phone: { h: 0.22, y: 0.36, side: -1, anchor: 'mid', extraRotY: 0.12 },
  },
  // ── MID-GROUND UPPER RIGHT (In open corridor beside heading, zero overlap with Three.js) ──
  {
    index: '04',
    name: 'TypeScript',
    note: 'Interface Architecture',
    layer: LAYER_BACK,
    depth: -0.6,
    wide: { h: 0.40, y: 0.34, side: 1, anchor: 'mid', extraRotY: -0.20, extraRotX: -0.08 },
    tablet: { h: 0.30, y: 0.32, side: 1, anchor: 'mid', extraRotY: -0.16 },
    phone: { h: 0.22, y: 0.36, side: 1, anchor: 'mid', extraRotY: -0.12 },
  },
  // ── MID-GROUND CENTER LEFT (Flanking waist, vertically separated between Python & Postgres) ──
  {
    index: '05',
    name: 'Java',
    note: 'Backend Systems',
    layer: LAYER_BACK,
    depth: -1.1,
    wide: { h: 0.36, y: -0.12, side: -1, anchor: 'inner', extraRotY: 0.26, extraRotX: -0.02 },
    tablet: { h: 0.26, y: -0.06, side: -1, anchor: 'inner', extraRotY: 0.20 },
  },
  // ── MID-GROUND CENTER RIGHT (Flanking waist, vertically separated between TS & GSAP) ──
  {
    index: '06',
    name: 'Applied AI',
    note: 'Autonomous Systems',
    layer: LAYER_BACK,
    depth: -0.9,
    wide: { h: 0.36, y: -0.09, side: 1, anchor: 'inner', extraRotY: -0.24, extraRotX: 0.03 },
    tablet: { h: 0.26, y: -0.06, side: 1, anchor: 'inner', extraRotY: -0.20 },
  },
  // ── LOWER FOREGROUND LEFT (Clearly separated below React) ──
  {
    index: '07',
    name: 'Spring Boot',
    note: 'APIs & Microservices',
    layer: LAYER_FRONT,
    depth: 1.1,
    wide: { h: 0.38, y: -0.58, side: -1, anchor: 'outer', extraRotY: 0.20, extraRotX: 0.08 },
    tablet: { h: 0.28, y: -0.48, side: -1, anchor: 'outer', extraRotY: 0.14 },
    phone: { h: 0.22, y: -0.46, side: -1, anchor: 'outer', extraRotY: 0.10 },
  },
  // ── LOWER FOREGROUND RIGHT (Clearly separated below Three.js) ──
  {
    index: '08',
    name: 'Vite',
    note: 'Build Architecture',
    layer: LAYER_FRONT,
    depth: 1.0,
    wide: { h: 0.38, y: -0.56, side: 1, anchor: 'outer', extraRotY: -0.18, extraRotX: 0.07 },
    tablet: { h: 0.28, y: -0.48, side: 1, anchor: 'outer', extraRotY: -0.14 },
    phone: { h: 0.22, y: -0.46, side: 1, anchor: 'outer', extraRotY: -0.10 },
  },
  // ── FLOOR TIER LEFT (Clearly separated below Java) ──
  {
    index: '09',
    name: 'PostgreSQL',
    note: 'Relational Database',
    layer: LAYER_BACK,
    depth: -1.5,
    wide: { h: 0.34, y: -0.74, side: -1, anchor: 'inner', extraRotY: 0.16, extraRotX: 0.12 },
  },
  // ── FLOOR TIER RIGHT (Clearly separated below Applied AI) ──
  {
    index: '10',
    name: 'GSAP',
    note: 'Cinematic Motion',
    layer: LAYER_BACK,
    depth: -1.4,
    wide: { h: 0.34, y: -0.74, side: 1, anchor: 'inner', extraRotY: -0.18, extraRotX: 0.12 },
  },
  // ── DEEP BACKGROUND LEFT (Lowered to clear navigation) ──
  {
    index: '11',
    name: 'Git / GitHub',
    note: 'Version Control',
    layer: LAYER_BACK,
    depth: -3.2,
    wide: { h: 0.32, y: 0.48, side: -1, anchor: 'outer', extraRotY: 0.12, extraRotX: -0.08 },
  },
  // ── DEEP BACKGROUND RIGHT (Lowered to clear navigation) ──
  {
    index: '12',
    name: 'System Design',
    note: 'Distributed Systems',
    layer: LAYER_BACK,
    depth: -3.5,
    wide: { h: 0.30, y: 0.46, side: 1, anchor: 'outer', extraRotY: -0.14, extraRotX: -0.08 },
  },
];

interface FragmentSpec {
  x: number;
  y: number;
  z: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  spin: number;
  layer: typeof LAYER_BACK | typeof LAYER_FRONT;
}

/** Geometric fragments drifting in 3D space, cleared from navigation & header areas */
const FRAGMENTS: FragmentSpec[] = [
  // Deep background drifting chips (safe from navigation, y <= 0.30)
  { x: -0.68, y: 0.24, z: -4.8, s: 0.045, rx: 0.4, ry: 0.9, rz: 0.2, spin: 0.035, layer: LAYER_BACK },
  { x: 0.72, y: 0.22, z: -4.2, s: 0.042, rx: 1.1, ry: 0.3, rz: 0.6, spin: -0.032, layer: LAYER_BACK },
  { x: -0.78, y: 0.10, z: -5.4, s: 0.048, rx: 0.2, ry: 1.3, rz: 0.9, spin: 0.026, layer: LAYER_BACK },
  { x: 0.80, y: 0.12, z: -3.8, s: 0.038, rx: 0.8, ry: 0.5, rz: 1.2, spin: -0.038, layer: LAYER_BACK },
  { x: -0.32, y: -0.18, z: -5.0, s: 0.052, rx: 0.6, ry: 0.7, rz: 0.3, spin: 0.022, layer: LAYER_BACK },
  { x: 0.34, y: -0.15, z: -4.6, s: 0.048, rx: 1.3, ry: 0.2, rz: 0.8, spin: 0.028, layer: LAYER_BACK },
  { x: -0.62, y: -0.32, z: -3.2, s: 0.040, rx: 0.5, ry: 1.1, rz: 0.4, spin: -0.03, layer: LAYER_BACK },
  { x: 0.64, y: -0.36, z: -3.4, s: 0.042, rx: 0.9, ry: 0.4, rz: 1.1, spin: 0.025, layer: LAYER_BACK },
  { x: -0.50, y: -0.68, z: -4.2, s: 0.046, rx: 0.7, ry: 0.35, rz: 1.0, spin: -0.032, layer: LAYER_BACK },
  { x: 0.52, y: -0.72, z: -5.0, s: 0.054, rx: 1.1, ry: 0.8, rz: 0.3, spin: 0.028, layer: LAYER_BACK },
  // Near foreground chips
  { x: -0.86, y: -0.42, z: 0.4, s: 0.052, rx: 0.5, ry: 1.0, rz: 0.7, spin: 0.042, layer: LAYER_FRONT },
  { x: 0.88, y: -0.40, z: 0.5, s: 0.046, rx: 1.0, ry: 0.4, rz: 0.9, spin: -0.038, layer: LAYER_FRONT },
  { x: -0.74, y: 0.28, z: 0.2, s: 0.040, rx: 0.35, ry: 1.25, rz: 0.45, spin: 0.032, layer: LAYER_FRONT },
  { x: 0.76, y: 0.28, z: 0.1, s: 0.042, rx: 1.25, ry: 0.3, rz: 0.75, spin: -0.035, layer: LAYER_FRONT },
  { x: -0.22, y: -0.88, z: 0.8, s: 0.044, rx: 0.4, ry: 0.8, rz: 1.1, spin: 0.024, layer: LAYER_FRONT },
  { x: 0.24, y: -0.86, z: 0.7, s: 0.042, rx: 1.0, ry: 0.6, rz: 0.3, spin: -0.026, layer: LAYER_FRONT },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);
const easeInOut = (value: number) => {
  const v = clamp01(value);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
const ramp = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / Math.max(0.0001, to - from));

function radialTexture(inner: string, mid: string, outer: string) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(0.42, mid);
    gradient.addColorStop(1, outer);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) => {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, radius);
  else ctx.rect(x, y, w, h);
};

/**
 * Draws iconic brand vector logos on the 3D card faces
 */
function drawLogo(ctx: CanvasRenderingContext2D, name: string, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.translate(cx, cy);

  switch (name) {
    case 'React': {
      ctx.strokeStyle = '#00d8ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00d8ff';
      ctx.shadowBlur = 16;

      ctx.fillStyle = '#00d8ff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.05, r * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'Three.js': {
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.moveTo(0, -r * 1.05);
      ctx.lineTo(r * 0.95, r * 0.7);
      ctx.lineTo(-r * 0.95, r * 0.7);
      ctx.closePath();
      ctx.fillStyle = '#1e1b2e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -r * 1.05);
      ctx.lineTo(0, r * 0.15);
      ctx.lineTo(-r * 0.95, r * 0.7);
      ctx.strokeStyle = 'rgba(255, 120, 60, 0.9)';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, r * 0.15);
      ctx.lineTo(r * 0.95, r * 0.7);
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.95)';
      ctx.stroke();
      break;
    }

    case 'Python': {
      const s = r * 0.75;
      ctx.shadowColor = '#3776ab';
      ctx.shadowBlur = 16;

      ctx.fillStyle = '#3776ab';
      ctx.beginPath();
      ctx.roundRect(-s, -s, s * 1.3, s * 0.8, s * 0.35);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-s * 0.5, -s, s * 0.8, s * 1.4, s * 0.35);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-s * 0.3, -s * 0.55, s * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffd438';
      ctx.shadowColor = '#ffd438';
      ctx.beginPath();
      ctx.roundRect(-s * 0.3, s * 0.2, s * 1.3, s * 0.8, s * 0.35);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-s * 0.3, -s * 0.4, s * 0.8, s * 1.4, s * 0.35);
      ctx.fill();

      ctx.fillStyle = '#1e1e1e';
      ctx.beginPath();
      ctx.arc(s * 0.3, s * 0.55, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'TypeScript': {
      const s = r * 0.88;
      ctx.shadowColor = '#3178c6';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#3178c6';
      ctx.beginPath();
      ctx.roundRect(-s, -s, s * 2, s * 2, s * 0.3);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(r * 0.95)}px "Inter Variable", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TS', 0, 2);
      break;
    }

    case 'Java': {
      ctx.shadowColor = '#e76f00';
      ctx.shadowBlur = 18;

      ctx.strokeStyle = '#5382a1';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.25, -r * 0.85);
      ctx.bezierCurveTo(-r * 0.45, -r * 0.5, 0, -r * 0.35, -r * 0.2, -r * 0.05);
      ctx.stroke();

      ctx.strokeStyle = '#e76f00';
      ctx.beginPath();
      ctx.moveTo(r * 0.2, -r * 0.95);
      ctx.bezierCurveTo(0, -r * 0.6, r * 0.4, -r * 0.4, r * 0.15, -r * 0.05);
      ctx.stroke();

      ctx.fillStyle = '#e76f00';
      ctx.beginPath();
      ctx.moveTo(-r * 0.65, 0);
      ctx.lineTo(r * 0.65, 0);
      ctx.bezierCurveTo(r * 0.65, r * 0.65, -r * 0.65, r * 0.65, -r * 0.65, 0);
      ctx.fill();

      ctx.strokeStyle = '#5382a1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.6, r * 0.75, r * 0.18, 0, 0, Math.PI);
      ctx.stroke();
      break;
    }

    case 'Spring Boot': {
      ctx.shadowColor = '#6db33f';
      ctx.shadowBlur = 18;

      ctx.fillStyle = '#6db33f';
      ctx.beginPath();
      ctx.moveTo(-r * 0.75, r * 0.75);
      ctx.bezierCurveTo(-r * 0.9, -r * 0.4, -r * 0.2, -r * 0.9, r * 0.85, -r * 0.85);
      ctx.bezierCurveTo(r * 0.9, r * 0.2, r * 0.4, r * 0.9, -r * 0.75, r * 0.75);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(0, -r * 0.05);
      ctx.stroke();
      break;
    }

    case 'Applied AI': {
      ctx.shadowColor = '#c77dff';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#e0aaff';

      ctx.beginPath();
      ctx.moveTo(0, -r * 1.15);
      ctx.bezierCurveTo(r * 0.15, -r * 0.2, r * 0.2, -r * 0.15, r * 1.15, 0);
      ctx.bezierCurveTo(r * 0.2, r * 0.15, r * 0.15, r * 0.2, 0, r * 1.15);
      ctx.bezierCurveTo(-r * 0.15, r * 0.2, -r * 0.2, r * 0.15, -r * 1.15, 0);
      ctx.bezierCurveTo(-r * 0.2, -r * 0.15, -r * 0.15, -r * 0.2, 0, -r * 1.15);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Vite': {
      ctx.shadowColor = '#ffcf00';
      ctx.shadowBlur = 18;

      ctx.fillStyle = '#41436a';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.95);
      ctx.lineTo(r * 0.85, -r * 0.35);
      ctx.lineTo(0, r * 0.95);
      ctx.lineTo(-r * 0.85, -r * 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffcf00';
      ctx.beginPath();
      ctx.moveTo(r * 0.15, -r * 0.85);
      ctx.lineTo(-r * 0.45, 0.05);
      ctx.lineTo(-r * 0.05, 0.05);
      ctx.lineTo(-r * 0.25, r * 0.85);
      ctx.lineTo(r * 0.45, -0.05);
      ctx.lineTo(r * 0.05, -0.05);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'PostgreSQL': {
      ctx.shadowColor = '#336791';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#336791';
      ctx.beginPath();
      ctx.roundRect(-r * 0.85, -r * 0.85, r * 1.7, r * 1.7, r * 0.35);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -r * 0.1, r * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-r * 0.45, r * 0.35);
      ctx.lineTo(r * 0.45, r * 0.35);
      ctx.stroke();
      break;
    }

    case 'GSAP': {
      ctx.shadowColor = '#0ae448';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#0ae448';
      ctx.font = `italic 900 ${Math.round(r * 0.88)}px "Inter Variable", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GSAP', 0, 0);
      break;
    }

    case 'Git / GitHub': {
      ctx.shadowColor = '#f05032';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#f05032';
      ctx.lineWidth = 4.5;

      ctx.beginPath();
      ctx.moveTo(-r * 0.3, -r * 0.65);
      ctx.lineTo(-r * 0.3, r * 0.65);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-r * 0.3, 0);
      ctx.bezierCurveTo(-r * 0.3, -r * 0.3, r * 0.3, -r * 0.1, r * 0.3, -r * 0.35);
      ctx.stroke();

      for (const [nx, ny] of [
        [-r * 0.3, -r * 0.65],
        [-r * 0.3, r * 0.65],
        [r * 0.3, -r * 0.35],
      ]) {
        ctx.fillStyle = '#f05032';
        ctx.beginPath();
        ctx.arc(nx, ny, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(nx, ny, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'System Design':
    default: {
      ctx.shadowColor = '#ff8c52';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(255, 140, 82, 0.9)';
      ctx.lineWidth = 3.5;

      const nodes = [
        [0, -r * 0.6],
        [-r * 0.6, r * 0.45],
        [r * 0.6, r * 0.45],
        [0, 0],
      ];

      ctx.beginPath();
      ctx.moveTo(nodes[0][0], nodes[0][1]);
      ctx.lineTo(nodes[3][0], nodes[3][1]);
      ctx.lineTo(nodes[1][0], nodes[1][1]);
      ctx.moveTo(nodes[3][0], nodes[3][1]);
      ctx.lineTo(nodes[2][0], nodes[2][1]);
      ctx.moveTo(nodes[0][0], nodes[0][1]);
      ctx.lineTo(nodes[1][0], nodes[1][1]);
      ctx.lineTo(nodes[2][0], nodes[2][1]);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#ffb38a';
      nodes.forEach(([nx, ny]) => {
        ctx.beginPath();
        ctx.arc(nx, ny, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
  }

  ctx.restore();
}

/**
 * Baked plate face: sleek dark glass with rounded beveled frame,
 * high-contrast authentic logo, crisp typography, and category tag.
 */
function panelTexture(spec: PanelSpec) {
  const w = 512;
  const h = 460;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const spacing = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  const inset = 12;
  const radius = 28;

  // Deep obsidian face with rich warm gradient
  const glass = ctx.createLinearGradient(0, 0, w * 0.8, h);
  glass.addColorStop(0, 'rgba(38, 24, 28, 0.98)');
  glass.addColorStop(0.5, 'rgba(20, 14, 18, 0.98)');
  glass.addColorStop(1, 'rgba(12, 8, 12, 0.99)');
  ctx.fillStyle = glass;
  roundedRect(ctx, inset, inset, w - inset * 2, h - inset * 2, radius);
  ctx.fill();

  // Subtle glass sheen reflection across the top half
  const sheen = ctx.createLinearGradient(0, 0, w * 0.7, h * 0.6);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.025)');
  sheen.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheen;
  roundedRect(ctx, inset + 2, inset + 2, w - (inset + 2) * 2, h - (inset + 2) * 2, radius - 2);
  ctx.fill();

  // Dual-tone beveled rim: warm orange on top/left, subtle violet on bottom/right
  const edge = ctx.createLinearGradient(inset, inset, w, h);
  edge.addColorStop(0, 'rgba(255, 195, 145, 0.85)');
  edge.addColorStop(0.4, 'rgba(255, 105, 48, 0.55)');
  edge.addColorStop(1, 'rgba(180, 90, 255, 0.45)');
  ctx.strokeStyle = edge;
  ctx.lineWidth = 3.5;
  roundedRect(ctx, inset, inset, w - inset * 2, h - inset * 2, radius);
  ctx.stroke();

  // Inner subtle highlight groove
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.2;
  roundedRect(ctx, inset + 6, inset + 6, w - (inset + 6) * 2, h - (inset + 6) * 2, radius - 6);
  ctx.stroke();

  // Category Tag (Top)
  spacing.letterSpacing = '5px';
  ctx.fillStyle = '#ffaa7b';
  ctx.font = '600 18px "Inter Variable", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.note.toUpperCase(), w / 2, 60);

  // High-Resolution Brand Logo (Center)
  drawLogo(ctx, spec.name, w / 2, 175, 52);

  // Technology Name (Below Logo)
  spacing.letterSpacing = '-0.5px';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 120, 60, 0.6)';
  ctx.shadowBlur = 22;
  ctx.font = '700 48px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.name, w / 2, 290);
  ctx.shadowBlur = 0;

  // Divider line
  const rule = ctx.createLinearGradient(60, 0, w - 60, 0);
  rule.addColorStop(0, 'rgba(255, 100, 40, 0)');
  rule.addColorStop(0.3, 'rgba(255, 120, 60, 0.9)');
  rule.addColorStop(0.7, 'rgba(255, 120, 60, 0.9)');
  rule.addColorStop(1, 'rgba(255, 100, 40, 0)');
  ctx.fillStyle = rule;
  ctx.fillRect(60, 325, w - 120, 2);

  // Footer: Index Number and Status Dot
  spacing.letterSpacing = '4px';
  ctx.fillStyle = 'rgba(255, 220, 200, 0.75)';
  ctx.font = '600 19px "Inter Variable", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(spec.index, 60, 385);

  ctx.beginPath();
  ctx.arc(w - 65, 378, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ff6025';
  ctx.shadowColor = '#ff6025';
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;
  spacing.letterSpacing = '0px';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

interface FadeMaterial {
  material: THREE.Material & { opacity: number };
  target: number;
}

interface PanelEntry {
  spec: PanelSpec;
  group: THREE.Group;
  mesh: THREE.Mesh;
  baseY: number;
  baseX: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  active: boolean;
}

export function AIUniverseCanvas({ progressRef }: AIUniverseCanvasProps) {
  const backMountRef = useRef<HTMLDivElement>(null);
  const frontMountRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(supportsWebGL);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const backMount = backMountRef.current;
    if (!backMount || !webgl) return;

    let backRenderer: THREE.WebGLRenderer;
    try {
      backRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebgl(false);
      return;
    }

    let frontRenderer: THREE.WebGLRenderer | null = null;
    const frontMount = frontMountRef.current;
    if (frontMount) {
      try {
        frontRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        frontRenderer = null;
      }
    }

    const baseDpr = devicePixelRatioCap();
    const attach = (renderer: THREE.WebGLRenderer, mount: HTMLElement, dpr: number) => {
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const canvas = renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      mount.appendChild(canvas);
    };
    attach(backRenderer, backMount, baseDpr);
    if (frontRenderer && frontMount) attach(frontRenderer, frontMount, Math.min(baseDpr, 1.25));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x4a0e06, 0.024);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 70);
    const frontCamera = camera.clone();
    frontCamera.layers.enable(LAYER_FRONT);
    camera.layers.enable(LAYER_BACK);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const trackGeometry = <T extends THREE.BufferGeometry>(geometry: T): T => {
      geometries.push(geometry);
      return geometry;
    };
    const trackMaterial = <T extends THREE.Material>(material: T): T => {
      materials.push(material);
      return material;
    };
    const trackTexture = (texture: THREE.Texture): THREE.Texture => {
      textures.push(texture);
      return texture;
    };

    // ---------------------------------------------------------------
    // Lighting: Dramatic Sci-Fi Environment (enabled on both layers)
    // ---------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x3a0805, 1.8);
    ambientLight.layers.enable(LAYER_BACK);
    ambientLight.layers.enable(LAYER_FRONT);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xff5518, 52, 26, 1.4);
    keyLight.position.set(0, -2.0, 3.0);
    keyLight.layers.enable(LAYER_BACK);
    keyLight.layers.enable(LAYER_FRONT);
    scene.add(keyLight);

    const haloLight = new THREE.PointLight(0xd060ff, 75, 22, 1.4);
    haloLight.position.set(0, 0.7, -0.8);
    haloLight.layers.enable(LAYER_BACK);
    haloLight.layers.enable(LAYER_FRONT);
    scene.add(haloLight);

    const glintLight = new THREE.DirectionalLight(0xffc296, 1.6);
    glintLight.position.set(2.5, 4, 3);
    glintLight.layers.enable(LAYER_BACK);
    glintLight.layers.enable(LAYER_FRONT);
    scene.add(glintLight);

    // ---------------------------------------------------------------
    // 3D Physical Technology Panels
    // ---------------------------------------------------------------
    const panels: PanelEntry[] = [];
    const boxDepth = 0.22;
    const boxGeometry = trackGeometry(new THREE.BoxGeometry(1, 1, boxDepth));

    PANELS.forEach((spec) => {
      const group = new THREE.Group();

      // Side/back material: Sleek dark obsidian metallic
      const sideMaterial = trackMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x181016,
          metalness: 0.65,
          roughness: 0.38,
          emissive: 0x481108,
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0,
        }),
      );

      // Front face material: MeshBasicMaterial so the face is self-illuminated and crystal-clear
      const frontMaterial = trackMaterial(
        new THREE.MeshBasicMaterial({
          map: trackTexture(panelTexture(spec)),
          transparent: true,
          opacity: 0,
        }),
      );

      // 6 faces: [+X, -X, +Y, -Y, +Z (front), -Z (back)]
      const cubeMaterials = [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        frontMaterial,
        sideMaterial,
      ];

      const mesh = new THREE.Mesh(boxGeometry, cubeMaterials);
      mesh.layers.set(spec.layer);
      group.add(mesh);
      scene.add(group);

      panels.push({
        spec,
        group,
        mesh,
        baseY: 0,
        baseX: 0,
        baseRotX: 0,
        baseRotY: 0,
        baseRotZ: 0,
        active: true,
      });
    });

    // ---------------------------------------------------------------
    // Procedural Portal Accretion & Singularity Shaders (LAYER_BACK)
    // Coordinated with the DOM halo to form the 3D radiant vortex
    // ---------------------------------------------------------------
    const portalVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const portalFragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uReveal;
      uniform float uConvergence;
      uniform float uOpacity;

      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        if (r > 1.0) discard;

        float angle = atan(p.y, p.x);

        // Swirling energy filaments
        float swirl = angle * 3.0 - uTime * 1.8 + r * 5.0;
        float filament = pow(0.5 + 0.5 * sin(swirl), 4.0);

        // Layer 1: Radiant Singularity Core
        float coreTightness = mix(14.0, 36.0, uConvergence);
        float core = exp(-r * coreTightness) * mix(1.8, 4.4, uConvergence);

        // Layer 2: Accretion Ring (thin saturated ring)
        float ringTargetR = mix(0.52, 0.16, uConvergence);
        float ringWidth = mix(28.0, 44.0, uConvergence);
        float ring = exp(-pow((r - ringTargetR) * ringWidth, 2.0));

        // Layer 3: Secondary Outer Corona
        float corona = exp(-pow((r - 0.72) * 12.0, 2.0)) * (0.35 + filament * 0.45) * (1.0 - uConvergence * 0.75);

        // Layer 4: Anamorphic Horizontal Streak (emerges during convergence)
        float streak = exp(-abs(p.y) * 130.0) * exp(-abs(p.x) * 2.4) * uConvergence * 2.4;

        // Palette interpolation: ruby/amber -> cosmic violet -> blazing warm-white
        vec3 colorBase = vec3(0.65, 0.08, 0.02);
        vec3 colorHot = vec3(1.0, 0.42, 0.12);
        vec3 colorViolet = vec3(0.76, 0.45, 1.0);
        vec3 colorWhite = vec3(1.0, 0.98, 0.94);

        vec3 col = mix(colorBase, colorHot, clamp(ring + filament * 0.4, 0.0, 1.0));
        col = mix(col, colorViolet, uConvergence * 0.85);
        col += colorWhite * core;
        col += colorViolet * streak;

        float edge = 1.0 - smoothstep(0.72, 1.0, r);
        float alpha = clamp((core * 1.2 + ring * 0.9 + corona * 0.5 + streak) * uReveal * uOpacity * edge, 0.0, 1.0);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    // ---------------------------------------------------------------
    // 3D Procedural Portal Singularity Mesh (LAYER_BACK)
    // ---------------------------------------------------------------
    const portalGeo = trackGeometry(new THREE.PlaneGeometry(3.8, 3.8));
    const portalUniforms = {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uConvergence: { value: 0 },
      uOpacity: { value: 0 },
    };

    const portalMaterial = trackMaterial(
      new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: portalUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      }),
    );

    const portalMesh = new THREE.Mesh(portalGeo, portalMaterial);
    portalMesh.position.set(0, 0.72, -0.85);
    portalMesh.layers.set(LAYER_BACK);
    scene.add(portalMesh);

    // ---------------------------------------------------------------
    // Dynamic Sweeping Energy Trails (The Hero Motion Element)
    // Silky smooth, continuous periodic Gaussian wave flow
    // ---------------------------------------------------------------
    const flowVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const flowFragmentShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uPulseFreq;
      uniform float uPhaseOffset;
      uniform float uFadeEnds;
      uniform vec3 uColorCore;
      uniform vec3 uColorHot;
      uniform vec3 uColorBase;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Continuous periodic wave along the curve (zero seams)
        float t1 = fract(vUv.x * uPulseFreq + uPhaseOffset - uTime * uSpeed);
        float wave1 = pow(sin(t1 * 3.14159265), 2.8);

        // Secondary high-speed plasma tracer pulse
        float t2 = fract(vUv.x * (uPulseFreq * 1.8) + uPhaseOffset * 1.5 - uTime * (uSpeed * 1.35) + 0.45);
        float wave2 = pow(sin(t2 * 3.14159265), 5.5) * 1.2;

        // Smooth circumference falloff
        float rim = 1.0 - abs(vUv.y - 0.5) * 2.0;
        rim = smoothstep(0.0, 1.0, rim);
        rim = pow(rim, 1.35);

        // Smooth end fade for open trajectories (prevents abrupt cutoff at endpoints)
        float endFade = 1.0;
        if (uFadeEnds > 0.5) {
          endFade = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
        }

        float intensity = (0.32 + wave1 * 2.8 + wave2 * 1.6) * rim * endFade;

        // Color ramping: ruby burgundy -> electric hot orange -> blazing warm-white core
        vec3 col = mix(uColorBase, uColorHot, clamp(wave1 * 1.3 + 0.2, 0.0, 1.0));
        col = mix(col, uColorCore, pow(wave1, 2.2) * rim);
        col += uColorCore * pow(wave2, 3.0) * 0.9;

        float alpha = clamp(intensity * uOpacity, 0.0, 1.0);
        gl_FragColor = vec4(col * intensity, alpha);
      }
    `;

    // ---------------------------------------------------------------
    // 1. Trajectory A: Celestial Arch Orbit (High celestial loop in LAYER_BACK)
    // Arches high above head & halo apex (y: 1.95, z: -1.8), swoops wide along flanks (x: ±3.2),
    // and sweeps the stage floor in the background (y: -2.45, z: 0.4).
    // Kept entirely in LAYER_BACK so it never bands or cuts the torso/waist.
    // ---------------------------------------------------------------
    const archPoints = [
      new THREE.Vector3( 0.00,  1.95, -1.8), // Arches high above head & halo apex
      new THREE.Vector3( 2.50,  1.10, -1.2), // Sweeps down past upper right flank
      new THREE.Vector3( 3.20, -0.20, -0.4), // Sweeps wide along right midground
      new THREE.Vector3( 2.20, -1.60,  0.2), // Swoops down toward lower right
      new THREE.Vector3( 0.00, -2.45,  0.4), // Low stage floor curve behind figure (LAYER_BACK)
      new THREE.Vector3(-2.20, -1.60,  0.2), // Sweeps up lower left
      new THREE.Vector3(-3.20, -0.20, -0.4), // Sweeps wide along left midground
      new THREE.Vector3(-2.50,  1.10, -1.2), // Climbs back up into upper halo behind left shoulder
    ];
    const archCurve = new THREE.CatmullRomCurve3(archPoints, true, 'catmullrom', 0.5);

    // Companion filament (slight offset for braided sci-fi beam look)
    const archFilamentPoints = archPoints.map(
      (p) => new THREE.Vector3(p.x * 1.025, p.y + 0.045, p.z - 0.05),
    );
    const archFilamentCurve = new THREE.CatmullRomCurve3(archFilamentPoints, true, 'catmullrom', 0.5);

    // ---------------------------------------------------------------
    // 2. Trajectory B: Flank & Low-Stage Orbit (Split 3D Depth Ordering)
    // Front segment: Sweeps in front of figure ONLY across the lower stage floor in front of shoes
    // at y = -2.35 (well below waist & knees), rendered in LAYER_FRONT.
    // Back segment: Sweeps behind the upper back, shoulders, and halo (y: 1.35), rendered in LAYER_BACK.
    // Waist, chest, shoulders, and head remain 100% clean and unbanded!
    // ---------------------------------------------------------------
    const flankFrontPoints = [
      new THREE.Vector3(-2.80, -1.30, 0.80), // Left flank entry near React/Spring Boot
      new THREE.Vector3(-1.60, -1.95, 1.40), // Descending toward stage floor
      new THREE.Vector3( 0.00, -2.35, 1.90), // Floor sweep in front of shoes (LAYER_FRONT)
      new THREE.Vector3( 1.60, -1.95, 1.40), // Ascending toward right flank
      new THREE.Vector3( 2.80, -1.30, 0.80), // Right flank exit near Three.js/Vite
    ];
    const flankFrontCurve = new THREE.CatmullRomCurve3(flankFrontPoints, false, 'catmullrom', 0.5);

    const flankFrontFilamentPoints = flankFrontPoints.map(
      (p) => new THREE.Vector3(p.x * 0.98, p.y + 0.035, p.z - 0.04),
    );
    const flankFrontFilamentCurve = new THREE.CatmullRomCurve3(flankFrontFilamentPoints, false, 'catmullrom', 0.5);

    const flankBackPoints = [
      new THREE.Vector3( 2.80, -1.30, 0.80), // Right flank entry
      new THREE.Vector3( 2.50, -0.10, -0.60), // Rising behind right cards
      new THREE.Vector3( 1.50,  0.85, -1.40), // Rising behind right shoulder
      new THREE.Vector3( 0.00,  1.35, -1.70), // Sweeping behind upper halo apex (LAYER_BACK)
      new THREE.Vector3(-1.50,  0.85, -1.40), // Sweeping behind left shoulder
      new THREE.Vector3(-2.50, -0.10, -0.60), // Descending behind left cards
      new THREE.Vector3(-2.80, -1.30, 0.80), // Left flank exit
    ];
    const flankBackCurve = new THREE.CatmullRomCurve3(flankBackPoints, false, 'catmullrom', 0.5);

    const flankBackFilamentPoints = flankBackPoints.map(
      (p) => new THREE.Vector3(p.x * 0.98, p.y + 0.035, p.z - 0.04),
    );
    const flankBackFilamentCurve = new THREE.CatmullRomCurve3(flankBackFilamentPoints, false, 'catmullrom', 0.5);

    // ---------------------------------------------------------------
    // 3. Trajectory C: Deep Cosmic Orbit (Deep space orbit behind scene)
    // ---------------------------------------------------------------
    const cosmicPoints = [
      new THREE.Vector3(-3.6,  0.30, -3.8),
      new THREE.Vector3(-2.0,  1.60, -4.0),
      new THREE.Vector3( 0.0,  2.05, -4.1),
      new THREE.Vector3( 2.2,  1.30, -3.9),
      new THREE.Vector3( 3.6, -0.10, -3.7),
      new THREE.Vector3( 2.1, -1.60, -3.5),
      new THREE.Vector3(-0.2, -2.10, -3.6),
      new THREE.Vector3(-2.4, -1.40, -3.7),
    ];
    const cosmicCurve = new THREE.CatmullRomCurve3(cosmicPoints, true, 'catmullrom', 0.5);

    interface RibbonDef {
      curve: THREE.CatmullRomCurve3;
      radius: number;
      speed: number;
      pulseFreq: number;
      phaseOffset?: number;
      fadeEnds?: boolean;
      colorCore: THREE.Color;
      colorHot: THREE.Color;
      colorBase: THREE.Color;
      layer: number;
      targetOpacity?: number;
    }

    const trailMaterials: {
      material: THREE.ShaderMaterial;
      targetOpacity: number;
      baseColors: {
        core: THREE.Color;
        hot: THREE.Color;
        base: THREE.Color;
      };
    }[] = [];

    const ribbons: RibbonDef[] = [
      // ── Trajectory A: Celestial Arch (LAYER_BACK) ──
      {
        curve: archCurve,
        radius: 0.022,
        speed: 0.32,
        pulseFreq: 2.0,
        colorCore: new THREE.Color(0xffeedd),
        colorHot: new THREE.Color(0xff5518),
        colorBase: new THREE.Color(0x991204),
        layer: LAYER_BACK,
        targetOpacity: 0.98,
      },
      {
        curve: archFilamentCurve,
        radius: 0.013,
        speed: 0.44,
        pulseFreq: 2.4,
        colorCore: new THREE.Color(0xfff2e6),
        colorHot: new THREE.Color(0xff7722),
        colorBase: new THREE.Color(0x881000),
        layer: LAYER_BACK,
        targetOpacity: 0.85,
      },
      {
        curve: archCurve,
        radius: 0.052,
        speed: 0.32,
        pulseFreq: 2.0,
        colorCore: new THREE.Color(0xff5518),
        colorHot: new THREE.Color(0xcc2200),
        colorBase: new THREE.Color(0x550800),
        layer: LAYER_BACK,
        targetOpacity: 0.38,
      },

      // ── Trajectory B: Flank & Floor Front Pass (LAYER_FRONT, floor sweep across shoes) ──
      {
        curve: flankFrontCurve,
        radius: 0.020,
        speed: -0.28,
        pulseFreq: 2.0,
        phaseOffset: 0.0,
        fadeEnds: true,
        colorCore: new THREE.Color(0xffeedd),
        colorHot: new THREE.Color(0xff5518),
        colorBase: new THREE.Color(0x991204),
        layer: LAYER_FRONT,
        targetOpacity: 0.98,
      },
      {
        curve: flankFrontFilamentCurve,
        radius: 0.012,
        speed: -0.38,
        pulseFreq: 2.4,
        phaseOffset: 0.0,
        fadeEnds: true,
        colorCore: new THREE.Color(0xfff2e6),
        colorHot: new THREE.Color(0xff7722),
        colorBase: new THREE.Color(0x881000),
        layer: LAYER_FRONT,
        targetOpacity: 0.85,
      },
      {
        curve: flankFrontCurve,
        radius: 0.048,
        speed: -0.28,
        pulseFreq: 2.0,
        phaseOffset: 0.0,
        fadeEnds: true,
        colorCore: new THREE.Color(0xff5518),
        colorHot: new THREE.Color(0xcc2200),
        colorBase: new THREE.Color(0x550800),
        layer: LAYER_FRONT,
        targetOpacity: 0.35,
      },

      // ── Trajectory B: Flank & Upper Halo Back Pass (LAYER_BACK, behind upper back & halo) ──
      {
        curve: flankBackCurve,
        radius: 0.020,
        speed: -0.28,
        pulseFreq: 2.0,
        phaseOffset: 0.5,
        fadeEnds: true,
        colorCore: new THREE.Color(0xffeedd),
        colorHot: new THREE.Color(0xff5518),
        colorBase: new THREE.Color(0x991204),
        layer: LAYER_BACK,
        targetOpacity: 0.98,
      },
      {
        curve: flankBackFilamentCurve,
        radius: 0.012,
        speed: -0.38,
        pulseFreq: 2.4,
        phaseOffset: 0.5,
        fadeEnds: true,
        colorCore: new THREE.Color(0xfff2e6),
        colorHot: new THREE.Color(0xff7722),
        colorBase: new THREE.Color(0x881000),
        layer: LAYER_BACK,
        targetOpacity: 0.85,
      },
      {
        curve: flankBackCurve,
        radius: 0.048,
        speed: -0.28,
        pulseFreq: 2.0,
        phaseOffset: 0.5,
        fadeEnds: true,
        colorCore: new THREE.Color(0xff5518),
        colorHot: new THREE.Color(0xcc2200),
        colorBase: new THREE.Color(0x550800),
        layer: LAYER_BACK,
        targetOpacity: 0.35,
      },

      // ── Trajectory C: Deep Cosmic Orbit (LAYER_BACK, deep atmospheric ring) ──
      {
        curve: cosmicCurve,
        radius: 0.018,
        speed: 0.16,
        pulseFreq: 1.6,
        colorCore: new THREE.Color(0xffddaa),
        colorHot: new THREE.Color(0xe04000),
        colorBase: new THREE.Color(0x881000),
        layer: LAYER_BACK,
        targetOpacity: 0.90,
      },
      {
        curve: cosmicCurve,
        radius: 0.042,
        speed: 0.16,
        pulseFreq: 1.6,
        colorCore: new THREE.Color(0xff5518),
        colorHot: new THREE.Color(0xbb2000),
        colorBase: new THREE.Color(0x440800),
        layer: LAYER_BACK,
        targetOpacity: 0.30,
      },
    ];

    const trailGroup = new THREE.Group();
    trailGroup.layers.enable(LAYER_BACK);
    trailGroup.layers.enable(LAYER_FRONT);
    scene.add(trailGroup);

    ribbons.forEach((def) => {
      const tubeGeo = trackGeometry(
        new THREE.TubeGeometry(def.curve, 260, def.radius, 12, def.curve.closed),
      );
      const shaderMat = trackMaterial(
        new THREE.ShaderMaterial({
          vertexShader: flowVertexShader,
          fragmentShader: flowFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: def.speed },
            uPulseFreq: { value: def.pulseFreq },
            uPhaseOffset: { value: def.phaseOffset ?? 0 },
            uFadeEnds: { value: def.fadeEnds ? 1.0 : 0.0 },
            uColorCore: { value: def.colorCore },
            uColorHot: { value: def.colorHot },
            uColorBase: { value: def.colorBase },
            uOpacity: { value: 0 },
          },
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );

      const tubeMesh = new THREE.Mesh(tubeGeo, shaderMat);
      tubeMesh.layers.set(def.layer);
      trailGroup.add(tubeMesh);

      trailMaterials.push({
        material: shaderMat,
        targetOpacity: def.targetOpacity ?? 0.95,
        baseColors: {
          core: def.colorCore.clone(),
          hot: def.colorHot.clone(),
          base: def.colorBase.clone(),
        },
      });
    });

    // ---------------------------------------------------------------
    // Fragments: small dark chips drifting at several depths
    // ---------------------------------------------------------------
    const fragmentGeometry = trackGeometry(new THREE.BoxGeometry(1, 1, 1));
    const fragmentMaterial = trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x240709,
        metalness: 0.52,
        roughness: 0.5,
        emissive: 0x481108,
        emissiveIntensity: 0.32,
        transparent: true,
        opacity: 0,
      }),
    );
    const fragments = FRAGMENTS.map((spec) => {
      const mesh = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
      mesh.layers.set(spec.layer);
      mesh.rotation.set(spec.rx, spec.ry, spec.rz);
      scene.add(mesh);
      return { spec, mesh };
    });

    // ---------------------------------------------------------------
    // Atmosphere: haze sheets for volumetric depth
    // ---------------------------------------------------------------
    const hazeWarm = trackTexture(
      radialTexture('rgba(255, 120, 60, 0.42)', 'rgba(180, 40, 50, 0.18)', 'rgba(30, 6, 24, 0)'),
    );
    const hazeViolet = trackTexture(
      radialTexture('rgba(180, 80, 255, 0.38)', 'rgba(110, 40, 200, 0.16)', 'rgba(20, 6, 40, 0)'),
    );
    const hazeSheets: FadeMaterial[] = [];
    const hazeSpecs = [
      { z: -6.4, sx: 28, sy: 16, opacity: 0.45, layer: LAYER_BACK },
      { z: -1.2, sx: 18, sy: 12, opacity: 0.22, layer: LAYER_BACK, violet: true },
      { z: 3.2, sx: 24, sy: 14, opacity: 0.14, layer: LAYER_FRONT },
    ];
    hazeSpecs.forEach((sheet) => {
      const material = trackMaterial(
        new THREE.MeshBasicMaterial({
          map: sheet.violet ? hazeViolet : hazeWarm,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: false,
        }),
      );
      const haze = new THREE.Mesh(trackGeometry(new THREE.PlaneGeometry(1, 1)), material);
      haze.scale.set(sheet.sx, sheet.sy, 1);
      haze.position.set(0, 0.2, sheet.z);
      haze.layers.set(sheet.layer);
      scene.add(haze);
      hazeSheets.push({ material, target: sheet.opacity });
    });

    // ---------------------------------------------------------------
    // Composition & Responsive Layout
    // ---------------------------------------------------------------
    let aspect = 1;
    let viewWidth = backMount.clientWidth || window.innerWidth;
    let viewHeight = backMount.clientHeight || window.innerHeight;
    let currentTier: 'wide' | 'tablet' | 'phone' = 'wide';

    const halfAt = (depth: number) =>
      Math.max(0.5, LAYOUT_CAM_Z - depth) * Math.tan((FOV * Math.PI) / 360);

    const layout = () => {
      currentTier = viewWidth >= 1100 ? 'wide' : viewWidth >= 768 ? 'tablet' : 'phone';
      const tier = currentTier;

      // On tall portrait screens, compensate trail Y so the front pass stays locked to the stage floor
      const aspectCompensation = aspect < 1.0 ? (1.0 - aspect) * -0.35 : 0;
      trailGroup.position.y = aspectCompensation;

      panels.forEach((entry) => {
        const box = entry.spec[tier];
        if (!box) {
          entry.active = false;
          entry.group.visible = false;
          return;
        }
        entry.active = true;
        entry.group.visible = true;

        const halfH = halfAt(entry.spec.depth);
        const halfW = halfH * aspect;
        const worldH = box.h * halfH;
        const worldW = worldH * PANEL_ASPECT;

        const edge = (FRAME_EDGE * halfW - worldW / 2) / halfW;
        const mid = tier === 'phone' ? 0.70 : 0.60;
        const innerEdge = (0.30 * halfW + worldW / 2) / halfW;
        const colX = box.anchor === 'outer' ? edge : box.anchor === 'mid' ? mid : innerEdge;
        const cx = box.side * colX;

        entry.baseX = cx * halfW;
        entry.baseY = box.y * halfH;
        entry.group.position.set(entry.baseX, entry.baseY, entry.spec.depth);

        // Store base rotations to avoid any frame-over-frame accumulation
        entry.baseRotX = -box.y * 0.14 + (box.extraRotX ?? 0);
        entry.baseRotY = -cx * 0.48 + (box.extraRotY ?? 0);
        entry.baseRotZ = cx * 0.04;
        entry.group.rotation.set(entry.baseRotX, entry.baseRotY, entry.baseRotZ);

        entry.mesh.scale.set(worldW, worldH, worldW * 0.22);
      });

      fragments.forEach(({ spec, mesh }) => {
        const s = halfAt(spec.z);
        const halfW = s * aspect;
        mesh.position.set(spec.x * halfW, spec.y * s, spec.z);
        const size = spec.s * s;
        mesh.scale.set(size, size * 0.9, size * 0.6);
      });
    };

    // ---------------------------------------------------------------
    // Filmic Inertial Pointer Parallax
    // ---------------------------------------------------------------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };
    if (finePointer && !reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    // ---------------------------------------------------------------
    // Render Frame with 4-Phase Cinematic Choreography
    // ---------------------------------------------------------------
    let elapsed = 0;
    let smoothProgress = 0.0;
    let trailTime = 0;
    let lastSmoothProgress = 0.0;

    const renderFrame = (progress: number, delta: number) => {
      elapsed += delta;
      const p = clamp01(progress);

      // Compute scroll-driven velocity boost for trails and particles
      const scrollVelocity = Math.abs(p - lastSmoothProgress) / Math.max(0.001, delta);
      lastSmoothProgress = p;
      const scrollSpeedBoost = Math.min(2.8, scrollVelocity * 0.42);

      // 4 Cinematic Story Scenes across the full scroll distance:
      // Scene A: Portal Awakening (0.00 -> 0.22)
      // Scene B: AI Universe Activation & Orbit (0.22 -> 0.52)
      // Scene C: Energy Convergence (0.52 -> 0.82)
      // Scene D: Transition into Find the Signal (0.82 -> 1.00)
      const phaseA = easeOutCubic(ramp(p, 0.00, 0.22));
      const phaseB = easeInOut(ramp(p, 0.22, 0.52));
      const convergence = easeInOut(ramp(p, 0.52, 0.82));
      const handoff = easeInOut(ramp(p, 0.82, 1.00));

      // Advance trail time with scroll-reactive acceleration and convergence surge
      trailTime += delta * (1.0 + scrollSpeedBoost + p * 0.5 + convergence * 1.5);

      // -------------------------------------------------------------
      // 1. Cinematic Camera Choreography across the 4 Scenes
      // Continuous, smooth forward dolly movement without abrupt jumps
      // -------------------------------------------------------------
      const baseCamZ = 8.2 - 0.70 * phaseA - 0.70 * phaseB - 1.30 * convergence - 1.00 * handoff;
      const baseCamY = 0.20 - 0.06 * phaseA - 0.04 * phaseB + 0.08 * convergence + 0.04 * handoff;

      const camX = pointer.x * 0.24 * (1.0 - handoff * 0.6);
      const camY = baseCamY + pointer.y * -0.05;
      const camZ = baseCamZ + pointer.y * -0.10;

      camera.position.set(camX, camY, camZ);

      // Camera lookAt target tracks smoothly toward the singularity core
      const targetLookY = -0.05 + 0.15 * convergence + 0.08 * handoff;
      camera.lookAt(pointer.x * 0.05 * (1.0 - handoff), targetLookY, -0.85);

      frontCamera.copy(camera);
      frontCamera.layers.set(LAYER_FRONT);

      // -------------------------------------------------------------
      // 2. Coordinated Lighting Surges & Atmosphere
      // -------------------------------------------------------------
      const trailGlowPulse = Math.sin(trailTime * 2.8) * 8.0;
      const revealFactor = phaseA * (1.0 - handoff * 0.85);

      // Key light: warm amber-orange shifts subtly to magenta during convergence
      const warmKey = new THREE.Color(0xff5518);
      const cosmicKey = new THREE.Color(0xd25288);
      keyLight.color.copy(warmKey).lerp(cosmicKey, convergence);
      keyLight.intensity = (34 + phaseA * 18 + phaseB * 14 + p * 12) * (1.0 - convergence * 0.55);

      // Halo / Singularity light: surges into brilliant violet-white during convergence
      const violetHalo = new THREE.Color(0xd060ff);
      const radiantSingularity = new THREE.Color(0xf6e8ff);
      haloLight.color.copy(violetHalo).lerp(radiantSingularity, convergence);
      haloLight.intensity = (48 + phaseA * 24 + phaseB * 18 + trailGlowPulse + convergence * 45) * (1.0 - handoff * 0.35);

      // Ambient light & fog: shifts from deep burgundy to cosmic indigo
      const warmAmbient = new THREE.Color(0x3a0805);
      const cosmicAmbient = new THREE.Color(0x0f0920);
      ambientLight.color.copy(warmAmbient).lerp(cosmicAmbient, convergence);

      const burgundyFog = new THREE.Color(0x4a0e06);
      const cosmicFog = new THREE.Color(0x080612);
      if (scene.fog) {
        scene.fog.color.copy(burgundyFog).lerp(cosmicFog, convergence);
      }

      fragmentMaterial.opacity = revealFactor * 0.95;

      // -------------------------------------------------------------
      // 3. 3D Procedural Portal Singularity
      // -------------------------------------------------------------
      portalUniforms.uTime.value = elapsed;
      portalUniforms.uReveal.value = phaseA;
      portalUniforms.uConvergence.value = convergence;
      portalUniforms.uOpacity.value = Math.min(1.0, phaseA * 1.2) * (1.0 - handoff * 0.15);

      // -------------------------------------------------------------
      // 4. Energy Trails with Dynamic Speed, Convergence Color & Vortex Pull
      // -------------------------------------------------------------
      trailGroup.scale.setScalar(1.0 - convergence * 0.15);
      trailMaterials.forEach(({ material, targetOpacity, baseColors }) => {
        material.uniforms.uTime.value = trailTime;
        material.uniforms.uOpacity.value = targetOpacity * revealFactor;

        material.uniforms.uColorCore.value.copy(baseColors.core).lerp(new THREE.Color(0xfff0fa), convergence);
        material.uniforms.uColorHot.value.copy(baseColors.hot).lerp(new THREE.Color(0xb5179e), convergence);
        material.uniforms.uColorBase.value.copy(baseColors.base).lerp(new THREE.Color(0x3a084a), convergence);
      });

      // -------------------------------------------------------------
      // 5. Floating Particles & Debris Drift
      // -------------------------------------------------------------
      fragments.forEach(({ spec, mesh }, index) => {
        const tumbleSpeed = 1.0 + scrollSpeedBoost * 0.75;
        mesh.rotation.x = spec.rx + Math.sin(elapsed * spec.spin + index) * 0.22;
        mesh.rotation.y = spec.ry + elapsed * spec.spin * tumbleSpeed;
        mesh.rotation.z = spec.rz + Math.cos(elapsed * spec.spin * 0.7 + index) * 0.18;
        mesh.position.y += Math.sin(elapsed * 0.35 + index * 1.5) * 0.001;

        // In Scene C & D, fragments drift into deep space, joining the distant cosmic starfield
        const cosmicDrift = convergence * (1.8 + index * 0.25) + handoff * 3.5;
        mesh.position.z = spec.z - cosmicDrift;
      });

      // Atmospheric haze sheets
      hazeSheets.forEach(({ material, target }) => {
        material.opacity = target * revealFactor;
      });

      // -------------------------------------------------------------
      // 6. 3D Technology Cards: Staggered Entry, Orbit & Portal Convergence
      // -------------------------------------------------------------
      panels.forEach((entry, index) => {
        if (!entry.active) return;

        // Subtle organic breathing idle
        const floatY = Math.sin(elapsed * 0.42 + index * 1.3) * 0.022;
        const floatRotY = Math.sin(elapsed * 0.32 + index * 0.9) * 0.016;
        const floatRotX = Math.cos(elapsed * 0.28 + index * 1.1) * 0.012;

        const parallaxDepthFactor = 0.04 * (1.2 + entry.spec.depth * 0.12);

        const box = entry.spec[currentTier] ?? entry.spec.wide;
        const anchor = box.anchor ?? 'outer';
        const side = box.side ?? (entry.baseX < 0 ? -1 : 1);

        // Standard amphitheater orbit offsets for Scene A and B
        let orbitX = 0;
        let orbitY = 0;
        let orbitZ = 0;
        let orbitTiltY = 0;
        let orbitTiltX = 0;

        if (anchor === 'outer') {
          // Foreground pillars (React, Three.js, Spring Boot, Vite)
          orbitX = side * (0.08 * phaseB);
          orbitZ = 0.22 * phaseB;
          orbitTiltY = -side * (0.08 * phaseB);
        } else if (anchor === 'mid') {
          // Midground pillars (Python, TypeScript)
          orbitX = side * (0.05 * phaseB);
          orbitY = 0.08 * Math.sin(phaseB * Math.PI);
          orbitZ = 0.20 * phaseB;
          orbitTiltY = -side * (0.05 * phaseB);
        } else {
          // Flank cards (Java, Applied AI, PostgreSQL, GSAP)
          orbitX = side * (0.03 * Math.cos(phaseB * Math.PI));
          orbitZ = -0.15 * phaseB;
        }

        if (entry.spec.depth < -2.0) {
          orbitZ -= 0.35 * phaseB;
        }

        // Scene C: Energy Convergence toward the portal center (0, 0.72, -0.85)
        const targetPullX = 0 - (entry.baseX + orbitX);
        const targetPullY = 0.72 - (entry.baseY + orbitY);
        const targetPullZ = -0.85 - (entry.spec.depth + orbitZ);

        const pullAmount = Math.pow(convergence, 1.6);
        const finalShiftX = orbitX + targetPullX * pullAmount * 0.82;
        const finalShiftY = orbitY + targetPullY * pullAmount * 0.82;
        const finalShiftZ = orbitZ + targetPullZ * pullAmount * 0.82;

        const finalTiltY = THREE.MathUtils.lerp(orbitTiltY, -side * 0.32, convergence);
        const finalTiltX = THREE.MathUtils.lerp(orbitTiltX, (0.72 - entry.baseY) * 0.12, convergence);

        // Staggered entry reveal across depth tiers (Scene A)
        let depthStagger = 0;
        if (entry.spec.depth > 0.5) depthStagger = 0.02; // foreground reveals first
        else if (entry.spec.depth > -1.2) depthStagger = 0.06; // midground
        else depthStagger = 0.10; // deep background

        const cardReveal = easeOutCubic(ramp(p, depthStagger, depthStagger + 0.16));
        const cardDissolve = easeInOut(ramp(p, 0.64, 0.80));
        const cardAlpha = cardReveal * (1.0 - cardDissolve);

        // Scaling down slightly as cards are absorbed into the vortex
        const pullScale = 1.0 - pullAmount * 0.32;
        entry.group.scale.setScalar(Math.max(0.001, pullScale));

        entry.group.position.x = entry.baseX + finalShiftX + pointer.x * parallaxDepthFactor;
        entry.group.position.y = entry.baseY + finalShiftY + floatY - pointer.y * (parallaxDepthFactor * 0.5);
        entry.group.position.z = entry.spec.depth + finalShiftZ;

        entry.group.rotation.x = entry.baseRotX + finalTiltX + floatRotX - pointer.y * 0.035;
        entry.group.rotation.y = entry.baseRotY + finalTiltY + floatRotY + pointer.x * 0.045;
        entry.group.rotation.z = entry.baseRotZ;

        const mats = entry.mesh.material as THREE.Material[];
        if (Array.isArray(mats)) {
          mats.forEach((m) => {
            m.opacity = cardAlpha;
          });
        }
      });

      backRenderer.render(scene, camera);
      frontRenderer?.render(scene, frontCamera);
    };

    const resize = () => {
      viewWidth = backMount.clientWidth || window.innerWidth;
      viewHeight = backMount.clientHeight || window.innerHeight;
      aspect = viewWidth / Math.max(1, viewHeight);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      frontCamera.aspect = aspect;
      frontCamera.updateProjectionMatrix();
      backRenderer.setSize(viewWidth, viewHeight);
      frontRenderer?.setSize(viewWidth, viewHeight);
      layout();
      if (reduced) {
        renderFrame(0.40, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // ---------------------------------------------------------------
    // Animation Loop with Filmic Damping
    // ---------------------------------------------------------------
    let visible = true;
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
          })
        : null;
    observer?.observe(backMount);

    let running = true;
    let frameId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      if (!running) return;
      const delta = Math.min(0.045, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      if (visible && !document.hidden) {
        // Filmic pointer inertia
        pointer.x += (pointer.tx - pointer.x) * 0.038;
        pointer.y += (pointer.ty - pointer.y) * 0.038;

        // Smooth scroll progress to eliminate wheel stepping (full 0.0 to 1.0 range)
        const targetProgress = progressRef?.current ?? 0.0;
        smoothProgress += (targetProgress - smoothProgress) * 0.14;

        renderFrame(smoothProgress, delta);
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      if (finePointer) window.removeEventListener('pointermove', onPointerMove);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());

      backRenderer.dispose();
      frontRenderer?.dispose();

      if (backMount.contains(backRenderer.domElement)) {
        backMount.removeChild(backRenderer.domElement);
      }
      if (frontMount && frontRenderer && frontMount.contains(frontRenderer.domElement)) {
        frontMount.removeChild(frontRenderer.domElement);
      }
    };
  }, [webgl, reduced, progressRef]);

  if (!webgl) {
    return (
      <div className="ai-universe__fallback" aria-hidden="true">
        <div className="ai-universe__fallback-ring" />
        <div className="ai-universe__fallback-ring" />
      </div>
    );
  }

  return (
    <>
      <div ref={backMountRef} className="ai-universe__canvas ai-universe__canvas--back" />
      <div ref={frontMountRef} className="ai-universe__canvas ai-universe__canvas--front" />
    </>
  );
}
