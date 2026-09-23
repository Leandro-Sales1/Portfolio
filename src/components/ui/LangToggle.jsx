/* eslint-disable react/prop-types */

/**
 * Substitui o switch PT/EN que era feito inteiramente em CSS, com o texto dos
 * dois lados vindo de `content: attr(data-on)` / `attr(data-off)` no index.css.
 *
 * Dois <button> com aria-pressed em vez de um checkbox disfarçado: o estado real
 * fica legível para leitor de tela, e o alvo de toque não depende de um input
 * invisível posicionado por cima do label.
 */
const OPTIONS = [
  { label: "PT", value: false },
  { label: "EN", value: true },
];

const LangToggle = ({ isEn, onChange, className = "" }) => (
  <div
    role="group"
    aria-label="Idioma / Language"
    className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors duration-200 ease-out-expo hover:border-white/20 ${className}`}
  >
    {OPTIONS.map(({ label, value }) => {
      const isActive = isEn === value;
      return (
        <button
          key={label}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={isActive}
          className={`cursor-pointer rounded-full px-2.5 py-1 font-mono text-xs transition-[background-color,color] duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050505] ${
            isActive
              ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-50"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default LangToggle;
