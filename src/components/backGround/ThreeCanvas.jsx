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
  radiusWithinGap,
  viewportBudget,
} from "../../utils/screenBudget";

/**
 * Raio de mundo da nuvem em REPOUSO (slider `distortion` em 0) e a subdivisão do icosaedro.
 *
 * A esfera cresceu TRÊS vezes em 2026-09-23, a pedido do dono ("pode aumentar um pouco o tamanho
 * da esfera", depois "ainda dá para aumentar um pouco mais", e por fim "ainda dá para aumentar um
 * pouco mais a esfera **e aumente as órbitas também** … quero que a esfera com as órbitas ocupem
 * o maior espaço possível de tela"). A alavanca NÃO é o vão (que já está no teto): é o quanto a
 * bola desenha DENTRO do círculo que o `radiusWithinGap` reserva. O que a guarda reserva é o PIOR
 * CASO da nuvem, `base + empurrão + topo do slider`, e o slider e o empurrão são orçamento que se
 * pode ceder para o raio-base:
 *
 *   4,0 + 0,8 + 2,0 = 6,8   (o original)   → repouso 77% do círculo
 *   4,8 + 0,8 + 1,2 = 6,8   (+17%)         → repouso 90%
 *   5,4 + 0,4 + 1,0 = 6,8   (+11%)         → repouso 100%
 *   5,4 + 0,4 + 0,8 = 6,6   (atual)        → repouso 100% E o círculo maior
 *
 * AS TRÊS PRIMEIRAS TROCAM DENTRO DA SOMA (6,8), e por isso o `cloudRatio` é idêntico nelas: a
 * guarda devolve exatamente os mesmos números em toda tela, o pior caso não cresce (∅755 e 28px de
 * folga no monitor do dono, igual) e o raio reservado não muda uma vírgula — o que muda é só o
 * repouso, e a bola passa a ENCHER o círculo reservado — que desde 2026-09-23 é só a régua DA
 * BOLA: as órbitas saíram para a envolvente da nuvem (`ORBIT_ENVELOPE_RATIO`, naquele mesmo dia).
 *
 * A QUARTA NÃO: ela BAIXA A SOMA. Com 100% de repouso a bola já não cresce mais dentro do círculo,
 * então o que cresce é o próprio círculo — e ele sai da folga (`marginPx`), que até aqui era
 * intocável porque encurtá-la fazia a guarda morder em tela larga. O teto da guarda é
 * `folga / (cloudRatio − 1)` (a conta está em `radiusWithinGap`): com o `cloudRatio` em 1,1333 a
 * folga valia só 7,5× ela mesma de raio, e cortar 16px de folga custava 20% do raio em 3440px.
 * Baixando o TOPO do slider para 0,8 o `cloudRatio` cai para 1,100 e o mesmo teto vira 10× a
 * folga: a folga de 16px passa a ser grátis em toda tela (a guarda morde 2% em 5120 e em 7680, os
 * mesmos casos de antes, e nada em 3440/3840), e o ganho é o círculo — medido no monitor do dono,
 * ∅666 → ∅692, com a bola em 100% dele. As duas alavancas ficam registradas aqui: dentro da soma
 * vale o empurrão, e fora dela o topo do slider compra folga.
 *
 * O preço já pago é o empurrão do vértice sob o cursor (0,8 → 0,4, ver `CURSOR_PUSH`); o preço
 * desta vez é o topo do slider (1,0 → 0,8, que segue com 0,6 — o padrão — a 75% da pista). O que
 * NÃO se pode é subir o raio-base sem ceder um dos dois: aí a soma passa de 6,6 e a guarda encolhe
 * a esfera em 3440/3840/5120.
 */
