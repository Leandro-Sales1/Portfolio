---
name: "Portfólio Leandro Sales"
colors:
  - "#050505"
  - "#f97316"
  - "#09090b"
  - "#27272a"
  - "#ffffff"
  - "#d4d4d8"
---

# Design System

Respeite a paleta e as fontes abaixo ao editar este projeto — é a identidade visual.
Mude só se o usuário pedir, e atualize este arquivo junto quando mudar.

A identidade vem do template **FlowForge** (Vibehub Academy, categoria Tech & SaaS):
preto quase absoluto, um único acento laranja, tipografia Inter + JetBrains Mono, e
separações feitas por bordas de fio em vez de blocos de cor.

## Cores e papéis

| Token | Hex | Papel |
|---|---|---|
| `bg-[#050505]` | `#050505` | Fundo da página. Vai na classe do `<body>`, não em `:root`. |
| `accent` | `#f97316` | **O único acento.** Use `text-accent`, `bg-accent`, `bg-accent/5`, `border-accent`. Nunca escreva `#f97316` ou `orange-500` solto no JSX. |
| `surface` | `#09090b` | Superfície de painel/overlay (fundo do `.tech-glass`, `ring-offset`). |
| `panel` | `#27272a` | Trilha de slider, cinza de painel. **Não é mais** a cor das linhas de órbita do canvas — ver abaixo. |
| — | `#ffffff` | Texto de primeiro nível e o botão primário. |
| — | `#d4d4d8` | Cor inicial dos pontos do canvas (zinc-300). |
| — | `#52525b` | **Linhas de órbita do canvas** (zinc-600) a 75% de opacidade. Era `#27272a` a 50%, que sobre o `#050505` dava rgb(22,22,27) — 17 níveis de diferença, invisível na prática. Ver "As órbitas" abaixo. |

Neutros são a escala **zinc** do Tailwind, usada por papel: `zinc-100`/`white` título,
`zinc-300`/`zinc-400` corpo, `zinc-500`/`zinc-600` meta e rodapé. As bordas de fio são
sempre `border-white/5` (divisória) ou `border-white/10` (moldura de card/imagem).

Os tokens `accent`/`surface`/`panel` estão em `tailwind.config.js` → `theme.extend.colors`.
Antes do redesign não havia camada de token: a identidade eram dois hex arbitrários
(`from-[#2C5364] to-[#37373D]`) espalhados no JSX. **Não volte a espalhar hex.**

## Tipografia

Duas famílias, ambas carregadas do Google Fonts no `<link>` do `index.html`:

- **Inter** (`font-sans`, padrão) — pesos **300 / 400 / 500 / 600**. O `<body>` usa
  `font-light` (300) como peso base; títulos de seção usam `font-medium` (500).
- **JetBrains Mono** (`font-mono`) — pesos **300 / 400 / 500**. Usada em *todo* texto
  de instrumentação: eyebrows, índices de seção, labels do painel, chips, copyright.

> O `font-sans` é aplicado pelo preflight do Tailwind no `<html>`, lendo
> `theme.fontFamily.sans`. Por isso o `index.html` **não** declara `font-family` — quem
> declara é o config.
>
> Antes do redesign a fonte declarada nunca era aplicada: o `<link>` pedia
> `Noto+Sans:ital@1` (só itálico) enquanto o `body` pedia `font-style: normal`, então
> nada casava e o site inteiro saía em `sans-serif` do sistema. Se for trocar de fonte,
> **confira o eixo do peso/itálico no `<link>` contra o que o CSS pede.**

Escala em uso (não há uma escala fechada — use estes como referência):

| Papel | Classes |
|---|---|
| Nome no Hero | `text-5xl md:text-7xl xl:text-8xl font-medium tracking-tighter` |
| Tagline do Hero | `text-2xl md:text-4xl tracking-tight text-zinc-600` |
| Título de seção | `text-3xl md:text-4xl font-medium tracking-tight text-white` |
| Título de contato | `text-3xl md:text-5xl` |
| Corpo | `text-sm md:text-base font-light leading-relaxed text-zinc-400` |
| Eyebrow / meta | `font-mono text-xs` (`tracking-widest` no Hero) |

## Convenções de superfície

- **Borda de fio, não bloco.** Divisória de seção: `border-b border-white/5`.
  Moldura de card ou imagem: `border border-white/10` + `rounded-2xl`.
- **Card padrão:** `group relative overflow-hidden rounded-2xl border border-white/5
  bg-white/[0.02]`, com `hover:-translate-y-1 hover:border-white/15
  hover:bg-white/[0.04]` e o spotlight `.pointer-glow` como primeiro filho. É o padrão
  dos tiles de tech, dos cards do Sobre e dos cards de projeto — mantenha-o ao criar um
  card novo.
- **Elemento com hover sempre é `group`**, e o que reage ao ponteiro usa `group-hover:`.
  Um `hover:` no filho só dispara quando o ponteiro está sobre *aquele filho* — era esse
  o bug do card de projeto, cujo zoom vivia no `<img>` e ignorava o mouse no título.
- **Grupos aninham por ancestral, não por proximidade.** O `group-hover:` do `Button`
  (que também é `group`) casa com **qualquer** `.group` acima dele — por isso, no card de
  projeto, passar o mouse no card também desloca em 2px o ícone dos botões Demo/Código.
  É aceito de propósito (o card inteiro responde como uma peça só); se um dia incomodar,
  o caminho é um grupo nomeado (`group/btn`), que exige sobrescrever o variant
  `group-hover/btn` no `tailwind.config.js` junto com os outros dois.
- **Vidro (`.tech-glass`):** só o painel de calibração e chips sobre imagem. Não use
  como fundo de seção.
- **Profundidade vem de gradiente e blur, não de sombra.** `shadow-sm` aparece apenas
  no botão primário; o resto é `blur-[120px]` no glow do Hero e gradiente
  `from-[#050505]` sobre a foto.

## Classes globais (`src/index.css`)

Só entra no CSS global o que o Tailwind não expressa. Hoje são oito:

| Classe | O que faz |
|---|---|
| `.hero-vh` | `min-height: 100svh` dentro de `@supports`. Ver "Altura do Hero" abaixo. |
| `.tech-glass` | Painel de vidro (fundo translúcido + blur 20px + borda de fio). |
| `.grid-overlay` | Grade técnica de 32px, desvanecendo nas bordas via `mask-image`. |
| `.bg-mesh` | Fundo de gradientes radiais da seção de contato. |
| `.pointer-glow` | Spotlight radial que segue o cursor. Ver "Hover" abaixo. |
| `.card-tilt` | Compõe `perspective` + `rotateX/rotateY` + `translateY` a partir de custom properties. Ver "Hover". |
| `input[type="range"]` | Slider do painel de calibração (webkit + moz). |
| bloco `prefers-reduced-motion` | Neutraliza `animate-fade-in` / `animate-flow` / `animate-pulse` **e** zera `.pointer-glow` / `.card-tilt`. |

Mais o bloco `:root { --accent }` (agora consumido pelo `.pointer-glow` — antes era token
morto) e `html { scroll-behavior: smooth }` (que é desligado sob reduced-motion).

> `text-balance` **não** está aqui: é utility nativa do Tailwind 3.4. Não recrie.

## Altura do Hero

`.hero-vh` + `min-h-screen` no mesmo elemento. `svh` é a **menor** viewport, então o
Hero não redimensiona quando a barra de URL do mobile aparece e some. O
`@supports (min-height: 100svh)` existe porque **`min-h-svh` não existe no Tailwind
3.4.19** (o token `svh` só aparece em `dataTypes.js`) — é CSS, não utility.

