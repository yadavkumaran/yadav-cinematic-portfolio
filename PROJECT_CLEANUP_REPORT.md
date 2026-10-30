# Project Cleanup & GitHub Readiness Audit Report

**Date:** October 30, 2026  
**Project:** Yadav Kumaran — Cinematic Engineering Portfolio  
**Stack:** React 19, TypeScript, Three.js (WebGL), GSAP + ScrollTrigger, Tailwind CSS v4, Vite  
**Status:** Approved Cleanup Executed — Zero regressions, repository verified clean and GitHub-ready.

---

## Executive Summary

A comprehensive, non-destructive audit and approved cleanup was conducted across the workspace.

### Key Metrics
- **Initial Total Workspace Size:** ~595 MB (excluding `node_modules`)
- **Initial Public Directory Size:** 254.71 MB
- **Cleaned Public Directory Size:** **4.38 MB** (>98% reduction)
- **Trackable Repository Size for GitHub:** **4.94 MB** (excluding ignored `node_modules`, `dist`, `.scratch`, `cinematic-ui`)
- **Total Files Deleted (Approved):** 7 approved redundant/installer files + 1 duplicate in `images/` + empty directories removed
- **Preserved Concept Asset:** `Blood Moon Portrait.png` (SHA256: `47827C7C...`) preserved safely outside Git tracking in `.scratch/preserved_assets/` and the system artifact storage
- **Verification Status:** `npm run lint` (0 errors), `npm run build` (0 errors), live browser scroll verification (0 missing requests, 0 console errors)

---

## Asset Classification Matrix

### Category A: Essential Source & Configuration Files (MUST PRESERVE)
These files represent the core runtime code, styles, configurations, and build manifests.

| Path | Size | Role | Status |
| :--- | :--- | :--- | :--- |
| `src/` (all subfolders) | ~2.1 MB | Complete React components, 3D WebGL scenes, GSAP animations, styles, and portfolio data | **Preserved** |
| `index.html` | 1.26 KB | Application entry point with metadata, font preloads, and root mount container | **Preserved** |
| `package.json` | 812 B | Project metadata, build scripts (`dev`, `build`, `lint`, `preview`), and dependency manifests | **Preserved** |
| `package-lock.json` | 55.5 KB | Deterministic npm dependency lockfile | **Preserved** |
| `tsconfig.json` | 630 B | TypeScript project configuration (strict mode, target ES2022) | **Preserved** |
| `vite.config.ts` | 314 B | Vite build configuration with React and Tailwind plugins | **Preserved** |
| `HANDOFF.md` | 6.73 KB | Project design handoff documentation | **Preserved** |

---

### Category B: Actively Referenced Assets (MUST PRESERVE)
Every asset in this list was verified through automated code searches across all `.tsx`, `.ts`, `.css`, and `.html` files.

| Asset Path | Size | SHA-256 Hash Prefix | Active Reference Locations |
| :--- | :--- | :--- | :--- |
| `public/assets/favicon.svg` | 255 B | `12A840...` | `index.html:5` (`<link rel="icon">`) |
| `public/assets/grain.jpg` | 8.68 KB | `82BA7D...` | `src/styles/base.css:67`, `src/App.tsx:28` (Atmospheric film grain overlay) |
| `public/images/hero-portrait.webp` | 178.09 KB | `6E800C...` | `src/components/visual/HeroPortrait.tsx:18` (Primary hero portrait picture source) |
| `public/images/hero-portrait-640.webp` | 73.72 KB | `047BD0...` | `src/styles/hero.css:49,64`, `src/components/visual/HeroPortrait.tsx:15` (Hero portrait bleed/halo & mobile source) |
| `public/images/hero-portrait.png` | 2.08 MB | `FDF71C...` | `src/components/visual/HeroPortrait.tsx:22` (High-res PNG fallback for hero portrait) |
| `public/images/yadav-standing-suit.png` | 415.89 KB | `94BF02...` | `src/components/ui/CinematicIntro.tsx:254` (Standing developer figure in cinematic intro sequence) |
| `public/images/yadav-back-suit.png` | 426.41 KB | `B698C2...` | `src/components/scenes/AIUniverseScene.tsx:64` (Central protagonist figure in 3D AI-Universe amphitheatre) |
| `public/images/yadav-kumaran-portrait.png` | 1.23 MB | `5B7603...` | `src/data/portfolio.ts:71` -> `src/components/scenes/PortraitOutro.tsx:160` (Editorial signature portrait in outro) |

---

### Category C: Verified Duplicate Assets

