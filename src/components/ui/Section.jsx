/* eslint-disable react/prop-types */
import Badge from "./Badge";
import Container from "./Container";

/**
 * Casca das seções internas (Sobre, Techs, Projetos). Não use no Hero nem no
 * Contato: os dois têm fundo e altura próprios.
 *
 * `eyebrow` é o índice mono — passe "01", "02"… `title` é a chave de locale já
 * resolvida (ex.: text.projects, que vem com os dois-pontos).
 */
const Section = ({ id, eyebrow, title, children, className = "" }) => (
  <section id={id} className={`relative z-20 border-b border-white/5 py-24 md:py-32 ${className}`}>
    <Container>
      {eyebrow || title ? (
        <div className="mb-12 md:mb-16">
          {eyebrow ? <Badge variant="index">{eyebrow}</Badge> : null}
          {title ? (
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-4xl">
              {title}
            </h2>
          ) : null}
        </div>
      ) : null}
      {children}
    </Container>
  </section>
);

export default Section;
