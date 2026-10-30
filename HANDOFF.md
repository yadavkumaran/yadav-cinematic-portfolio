# Portfolio handoff

## Experience

The portfolio is a continuous sequence of scenes: the fiery-moon hero, a shortened cosmic transition, developer identity, technical universe, four selected case studies, engineering principles, an achievements-and-growth timeline, the sepia portrait/personal scene, and a concise contact close. Project details open in an accessible dialog. The WebGL scenes have CSS fallbacks, and motion responds to reduced-motion preferences.

The selected-work grid features Vaidhya, HeatGuard AI, BidLens, and Hearth. KGB and the three studio experiments remain available in the compact project archive and through the hero orbit. The former standalone HeatGuard feature is no longer repeated after the project list.

Expertise is grouped in `src/data/portfolio.ts`. The database/infrastructure group is an explicit prompt because no verified tools in that category are currently listed. The growth timeline similarly marks education details, hackathons/awards, and milestones as requiring the owner's facts rather than inventing dates or achievements. The personal scene includes a prompt for a genuine interest outside software.

Project and profile content is configured in `src/data/portfolio.ts`. Two supplied-identity images are used: the hero composition at `public/images/hero-portrait.png` and a cropped sepia print of it in the closing scene. Project preview artwork is original procedural SVG (no stock photography).

## Hero portrait asset

The hero scene is one painted composition: portrait, burning moon, and lava field. It is rendered by `src/components/visual/HeroPortrait.tsx` and positioned in `src/styles/hero.css` (`.hero__portrait*`).

- `public/images/hero-portrait.png` — original supplied artwork (1122 × 1402), also the `<picture>` fallback.
- `public/images/hero-portrait.webp` / `hero-portrait-640.webp` — optimised derivatives used through `srcset` and by the blurred bleed layers.
- To swap in a new portrait, replace those three files with the same names and keep the 1122:1402 ratio (or update `aspect-ratio` in `.hero__portrait-frame` and the image dimensions), and regenerate both WebP files.
- Orbiting card positions are art-directed in `hero.css` under `.orbit__card[data-pos='…']` with tablet overrides; keep the centre clear so the face and moon stay visible.

## Cosmic transition

`src/components/visual/CosmicCanvas.tsx` composes the scene from layers rather than one blur:

- A single 12 × 12 world-space plane carries the light source — hot point, chromatic falloff, anamorphic streaks, accretion ring and soft spokes — so its optical size is identical at every aspect ratio.
- A 1,000-particle GPU field (420 on phones) with per-particle size, depth and seed-driven brightness converges on the core as scroll progress rises, then expands past the camera.
- A distant starfield gives parallax depth; a low-intensity nebula plane keeps the void from reading as flat black; the camera pushes in slightly with progress.
- Progress comes from the section's ScrollTrigger, so the scene is driven by the reader, never by a looping video.
- To retune the look, the shader constants in `bloomFragment` (core sharpness, streak length, ring radius) are all in world units. `reveal`/`exit` control when the light ignites and dies.

## Portrait outro

`site.portrait` points at `public/images/portrait-print.webp`, a 760 × 795 sepia crop of the supplied portrait generated from `hero-portrait.png` (crop box 250,220 → 900,900, mapped to `#181310`–`#e2d8c4`). With `data-mode="print"` the scene presents it as an editorial print on the paper background; leave `site.portrait` empty to fall back to the original vector illustration.

## Personalization before publishing

- Add a real email address, GitHub profile, and LinkedIn profile in `site`.
- Add institution/program dates, verified hackathons or awards, and dated milestones in the growth section.
- Replace the personal-interest prompt with a real detail about life beyond software.
- Add the actual databases and infrastructure tools used, if applicable, in `expertise`.
- Add real GitHub/live/case-study URLs to each project's `links` when available.
- Replace `public/images/portrait-print.webp` if you prefer a different crop or a different photograph; keep the 760:795 ratio or update `width`/`height` in `PortraitOutro.tsx`.
- Optionally add real project screenshots with each project's `image` field.
- Review the project descriptions, contributions, stack, and status labels for accuracy before publishing.

Empty contact and project URLs are intentionally omitted from the interface rather than rendered as dead or fabricated links.

## Verification

- `npm run lint` — passed.
- `npm run build` — passed (checked again after the art-direction pass).
- Browser checks — after the scene redesign, no horizontal overflow at 1440×900, 1024×768, 768×1024, 390×844, or 360×800 on the dev server.
- Hero/navigation clearance — measured card rectangles against the nav at 1024×768 and 834×1112; the top pair of cards was moved to 21% so they clear the navigation links.
- Selected work — four projects use a compact two-column desktop grid and stack cleanly on smaller screens; other projects remain in the archive.
- Cosmic scene — inspected at several scroll progresses on desktop and mobile in the production build; the light, particle convergence and copy all read without the previous grey wash, and no shader or console errors were logged.
- Keyboard — orbit navigation responds to arrow keys; project details open from the keyboard, close with Escape, and restore focus; the mobile navigation closes with Escape.
- Reduced motion and WebGL fallback — checked with `?motion=reduced` and `?webgl=off`; simulated context loss also switches both scenes to their CSS fallbacks.
- Browser console — no errors observed during the checked navigation and fallback flows.
- Hero portrait — checked at 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 834×1112, 768×1024, 414×896, 390×844, and 360×640: no card overlap with the face, copy, or rail, and no horizontal overflow. Image failure falls back to the warm gradient wash.

There is no test script or unit-test suite defined in `package.json`. The production build reports one 966.14 kB JavaScript chunk (273.56 kB gzip), above Vite's 500 kB advisory threshold. Three.js accounts for most of it; the honest next step is to lazy-load the two WebGL canvases, which is a bundle-size optimization, not a build failure.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run lint` for the TypeScript check and `npm run build` for the production build. Preview a production build with `npm run preview`.
