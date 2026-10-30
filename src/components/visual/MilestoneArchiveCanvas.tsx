import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { devicePixelRatioCap, supportsWebGL } from '../../lib/webgl';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface MilestoneArchiveCanvasProps {
  progressRef: React.MutableRefObject<number>;
  activeZoneRef?: React.MutableRefObject<number>;
  activeProject?: string;
  className?: string;
}

/**
 * Creates precision architectural 3D extruded numerals for "9.55"
 * Solid, beveled geometry with smooth vertex normals and zero wireframe clutter.
 */
function createSculpturalNumerals() {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.38,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.045,
  };

  // --- Numeral '9' ---
  const s9 = new THREE.Shape();
  s9.moveTo(0.88, 1.62);
  s9.bezierCurveTo(0.88, 1.90, 0.68, 2.02, 0.44, 2.02);
  s9.bezierCurveTo(0.18, 2.02, 0.00, 1.84, 0.00, 1.54);
  s9.bezierCurveTo(0.00, 1.26, 0.18, 1.10, 0.44, 1.10);
  s9.lineTo(0.62, 1.10);
  s9.lineTo(0.62, 0.62);
  s9.bezierCurveTo(0.62, 0.36, 0.48, 0.22, 0.28, 0.22);
  s9.bezierCurveTo(0.14, 0.22, 0.04, 0.28, 0.00, 0.38);
  s9.lineTo(0.00, 0.10);
  s9.bezierCurveTo(0.10, 0.03, 0.22, 0.00, 0.34, 0.00);
  s9.bezierCurveTo(0.70, 0.00, 0.88, 0.28, 0.88, 0.62);
  s9.closePath();

  // Hole for '9' top bowl
  const h9 = new THREE.Path();
  h9.moveTo(0.62, 1.34);
  h9.lineTo(0.44, 1.34);
  h9.bezierCurveTo(0.32, 1.34, 0.24, 1.42, 0.24, 1.54);
  h9.bezierCurveTo(0.24, 1.66, 0.32, 1.76, 0.44, 1.76);
  h9.bezierCurveTo(0.56, 1.76, 0.62, 1.66, 0.62, 1.54);
  h9.closePath();
  s9.holes.push(h9);

  // --- Numeral '5' ---
  const create5 = () => {
    const s5 = new THREE.Shape();
    s5.moveTo(0.00, 1.98);
    s5.lineTo(0.82, 1.98);
    s5.lineTo(0.82, 1.74);
    s5.lineTo(0.26, 1.74);
    s5.lineTo(0.24, 1.20);
    s5.bezierCurveTo(0.34, 1.28, 0.48, 1.32, 0.62, 1.32);
    s5.bezierCurveTo(0.90, 1.32, 1.08, 1.06, 1.08, 0.66);
    s5.bezierCurveTo(1.08, 0.22, 0.84, 0.00, 0.48, 0.00);
    s5.bezierCurveTo(0.26, 0.00, 0.10, 0.08, 0.00, 0.20);
    s5.lineTo(0.00, 0.48);
    s5.bezierCurveTo(0.10, 0.34, 0.26, 0.26, 0.44, 0.26);
    s5.bezierCurveTo(0.66, 0.26, 0.80, 0.42, 0.80, 0.68);
    s5.bezierCurveTo(0.80, 0.92, 0.66, 1.08, 0.44, 1.08);
    s5.bezierCurveTo(0.32, 1.08, 0.22, 1.02, 0.16, 0.94);
    s5.lineTo(0.00, 1.02);
    s5.closePath();
    return s5;
  };

  const geo9 = new THREE.ExtrudeGeometry(s9, extrudeSettings);
  geo9.computeVertexNormals();

  const geo5A = new THREE.ExtrudeGeometry(create5(), extrudeSettings);
  geo5A.computeVertexNormals();

  const geo5B = new THREE.ExtrudeGeometry(create5(), extrudeSettings);
  geo5B.computeVertexNormals();

  // Decimal dot as an architectural beveled cube
  const geoDot = new THREE.BoxGeometry(0.26, 0.26, 0.38);

  return { geo9, geoDot, geo5A, geo5B };
}

