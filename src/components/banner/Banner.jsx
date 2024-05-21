import CardAps from "../cardAps/CardAps"


// eslint-disable-next-line react/prop-types
const Banner = ({ corBanner, mudaCorBanner, mudaCorDeFundo, corDeFundo }) => {



    return (
        <>
        <section style={{ backgroundColor: corBanner }} className="h-20 flex items-center justify-around md:justify-normal md:gap-0 lg:gap-6 lg:py-8 lg:ml-8 lg:rounded-lg lg:mb-4 lg:flex-col lg:w-full lg:h-max lg:sticky lg:top-10 lg:items-start lg:justify-normal">
            <div className="flex w-full mx-auto items-center justify-evenly md:gap-48 lg:gap-12">
            <img src="/imagens/icone.png" alt="logo do banner" className="h-16 border-1 border-black rounded-md m-1 " />
            <div className="flex align-middle items-center">
                <div className="text-center m-2 ">
                    <label htmlFor="#corBanner"> Cor do Banner:
                        <input className="w-8 h-6 border-2 border-black rounded-md m-2  sm:  " id="corBanner" type="color" onChange={event => mudaCorBanner(event.target.value)} value={corBanner} />
                    </label>
                </div>
                <div className="text-center">
                    <label htmlFor="#corDoFundo"> Cor do fundo:
                        <input className="w-8 h-6 border-2 border-black rounded-md m-2" id="corDoFundo" type="color" onChange={event => mudaCorDeFundo(event.target.value)} value={corDeFundo} />
                    </label>
                </div>
            </div>
            </div>
            <CardAps mostrarSecTitulo={'hidden lg:block'} corBotao={corDeFundo}/>    
        </section>
        
        </>
    )   

}


export default Banner