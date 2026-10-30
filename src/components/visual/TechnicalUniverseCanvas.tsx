import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { devicePixelRatioCap, supportsWebGL } from '../../lib/webgl';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * A layered compute environment: three suspended system plates — data, services,
 * interface — with the five technology domains orbiting them as lit nodes.
 * Selecting a domain in the list lights its node, its filament, and the plate it
 * belongs to. Nothing here is decorative geometry: every element maps to the list.
 */

interface TechnicalUniverseCanvasProps {
  progressRef: React.MutableRefObject<number>;
  activeIndexRef: React.MutableRefObject<number>;
  className?: string;
}

const DOMAINS = [
  { position: [-3.05, 0.55, 1.35], plate: 0 },
  { position: [-1.85, 1.55, 1.05], plate: 1 },
  { position: [-0.1, 1.95, 1.55], plate: 2 },
  { position: [1.85, 1.5, 1.05], plate: 1 },
  { position: [3.05, 0.45, 1.35], plate: 0 },
] as const;

export function TechnicalUniverseCanvas({
  progressRef,
  activeIndexRef,
  className,
}: TechnicalUniverseCanvasProps) {
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
    renderer.setClearColor(0x08090d, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090d, 0.055);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 4, 8.2);

    const materials: THREE.Material[] = [];
    const makeMaterial = <T extends THREE.Material>(material: T): T => {
      materials.push(material);
      return material;
    };

    // Soft radial sprite reused by node halos and the floor pool.
    const glowTexture = (() => {
      const size = 128;
      const canvasEl = document.createElement('canvas');
      canvasEl.width = size;
      canvasEl.height = size;
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 150, 90, 0.85)');
        gradient.addColorStop(0.45, 'rgba(255, 97, 47, 0.28)');
        gradient.addColorStop(1, 'rgba(255, 97, 47, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvasEl);
    })();

    scene.add(new THREE.HemisphereLight(0xa8b4c8, 0x0a0b0e, 0.9));

    const keyLight = new THREE.DirectionalLight(0xffe0c4, 2.8);
    keyLight.position.set(-4.2, 5.4, 5.4);
    scene.add(keyLight);

    const warmRim = new THREE.PointLight(0xff562c, 26, 14, 2);
    warmRim.position.set(2.4, -1.6, 3.2);
    scene.add(warmRim);

    const warmCore = new THREE.PointLight(0xff7a40, 16, 8, 2);
    warmCore.position.set(0, 0, 1.4);
    scene.add(warmCore);

    const coolRim = new THREE.PointLight(0x7d93bb, 14, 12, 2);
    coolRim.position.set(-4.4, 1.6, -1.6);
    scene.add(coolRim);

    const assembly = new THREE.Group();
    scene.add(assembly);

    /* ------------------------------------------------------------------ */
    /* Plates                                                              */
    /* ------------------------------------------------------------------ */
    const plateGeometry = new THREE.BoxGeometry(5.5, 0.1, 3.5);
    const plateMaterials = [0, 1, 2].map(() =>
      makeMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x1e252b,
          metalness: 0.58,
          roughness: 0.42,
          emissive: 0x1b0d07,
          emissiveIntensity: 0.22,
        }),
      ),
    );
    const edgeMaterial = makeMaterial(
      new THREE.LineBasicMaterial({ color: 0xa08f80, transparent: true, opacity: 0.5 }),
    );
    const etchMaterial = makeMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xa87a5c,
        metalness: 0.8,
        roughness: 0.4,
        emissive: 0x401806,
        emissiveIntensity: 0.55,
      }),
    );

    const plateLayout = [
      { y: 1.2, rot: 0.14, scale: 0.84 },
      { y: 0, rot: -0.08, scale: 1 },
      { y: -1.2, rot: 0.2, scale: 0.86 },
    ];

    const plates: THREE.Group[] = [];
    plateLayout.forEach((layout, index) => {
      const plate = new THREE.Group();
      plate.position.y = layout.y;
      plate.rotation.y = layout.rot;
      plate.scale.setScalar(layout.scale);

      const body = new THREE.Mesh(plateGeometry, plateMaterials[index]);
      plate.add(body);

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(plateGeometry),
        edgeMaterial,
      );
      plate.add(outline);

      // Etched lattice on the upper face: a few traces per plate, not a pattern.
      const traceGeometry = new THREE.BoxGeometry(1, 0.012, 0.035);
      for (let i = 0; i < 5; i += 1) {
        const length = 0.9 + ((i * 0.38) % 1.5);
        const trace = new THREE.Mesh(traceGeometry, etchMaterial);
        trace.scale.x = length;
        trace.position.set(-1.9 + ((i * 1.05) % 3.4), 0.056, -1.25 + i * 0.58);
        plate.add(trace);
      }
      const crossGeometry = new THREE.BoxGeometry(0.035, 0.012, 1.2);
      for (let i = 0; i < 3; i += 1) {
        const cross = new THREE.Mesh(crossGeometry, etchMaterial);
        cross.position.set(-1.5 + i * 1.45, 0.056, -0.3);
        plate.add(cross);
      }

      plates.push(plate);
      assembly.add(plate);
    });

    // Vertical spine threading the three plates.
    const spineMaterial = makeMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xff7a42,
        emissive: 0xff4f22,
        emissiveIntensity: 1.5,
        metalness: 0.3,
        roughness: 0.35,
      }),
    );
    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 2.6, 12),
      spineMaterial,
    );
    assembly.add(spine);

    // A pool of light beneath the stack grounds it in the dark stage.
    const floorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 3.6),
      makeMaterial(
        new THREE.MeshBasicMaterial({
          map: glowTexture,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -1.85;
    assembly.add(floorGlow);

    const ringMaterial = makeMaterial(
      new THREE.MeshBasicMaterial({
        color: 0xff6a36,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const rings: THREE.Mesh[] = [];
    plateLayout.forEach((layout, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.42 + index * 0.06, 0.008, 8, 64),
        ringMaterial,
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = layout.y + 0.09;
      assembly.add(ring);
      rings.push(ring);
    });

    /* ------------------------------------------------------------------ */
    /* Domain nodes + filaments                                            */
    /* ------------------------------------------------------------------ */
    const nodeGeometry = new THREE.SphereGeometry(0.11, 20, 16);
    const haloGeometry = new THREE.PlaneGeometry(0.7, 0.7);

    const nodeMaterials = DOMAINS.map(() =>
      makeMaterial(
        new THREE.MeshStandardMaterial({
          color: 0xe8cbb6,
          emissive: 0xff5a24,
          emissiveIntensity: 0.7,
          metalness: 0.35,
          roughness: 0.28,
        }),
      ),
    );
    const filamentMaterials = DOMAINS.map(() =>
      makeMaterial(
        new THREE.MeshStandardMaterial({
          color: 0x9a6a52,
          emissive: 0xff4f1f,
          emissiveIntensity: 0.28,
          metalness: 0.7,
          roughness: 0.35,
        }),
      ),
    );
    const haloMaterials = DOMAINS.map(() =>
      makeMaterial(
        new THREE.MeshBasicMaterial({
          map: glowTexture,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    const nodes: THREE.Group[] = [];
    DOMAINS.forEach((domain, index) => {
      const group = new THREE.Group();
      group.position.set(domain.position[0], domain.position[1], domain.position[2]);

      const halo = new THREE.Mesh(haloGeometry, haloMaterials[index]);
      group.add(halo);

      const node = new THREE.Mesh(nodeGeometry, nodeMaterials[index]);
      group.add(node);

      const plateY = plateLayout[domain.plate].y;
      const anchor = new THREE.Vector3(
        Math.max(-2.2, Math.min(2.2, domain.position[0] * 0.55)),
        plateY + 0.08,
        0.85,
      );
      const curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(domain.position[0], domain.position[1], domain.position[2]),
          new THREE.Vector3(
            domain.position[0] * 0.7,
            (domain.position[1] + plateY) / 2 + 0.35,
            domain.position[2] * 0.6,
          ),
          anchor,
        ],
        false,
        'centripetal',
      );
      const filament = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 30, 0.016, 5, false),
        filamentMaterials[index],
      );
      assembly.add(filament);

      assembly.add(group);
      nodes.push(group);
    });

    /* ------------------------------------------------------------------ */
    /* Atmosphere                                                          */
    /* ------------------------------------------------------------------ */
    const dustCount = 130;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 9;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      makeMaterial(
        new THREE.PointsMaterial({
          color: 0xffb083,
          size: 0.022,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      ),
    );
    assembly.add(dust);

    let sceneOffsetX = 0;
    let sceneY = 2.4;
    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      const compact = width < 640;
      // The technology list owns the right half on wide screens, so the stack
      // is composed into the left column instead of running underneath it.
      const twoColumn = width >= 1024;
      sceneOffsetX = twoColumn ? -3.35 : 0;
      sceneY = compact ? 3 : 4;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Fit the stack to the visible width so it never clips on narrow stages.
      const viewWidth = 2 * Math.tan((32 * Math.PI) / 360) * 8.2 * camera.aspect;
      const fit = (0.9 * viewWidth) / 15.8;
      // Two-column: fit the narrow stage. Stacked: size against the viewport so
      // the stack keeps its presence on phones instead of shrinking to a speck.
      const stackedScale = Math.min(0.85, Math.max(0.6, width / 620));
      assembly.scale.setScalar(twoColumn ? Math.min(0.95, fit) : stackedScale);
      assembly.position.x = sceneOffsetX;
      assembly.position.y = compact ? 0 : 0.3;
      renderer.setPixelRatio(devicePixelRatioCap());
      renderer.setSize(width, height, false);
    };
    resize();

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        -((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      );
    };
    mount.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf = 0;
    let running = false;
    let visible = false;
    let pageVisible = !document.hidden;
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const time = (now - startTime) / 1000;
      pointer.lerp(pointerTarget, 0.04);
      const scroll = THREE.MathUtils.clamp(progressRef.current, 0, 1);
      const active = activeIndexRef.current;

      camera.position.x = pointer.x * 0.34;
      camera.position.y = sceneY + pointer.y * 0.22 - scroll * 0.45;
      camera.position.z = 8.2 - scroll * 0.6;
      camera.lookAt(0, 0.2, 0);

      if (!reduced) {
        assembly.rotation.y = 0.02 + pointer.x * 0.05 + Math.sin(time * 0.16) * 0.035;
        assembly.rotation.x = -0.03 + pointer.y * 0.02;
        assembly.position.y = 0.3 + Math.sin(time * 0.34) * 0.035;
        dust.rotation.y = time * 0.012;
      }

      nodes.forEach((node, index) => {
        const selected = active === index;
        const bob = reduced ? 0 : Math.sin(time * 0.7 + index * 1.3) * 0.045;
        node.position.y = DOMAINS[index].position[1] + bob;
        node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, selected ? 1.5 : 1, 0.12));
        nodeMaterials[index].emissiveIntensity = THREE.MathUtils.lerp(
          nodeMaterials[index].emissiveIntensity,
          selected ? 2.4 : 0.7,
          0.14,
        );
        filamentMaterials[index].emissiveIntensity = THREE.MathUtils.lerp(
          filamentMaterials[index].emissiveIntensity,
          selected ? 1.5 : 0.24,
          0.12,
        );
        haloMaterials[index].opacity = THREE.MathUtils.lerp(
          haloMaterials[index].opacity,
          selected ? 0.95 : 0.4,
          0.12,
        );
      });

      plates.forEach((_plate, index) => {
        const isActivePlate = active >= 0 && DOMAINS[active].plate === index;
        plateMaterials[index].emissiveIntensity = THREE.MathUtils.lerp(
          plateMaterials[index].emissiveIntensity,
          isActivePlate ? 0.55 : 0.22,
          0.1,
        );
      });

      rings.forEach((ring, index) => {
        ring.rotation.z = (reduced ? 0 : time * 0.18) + index * 0.6;
      });

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      if (!running) return;
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running || reduced || !visible || !pageVisible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (reduced) renderFrame(performance.now());
          else startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(mount);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced || !running) renderFrame(performance.now());
    });
    resizeObserver.observe(mount);

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) {
        if (reduced && visible) renderFrame(performance.now());
        else startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopLoop();
      setWebgl(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    if (reduced) renderFrame(performance.now());
    else startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      resizeObserver.disconnect();
      mount.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      assembly.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          geometries.add(object.geometry);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      glowTexture.dispose();
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, [activeIndexRef, progressRef, reduced, webgl]);

  if (!webgl) {
    return (
      <div className={`tu-canvas tu-canvas--fallback ${className ?? ''}`} aria-hidden="true">
        <div className="tu-fallback-board">
          <span className="tu-fallback-plate" data-plate="0" />
          <span className="tu-fallback-plate" data-plate="1" />
          <span className="tu-fallback-plate" data-plate="2" />
          {DOMAINS.map((_, index) => (
            <span className="tu-fallback-node" data-index={index} key={index} />
          ))}
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className={`tu-canvas ${className ?? ''}`} aria-hidden="true" />;
}
