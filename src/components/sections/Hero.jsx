/* eslint-disable react/prop-types */
import { useState } from "react";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import { NAV } from "../../data/nav";
import ThreeCanvas from "../backGround/ThreeCanvas";
import Button from "../ui/Button";
import LangToggle from "../ui/LangToggle";
import HeroCalibration from "./HeroCalibration";

/** Estado inicial do fundo 3D — os valores do template, com o cinza padrão. */
const INITIAL_PARAMS = {
  distortion: 0.6,
  detail: 0.9,
  speed: 0.1,
  opacity: 0.8,
  color: "#d4d4d8",
};

/**
 * Sublinhado de acento dos links de nav, revelado da esquerda no hover. Vive como
 * constante porque é usada nos 4 links daqui — o mesmo par de classes está no
 * Footer.jsx, e extrair para um módulo compartilhado seria mais acoplamento do que
 * o projeto aceita para uma string de classe.
 */
const NAV_LINK =
  "relative transition-colors duration-200 ease-out-expo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out-expo after:content-[''] hover:after:scale-x-100";

/**
 * Hero: nav, nome, tagline, CTAs e o painel de calibração do fundo 3D.
 *
 * Empilhamento (não mexa sem necessidade): canvas em z-[1], grade em z-[2],
 * decorações em z-0, conteúdo em z-20, painel em z-30. O <section> precisa de
 * `relative` (senão o canvas `absolute inset-0` se ancora no viewport e cobre a
 * página) e de `overflow-hidden` (senão vaza para as seções seguintes).
 *
 * ALINHAMENTO: o padding horizontal NÃO fica no <section>, e sim no wrapper interno,
 * que repete byte a byte o `mx-auto max-w-7xl px-6 md:px-12` do Container. É o que
 * faz o H1 do Hero começar na mesma coluna dos H2 das outras seções em qualquer
 * largura — antes, sem wrapper, em 2560px o H1 ficava 640px à esquerda de tudo e o
 * `justify-between` do header jogava o LangToggle para a borda da tela. O <section>
 * fica com padding só vertical para o canvas continuar full-bleed. Se o padding
 * horizontal voltar para o <section>, o wrapper (que já tem max-w) encolhe 48px a
 * mais e o desalinhamento retorna.
 *
 * Altura via `.hero-vh` (definido no index.css) em vez de `h-screen`: svh é a menor
 * viewport, então o hero não redimensiona quando a barra de URL do mobile
 * aparece/some. `min-h-screen` é o fallback para navegador sem svh. `h-screen` fixo
 * cortaria nav+headline+CTA num telefone de 667px.
 */
