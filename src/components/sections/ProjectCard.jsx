/* eslint-disable react/prop-types */
import { FiExternalLink, FiGithub } from "react-icons/fi";
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
 */
const ProjectCard = ({ imagem, titulo, descricao, link, gitHub, text }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/10">
    <a
      href={link}
      title={text.demoTitle}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden border-b border-white/5 bg-zinc-900"
    >
      <img
        src={imagem}
        alt={`imagem do projeto ${titulo}`}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
    </a>

    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-lg font-medium tracking-tight text-white">{titulo}</h3>
      <p className="mt-3 line-clamp-4 text-sm font-light leading-relaxed text-zinc-400">
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
