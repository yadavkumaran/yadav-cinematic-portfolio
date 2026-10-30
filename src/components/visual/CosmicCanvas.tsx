import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { devicePixelRatioCap, supportsWebGL } from '../../lib/webgl';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const particleVertex = /* glsl */ `
  attribute float aSeed;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSize;
  attribute float aDepth;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float converge = smoothstep(0.0, 0.68, uProgress);
    float expand = smoothstep(0.72, 1.0, uProgress);

    float drift = uTime * (0.012 + aSeed * 0.02);
    float angle = aAngle + converge * (0.75 + aSeed * 1.6) + drift;
    float radius = mix(aRadius, 0.12 + aSeed * 0.24, converge);
    radius = mix(radius, aRadius * 2.4 + 1.8, expand * 1.4);

    float depth = mix(aDepth, -0.7 + aSeed * 1.2, converge);
    depth = mix(depth, aDepth * 2.0 + 3.2, expand);

    vec3 pos = vec3(cos(angle) * radius, sin(angle) * radius * 0.92 + 0.55, depth);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Near particles grow past a pixel and turn into soft out-of-focus discs.
    float closeness = clamp(1.0 - (-mvPosition.z - 1.0) / 4.0, 0.0, 1.0);
    gl_PointSize = aSize * uPixelRatio * (7.0 / max(0.8, -mvPosition.z)) * (1.0 + converge * 0.5);
    gl_PointSize += closeness * aSeed * 9.0 * uPixelRatio;

    vec3 violet = vec3(0.52, 0.46, 1.0);
    vec3 warmWhite = vec3(1.0, 0.96, 0.90);
    vColor = mix(violet, warmWhite, smoothstep(0.15, 0.85, converge) * (0.2 + aSeed * 0.8));

    vAlpha = (0.12 + aSeed * aSeed * 0.88) * mix(0.55, 1.0, converge) * (1.0 - expand * 0.92);
    vAlpha *= 0.55 + closeness * 0.45;
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float d = length(center);
    if (d > 0.5) discard;
    // Tight core with a soft, defocused skirt: reads like a lens, not a dot.
    float soft = smoothstep(0.5, 0.0, d);
    float spark = pow(soft, 3.0) + pow(soft, 1.2) * 0.22;
    gl_FragColor = vec4(vColor * spark, spark * vAlpha);
  }
`;

/* One plane composes the whole light source: hot point, chromatic falloff,
   anamorphic streaks, accretion ring and soft spokes. */
const bloomVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bloomFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uSize;

  void main() {
    // Work in world units so the glow has a fixed optical size at any aspect.
    vec2 q = (vUv - 0.5) * uSize;
    float d = length(q);

    // The singularity core is already glowing mysteriously upon entering, flaring into full magnificence
    float reveal = 0.50 + 0.50 * smoothstep(0.0, 0.20, uProgress);
    float exit = 1.0 - smoothstep(0.78, 1.0, uProgress) * 0.85;
    float breathe = 0.95 + 0.05 * sin(uTime * 0.55);

    float hot = exp(-d * 22.0);
    float inner = exp(-d * 6.6);
    float glow = exp(-d * 2.7);

    vec3 c = vec3(1.0, 0.985, 0.95) * hot * 2.05;
    c += vec3(0.66, 0.61, 1.0) * inner * 0.4;
    c += vec3(0.34, 0.29, 0.82) * glow * 0.05;

    // Anamorphic streaks: long thin horizontal, shorter vertical.
    float streakH = exp(-abs(q.y) * 130.0) * exp(-abs(q.x) * 1.1);
    float streakV = exp(-abs(q.x) * 130.0) * exp(-abs(q.y) * 3.4);
    c += vec3(0.62, 0.60, 1.0) * streakH * 0.4;
    c += vec3(0.78, 0.76, 1.0) * streakV * 0.1;

    // Thin accretion ring, tightening as the sequence resolves.
    float r = length(q * vec2(1.0, 1.35));
    float ringR = mix(0.46, 0.34, smoothstep(0.1, 0.72, uProgress));
    float ring = exp(-pow((r - ringR) * 46.0, 2.0));
    c += vec3(0.46, 0.41, 0.95) * ring * 0.055;

    // Faint spokes through dust.
    float ang = atan(q.y, q.x);
    float spokes = pow(0.5 + 0.5 * sin(ang * 12.0 + uTime * 0.05), 16.0) * exp(-d * 1.6);
    c += vec3(0.42, 0.38, 0.92) * spokes * 0.07;

    c *= reveal * exit * breathe;

    // Never let the quad boundary show through.
    float edge = 1.0 - smoothstep(0.36, 0.49, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    c *= edge;

    gl_FragColor = vec4(c, 1.0);
  }
`;

/* Distant stars: the depth reference the particles converge against. */
const starVertex = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio;
    vAlpha = (0.25 + aSeed * 0.75) * (1.0 - smoothstep(0.75, 1.0, uProgress) * 0.85);
  }
`;

const starFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float s = smoothstep(0.5, 0.0, length(c));
    gl_FragColor = vec4(vec3(0.86, 0.88, 1.0) * pow(s, 2.4), pow(s, 2.4) * vAlpha);
  }