const CLOUD_BASE_RADIUS = 5.4;
// O ruído é amostrado na POSIÇÃO LOCAL (`pos * noiseFreq`): com o raio-base maior, a mesma
// frequência leria outra região do campo e o padrão de manchas aprovado mudaria de desenho. A
// frequência desce na mesma proporção (0,8 no raio 4,0) para o repouso continuar o MESMO
// desenho, só maior.
const CLOUD_NOISE_FREQ = (0.8 * 4.0) / CLOUD_BASE_RADIUS;
// A densidade da nuvem é N por 4πR²: com o raio maior e o mesmo número de pontos o enxame
// ficaria mais rarefeito (e o AdditiveBlending menos brilhante). A subdivisão sobe na mesma
// proporção (o número de pontos vai com o quadrado dela) para a bola ser a mesma, maior.
const CLOUD_DETAIL = 27; // = 20 · 5,4/4,0
// Empurrão LOCAL do vértice sob o cursor (`interaction`), em mundo — a amplitude da bolha que
// segue o mouse. Era 0,8 e cedeu metade para o raio-base subir sem mexer no pior caso (ver o
// bloco do `CLOUD_BASE_RADIUS`). Interpolado no shader de propósito: é o TERCEIRO termo da soma
// que o `CLOUD_MAX_RATIO` fecha, e um número solto dentro do GLSL seria o único sem rastro.
const CURSOR_PUSH = 0.4;
/**
 * TOPO DO SLIDER "Flux Dynamics" do painel de calibração — o TERCEIRO termo da soma acima. Está
 * aqui, e não junto do painel, porque é ele que fecha o `CLOUD_MAX_RATIO` abaixo: mexer nele mexe
 * na guarda, nas órbitas e no tamanho da esfera em tela larga ao mesmo tempo.
 */
const SLIDER_MAX_DISTORTION = 0.8; // = SLIDERS[0].max no HeroCalibration

/**
 * Raio de MUNDO com que a nuvem em REPOUSO é desenhada — o círculo que o `radiusWithinGap` reserva
 * na tela (`usedPx`). É a régua do tamanho: o que o dono aprova como "o tamanho da esfera".
 *
 * É uma CONSTANTE de propósito, e não o raio vivo do grupo: a nuvem cresce com o slider
 * `distortion` (5,4 do icosaedro + distortion + 0,4 do empurrão do vértice sob o cursor, até 6,6).
 * Se a escala fosse `ρ / raioVivo`, arrastar "Flux Dynamics" de 0.6 para o topo faria as ÓRBITAS
 * ENCOLHEREM — o slider mudaria o tamanho da única coisa que se vê. Com a referência fixa o slider
 * não mexe no tamanho, e por isso este componente não precisa re-rodar `adjustLayout` quando
 * `distortion` muda. A escala do grupo é `envelopeWorldRadius(usedPx) / ORBIT_RADIUS`.
 *
 * O EXCESSO DA NUVEM. No topo do slider ela chega a 110% de `ORBIT_RADIUS` de mundo e desenha mais
 * que isso além do círculo reservado (a inversão da silhueta é convexa, então +10% de raio de mundo
 * dá mais de +10% de raio em tela). Como o excesso é RELATIVO (proporcional ao raio) e a folga de
 * `marginPx` é ABSOLUTA (16px + 8px + a paralaxe, ~h/45), os dois só se cobrem enquanto a esfera é
 * pequena: o excesso passa a folga quando o raio passa de ~40% da altura. Quem resolve é o
 * `radiusWithinGap`: onde a nuvem cabe (praticamente toda tela) o raio não muda NADA, e onde não
 * cabe ele cede o mínimo — em 5120×1440 e em 7680×4320 ele cede 2% (medido; são os mesmos casos de
 * antes, quando cedia 3% com a folga maior). A régua do tamanho segue sendo o vão.
 */
const ORBIT_RADIUS = 6.0;

/**
 * Raio máximo da nuvem, em mundo LOCAL, dividido pelo raio das órbitas — o contrato com o shader,
 * escrito uma vez: `CLOUD_BASE_RADIUS` (5,4) é o `IcosahedronGeometry`, `CURSOR_PUSH` (0,4) é o
 * `interaction * ` do `gl_Position` (o empurrão do vértice sob o cursor) e `SLIDER_MAX_DISTORTION`
 * (0,8) é o TOPO DO SLIDER "Flux Dynamics" do painel. Os três somam 6,6 (110,0% de `ORBIT_RADIUS`)
 * e é essa SOMA que é o contrato, nos dois sentidos: subir o raio-base só é gratuito se o empurrão
 * ou o topo cederem na mesma medida (o `CLOUD_MAX_RATIO` não muda e o `radiusWithinGap` devolve os
 * mesmos números em toda tela), e BAIXAR a soma é o que torna a folga barata — o teto da guarda é
 * `folga / (cloudRatio − 1)`, então 1,1333 → 1,100 multiplica por 1,33 o raio que a mesma folga
 * sustenta (é essa a alavanca de 2026-09-23 que aumentou as órbitas, ver o bloco do
 * `CLOUD_BASE_RADIUS`). `uSize` não entra: ele só muda o `gl_PointSize`, não a posição dos vértices.
 *
 * ELE DEIXOU DE SER SÓ O PIOR CASO DA NUVEM. A desigualdade que o `radiusWithinGap` fecha é
 * `cloudRatio · h(usedPx) <= h(obstaclePx)`, ou seja: a silhueta de mundo `1,1 · h(usedPx)` não
 * alcança o obstáculo mais próximo (a folga de `marginPx` fica FORA dessa conta). As ÓRBITAS são
 * desenhadas exatamente nessa envolvente desde 2026-09-23 (`ORBIT_ENVELOPE_RATIO`, logo abaixo), e
 * herdam a garantia inteira: um anel de raio de mundo `R` está sobre a casca da esfera de raio `R`,
 * e a imagem dessa esfera é a região da silhueta — logo o anel não sai dela. O que era o teto de
 * uma tinta virou o teto das duas, e é por isso que este número é o teto daquele.
 */
