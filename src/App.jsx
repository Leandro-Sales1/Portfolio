import { useEffect, useState } from "react";
import CardAps from "./components/cardAps/CardAps"
import Card from "./components/cardProjects/Card"
import Rodape from "./components/footer/Footer"
import Techs from "./components/cardAps/Techs";
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import Bg3D from "./components/backGround/Bg3D";


const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isEn, setIsEn] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentLanguage = isEn ? en : pt


  return (
    <>
      <section className="lg:flex h-full bg-gradient-to-b from-[#2C5364] to-[#37373D]" >
        <Bg3D />
        <div className="lg:flex-col lg:w-1/4" >
          <CardAps text={currentLanguage} isEn={isEn} setIsEn={setIsEn} />
        </div>
        <div className="lg:flex-col lg:w-3/4 items-end">
          <Techs text={currentLanguage} />
          <Card isMobile={isMobile} text={currentLanguage} isEn={isEn} />
          <Rodape />
        </div>
      </section>
    </>
  )
}

export default App
