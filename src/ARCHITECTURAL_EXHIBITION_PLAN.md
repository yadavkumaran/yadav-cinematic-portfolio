# Section 06 — Cinematic Architectural Exhibition Plan

## 1. 3D Environment Architecture
- **Obsidian Satin Gallery Floor**: Smoked dark obsidian plane (`color: 0x07080c`, `roughness: 0.18`, `metalness: 0.88`) with subtle copper alignment grid (`#ff5520`, opacity 0.08) and specular reflection pools.
- **Architectural Material Palette**: Graphite, brushed dark titanium (`#0d0f16`, `#141822`), micro-chamfered edges with copper specular highlights (`#ff7a38`, `#ff5520`).
- **Illumination Architecture**:
  - Ambient base: Deep architectural studio tone (`#0e1017`, 0.35 intensity).
  - Zone spotlights: Dedicated overhead museum spotlights for each exhibit with custom volumetric cone meshes.
  - Dynamic Copper Spline: Continuous illuminated copper conduit running the full length of the exhibition floor.
  - Travelling Photon Light: Scroll-linked point light tracking along the conduit, casting real specular sheen on monuments as you pass.

## 2. Master Camera Journey
A single continuous camera path traversing 4 designated exhibition coordinates:
- **Zone 0 (Arrival & Orientation, 0.00 -> 0.16)**: Wide establishing shot down the long gallery corridor `(0, 3.2, 13) -> target (0, 1.2, 0)`.
- **Zone 1 (Academic Monument, 0.16 -> 0.42)**: Push-in and lateral pivot to `(-1.6, 1.8, 5.2) -> target (-0.4, 1.2, 0)`. Spotlight sweeps the dimensional 9.55 sculpture; side editorial plane reveals degree and SKCET credentials.
- **Zone 2 (Industry Bridge & Hackathons, 0.42 -> 0.68)**: Lateral glide along copper conduit to `(2.2, 2.0, 2.0) -> target (1.2, 1.0, -1.0)`. Conduits connect dual internship pylons (CodeAlpha & Emiglitz IoT) and light the Hackathon victory totems.
- **Zone 3 (Real Systems Spatial Architecture, 0.68 -> 0.94)**: Camera advances to `(0, 2.4, -3.2) -> target (0, 0.8, -6.5)`. Frames the 3D network node architecture (Vaidhiya IoT/Ollama network vs. BidLens document verification pipeline). Interactive focal shift between projects.
- **Zone 4 (Cinematic Exit, 0.94 -> 1.00)**: Ascends to `(0, 3.8, -8.0)` looking out toward Section 07.

## 3. The Four Milestone Scenes
1. **Scene 01: Entrance**: "A record of becoming." with ivory typography and ember italic glow. Traveling copper beacon and perspective corridor reveal.
2. **Scene 02: The Academic Monument**:
   - Sculptural 3D "9.55" extruded geometry with beveled chamfers, metallic finish, and overhead spotlight.
   - Pinned on a stepped architectural plinth with illuminated datum lines.
   - Accompanying right-side editorial plane for B.E. CSE (AI & ML), SKCET Coimbatore, 2025–2029 Year II, HSC SBOA, and core competencies.
3. **Scene 03: Industry Bridge & Hackathons**:
   - Dual architectural pylons linked by glowing copper conduit for CodeAlpha AI & Emiglitz IoT internships.
   - Sculptural hackathon pedestals with tiered lighting: Gold victories (PEC Hacks 4.0 Winner, Hackathon 360 Winner, SKCET Best Innovator, Intellitech 3rd Prize) and National Finalist entries.
4. **Scene 04: Real Systems Exhibition**:
   - Vaidhiya 3D node installation (ESP32 biometric sensor node, MQTT/SQLite broker hub, local Ollama crystalline core, ArogyaMap radar ring).
   - BidLens document pipeline installation (floating dossier sheets, clause extraction scanners, compliance verification output).
   - Interactive camera framing between systems with keyboard accessibility.
   - Streamlined secondary projects panel.

## 4. Integration of HTML & 3D
- Abolish heavy, opaque rectangular cards covering the 3D scene.
- Use architectural editorial overlays positioned on spatial thirds (left/right balanced against the 3D exhibits).
- Transparent backgrounds with frosted glass borders, copper index labels, and crisp typography.

## 5. Scroll & Transition Mechanics
- Pinning via `position: sticky; top: 0; height: 100svh;` with container `height: 480vh`.
- GSAP ScrollTrigger timeline with `scrub: 1.2` smoothly orchestrating camera lerp, spotlights, and staged text transitions.
- Synchronized with `CinematicTour` and reduced-motion compliant.

## 6. Target Files
- `src/components/visual/MilestoneArchiveCanvas.tsx`
- `src/components/scenes/MilestoneArchive.tsx`
- `src/styles/milestones.css`

