/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { findFreeSpot, findSpotNearest } from "../../utils/freeSpot";
import {
  CAMERA_FOV,
  CAMERA_Z,
  PARALLAX_WORLD,
  envelopeWorldRadius,
  viewportBudget,
} from "../../utils/screenBudget";

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
 * Contrato com o LAYOUT: o grupo 3D não é posicionado por breakpoint. Quem marca o que ocupa
 * espaço é o Hero, com `data-hero-occupied` (logo, as duas navs, as cinco folhas do bloco de
 * texto — as de texto puro com `="ink"`, que mede a tinta em vez da caixa, e o painel de
 * calibração); este componente mede essas caixas em `adjustLayout` e resolve a posição com as
 * duas buscas de `src/utils/freeSpot.js`. O TAMANHO sai de `src/utils/screenBudget.js`: o
 * orçamento da tela (folga, teto, piso, pixelRatio, recuo, piso de tamanho do centrado) e a
 * inversão da escala pela silhueta.
 *
 * A ORDEM DE PRIORIDADE é a do dono do projeto, e é o que a busca implementa: primeiro
 * "sem sobreposição" (restrição dura — nada é desenhado por cima de conteúdo), depois
 * "tamanho relativo e importante" (o maior vão livre é a régua de tamanho), e por último
 * "tente ficar no centro da tela" (a posição mais central que não custe mais de 10% desse
 * tamanho). As três não cabem juntas em toda tela: num hero de duas colunas o meio da tela é
 * um corredor entre o texto e o painel. Por isso o centro é o que cede, nunca o tamanho nem a
 * ausência de sobreposição.
 *
 * Somar um elemento fixo novo ao Hero? Marque-o — senão a esfera pode cair em cima dele.
 * Nada está isento, nem o vidro: a esfera passa POR TRÁS do painel, mas atravessá-lo por
 * baixo da moldura lia como defeito.
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
      CAMERA_FOV,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, CAMERA_Z);

    // Em telas touch não existe hover: o mousemove sintético que o navegador dispara no
    // toque movia a câmera junto com o dedo. É capacidade do dispositivo, não tamanho de
    // tela — e o orçamento abaixo usa isto para não reservar folga de paralaxe onde a
    // câmera não anda.
    const hasPointer = !window.matchMedia("(hover: none)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // `pixelRatio`, recuo em `z`, teto e piso da esfera saem todos da MESMA função: o que
    // uma tela deste tamanho dá para o fundo 3D (src/utils/screenBudget.js).
    const budget = viewportBudget(container.clientWidth, container.clientHeight, {
      hasPointer,
      devicePixelRatio: window.devicePixelRatio,
    });
    renderer.setPixelRatio(budget?.pixelRatio ?? 1);
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
      // Sem desconto de opacidade no mobile: era um paliativo para o enxame cair
      // atrás do texto, e o `adjustLayout` abaixo resolveu isso na raiz — não há
      // mais sobreposição para o AdditiveBlending lavar. O slider manda sozinho.
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

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (hasPointer) document.addEventListener("mousemove", handleMouseMove);

    // container, não window: o container É o hero.
    //
    // Raio de MUNDO com que o grupo é desenhado: a maior das três órbitas
    // (`createTechOrbit(6.0)`), que é o que o olho lê como a esfera.
    //
    // É uma CONSTANTE de propósito, e não o raio vivo do grupo: a nuvem de pontos cresce com
    // o slider `distortion` (4.0 do icosaedro + distortion + 0.8 do empurrão do vértice sob o
    // cursor, até 6.8). Se a escala fosse `ρ / raioVivo`, arrastar "Flux Dynamics" de 0.6 para
    // 2.0 faria as ÓRBITAS ENCOLHEREM 12% — o slider mudaria o tamanho da única coisa que se
    // vê. Com a referência fixa o slider não mexe no tamanho, e por isso este componente não
    // precisa re-rodar `adjustLayout` quando `distortion` muda.
    //
    // O excesso da nuvem no extremo do slider quase fica coberto, mas não inteiramente: a 100% de
    // distortion ela chega a ~113% de `ORBIT_RADIUS` de mundo (4,0 do icosaedro + 2,0 do ruído +
    // 0,8 do empurrão do vértice sob o cursor) e desenha ~15% de `usedPx` além do círculo
    // reservado. Como o excesso é RELATIVO e o respiro do orçamento é ABSOLUTO (24px + 8px da
    // animação), os dois só se equivaleriam por volta de `usedPx ≈ 210px` — e desde que a esfera
    // foi para o centro da tela ela passa disso: medido projetando a casca externa, o excesso é de
    // ~31px em 1024×768, ~43px em 1440×900 e ~69px em 2560×1440, ou seja, mais que o respiro em
    // todo desktop. Quem absorve é a folga da PARALAXE (~27px num hero de 900px, ~43px num de
    // 1440px), que existe exatamente para o deslocamento da câmera: o excesso só vira encosto com
    // o ponteiro no canto E o slider no máximo E o ruído saturando no mesmo vértice do cursor.
    // No valor padrão do slider (0,6) a nuvem fica a 79% do círculo e não há excesso NENHUM.
    // É uma troca consciente: as ÓRBITAS ditam o círculo (ficam dentro dele por construção, e são
    // o que o olho lê como a esfera), e a alternativa — os raios da nuvem ditando — encolheria as
    // órbitas ~13% em todo viewport, que é justamente o defeito que a inversão da silhueta veio
    // corrigir.
    const ORBIT_RADIUS = 6.0;

    /**
     * Caixas que ocupam espaço no Hero, em px relativos ao container.
     *
     * Quem se marca é o próprio Hero (`data-hero-occupied` no logo, nas duas navs, nas cinco
     * folhas do bloco de texto e no painel de calibração). Ler o DOM aqui — em vez de receber
     * medidas por prop — mantém o contrato do componente intacto (as 5 props que viram uniforms
     * continuam sendo 5) e evita ter que subir ref de dois componentes. Roda no resize e no
     * mount, nunca no RAF.
     *
     * A BUSCA É NO PAI, não no container: o div deste componente é `absolute inset-0`
     * e IRMÃO do wrapper do Hero, então querySelectorAll aqui dentro não acharia
     * marcador nenhum — o pai é o <section> que contém os dois. As coordenadas
     * continuam relativas ao container, que é a área que a câmera enquadra.
     *
     * `data-hero-occupied="ink"` mede a TINTA em vez da caixa. Um `<h1>`/`<p>` é bloco: a
     * caixa vai até a borda da coluna mesmo quando a última palavra termina 200px antes, e
     * é isso que a esfera precisa saber para caber à DIREITA do nome. Em 1440×900 o `h1`
     * tem 896px de caixa e ~620px de tinta — eram esses ~276px que faltavam. É o mesmo erro
     * do `lg:pr-80` (padding dentro da caixa medida), um nível abaixo. Um `Range` sobre o
     * conteúdo devolve a união dos retângulos do TEXTO. Só vale a pena onde a caixa mente:
     * nas folhas `flex` (eyebrow, CTAs) e nas caixas COM moldura visível (as duas navs, os
     * chips, o LangToggle) a caixa É a tinta — medi-los por `Range` encolheria o obstáculo
     * para dentro da moldura e a esfera poderia encostar nela.
     */
    const unite = (a, b) => ({
      left: Math.min(a.left, b.left),
      right: Math.max(a.right, b.right),
      top: Math.min(a.top, b.top),
      bottom: Math.max(a.bottom, b.bottom),
    });

    const measure = (element) => {
      if (element.dataset.heroOccupied !== "ink") return element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      const ink = range.getBoundingClientRect();
      // O `Range` pega só NÓS DE TEXTO, e a folha pode ter tinta que não é texto: o
      // ponto de acento do eyebrow é um `<div>` de 8px, e medir só a tinta do rótulo
      // deixaria a esfera passar por cima dele. A união com as caixas dos filhos cobre
      // o resto — e não encolhe nada, porque é união (nos CTA os filhos são os
      // próprios botões, dimensionados pelo conteúdo).
      const boxes = [];
      if (ink.width > 0 && ink.height > 0) boxes.push(ink);
      for (const child of element.children) {
        const rect = child.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) boxes.push(rect);
      }
      // Elemento vazio ou `display: none`: não há tinta, e a caixa (0×0 no caso do
      // segundo) é a resposta certa.
      return boxes.length ? boxes.reduce(unite) : element.getBoundingClientRect();
    };

    const occupiedRects = () => {
      const scope = container.parentElement ?? container;
      const base = container.getBoundingClientRect();
      return Array.from(scope.querySelectorAll("[data-hero-occupied]")).map((element) => {
        const rect = measure(element);
        return {
          left: rect.left - base.left,
          right: rect.right - base.left,
          top: rect.top - base.top,
          bottom: rect.bottom - base.top,
        };
      });
    };

    /**
     * Posiciona e escala o grupo onde o layout deixar, em vez de por breakpoint.
     *
     * Já foi tentado duas vezes com números fixos e falhou nas duas: a esfera ficava
     * atrás do painel de calibração no desktop e atrás do texto no celular. A altura
     * do texto é em PIXELS e a viewport em `svh`, então a sobra depende da largura e
     * da altura ao mesmo tempo — não existe constante que sirva de 320 a 2560px.
     *
     * A escala é o outro lado da mesma moeda: aqui a esfera não é desenhada com o
     * tamanho que o vão reservou, ela é desenhada com o tamanho que a SILHUETA dela
     * ocupa dentro desse vão (a inversão está em `envelopeWorldRadius`). Medir a
     * projeção no polo próximo do grupo, como era feito antes, deixava a esfera
     * desenhando 63% (desktop) a 72% (mobile) do vão reservado.
     *
     * A POSIÇÃO é uma troca explícita entre as três exigências do dono, na ordem em que ele
     * as deu: sem sobreposição (restrição dura — nenhum ponto devolvido pelas duas buscas
     * cruza um retângulo medido, com a folga incluída), tamanho relativo e importante (o maior
     * vão livre é a régua), e "tente ficar no centro da tela" (a posição mais central que
     * ainda tenha pelo menos `centerSizeFloor` do raio do maior vão).
     *
     * AS DUAS BUSCAS, nesta ordem:
     *   1. `findFreeSpot` sem trava dá o MAIOR círculo — é o tamanho de referência.
     *   2. `findSpotNearest` procura a posição mais perto do centro da tela que ainda alcance
     *      `floorRadiusPx` e `centerSizeFloor · raio do maior`. Devolvida, ela ganha; `null`,
     *      fica o maior vão.
     *
     * Medido no DOM real em 1409×804: o maior círculo é ∅360 na faixa de cima (o texto ocupa a
     * esquerda de baixo, o painel a direita de baixo) e o maior centrado é ∅198 — o meio da tela
     * é um corredor entre os dois. Com `centerSizeFloor = 0,9` (perder no máximo 10% do raio) a
     * esfera sai em ∅324, 40% da altura da tela, já deslocada para o centro em `x`. Centrar sem
     * piso custaria 45% do tamanho, e é por isso que o piso existe: o dono quer a esfera
     * "importante na exibição" antes de querer ela no centro.
     *
     * O plano B (só o maior vão) é o que mantém COLUNA ÚNICA (telefone, tablet em retrato)
     * exatamente com a composição aprovada: ali o centro é o próprio bloco de texto, nenhuma
     * posição perto dele alcança o piso de tamanho, a segunda busca devolve `null` e a esfera
     * preenche o vão encostando no canto — como antes.
     */
    const adjustLayout = () => {
      const { clientWidth: width, clientHeight: height } = container;
      if (!width || !height) return;

      // Tudo que depende do TAMANHO da tela vem de uma função pura, exercitável em Node.
      const budget = viewportBudget(width, height, {
        hasPointer,
        devicePixelRatio: window.devicePixelRatio,
      });
      if (!budget) return;
      const { fPx, distance, recoilZ, capRadiusPx, floorRadiusPx, marginPx, centerSizeFloor } =
        budget;

      const rects = occupiedRects();
      // O plano B, e também a régua de tamanho do dono ("o vão decide"): o maior círculo, sem
      // folga contra as bordas, que é a composição aprovada no telefone e no tablet (a esfera
      // preenchendo o canto).
      const bestSpot = findFreeSpot(width, height, rects, { margin: marginPx });
      const centeredSpot = findSpotNearest(width, height, rects, {
        margin: marginPx,
        // SEM folga de borda (`edgeMargin`), ao contrário do que parecia natural: quando o maior
        // círculo está encostado numa borda — e no desktop ele está, no topo — exigir 56px de
        // folga das quatro bordas tira ~15% do raio dele, e aí o centrado sai MENOR que o plano
        // B mesmo respeitando o piso. O `minRadius` cobre o que a folga de borda cobria:
        // `floorRadiusPx` é o piso de "aparecer", e a esfera que fica no centro não encosta em
        // borda nenhuma (quem encosta é o plano B, e ali encostar é a composição aprovada).
        minRadius: floorRadiusPx,
        sizeFloor: centerSizeFloor,
      });
      const spot = centeredSpot ?? bestSpot;

      if (!spot || spot.radius < floorRadiusPx) {
        systemsGroup.visible = false;
        return;
      }
      systemsGroup.visible = true;

      const usedPx = Math.min(spot.radius, capRadiusPx);
      const offsetPx = Math.hypot(spot.x - width / 2, spot.y - height / 2);
      const envelope = envelopeWorldRadius({ usedPx, fPx, distance, offsetPx });
      systemsGroup.scale.setScalar(envelope / ORBIT_RADIUS);

      // Centro do grupo: converte a posição em px para unidades de mundo. A referência é o
      // plano do CENTRO do grupo (`recoilZ`), que é onde ele está de fato. A altura visível
      // naquele plano é `2 · distance · tan(fov/2)`, que é o mesmo que `height · distance / fPx`.
      const visibleHeight = (height * distance) / fPx;
      const visibleWidth = visibleHeight * (width / height);
      systemsGroup.position.set(
        (spot.x / width - 0.5) * visibleWidth,
        (0.5 - spot.y / height) * visibleHeight,
        recoilZ
      );
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

    // Medir uma vez no mount não basta: Inter e JetBrains Mono vêm do Google Fonts e
    // chegam DEPOIS, e o texto medido com a fonte de fallback tem outra altura. O
    // ResizeObserver não cobre isso — o container é `inset-0` e o hero é `min-h-screen`,
    // então a caixa não muda de tamanho quando o texto cresce dentro dela.
    let fontsSettled = false;
    document.fonts?.ready.then(() => {
      if (fontsSettled) return;
      adjustLayout();
    });

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

      // PARALLAX_WORLD é a MESMA constante que a folga de posicionamento reserva para este
      // deslocamento (src/utils/screenBudget.js) — mudar a excursão aqui sem mudar lá deixaria
      // a esfera entrar no texto com o mouse no canto.
      camera.position.x += (mouseX * PARALLAX_WORLD - camera.position.x) * 0.05;
      camera.position.y += (mouseY * PARALLAX_WORLD - camera.position.y) * 0.05;
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
      // A promise de `document.fonts.ready` pode resolver depois do unmount (HMR,
      // StrictMode) e chamar adjustLayout sobre um grupo já descartado.
      fontsSettled = true;
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
