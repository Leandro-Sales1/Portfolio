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
  primary: "bg-white text-black shadow-sm hover:bg-zinc-200",
  ghost:
    "border border-white/10 bg-white/5 text-zinc-200 backdrop-blur-sm hover:border-white/20 hover:bg-white/10",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-4 py-2 text-xs",
};

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200";

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
      className={`shrink-0 text-base transition-transform ${
        iconPosition === "end" ? "group-hover:translate-x-0.5" : ""
      }`}
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