`;

interface CosmicCanvasProps {
  progressRef: { current: number };
  className?: string;
}

export function CosmicCanvas({ progressRef, className }: CosmicCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(supportsWebGL);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !webgl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebgl(false);
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    renderer.setPixelRatio(devicePixelRatioCap());
    renderer.setClearColor(0x040508, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 40);
    camera.position.set(0, 0, 4.2);

    const isSmall = window.innerWidth < 768;

    /* --- Particles ------------------------------------------------------ */
    const count = isSmall ? 420 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      seeds[i] = Math.random();
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 0.6 + Math.pow(Math.random(), 0.6) * 2.8;
      sizes[i] = 0.5 + Math.pow(Math.random(), 2.4) * 6.2;
      depths[i] = -2.1 + Math.random() * 3.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));

    const particleUniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    /* --- Starfield ------------------------------------------------------ */
    const starCount = isSmall ? 160 : 380;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSeeds = new Float32Array(starCount);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = -radius * Math.abs(Math.cos(phi)) - 2;
      starSeeds[i] = Math.random();
      starSizes[i] = 0.7 + Math.pow(Math.random(), 3) * 2.2;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('aSeed', new THREE.BufferAttribute(starSeeds, 1));
    starGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));

    const starUniforms = {
      uProgress: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };
    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    /* --- Light source --------------------------------------------------- */
    const BLOOM_SIZE = 12;
    const bloomUniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: new THREE.Vector2(BLOOM_SIZE, BLOOM_SIZE) },
    };
    const bloomMaterial = new THREE.ShaderMaterial({
      vertexShader: bloomVertex,
      fragmentShader: bloomFragment,
      uniforms: bloomUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const bloom = new THREE.Mesh(new THREE.PlaneGeometry(BLOOM_SIZE, BLOOM_SIZE), bloomMaterial);
    bloom.position.set(0, 0.55, -0.5);
    scene.add(bloom);

    /* --- Nebula wash: keeps the void from reading as flat black --------- */
    const nebulaUniforms = { uProgress: { value: 0 } };
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: nebulaUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: bloomVertex,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform float uProgress;
        void main() {
          vec2 p = vUv - 0.5;
          float d = length(p);
          float cone = smoothstep(0.5, 0.05, d);
          float band = exp(-pow(p.y * 6.0, 2.0)) * 0.5;
          float amount = (cone * 0.5 + band) * (0.35 + 0.65 * smoothstep(0.05, 0.55, uProgress));
          vec3 c = mix(vec3(0.05, 0.045, 0.12), vec3(0.12, 0.10, 0.26), cone);
          gl_FragColor = vec4(c * amount, 1.0);
        }
      `,
    });
    const nebula = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), nebulaMaterial);
    nebula.position.set(0, 0.3, -3.2);
    scene.add(nebula);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(devicePixelRatioCap());
      renderer.setSize(width, height, false);
      particleUniforms.uPixelRatio.value = renderer.getPixelRatio();
      starUniforms.uPixelRatio.value = renderer.getPixelRatio();
      particles.scale.setScalar(width < 768 ? 0.82 : 1);
    };
    resize();

    let raf = 0;
    let running = false;
    let visible = true;
    let pageVisible = !document.hidden;
    const start = performance.now();
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);

    let smoothedProgress = progressRef.current;

    const renderFrame = (now: number, progress: number) => {
      const time = (now - start) / 1000;
      particleUniforms.uProgress.value = progress;
      particleUniforms.uTime.value = time;
      starUniforms.uProgress.value = progress;
      bloomUniforms.uProgress.value = progress;
      bloomUniforms.uTime.value = time;
      nebulaUniforms.uProgress.value = progress;

      // Cinematic camera progression:
      // - Gentle, steady glide forward during the reading hold (z: 4.3 -> 3.65)
      // - Smooth hyperspace acceleration into the singularity core on exit (z: 3.65 -> 2.3)
      const readProgress = Math.min(progress / 0.72, 1);
      const exitProgress = Math.max((progress - 0.72) / 0.28, 0);
      const cameraZ = 4.3 - (readProgress * 0.65) - (Math.pow(exitProgress, 1.6) * 1.35);
      camera.position.z = cameraZ;

      particles.rotation.z = progress * 0.18;
      stars.rotation.z = progress * 0.05;

      pointer.lerp(target, 0.04);
      camera.position.x = pointer.x * 0.18;
      camera.position.y = pointer.y * 0.11;
      camera.lookAt(0, 0.18, 0);

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      if (!running) return;
      const target = progressRef.current;
      // Exponential smoothing dampener for step-free cinematic fluidity
      smoothedProgress += (target - smoothedProgress) * 0.16;
      if (Math.abs(target - smoothedProgress) < 0.0001) {
        smoothedProgress = target;
      }
      renderFrame(now, smoothedProgress);
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

    const onPointer = (event: PointerEvent) => {
      target.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) startLoop();
      else stopLoop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );
    observer.observe(mount);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) renderFrame(performance.now(), smoothedProgress);
    });
    resizeObserver.observe(mount);

    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopLoop();
      setWebgl(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    if (reduced) {
      renderFrame(start, 0.5);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene.clear();
      geometry.dispose();
      particleMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      bloom.geometry.dispose();
      bloomMaterial.dispose();
      nebula.geometry.dispose();
      nebulaMaterial.dispose();
      renderer.dispose();
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, [progressRef, reduced, webgl]);

  if (!webgl) {
    return (
      <div className={`cosmic__fallback ${className ?? ''}`} aria-hidden="true">
        <span />
      </div>
    );
  }

  return <div ref={mountRef} className={`cosmic__canvas ${className ?? ''}`} aria-hidden="true" />;
}
