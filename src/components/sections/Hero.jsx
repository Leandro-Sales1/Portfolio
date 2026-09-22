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
 * Hero: nav, nome, tagline, CTAs e o painel de calibração do fundo 3D.
 *
 * Empilhamento (não mexa sem necessidade): canvas em z-[1], decorações em z-0,
 * conteúdo em z-20, painel em z-30. O <section> precisa de `relative` (senão o
 * canvas `absolute inset-0` se ancora no viewport e cobre a página) e de
 * `overflow-hidden` (senão vaza para as seções seguintes).
 *
 * Altura via `.hero-vh` (definido no index.css) em vez de `h-screen`: svh é a
 * menor viewport, então o hero não redimensiona quando a barra de URL do mobile
 * aparece/some. `min-h-screen` é o fallback para navegador sem svh. `h-screen`
 * fixo cortaria nav+headline+CTA num telefone de 667px.
 */
const Hero = ({ text, isEn, onLangChange }) => {
  const [params, setParams] = useState(INITIAL_PARAMS);
  const cvHref = `/${text.linkCV}`;

  return (
    <section className="hero-vh relative flex min-h-screen flex-col overflow-hidden border-b border-white/5 p-6 md:p-12">
      <div className="grid-overlay pointer-events-none absolute inset-0 z-0" />

      <ThreeCanvas {...params} />

      <div className="pointer-events-none absolute left-1/4 top-1/4 z-0 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />

      <header
        className="animate-fade-in relative z-20 flex items-start justify-between gap-4"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 font-mono text-xs font-medium text-zinc-950 shadow-sm">
            LS
          </div>
          <span className="text-lg font-medium tracking-tight text-zinc-100">Leandro Sales</span>
        </div>

        <nav className="pointer-events-auto flex items-center gap-4 md:gap-8">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-100 md:inline"
            >
              {text[label]}
            </a>
          ))}
          <LangToggle isEn={isEn} onChange={onLangChange} />
        </nav>
      </header>

      <div
        className="animate-fade-in relative z-20 mt-16 w-full max-w-4xl md:mt-auto"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            {text.role}
          </span>
        </div>

        <h1 className="text-5xl font-medium leading-none tracking-tighter text-white md:text-7xl lg:text-8xl">
          Leandro Sales
        </h1>

        <p className="mt-6 text-2xl font-medium tracking-tight text-zinc-600 md:text-4xl">
          {text.heroTagline}
        </p>

        <p className="mt-8 max-w-md text-base font-light leading-relaxed text-zinc-400 md:text-lg">
          {text.heroSubline}
        </p>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
          <Button href={cvHref} download={text.linkCV} icon={FiDownload}>
            {text.downloadCV}
          </Button>
          <Button href="#projetos" variant="ghost" icon={FiArrowRight}>
            {text.navProjects}
          </Button>
        </div>
      </div>

      <HeroCalibration
        params={params}
        onChange={setParams}
        className="animate-fade-in absolute bottom-8 right-6 z-30 hidden lg:flex md:right-12"
      />
    </section>
  );
};

export default Hero;
