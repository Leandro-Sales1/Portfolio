import { useEffect, useState } from "react";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import TechsGrid from "./components/sections/TechsGrid";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const LANG_KEY = "portfolio:lang";

/**
 * App é o único dono do estado de idioma — o objeto de locale inteiro desce como
 * prop `text` (sem `t()`, sem lib, sem context). Trocar isso é uma refatoração
 * grande; manter o contrato.
 *
 * Saiu daqui no redesign: `isMobile`, `useViewportDimensions()` e o <section> com
 * altura/largura inline vindas de JS. O ThreeCanvas já tem corte interno em
 * 1024px, o card virou um só, e o layout virou coluna vertical — ninguém mais
 * consome `isMobile`, então `utils/viewport.js` foi removido junto.
 */
const App = () => {
  // Persistido: antes um reload voltava sempre para PT.
  const [isEn, setIsEn] = useState(() => localStorage.getItem(LANG_KEY) === "en");

  const text = isEn ? en : pt;

  // O <html lang> nunca acompanhava o idioma — leitor de tela e tradutor ficavam
  // lendo a página em PT mesmo com o conteúdo em EN.
  useEffect(() => {
    document.documentElement.lang = isEn ? "en" : "pt-BR";
  }, [isEn]);

  const handleLangChange = (value) => {
    setIsEn(value);
    localStorage.setItem(LANG_KEY, value ? "en" : "pt");
  };

  return (
    <div className="min-h-screen">
      <Hero text={text} isEn={isEn} onLangChange={handleLangChange} />
      <About text={text} />
      <TechsGrid text={text} />
      <Projects text={text} isEn={isEn} />
      <Contact text={text} />
      <Footer text={text} />
    </div>
  );
};

export default App;
