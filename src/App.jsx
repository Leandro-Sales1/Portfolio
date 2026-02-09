import { useEffect, useState } from "react";
import CardAps from "./components/cardAps/CardAps"
import Card from "./components/cardProjects/Card"
import Footer from "./components/footer/Footer"
import Techs from "./components/cardAps/Techs";
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import Bg3D from "./components/backGround/Bg3D";
import { useViewportDimensions, getViewportWidth } from "./utils/viewport";


const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isEn, setIsEn] = useState(false);
  const { width: viewportWidth, height: viewportHeight } = useViewportDimensions();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getViewportWidth() < 1024);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (vv) vv.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentLanguage = isEn ? en : pt


  return (
    <>
      <section
        className="lg:flex h-full bg-gradient-to-b from-[#2C5364] to-[#37373D] overflow-x-hidden"
        style={{
          minHeight: viewportHeight,
          width: viewportWidth || "100%",
          maxWidth: viewportWidth || "100%",
        }}
      >
        <Bg3D isMobile={isMobile} viewportHeight={viewportHeight} viewportWidth={viewportWidth} />
        <div className="lg:flex-col lg:w-1/4 min-w-0">
          <CardAps text={currentLanguage} isEn={isEn} setIsEn={setIsEn} />
        </div>
        <div className="lg:flex-col lg:w-3/4 min-w-0 items-end">
          <Techs text={currentLanguage} />
          <Card isMobile={isMobile} text={currentLanguage} isEn={isEn} />
          <Footer />
        </div>
      </section>
    </>
  )
}

export default App
