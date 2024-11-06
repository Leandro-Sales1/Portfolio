import { useEffect, useState } from "react";
import CardAps from "./components/cardAps/CardAps"
import Card from "./components/cardProjetos/Card"
import Rodape from "./components/rodape/Rodape"
import Tecnologias from "./components/cardAps/Tecnologias";


const App = () => {
  const [isMobile, setIsMobile] = useState(false);

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


  return (
    <>
      <section className="lg:flex bg-gradient-to-b from-[#2C5364] to-[#37373D]" >
        <div className="lg:flex-col lg:w-1/4" >
          <CardAps />
        </div>
        <div className="lg:flex-col lg:w-3/4 items-end">
          <Tecnologias />
          <Card isMobile={isMobile} />
        </div>
      </section>
      <Rodape />
    </>

  )
}

export default App
