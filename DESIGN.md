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
| Nome no Hero | `text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter` |
| Tagline do Hero | `text-2xl md:text-4xl tracking-tight text-zinc-600` |
| Título de seção | `text-3xl md:text-4xl font-medium tracking-tight text-white` |
| Título de contato | `text-3xl md:text-5xl` |
| Corpo | `text-sm md:text-base font-light leading-relaxed text-zinc-400` |
| Eyebrow / meta | `font-mono text-xs` (`tracking-widest` no Hero) |

## Convenções de superfície

- **Borda de fio, não bloco.** Divisória de seção: `border-b border-white/5`.
  Moldura de card ou imagem: `border border-white/10` + `rounded-2xl`.
- **Card padrão:** `rounded-2xl border border-white/5 bg-white/[0.02]` com
  `hover:border-white/10 hover:bg-white/[0.04]`. É o padrão dos tiles de tech, dos
  cards do Sobre e dos cards de projeto — mantenha-o ao criar um card novo.
- **Vidro (`.tech-glass`):** só o painel de calibração e chips sobre imagem. Não use
  como fundo de seção.
- **Profundidade vem de gradiente e blur, não de sombra.** `shadow-sm` aparece apenas
  no botão primário; o resto é `blur-[120px]` no glow do Hero e gradiente
  `from-[#050505]` sobre a foto.

## Classes globais (`src/index.css`)

Só entra no CSS global o que o Tailwind não expressa. Hoje são seis:

| Classe | O que faz |
|---|---|
| `.hero-vh` | `min-height: 100svh` dentro de `@supports`. Ver "Altura do Hero" abaixo. |
| `.tech-glass` | Painel de vidro (fundo translúcido + blur 20px + borda de fio). |
| `.grid-overlay` | Grade técnica de 32px, desvanecendo nas bordas via `mask-image`. |
| `.bg-mesh` | Fundo de gradientes radiais da seção de contato. |
| `input[type="range"]` | Slider do painel de calibração (webkit + moz). |
| bloco `prefers-reduced-motion` | Neutraliza `animate-fade-in` / `animate-flow` / `animate-pulse`. |

Mais o bloco `:root { --accent }` e `html { scroll-behavior: smooth }` (que é
desligado sob reduced-motion).

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

## Contrato de z-index (Hero)

Ordem obrigatória — nunca use z negativo:

| Camada | z |
|---|---|
| Decorações (`.grid-overlay`, glow laranja) | `z-0` |
| Canvas 3D | `z-[1]` |
| Conteúdo (header, headline, CTAs) | `z-20` |
| Painel de calibração | `z-30` |

O `<section>` do Hero precisa de `relative` (senão o canvas `absolute inset-0` se ancora
no viewport e cobre a página inteira) e de `overflow-hidden` (senão vaza para as seções
seguintes). As demais seções usam `relative z-20` — ver `Section.jsx`.