const Hero = ({ text, isEn, onLangChange }) => {
  const [params, setParams] = useState(INITIAL_PARAMS);
  const cvHref = `/${text.linkCV}`;

  return (
    <section className="hero-vh relative flex min-h-screen flex-col overflow-hidden border-b border-white/5 py-6 md:py-12">
      <div className="grid-overlay pointer-events-none absolute inset-0 z-[2]" />

      <ThreeCanvas {...params} />

      {/* No mobile o glow sobe para fora da faixa do H1: o conteúdo do hero fica
          ancorado no topo, então `top-1/4` caía exatamente sobre o eyebrow. */}
      <div className="pointer-events-none absolute -top-32 left-0 z-0 h-72 w-72 rounded-full bg-accent/5 blur-[120px] sm:left-1/4 sm:top-1/4 sm:h-96 sm:w-96" />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))]">
        <header
          className="animate-fade-in flex items-start justify-between gap-4"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Marcação FINA: o logo e a nav são medidos separados, e não o <header> inteiro.
              O que ocupa espaço são as duas pontas — a faixa do meio do topo fica livre para
              a esfera, que antes era bloqueada pela caixa inteira. */}
          <div data-hero-occupied className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 font-mono text-xs font-medium text-zinc-950 shadow-sm">
              LS
            </div>
            <span className="text-lg font-medium tracking-tight text-zinc-100">
              Leandro Sales
            </span>
          </div>

          <nav data-hero-occupied className="pointer-events-auto flex items-center gap-4 md:gap-8">
            {NAV.map(({ href, label }) => (
              <a key={href} href={href} className={`hidden text-sm text-zinc-400 md:inline ${NAV_LINK}`}>
                {text[label]}
              </a>
            ))}
            <LangToggle isEn={isEn} onChange={onLangChange} />
          </nav>
        </header>

        {/* AQUI VIVIA A BARRA DE NAVEGAÇÃO DO MOBILE, e ela foi removida a pedido do dono
            em 2026-09-23 ("no mobile, retire a barra de navegação superior"). Era uma linha
            rolável de pílulas com os 4 anchors, `md:hidden`, marcada com `data-hero-occupied`:
            no telefone ela era um obstáculo de ~44px de altura logo abaixo do header, na faixa
            em que a esfera procura espaço. Os anchors continuam acessíveis no rodapé (que lê o
            mesmo `NAV`) e o `LangToggle` continua no header — não recrie a barra sem pedido. */}

        {/* `mt-16 md:mt-20 lg:mt-auto`: em 768–1023px o `mt-auto` zerava o respiro
            quando não havia sobra de altura, e o bloco colava no header. O `mt-auto`
            só assume em lg, onde a sobra existe de verdade.
            `lg:pr-80 xl:pr-0` reserva a faixa do painel de calibração: com max-w-4xl
            (896px) + painel (280px) contra 928px úteis, o H1 a 96px passava a ~20px da
            borda do vidro, que está em z-30 sobre o conteúdo.

            MARCAÇÃO FINA: quem leva `data-hero-occupied` são as FOLHAS deste bloco, não
            ele. E o motivo não é as folhas serem estreitas — h1, tagline e CTAs são blocos
            full-width da caixa de conteúdo. É que o `getBoundingClientRect` inclui o
            PADDING, e o `lg:pr-80` acima põe 320px de padding dentro da caixa medida: o
            obstáculo se estendia 320px além da tinta, justamente na faixa (1024–1440px) em
            que a restrição é horizontal. Medir a folha mede a caixa de conteúdo.

            TEXTO MENOR NO MOBILE (2026-09-23, pedido do dono: "diminua um pouco as fontes
            dos textos do hero e coloque as margins-top para 1 rem, dando mais espaço para o
            conjunto da esfera"). O `sm:`/`md:` devolve o tamanho antigo a partir de 640/768px,
            então tablet e desktop saem idênticos — e o `mt-4` (1rem) vale só abaixo de 768px,
            onde a sobra vertical é o que decide o tamanho da esfera. Cada `mt-4` aqui é altura
            que o bloco devolve ao vão livre. */}
        <div
          className="animate-fade-in mt-4 w-full max-w-4xl md:mt-16 lg:mt-auto lg:pr-80 xl:pr-0"
          style={{ animationDelay: "0.2s" }}
        >
          <div data-hero-occupied="ink" className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              {text.role}
            </span>
          </div>

          {/* `xl:text-8xl` e não `lg:text-8xl`: de 1024 a 1279 o conteúdo tem 608px
              (por causa do `lg:pr-80`), e 96px de fonte quebraria "Leandro Sales" em
              duas linhas. Em xl sobram 1184px.

              `data-hero-occupied="ink"` = medir a TINTA, não a caixa. Estas três são
              blocos: a caixa vai até a borda da coluna (896px em xl) mesmo com a última
              palavra terminando bem antes, e era isso que empurrava a esfera para cima —
              o obstáculo mentia 200–280px para a direita.

              O eyebrow e a linha de CTAs são `flex`, e o `flex` também é bloco: a caixa
              deles tem os mesmos 896px com ~130px de tinta. A diferença para as três acima
              é que a caixa mentirosa destes cai bem na faixa do MEIO da tela, que é a que o
              posicionamento centrado procura — sozinha, ela fechava o corredor central. Por
              isso eles também medem por tinta.
              Quem usa o marcador SEM valor (a nav, o logo, o painel) tem moldura
              visível: ali a caixa É a tinta, e medir por `Range` encolheria o obstáculo para
              dentro da borda — a esfera encostaria na moldura. */}
          <h1
            data-hero-occupied="ink"
            className="text-4xl font-medium leading-none tracking-tighter text-white sm:text-5xl md:text-7xl xl:text-8xl"
          >
            Leandro Sales
          </h1>

          <p
            data-hero-occupied="ink"
            className="mt-4 text-xl font-medium tracking-tight text-zinc-600 sm:text-2xl md:mt-6 md:text-4xl"
          >
            {text.heroTagline}
          </p>

          <p
            data-hero-occupied="ink"
            className="mt-4 max-w-md text-sm font-light leading-relaxed text-zinc-400 sm:text-base md:mt-8 md:text-lg"
          >
            {text.heroSubline}
          </p>

          <div
            data-hero-occupied="ink"
            className="pointer-events-auto mt-4 flex flex-wrap items-center gap-4 md:mt-10"
          >
            <Button href={cvHref} download={text.linkCV} icon={FiDownload}>
              {text.downloadCV}
            </Button>
            <Button href="#projetos" variant="ghost" icon={FiArrowRight}>
              {text.navProjects}
            </Button>
          </div>
        </div>

        {/* Dentro do wrapper (não do <section>), para alinhar com a coluna do site.
            `right-12` = 48px, que é o `md:px-12` do wrapper — o painel encosta na
            mesma borda direita que o conteúdo das outras seções. O antigo
            `md:right-12` era prefixo morto: o elemento é `hidden` abaixo de lg.

            O `hidden lg:block` mora AQUI, e não no painel: abaixo de lg esta caixa precisa
            medir 0×0. Se o `hidden` ficasse no painel de dentro, o wrapper continuaria com a
            altura do painel escondido e a esfera desviaria de um obstáculo invisível. Medir
            0×0 é o que faz o `ThreeCanvas` descartar a caixa (a busca ignora retângulo de
            tamanho zero), então nos telefones o painel simplesmente não existe para a esfera.

            E ela LEVA `data-hero-occupied`: o painel é vidro (`.tech-glass`, `z-30`) e a esfera
            aparece POR TRÁS dele — mas atravessá-lo por baixo da moldura lê como defeito, e
            "sem sobreposição" é a restrição dura do dono. Custa tamanho: são 317px de altura
            (medidos em 1409×804) bloqueando a metade direita da faixa central, que é o que
            impede a esfera de ficar no meio da tela com o tamanho máximo. Foi uma tentativa
            consciente de liberá-lo (o vidro admitiria) e ela foi revertida — a esfera saía
            menor e cortada pela moldura, que é pior do que sair fora do centro. */}
        <div data-hero-occupied className="absolute bottom-0 right-12 z-30 hidden lg:block">
          <HeroCalibration
            params={params}
            onChange={setParams}
            text={text}
            className="animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