Não volte para `h-screen`: altura fixa corta nav + headline + CTA num telefone de 667px.

**O texto do Hero abaixo de 768px é menor E a barra de nav do mobile não existe mais** — os dois
pedidos do dono em 2026-09-23, e os dois cortes vão para o mesmo lugar: espaço para a esfera.

- **O texto**: `h1` em `text-4xl` (era `5xl`), tagline em `text-xl` (era `2xl`), subline em
  `text-sm` (era `base`), e os `mt-*` do bloco em **1rem** (`mt-4`) em vez de 1,5–2,5rem. Os
  `sm:`/`md:` devolvem o tamanho antigo a partir de 640/768px, então tablet e desktop saem
  idênticos.
- **A barra de nav**: era uma linha rolável de pílulas com os 4 anchors (`md:hidden`), marcada
  com `data-hero-occupied` — no telefone ela bloqueava ~54px (30px de pílula + `mt-5`) logo
  abaixo do header, na faixa em que a esfera procura espaço. Os anchors continuam acessíveis no
  rodapé, que lê o mesmo `NAV`.

Medido no DOM real, o bloco de texto termina em y=482 → 364 em 390×844 e y=508 → 364 em 360×667,
e o círculo reservado sai de ∅258 → ∅310 (texto) → **∅309** (barra fora) e de ∅96 → ∅219 →
**∅262**. Em 390×844 o tamanho não muda com a barra porque ali o vão é limitado pela **largura**
(∅390, o teto dos 390px) — o ganho aparece na **centralização**, de 123px para **67px** do meio
da tela. O efeito **não é o mesmo em todo telefone**, e é isso que se deve medir de novo ao mexer
aqui: 360×667 e 320×568 são limitados pela **altura**, e aí texto e barra decidem o tamanho
(∅219 → ∅262 e ∅109 → **∅152**); 500×714 vai de ∅260 para **∅302**. Em 320×480, que era o único
caso de esfera escondida (abaixo do piso de 48px de raio), ela passa a aparecer com ∅96 — no piso
exato. Acima de `md` a barra não existia, então **768×1024 não muda uma vírgula** (∅555/∅443).

## Espaçamento vertical das seções

O ritmo da página é o padding vertical das seções, e ele **caiu 2rem em cada ponta** em
2026-09-23, a pedido do dono ("diminua em 2rem todos os paddings top e bottom das seções, para
todas as dimensões"):

| | antes | agora |
|---|---|---|
| `Section.jsx` (Sobre, Techs, Projetos) e `Contact.jsx` — celular | `py-24` (96px) | **`py-16` (64px)** |
| `Section.jsx` e `Contact.jsx` — `md` para cima | `md:py-32` (128px) | **`md:py-24` (96px)** |
| `Footer.jsx` — topo | `pt-16` (64px) | **`pt-8` (32px)** |

O corte vale em todos os breakpoints, e o que ele encurta é o **vão morto entre seções** — cada
seção paga o próprio padding nas duas pontas, então duas seções vizinhas somavam 192px de vazio
no celular e 256px no desktop, e agora somam 128px e 192px. No total a página perdeu **288px de
altura** (4 seções × 64px + 32px do rodapé), medida em qualquer largura: 8000px num 390×844 e
5101px num 1409×804, com o padding conferido no `getComputedStyle` (64/64 e 96/96).

Dois valores **não** mudaram, e o motivo é o mesmo nos dois: −2rem ali é maior que o próprio
valor.

- O `py-6 md:py-12` do Hero (24px e 48px) — é o gutter do Hero, não ritmo de seção, e o corte
  zeraria o valor no celular.
- O `pb-8` do rodapé (2rem exatos) — é o gutter final da página; cortar 2rem ali encosta a linha
  de copyright na borda inferior.

**No rodapé o grid de duas colunas ganhou `md:justify-items-center`** (mesmo pedido). Vale de `md`
para cima, que é onde o grid tem duas colunas: com uma coluna a utility não muda nada (o item já
ocupa a largura toda). O efeito é que as duas colunas passam a ter **largura de conteúdo** e ficam
centradas na própria célula, em vez de esticadas com o conteúdo colado na borda esquerda. A
consequência visível, que é o preço: a marca e a lista de anchors **deixam de alinhar com a coluna
do site** (elas flutuam no meio de cada metade, enquanto todas as outras seções começam na borda
da `Container`). Era isso que o dono pediu — se um dia incomodar, é só tirar a classe.

## Animações

Definidas em `tailwind.config.js` → `theme.extend.keyframes`/`animation`, não no CSS:

- `animate-fade-in` — entrada das camadas do Hero. Usa `fill: both` (não `forwards`)
  **de propósito**: o `animationDelay` inline precisa segurar o keyframe 0% durante a
  espera. Com `forwards` o elemento aparecia com opacidade cheia antes de animar, o que
  exigia um `opacity-0` no JSX — e um H1 invisível se a animação não rodasse. **Não
  adicione `opacity-0` de volta.**
- `animate-flow` — traço pontilhado.

## Hover

O sistema é único e vale para todo elemento interativo:

| Item | Valor |
|---|---|
| Duração — superfície/card | `duration-300` |
| Duração — botão/ícone | `duration-200` |
| Curva | `ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`, o token do config) |
| Foco | `focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]` |
| Pressão | `active:scale-[0.98]` / `active:translate-y-0` |

Nada de 150ms solto, e **todo** elemento interativo tem `focus-visible` — antes do ajuste o
site inteiro tinha 16 `hover:` e zero foco visível.

**As duas exceções, ambas de zoom de imagem** (um deslocamento grande lê melhor devagar;
a curva é a mesma): `duration-500` na imagem do card de projeto e `duration-700` no
retrato do Sobre.

- **Guarda de ponteiro, em um lugar só.** O `tailwind.config.js` sobrescreve os variants
  core `hover` **e** `group-hover` para exigir `@media (hover: hover) and (pointer: fine)`.
  Os dois, não só o `hover`: `group-hover` é um variant separado e, sem a mesma sobrescrita,
  o `group-hover:scale-*` da imagem do card continuava grudando depois do toque. Não
  escreva `md:hover:` — a guarda já existe e vale para todas as ocorrências.
- **`.pointer-glow`** — o gradiente radial lê `--mx`/`--my` (posição do cursor) e
  `--glow` (cor; cai no `--accent` quando ausente). Os tiles de tech passam a cor da marca
  em `--glow`; os cards de projeto ficam no acento. Quem escreve as variáveis é
  `src/utils/pointerGlow.js`, chamado em `onPointerMove` — **direto no DOM, sem `setState`**,
  para não re-renderizar o React a cada pixel de mouse.
- **`.card-tilt`** — o `transform` do card é `perspective(900px) rotateX(var(--rx))
  rotateY(var(--ry)) translateY(var(--lift))`, tudo em custom properties. **Nunca some um
  `hover:-translate-y-*`** a um card que use `.card-tilt`: os dois escrevem `transform`, o
  inline venceria e a elevação sumiria. É por isso que o lift do card de projeto vai como
  `--lift`, dentro da mesma declaração — e por isso o card do Sobre / tile de tech, que não
  usa `.card-tilt`, usa `hover:-translate-y-1` normalmente.
- **Marcas de cor branca** (Next.js, Express): `group-hover:text-[color:var(--brand)]`
  não muda nada visível. O feedback nelas vem de `scale-110` +
  `group-hover:drop-shadow-[0_0_14px_currentColor]`, não de falsificar a cor da marca.

## Contrato de z-index (Hero)

