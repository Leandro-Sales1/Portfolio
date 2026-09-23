/**
 * Geometria pura: onde o fundo 3D pode ficar, dado o que o layout já ocupa.
 *
 * POR QUE ISTO EXISTE. O fundo 3D já foi posicionado por números fixos por breakpoint
 * (`< 1024` desce e escala 0.72, senão `x = 4.5`) e deu errado duas vezes: a esfera ficava
 * atrás do painel de calibração no desktop e atrás do texto no celular. O motivo é que a
 * conta é incompatível — a altura do texto é medida em PIXELS e a viewport em `svh`, então a
 * fração de tela que sobra depende da largura E da altura, e ainda muda quando uma linha a
 * mais quebra. Não existe conjunto de constantes que sirva para 320px e para 2560px ao mesmo
 * tempo.
 *
 * Aqui a esfera não sabe de breakpoint: ela pergunta ao layout qual espaço sobrou. Quem
 * responde são os retângulos reais dos elementos (medidos no DOM pelo ThreeCanvas), então
 * qualquer mudança futura de layout se resolve sozinha.
 *
 * DUAS PERGUNTAS, NESTA ORDEM. O dono do projeto deu as exigências com prioridade, e ela é o
 * que a forma do módulo obedece: sem sobreposição (as duas buscas garantem), depois tamanho
 * (o maior vão é a régua), e só então "tente ficar no centro". O `findFreeSpot` responde à
 * segunda; o `findSpotNearest` responde à terceira, dentro do tamanho que o chamador aceita
 * perder. Não existe ponto que atenda às três ao mesmo tempo, e o motivo é geométrico, não
 * algorítmico: num hero de duas colunas o meio da tela é um corredor estreito entre o texto e
 * o painel, então centrar custa tamanho.
 *
 * Funções puras de propósito — sem DOM, sem three, sem React: dá para exercitar em Node com
 * retângulos sintéticos e provar que o círculo devolvido não cruza nenhum deles.
 */

/**
 * Folga somada a cada retângulo ocupado, quando o chamador não passa uma.
 *
 * O Hero **não** usa este valor: ele passa `margin` com a folga derivada de
 * `src/utils/screenBudget.js` (respiro + animação de entrada + a paralaxe da câmera em px, que
 * só existe onde há ponteiro). Isto é o padrão para quem chama a função solta — os testes de
 * geometria em Node, por exemplo. A folga deixou de ser constante porque depende da geometria
 * da câmera e da capacidade de ponteiro, não do algoritmo de vão livre.
 */
const DEFAULT_MARGIN = 32;

