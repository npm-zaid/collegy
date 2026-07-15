import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTransition; // Controls progress
  uniform vec2 uResolution;
  uniform float uTime;
  varying vec2 vUv;

  // Customizable border uniforms
  uniform vec3 uBorderColor;

  // CLASSIC 3D PERLIN NOISE FUNCTIONS (Self-contained)
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g100, g100), dot(g010, g010), dot(g110, g110)));
    g000 *= norm0.x;
    g100 *= norm0.y;
    g010 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g101, g101), dot(g011, g011), dot(g111, g111)));
    g001 *= norm1.x;
    g101 *= norm1.y;
    g011 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    float n_z = mix(mix(n000, n100, fade_xyz.x), mix(n010, n110, fade_xyz.x), fade_xyz.y);
    float n_dz = mix(mix(n001, n101, fade_xyz.x), mix(n011, n111, fade_xyz.x), fade_xyz.y);
    return 2.2 * mix(n_z, n_dz, fade_xyz.z);
  }

  void main() {
    // 1. PIXELATION FILTER: Snap continuous UV coordinates onto a grid of discrete pixel blocks
    // Each block is 8x8 physical screen pixels, creating a stunning retro digital-glitch style.
    float pixelSize = 10.0;
    vec2 grid = uResolution / pixelSize;
    vec2 pixelatedUv = floor(vUv * grid) / grid;

    // 2. Correct aspect ratios to prevent wide-screen noise distortion
    float aspect = uResolution.x / uResolution.y;
    vec2 correctedUv = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    // Calculate maximum possible distance to any corner in aspect-corrected space
    // This ensures normalizedDistance is always exactly 1.0 at the corners, on ANY screen aspect ratio!
    float maxDistance = length(vec2(aspect, 1.0)) * 0.5;

    // Displace the UVs using Perlin noise
    vec2 displacedUv = correctedUv + cnoise(vec3(correctedUv * 5.0, uTime * 0.1));

    // Perlin noise calculation
    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

    // Calculate normalized distance from center (0.0 at center, 1.0 at the furthest corner)
    float d = length(correctedUv - 0.5);
    float normalizedDistance = d / maxDistance;

    // Radial gradient:
    // 1. (1.0 - uTransition) * 2.0 acts as a safety offset. At uTransition = 0.0, the minimum value is >= 2.0.
    //    Since cnoise is between -1.0 and 1.0, this guarantees the initial state is 100% opaque solid black with 0.0 holes in the center.
    // 2. We subtract 15.0 * uTransition to guarantee that even with positive noise, the corners hit 100% transparency at uTransition = 1.0.
    float radialGradient = normalizedDistance * 12.5 + (1.0 - uTransition) * 2.0 - 15.0 * uTransition;

    // Store unclamped raw strength to calculate 30% widescreen volumetric glow
    float rawStrength = strength + radialGradient;

    // Clamp the value from 0 to 1 for the solid black plane's opacity boundary
    strength = clamp(rawStrength, 0.0, 1.0);

    // 3. RETRO VOLUMETRIC GLOW EDGE DETECTION:
    // We define the edge on the unclamped rawStrength over a range [0.0, 2.5].
    // Since the spatial slope of rawStrength is 12.5, this interval of 2.5 corresponds
    // exactly to a 20% screen-radius wide volumetric glow band!
    float edge = smoothstep(0.0, 0.7, rawStrength) * smoothstep(2.5, 0.7, rawStrength);

    // We scale the edge glow by uTransition so that it is EXACTLY 0.0 initially (solid pure black screen).
    // As soon as transition begins, the deep blue glow fades in rapidly!
    edge *= min(uTransition * 5.0, 1.0);

    // Dynamically derive the deep dark tone and rich glowing tone from the customizable uBorderColor uniform!
    vec3 deepMidnightColor = uBorderColor * 0.015; // Darker tone for rich contrast
    vec3 richGlowingColor = uBorderColor * 1.5;   // Highly vibrant glowing color
    vec3 edgeColor = mix(deepMidnightColor, richGlowingColor, sin(uTime * 1.5) * 0.5 + 0.5);

    // Smoothly mix (linear interpolate) the deep glow with the solid black base plane.
    // This guarantees an absolutely flawless, feather-soft gradient from pure solid black
    // into the rich glow, eliminating any sharp cutoff borders or jagged seams!
    vec3 baseBlack = vec3(0.0);
    vec3 planeColor = mix(baseBlack, edgeColor * 6.5, edge);

    // Combine the solid plane opacity and retro glow
    float finalAlpha = max(strength, edge);

    // Solid black plane with glowing borders dissolving to reveal background HTML content
    gl_FragColor = vec4(planeColor, finalAlpha);
  }
`;

// Quadratic in/out easing — close match to GSAP's "power2.inOut",
// used here so the component has no external animation dependency.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Lightweight tween helper (replaces gsap.to for the uTransition uniform).
function tweenUniform(uniform, from, to, duration, onComplete) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    uniform.value = from + (to - from) * easeInOutQuad(t);
    if (t < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }
  requestAnimationFrame(step);
}

export default function WebGLLoader({ borderColor = "#0033ff", title = "WEBGL LOADER" }) {
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const uniformsRef = useRef(null);
  const revealedRef = useRef(false);
  const rafRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      uTransition: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0.0 },
      uBorderColor: { value: new THREE.Color(borderColor) },
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // updateStyle = false: Tailwind classes already size the canvas element,
      // this only resizes the drawing buffer.
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      uniforms.uResolution.value.set(width, height);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const clock = new THREE.Clock();
    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", setSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [borderColor]);

  const handleReveal = () => {
    if (revealedRef.current || !uniformsRef.current) return;
    revealedRef.current = true;
    setIsRevealed(true);
    tweenUniform(uniformsRef.current.uTransition, 0, 1, 3000, () => {
      if (loaderRef.current) loaderRef.current.style.pointerEvents = "none";
    });
  };

  return (
    <div className="relative w-full">
      <div
        ref={loaderRef}
        onClick={handleReveal}
        className="fixed inset-0 z-10 flex items-center justify-center cursor-pointer"
      >
        <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" />
        <p
          className={`relative z-[2] font-sans text-sm uppercase tracking-[0.3em] text-white transition-all duration-500 ease-in-out ${
            isRevealed ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          Click to reveal
        </p>
      </div>

      <div className="flex h-screen w-full items-center justify-center bg-black">
        <h1 className="font-sans text-[6vw] font-bold uppercase tracking-tight text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}