Ordem obrigatória — nunca use z negativo:

| Camada | z |
|---|---|
| Glow laranja | `z-0` |
| Canvas 3D | `z-[1]` |
| `.grid-overlay` | `z-[2]` |
| Conteúdo (header, headline, CTAs) | `z-20` |
| Painel de calibração | `z-30` |

O `z-20` mora no **wrapper** `max-w-7xl` que contém header, conteúdo e painel — não nos
filhos. Eles ficam em fluxo normal; antes o header e o bloco de conteúdo empatavam em `z-20`
e quem pintava por cima era decidido pela ordem do DOM.

O painel de calibração é `hidden lg:block` num **wrapper posicional** próprio (o painel em si
é `flex flex-col`), e abaixo de `lg` esse wrapper precisa medir 0×0. Se o `hidden` ficasse no
painel de dentro, o wrapper manteria a altura do painel escondido e a esfera desviaria de um
obstáculo invisível. O wrapper **não** leva `data-hero-occupied`: o vidro admite a esfera por
trás (ver "Onde a esfera 3D fica").

O `.grid-overlay` fica **acima** do canvas (`z-[2]`, não `z-0`): atrás dele a grade de 32px
ficava praticamente invisível sob o `AdditiveBlending` do enxame.

O `<section>` do Hero precisa de `relative` (senão o canvas `absolute inset-0` se ancora
no viewport e cobre a página inteira) e de `overflow-hidden` (senão vaza para as seções
seguintes). As demais seções usam `relative z-20` — ver `Section.jsx`.

**Alinhamento em telas largas.** O Hero **não** usa `Container.jsx`: ele replica a coluna
do site com um wrapper `mx-auto w-full max-w-7xl` que contém header, headline, CTAs e o
painel de calibração. O `z-20` mora nesse wrapper, não nos filhos. O padding horizontal
mora **só no wrapper** (`px-6 md:px-12`, em `max(…, env(safe-area-inset-*))`) — se o
`<section>` também tivesse padding, o `max-w-7xl` já viria encolhido e o Hero ficaria 48px
deslocado de todas as outras seções. O canvas continua full-bleed, fora do wrapper.

## Onde a esfera 3D fica (contrato de posicionamento)

O grupo 3D **não** tem posição por breakpoint. Ele vai para o ponto mais perto do **centro da
tela** onde ainda caiba um círculo que não perca mais de 20% do maior vão livre (o
`centerSizeFloor` de `0,8`) — tudo calculado a partir dos retângulos reais dos elementos do Hero:

1. O Hero marca o que ocupa espaço com `data-hero-occupied` — e marca **folhas, não caixas**:
   o `div` do logo e a `nav` do desktop em separado (a faixa do meio do topo fica livre), as 5
   folhas do bloco de texto (eyebrow, `h1`, tagline, subline, CTAs) e o painel de calibração.
   Eram **6** folhas até 2026-09-23, quando a barra de nav do mobile saiu do DOM a pedido do dono
   (ver "Altura do Hero"): abaixo de `md` a lista de obstáculos do topo é só o logo e o
   `LangToggle`. O motivo de não marcar o bloco de texto inteiro não é ele ser largo:
   é que **`getBoundingClientRect` inclui o padding**, e o `lg:pr-80` do bloco põe 320px de
   padding dentro da caixa medida — o obstáculo se estendia 320px além da tinta, justamente na
   faixa (1024–1440px) em que a restrição é horizontal.
2. Nas folhas **bloco** o marcador tem valor: `data-hero-occupied="ink"` (o `h1`, a tagline,
   o subline, o eyebrow e a linha de CTAs). Todas são `block` ou `flex`, então a caixa vai até
   a borda da coluna — em `1409×804` o `h1` tem 708px de caixa e ~588px de tinta, e o eyebrow
   tem 896px de caixa com **~300px** de tinta. Um `Range` sobre o conteúdo mede a tinta. O
   `measure` une a tinta do `Range` com as caixas dos filhos, porque o `Range` só pega nós de
   texto e o eyebrow tem um ponto de acento que é `<div>`. Nas caixas com moldura visível (a
   `nav` do desktop, o logo, o painel, os chips, o `LangToggle`) a caixa **é** a tinta: medi-las
   por `Range` encolheria o obstáculo para dentro da própria moldura, e a esfera poderia encostar
   nela.
3. **O painel de calibração É obstáculo** (`data-hero-occupied` no wrapper dele). O vidro
   admitiria a esfera por trás, e houve uma tentativa de liberá-lo — mas atravessá-lo por baixo
   da moldura lê como defeito, e "sem sobreposição" é a restrição dura do dono. Custa tamanho:
   são 317px de altura bloqueando a metade direita da faixa central em `1409×804`, e é por isso
   que em telas médias a esfera não fica no meio: fica na faixa de cima, centrada em `x`. Quem
   manda no empilhamento continua sendo o `z-30`.
4. O `ThreeCanvas` mede essas caixas (relativas ao próprio container) em `adjustLayout`, que
   roda no mount, no `ResizeObserver` do container e em `document.fonts.ready`. São **duas**
   buscas do mesmo layout, nesta ordem: `findFreeSpot` (o maior círculo — o tamanho de
   referência, e o plano B) e `findSpotNearest` (o ponto mais perto do centro que ainda tenha
   `centerSizeFloor` do maior raio, com `floorRadiusPx` como piso absoluto). A segunda ganha
   quando existe; quando devolve `null`, fica a primeira.
5. `viewportBudget` (`src/utils/screenBudget.js`) traduz o tamanho medido do container nos
   números que o 3D consome (folga, teto, piso, `pixelRatio`, recuo, `centerSizeFloor`). Função
   pura: sem DOM, sem three, sem React, sem estado, sem nome de faixa — recebe largura e altura
   **já medidas** e devolve números que só a camada 3D pode consumir (se um retorno cair num
   `className`, ele não pertencia ali).
6. Se o círculo escolhido tiver menos de `floorRadiusPx` de raio, o grupo fica invisível
   (`systemsGroup.visible = false`) em vez de virar um ponto perdido no meio da tela.
7. O raio do vão é a régua da **bola em repouso** (o círculo reservado). Duas tintas passam dele:
   as **órbitas**, desenhadas 110% além desde 2026-09-23 (`ORBIT_ENVELOPE_RATIO`, ver "As órbitas"),
   e a **nuvem** de pontos no extremo do slider de distorção. O `radiusWithinGap`
   (`src/utils/screenBudget.js`) confere se a tinta toda ainda cabe no mesmo lugar: onde cabe —
   praticamente toda tela — devolve o teto do vão intacto, e onde não cabe o raio cede. Ver
   "A nuvem de pontos no extremo do slider".

### A troca entre tamanho e centro, e por que ela é explicada (não escolhida por gosto)

O dono deu as três exigências **em ordem de prioridade**, e é ela que o código implementa:
sem sobreposição é restrição dura (as duas buscas nunca devolvem um ponto que cruze um
retângulo medido), tamanho relativo vem antes de posição (o maior vão é a régua) e "tente ficar
no centro" é a que cede. **As três não cabem juntas em toda tela, e o motivo é geométrico**: o
meio da tela é um corredor entre o texto (embaixo, à esquerda) e o painel (embaixo, à direita).

Medido no DOM real, com o par `hasPointer`:

