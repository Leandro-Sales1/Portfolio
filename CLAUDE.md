# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## Comandos

```bash
npm run dev      # vite — servidor de desenvolvimento
npm run build    # vite build — saída em dist/
npm run lint     # eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
npm run preview  # vite preview — serve o build de produção
```

- Gerenciador: **npm** (só existe `package-lock.json`). Node **22.x** via `engines` no `package.json`, sem `.nvmrc`.
- **Não existem scripts `test`, `format` ou `deploy`, nem runner ou arquivos de teste.** Não invente um comando de teste.
- O `lint` usa `--max-warnings 0`: qualquer warning quebra o comando, inclusive a regra `warn` de `react-refresh/only-export-components`.
- O `lint` fixa `--ext js,jsx`, então ignora silenciosamente outras extensões se um `.ts`/`.tsx` for adicionado depois.
- O `.eslintrc.cjs` usa `env: { browser: true, es2020: true, node: true }`. O `node: true` é necessário para os arquivos de config da raiz (`postcss.config.js` usa `process`); sem ele o `lint` falha inteiro com `'process' is not defined`. O `ignorePatterns` inclui `flowforge-saas-1` — ver a nota sobre o template no fim.
- Não há `.github/workflows/` nem `vercel.json` no repositório. O deploy é a integração git da Vercel configurada no painel (build `npm run build`, saída `dist`), fora do repositório.

## Arquitetura

**Entrada e composição.** `index.html` → `src/main.jsx` (`React.StrictMode`) → `src/App.jsx`. O `App.jsx` é a página única e o **único** dono do estado de idioma: guarda `isEn` e repassa o objeto de locale inteiro por props. Não há router (`react-router` não é dependência), não há context, não há store.

`App.jsx` compõe, em coluna vertical: `Hero` → `About` → `TechsGrid` → `Projects` → `Contact` → `Footer`, todos em `src/components/sections/`.

- `src/components/ui/` — 5 primitivas: `Container`, `Section`, `Button`, `Badge`, `LangToggle`. **Pare aqui.** Não crie `Card`, `Heading`, `Text` ou `Stack`; os cards são estilizados inline com o padrão de borda de fio (ver `DESIGN.md`).
- `src/data/` — `techs.js` (os 15 ícones `{name, Icon, color}`), `socials.js` (LinkedIn/GitHub/WhatsApp) e `nav.js` (âncoras das seções). São a fonte única: a nav do Hero e a do Footer leem de `NAV`, então não têm como divergir.
- `src/api/instance.js` — inalterado.

**O idioma é feito à mão — não existe biblioteca de i18n.** `src/locales/pt.json` e `src/locales/en.json` (29 chaves cada) são importados direto no `App.jsx`, e `const text = isEn ? en : pt` desce para todo componente como a prop `text`. Os componentes consomem o **objeto inteiro** (`{text.aboutMe}`, `{text.linkCV}`), não uma função `t()`. O switch é o `src/components/ui/LangToggle.jsx` (dois `<button aria-pressed>`), **não** mais um checkbox estilizado por CSS.

- **Português é o padrão**, mas a escolha **é persistida** em `localStorage` (`portfolio:lang`) desde o redesign; o `useState` inicial lê essa chave, então um reload mantém o idioma.
- Um `useEffect` no `App.jsx` sincroniza `document.documentElement.lang` (`en` / `pt-BR`) com o estado.
- **Toda string nova precisa existir em `pt.json` e `en.json`.** Chave presente em só um arquivo renderiza `undefined` — e **React renderiza `undefined` como nada, sem erro no console**. O modo de falha é uma seção silenciosamente em branco. Ao adicionar chave, compare os dois arquivos (`Object.keys` de cada um).
- Manter texto novo nos arquivos de locale, não nos componentes. Exceções deliberadas: nomes próprios (Leandro Sales, LinkedIn, GitHub, WhatsApp, nomes das techs), os **índices mono das seções** (`01`–`04`, neutros de idioma) e os **labels do painel de calibração** (ver abaixo).

**O texto dos projetos é uma segunda camada de localização, e vem da API.** Cada objeto traz `descricao` (PT) e `descricaoEn` (EN), e o `Projects.jsx` resolve antes de descer a prop (`isEn ? card.descricaoEn || card.descricao : card.descricao`) — o `||` evita card em branco quando a versão EN não foi preenchida.

