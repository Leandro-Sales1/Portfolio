/* eslint-disable react/prop-types */

/**
 * Duas formas, uma responsabilidade:
 * - `variant="index"` → o índice mono das seções ("01"…"04"). É literal e neutro
 *   de idioma de propósito: dá o ritmo técnico sem duplicar o H2 nem gastar chave.
 * - `variant="pill"`  → a pílula com borda de fio (Hero e Contato).
 */
const Badge = ({ children, variant = "pill", className = "" }) => {
  if (variant === "index") {
    return (
      <span className={`font-mono text-xs tracking-widest text-zinc-500 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-zinc-300 backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
