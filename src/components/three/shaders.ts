/**
 * GLSL for the hero sculpture — a polished, reflective monolith read.
 * A simplex-noise field (Ashima Arts, MIT) gives an organic silhouette while a
 * fake studio-environment reflection + bone fresnel makes the surface feel like
 * cast, hand-polished bronze catching gallery light against a dark room.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2 uMouse;

  varying vec3 vNormal;      // view-space, smooth (for reflections)
  varying vec3 vViewPosition;
  varying float vDisplace;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float t = uTime * 0.16;
    float mouseInfluence = 0.1 * length(uMouse);

    float noise = snoise(position * 0.8 + vec3(t, t * 0.5, t * 0.3));
    noise += 0.3 * snoise(position * 1.7 - vec3(t * 0.6));

    float displace = noise * (uAmp + mouseInfluence);
    vDisplace = displace;

    vec3 newPosition = position + normal * displace;

    // Smooth (base) normal in view space → clean, glassy reflections.
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColorA; // deep bronze / shadow
  uniform vec3 uColorB; // warm metal highlight
  uniform vec3 uColorC; // bone specular / rim
  uniform vec3 uColorD; // clay accent reflection

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplace;

  const float PI = 3.14159265359;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 R = reflect(-V, N);

    // Fake studio environment: a bright soft-box overhead, dark floor,
    // plus a couple of vertical light strips like a gallery reflection.
    float overhead = smoothstep(-0.1, 0.75, R.y);
    float floorDark = smoothstep(-0.2, -0.75, R.y);
    float strips = smoothstep(0.72, 1.0, abs(sin(atan(R.x, R.z) * 2.0)));

    float env = overhead * 0.9 + strips * 0.35;
    env = clamp(env, 0.0, 1.4);

    vec3 metal = mix(uColorA, uColorB, env);
    metal = mix(metal, uColorA * 0.6, floorDark * 0.7);

    // Warm clay bounce on one flank for depth.
    float side = smoothstep(-0.6, 0.4, R.x);
    metal = mix(metal, mix(metal, uColorD, 0.35), side * 0.4);

    // Bone fresnel rim.
    float fresnel = pow(1.0 - abs(dot(V, N)), 2.6);
    vec3 color = mix(metal, uColorC, fresnel * 0.75);

    // Tight specular glints from the soft-box.
    float spec = pow(clamp(overhead, 0.0, 1.0), 8.0);
    color += spec * 0.3 * uColorC;

    gl_FragColor = vec4(color, 1.0);
  }
`;