| Duplicate File | Size | SHA-256 Hash | Identical Canonical File | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| `images/Ember Moon Wanderer.png` | 2.08 MB | `FDF71C1E5D870C782DA5ACEF33CE751826A2CF318A30A09C798F626AFE0739C4` | `public/images/hero-portrait.png` (exact 100% byte-for-byte duplicate) | Safe to delete; `public/images/hero-portrait.png` is the canonical asset referenced in code. |

---

### Category D: Unreferenced Assets (CLEANUP EXECUTED)

| File Path | File Size | Finding | Execution Status |
| :--- | :--- | :--- | :--- |
| `public/images/opencode-desktop-win-x64.exe` | **238.73 MB** | Windows desktop executable installer. Zero references in code. | **Permanently deleted** with user approval |
| `public/references/Reference-portfolio.mp4` | 3.70 MB | Development screen recording reference. | **Permanently deleted** with user approval |
| `public/references/Video-45889.mp4` | 3.64 MB | Video reference asset. | **Permanently deleted** with user approval |
| `public/images/cinematic-coat-suit.png` | 1.89 MB | Unreferenced cut-out portrait variant. | **Permanently deleted** with user approval |
| `public/images/hero-portrait-landscape.png` | 2.32 MB | Unreferenced landscape crop variant. | **Permanently deleted** with user approval |
| `public/images/portrait-print.webp` | 59.35 KB | Early experimental sepia crop. | **Permanently deleted** with user approval |
| `images/Ember Moon Wanderer.png` | 2.08 MB | Exact SHA-256 duplicate of `public/images/hero-portrait.png`. | **Permanently deleted** with user approval |
| `images/Blood Moon Portrait.png` | 2.00 MB | Concept portrait in root `images/`. | **Safely preserved outside Git** in `.scratch/preserved_assets/` and persistent artifact backup. Root folder `images/` safely removed. |

---

### Category E: Generated Files, Caches & Temporary Artifacts (SAFELY CLEANED)
These files are reproducible build artifacts or temporary test captures that should never be tracked in version control.

| Path | Size | Nature | Action |
| :--- | :--- | :--- | :--- |
| `dist/` | 256.26 MB | Vite production build output (regenerated via `npm run build`) | Excluded in `.gitignore` |
| `tsconfig.tsbuildinfo` | 1.28 KB | TypeScript incremental compilation cache (regenerated on build) | Removed & ignored |
| `screenshot_entrance.png` | 13.74 KB | Temporary Playwright/Puppeteer capture from milestone visual audit | Removed |
| `test_capture.png` | 5.03 KB | Temporary visual testing capture | Removed |
| `.scratch/` | 75.36 MB | Local development scripts, frame captures (`shots/`, `frames/`, `aiu/`), and logs | Excluded in `.gitignore` |

---

### Category F: External Cloned Subdirectories
- **`cinematic-ui/` (10.79 MB):**
  - Contains an embedded `.git/` folder, `.cursor/`, `.windsurf/`, documentation, and a 3.78 MB demo video (`docs/demo.mp4`).
  - **Issue:** If Git is initialized in the portfolio root, a directory containing its own `.git` directory will be treated as an unlinked git submodule or cause git tree warnings.
  - **Recommendation:** Exclude `cinematic-ui/` in `.gitignore`, or remove its internal `.git/` folder if keeping it purely as local markdown reference documentation.

---

### Category G: Security & Credential Audit
- **Environment variables:** Checked for `.env`, `.env.local`, `.env.production`. None were committed.
- **Secret Scanning:** Searched the entire codebase for API keys, private tokens, passwords, database URLs, and bearer tokens.
- **Finding:** **ZERO secrets, private keys, or credentials found.**
- **Action Taken:** Created `.env.example` with standard development placeholders for prospective analytics or backend endpoints.

---

## Action Plan & Recommendations for User Approval (Category H)

To achieve a lightweight, production-ready GitHub repository:

1. **Authorize Deletion of `public/images/opencode-desktop-win-x64.exe` (238.73 MB):**
   - This single file is an executable installer that inflates the repository size by 240 MB without any functional purpose.
2. **Authorize Removal of `images/` Root Folder (4.08 MB):**
   - `images/Ember Moon Wanderer.png` is an identical SHA-256 duplicate of `public/images/hero-portrait.png`.
   - `images/Blood Moon Portrait.png` is an unreferenced development variant.
3. **Authorize Cleanup of `public/references/` (7.34 MB):**
   - Two reference mp4 files that are not used by the web application.
4. **Authorize Removal of Unused Public Portrait Variants (4.27 MB):**
   - `cinematic-coat-suit.png`, `hero-portrait-landscape.png`, and `portrait-print.webp`.

**Result if Approved:** The repository clone size will drop from **~595 MB to ~14 MB**, cleanly beneath GitHub's recommended limits.

