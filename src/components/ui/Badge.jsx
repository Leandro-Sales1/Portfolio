/* eslint-disable react/prop-types */

/**
 * Duas formas, uma responsabilidade:
 * - `variant="index"` → o índice mono das seções ("01"…"04"). É literal e neutro
 *   de idioma de propósito: dá o ritmo técnico sem duplicar o H2 nem gastar chave.
 * - `variant="pill"`  → a pílula com borda de fio (Hero e Contato).
 *
 * `solid` existe pelo mesmo motivo que `size`/`iconPosition` existem no Button: o
 * chamador NÃO consegue sobrepor o fundo por `className`. O Contato passava
 * `className="bg-black/50"` sobre o `bg-white/5` interno — duas utilities de mesma
 * especificidade, e quem vence é a posição no CSS gerado, não a ordem no className
 * (ver a "armadilha da cascata" no CLAUDE.md). O fundo sólido é usado onde a pílula
 * fica sobre imagem/mesh.
 */
const Badge = ({ children, variant = "pill", solid = false, className = "" }) => {
  if (variant === "index") {
    return (
      <span className={`font-mono text-xs tracking-widest text-zinc-500 ${className}`}>
        {children}
      </span>
    );
  }

  const surface = solid ? "bg-black/70" : "bg-white/5";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 ${surface} px-3 py-1.5 font-mono text-xs text-zinc-300 backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