| Viewport | Centro da tela | Maior vão (plano B) | Escolhido (centrado) |
|---|---|---|---|
| 320×480 (o menor medido, toque) | (160, 240) | ∅107 em (267, 426) | ∅96 em (186, 420) — no piso de 48px de raio |
| 320×568 (toque) | (160, 284) | ∅191 em (224, 468) | ∅152 em (129, 448) |
| 360×667 (telefone curto, toque) | (180, 333) | ∅330 em (195, 500) | ∅262 em (209, 464) — 58% da largura |
| 390×844 (telefone, toque) | (195, 422) | ∅390 em (195, 542) | ∅309 em (192, 488) — 49% da largura |
| 500×714 (telefone, toque) | (250, 357) | ∅377 em (311, 522) | ∅302 em (235, 484) — 47% da largura |
| 768×1024 (tablet retrato, toque) | (384, 512) | ∅555 em (491, 744) | ∅443 em (514, 647) — 67% da largura |
| 1024×768 | (512, 384) | ∅292 em (377, 185) | ∅196 em (501, 265) — 49% da largura |
| 1264×704 | (632, 352) | ∅368 em (711, 508) | ∅295 em (678, 355) — 54% da largura |
| 1409×804 | (705, 402) | ∅371 em (656, 186) | ∅297 em (688, 223) — 49% da largura |
| 1904×984 | (952, 492) | ∅542 em (846, 276) | ∅438 em (934, 329) — 49% da largura |
| 2529×1344 | (1265, 672) | ∅861 em (2099, 528) | ∅692 em (1281, 553) — 51% da largura |
| 2560×1320 (a janela real do dono) | (1280, 660) | ∅806 em (1156, 459) | ∅688 em (1284, 532) — 50% da largura |

São **diâmetros do círculo reservado**, do DOM real (não de caixas sintéticas), e a tinta que o
olho vê é a da nuvem em repouso, que desenha esse círculo exatamente (100% dele) — as órbitas, que
são o mesmo que se lê como esfera, vão 10% além desde 2026-09-23 (ver "As órbitas"). A coluna
"maior vão" é o que a
esfera fazia antes: note que ela é **tangente à borda de cima** em 1409×804 (`y = raio`, por
definição) e em 1264×704 cai 169px abaixo do centro. O ganho de centralização varia muito com a
tela: em 1264×704 os 20% de raio compram 72% da distância até o centro, em 1409×804 compram 27%,
e em 2529×1344 são a diferença entre **51% e 83% da largura**.

(A tabela é a config atual: folga de 16px de respiro, excursão de paralaxe 0,4 e topo do slider
em 0,8 — as três mudaram em 2026-09-23 e é por isso que os números são maiores que os de
qualquer versão anterior deste documento. As linhas de telefone/tablet rodam com
`hasPointer: false`, porque é o que um aparelho de toque de verdade faz: sem `mousemove` não há
parcela de paralaxe na folga. As **quatro** linhas de telefone foram remedidas no DOM real
depois da retirada da barra de nav do mobile — a remoção mudou o vão, e não só o tamanho: em
390×844 o diâmetro ficou o mesmo (∅310 → ∅309, ali a largura manda) e o que mudou foi a
distância ao centro, 123px → **67px**.)

**É por isso que a fração é 0,8 e não 0,9**: o piso não desloca a faixa viável, ele decide se ela
existe no centro. A bolsa central é uma porteira entre duas quinas (o canto inferior esquerdo da
nav e a borda de cima do `h1`), e o **teto dela fica entre 0,85 e 0,90 do maior vão** — medido
varrendo o piso com os retângulos reais, na janela de 2560×1320 do dono:

| `sizeFloor` | 0,80 | 0,85 | 0,90 | 0,95 |
|---|---|---|---|---|
| 2560×1320 — onde a esfera fica | **50% da largura** (∅688) | 52% (∅730) | **78% da largura** (∅774) | 81% (∅816) |
| 2529×1344 | **51%** (∅692) | 49% (∅734) | 56% (∅778) | 80% (∅820) |

O salto entre 0,85 (52%) e 0,90 (**78%**) é a porteira fechando: acima do teto da bolsa central
não existe ponto viável perto do meio, e a busca cai no corredor da direita — é **literalmente a
queixa do dono** ("a esfera aparece à direita da tela e não centralizada"), reproduzida aqui pela
varredura. E mesmo em 2529×1344, onde ela não salta, o `0,9` já custa 5 pontos de largura
(51% → 56%) sem devolver tamanho nenhum: o ponto mais central que satisfaz `0,9` fica a 0,1–0,3px
da fronteira, ou seja em cima dela — não é um lugar para pôr a esfera, e é um lugar onde a
resposta muda se a fonte chegar 1px diferente. Com `0,8` a porteira abre e a resposta é robusta. **Não baixe para 0,6**: aí a esfera
chegaria um pouco mais perto do meio, mas com **metade** do tamanho — e o dono pediu "tamanho
relativo e importante na exibição" antes de pedir o centro. Quem quiser o outro lado da troca
muda `CENTER_SIZE_FLOOR` em `src/utils/screenBudget.js` e mais nada; em 0,8 o preço está medido
como **20% do raio no pior caso** (é o próprio teto do gasto, e o celular e o tablet pagam os
mesmos 20% para ganhar pouca centralidade — foi a troca escolhida).

**A alternativa "inteligente" foi medida e descartada.** Cinco políticas foram comparadas contra
força bruta: o piso fixo, um câmbio acumulado (`ganho ≥ k · raio gasto`, k = 1…5), o mesmo câmbio
por passo, uma faixa morta no ganho (1…24px) e o passo inicial afinado (`max/32`). O câmbio
acumulado **estaca num ombro**: perto do maior vão o raio cai antes de a centralidade render, o
passo é recusado e a caminhada não atravessa — em 2529×1344 ele para em 76% da largura, ou seja
devolve a queixa do dono. A faixa morta e o passo fino **não recuperam o tamanho do celular**
(∅177 contra ∅196 do piso 0,9), porque lá a caminhada gasta o orçamento inteiro **num passo só**
de 93px. Ficou o piso fixo, que é o mais simples e o único robusto.

Duas tentativas anteriores de resolver isso erraram pelo mesmo motivo, e as duas deixaram
rastro: numa a esfera ia para o centro a qualquer preço e saía **pequena e cortada**; noutra o
painel deixou de ser obstáculo para o centro caber e a esfera passava por baixo do vidro. A
medição que faltava nas duas é a mesma: **no ponto exato do meio o maior círculo é ∅455, contra
∅861 no vão** (2529×1344, medido) — o centro, ali, custa metade do tamanho. É por isso que o
`findSpotNearest` não devolve o centro: ele devolve o ponto mais perto do centro que ainda tem
0,8 do vão, e em 2529×1344 esse ponto está **120px ao lado** dele (∅692, a 51% da largura).

**O telefone: o piso é quem decide onde ela para, e hoje nenhuma tela medida precisa do plano B.**
Em coluna única o centro cai DENTRO do bloco de texto, então a caminhada não chega ao meio — ela
sai do texto pela borda viável mais próxima e para no primeiro ponto que respira. Nas viewports
medidas isso acontece entre **67px (390×844) e 188px (768×1024) do centro**, e em **nenhuma** o
`findSpotNearest` devolve `null`: o piso de 0,8 é alcançado em todas, inclusive na menor de
todas (320×480, ∅96 — o raio encostando no piso de 48px), e é ele que decide o quão longe do meio
a esfera para. O plano B (o maior vão) só entraria se nem o maior vão alcançasse o piso, e hoje
**não há tela medida nesse caso** — ele é a guarda para um aparelho menor que o menor medido.
**Até 2026-09-23 não era assim**: com o texto do hero maior, a porteira central ficava fechada em
coluna única e o `null` era o caminho do telefone; o texto menor e a barra de nav fora (ver
"Altura do Hero") abriram a porteira em todas as telas medidas — a barra sozinha foi o que trouxe
320×480 de escondida para ∅96. Em nenhum dos casos há sobreposição — o amostrador nunca devolve
um ponto que cruze um retângulo medido, com a folga aplicada a ele. No tablet em retrato ela anda
188px (∅555 → ∅443, −20%) porque ali o vão tem folga de sobra — e ali a barra de nav já não
existia, então os números do tablet não mudaram com esta rodada.

