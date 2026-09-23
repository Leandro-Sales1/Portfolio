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
| `panel` | `#27272a` | Trilha de slider, linhas de órbita do canvas, cinza de painel. |
| — | `#ffffff` | Texto de primeiro nível e o botão primário. |
| — | `#d4d4d8` | Cor inicial dos pontos do canvas (zinc-300). |

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
tela** onde ainda caiba um círculo que não perca mais de 10% do maior vão livre — tudo
calculado a partir dos retângulos reais dos elementos do Hero:

1. O Hero marca o que ocupa espaço com `data-hero-occupied` — e marca **folhas, não caixas**:
   o `div` do logo e a `nav` do desktop em separado (a faixa do meio do topo fica livre), a
   nav do mobile, as 5 folhas do bloco de texto (eyebrow, `h1`, tagline, subline, CTAs) e o
   painel de calibração. O motivo de não marcar o bloco de texto inteiro não é ele ser largo:
   é que **`getBoundingClientRect` inclui o padding**, e o `lg:pr-80` do bloco põe 320px de
   padding dentro da caixa medida — o obstáculo se estendia 320px além da tinta, justamente na
   faixa (1024–1440px) em que a restrição é horizontal.
2. Nas folhas **bloco** o marcador tem valor: `data-hero-occupied="ink"` (o `h1`, a tagline,
   o subline, o eyebrow e a linha de CTAs). Todas são `block` ou `flex`, então a caixa vai até
   a borda da coluna — em `1409×804` o `h1` tem 708px de caixa e ~588px de tinta, e o eyebrow
   tem 896px de caixa com **~300px** de tinta. Um `Range` sobre o conteúdo mede a tinta. O
   `measure` une a tinta do `Range` com as caixas dos filhos, porque o `Range` só pega nós de
   texto e o eyebrow tem um ponto de acento que é `<div>`. Nas caixas com moldura visível (as
   duas navs, o logo, o painel, os chips, o `LangToggle`) a caixa **é** a tinta: medi-las por
   `Range` encolheria o obstáculo para dentro da própria moldura, e a esfera poderia encostar
   nela.
3. **O painel de calibração É obstáculo** (`data-hero-occupied` no wrapper dele). O vidro
   admitiria a esfera por trás, e houve uma tentativa de liberá-lo — mas atravessá-lo por baixo
   da moldura lê como defeito, e "sem sobreposição" é a restrição dura do dono. Custa tamanho:
   são 317px de altura bloqueando a metade direita da faixa central em `1409×804`, e é por isso
   que a esfera **não** fica no meio da tela no desktop. Quem manda no empilhamento continua
   sendo o `z-30`.
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

### A troca entre tamanho e centro, e por que ela é explicada (não escolhida por gosto)

O dono deu as três exigências **em ordem de prioridade**, e é ela que o código implementa:
sem sobreposição é restrição dura (as duas buscas nunca devolvem um ponto que cruze um
retângulo medido), tamanho relativo vem antes de posição (o maior vão é a régua) e "tente ficar
no centro" é a que cede. **As três não cabem juntas em toda tela, e o motivo é geométrico**: o
meio da tela é um corredor entre o texto (embaixo, à esquerda) e o painel (embaixo, à direita).

Medido no DOM real, com o par `hasPointer`:

| Viewport | Centro da tela | Maior vão (plano B) | Escolhido (centrado) |
|---|---|---|---|
| 500×714 (telefone) | (250, 357) | ∅202 em (399, 612) | ∅184 em (408, 593) |
| 784×954 (tablet retrato) | (392, 477) | ∅484 em (542, 711) | ∅438 em (541, 675) |
| 1008×672 | (504, 336) | ∅497 em (760, 420) | ∅455 em (736, 417) |
| 1264×704 | (632, 352) | ∅344 em (711, 522) | **∅311 em (698, 353)** — centro vertical exato |
| 1409×804 | (712, 402) | ∅359 em (648, 179) | ∅324 em (676, 199) |
| 1904×984 | (952, 492) | ∅530 em (826, 268) | ∅478 em (881, 301) |

São **diâmetros do círculo reservado**, do DOM real (não de caixas sintéticas), e a tinta que o
olho vê é a das órbitas, que enchem esse círculo por construção. A coluna "maior vão" é o que a
esfera fazia antes: note que ela é **tangente à borda de cima** em 1409×804 (`y = raio`, por
definição) e em 1264×704 cai 170px abaixo do centro. O ganho de centralização varia muito com a
tela — em 1264×704 o centro vertical exato custa 9% do raio, em 1409×804 os mesmos 10% compram
só 11% da distância até o centro. **É por isso que a fração é 0,9 e não 0,6**: com 0,6 a esfera
chegaria perto do meio, mas com **metade** do tamanho — e o dono pediu "tamanho relativo e
importante na exibição" antes de pedir o centro. Quem quiser o outro lado da troca muda
`CENTER_SIZE_FLOOR` em `src/utils/screenBudget.js` e mais nada.

Duas tentativas anteriores de resolver isso erraram pelo mesmo motivo, e as duas deixaram
rastro: numa a esfera ia para o centro a qualquer preço e saía **pequena e cortada**; noutra o
painel deixou de ser obstáculo para o centro caber e a esfera passava por baixo do vidro. A
medição que faltava nas duas é a mesma: **o corredor central do desktop tem raio de ~90px
contra ~180px no vão** — o centro, ali, custa metade do tamanho.

