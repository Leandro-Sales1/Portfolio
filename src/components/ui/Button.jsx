/* eslint-disable react/prop-types */

/**
 * Todo CTA desta página é um link (CV, WhatsApp, LinkedIn, GitHub, demo, código).
 * Esta primitiva existe para que o padrão <button><a>…</a></button> — que era o
 * bug estrutural do portfólio antigo, em 4 lugares — não volte: se tem `href`,
 * o elemento é <a> e o <button> nem chega a ser renderizado.
 *
 * Sem `cn()`/tailwind-merge de propósito: `className` é concatenado. Consequência
 * a ter em conta: uma utility passada por fora que conflite com uma interna pode
 * não vencer, porque a cascata do Tailwind 3 é a posição no CSS gerado, não a
 * ordem no className. Por isso tamanho e posição do ícone são props (`size`,
 * `iconPosition`) e não classes avulsas — `className="px-4"` NÃO sobreporia o
 * `px-5` interno.
 */
const VARIANTS = {
  primary:
    "bg-white text-black shadow-sm hover:bg-zinc-100 hover:-translate-y-px hover:shadow-[0_8px_28px_-10px_rgba(255,255,255,0.45)] active:translate-y-0 active:scale-[0.98]",
  ghost:
    "border border-white/10 bg-white/5 text-zinc-200 backdrop-blur-sm hover:border-white/25 hover:bg-white/10 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-4 py-2 text-xs",
};

/**
 * O `focus-visible` vive no BASE para todo CTA da página ter o mesmo anel de acento —
 * antes o projeto tinha ZERO `focus-visible` no JSX e o foco de teclado dependia do
 * outline do navegador. O `ring-offset-[#050505]` é o fundo da página (DESIGN.md):
 * sem ele o offset apareceria como um anel branco.
 *
 * `cursor-pointer` é necessário porque o preflight do Tailwind 3 não põe cursor em
 * `<button>` — o botão de retry dos Projetos ficava com cursor de seta.
 */
const BASE =
  "group inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";

const Button = ({
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "end",
  children,
  className = "",
  ...rest
}) => {
  const classes = `${BASE} ${SIZES[size] ?? SIZES.md} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;
  const icon = Icon ? (
    <Icon
      strokeWidth={1.5}
      className={`shrink-0 text-base transition-transform duration-200 ease-out-expo ${
        iconPosition === "end" ? "group-hover:translate-x-0.5" : ""
      } ${iconPosition === "start" ? "group-hover:-translate-x-0.5" : ""}`}
    />
  ) : null;

  const body = (
    <>
      {iconPosition === "start" ? icon : null}
      {children}
      {iconPosition === "end" ? icon : null}
    </>
  );

  if (href) {
    const isExternal = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {body}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {body}
    </button>
  );
};

export default Button;
