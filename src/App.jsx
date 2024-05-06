import { useState } from "react"
import Banner from "./components/banner/Banner"
import CardAps from "./components/cardAps/CardAps"
import Cards from "./assets/Cards.json"
import Card from "./components/cardProjetos/Card"
import Rodape from "./components/rodape/Rodape"




const App = () => {
  const [corBanner, setCorBanner] = useState('#5dc1e9')
  const [corDeFundo, setCorDeFundo] = useState('#37373d')
  document.body.style.backgroundColor = `${corDeFundo}`


  function MudaCorBanner(cor) {
    setCorBanner(cor)
  }
  function MudaCorDeFundo(cor) {
    setCorDeFundo(cor)

  }


  return (
    <>
      <section className="lg:flex">
        <div className="lg:flex-col lg:w-1/4" >
        <Banner corBanner={corBanner} mudaCorBanner={MudaCorBanner} mudaCorDeFundo={MudaCorDeFundo} corDeFundo={corDeFundo} />
        </div>
        <div className="lg:flex-col lg:w-3/4 items-end">
        <CardAps mostrarSecTec={true} mostrarSecTitulo={'lg:hidden'}  corBotao={corBanner} />
        <Card card={Cards} />
        <Rodape />
        </div>

      </section>


    </>

  )
}

export default App
