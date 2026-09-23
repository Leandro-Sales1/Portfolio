import { FaReact, FaNodeJs, FaAws } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
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
  SiGit,
  SiJest,
  SiCypress,
  SiClaudecode,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

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
 * A LIB SUBIU PARA 5.7.0 EM 2026-09-23, a pedido do dono — ele pediu
 * `import { SiClaudecode } from "react-icons/si"`, e **nem `SiClaudecode` nem `SiClaude`
 * existem na 5.0.1**: nenhuma versão anterior a 5.7.0 traz o glifo do Claude. O preço do
 * upgrade foi medido no RUNTIME dos dois pacotes (não no `index.d.ts`, que só lista nomes):
 * o Simple Icons **removeu `SiAmazonaws` e `SiOpenai`** (e `SiPlaywright`, que já não estava
 * na lista), então dois tiles trocaram de conjunto —
 * - **AWS** → `FaAws` (Font Awesome, o mesmo conjunto do React e do Node);
 * - **Codex** → `RiOpenaiFill` (Remix Icon), mantendo a marca dona, mesmo critério que faz o
 *   Gemini aparecer com `SiGoogle`.
 * Todos os outros 17 ícones sobreviveram ao upgrade (conferido um a um).
 *
 * **Até então o tile do Claude usava `TbSparkles`** (glifo genérico de IA) com a cor de marca
 * do Claude, `#D97757`, porque a 5.0.1 não tinha glifo nenhum da Anthropic. Hoje é o desenho
 * oficial. O rótulo do tile é "Claude" e o glifo escolhido é o do **Claude Code**
 * (`SiClaudecode`, o que o dono pediu) — a 5.7.0 também traz `SiClaude`, o do produto, e
 * trocar é uma palavra se ele preferir.
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
  { name: "AWS", Icon: FaAws, color: "#FF9900" },

  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Jest", Icon: SiJest, color: "#C21325" },
  { name: "Cypress", Icon: SiCypress, color: "#69D3A7" },
  { name: "Claude", Icon: SiClaudecode, color: "#D97757" },
  { name: "Codex", Icon: RiOpenaiFill, color: "#412991" },
];