const CLOUD_MAX_RATIO = (CLOUD_BASE_RADIUS + CURSOR_PUSH + SLIDER_MAX_DISTORTION) / ORBIT_RADIUS;

/**
 * Onde as três órbitas são desenhadas, como múltiplo do círculo reservado — o pedido do dono de
 * 2026-09-23: *"as órbitas também estão nesse limite, tipo a esfera ocupa 100% do espaço, porém
 * gostaria que as órbitas ficassem em 110%, por exemplo, pois tem espaço na tela para isso"*.
 * Em 100% os três anéis ficavam na borda da bola (a de fora ERA o círculo, por construção); a bola
 * fica onde ele aprovou e só os anéis andam para fora — em tela, ~+10% de diâmetro no de fora.
 *
 * É DERIVADO do `CLOUD_MAX_RATIO`, e não o literal 1,1, por um motivo só: acima dele as órbitas
 * saem da garantia do `radiusWithinGap` e poderiam encostar no texto ou no painel no extremo do
 * slider — a restrição dura do dono. Escrito como derivação, o teto não pode ser furado por
 * descuido (quem mexer na soma da nuvem move as órbitas junto) e o 1,1 deixa de existir como
 * segunda cópia de um número que já mora na soma.
 *
 * E PARA QUEM FOR MEXER AQUI: subir as órbitas além de 110% NÃO se resolve subindo este número —
 * ele não é uma alavanca, é a igualdade com a envolvente. As saídas são a soma da nuvem (que
 * encolhe o círculo reservado, ou seja, encolhe a bola aprovada) ou aceitar sobreposição no topo do
 * slider. Há um acoplamento no outro sentido, e ele é visível: se um dia o topo do slider baixar, as
 * órbitas encolhem junto com a envolvente que as define.
 */
const ORBIT_ENVELOPE_RATIO = CLOUD_MAX_RATIO;

/**
 * A BOLINHA que percorre cada órbita — o terceiro item do sistema de órbitas, pedido em
 * 2026-09-23: *"adicione também, 1 esfera a cada órbita que «ande» pela linha da órbita, e coloque
 * a velocidade dela de acordo com a taxa de clock"*. Uma por anel, com o CENTRO sobre a linha (a
 * posição dela é um ponto da mesma `EllipseCurve` que desenhou o anel) e o passo amarrado à "Taxa de
 * Clock" do painel — que é a prop `speed`, o mesmo número que já acelera a nuvem e o relógio.
 *
 * RAIO LOCAL, E É POR ISSO QUE ELE NÃO É UM NÚMERO EM PX. A bolinha é FILHA do anel, que é filho do
 * `lineGroup` dentro do `systemsGroup` — o grupo que o `adjustLayout` escala por
 * `envelopeWorldRadius(usedPx) / ORBIT_RADIUS`. Logo ela cresce junto com a esfera e com os anéis,
 * em toda tela, sem uma medida a mais. Em tela: o diâmetro dela é ~1/120 do diâmetro do anel
 * (~5,8px no monitor do dono, ∅692). Comparar com um ponto da nuvem é tentador e engana, porque o
 * `gl_PointSize` do shader é medido em px de FRAMEBUFFER e não acompanha a escala do grupo (fica em
 * ~2px de framebuffer, ~1px de CSS num monitor 2×): no desktop a bolinha é bem maior que um ponto,
 * e no telefone a diferença encolhe (lá ela sai com ~2,6px de CSS). O que importa é que ela se lê.
 *
 * E O QUE ELA ACRESCENTA AO LIMITE É O PRÓPRIO RAIO: o anel de fora é desenhado no teto da guarda
 * (`ORBIT_ENVELOPE_RATIO`) e a bolinha passa dele em `BEAD_RADIUS` — ~3px de tela. Quem absorve isso
 * é o `marginPx`, que fica FORA da envolvente: no mínimo 24px (tela de toque, sem parcela de
 * paralaxe). A folga continua 8× maior que o excesso, então "sem sobreposição" segue garantido — mas
 * é daqui que sai o teto se alguém quiser uma bolinha muito maior.
 */