**Por que não dá para fazer por breakpoint.** Duas tentativas anteriores usaram constantes por
breakpoint e falharam nas duas: a esfera ficava atrás do painel no desktop e atrás do texto no
celular. A conta é incompatível — a altura do texto é medida em PIXELS e a viewport em `svh`,
então a fração de tela que sobra depende da largura **e** da altura ao mesmo tempo, e ainda
muda quando uma linha a mais quebra. Não existe constante que sirva de 320px a 2560px.

### A escala é a inversão da SILHUETA, não a do polo próximo

A esfera de raio `ρ` a uma distância axial `d` desenha a silhueta `fPx · ρ / √(d² − ρ²)` — a
**tangente**, não a projeção do ponto mais próximo dela. Medir o polo próximo (`d − ρ`) foi o
que deixou a esfera desenhando **63% (desktop) a 72% (mobile)** do vão que ela reservava: quase
metade do ganho de tamanho veio de corrigir a conta, não de rearranjar o layout. A inversão é
`envelopeWorldRadius` (`src/utils/screenBudget.js`); o círculo reservado é desenhado com raio `ρ` (a
escala é `ρ / ORBIT_RADIUS`, com `ORBIT_RADIUS = 6.0` **constante**) e é o que a **nuvem em repouso
preenche: 100% dele** — é essa a régua que o dono aprova como "o tamanho da esfera". As órbitas têm
esse círculo como referência e vão **10% além** desde 2026-09-23 (ver "As órbitas"), dentro da
envolvente que o `radiusWithinGap` garante: um anel de raio de mundo `R` está sobre a casca da esfera
de raio `R`, e a imagem da esfera é a região desta silhueta. Com a silhueta correta o recuo em `z` do
mobile deixa de mexer no tamanho: `distance` já está na equação.

**Fora do eixo.** Aquilo só é um círculo se a esfera estiver no eixo óptico, e o grupo nunca
está — ele mora à direita do nome, longe do eixo, por construção. Fora do eixo a projeção vira
uma elipse alongada
na direção radial (+21px de excesso com o centro a 107px do eixo, +47px a 214px, +114px a
429px), resolvida por bisseção sobre `fPx·(tan(θ+α) − tan θ)`. Verificado contra força bruta
(projeção de 24.000 pontos da casca): 6426 casos, 14 proporções de tela, offset de 0 até o canto
do container (θ até 50,4°) e `usedPx` de 48 a 604px — a silhueta **nunca** passa de `usedPx`, e
o caso mais apertado é o do eixo, onde é igual com erro de 0,001px. A elipse fica tangente ao
círculo reservado na direção radial e dentro dele na tangencial.

### As órbitas: contraste primeiro, e depois dez por cento de fora

São três `THREE.EllipseCurve` (raios de mundo `5,2 / 5,6 / 6,0` × `ORBIT_ENVELOPE_RATIO`) desenhadas
com `THREE.Line` + `LineBasicMaterial`: **1px de espessura**, porque o WebGL ignora `linewidth` em
todas as plataformas. E entram no `lineGroup` **depois** das `particles`, que são `depthWrite:
false` + `AdditiveBlending` — ou seja, a nuvem nunca passa na frente delas; a visibilidade das
órbitas é **puramente contraste**.

E era aí que estava o defeito, não no tamanho: `#27272a` a 50% sobre o `#050505` do fundo desenha
**rgb(22,22,27)** — 17 níveis de diferença, invisível na prática, e por isso a esfera lia como uma
bola solta. Hoje é **`#52525b` (zinc-600) a 75%** ≈ rgb(63,63,69), 58 níveis acima do fundo (a
nuvem, `#d4d4d8`, está em 212).

**Aquele primeiro pedido foi de contraste, não de tamanho.** *"aumente as órbitas também, para que
apareçam"* — e **naquele momento não havia o que aumentar além do círculo**: o raio em tela de cada
anel era `raio / ORBIT_RADIUS` do círculo reservado, então os três cresciam só junto com ele
(medido em 2529×1344: ∅599 / ∅645 / ∅**692**). O que se fez ali foi (a) o contraste acima, (b) abrir
os três raios (eram mais próximos entre si) e (c) manter a ordem do array = ordem de giro
(`rotation.z += 0,003 · (índice + 1)`), para a de fora continuar sendo a mais rápida.

**E o pedido seguinte, no mesmo dia, foi de TAMANHO — e aí sim havia para onde ir.** O dono:
*"as órbitas também estão nesse limite, tipo a esfera ocupa 100% do espaço, porém gostaria que as
órbitas ficassem em 110%, por exemplo, pois tem espaço na tela para isso"*. Com a bola em 100% do
círculo (o tamanho que ele aprovou), "raspar dentro" engoliria os anéis: o que existe **fora** do
círculo é a envolvente da nuvem, e é onde os anéis passaram a ser desenhados —
`ORBIT_ENVELOPE_RATIO`, **derivado do `cloudRatio`** (1,1) em vez de escrito à mão, para o teto da
alavanca não poder ser furado por descuido. Medido projetando os três anéis com o `three` real sob
60 rotações do grupo, o de fora fica a 0–2px do teto da guarda **por dentro**, em seis viewports:

| Viewport | Círculo reservado (a bola em repouso) | Anéis a 110% | O de fora |
|---|---|---|---|
| 2529×1344 | ∅692 | ∅654 / 700 / **765** | +10,5% |
| 2560×1320 (a janela real do dono) | ∅688 | ∅649 / 694 / **759** | +10,3% |
| 3840×2160 (4K) | ∅1386 | ∅1313 / 1415 / **1537** | +10,9% |
| 1904×984 | ∅438 | ∅413 / 437 / **481** | +9,9% |
| 768×1024 (tablet, toque) | ∅444 | ∅422 / 452 / **492** | +10,8% |
| 390×844 (telefone, toque) | ∅310 | ∅294 / 315 / **341** | +10,1% |

Os três sobem JUNTOS, então a família se preserva (o espaçamento de 0,4 entre um e outro vira 0,44) e
a nuvem fica byte a byte onde estava: quem lê "esfera com órbitas" vê um conjunto ~10% maior sem a
bola mudar de tamanho nem de lugar. O preço está dito e é coerente com o desenho: no topo do "Flux
Dynamics" a nuvem alcança os mesmos 6,6 de mundo e os anéis coincidem com ela de novo — arrastar o
slider até o fim recolhe os anéis para dentro da bola. **E o teto dessa alavanca é o `cloudRatio`**:
acima dele os anéis saem da garantia do `radiusWithinGap` e podem encostar no texto no extremo do
slider, que é a restrição dura do dono.

**A elipse de cada anel é quase de perfil**: as três rotações (π/3, π/2, π/1.8) deixam os anéis
achatados, então parte do traço se concentra perto das bordas do conjunto. Deixar um deles de
frente leria ainda mais como "órbita" — não foi feito porque mudaria o desenho aprovado sem
pedido, e **é o único caminho que sobrou para as órbitas ficarem mais visíveis sem sair da
garantia de não-sobreposição** (elas já estão na envolvente; mais raio não há).

