/**
 * Traduz o TAMANHO da tela nos números que o fundo 3D consome.
 *
 * POR QUE ISTO EXISTE. O ThreeCanvas já decidia três coisas por conta própria a partir de um
 * `container.clientWidth < 1024` solto no meio do código (o `pixelRatio` do renderer, o recuo
 * em `z` do grupo e, por tabela, a folga de posicionamento). Isso espalhava a mesma decisão por
 * três lugares diferentes e não dava para exercitar nada — a conta da câmera (campo de visão,
 * distância, paralaxe) só existia como número mágico dentro do efeito de init.
 *
 * Aqui as duas contas puras do posicionamento moram juntas: o ORÇAMENTO que uma tela dá
 * (`viewportBudget`) e a inversão da escala da esfera envolvente (`envelopeWorldRadius`). As
 * duas são puras de propósito — sem DOM, sem three, sem React, sem listener, sem estado: dá
 * para exercitar em Node com larguras sintéticas, como o `freeSpot.js`.
 *
 * O QUE **NÃO** É. Isto não é detecção de viewport e não pode virar uma: não observa nada,
 * não guarda estado e não dirige layout. Recebe largura e altura JÁ MEDIDAS do container e
 * devolve números; todo valor devolvido só pode ser consumido pela camada 3D (câmera, escala,
 * posição, folga). Se algum dia um retorno daqui for parar num `className` ou num `style`, ele
 * não pertencia a esta função — é o teste que impede que ela vire o `isMobile` de volta.
 *
 * Pela mesma razão não existe nome de faixa (`'phone'`, `'tablet'`): um enum é convite a
 * `if (tier === …)` no JSX. Os campos são nomeados pelo que fazem, não pelo tamanho da tela.
 */

/** Geometria da câmera — a MESMA usada para construir a PerspectiveCamera no ThreeCanvas. */
export const CAMERA_FOV = 50;
export const CAMERA_Z = 18;
/**
 * Excursão da câmera que persegue o mouse, em unidades de mundo (o `mouseX` do loop de
 * animação vai de -1 a 1). Exportado porque a folga de paralaxe lá embaixo é uma CONTA sobre
 * este número: se um dia a excursão mudar, a folga tem que mudar junto, e com a constante
 * compartilhada isso acontece sozinho.
 */
export const PARALLAX_WORLD = 0.5;

/** O mesmo limiar do `lg` do Tailwind — abaixo dele o grupo recua em `z` (ver `recoilZ`). */
const RECOIL_WIDTH = 1024;
const RECOIL_Z = -6;

/**
 * Folga de respiro entre a esfera e o que estiver em volta. Eram 8px enquanto a esfera
 * desenhava ~63% do vão reservado (a sobra de 34% fazia as vezes de respiro); com a escala
 * corrigida por `envelopeWorldRadius` a tinta encosta mesmo no limite, e aí "encostar" volta a
 * ler como sobreposição. 24px é o mínimo que separa a órbita do texto.
 */
const BREATHING_PX = 24;
/**
 * Parcela da animação de entrada: o `animate-fade-in` do Hero começa em `translateY(8px)` e a
 * medição acontece no mount, com a animação ainda no quadro 0%. Nos elementos ancorados no
 * fundo (bloco de texto em `lg`, painel) o retângulo medido fica 8px ABAIXO do definitivo, e a
 * folga acima deles encolhe nesses 8px. Nos ancorados no topo o erro é para o lado conservador.
 */
const ENTRANCE_PX = 8;

/**
 * Teto de tamanho, como fração da ALTURA (o raio, não o diâmetro: `0,42 · altura` é um
 * diâmetro de ~84% da altura).
 *
 * Ele é guarda-chuva, e **nunca entra**. O vão do hero é uma FAIXA entre o texto e o painel, e
 * o raio dela não chega perto deste teto: medido no DOM real, o maior círculo livre é ∅360 em
 * 1409×804 (45% da altura, contra os 84% que o teto permitiria) e a proporção se mantém nas
 * outras viewports. Houve uma tentativa de baixá-lo para `0,32` enquanto a esfera estava no
 * centro vertical com o painel fora dos obstáculos — naquele arranjo o vão à direita virava
 * enorme e o teto passava a decidir. Com o painel de volta como obstáculo (a esfera não pode
 * atravessá-lo) o teto voltou a ser o que sempre foi: o freio contra número degenerado, porque
 * sem ele, num vão enorme, `ρ` se aproxima da distância até a câmera, a tangente de
 * `envelopeWorldRadius` explode e o `gl_PointSize` junto.
 */
const CAP_RATIO = 0.42;

