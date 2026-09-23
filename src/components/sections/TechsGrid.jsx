/* eslint-disable react/prop-types */
import { TECHS } from "../../data/techs";
import { setPointerGlow } from "../../utils/pointerGlow";
import Section from "../ui/Section";

/**
 * Grid de techs. 20 itens fecham 4 linhas exatas de 5 em `lg`.
 *
 * A cor da marca vai para a custom property `--brand` em vez de `style={{ color }}`
 * no ícone: era esse o motivo de o `hover:text-black` do portfólio antigo nunca
 * funcionar — a cor inline vencia a classe. Com `--brand` o hover pega.
 *
 * `--glow` é a mesma cor, para o spotlight do tile sair na cor da marca em vez do
 * acento (que é o fallback padrão do `.pointer-glow`).
 *
 * O `group-hover:drop-shadow-[...currentColor]` existe por causa das marcas de cor
 * BRANCA (Next.js, Express): nelas o `group-hover:text-[color:var(--brand)]`
 * não muda nada visível — branco sobre cinza claro é quase imperceptível. O halo e o
 * `scale-110` garantem feedback sem falsificar a cor oficial da marca.
 *
 * O nome fica visível ao lado do ícone (antes era só `title`, invisível no toque). O
 * `p-4 sm:p-6` e o `leading-tight` são para 320px: com p-6 fixo sobravam 80px de
 * conteúdo num tile de 128px, e "Tailwind CSS" quebrava de forma feia.
 */
const TechsGrid = ({ text }) => (
  <Section id="techs" eyebrow="02" title={text.techs}>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {TECHS.map(({ name, Icon, color }) => (
        <div
          key={name}
          onPointerMove={setPointerGlow}
          style={{ "--brand": color, "--glow": color }}
          className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-[background-color,border-color,transform] duration-300 ease-out-expo hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04] sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <Icon className="mb-3 text-3xl text-zinc-500 transition-[color,transform,filter] duration-300 ease-out-expo group-hover:scale-110 group-hover:text-[color:var(--brand)] group-hover:drop-shadow-[0_0_14px_currentColor]" />
          <span className="text-center text-sm font-medium leading-tight text-zinc-200 transition-colors duration-300 ease-out-expo group-hover:text-white">
            {name}
          </span>
        </div>
      ))}
    </div>
  </Section>
);

export default TechsGrid;