**E isso foi conferido em PIXELS, não só projetado.** Numa varredura de **40 quadros** em 2529×1344
(o grupo gira várias voltas), medindo a extensão **radial** da tinta do fio a partir do centro que o
`adjustLayout` escolheu (1281,4, 553,2) — a direção do pior caso, e a única que uma caixa alinhada
aos eixos não vê, porque a direção de maior raio da elipse projetada gira com o grupo: **379,1px**,
ou seja **1,096× o círculo reservado** (∅758 contra ∅692; o modelo previa 383,4px = 1,109×, e a
diferença de ~1% é a orientação que maximiza não ter caído na amostra). A régua do "100%" está no
antes: em `final-2560.png` e `novo-2560.png` (2560×1440, anteriores à mudança) a tinta acima de 150
media **693px de largura, e a acima de 40 media os mesmos 693px** — o anel de fora exatamente na
borda da bola, que é o que o dono descreveu com "a esfera ocupa 100% do espaço". Depois, a bola
continua com **687–689px** no máximo da varredura (o ∅692 reservado) enquanto o fio passa dela. E
**nada da cena encosta na UI**: nesses mesmos 40 quadros, nenhum pixel de tinta da cena aparece
dentro de qualquer um dos 8 retângulos `data-hero-occupied` medidos no DOM — os 5.733px que o
detector acha ali são tinta **congelada da própria nav** (idênticos, pixel a pixel, nos 40 quadros).

### A bolinha: o terceiro item do sistema de órbitas

No mesmo dia, logo depois dos 110%, o dono: *"adicione também, 1 esfera a cada órbita que «ande» pela
linha da órbita, e coloque a velocidade dela de acordo com a taxa de clock"*. São três `THREE.Mesh`
(`SphereGeometry(BEAD_RADIUS = 0,05, 12, 12)` + `MeshBasicMaterial`) **filhas do próprio
`THREE.Line`** de cada anel: elas herdam a inclinação, e como cada elipse **é** o círculo de raio
`radius` no plano LOCAL do anel, avançar o ângulo em espaço local é literalmente andar pela linha.

- **Raio LOCAL de `0,05`** (~1/120 do diâmetro do anel de fora), que a escala do grupo transforma em
  **~5,8px de diâmetro em tela** (0,05 × 0,6855 = 0,0343 de mundo na medição de 2529×1344). É
  desenhada no passo **opaco**, antes da nuvem: a nuvem passa na frente dela quando está à frente, e
  o fio cruza por cima — as órbitas continuam sem oclusão (`depthWrite: false`, e entram depois).
- **A velocidade é do RELÓGIO DO RAF, não do relógio de parede.** `timeRef` (o mesmo que alimenta
  `uTime`) anda `0,01 + 0,05 · taxa de clock` **por quadro**, e o ângulo da bolinha é
  `timeRef · 0,2 · (índice + 1) + fase`. A taxa de clock é o slider "Taxa de Clock" do painel, então
  a bolinha acelera com ele **na mesma proporção que a nuvem** — é o que foi pedido. O ângulo é
  **função pura** de `timeRef` (nada acumula), então o passo não depende do número de quadros nem de
  um travamento; o preço é que o relógio é por QUADRO, e numa tela de 120Hz tudo anda 2× mais rápido.
- **Ela anda duas vezes**: além do passo próprio, o giro do anel (`rotation.z += 0,003·(índice+1)`
  por quadro) a carrega. Na taxa padrão as duas parcelas são iguais; a 60 fps uma volta completa leva
  **~5,8s / ~8,7s / ~17,5s** (de fora, do meio, de dentro), **~3,5s / ~5,2s / ~10,5s** no topo do
  slider (0,5) e **~7,0s / ~10,5s / ~21s** no zero — o termo constante do relógio mantém tudo
  andando mesmo com o clock em 0. As três nascem a 120° uma da outra.
- **`0x71717a` (zinc-500), um degrau acima do fio** (`0x52525b` a 75% ≈ rgb(63,63,69); a bolinha
  desenha rgb(113,113,122)), e muito abaixo da nuvem (212). A cor **não** vem do `color` do painel:
  as cores do "Energia" são da nuvem.

**E ela custa uma conta à guarda.** A casca da bolinha fica em `6,6 + 0,05·escala` de mundo — **0,76%
além do anel**, ~**+3,2px** em tela nas 2529×1344, medido pela inversa da silhueta (386,5px contra os
383,4px do anel). O `radiusWithinGap` **não conhece esse raio** (a desigualdade dele é sobre o raio
da nuvem no extremo do slider, e o anel já a consome inteira): quem absorve é a `marginPx` — 56px ali,
≥24px em telas de toque —, com o obstáculo mais próximo a 401,8px. É o **único** elemento da cena que
passa da envolvente do `cloudRatio` por desenho; se algum dia a folga cair para ~4px, esta é a conta
que precisa entrar na guarda, não a do anel.

**A folga é derivada, não constante.** `freeSpot.js` tem um `DEFAULT_MARGIN = 32` que é só o
padrão de quem chama a função solta; o Hero passa a sua, vinda do orçamento: **16px de respiro**
+ 8px da animação de entrada (`animate-fade-in` começa em `translateY(8px)`, e a medição roda no
mount) + **a paralaxe da câmera em pixels** (`PARALLAX_WORLD · fPx / distance`, com `fov` de 50°:
~21px num hero de 900px e ~34px num de 1440px, ou ~h/42) — esta última só onde há ponteiro,
porque em telas de toque o listener de `mousemove` não existe, a câmera não anda e não há nada a
reservar (num telefone de verdade a folga é 24px, não 39). Era 8px no papel contra 21–34px reais;
com a escala corrigida a esfera encosta mesmo no limite, e a folga curta passou a significar
sobreposição com o mouse no canto.

**O respiro era 24px e a excursão da câmera 0,5, e os dois caíram em 2026-09-23** (para 16px e
0,4), no mesmo pedido que fez a esfera crescer. **Os dois só puderam cair por causa da quarta
linha da soma da nuvem** (ver "Onde a alavanca acaba"): o teto da guarda é `folga / (cloudRatio −
1)`, então com a soma antiga de 6,8 cortar folga custava 20% do raio em 3440px, e com a soma de
6,6 o mesmo corte não faz a guarda morder em tela nenhuma das medidas. O preço visível é a
varredura da câmera: ~86px de ponta a ponta num hero de 1440px passaram a ~69px.

A mesma folga vale contra as **bordas** do hero? Não — e isso foi medido, não escolhido. Houve um
`edgeMargin` (folga contra as bordas do container, além do `margin` de cada retângulo) e ele saiu
do `freeSpot.js`: quando o maior círculo está encostado numa borda — e no desktop ele está, no
topo — exigir 56px de folga das quatro bordas tira **~15% do raio** dele. O piso de tamanho é
medido com a mesma régua da busca, então o resultado não seria injusto, só menor: a esfera
centrada sairia menor que o plano B. Quem resolve o "colado na borda" é a própria busca de
centro, que puxa o círculo para dentro; e onde ela não pode puxar (o plano B), encostar é a
composição aprovada.

**O teto é `0,42 · altura`, e hoje ele não decide em tela nenhuma das medidas.** Medido no DOM
real, o maior círculo é ∅542 em 1904×984 — 28% da altura, contra os 84% de diâmetro que o teto
permitiria — e em 7680×4320, o maior viewport medido, a esfera sai em **74% da altura** (∅3180)
com o teto em 84%: quem corta ali é o piso do `findSpotNearest`, não o teto. A versão anterior
deste documento dizia que em 5120×1440 o teto era quem mandava (a esfera com 84% da altura);
medido, ela sai em **78%** (∅1126, com a guarda da nuvem tirando 2%).