/**
 * MilestoneArchiveCanvas
 *
 * Spatially Segregated 3D Exhibition Chapters:
 * - Chapter 01 (Academic Foundation): Monumental 9.55 sculpture on stepped titanium plinth with halo.
 * - Chapter 02 (Industry & Hackathons): Dual internship pylons and grounded victory totems.
 * - Chapter 03 (Real Systems): Systems exhibition pavilion (Vaidhya & BidLens).
 *
 * Each chapter has independent geometry, lighting lifecycle, and dedicated conduit paths
 * so no previous elements bleed or cross into adjacent chapters.
 */
export function MilestoneArchiveCanvas({
  progressRef,
  activeProject = 'vaidhya',
  className,
}: MilestoneArchiveCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(supportsWebGL);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !webgl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebgl(false);
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    renderer.setPixelRatio(devicePixelRatioCap());
    renderer.setClearColor(0x06070a, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.040);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 90);
    camera.position.set(0, 2.6, 24.0);
    camera.lookAt(0, 1.5, 14.0);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // ─────────────────────────────────────────────────────────────
    // ARCHITECTURAL PBR MATERIALS PALETTE
    // ─────────────────────────────────────────────────────────────
    const titaniumMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x6e788e,
        roughness: 0.25,
        metalness: 0.75,
      }),
    );

    // Warm Architectural Copper Bronze for 9.55 sculpture
    const sculptureMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xe89052,
        roughness: 0.16,
        metalness: 0.86,
        emissive: 0x481c08,
        emissiveIntensity: 0.35,
      }),
    );

    // Deep graphite basalt (plinth foundations)
    const basaltMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x121520,
        roughness: 0.35,
        metalness: 0.78,
      }),
    );

    // Chapter 01 Academic Halo & Datum Material
    const archHaloMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xff8844,
        emissive: 0xff5518,
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.9,
      }),
    );

    const academicDatumMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xff7a38,
        emissive: 0xee5518,
        emissiveIntensity: 0.90,
        roughness: 0.18,
        metalness: 0.95,
      }),
    );

    // Chapter 02 Victory & Industry Materials
    const goldVictoryMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xe6a845,
        emissive: 0x884812,
        emissiveIntensity: 0.45,
        roughness: 0.22,
        metalness: 0.90,
      }),
    );

    const industryCopperMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xff7a38,
        emissive: 0xee5518,
        emissiveIntensity: 0.60,
        roughness: 0.25,
        metalness: 0.85,
      }),
    );

    // Chapter 03 Systems Materials
    const frostedGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x141a26,
        roughness: 0.14,
        metalness: 0.25,
        transparent: true,
        opacity: 0.72,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
      }),
    );

    const systemsSensorMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xff3b20,
        emissive: 0xee2205,
        emissiveIntensity: 1.1,
        roughness: 0.1,
      }),
    );

    // Conduit materials (separated per chapter for clean transitions)
    const conduitMatAcademic = track(
      new THREE.MeshStandardMaterial({
        color: 0xff7a38,
        emissive: 0xee5518,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.9,
      }),
    );

    const conduitMatIndustry = track(
      new THREE.MeshStandardMaterial({
        color: 0xff7a38,
        emissive: 0xee5518,
        emissiveIntensity: 0.70,
        roughness: 0.2,
        metalness: 0.9,
      }),
    );

    const conduitMatSystems = track(
      new THREE.MeshStandardMaterial({
        color: 0xff7a38,
        emissive: 0xee5518,
        emissiveIntensity: 0.70,
        roughness: 0.2,
        metalness: 0.9,
      }),
    );

    // ─────────────────────────────────────────────────────────────
    // STUDIO ILLUMINATION ARCHITECTURE
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x141824, 0.50);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff9955, 1.4);
    keyLight.position.set(8, 14, 12);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x404a64, 0.75);
    fillLight.position.set(-10, 10, 0);
    scene.add(fillLight);

    // Dedicated Chapter 01 (Academic 9.55) Lights
    const academicSpot = new THREE.SpotLight(0xffcaa0, 0.0, 24, Math.PI / 3.8, 0.35, 1.1);
    academicSpot.position.set(-3.2, 5.8, 6.5);
    academicSpot.target.position.set(-4.6, 0.2, 0.8);
    scene.add(academicSpot);
    scene.add(academicSpot.target);

    const academicFill = new THREE.PointLight(0xffaa66, 0.0, 12, 1.4);
    academicFill.position.set(-3.5, 1.2, 3.8);
    scene.add(academicFill);

    const academicRim = new THREE.PointLight(0xff7733, 0.0, 8, 1.6);
    academicRim.position.set(-5.3, 1.8, -0.6);
    scene.add(academicRim);

    // Dedicated Chapter 02 (Industry & Hackathons) Lights
    const hackathonSpot = new THREE.SpotLight(0xffaa55, 0.0, 24, Math.PI / 4, 0.45, 1.2);
    hackathonSpot.position.set(4.2, 8.5, -8.0);
    hackathonSpot.target.position.set(4.2, 0.8, -8.0);
    scene.add(hackathonSpot);
    scene.add(hackathonSpot.target);

    const industryFill = new THREE.PointLight(0xff9955, 0.0, 14, 1.4);
    industryFill.position.set(3.0, 2.5, -5.0);
    scene.add(industryFill);

    // Dedicated Chapter 03 (Real Systems) Lights
    const systemsSpot = new THREE.SpotLight(0xff7733, 0.0, 26, Math.PI / 3.5, 0.4, 1.2);
    systemsSpot.position.set(0, 9.5, -20.0);
    systemsSpot.target.position.set(0, 0.8, -20.0);
    scene.add(systemsSpot);
    scene.add(systemsSpot.target);

    const systemsFill = new THREE.PointLight(0xff6a28, 0.0, 16, 1.4);
    systemsFill.position.set(0, 3.0, -16.0);
    scene.add(systemsFill);

    // Dynamic photon light tracking along active chapter conduit
    const timelineLight = new THREE.PointLight(0xff6a28, 0.0, 10, 1.8);
    scene.add(timelineLight);

    // ─────────────────────────────────────────────────────────────
    // SATIN OBSIDIAN FLOOR WITH ACCENT GUIDES
    // ─────────────────────────────────────────────────────────────
    const floorGeo = track(new THREE.PlaneGeometry(70, 100, 1, 1));
    const floorMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x07090e,
        roughness: 0.18,
        metalness: 0.88,
      }),
    );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -2.4, -4);
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(64, 64, 0xff5a20, 0x141824);
    gridHelper.position.set(0, -2.38, -4);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.10;
    scene.add(gridHelper);

    // ─────────────────────────────────────────────────────────────
    // CHAPTER 01: THE ACADEMIC MONUMENT (LOCATED AT x = -4.6, z = 0.8)
    // ─────────────────────────────────────────────────────────────
    const academicGroup = new THREE.Group();
    academicGroup.position.set(-4.6, 0.3, 0.8);
    scene.add(academicGroup);

    // Stepped Architectural Base
    const plinthLowerGeo = track(new THREE.BoxGeometry(4.8, 0.4, 1.8));
    const plinthLower = new THREE.Mesh(plinthLowerGeo, basaltMat);
    plinthLower.position.set(0, -1.5, 0);
    academicGroup.add(plinthLower);

    const plinthDatumGeo = track(new THREE.BoxGeometry(4.5, 0.04, 1.55));
    const plinthDatum = new THREE.Mesh(plinthDatumGeo, academicDatumMat);
    plinthDatum.position.set(0, -1.28, 0);
    academicGroup.add(plinthDatum);

    const plinthUpperGeo = track(new THREE.BoxGeometry(4.2, 0.35, 1.4));
    const plinthUpper = new THREE.Mesh(plinthUpperGeo, titaniumMat);
    plinthUpper.position.set(0, -1.08, 0);
    academicGroup.add(plinthUpper);

    // Architectural halo structure framing the 9.55 sculpture
    const archHaloGeo = track(new THREE.TorusGeometry(2.35, 0.038, 16, 64));
    const archHaloMesh = new THREE.Mesh(archHaloGeo, archHaloMat);
    archHaloMesh.position.set(0, 0.15, -0.45);
    academicGroup.add(archHaloMesh);

    // Polished 3D Sculptural Extruded Numerals "9.55"
    const { geo9, geoDot, geo5A, geo5B } = createSculpturalNumerals();
    track(geo9);
    track(geoDot);
    track(geo5A);
    track(geo5B);

    const num9 = new THREE.Mesh(geo9, sculptureMat);
    num9.position.set(-1.40, -0.84, 0.1);

    const numDot = new THREE.Mesh(geoDot, academicDatumMat);
    numDot.position.set(-0.40, -0.74, 0.1);

    const num5A = new THREE.Mesh(geo5A, sculptureMat);
    num5A.position.set(-0.08, -0.84, 0.1);

    const num5B = new THREE.Mesh(geo5B, sculptureMat);
    num5B.position.set(1.02, -0.84, 0.1);

    academicGroup.add(num9);
    academicGroup.add(numDot);
    academicGroup.add(num5A);
    academicGroup.add(num5B);

    // ─────────────────────────────────────────────────────────────
    // CHAPTER 02: INDUSTRY BRIDGE & HACKATHONS (LOCATED AT x = 4.2, z = -8.0)
    // Clean, grounded architectural composition — no floating eye-level conduits
    // ─────────────────────────────────────────────────────────────
    const industryGroup = new THREE.Group();
    industryGroup.position.set(4.2, 0, -8.0);
    scene.add(industryGroup);

    // Shared foundational floor plinth grounding the industry installation
    const industryBaseGeo = track(new THREE.BoxGeometry(7.2, 0.25, 4.4));
    const industryBase = new THREE.Mesh(industryBaseGeo, basaltMat);
    industryBase.position.set(1.0, -2.25, 0.4);
    industryGroup.add(industryBase);

    // --- Internship Pylons ---
    // Pylon 1: CodeAlpha AI (Virtual Internship)
    const pylonA_Geo = track(new THREE.BoxGeometry(1.2, 3.4, 0.8));
    const pylonA = new THREE.Mesh(pylonA_Geo, titaniumMat);
    pylonA.position.set(-1.4, -0.6, 1.2);
    industryGroup.add(pylonA);

    // Sleek architectural sensor cap seated atop Pylon A
    const aiCrystalGeo = track(new THREE.OctahedronGeometry(0.24, 0));
    const aiCrystal = new THREE.Mesh(aiCrystalGeo, industryCopperMat);
    aiCrystal.position.set(-1.4, 1.25, 1.2);
    industryGroup.add(aiCrystal);

    // Pylon 2: Emiglitz Technologies (IoT & Hardware)
    const pylonB_Geo = track(new THREE.BoxGeometry(1.2, 3.0, 0.8));
    const pylonB = new THREE.Mesh(pylonB_Geo, titaniumMat);
    pylonB.position.set(0.4, -0.8, 1.6);
    industryGroup.add(pylonB);

    const waferGeo = track(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16));
    const waferMesh = new THREE.Mesh(waferGeo, industryCopperMat);
    waferMesh.position.set(0.4, 0.82, 1.6);
    industryGroup.add(waferMesh);

    // Grounded floor conduit channel between pylons
    const groundConduitGeo = track(new THREE.BoxGeometry(2.0, 0.04, 0.08));
    const groundConduit = new THREE.Mesh(groundConduitGeo, industryCopperMat);
    groundConduit.position.set(-0.5, -2.1, 1.4);
    industryGroup.add(groundConduit);

    // --- Hackathon Victory Totems ---
    // Monolith 1: PEC Hacks 4.0 Winner
    const pecTotemGeo = track(new THREE.BoxGeometry(1.3, 4.2, 0.6));
    const pecTotem = new THREE.Mesh(pecTotemGeo, titaniumMat);
    pecTotem.position.set(2.0, -0.2, 0.2);
    industryGroup.add(pecTotem);

    const pecCrownGeo = track(new THREE.BoxGeometry(1.34, 0.25, 0.64));
    const pecCrown = new THREE.Mesh(pecCrownGeo, goldVictoryMat);
    pecCrown.position.set(2.0, 1.95, 0.2); // cleanly seated atop totem
    industryGroup.add(pecCrown);

    // Monolith 2: International Level Hackathon 360° 4.0 Winner
    const h360TotemGeo = track(new THREE.BoxGeometry(1.1, 3.6, 0.55));
    const h360Totem = new THREE.Mesh(h360TotemGeo, titaniumMat);
    h360Totem.position.set(3.2, -0.5, -0.6);
    industryGroup.add(h360Totem);

    const h360CrownGeo = track(new THREE.BoxGeometry(1.14, 0.22, 0.59));
    const h360Crown = new THREE.Mesh(h360CrownGeo, goldVictoryMat);
    h360Crown.position.set(3.2, 1.35, -0.6);
    industryGroup.add(h360Crown);

    // Monolith 3: SKCET Best Innovator
    const skcetTotemGeo = track(new THREE.BoxGeometry(1.0, 3.0, 0.5));
    const skcetTotem = new THREE.Mesh(skcetTotemGeo, basaltMat);
    skcetTotem.position.set(0.8, -0.8, -0.8);
    industryGroup.add(skcetTotem);

    // National Finalist Pedestal (Smart India Hackathon SIH)
    const sihPedestalGeo = track(new THREE.CylinderGeometry(0.45, 0.55, 2.2, 16));
    const sihPedestal = new THREE.Mesh(sihPedestalGeo, titaniumMat);
    sihPedestal.position.set(3.8, -1.1, 1.0);
    industryGroup.add(sihPedestal);

    // ─────────────────────────────────────────────────────────────
    // CHAPTER 03: REAL SYSTEMS EXHIBITION (LOCATED AT z = -20.0)
    // ─────────────────────────────────────────────────────────────
    const systemsGroup = new THREE.Group();
    systemsGroup.position.set(0, 0, -20.0);
    scene.add(systemsGroup);

    const sysFloorPlinthGeo = track(new THREE.BoxGeometry(8.5, 0.25, 4.2));
    const sysFloorPlinth = new THREE.Mesh(sysFloorPlinthGeo, basaltMat);
    sysFloorPlinth.position.set(0, -2.25, 0);
    systemsGroup.add(sysFloorPlinth);

    // --- System A: Vaidhiya (Rural Telemedicine & Disease Surveillance) ---
    const vaidhyaGroup = new THREE.Group();
    vaidhyaGroup.position.set(-2.8, 0, 0);
    systemsGroup.add(vaidhyaGroup);

    const vBaseGeo = track(new THREE.BoxGeometry(2.0, 2.2, 1.4));
    const vBase = new THREE.Mesh(vBaseGeo, titaniumMat);
    vBase.position.set(0, -1.1, 0);
    vaidhyaGroup.add(vBase);

    const sensorRingGeo = track(new THREE.TorusGeometry(0.55, 0.05, 16, 32));
    const sensorRing = new THREE.Mesh(sensorRingGeo, systemsSensorMat);
    sensorRing.rotation.x = Math.PI / 2;
    sensorRing.position.set(0, 0.1, 0);
    vaidhyaGroup.add(sensorRing);

    const ollamaCoreGeo = track(new THREE.IcosahedronGeometry(0.40, 0));
    const ollamaCore = new THREE.Mesh(ollamaCoreGeo, industryCopperMat);
    ollamaCore.position.set(0, 0.85, 0);
    vaidhyaGroup.add(ollamaCore);

    const radarGeo = track(new THREE.RingGeometry(0.75, 0.90, 32));
    const radarMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xff7a38,
        transparent: true,
        opacity: 0.40,
        side: THREE.DoubleSide,
      }),
    );
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.rotation.x = Math.PI / 2;
    radarMesh.position.set(0, -0.05, 0);
    vaidhyaGroup.add(radarMesh);

    // --- System B: BidLens (GeM Bid Compliance Verification) ---
    const bidlensGroup = new THREE.Group();
    bidlensGroup.position.set(2.8, 0, 0);
    systemsGroup.add(bidlensGroup);

    const bBaseGeo = track(new THREE.BoxGeometry(2.0, 2.2, 1.4));
    const bBase = new THREE.Mesh(bBaseGeo, titaniumMat);
    bBase.position.set(0, -1.1, 0);
    bidlensGroup.add(bBase);

    const docGeo = track(new THREE.BoxGeometry(1.2, 1.5, 0.04));
    const doc1 = new THREE.Mesh(docGeo, frostedGlassMat);
    doc1.position.set(-0.25, 0.6, -0.15);
    doc1.rotation.y = 0.15;
    bidlensGroup.add(doc1);

    const doc2 = new THREE.Mesh(docGeo, frostedGlassMat);
    doc2.position.set(0.05, 0.75, 0.05);
    doc2.rotation.y = -0.1;
    bidlensGroup.add(doc2);

    const doc3 = new THREE.Mesh(docGeo, titaniumMat);
    doc3.position.set(0.25, 0.9, 0.25);
    doc3.rotation.y = 0.08;
    bidlensGroup.add(doc3);

    const scannerBeamGeo = track(new THREE.BoxGeometry(1.6, 0.02, 0.8));
    const scannerBeam = new THREE.Mesh(scannerBeamGeo, industryCopperMat);
    scannerBeam.position.set(0, 0.75, 0.05);
    bidlensGroup.add(scannerBeam);

    // ─────────────────────────────────────────────────────────────
    // CHAPTER-SPECIFIC FLOOR CONDUITS
    // Segregated so copper lines never cross diagonally behind cards
    // ─────────────────────────────────────────────────────────────
    // Conduit 01: Entrance through Academic Monument
    const academicSpline = [
      new THREE.Vector3(0.0, -2.25, 24.0),
      new THREE.Vector3(0.0, -2.25, 14.0),
      new THREE.Vector3(-2.2, -2.25, 8.0),
      new THREE.Vector3(-4.6, -2.25, 0.8),
    ];
    const academicCurve = new THREE.CatmullRomCurve3(academicSpline);
    const academicConduitGeo = track(new THREE.TubeGeometry(academicCurve, 64, 0.016, 8, false));
    const academicConduit = new THREE.Mesh(academicConduitGeo, conduitMatAcademic);
    scene.add(academicConduit);

    // Conduit 02: Industry & Hackathon Gallery Floor Line
    // Cleanly routed on the right spatial flank to never cross under text
    const industrySpline = [
      new THREE.Vector3(2.0, -2.25, -2.0),
      new THREE.Vector3(3.2, -2.25, -5.0),
      new THREE.Vector3(4.2, -2.25, -8.0),
    ];
    const industryCurve = new THREE.CatmullRomCurve3(industrySpline);
    const industryConduitGeo = track(new THREE.TubeGeometry(industryCurve, 32, 0.016, 8, false));
    const industryConduit = new THREE.Mesh(industryConduitGeo, conduitMatIndustry);
    scene.add(industryConduit);

    // Conduit 03: Systems Exhibition Hub Distribution
    const systemsSpline = [
      new THREE.Vector3(0.0, -2.25, -14.0),
      new THREE.Vector3(0.0, -2.25, -18.0),
      new THREE.Vector3(0.0, -2.25, -20.0),
    ];
    const systemsCurve = new THREE.CatmullRomCurve3(systemsSpline);
    const systemsConduitGeo = track(new THREE.TubeGeometry(systemsCurve, 32, 0.016, 8, false));
    const systemsConduit = new THREE.Mesh(systemsConduitGeo, conduitMatSystems);
    scene.add(systemsConduit);

    // Dynamic photon travelling pulse
    const pulseGeo = track(new THREE.SphereGeometry(0.10, 16, 16));
    const pulseMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);

    const pulseGlowGeo = track(new THREE.SphereGeometry(0.24, 16, 16));
    const pulseGlowMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xff6622,
        transparent: true,
        opacity: 0.5,
      }),
    );
    const pulseGlow = new THREE.Mesh(pulseGlowGeo, pulseGlowMat);
    scene.add(pulseGlow);

    // ─────────────────────────────────────────────────────────────
    // ATMOSPHERIC DUST MOTES
    // ─────────────────────────────────────────────────────────────
    const particleCount = 140;
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 1.2;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      particleVel[i * 3 + 0] = (Math.random() - 0.5) * 0.0016;
      particleVel[i * 3 + 1] = Math.random() * 0.0022 + 0.0006;
      particleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.0016;
    }

    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = track(
      new THREE.PointsMaterial({
        color: 0xffb380,
        size: 0.040,
        transparent: true,
        opacity: 0.30,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Initial state setup: everything starts clean
    academicGroup.visible = false;
    academicConduit.visible = false;
    industryGroup.visible = false;
    industryConduit.visible = false;
    systemsGroup.visible = false;
    systemsConduit.visible = false;

    // ─────────────────────────────────────────────────────────────
    // RESIZE OBSERVER
    // ─────────────────────────────────────────────────────────────
    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    onResize();

    // ─────────────────────────────────────────────────────────────
    // CAMERA CHOREOGRAPHY & RAF LOOP
    // ─────────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();
    let currentT = 0;

    const currentCamPos = new THREE.Vector3(0, 2.6, 24.0);
    const currentCamTarget = new THREE.Vector3(0, 1.5, 14.0);

    const render = () => {
      rafId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      // Master scroll progress
      const targetT = reduced ? 0.3 : Math.max(0, Math.min(1, progressRef.current));
      currentT += (targetT - currentT) * 0.085;

      // ───────────────────────────────────────────────────────────
      // STRICT CHAPTER SCENE LIFECYCLE & VISIBILITY ISOLATION
      // ───────────────────────────────────────────────────────────
      // Zone 0 & 1: Entrance & Academic (0.00 -> 0.49)
      const inAcademicZone = currentT >= 0.12 && currentT < 0.49;
      academicGroup.visible = inAcademicZone;
      academicConduit.visible = currentT < 0.49;

      // Zone 2: Industry & Hackathons (0.48 -> 0.76)
      const inIndustryZone = currentT >= 0.47 && currentT < 0.76;
      industryGroup.visible = inIndustryZone;
      industryConduit.visible = inIndustryZone;

      // Zone 3: Real Systems Exhibition (0.74 -> 1.00)
      const inSystemsZone = currentT >= 0.73;
      systemsGroup.visible = inSystemsZone;
      systemsConduit.visible = inSystemsZone;

      // ── CAMERA PATH CHOREOGRAPHY ──
      const desiredCamPos = new THREE.Vector3();
      const desiredCamTarget = new THREE.Vector3();

      if (currentT < 0.16) {
        // ZONE 0: ENTRANCE CORRIDOR WIDE SHOT (0.00 -> 0.16)
        const p = currentT / 0.16;
        desiredCamPos.set(0, 2.6 - p * 0.3, 24.0 - p * 5.0);
        desiredCamTarget.set(0, 1.5 - p * 0.2, 14.0);

        academicSpot.intensity = 0.0;
        academicFill.intensity = 0.0;
        academicRim.intensity = 0.0;
        timelineLight.intensity = 0.0;
      } else if (currentT < 0.48) {
        // ZONE 1: ACADEMIC MONUMENT FOCAL SHOT (0.16 -> 0.48)
        const p = (currentT - 0.16) / 0.32;
        const camX = -2.0 * p;
        const camY = 2.2 - p * 0.3;
        const camZ = 19.0 - p * 12.8; // settles at z = 6.2
        desiredCamPos.set(camX, camY, camZ);

        const targetP = Math.min(1, p * 1.35);
        desiredCamTarget.set(
          -4.6 * targetP,
          1.3 - targetP * 1.0,
          14.0 - targetP * 13.2,
        );

        // Lighting transitions
        if (currentT < 0.42) {
          academicSpot.intensity = Math.min(6.5, p * 7.5);
          academicFill.intensity = Math.min(3.2, p * 3.8);
          academicRim.intensity = Math.min(2.5, p * 2.8);
          sculptureMat.emissiveIntensity = 0.35;
          archHaloMat.emissiveIntensity = 0.75;
        } else {
          // Graceful fadeout when departing Zone 1
          const fadeOut = Math.max(0, (0.48 - currentT) / 0.06);
          academicSpot.intensity = 6.5 * fadeOut;
          academicFill.intensity = 3.2 * fadeOut;
          academicRim.intensity = 2.5 * fadeOut;
          sculptureMat.emissiveIntensity = 0.35 * fadeOut;
          archHaloMat.emissiveIntensity = 0.75 * fadeOut;
        }

        timelineLight.intensity = 2.5;
      } else if (currentT < 0.74) {
        // ZONE 2: INDUSTRY BRIDGE & HACKATHONS (0.48 -> 0.74)
        // Camera glides across to frame the Industry & Hackathon chapter
        const p = (currentT - 0.48) / 0.26;
        const camX = -2.0 + p * 4.0; // from -2.0 to 2.0
        const camY = 1.9 + p * 0.2;
        const camZ = 6.2 - p * 9.2; // reaches -3.0
        desiredCamPos.set(camX, camY, camZ);
        desiredCamTarget.set(4.2, 0.6, -8.0);

        // Industry lighting lifecycle
        if (p < 0.25) {
          const fadeIn = p / 0.25;
          hackathonSpot.intensity = 4.5 * fadeIn;
          industryFill.intensity = 2.0 * fadeIn;
        } else if (p > 0.80) {
          const fadeOut = Math.max(0, (1.0 - p) / 0.20);
          hackathonSpot.intensity = 4.5 * fadeOut;
          industryFill.intensity = 2.0 * fadeOut;
        } else {
          hackathonSpot.intensity = 4.5;
          industryFill.intensity = 2.0;
        }

        timelineLight.intensity = 2.2;
      } else if (currentT < 0.94) {
        // ZONE 3: REAL SYSTEMS SPATIAL EXHIBITION (0.74 -> 0.94)
        const p = (currentT - 0.74) / 0.20;
        let focalBiasX = 0;
        if (activeProject === 'vaidhya') focalBiasX = -1.2;
        else if (activeProject === 'bidlens') focalBiasX = 1.2;

        desiredCamPos.set(2.0 * (1 - p) + focalBiasX * 0.5 * p, 2.1 + p * 0.1, -3.0 - p * 11.5);
        desiredCamTarget.set(4.2 * (1 - p) + focalBiasX * p, 0.6 + p * 0.2, -8.0 - p * 12.0);

        if (p < 0.3) {
          const fadeIn = p / 0.3;
          systemsSpot.intensity = 4.5 * fadeIn;
          systemsFill.intensity = 2.2 * fadeIn;
        } else {
          systemsSpot.intensity = 4.5;
          systemsFill.intensity = 2.2;
        }

        timelineLight.intensity = 2.2;
      } else {
        // ZONE 4: EXIT CORRIDOR (0.94 -> 1.00)
        const p = (currentT - 0.94) / 0.06;
        desiredCamPos.set(0, 2.2 + p * 1.4, -14.5 - p * 8.0);
        desiredCamTarget.set(0, 1.0, -30.0);
        systemsSpot.intensity = Math.max(0, 4.5 * (1 - p));
        systemsFill.intensity = Math.max(0, 2.2 * (1 - p));
      }

      currentCamPos.lerp(desiredCamPos, 0.085);
      currentCamTarget.lerp(desiredCamTarget, 0.085);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamTarget);

      // ── PHOTON PULSE TRACKING ALONG ACTIVE CONDUIT ──
      let pulsePos = new THREE.Vector3();
      if (currentT < 0.49) {
        const pT = Math.max(0.001, Math.min(0.999, currentT / 0.49));
        pulsePos = academicCurve.getPointAt(pT);
        pulseMesh.visible = true;
        pulseGlow.visible = true;
      } else if (currentT < 0.74) {
        const pT = Math.max(0.001, Math.min(0.999, (currentT - 0.49) / 0.25));
        pulsePos = industryCurve.getPointAt(pT);
        pulseMesh.visible = true;
        pulseGlow.visible = true;
      } else if (currentT < 0.95) {
        const pT = Math.max(0.001, Math.min(0.999, (currentT - 0.74) / 0.21));
        pulsePos = systemsCurve.getPointAt(pT);
        pulseMesh.visible = true;
        pulseGlow.visible = true;
      } else {
        pulseMesh.visible = false;
        pulseGlow.visible = false;
      }

      if (pulseMesh.visible) {
        pulseMesh.position.copy(pulsePos);
        pulseGlow.position.copy(pulsePos);
        timelineLight.position.copy(pulsePos);
        timelineLight.position.y += 0.35;

        const pScale = 1.0 + Math.sin(time * 3.2) * 0.16;
        pulseGlow.scale.set(pScale, pScale, pScale);
      }

      // ── SUBTLE SYSTEM ANIMATIONS ──
      if (inSystemsZone) {
        sensorRing.scale.setScalar(1.0 + Math.sin(time * 3.8) * 0.04);
        systemsSensorMat.emissiveIntensity = 1.0 + Math.sin(time * 4.0) * 0.4;
        ollamaCore.rotation.y = time * 0.6;
        ollamaCore.rotation.x = time * 0.35;
        radarMesh.rotation.z = time * 0.4;

        scannerBeam.position.y = 0.5 + Math.sin(time * 2.2) * 0.4;
        doc1.position.y = 0.6 + Math.sin(time * 1.2) * 0.03;
        doc2.position.y = 0.75 + Math.sin(time * 1.4 + 1) * 0.03;
      }

      if (inIndustryZone) {
        aiCrystal.rotation.y = time * 0.5;
        aiCrystal.rotation.z = Math.sin(time * 0.8) * 0.15;
      }

      // ── DUST MOTES DRIFT ──
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 0] += particleVel[i * 3 + 0];
        posArr[i * 3 + 1] += particleVel[i * 3 + 1];
        posArr[i * 3 + 2] += particleVel[i * 3 + 2];
        if (posArr[i * 3 + 1] > 6) posArr[i * 3 + 1] = -2.3;
        if (posArr[i * 3 + 0] > 11) posArr[i * 3 + 0] = -11;
        if (posArr[i * 3 + 0] < -11) posArr[i * 3 + 0] = 11;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
  }, [webgl, reduced, activeProject]);

  if (!webgl) {
    return (
      <div className={`milestones-fallback ${className ?? ''}`} aria-hidden="true">
        <div className="milestones-fallback__monolith">
          <span className="milestones-fallback__num">9.55</span>
          <span className="milestones-fallback__denom">/ 10.0</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`milestones-canvas ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}
