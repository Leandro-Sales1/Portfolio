/* eslint-disable react/prop-types */
import { FiDownload } from "react-icons/fi";
import { SOCIALS } from "../../data/socials";
import Button from "../ui/Button";
import Section from "../ui/Section";

/** Os 3 cards de destaque. Título e corpo são chaves de locale. */
const CARDS = [
  { title: "aboutCard1Title", body: "aboutCard1Text" },
  { title: "aboutCard2Title", body: "aboutCard2Text" },
  { title: "aboutCard3Title", body: "aboutCard3Text" },
];

/**
 * Sobre: retrato + bio atual (verbatim do locale) + 3 cards.
 *
 * O `mix-blend-luminosity opacity-50` do CaseStudy do template NÃO foi portado de
 * propósito: aquilo é técnica para foto de fábrica genérica e deixaria um retrato
 * pessoal com cara de cadáver. No lugar, `aspect-[4/5]` + `object-top` (reserva a
 * altura e mata o CLS do LCP) e um gradiente para o texto não brigar com a foto.
 */
const About = ({ text }) => (
  <Section id="sobre" eyebrow="01" title={text.aboutMe} className="bg-zinc-950/30">
    <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
      <div className="w-full lg:w-2/5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <img
            src="/imagens/fotoPrincipal.png"
            alt="Leandro Sales"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          <span className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/60 px-4 py-2 font-mono text-xs text-zinc-300 backdrop-blur-md">
            {text.role}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href={`/${text.linkCV}`} download={text.linkCV} icon={FiDownload}>
            {text.downloadCV}
          </Button>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ name, Icon, href }) => (
              <a
                key={name}
                href={href}
                title={name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-zinc-500 transition-colors hover:text-accent"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full space-y-10 lg:w-3/5">
        <p className="text-sm font-light leading-relaxed text-zinc-400 md:text-base">
          {text.text}
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {CARDS.map(({ title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/10"
            >
              <h3 className="text-sm font-medium tracking-tight text-white">{text[title]}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500">{text[body]}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

export default About;
