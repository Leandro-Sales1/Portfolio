import { useState } from "react"
import Banner from "./components/banner/Banner"
import CardAps from "./components/cardAps/cardAps"
import Cards from "./assets/Cards.json"
import Card from "./components/cardProjetos/Card"
import Rodape from "./components/rodape/rodape"




const App = () => {
  const [corBanner, setCorBanner] = useState('#5dc1e9')
  const [corDeFundo, setCorDeFundo] = useState('#37373d')
  document.body.style.backgroundColor=`${corDeFundo}`
  

  function MudaCorBanner(cor){
    setCorBanner(cor)
  }
  function MudaCorDeFundo(cor){
    setCorDeFundo(cor)
    
  }


  return (
    <>
      <Banner corBanner={corBanner} mudaCorBanner={MudaCorBanner} mudaCorDeFundo={MudaCorDeFundo} corDeFundo= {corDeFundo}/>
      <CardAps corBotao={corBanner}/>
      <Card card={Cards} />
      <Rodape/>

    </>

  )
}

export default App
