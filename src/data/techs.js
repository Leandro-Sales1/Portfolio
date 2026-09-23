import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNextdotjs,
  SiNestjs,
  SiExpress,
  SiPython,
  SiFastapi,
  SiGraphql,
  SiFirebase,
  SiDocker,
  SiAmazonaws,
  SiGit,
  SiJest,
  SiCypress,
  SiOpenai,
} from "react-icons/si";
import { TbBrandReactNative, TbSparkles } from "react-icons/tb";

/**
 * As 20 techs do portfólio, em ordem de exibição (o grid fecha 4 linhas exatas de
 * 5 em lg). `color` vai para a custom property `--brand` do tile — não use
 * `style={{ color }}` direto no ícone, senão o hover do tile não consegue mais
 * mudar a cor.
 *
 * Lista alinhada ao CV em 2026-09-23 (saíram HTML5, CSS3, Bootstrap, Sass, Redux,
 * Figma e as de teste; entraram React Native, NestJS, Express, Python, FastAPI,
 * Firebase, Docker, AWS, Git e a orla de IA). Numa segunda passada ele trocou
 * Playwright, Expo, Shopify e Google Gemini por Jest, Cypress, Claude e Codex —
 * Jest e Cypress voltam por pedido dele, apesar de não estarem no CV.
 *
 * Cores das marcas de cor BRANCA (`#ffffff` em Next.js e Express): mantidas como a
 * marca é. O `group-hover:drop-shadow-[...currentColor]` + `scale-110` do TechsGrid
 * é que dão feedback visível nelas, já que a troca de cor não muda nada.
 *
 * DUAS TECHs SEM GLIFO DE MARCA em `react-icons@5.0.1`:
 * - **Claude** — `SiClaude` só existe a partir do react-icons 5.4, e **subir a lib
 *   não compensa**: o 5.7.0 remove `SiAmazonaws` (que fica no grid) e `SiOpenai`,
 *   e continua sem glifo de Codex. Verificado no runtime dos dois pacotes em
 *   2026-09-23, não no `index.d.ts`. Fica `TbSparkles` (glifo genérico de IA) com a
 *   **cor de marca do Claude** (`#D97757`, o terracota oficial) — a cor é fiel, o
 *   desenho não. Se um dia a lib ganhar o glifo, troque só o `Icon`.
 * - **Codex** — não existe glifo, então usa `SiOpenai` (a marca dona), mesmo
 *   critério que faz o Gemini aparecer com `SiGoogle`.
 *
 * `Playwright` também sumiu do react-icons 5.7.0 — mais um motivo para não subir a lib.
 */
export const TECHS = [
  { name: "React", Icon: FaReact, color: "#61DBFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "React Native", Icon: TbBrandReactNative, color: "#61DBFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F0DB4F" },

  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06b6d4" },
  { name: "Node.js", Icon: FaNodeJs, color: "#3c873a" },
  { name: "NestJS", Icon: SiNestjs, color: "#E0234E" },
  { name: "Express", Icon: SiExpress, color: "#ffffff" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },

  { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
  { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "AWS", Icon: SiAmazonaws, color: "#FF9900" },

  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Jest", Icon: SiJest, color: "#C21325" },
  { name: "Cypress", Icon: SiCypress, color: "#69D3A7" },
  { name: "Claude", Icon: TbSparkles, color: "#D97757" },
  { name: "Codex", Icon: SiOpenai, color: "#412991" },
];
