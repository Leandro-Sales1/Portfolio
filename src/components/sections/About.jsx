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
 *
 * `max-w-sm` na moldura da foto: como o `lg:flex-row` só chega em 1024, entre 640 e
 * 1023 o container era coluna e a foto com `w-full` media 720×900px num tablet de
 * 768 — mais alta que o viewport. Subir o `flex-row` para `md` não serve: as 3
 * colunas de card ficariam com 118px, e o `p-6` comeria 48px deles. Então a foto
 * para em 384px e o `lg` assume o layout de duas colunas.
 *
 * A moldura da foto é `group`: o retrato inteiro comanda o zoom da imagem, o
 * realce da borda e o escurecimento do chip do cargo.
 */
const About = ({ text }) => (
  <Section id="sobre" eyebrow="01" title={text.aboutMe} className="bg-zinc-950/30">
    <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
      <div className="w-full max-w-sm lg:w-2/5 lg:max-w-none">
        <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-colors duration-300 ease-out-expo hover:border-white/20">
          <img
            src="/imagens/fotoPrincipal.png"
            alt="Leandro Sales"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          <span className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/60 px-4 py-2 font-mono text-xs text-zinc-300 backdrop-blur-md transition-colors duration-300 ease-out-expo group-hover:border-white/25 group-hover:bg-black/70">
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
                className="text-2xl text-zinc-500 transition-[color,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
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
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-[background-color,border-color,transform] duration-300 ease-out-expo hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
            >
              {/* Mesmo filete de acento do card de projeto, para os dois tipos de card
                  responderem no mesmo idioma visual. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-6 h-5 w-px origin-top scale-y-0 bg-accent/70 transition-transform duration-300 ease-out-expo group-hover:scale-y-100"
              />
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
