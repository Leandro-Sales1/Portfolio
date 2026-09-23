/* eslint-disable react/prop-types */
import { NAV } from "../../data/nav";
import { SOCIALS } from "../../data/socials";
import Container from "../ui/Container";

/**
 * Sublinhado de acento dos links de nav — mesmo par de classes da nav do Hero
 * (Hero.jsx, `NAV_LINK`). Duplicado de propósito: extrair para um módulo
 * compartilhado acoplaria dois arquivos por uma string de classe, e o projeto já
 * aceita essa repetição no padrão de card (ver CLAUDE.md).
 */
const NAV_LINK =
  "relative transition-colors duration-200 ease-out-expo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out-expo after:content-[''] hover:after:scale-x-100";

/**
 * Footer real — antes era um `<footer className="h-14">` vazio, só um espaçador.
 *
 * Duas colunas + barra inferior (não as 5 do template): as colunas
 * "Product/Resources/Company" eram ficção de SaaS, com todos os links em `href="#"`.
 *
 * O ano é calculado em runtime em vez de virar chave de locale — não existe
 * tradução para "2026".
 *
 * `lg:gap-12` (não `lg:gap-8`): o `gap-12` base era reduzido justamente no maior
 * breakpoint, o que encolhia o respiro onde havia mais espaço.
 */
const Footer = ({ text }) => (
  <footer className="relative z-20 bg-[#050505] pb-8 pt-16">
    <Container>
      <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 font-mono text-[10px] font-medium text-zinc-950 shadow-sm">
              LS
            </div>
            <span className="text-base font-medium tracking-tight text-white">Leandro Sales</span>
          </div>
          <p className="max-w-xs text-sm font-light leading-relaxed text-zinc-500">{text.role}</p>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-xs text-zinc-300">{text.navTitle}</h4>
          <ul className="space-y-3">
            {NAV.map(({ href, label }) => (
              <li key={href} className="flex">
                <a href={href} className={`text-sm font-light text-zinc-500 ${NAV_LINK}`}>
                  {text[label]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
        <span className="text-xs font-light text-zinc-600">
          © {new Date().getFullYear()} Leandro Sales
        </span>
        <div className="flex items-center gap-5">
          {SOCIALS.map(({ name, Icon, href }) => (
            <a
              key={name}
              href={href}
              title={name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-zinc-500 transition-[color,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
