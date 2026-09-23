/* eslint-disable react/prop-types */
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { clearPointerGlow, setPointerGlow } from "../../utils/pointerGlow";
import Button from "../ui/Button";

/**
 * Card de projeto — funde o CardDesktop (flip no hover) e o CardMobile do
 * portfólio antigo numa única árvore de DOM.
 *
 * Motivo do merge, além de "o template prova que funciona": o flip card
 * `aspect-ratio: 16/9` + `overflow: hidden` + `padding: 20px` já truncava dados
 * reais — a descrição vinda da API estourava a altura útil e os botões
 * Demo/Código ficavam inalcançáveis entre 1024 e 1280px. E o corte por `isMobile`
 * era em 1024px, mais largo que a fronteira real de hover: num iPad de 1024 o
 * card era hover-only e um toque deixava o card travado virado.
 *
 * O `<a>` cobre só a imagem porque o card também tem botões — link dentro de link
 * não é válido.
 *
 * HOVER: o `<article>` é o `group`, não a imagem. Antes o `hover:scale-[1.02]` estava
 * no próprio `<img>`, então o zoom só disparava com o ponteiro sobre a imagem —
 * passar o mouse no título ou na descrição não movia nada. Agora o card inteiro
 * comanda: zoom da imagem, spotlight que segue o cursor e tilt.
 *
 * `card-tilt` (index.css) é quem carrega o `transform`, montado só de custom
 * properties que o `setPointerGlow` escreve. Não use `hover:-translate-y-*` aqui: um
 * `transform` inline/classe morreria para o outro, e é por isso que a elevação vai
 * como `--lift` dentro da mesma declaração.
 *
 * `break-words` na descrição: o texto vem da API remota (não deste repositório) e uma
 * URL ou token sem espaço estourava a caixa — o `overflow-hidden` recortava e o texto
 * saía ilegível.
 */
const ProjectCard = ({ imagem, titulo, descricao, link, gitHub, text }) => (
  <article
    onPointerMove={setPointerGlow}
    onPointerLeave={clearPointerGlow}
    className="card-tilt group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out-expo hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] active:border-white/15 active:bg-white/[0.04]"
  >
    {/* O `group-hover:opacity-100` fica sob `@media (hover: hover) and (pointer:
        fine)` por causa do variant sobrescrito no tailwind.config.js. */}
    <div
      aria-hidden="true"
      className="pointer-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />

    <a
      href={link}
      title={text.demoTitle}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden border-b border-white/5 bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <img
        src={imagem}
        alt={`imagem do projeto ${titulo}`}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.05]"
      />
    </a>

    <div className="flex flex-1 flex-col p-6">
      <h3 className="relative text-lg font-medium tracking-tight text-white">
        {/* Filete de acento revelado de cima para baixo — mesma linguagem de borda de
            fio do resto da identidade. O `-left-3` cai no padding do card (p-6), então
            o título continua alinhado com a descrição abaixo. */}
        <span
          aria-hidden="true"
          className="absolute -left-3 top-1/2 h-4 w-px -translate-y-1/2 origin-center scale-y-0 bg-accent/70 transition-transform duration-300 ease-out-expo group-hover:scale-y-100"
        />
        {titulo}
      </h3>

      <p className="mt-3 line-clamp-4 break-words text-sm font-light leading-relaxed text-zinc-400">
        {descricao}
      </p>

      {/* mt-auto + auto-rows-fr no grid: alinha a linha de botões entre cards de
          alturas diferentes. */}
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <Button href={link} size="sm" icon={FiExternalLink}>
          {text.demoButton}
        </Button>
        {gitHub ? (
          <Button href={gitHub} size="sm" variant="ghost" icon={FiGithub}>
            {text.codeButton}
          </Button>
        ) : null}
      </div>
    </div>
  </article>
);

export default ProjectCard;
