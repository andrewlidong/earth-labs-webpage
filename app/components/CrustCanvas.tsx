"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Subsurface cross-section:
// - top 18% fades to page bg (header)
// - middle 50% = stratified crust with tectonic warping
// - bottom 32% = darker zone with hero text overlay
// - vertical borehole probes with sample dots
// - hot pockets (h2 prospectivity) glowing in the deep
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      a *= 0.55;
    }
    return v;
  }
  float vline(vec2 p, float x, float w) {
    return smoothstep(w, 0.0, abs(p.x - x));
  }

  // depth-driven palette: surface (warm cream) → deep (hot orange/red)
  vec3 palette(float t) {
    // 7 stops along the crust column
    vec3 a = vec3(0.96, 0.82, 0.55); // sediment
    vec3 b = vec3(0.86, 0.58, 0.32); // sandstone
    vec3 c = vec3(0.66, 0.38, 0.22); // basalt
    vec3 d = vec3(0.38, 0.22, 0.18); // crystalline
    vec3 e = vec3(0.24, 0.12, 0.16); // ultramafic
    vec3 f = vec3(0.78, 0.28, 0.14); // serpentinized (h2)
    vec3 g = vec3(1.00, 0.46, 0.16); // hot
    if (t < 0.16)      return mix(a, b, t / 0.16);
    else if (t < 0.34) return mix(b, c, (t - 0.16) / 0.18);
    else if (t < 0.55) return mix(c, d, (t - 0.34) / 0.21);
    else if (t < 0.74) return mix(d, e, (t - 0.55) / 0.19);
    else if (t < 0.88) return mix(e, f, (t - 0.74) / 0.14);
    else               return mix(f, g, (t - 0.88) / 0.12);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(1.0, uRes.y);
    vec2 p = vec2(uv.x * aspect, uv.y);

    // depth axis: 0 = surface (top), 1 = deep crust (bottom)
    float depth = 1.0 - uv.y;

    // tectonic warp (slow drift)
    float warp = fbm(vec2(p.x * 1.4, depth * 2.0 + uTime * 0.025));
    float warpedDepth = clamp(depth + warp * 0.06 - 0.03, 0.0, 1.0);

    vec3 col = palette(warpedDepth);

    // strata bands
    float bands = sin((warpedDepth) * 36.0);
    float bandLine = smoothstep(0.92, 1.0, abs(bands));
    col = mix(col, col * 0.5, bandLine * 0.55);

    // seismic shimmer — moving energy
    float seismic = fbm(vec2(p.x * 3.2 - uTime * 0.10, depth * 5.5 + uTime * 0.18));
    seismic = pow(seismic, 1.8);
    col += vec3(1.0, 0.62, 0.20) * seismic * 0.22 * smoothstep(0.05, 1.0, depth);

    // h2 prospectivity hot pockets (deep zones)
    float hot = smoothstep(0.50, 1.0, depth) *
                fbm(vec2(p.x * 4.5 + 12.0, depth * 5.0 - uTime * 0.06));
    hot = smoothstep(0.55, 0.85, hot);
    col = mix(col, vec3(1.0, 0.45, 0.15), hot * 0.65);

    // mouse-driven exploration: a soft glow follows the cursor
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    float mDist = length(p - m);
    float focus = exp(-mDist * 4.5);
    col += vec3(1.0, 0.55, 0.18) * focus * 0.45;
    // slight lensing of strata near cursor
    col *= 1.0 + focus * 0.15;

    // boreholes
    float bore = 0.0;
    bore += vline(p, 0.35 * aspect, 0.0018);
    bore += vline(p, 0.78 * aspect, 0.0018);
    bore += vline(p, 1.22 * aspect, 0.0018);
    bore += vline(p, 1.65 * aspect, 0.0018);
    col = mix(col, vec3(0.98, 0.98, 0.94), bore * 0.9);

    // sample dots — pulsing
    float dots = 0.0;
    for (int i = 0; i < 4; i++) {
      float bx = (0.35 + 0.43 * float(i)) * aspect;
      for (int j = 0; j < 7; j++) {
        float by = 0.10 + float(j) * 0.12 + 0.02 * sin(uTime * 0.5 + float(i) + float(j));
        float d = length(p - vec2(bx, by));
        float pulse = 0.55 + 0.45 * sin(uTime * 1.6 + float(i) * 0.7 + float(j) * 0.4);
        dots += smoothstep(0.007, 0.0, d) * pulse;
      }
    }
    col += vec3(1.0, 0.9, 0.45) * dots * 0.85;

    // composition: fade to bg at top (header) and bottom (text overlay)
    float topFade = 1.0 - smoothstep(0.88, 1.00, uv.y); // 1 in middle, 0 near top
    float botFade = smoothstep(0.00, 0.18, uv.y);       // 0 at bottom, 1 above
    vec3 bg = vec3(0.020, 0.024, 0.028);
    col = mix(bg, col, topFade * botFade);

    // vignette
    vec2 q = uv - 0.5;
    col *= 1.0 - dot(q, q) * 0.5;

    // film grain
    float n = (hash(uv * uRes + uTime) - 0.5) * 0.04;
    col += n;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function CrustPlane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    uniforms.uTime.value += delta;
    const { width, height } = state.size;
    uniforms.uRes.value.set(width, height);
    // smoothly approach the target mouse position
    uniforms.uMouse.value.lerp(target.current, Math.min(1, delta * 4));
  });

  return (
    <mesh
      onPointerMove={(e) => {
        const x = e.uv?.x;
        const y = e.uv?.y;
        if (x !== undefined && y !== undefined) target.current.set(x, y);
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function CrustCanvas() {
  return (
    <Canvas
      orthographic
      camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1, position: [0, 0, 1] }}
      dpr={[1, 1.6]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x050607, 1);
      }}
      fallback={null}
    >
      <CrustPlane />
    </Canvas>
  );
}
