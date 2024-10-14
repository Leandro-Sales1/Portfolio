import { useState } from "react"
import Banner from "./components/banner/Banner"
import CardAps from "./components/cardAps/CardAps"
import Card from "./components/cardProjetos/Card"
import Rodape from "./components/rodape/Rodape"


const App = () => {
  const [corBanner, setCorBanner] = useState('#3184A5')

  function MudaCorBanner(cor) {
    setCorBanner(cor)
  }


  return (
    <>
      <section className="lg:flex bg-gradient-to-b from-[#2C5364] to-[#37373D]" >
        <div className="lg:flex-col lg:w-1/4" >
          <Banner corBanner={corBanner} mudaCorBanner={MudaCorBanner} />
        </div>
        <div className="lg:flex-col lg:w-3/4 items-end">
          <CardAps mostrarSecTec mostrarSecTitulo={'lg:hidden'} />
          <Card />
        </div>
      </section>
      <Rodape />
    </>

  )
}

export default App