const distanceToRect = (x, y, rect) => {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Amostrador compartilhado pelas duas buscas: dado um ponto, o raio do maior círculo
 * centrado nele que não cruza nada.
 *
 * O raio de um ponto é a distância até o que estiver MAIS PERTO: as bordas do container ou
 * qualquer caixa ocupada (inflada por `margin`). Retângulos de tamanho zero são elementos
 * `display: none` (o painel abaixo de 1024px, por exemplo): medi-los criaria um obstáculo
 * fantasma no canto superior esquerdo. O mesmo vale para as coordenadas: um ponto devolvido
 * pelas duas buscas nunca cruza um retângulo, nem com a folga descontada.
 */
const makeSampler = (width, height, occupiedRects, margin) => {
  const blocked = occupiedRects
    .filter((rect) => rect.right - rect.left > 0 && rect.bottom - rect.top > 0)
    .map((rect) => ({
      left: rect.left - margin,
      right: rect.right + margin,
      top: rect.top - margin,
      bottom: rect.bottom + margin,
    }));

  return (x, y) => {
    let radius = Math.min(x, width - x, y, height - y);
    for (const rect of blocked) radius = Math.min(radius, distanceToRect(x, y, rect));
    return { x, y, radius };
  };
};

/**
 * O MAIOR círculo livre do container, desviando dos retângulos ocupados.
 *
 * Sem trava de altura e sem folga de borda, de propósito: este é o "vão decide" — a esfera
 * usa todo o espaço que sobrou, inclusive encostando na borda, que é a composição aprovada no
 * telefone e no tablet. Quem quiser uma esfera colocada por regra, e não pelo vão, procure o
 * `findSpotNearest` abaixo.
 *
 * Grade grossa + refino local: o vão livre do Hero costuma ser uma FAIXA fina, e uma grade de
 * 9×7 erra o centro dela por até meia célula (~64px de altura num hero de 900px) — o que
 * custaria boa parte do raio. Cada passada do refino reduz a janela à metade.
 *
 * QUATRO passadas, não três: a janela cobre ~uma célula da grade, então há um compromisso
 * entre alcance e resolução final (célula / 2^passadas / 2). Com três a amostragem para em
 * célula/16 — ~10px num hero de 900px — e o raio saía quase 2% abaixo do ótimo. Com quatro
 * fica em célula/32, e medido contra uma força bruta de 300×200 pontos o resultado fecha
 * dentro de ~1px (1%) em 1440×900, 1280×800, 390×844, 768×1024, 1920×1080 e 1024×768.
 *
 * @param {number} width          largura do container, em px
 * @param {number} height         altura do container, em px
 * @param {Array<{left,right,top,bottom}>} occupiedRects  caixas já ocupadas, em px
 * @param {{columns?: number, rows?: number, margin?: number}} [options]
 * @returns {{x: number, y: number, radius: number} | null}
 *          centro do maior círculo livre e o raio que cabe nele
 */
export const findFreeSpot = (
  width,
  height,
  occupiedRects,
  { columns = 9, rows = 7, margin = DEFAULT_MARGIN } = {}
) => {
  if (!(width > 0) || !(height > 0)) return null;

  const sample = makeSampler(width, height, occupiedRects, margin);

  const consider = (best, candidate) => {
    if (!best || candidate.radius > best.radius + 0.05) return candidate;
    // Empate técnico resolvido para a direita: mantém a esfera do lado direito, que é
    // a composição da identidade. Sem isto ela pula de lado quando o layout deixa dois
    // vãos equivalentes.
    const tiedButMoreToTheRight =
      Math.abs(candidate.radius - best.radius) <= 1 && candidate.x > best.x;
    return tiedButMoreToTheRight ? candidate : best;
  };

  let best = null;
  for (let column = 1; column < columns; column += 1) {
    for (let row = 1; row < rows; row += 1) {
      best = consider(best, sample((width * column) / columns, (height * row) / rows));
    }
  }

  let windowWidth = width / columns / 2;
  let windowHeight = height / rows / 2;
  for (let pass = 0; pass < 4; pass += 1) {
    const centerX = best.x;
    const centerY = best.y;
    for (let step = -2; step <= 2; step += 1) {
      for (let other = -2; other <= 2; other += 1) {
        best = consider(
          best,
          sample(
            clamp(centerX + (step * windowWidth) / 2, 0, width),
            clamp(centerY + (other * windowHeight) / 2, 0, height)
          )
        );
      }
    }
    windowWidth /= 2;
    windowHeight /= 2;
  }

  return best;
};

/**
 * O ponto mais perto do CENTRO DA TELA onde ainda cabe um círculo que não perca muito do
 * maior vão livre.
 *
 * O PISO É RELATIVO, E MEDIDO AQUI DENTRO. `sizeFloor` é uma fração do maior raio, e o maior
 * raio é medido nesta função com a MESMA `margin` da busca. Isso não é detalhe: a primeira
 * versão recebia um `minRadius` absoluto calculado pelo chamador, que media o tamanho de
 * outra forma, e o resultado era o piso ser inalcançável — a busca devolvia `null` em TODAS
 * as viewports medidas, ou seja, o recurso não existia.
 *
 * COMO BUSCA. Dois passos:
 *   1. o maior círculo (o mesmo esqueleto do `findFreeSpot`);
 *   2. uma descida pela borda do viável — do maior círculo em direção ao centro, aceitando só
 *      os passos que mantêm `raio >= piso` e chegam mais perto do centro. Quando nenhuma
 *      direção serve, o passo cai à metade; quando nenhuma serve nem com meio pixel, parou.
 *
 * A alternativa óbvia (varrer uma grade e escolher o candidato mais central que alcance o
 * piso) foi medida e descartada: o conjunto viável é uma FAIXA FINA em volta do máximo, e uma
 * grade de 15×13 não cai dentro dela nem em tela de 1900px. A descida começa dentro da faixa
 * (o máximo está nela por definição) e anda até onde ela deixa. Verificada contra força bruta
 * de 800×640 pontos por viewport em seis resoluções (500×714 a 1904×984): o ponto devolvido
 * fica a no máximo 3px do ótimo, e nenhum cruza um retângulo em nenhum caso.
 *
 * Devolve `null` quando nem o maior círculo alcança o piso — quem chama fica com o
 * `findFreeSpot`, que é o comportamento certo: melhor uma esfera fora do centro do que uma
 * esfera pequena.
 *
 * @param {number} width          largura do container, em px
 * @param {number} height         altura do container, em px
 * @param {Array<{left,right,top,bottom}>} occupiedRects  caixas já ocupadas, em px
 * @param {{margin?: number, minRadius?: number, sizeFloor?: number, columns?: number,
 *          rows?: number}} [options]
 *        `sizeFloor` é a fração do maior raio que o chamador aceita perder para chegar mais
 *        perto do centro (1 = nunca troca tamanho por centro, 0 = centra a qualquer preço);
 *        `minRadius` é um piso ABSOLUTO em px, para o caso de o maior vão ser menor que o
 *        tamanho mínimo aceitável.
 * @returns {{x: number, y: number, radius: number} | null}
 */
export const findSpotNearest = (
  width,
  height,
  occupiedRects,
  { margin = DEFAULT_MARGIN, minRadius = 0, sizeFloor = 1, columns = 15, rows = 13 } = {}
) => {
  if (!(width > 0) || !(height > 0)) return null;

  const sample = makeSampler(width, height, occupiedRects, margin);
  const cost = (spot) => Math.hypot(spot.x - width / 2, spot.y - height / 2);
  // Empate técnico resolvido para a direita, como no `findFreeSpot`, para a esfera não pular
  // de lado quando dois pontos são equivalentemente centrais.
  const closer = (candidate, incumbent) => {
    if (!incumbent) return true;
    if (cost(candidate) < cost(incumbent) - 0.05) return true;
    return Math.abs(cost(candidate) - cost(incumbent)) <= 1 && candidate.x > incumbent.x;
  };
  const wider = (candidate, incumbent) => {
    if (!incumbent || candidate.radius > incumbent.radius + 0.05) return candidate;
    if (Math.abs(candidate.radius - incumbent.radius) <= 1 && candidate.x > incumbent.x) {
      return candidate;
    }
    return incumbent;
  };

  // Passo 1: o maior círculo, com o mesmo refino do `findFreeSpot`.
  let widest = null;
  for (let column = 1; column < columns; column += 1) {
    for (let row = 1; row < rows; row += 1) {
      widest = wider(sample((width * column) / columns, (height * row) / rows), widest);
    }
  }
  if (!widest) return null;

  let windowWidth = width / columns / 2;
  let windowHeight = height / rows / 2;
  for (let pass = 0; pass < 4; pass += 1) {
    const centerX = widest.x;
    const centerY = widest.y;
    for (let step = -2; step <= 2; step += 1) {
      for (let other = -2; other <= 2; other += 1) {
        widest = wider(
          sample(
            clamp(centerX + (step * windowWidth) / 2, 0, width),
            clamp(centerY + (other * windowHeight) / 2, 0, height)
          ),
          widest
        );
      }
    }
    windowWidth /= 2;
    windowHeight /= 2;
  }

  const floor = Math.max(minRadius, sizeFloor * widest.radius);
  if (widest.radius < floor) return null;

  // Passo 2: desce pela borda do viável em direção ao centro. As 16 direções são medidas em
  // relação à direção do centro (e não aos eixos da tela), então a direção "reto para o centro"
  // está sempre na lista — é o caminho que a faixa viável costuma seguir.
  let current = widest;
  let step = Math.max(width, height) / 8;
  const towardCenter = Math.atan2(height / 2 - current.y, width / 2 - current.x);
  for (let move = 0; move < 240 && step > 0.5; move += 1) {
    let best = null;
    for (let arm = 0; arm < 16; arm += 1) {
      const angle = towardCenter + (arm * Math.PI) / 8;
      const candidate = sample(
        clamp(current.x + Math.cos(angle) * step, 0, width),
        clamp(current.y + Math.sin(angle) * step, 0, height)
      );
      if (candidate.radius < floor) continue;
      if (closer(candidate, best)) best = candidate;
    }
    if (best && closer(best, current)) {
      current = best;
      continue;
    }
    step /= 2;
  }

  return current;
};

export default findFreeSpot;
