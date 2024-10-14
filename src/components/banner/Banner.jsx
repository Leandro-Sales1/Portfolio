import CardAps from "../cardAps/CardAps"


// eslint-disable-next-line react/prop-types
const Banner = ({ corBanner, mudaCorBanner }) => {
  return (
    <>
      <section style={{ backgroundColor: corBanner }} className="h-20 flex items-center justify-around md:justify-center md:gap-0 lg:gap-6 lg:py-8 lg:mx-auto lg:rounded-lg lg:mb-4 lg:flex-col lg:w-4/5 lg:h-max lg:sticky lg:top-10 lg:items-center lg:border-2 border-solid lg:border-white lg:shadow-md lg:shadow-black">
        <div className="flex w-full items-center justify-evenly md:gap-48 lg:gap-12 2xl:gap-8">
          <img src="/imagens/icone.png" alt="logo do banner" className="h-16 border-1 border-black rounded-md m-1 2xl:ml-2" />
          <div className="flex align-middle items-center">
            <div className="text-center m-2 ">
              <label htmlFor="#corBanner"> Cor do Banner:
                <input className="w-8 h-6 border-2 border-black rounded-md m-2  sm:  " id="corBanner" type="color" onChange={event => mudaCorBanner(event.target.value)} value={corBanner} />
              </label>
            </div>
          </div>
        </div>
        <CardAps mostrarSecTitulo={'hidden lg:block'} />
      </section>

    </>
  )

}


export default Banner