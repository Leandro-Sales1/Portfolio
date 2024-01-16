

// eslint-disable-next-line react/prop-types
const Banner = ({corBanner, mudaCorBanner, mudaCorDeFundo, corDeFundo }) =>{
    
    return(
        <header>
            <section style={{backgroundColor: corBanner } } className="h-20 flex items-center justify-around md:gap-48  ">
                <img src="/imagens/icone.png" alt="logo do banner"  className="h-16 border-1 border-black rounded-md m-1 "/>
                <div className="flex align-middle items-center">
                <div className="text-center m-2 ">
                    <label htmlFor="#corBanner"> Cor do Banner:
                        <input className="w-8 h-6 border-2 border-black rounded-md m-2  sm:  " id="corBanner" type="color" onChange={event => mudaCorBanner(event.target.value)} value={corBanner} />
                    </label>
                </div>
                <div className="text-center">
                    <label htmlFor="#corDoFundo"> Cor do fundo:
                        <input className="w-8 h-6 border-2 border-black rounded-md m-2" id="corDoFundo" type="color" onChange={event => mudaCorDeFundo(event.target.value)}  value={corDeFundo}/>                    
                    </label>
                </div>
                </div>
            </section>
        </header>
    )

}


export default Banner