const BEAD_RADIUS = 0.05;
/**
 * Passo angular da bolinha, em radianos por unidade do RELÓGIO do RAF — `timeRef`, o mesmo que
 * alimenta `uTime` e que anda `0,01 + 0,05 · taxa de clock` por QUADRO. A velocidade não é lida em
 * segundos de propósito: é a unidade da cena inteira, e é o que faz a "Taxa de Clock" mover a
 * bolinha na MESMA proporção que move a nuvem (o pedido do dono).
 *
 * Multiplicado por `(índice + 1)`, como o giro dos anéis. E ela anda duas vezes, porque o giro do
 * anel a carrega junto: no padrão do clock as duas parcelas são iguais (`0,003 · (índice+1)` por
 * quadro cada), e é a SOMA que se lê como velocidade. A 60 fps, uma volta COMPLETA (o que o olho
 * vê) leva — com a taxa padrão (0,1): ~5,8s a de fora, ~8,7s a do meio e ~17,5s a de dentro; no
 * topo da pista (0,5): ~3,5s / ~5,2s / ~10,5s; no zero: ~7,0s / ~10,5s / ~21s, onde o termo
 * constante do relógio (0,01 por quadro) mantém tudo andando. Não é alavanca de tamanho nem de
 * layout: mexer aqui só muda o passo das bolinhas.
 */