E não é coincidência: o teto é **inalcançável pelo caminho centrado**. O raio de um ponto nunca
passa de `min(width, height)/2` (o amostrador conta as bordas do container no raio), e a busca
centrada devolve no máximo `0,8` do maior círculo — logo `raio ≤ 0,8 · min/2 ≤ 0,4 · altura`, que
é **menor** que `0,42 · altura`. O teto só pode morder no caminho do plano B (o `findFreeSpot`
cru, que pode encostar na borda) e continua sendo a rede contra número degenerado: sem ele, num
vão enorme, `ρ` se aproxima da distância até a câmera e a tangente da bisseção explode. Se a
esfera parecer pequena num caso específico, o botão não é a escala: é **encurtar o texto do
Hero** — o subline é o que come o vão.

**As telas largas foram medidas — em navegador de verdade.** Cada linha abaixo vem de um dump
com `Emulation.setDeviceMetricsOverride` na largura da linha (o mesmo caminho de medição do
resto do documento), e não de um modelo reancorado: numa versão anterior desta tabela os números
acima de 2560px vinham de reancorar o dump de 2529×1344, e na conferência de 2026-09-23 com dumps
reais o erro era grande (∅1088 modelado contra **∅1386** medido em 4K — o modelo não via que a
coluna travada deixa um vão central enorme).

| Viewport | Onde a esfera cai | Diâmetro reservado | Nuvem no extremo do slider | O raio cede? |
|---|---|---|---|---|
| 1920×1080 → 1904×984 | (934, 329) | ∅438 (45%h) | 110% do círculo | não |
| 2560×1440 → 2529×1344 | (1281, 553) | ∅692 (51%h) | 110% | não |
| 2560×1320 (a janela do dono) | (1284, 532) | ∅688 (52%h) | 110% | não |
| 3440×1440 (21:9) | (2584, 574) | ∅974 (68%h) | 110% | 0,1% |
| 3840×2160 (4K) | (1917, 1001) | ∅1386 (64%h) | 110% | 0,3% |
| 5120×1440 (32:9) | (3585, 576) | ∅1126 (78%h) | 110% | 2,1% |
| 7680×4320 (8K) | (3843, 2138) | ∅3180 (74%h) | 110% | 3,3% |

Em todas elas quem decide o tamanho é o **piso do `findSpotNearest`** (0,8 do vão): o teto de
`0,42 · altura` fica acima em todas — ver "O teto é `0,42 · altura`" abaixo, onde a razão
estrutural disso está demonstrada.

A coluna da direita é o preço da restrição dura: onde a nuvem, no extremo do slider, passaria do
obstáculo mais próximo se o raio ficasse no tamanho que o vão permite, o raio cede. **Até 2560px
não há preço nenhum**; a partir de 3440px ele é da ordem de 0,1–3% nos viewports medidos. A
concessão é *conservadora por construção*: a conta compara a silhueta na direção **radial**, que
é a do pior caso (a projeção fora do eixo é uma elipse alongada nessa direção), enquanto o
obstáculo mais próximo pode estar em outra — por isso ela encolhe 2–3% mesmo medindo, depois, que
a nuvem não chegaria a cruzar nada.

**Telefone baixo: a decisão de "aceitar o que sobra" ficou quase sem casos.** Ela só é escondida
quando nem o maior vão alcança `floorRadiusPx` (48px) — medido, isso acontece em **320×480**, onde
o maior vão é ∅40 e o grupo fica invisível (`systemsGroup.visible = false`). Em **320×568**, o
menor viewport em que ela aparece, o vão é ∅138 e a esfera sai com **∅108**. A 360×667 — o
telefone baixo que era o caso perdido até 2026-09-23 — ela sai com **∅219**, e a 500×714 com
∅260: as duas mudanças que a resgataram foram o `heroSubline` encurtado (a versão longa, ~230
chars em 5 linhas, empurrava o texto até ~80% da tela) e o texto menor abaixo de 768px. O resumo
completo do CV continua no `About`.

**A nuvem de pontos no topo do slider.** `ORBIT_RADIUS` é constante para o slider de
distorção **não** mexer no tamanho da esfera (uma referência viva faria as órbitas encolherem
ao arrastar "Flux Dynamics" para o topo — o slider mudaria o tamanho da única coisa que
se vê). A nuvem, porém, cresce com ele: `5,4 + distortion + 0,4` de mundo, ou seja **~110% de
`ORBIT_RADIUS`** no topo — e essa é exatamente a envolvente em que as ÓRBITAS são desenhadas desde
2026-09-23 (`ORBIT_ENVELOPE_RATIO`, ver "As órbitas"), de modo que no topo do slider os três anéis
coincidem com a nuvem e param de aparecer por fora dela. Como a inversão da silhueta é convexa,
+10% de raio de mundo dá mais que +10% de raio em tela.

**A esfera cresceu TRÊS vezes, e as duas primeiras alavancas foram a NUVEM, não o vão
(2026-09-23).** O dono pediu *"pode aumentar um pouco o tamanho da esfera, se atentando a manter
ela no centro da tela, e ainda evitando sobreposição"*, depois *"ainda dá para aumentar um pouco
mais"* e depois *"ainda dá para aumentar um pouco mais a esfera e aumente as órbitas também, para
que apareçam, quero que a esfera com as órbitas ocupem o maior espaço possível de tela"*. Com a
esfera já centrada e encostando no teto da porteira central, crescer o **círculo reservado**
custaria caro (só a folga é alavanca ali, e encurtá-la faz a guarda da nuvem morder em tela larga
— medido). A alavanca sem custo nenhum é a **outra ponta**: o quanto a bola desenha *dentro* do
círculo que já existe. A nuvem em repouso desenhava 77% dele; as órbitas, 100% (e no pedido
seguinte, já com a bola em 100%, elas passaram a 110% — mas por FORA, sem mexer no círculo: ver
"As órbitas").

O que a guarda `radiusWithinGap` reserva é o **pior caso** da nuvem — raio-base **+** empurrão do
cursor **+** topo do slider. Então o empurrão e o topo são orçamento que se pode ceder para o
raio-base, desde que a **soma** não cresça:

| raio-base | empurrão | topo do slider | soma | repouso desenha | ganho |
|---|---|---|---|---|---|
| 4,0 | 0,8 | 2,0 | 6,8 | 77% do círculo | — |
| 4,8 | 0,8 | 1,2 | 6,8 | 90% | +17% |
| 5,4 | 0,4 | 1,0 | 6,8 | 100% | +11% |
| **5,4** | **0,4** | **0,8** | **6,6** | **100%** | **+3,8%** |

As **três primeiras linhas trocam parcelas dentro da mesma soma** (6,8 = 113% de `ORBIT_RADIUS`),
e por isso o `cloudRatio` é idêntico nas três e a guarda devolve **exatamente os mesmos números
em toda tela**: mesmo raio reservado, mesmo pior caso, mesma folga, e a guarda mordendo nos MESMOS
casos — logo o ganho é **uniforme, inclusive nas telas largas onde a guarda manda**. O que subiu é
só o repouso, até a bola **encher** o círculo reservado (que é a régua que ficou para ela — as
órbitas saíram para a envolvente no pedido seguinte, ver "As órbitas"). Os
dois preços, explícitos: o empurrão do vértice sob o cursor caiu de 0,8 para **0,4** (a bolha que
segue o mouse é a metade — o resto da reação ao ponteiro é a paralaxe da câmera) e o topo do
slider "Flux Dynamics" desceu de 2,0 para **1,0**. Subir o raio-base **sem ceder** um dos dois é
que não dá: aí a soma passa de 6,8 e a guarda encolhe a esfera justamente nas telas largas.

