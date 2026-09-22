/* eslint-disable react/prop-types */
import { FiDownload, FiMail } from "react-icons/fi";
import { SOCIALS } from "../../data/socials";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

/**
 * Contato: reaproveita a casca do PreFooter do template (.bg-mesh + .grid-overlay)
 * mas SEM o formulário de waitlist — no template aquele input não tem handler
 * nenhum, e "entre na lista de espera" não significa nada para um portfólio.
 * No lugar, título + subtítulo + os links sociais reais + o CV.
 */
const Contact = ({ text }) => (
  <section
    id="contato"
    className="bg-mesh relative z-20 flex flex-col items-center overflow-hidden border-b border-white/5 px-6 py-24 text-center md:px-12 md:py-32"
  >
    <div className="grid-overlay pointer-events-none absolute inset-0 opacity-20" />

    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
      <Badge className="mb-6 border-white/10 bg-black/50">
        <FiMail strokeWidth={1.5} className="text-zinc-300" />
        {text.role}
      </Badge>

      <h2 className="mb-5 text-3xl font-medium tracking-tight text-balance text-white md:text-5xl">
        {text.contactTitle}
      </h2>

      <p className="mb-10 max-w-xl text-sm font-light leading-relaxed text-balance text-zinc-400 md:text-base">
        {text.contactSubtitle}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href={`/${text.linkCV}`} download={text.linkCV} icon={FiDownload}>
          {text.downloadCV}
        </Button>
        {SOCIALS.map(({ name, Icon, href }) => (
          <Button key={name} href={href} variant="ghost" icon={Icon} iconPosition="start">
            {name}
          </Button>
        ))}
      </div>
    </div>
  </section>
);

export default Contact;
