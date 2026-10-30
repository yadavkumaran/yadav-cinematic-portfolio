# Yadav Kumaran — Cinematic Engineering Portfolio

An immersive, editorial 3D developer portfolio engineered with **React 19**, **Three.js**, and **GSAP ScrollTrigger**. Designed around a unified cinematic narrative that blends WebGL atmospheric environments, monumental architectural typography, responsive spatial audio aesthetics, and continuous scroll storytelling.

---

## Cinematic Experience & Design Philosophy

Rather than static cards on a dark backdrop, the portfolio is structured as a continuous seven-act cinematic journey:

1. **Section 00 — Cinematic Intro Sequence:**  
   High-contrast monochrome boot sequence with audio cue simulation, dramatic letterboxing, and the emergence of the developer silhouette.
2. **Section 01 — Solar Hero & Fiery Moon Orbit:**  
   Art-directed burning celestial body with dynamic corona shaders, particle embers, and an interactive skill orbit reacting to pointer physics.
3. **Section 02 — Cosmic Singularity ("Find the Signal"):**  
   GPU-accelerated 1,000-particle field converging upon an optical anamorphic flare and accretion disc driven directly by user scroll velocity.
4. **Section 03 — Engineering Philosophy & Core Identity:**  
   High-legibility editorial typography presenting systems engineering values, architectural convictions, and developer tenets.
5. **Section 04 — AI Universe 3D Amphitheatre:**  
   Spatial 3D technology installation placing authentic tool architectures (PyTorch, TensorFlow, Hugging Face, LangChain, etc.) in a curving multi-tiered amphitheatre around the protagonist.
6. **Section 05 — Selected Architectural Case Studies:**  
   Interactive deep-dive project cards (Vaidhya, HeatGuard AI, BidLens, Hearth) featuring procedural SVG artworks and accessible modal inspection.
7. **Section 06 — Architectural Milestone Archive:**  
   Monumental 3D copper-illuminated exhibition celebrating academic excellence (9.55 GPA monument), patent innovations, and competitive triumphs.
8. **Section 07 — Editorial Outro & Signal Close:**  
   Warm paper-toned editorial portrait print with personal philosophy and direct contact conduits.

---

## Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Modern concurrent rendering and state lifecycle |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict type safety across all components and shaders |
| **3D & Shaders** | [Three.js 0.186](https://threejs.org/) | Direct WebGL canvas rendering, GLSL custom shaders, and geometry pipelines |
| **Motion & Scroll** | [GSAP 3.15](https://greensock.com/gsap/) + ScrollTrigger | Deterministic scroll-linked timelines, scrub animations, and camera motion |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS | Design system tokens, typography scales, and responsive layouts |
| **Typography** | `@fontsource-variable/inter`, `space-grotesk`, `instrument-serif` | Self-hosted high-performance variable fonts |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight vector iconography |
| **Bundler** | [Vite 8](https://vitejs.dev/) | Next-generation ESM dev server and optimized production rollup |

---

## Architecture & Directory Structure

```text
├── public/
│   ├── assets/
│   │   ├── favicon.svg             # Application SVG favicon
│   │   └── grain.jpg               # Seamless atmospheric film grain
│   └── images/
│       ├── hero-portrait.png       # Master hero artwork (1122x1402)
│       ├── hero-portrait.webp      # High-performance hero WebP
│       ├── hero-portrait-640.webp  # Mobile & blurred halo derivative
│       ├── yadav-standing-suit.png # Intro sequence protagonist cutout
│       ├── yadav-back-suit.png     # AI Universe central figure cutout
│       └── yadav-kumaran-portrait.png # Outro editorial portrait
├── src/
│   ├── components/
│   │   ├── navigation/             # Global header, navlinks, audio controls
│   │   ├── projects/               # Case study cards, procedural SVG art, modal dialogues
│   │   ├── scenes/                 # Full-screen section wrappers & scroll anchors
│   │   ├── ui/                     # Intro sequence, cinematic tour controller, dialogs
│   │   └── visual/                 # Three.js canvases, WebGL shaders, particle systems
│   ├── data/
│   │   ├── milestones.ts           # Academic, patent, and milestone data
│   │   └── portfolio.ts            # Personal profile, projects, and skills configuration
│   ├── styles/                     # Modular CSS for hero, scenes, milestones, and UI
│   ├── App.tsx                     # Main application tree & root layout
│   └── main.tsx                    # React DOM client entry point
├── .env.example                    # Environment variable template
├── .gitignore                      # Production-grade Git ignore manifest
├── PROJECT_CLEANUP_REPORT.md       # Full asset and security audit report
└── README.md                       # Repository documentation
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ or v24+ recommended)
- **Package Manager**: `npm` (bundled with Node.js)

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/cinematic-portfolio.git
cd cinematic-portfolio
npm install
```

### Development
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Verification & Linting
Validate TypeScript types and JSX syntax across the entire codebase:

```bash
npm run lint
```

### Production Build
Compile TypeScript and generate an optimized production distribution bundle in `dist/`:

```bash
npm run build
```

### Production Preview
Locally preview the built production bundle:

```bash
npm run preview
```

---

## Accessibility & Graceful Degradation

- **Reduced Motion:** Fully complies with `prefers-reduced-motion: reduce`. Fast transitions replace long camera travels, and orbital animations gently settle. Can be tested manually with the URL query `?motion=reduced`.
- **WebGL Fallback:** In low-power environments or on devices where WebGL 2.0 context is unavailable, canvases seamlessly degrade into high-contrast CSS gradient backdrops and vector typography without breaking the layout. Can be tested with `?webgl=off`.
- **Keyboard Navigation:** Full focus trap management in modal dialogues, Escape key dismissals, and keyboard accessible project drawer toggles.

---

## Asset Guidelines

- **Portraits:** Master images are stored as clean PNG cutouts with transparency. For optimal web delivery, derive matching WebP and 640px variants for mobile and halo layers.
- **Procedural Graphics:** Wherever possible, Three.js shaders and procedural SVG components are preferred over heavy video or bitmap textures, preserving a sub-second initial load.

---

## License

Personal portfolio repository. All rights reserved by **Yadav Kumaran**.  
Code architecture available for educational inspection.