**Os cards de projeto vêm de uma API remota, não do repositório.** `src/api/instance.js` exporta um axios com `baseURL` **hardcoded** (`https://json-server-portfolio.vercel.app`, sem env var e sem fallback). Único consumidor: `Projects.jsx`, com `instance.get('/cards', { signal })` dentro de um `useEffect` com `AbortController`. Campos consumidos: `imagem`, `titulo`, `descricao`, `descricaoEn`, `link`, `gitHub`.

- **A API não tem campo `id`** (verificado em 2026-09-22: 7 cards, chaves `imagem, titulo, descricao, link, descricaoEn`, e `gitHub` presente em só **3 dos 7**). Então `key={card.titulo}` é a única opção — **quebra se dois projetos tiverem o mesmo título**.
- A falha da API virou três estados (`loading` / `ok` / `error`) com skeleton, mensagem traduzida e botão de retry. O antigo `alert()` bloqueante e fixo em português foi removido — não o reintroduza.

> Para mudar o conteúdo dos projetos, edite o JSON server externo — **não este repositório**. E os valores de `imagem` são caminhos absolutos `/imagens/...` resolvidos contra `public/`.

**Fundo 3D.** `src/components/backGround/ThreeCanvas.jsx` — `three` puro (`ShaderMaterial` com shaders GLSL de ruído simplex, `IcosahedronGeometry`, `AdditiveBlending` + 3 órbitas `EllipseCurve`). Não usa `@react-three/fiber`.

O contrato com o painel de calibração é **5 props que viram uniforms**: `distortion` → `uDistortion`, `detail` → `uSize` (`detail * 2.0`), `speed` → `speedRef` (lido dentro do RAF), `opacity` → `uOpacity`, `color` → `uColor`. Todas mudam **ao vivo após o mount**.

- O `useEffect` de init tem **deps vazias de propósito** e fecha sobre as props (daí o `eslint-disable react-hooks/exhaustive-deps` no topo). **Não adicione as props às deps** — o canvas seria destruído e recriado a cada arrasto de slider.
- O estado do painel vive no `Hero` como **um objeto** `params`; `HeroCalibration` é controlado (`params` / `onChange`).

**Estratégia responsiva.** Não existe mais detecção de viewport em JS: `src/utils/viewport.js`, `useViewportDimensions`, `isMobile` e o `<section>` com altura/largura inline foram **removidos**. O layout é coluna vertical e o corte do canvas 3D é interno (`container.clientWidth < 1024`). Não recrie um hook de viewport — se precisar de comportamento por breakpoint, use classes `md:`/`lg:`.

**Estilo.** Tailwind 3 com tokens reais em `tailwind.config.js` → `theme.extend`: `fontFamily.sans` (Inter) / `mono` (JetBrains Mono), `colors.accent` (`#f97316`) / `surface` / `panel`, e `keyframes`/`animation` de `fade-in` e `flow`. A identidade completa está em **`DESIGN.md`** — leia antes de estilizar qualquer coisa nova.

> O CSS compilado do Tailwind 3 é **plano**: `@layer` aparece **0 vezes** na saída (é construct de compilação, não de runtime). A ordem efetiva é base → components → utilities não-prefixadas → regras custom → utilities responsivas. Logo, uma regra custom vence uma utility não-prefixada, mas **perde** para a responsiva. **Nunca conte com uma classe do `index.css` para sobrepor `md:text-6xl`.**
>
> Pela mesma razão, **`className="px-4"` não sobrepõe um `px-5` interno de um componente** (a cascata é a posição no CSS gerado, não a ordem no `className`). Por isso `Button` expõe `size` e `iconPosition` como props em vez de deixar o chamador passar classes conflitantes. Não há `clsx` nem `tailwind-merge` — decisão consciente; as primitivas concatenam `className`.

## Convenções e armadilhas conhecidas