const BEAD_ANGLE_RATE = 0.2;

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

      float noiseFreq = ${CLOUD_NOISE_FREQ.toFixed(4)};
      float noiseAmp = uDistortion;
      float noise = snoise(vec3(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq, pos.z * noiseFreq));

      vNoise = noise;

      vec3 newPos = pos + (normalize(pos) * noise * noiseAmp);

      float dist = distance(uMouse * 10.0, newPos.xy);
      float interaction = smoothstep(5.0, 0.0, dist);
      newPos += normalize(pos) * interaction * ${CURSOR_PUSH.toFixed(2)};

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

    // A subdivisão vem de `CLOUD_DETAIL` (era 20; 35 → 20 foi um corte de vértices que o raio
    // maior desfez em parte — ver o comentário da constante).
    const geometry = new THREE.IcosahedronGeometry(CLOUD_BASE_RADIUS, CLOUD_DETAIL);

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

    /**
     * As ÓRBITAS — o que o dono pediu para "aumentar também, para que apareçam" (2026-09-23).
     *
     * ELAS NÃO APARECIAM POR COR, não por tamanho nem por posição. O material era `0x27272a`
     * (zinc-800) com `opacity 0.5`: sobre o `#050505` do hero isso compõe ~rgb(22,22,27) — a 17
     * níveis do fundo, invisível num fio de 1px, e nenhuma mudança de raio resolveria. Agora é
     * `0x52525b` (zinc-600) a 0,75, que compõe ~rgb(63,63,69): 58 níveis acima do fundo, um fio
     * de instrumento que se lê sem competir com o texto (a nuvem é `#d4d4d8`, 212).
     *
     * E ELAS NUNCA SÃO OCLUÍDAS PELA NUVEM: `particles` é `depthWrite: false` e `AdditiveBlending`,
     * e o `lineGroup` entra DEPOIS dele no mesmo grupo, então as linhas são desenhadas por cima e
     * visíveis mesmo onde a bola está densa. É também por isso que resolvê-las por FORA funciona:
     * um anel além da casca da nuvem continua desenhado por cima dela, e não some atrás.
     *
     * ONDE ELAS SÃO DESENHADAS (o segundo pedido de 2026-09-23). *"as órbitas também estão nesse
     * limite, tipo a esfera ocupa 100% do espaço, porém gostaria que as órbitas ficassem em 110%,
     * por exemplo, pois tem espaço na tela para isso"*. Em 100% o anel de fora ERA o círculo
     * reservado, por construção: a escala do grupo é `envelopeWorldRadius(usedPx) / ORBIT_RADIUS` e
     * a órbita de fora tem raio de mundo `ORBIT_RADIUS`. Então "aumentar as órbitas" era aumentar o
     * círculo — e o círculo é a bola, que o dono acabou de aprovar. A saída não é o círculo e não é
     * raspá-lo por dentro: é a ENVOLVENTE da nuvem, `ORBIT_ENVELOPE_RATIO` (110% do círculo), que a
     * guarda já reservava para o pior caso do slider. Os três raios sobem JUNTOS, então a família
     * se preserva (o espaçamento de 0,4 entre um e outro vira 0,44) e a nuvem fica byte a byte onde
     * estava: quem lê "esfera com órbitas" vê um conjunto ~10% maior sem a bola mudar de tamanho
     * nem de lugar. Os raios base são os de 2026-09-23 (`5,2 / 5,6 / 6,0`, espaçados de 0,4 em 0,4
     * para os três lerem como família e não como dois anéis colados) e a razão vive no topo do
     * arquivo, onde está o porquê de 110% ser o teto.
     *
     * O PREÇO, EXPLÍCITO. Os anéis passam a gastar a folga que a guarda reservava para a nuvem no
     * extremo do slider: no topo do "Flux Dynamics" a nuvem alcança os mesmos 6,6 de mundo e os
     * anéis coincidem com ela de novo (é o desenho funcionando como projetado, não um defeito —
     * quem arrasta o slider até o fim recolhe os anéis para dentro da bola). A folga de `marginPx`
     * continua fora dessa conta, e é ela que separa do texto e do painel: medido projetando os três
     * anéis sob 60 rotações do grupo nos viewports do `DESIGN.md`, o de fora fica a 0–2px do teto da
     * guarda POR DENTRO — nunca além dele, em nenhuma tela.
     *
     * E as BOLINHAS que andam sobre elas (o pedido seguinte, no mesmo dia) são filhas destes anéis e
     * saem do mesmo material — o porquê do raio, do material e do passo está nas duas constantes do
     * topo do arquivo (`BEAD_RADIUS` / `BEAD_ANGLE_RATE`).
     */
    // Uma geometria e um material para as TRÊS bolinhas: elas são idênticas, só a posição muda a
    // cada quadro. Criados aqui dentro, e não no escopo do módulo, para o cleanup deste efeito
    // descartá-los como descarta o resto (o efeito roda de novo a cada HMR e no StrictMode).
    const beadGeometry = new THREE.SphereGeometry(BEAD_RADIUS, 12, 12);
    // Um degrau acima do fio: `0x71717a` (zinc-500) contra o `0x52525b` (zinc-600) a 0,75 da linha,
    // que compõe rgb(63,63,69) sobre o fundo. Um disco CHEIO na mesma cor leria quase igual ao fio,
    // e a bolinha é justamente o que precisa se ler como algo ANDANDO. Continua bem abaixo da nuvem
    // (#d4d4d8 está em 212), então não compete com a bola — e não segue a prop `color`: a cor do
    // painel é do perfil de energia da nuvem, os anéis e as bolinhas são o instrumento.
    const beadMaterial = new THREE.MeshBasicMaterial({ color: 0x71717a });

    const createTechOrbit = (radius, rotation) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(128);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x52525b,
        transparent: true,
        opacity: 0.75,
      });
      const orbit = new THREE.Line(geo, mat);
      orbit.rotation.x = rotation.x;
      orbit.rotation.y = rotation.y;
      // A bolinha é FILHA do anel, e é isso que faz "andar pela linha" ser uma conta de uma linha:
      // ela herda a inclinação do anel (o `rotation` acima) e é carregada pelo giro `rotation.z`
      // dele, então basta girar o ângulo dela no plano LOCAL do anel — lá dentro a elipse é o
      // círculo de raio `radius` que a `EllipseCurve` desenhou. A posição inicial `(radius, 0)` é o
      // ângulo zero dessa mesma curva; o RAF reescreve a posição a cada quadro.
      const bead = new THREE.Mesh(beadGeometry, beadMaterial);
      bead.position.set(radius, 0, 0);
      orbit.add(bead);
      lineGroup.add(orbit);
      return { line: orbit, bead, radius };
    };

    // Ordem = velocidade de giro (`rotation.z += 0.003 * (índice + 1)` no RAF, e as bolinhas
    // acompanham com o mesmo fator): o de fora fica por último para continuar sendo o mais rápido,
    // como era antes. Os raios saem multiplicados por `ORBIT_ENVELOPE_RATIO` (5,72 / 6,16 / 6,6 de
    // mundo) contra uma nuvem em repouso de 6,0: o de fora fica FORA da bola, o do meio pica a casca
    // dela e o de dentro continua dentro.
    const orbits = [
      createTechOrbit(5.2 * ORBIT_ENVELOPE_RATIO, { x: Math.PI / 3, y: Math.PI / 6 }),
      createTechOrbit(5.6 * ORBIT_ENVELOPE_RATIO, { x: Math.PI / 2, y: 0 }),
      createTechOrbit(6.0 * ORBIT_ENVELOPE_RATIO, { x: Math.PI / 1.8, y: Math.PI / 4 }),
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
    // `ORBIT_RADIUS`, o `CLOUD_MAX_RATIO` e o `ORBIT_ENVELOPE_RATIO` moram no topo do arquivo,
    // junto da soma da nuvem que os define (e o porquê de cada um está lá): a escala do grupo
    // divide por `ORBIT_RADIUS`, aqui embaixo no `adjustLayout`, e as órbitas acima são desenhadas
    // a `ORBIT_ENVELOPE_RATIO` vezes ele.

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
     * Medido no DOM real, o piso decide se a faixa viável EXISTE no centro — não só onde ela
     * fica. A bolsa central é uma porteira entre duas quinas (o canto inferior esquerdo da nav e
     * a borda de cima do `h1`) e no desktop largo ela é estreita: em 2529×1344 admite no máximo um
     * círculo de raio 341px, que é 0,84 do maior vão (∅833, no corredor da direita, atrás do
     * painel). Com o piso em `0,9` a porteira fica FECHADA e a esfera é empurrada para a direita
     * (57% da largura em 2529×1344; 79% em 2560×1320, que é o monitor do dono com a moldura do
     * navegador) — a queixa de que ela "aparece à direita da tela e não centralizada". Com `0,8`
     * ela abre, e a esfera fica em 50% da largura. Em 1409×804 o maior círculo é ∅359 na faixa de
     * cima (o texto ocupa a esquerda de baixo, o painel a direita de baixo) e a escolhida sai em
     * ∅288, 36% da altura, já deslocada para o centro em `x`; centrar sem piso nenhum custaria
     * 46% do tamanho — é por isso que o piso existe: o dono quer a esfera "importante na exibição"
     * antes de querer ela no centro.
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

      if (!spot) {
        systemsGroup.visible = false;
        return;
      }

      const offsetPx = Math.hypot(spot.x - width / 2, spot.y - height / 2);
      // O vão e o teto dizem quanto cabe ao CÍRCULO reservado (a régua da nuvem em repouso); o
      // `radiusWithinGap` confere se a tinta TODA no pior caso — a nuvem no extremo do slider e as
      // ÓRBITAS, que são desenhadas na mesma envolvente (`ORBIT_ENVELOPE_RATIO`) — ainda cabe no
      // mesmo lugar. Onde ela cabe — praticamente toda tela —, ele devolve o teto intacto.
      const usedPx = radiusWithinGap({
        ceilingPx: Math.min(spot.radius, capRadiusPx),
        obstaclePx: spot.obstacle,
        fPx,
        distance,
        offsetPx,
        cloudRatio: CLOUD_MAX_RATIO,
      });

      if (usedPx < floorRadiusPx) {
        systemsGroup.visible = false;
        return;
      }
      systemsGroup.visible = true;

      const envelope = envelopeWorldRadius({ usedPx, fPx, distance, offsetPx });
      // A escala é o CÍRCULO RESERVADO: `ORBIT_RADIUS` de mundo vira `usedPx` em tela. As órbitas
      // estão em `ORBIT_ENVELOPE_RATIO · ORBIT_RADIUS` de mundo, ou seja, desenham 110% dele por
      // fora (e a nuvem, que vai de 5,4 a 6,6 de mundo conforme o slider, desenha de 90% a 110%).
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
      orbits.forEach(({ line, bead, radius }, i) => {
        line.rotation.z += 0.003 * (i + 1);
        // A bolinha anda pela linha. O ângulo é função PURA do relógio — nada acumula aqui dentro,
        // senão o passo dependeria de quantos quadros o RAF já deu — e o fator `(i + 1)` a faz
        // acompanhar o giro do próprio anel. A fase inicial de 120° por índice só espalha as três,
        // para não nascerem alinhadas.
        const angle = timeRef.current * BEAD_ANGLE_RATE * (i + 1) + (i * Math.PI * 2) / 3;
        bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
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
      orbits.forEach(({ line }) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      // Comuns às três bolinhas (ver a criação, acima do `createTechOrbit`).
      beadGeometry.dispose();
      beadMaterial.dispose();
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
