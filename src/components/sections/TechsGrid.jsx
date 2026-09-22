/* eslint-disable react/prop-types */
import { TECHS } from "../../data/techs";
import Section from "../ui/Section";

/**
 * Grid de techs. 15 itens fecham 3 linhas exatas de 5 em `lg`.
 *
 * A cor da marca vai para a custom property `--brand` em vez de `style={{ color }}`
 * no ícone: era esse o motivo de o `hover:text-black` do portfólio antigo nunca
 * funcionar — a cor inline vencia a classe. Com `--brand` o hover pega.
 *
 * O nome fica visível ao lado do ícone (antes era só `title`, invisível no toque).
 */
const TechsGrid = ({ text }) => (
  <Section id="techs" eyebrow="02" title={text.techs}>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {TECHS.map(({ name, Icon, color }) => (
        <div
          key={name}
          style={{ "--brand": color }}
          className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
        >
          <Icon className="mb-3 text-3xl text-zinc-500 transition-colors duration-300 group-hover:text-[color:var(--brand)]" />
          <span className="text-center text-sm font-medium text-zinc-200">{name}</span>
        </div>
      ))}
    </div>
  </Section>
);

export default TechsGrid;