/**
 * Quanto do MAIOR vão livre o posicionamento centrado pode custar, para a esfera chegar mais
 * perto do centro da tela. `0,9` = aceita perder até 10% do raio; `1` = nunca troca tamanho por
 * centralização (mantém exatamente a composição do maior vão); `0` = centra a qualquer preço.
 *
 * Existe porque as três exigências do dono — sem sobreposição, tamanho importante, centro —
 * não podem valer ao mesmo tempo, e a ordem de prioridade é dele: sobreposição é restrição
 * dura, tamanho vem antes de posição, e o centro é a que cede. Num hero de duas colunas o meio
 * da tela é um corredor entre o texto e o painel: em 1409×804 o maior círculo é ∅360 e o maior
 * centrado é ∅198, então centrar sem piso custaria 45% do tamanho. Com `0,9` a esfera sai em
 * ∅324 — 40% da altura — já deslocada para o centro em `x`.
 *
 * É DEVOLVIDO como número, e não aplicado aqui: quem sabe o raio do maior vão é o
 * `ThreeCanvas` (que chamou `findFreeSpot`), e esta função não conhece layout. O que mora aqui
 * é a política (quanto vale a pena perder), que é decisão de produto; o mecanismo (a busca)
 * mora no `freeSpot.js`.
 */
const CENTER_SIZE_FLOOR = 0.9;
/**
 * Piso para a esfera aparecer, como fração da MENOR dimensão. Abaixo disso ela é escondida em
 * vez de virar um ponto perdido no meio da tela. O piso de 48px preserva o comportamento que já
 * existia no celular (num 390×844, `0,12 · 390 = 47`, que cai no piso); o teto de 160px existe
 * para uma tela grande não esconder uma esfera perfeitamente visível.
 */
const FLOOR_RATIO = 0.12;
const FLOOR_MIN_PX = 48;
const FLOOR_MAX_PX = 160;

/**
 * `pixelRatio` do renderer: 2x em tela grande era caro num telefone. A regra continua sendo por
 * LARGURA (e não por área) de propósito — uma regra por área (`√(orçamento / área)`) foi
 * considerada e descartada porque mudaria o comportamento num tablet em retrato: 768×1024
 * passaria de 1,5 para 2.
 */
const DPR_SMALL = 1.5;
const DPR_LARGE = 2;

const TAN_HALF_FOV = Math.tan((CAMERA_FOV * Math.PI) / 360);

/**
 * O que uma tela de `width` × `height` (px do container, já medidos) dá ao fundo 3D.
 *
 * @param {number} width                              largura do container, em px
 * @param {number} height                             altura do container, em px
 * @param {{hasPointer?: boolean, devicePixelRatio?: number}} [options]
 *        `hasPointer` é a capacidade do dispositivo (`hover: none`), não o tamanho da tela:
 *        sem ponteiro o listener de `mousemove` não é registrado e a câmera não anda.
 * @returns {{fPx: number, distance: number, recoilZ: number, pixelRatio: number,
 *            capRadiusPx: number, floorRadiusPx: number, marginPx: number,
 *            centerSizeFloor: number} | null}
 */
export const viewportBudget = (width, height, { hasPointer = true, devicePixelRatio = 1 } = {}) => {
  if (!(width > 0) || !(height > 0)) return null;

  const isNarrow = width < RECOIL_WIDTH;

  // Recuo do grupo em `z`. Com a escala exata (ver `envelopeWorldRadius`) o recuo NÃO muda mais
  // o tamanho da esfera — `distance` já entra na equação. O que ele ainda faz: reduz a paralaxe
  // da câmera e achata a excentricidade das órbitas (a perspectiva fica menos agressiva). O
  // comentário antigo no ThreeCanvas dizia "perspectiva mais aberta, menos peso", que é o
  // contrário do que acontece.
  const recoilZ = isNarrow ? RECOIL_Z : 0;
  const distance = CAMERA_Z - recoilZ;

  // Distância focal em PIXELS: é o fator que converte um deslocamento lateral em px de tela
  // (x_px = fPx · x / profundidade), então serve tanto para a escala quanto para a folga.
  const fPx = height / 2 / TAN_HALF_FOV;

  return {
    fPx,
    distance,
    recoilZ,
    pixelRatio: Math.min(devicePixelRatio, isNarrow ? DPR_SMALL : DPR_LARGE),
    capRadiusPx: height * CAP_RATIO,
    floorRadiusPx: Math.min(
      Math.max(FLOOR_RATIO * Math.min(width, height), FLOOR_MIN_PX),
      FLOOR_MAX_PX
    ),
    // Não depende de `width`/`height` hoje: é política, não geometria. Está no orçamento para
    // o `ThreeCanvas` ter uma fonte só do que a tela dá — e para o dia em que o valor precisar
    // variar com a tela, a mudança ficar aqui, e não espalhada no componente.
    centerSizeFloor: CENTER_SIZE_FLOOR,
    marginPx:
      BREATHING_PX +
      ENTRANCE_PX +
      // A câmera anda até ±PARALLAX_WORLD de mundo atrás do mouse, e o grupo anda junto no
      // sentido oposto; o quanto isso é em PIXELS é `fPx · PARALLAX_WORLD / distance` (~27px
      // num hero de 900px, ~43px num de 1440 — nada perto dos 8px que a folga antiga supunha).
      // Em telas de toque não há paralaxe nenhuma para reservar: sem `hover`, o listener de
      // mousemove não existe e `mouseX` fica em 0.
      (hasPointer ? (PARALLAX_WORLD * fPx) / distance : 0),
  };
};

