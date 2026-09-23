import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";

/**
 * Fonte única dos links sociais. Consumido por About e Contact — antes os mesmos
 * URLs estavam duplicados no JSX, com o typo "WhastsApp" e um espaço à esquerda
 * no href do WhatsApp (inócuo, mas lixo).
 *
 * Os labels são nomes próprios: não passam pelo i18n.
 */
export const SOCIALS = [
  { name: "LinkedIn", Icon: FaLinkedin, href: "https://www.linkedin.com/in/leandro-sales1/" },
  { name: "GitHub", Icon: FaGithub, href: "https://github.com/Leandro-Sales1" },
  { name: "WhatsApp", Icon: FaWhatsapp, href: "https://wa.me/5522998209708" },
];
