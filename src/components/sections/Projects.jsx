/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { instance } from "../../api/instance";
import Button from "../ui/Button";
import Section from "../ui/Section";
import ProjectCard from "./ProjectCard";

const SKELETON_KEYS = ["s1", "s2", "s3"];

/**
 * Projetos vindos da API remota (`instance.get('/cards')` — contrato inalterado).
 *
 * O que mudou em relação ao Card.jsx antigo: em vez do `alert()` bloqueante e não
 * traduzido, três estados explícitos (loading / ok / error) com retry. O
 * `AbortController` evita setState depois do unmount e o pedido duplicado do
 * StrictMode.
 *
 * A API não tem campo `id` (chaves: imagem, titulo, descricao, link, descricaoEn,
 * e gitHub em parte deles), então `key={titulo}` é a única opção — quebra se dois
 * projetos tiverem o mesmo título.
 *
 * `descricaoEn || descricao`: o fallback evita um card em branco quando a versão
 * em inglês não foi preenchida.
 */
const Projects = ({ text, isEn }) => {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    instance
      .get("/cards", { signal: controller.signal })
      .then((response) => {
        setCards(Array.isArray(response.data) ? response.data : []);
        setStatus("ok");
      })
      .catch((error) => {
        // abort do StrictMode / unmount não é erro para o usuário
        if (error.code === "ERR_CANCELED" || error.name === "CanceledError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <Section id="projetos" eyebrow="03" title={text.projects}>
      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="animate-pulse overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <div className="aspect-video w-full bg-white/[0.03]" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-1/2 rounded bg-white/[0.05]" />
                <div className="h-3 w-full rounded bg-white/[0.04]" />
                <div className="h-3 w-4/5 rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
          <span className="sr-only">{text.projectsLoading}</span>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <p className="text-sm font-light text-zinc-400">{text.projectsError}</p>
          <Button variant="ghost" onClick={() => setAttempt((value) => value + 1)}>
            {text.retry}
          </Button>
        </div>
      ) : null}

      {status === "ok" && cards.length === 0 ? (
        <p className="text-sm font-light text-zinc-500">{text.projectsEmpty}</p>
      ) : null}

      {status === "ok" && cards.length > 0 ? (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <ProjectCard
              key={card.titulo}
              imagem={card.imagem}
              titulo={card.titulo}
              descricao={isEn ? card.descricaoEn || card.descricao : card.descricao}
              link={card.link}
              gitHub={card.gitHub}
              text={text}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
};

export default Projects;