**O plano B é o que preserva o telefone.** Em coluna única o centro da tela está DENTRO do
bloco de texto: nenhuma posição central alcança o piso de tamanho, o `findSpotNearest` devolve
`null` e a esfera fica no vão, encostando no canto — a composição que já estava aprovada ("o
vão decide"). No tablet em retrato ela se move um pouco (∅484 → ∅438, −9%) porque ali o vão
tem folga de sobra.

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
`envelopeWorldRadius` (`src/utils/screenBudget.js`); aqui a órbita é desenhada com raio `ρ` (a
escala é `ρ / ORBIT_RADIUS`, com `ORBIT_RADIUS = 6.0` **constante**), então as órbitas — o que o
olho lê como a esfera — **enchem o círculo reservado por construção** (medido: 99–100% dele em
qualquer offset e em qualquer instante da animação). Com a silhueta correta o recuo em `z` do
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

**A folga é derivada, não constante.** `freeSpot.js` tem um `DEFAULT_MARGIN = 32` que é só o
padrão de quem chama a função solta; o Hero passa a sua, vinda do orçamento: 24px de respiro +
8px da animação de entrada (`animate-fade-in` começa em `translateY(8px)`, e a medição roda no
mount) + **a paralaxe da câmera em pixels** (`0,5 · fPx / distance`, ~27px num hero de 900px e
~43px num de 1440px) — esta última só onde há ponteiro, porque em telas de toque o listener de
`mousemove` não existe, a câmera não anda e não há nada a reservar. Era 8px no papel contra
27–43px reais; com a escala corrigida a esfera encosta mesmo no limite, e a folga curta passou
a significar sobreposição com o mouse no canto.

A mesma folga vale contra as **bordas** do hero? Não — e isso foi medido, não escolhido. Houve um
`edgeMargin` (folga contra as bordas do container, além do `margin` de cada retângulo) e ele saiu
do `freeSpot.js`: quando o maior círculo está encostado numa borda — e no desktop ele está, no
topo — exigir 56px de folga das quatro bordas tira **~15% do raio** dele. O piso de tamanho é
medido com a mesma régua da busca, então o resultado não seria injusto, só menor: a esfera
centrada sairia menor que o plano B. Quem resolve o "colado na borda" é a própria busca de
centro, que puxa o círculo para dentro; e onde ela não pode puxar (o plano B), encostar é a
composição aprovada.

**O teto é `0,42 · altura` e nunca entra.** Medido no DOM real, o maior círculo é ∅530 em
1904×984 — 27% da altura, contra os 84% de diâmetro que o teto permitiria — e a proporção se
mantém nas outras viewports. Ele existe como freio contra número degenerado: sem teto, num vão
enorme, `ρ` se aproxima da distância até a câmera e a tangente da bisseção explode. Se a esfera
parecer pequena num caso específico, o botão não é a escala: é **encurtar o texto do Hero** — o
subline é o que come o vão.

**Em telefone baixo ela não aparece.** A decisão registrada é "aceitar o que sobra": em telas de
até ~667px de altura não há vão, e a alternativa era voltar a sobrepor o texto. O menor viewport
medido nesta rodada é 500×714, onde ela aparece com ∅184. Foi por isso que o `heroSubline` foi
encurtado em 2026-09-23: a versão longa (~230 chars, 5 linhas) empurrava o texto até ~80% da
tela de um telefone e não sobrava vão nenhum. O resumo completo do CV continua no `About`.

**A nuvem de pontos no extremo do slider.** `ORBIT_RADIUS` é constante para o slider de
distorção **não** mexer no tamanho da esfera (uma referência viva faria as órbitas encolherem
12% ao arrastar "Flux Dynamics" de 0,6 para 2,0 — o slider mudaria o tamanho da única coisa que
se vê). A nuvem, porém, cresce com ele: `4,0 + distortion + 0,8` de mundo, ou seja **~113% de
`ORBIT_RADIUS`** no extremo — a tinta mais externa passa do círculo reservado em ~15% de
`usedPx`. O excesso é **relativo** e o respiro do orçamento é **absoluto** (24px + 8px), então
os dois só se equivaleriam por volta de `usedPx ≈ 210px`; como a esfera passa disso em todo
desktop (∅324 em 1409×804), hoje o excesso (~31px em 1024×768, ~43px em 1440×900, ~69px em
2560×1440) é **maior que o respiro**. Quem absorve é a folga da **paralaxe** (~27px num hero de
900px, ~43px num de 1440px), que existe exatamente para o deslocamento da câmera. Ou seja: no
pior caso teórico (ponteiro no canto E slider no máximo E ruído saturando no mesmo vértice) a
nuvem pode encostar no texto. No valor padrão do slider (0,6) ela fica a **79%** do círculo e
**não há excesso nenhum** — é o estado em que o site abre. Foi troca consciente: as órbitas ditam
o círculo (ficam dentro dele por construção e são o que o olho lê como a esfera), e a alternativa
— os raios da nuvem ditando — encolheria as órbitas ~13% em todo viewport, que é justamente o
defeito que a inversão da silhueta veio corrigir.

**Ao somar um elemento fixo ao Hero, marque-o com `data-hero-occupied`** — um elemento não
marcado é um lugar onde a esfera pode cair em cima. Nada está isento, nem o painel de calibração:
o vidro admitiria a esfera por trás, mas ela atravessá-lo por baixo da moldura lê como defeito.