/**
 * Raio de MUNDO da esfera envolvente do grupo, tal que a silhueta dela em tela meça `usedPx`.
 *
 * A CONTA. Uma esfera de raio `ρ` a uma distância axial `d` da câmera desenha a silhueta
 * `fPx · ρ / √(d² − ρ²)` — é a TANGENTE à esfera, não a projeção do ponto mais próximo dela.
 * A versão anterior do ThreeCanvas escalava o grupo medindo a projeção no POLO PRÓXIMO
 * (`d − ρ`), e o grupo saía desenhando 63% (desktop) a 72% (mobile) do vão reservado. Medido
 * projetando pontos 3D reais: com esta inversão a silhueta bate 100% do alvo.
 *
 * FORA DO EIXO. Aquilo só é um círculo se a esfera estiver no eixo óptico, e o grupo nunca
 * está — ele mora no vão livre, por construção. Fora do eixo a projeção vira uma elipse
 * alongada na direção radial, e o excesso não é desprezível: medido em +21px com o centro a
 * 107px do eixo, +47px a 214px, +114px a 429px. Então a tangência é resolvida com o offset:
 * com `θ` = ângulo entre o eixo e a direção do centro e `α` = `asin(ρ/|C|)`, o excesso radial é
 * `fPx · (tan(θ + α) − tan θ)`. Resolvido por bisseção (`overhang` é crescente em `ρ`) e
 * exatamente igual à fórmula do eixo quando o offset é zero.
 *
 * VERIFICADO contra força bruta (projeção de 24.000 pontos da casca da esfera): 6426 casos
 * cobrindo 14 proporções de tela, offset de 0 até o canto do container (θ até 50,4°) e `usedPx`
 * de 48 a 604px — a silhueta projetada **nunca** passa de `usedPx`, e o caso mais apertado é o
 * do eixo, onde ela é igual a `usedPx` com erro de 0,001px. Ou seja: a elipse fica tangente ao
 * círculo reservado na direção radial e dentro dele na tangencial.
 *
 * As ÓRBITAS — a tinta que o olho lê como a esfera — são desenhadas com raio exatamente `ρ`
 * (a escala é `ρ / ORBIT_RADIUS`), então ficam DENTRO da envolvente por construção e enchem o
 * círculo reservado: medido projetando os pontos das 3 órbitas ao longo de 48 rotações do grupo
 * e da varredura de `rotation.z`, elas batem 99–100% de `usedPx` em todos os 9 viewports
 * testados. A correção garante o limite sem encolher a esfera.
 *
 * @param {{usedPx: number, fPx: number, distance: number, offsetPx?: number}} args
 *        `usedPx` é o vão livre reservado (px), `offsetPx` a distância do centro do vão ao
 *        centro do container (px).
 * @returns {number} `ρ` em unidades de mundo (0 se a entrada não presta)
 */
export const envelopeWorldRadius = ({ usedPx, fPx, distance, offsetPx = 0 }) => {
  if (!(usedPx > 0) || !(fPx > 0) || !(distance > 0)) return 0;

  const theta = Math.atan(Math.abs(offsetPx) / fPx);
  const centerDistance = distance / Math.cos(theta);

  const overhang = (rho) => {
    const alpha = Math.asin(Math.min(rho / centerDistance, 1));
    return fPx * (Math.tan(theta + alpha) - Math.tan(theta));
  };

  // Teto da bisseção: onde a esfera já cobriria quase todo o campo de visão. Ficar em `|C|`
  // cru estouraria a tangente (θ + α passaria de 90°) e o excesso voltaria a diminuir, o que
  // quebraria a bisseção.
  let hi = centerDistance * Math.sin(Math.max((85 * Math.PI) / 180 - theta, 0.02));
  if (overhang(hi) <= usedPx) return hi;

  let lo = 0;
  for (let step = 0; step < 30; step += 1) {
    const mid = (lo + hi) / 2;
    if (overhang(mid) < usedPx) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

export default viewportBudget;
