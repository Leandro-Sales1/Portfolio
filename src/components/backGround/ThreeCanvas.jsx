/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uDistortion;
  uniform float uSize;
  uniform vec2 uMouse;

  varying float vAlpha;
  varying vec3 vPos;
  varying float vNoise;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
      vec3 pos = position;

      float noiseFreq = 0.8;
      float noiseAmp = uDistortion;
      float noise = snoise(vec3(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq, pos.z * noiseFreq));

      vNoise = noise;

      vec3 newPos = pos + (normalize(pos) * noise * noiseAmp);

      float dist = distance(uMouse * 10.0, newPos.xy);
      float interaction = smoothstep(5.0, 0.0, dist);
      newPos += normalize(pos) * interaction * 0.8;

      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = uSize * (20.0 / -mvPosition.z) * (1.0 + noise * 0.2);

      vAlpha = 1.0;
      vPos = newPos;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vNoise;
  varying vec3 vPos;

  void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.1, dist) * uOpacity;

      vec3 darkColor = uColor * 0.3;
      vec3 lightColor = uColor * 2.0;

      vec3 finalColor = mix(darkColor, lightColor, vNoise * 0.6 + 0.4);

      gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Fundo 3D do Hero — icosaedro de pontos deslocado por ruído simplex, mais três
 * órbitas elípticas. Portado do template FlowForge, com correções.
 *
 * Contrato com o painel de calibração (<HeroCalibration>): as 5 props são
 * empurradas para uniforms vivos. Os dois useEffect abaixo têm deps separadas de
 * propósito — o de baixo NÃO depende das props, porque o canvas é construído uma
 * única vez e as mudanças chegam por uniform.
 *
 * Cuidado ao mexer: o `useEffect` de init fecha sobre as props (daí o
 * eslint-disable de exhaustive-deps no topo). Se virar dependência, o canvas é
 * destruído e recriado a cada arrasto de slider.
 */
const ThreeCanvas = ({ distortion, detail, speed, opacity, color }) => {
  const mountRef = useRef(null);
  const uniformsRef = useRef(null);
  const speedRef = useRef(speed);
  const timeRef = useRef(0);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.uDistortion.value = distortion;
    uniformsRef.current.uSize.value = detail * 2.0;
    uniformsRef.current.uOpacity.value = opacity;
    // LinearSRGBColorSpace: o ShaderMaterial escreve gl_FragColor direto, sem o
    // chunk <colorspace_fragment> que o three injeta nos materiais nativos. Com a
    // conversão padrão (sRGB→linear) o valor sairia mais escuro que o hex do swatch.
    uniformsRef.current.uColor.value.setStyle(color, THREE.LinearSRGBColorSpace);
  }, [distortion, detail, opacity, color]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // 2x fixo era caro num telefone; acima de 1024px mantém a nitidez.
    const isSmall = container.clientWidth < 1024;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
    // canvas é inline por padrão e deixa 4px de baseline sobrando no container
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const systemsGroup = new THREE.Group();
    scene.add(systemsGroup);

    // detail 35 → 20: ~⅓ dos vértices, ainda visualmente suave.
    const geometry = new THREE.IcosahedronGeometry(4.0, 20);

    uniformsRef.current = {
      uTime: { value: 0 },
      uDistortion: { value: distortion },
      uSize: { value: detail * 2.0 },
      uColor: { value: new THREE.Color().setStyle(color, THREE.LinearSRGBColorSpace) },
      uOpacity: { value: opacity },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    systemsGroup.add(particles);

    const lineGroup = new THREE.Group();
    systemsGroup.add(lineGroup);

    const createTechOrbit = (radius, rotation) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(128);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x27272a,
        transparent: true,
        opacity: 0.5,
      });
      const orbit = new THREE.Line(geo, mat);
      orbit.rotation.x = rotation.x;
      orbit.rotation.y = rotation.y;
      lineGroup.add(orbit);
      return orbit;
    };

    const orbits = [
      createTechOrbit(5.5, { x: Math.PI / 2, y: 0 }),
      createTechOrbit(5.2, { x: Math.PI / 3, y: Math.PI / 6 }),
      createTechOrbit(6.0, { x: Math.PI / 1.8, y: Math.PI / 4 }),
    ];

    let mouseX = 0;
    let mouseY = 0;

    // Em telas touch não existe hover: o mousemove sintético que o navegador
    // dispara no toque movia a câmera junto com o dedo.
    const hasPointer = !window.matchMedia("(hover: none)").matches;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (hasPointer) document.addEventListener("mousemove", handleMouseMove);

    const adjustLayout = () => {
      // container, não window: o container É o hero
      if (container.clientWidth < 1024) {
        systemsGroup.position.set(0, 1.5, -5);
        systemsGroup.scale.set(0.8, 0.8, 0.8);
      } else {
        systemsGroup.position.set(4.5, 0, 0);
        systemsGroup.scale.set(1, 1, 1);
      }
    };

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      adjustLayout();
    };

    // ResizeObserver no container, não window.resize: a altura do hero muda com a
    // barra de URL do mobile e nem sempre dispara um evento de resize.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    adjustLayout();

    let animationFrameId = null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timeRef.current += 0.01 + speedRef.current * 0.05;

      systemsGroup.rotation.y = timeRef.current * 0.08;
      systemsGroup.rotation.z = Math.sin(timeRef.current * 0.1) * 0.05;

      lineGroup.rotation.x = Math.sin(timeRef.current * 0.05) * 0.2;
      orbits.forEach((orbit, i) => {
        orbit.rotation.z += 0.003 * (i + 1);
      });

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = timeRef.current;
        uniformsRef.current.uMouse.value.x +=
          (mouseX - uniformsRef.current.uMouse.value.x) * 0.05;
        uniformsRef.current.uMouse.value.y +=
          (mouseY - uniformsRef.current.uMouse.value.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    const start = () => {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (animationFrameId === null) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    start();

    // Sem isto o loop roda a visita inteira: ~26k triângulos com ruído simplex por
    // vértice e AdditiveBlending, por um canvas que já saiu da tela.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    return () => {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (hasPointer) document.removeEventListener("mousemove", handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      orbits.forEach((orbit) => {
        orbit.geometry.dispose();
        orbit.material.dispose();
      });
      // Sem isto o contexto WebGL vaza a cada HMR e a cada double-invoke do
      // StrictMode; depois de ~16 o navegador descarta o mais antigo e o fundo
      // fica preto.
      renderer.dispose();
      renderer.forceContextLoss();
      uniformsRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 z-[1]" />;
};

export default ThreeCanvas;