**A quarta linha é de outra natureza: ela BAIXA a soma, e é aí que a alavanca muda de lado.** Com
100% do círculo já ocupado, não havia mais o que raspar *dentro* dele sem engolir as órbitas — que é
literalmente o pedido que o dono fez em seguida, e que se resolveu do outro lado da cerca (ver "As
órbitas": os anéis foram para a envolvente, 10% além). Aqui o que sobrou foi mexer no **teto da
guarda**, que é `folga / (cloudRatio − 1)`:

- Baixar o topo do slider de 1,0 para 0,8 leva a soma de 6,8 para **6,6** e o `cloudRatio` de
  1,1333 para **1,100**. O excesso relativo da nuvem cai, e o teto que a guarda sustenta com uma
  folga dada sobe de **7,5× para 10×** essa folga.
- Com 10× em vez de 7,5×, **cortar folga deixa de ter preço** em tela larga: `BREATHING_PX` caiu
  de 24 para **16** e `PARALLAX_WORLD` de 0,5 para **0,4** (ver "A folga é derivada"), e as duas
  juntas devolvem um círculo **maior** — medido em 2529×1344: ∅666 → **∅692**, e na janela real do
  dono (2560×1320) ∅688 em 50% da largura. A guarda morde **menos** do que antes: 2% em 5120×1440
  e em 7680×4320, contra 3% nas duas.
- Preço visível: o topo do "Flux Dynamics" fica a **75%** da pista (o padrão 0,6 não está mais no
  meio dela) e a varredura da câmera cai ~20%.

**Onde a alavanca acaba — e por que a resposta agora não é mais "acabou".** Em 100% a bola em
repouso **enche** o círculo, então raspar *dentro* dele engoliria as órbitas (é o que o olho lê
como a esfera): `5,6 + 0,4 + 0,8` daria +3,3% (o slider com 0,8 de pista) e zerar empurrão e topo
(`6,8 + 0 + 0`) daria +23% matando a reação ao cursor e o slider. Mas o teto `folga / (cloudRatio −
1)` mostra que o **topo do slider é uma alavanca sobre a folga**, e a folga é alavanca sobre o
raio: o corte de 0,2 no topo comprou **33% mais raio** para a mesma folga (~15% a cada 0,1, já que
o teto vai com `1/(cloudRatio − 1)`). O limite dessa direção é
o slider virar um botão — abaixo de ~0,4 de pista ele deixa de ser um controle e passa a ser um
interruptor, e aí o ganho (~+4% por 0,2 de topo) não paga o que se perde de interação. Se o
pedido vier de novo, é esta a conversa: **topo do slider ↔ folga ↔ raio**, e não uma busca por
vão. **Para as órbitas, a alavanca é a mesma e agora tem nome**: elas são desenhadas na envolvente
(`ORBIT_ENVELOPE_RATIO = cloudRatio`), então o topo do slider as move **direto** — e o teto é o
próprio `cloudRatio`, porque acima dele a garantia de não-sobreposição deixa de cobrir os anéis.

Medido no dump real do monitor do dono (2529×1344, o CSS viewport de uma janela de 2560×1440), a
tinta da nuvem em repouso foi de ∅511 → ∅599 → ∅666 e o círculo reservado **acompanhou** (era
∅666 nas três primeiras linhas, e em 100% a bola enche o círculo). Com a quarta linha o círculo
cresceu para **∅692** e a tinta foi junto — os números vêm das mesmas funções que o componente
usa, com o `usedPx` do dump real. E é nesse mesmo ∅692 que os três anéis agora estão desenhados
**por fora** (∅654 / 700 / **765**, o de fora 10,5% além): a tinta que o olho mede nessa tela
passou a ser ~765, sem a bola ter mudado um pixel.

E a captura de tela em 2560×1440 confere: medindo os pixels claros da nuvem (limiar de brilho 90)
nas capturas do mesmo estado de layout, a tinta foi de **500 × 496px** (nuvem 4,0) para
**586 × 582px** (4,8, **+17,2%**) e **660 × 654px** (5,4, **+12,6%**) — sempre ~2% abaixo do ∅ do
modelo, porque a partícula mais externa cai logo dentro da envolvente geométrica, não sobre ela.
Na captura da config atual (a quarta linha) ela mede **695px** de largura contra os **∅692** do
modelo: 3px de diferença. O centro da nuvem fica
**parado no mesmo pixel** (1290, 630 ± 2): a esfera cresceu sem andar e sem encostar em nada,
porque o que mudou foi só quanto ela desenha do círculo que já estava reservado para ela.

O que absorve esse excesso é a folga de `marginPx` — 16px de respiro + 8px da animação + a
paralaxe (~h/42). Mas o excesso é **relativo** (cresce com o raio) e a folga é **absoluta**
(cresce com a altura): os dois se cruzam quando o raio passa de ~35% da altura, o que só
acontece em tela muito larga — medido, a partir de ~3440px. **É aí que entra o `radiusWithinGap`**
(`src/utils/screenBudget.js`), chamado pelo `ThreeCanvas` logo depois de escolher o vão: ele
compara o raio de mundo da nuvem no extremo do slider com o raio de mundo que caberia até o
obstáculo mais próximo (o `obstacle` que as buscas do `freeSpot.js` passaram a devolver) e, se a
nuvem passaria, devolve o maior raio que não passa. Onde a nuvem cabe — **praticamente toda
tela** — ele devolve o teto intacto, sem mexer em nada.

Foi essa guarda que deixou as **três primeiras linhas** da tabela acima serem **de graça**: como o
`cloudRatio` não mudou (o raio-base subiu e o empurrão/topo do slider desceram **juntos**, de modo
que o pior caso continua 6,8 de mundo), a guarda devolve exatamente o mesmo número em toda
viewport — mesmas colunas de "Diâmetro reservado" e "Nuvem no extremo", inclusive nas linhas em
que ela morde. O que mudou foi só o que a nuvem desenha lá dentro, em repouso. **A quarta linha é
a exceção, e é a que muda os números**: ela baixa a soma para 6,6, e daí a guarda morde menos em
tela larga (2% em vez de 3% em 5120 e 7680) e o teto dela sobe o suficiente para a folga encurtar
sem preço — é o que faz o círculo reservado crescer no monitor do dono.

A troca segue a mesma de sempre: o **círculo é da bola em repouso** (é o que o olho lê como a
esfera, e as órbitas o usam como referência a 110%), e a alternativa de deixar a nuvem ditar **em
toda tela** encolheria a bola ~10% em todo viewport — justamente o defeito que a inversão da
silhueta veio corrigir. O teto da nuvem só morde onde a outra ponta seria a nuvem encostar em algo. No
valor padrão do slider (0,6) a nuvem **enche** o círculo (100%) — é o estado em que o site abre, e
a partir daí o slider só pode crescer; no topo (0,8) ela pede **110%** do círculo, e quem absorve
esse excesso é a folga de 16+8+paralaxe. Só em tela muito larga (5120×1440 e acima) a folga é
estreita o bastante para a guarda preferir ceder 2% do raio a deixar a nuvem passar.

**Ao somar um elemento fixo ao Hero, marque-o com `data-hero-occupied`** — um elemento não
marcado é um lugar onde a esfera pode cair em cima. Nada está isento, nem o painel de calibração:
o vidro admitiria a esfera por trás, mas ela atravessá-lo por baixo da moldura lê como defeito.