- **Não há `prop-types`** em lugar nenhum, embora o ecossistema esteja carregado no ESLint. Todo componente com props abre com `/* eslint-disable react/prop-types */`. **Siga a convenção de disable por arquivo** — não introduza `prop-types` nem migre para TypeScript sem que isso seja pedido.
- O `.eslintrc.cjs` fixa `settings.react.version` em `'18.2'` enquanto o React **19** está instalado — defasado, e fonte de regras do `plugin:react/recommended` disparando de forma imprecisa. O `parserOptions` também não define `ecmaFeatures.jsx`.
- **Os labels do painel de calibração são em inglês e hardcoded** ("System Calibration", "Flux Dynamics", "Processing Threads", "Clock Rate", "Density", "Energy Profile"). **É deliberado**: são readouts de instrumento, não prosa — em ferramenta real são idênticos nos dois idiomas. Não "conserte" isso para o locale sem falar com o dono do projeto.
- **Cor do ícone de tech vai na custom property `--brand`**, via `style={{ "--brand": color }}` no tile, e o ícone usa `group-hover:text-[color:var(--brand)]`. Não volte para `style={{ color }}` direto no ícone: era esse o motivo de o `hover:text-black` do portfólio antigo nunca funcionar (a cor inline vencia a classe).
- **O Hero depende de empilhamento explícito** (`z-0` decoração / `z-[1]` canvas / `z-20` conteúdo / `z-30` painel) e de `relative overflow-hidden` no `<section>`. Nunca use z negativo. Detalhes em `DESIGN.md`.
- **`text-balance` é utility nativa** do Tailwind 3.4 — não recrie no CSS. E **`min-h-svh` não existe** na 3.4.19: a altura do Hero usa `.hero-vh` com `@supports` no `index.css`.
- O `three` é dependência **direta e usada** (`ThreeCanvas.jsx`). Removidas no redesign e **não reintroduzir sem motivo**: `@react-three/fiber` (só era usado pelo antigo `Bg3D.jsx`), `motion`, `clsx`, `tailwind-merge`. O bundle caiu de >1 MB (~318 kB gzip) para **~748 kB (~212 kB gzip)**.
- O bundle ainda passa de 500 kB e o Vite avisa no `build` — é o `three`. **O aviso é esperado, não é erro de configuração.**
- Comentários e identificadores são em inglês; o português em `src/` é a cópia do `pt.json` e as mensagens de locale.
- **`origin/dev` é um protótipo divergente e obsoleto**, não um branch de feature a ser mergeado: ele adiciona `src/assets/Cards.json`, `banner/`, `rodape/`, `cardProjetos/` e remove `Bg3D.jsx`, `Techs.jsx`, `utils/viewport.js` e a API axios (passando a usar JSON local). Se pedirem "merge da dev", **confirme a intenção antes**.
- Remoto git: `https://github.com/Leandro-Sales1/Portfolio`, branch ativa `main`.

**Assets.** Tudo em `public/`, com URL absoluta a partir da raiz, sem hashing do bundler e sem `import` de asset:

- Os CVs ficam na **raiz** de `public/` (`Leandro_Sales_Desenvolvedor_Fullstack.pdf` = PT, `Leandro_Sales_Fullstack_Developer.pdf` = EN) e são baixados como `/${text.linkCV}`. O `linkCV` no locale é só o nome do arquivo — **a barra inicial vem do componente**. Renomear ou substituir um CV significa atualizar `linkCV` nos dois arquivos de locale.
- `public/imagens/fotoPrincipal.png` é o retrato do `About.jsx` (única imagem referenciada por código em `src/`), e `Portfolio.png` é a imagem de OG/Twitter do `index.html`.
- As demais imagens de `public/imagens/` **não são referenciadas por código em `src/`**: quem as referencia é a API remota, que devolve caminhos como `/imagens/mind-guard.png` resolvidos contra este mesmo `public/`. Adicionar um projeto exige **as duas coisas**: soltar a imagem em `public/imagens/` **e** adicionar o objeto na API externa — mexer só neste repositório não faz o projeto aparecer.
- O favicon é `/imagens/favicon.ico` (absoluto, `type="image/x-icon"`) — era o único caminho relativo do projeto e estava rotulado `type="image"`.

> `flowforge-saas-1/` era o template de referência do redesign visual. Está no `.gitignore` e **deve ser apagado** ao final do port; nada em `src/` importa de lá. Se a pasta reaparecer, trate como referência descartável — não a commite e não importe nada dela.
