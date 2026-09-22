import { FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiSass,
  SiNextdotjs,
  SiJest,
  SiCypress,
  SiRedux,
  SiGraphql,
} from "react-icons/si";
import { IoLogoCss3 } from "react-icons/io5";

/**
 * As 15 techs do portfólio, em ordem de exibição (o grid fecha 3 linhas de 5 em lg).
 * `color` vai para a custom property `--brand` do tile — não use `style={{ color }}`
 * direto no ícone, senão o hover do tile não consegue mais mudar a cor.
 *
 * Cores corrigidas em relação ao Techs.jsx antigo:
 * - SiNextdotjs era 'black', literalmente invisível no fundo escuro
 * - SiJest usava #CD6799 (o rosa do Sass) em vez do vermelho da marca
 * - SiGraphql também usava #CD6799; o rosa oficial do GraphQL é #E10098
 */
export const TECHS = [
  { name: "React", Icon: FaReact, color: "#61DBFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F0DB4F" },
  { name: "HTML5", Icon: FaHtml5, color: "#ec6231" },
  { name: "CSS3", Icon: IoLogoCss3, color: "#2965f1" },

  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06b6d4" },
  { name: "Bootstrap", Icon: FaBootstrap, color: "#9461fb" },
  { name: "Sass", Icon: SiSass, color: "#CD6799" },
  { name: "Figma", Icon: FaFigma, color: "#ffffff" },
  { name: "Node.js", Icon: FaNodeJs, color: "#3c873a" },

  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "Jest", Icon: SiJest, color: "#C21325" },
  { name: "Cypress", Icon: SiCypress, color: "#ffffff" },
  { name: "Redux", Icon: SiRedux, color: "#9461fb" },
  { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
];
