import { FaLinkedin, FaWhatsapp, FaGithub } from "react-icons/fa";

const CardAps = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8 lg:sticky lg:items-end lg:top-4" >
      <div className="mt-4 w-80 h-auto bg-[#26262b] flex flex-col rounded-tr-[1.25rem] rounded-bl-[1.25rem] md:w-[36rem] lg:w-[22rem] 2xl:w-[26rem]"
        style={{ clipPath: "polygon(1.875rem 0%, 100% 0, 100% calc(100% - 1.875rem), calc(100% - 1.875rem) 100%, 0 100%, 0% 1.875rem)" }}>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
          <img className="mt-4 w-40 h-40 object-cover object-top rounded-full shadow-sm shadow-black  md:w-56 md:h-56" src="/imagens/fotoPrincipal.jpg" alt="minha foto" />
          <h1 className="font-bold text-center text-2xl md:text-3xl ">Leandro Sales</h1>
        </div>
        <div className="mt-2 flex flex-col items-center justify-center">
          <h2 className="font-bold text-center text-xl md:text-2xl">Sobre mim:</h2>
          <h3 className=" ml-4 text-wrap font-normal text-left text-lg md:ml-6 md:text-xl lg:text-lg lg:ml-4 2xl:text-xl ">Os jogos foram minha porta de entrada para o mundo da tecnologia na infância, despertando minha paixão pela área. Durante o curso de Engenharia de Software, identifiquei-me com o desenvolvimento. Sou um profissional bem-humorado, autodidata, dedicado, organizado, responsável, sempre em busca de novos desafios e adaptável às mudanças.</h3>
        </div>
        <div className="mx-4 mt-4 flex flex-col items-center justify-center gap-8 md:gap-7 lg:gap-10">
          <div className="flex items-center max-w-56 flex-wrap justify-center gap-x-[2.3rem] gap-y-6">
            <a className="icone-sm" title="Linkedin" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a className="icone-sm" href="https://github.com/Leandro-Sales1" title="GitHub" target="_blank" rel="noreferrer"> <FaGithub /></a>
            <a className="icone-sm" href=" https://wa.me/5522998209708?text=" title="WhastsApp" target="_blank" rel="noreferrer" ><FaWhatsapp /></a>
          </div>
        </div>
        <div className="my-6 mx-auto">
          <button>
            <a href="/CurriculoSales.pdf"
              title="Download CV"
              download={"Curriculo Sales.pdf"}
              type="application/pdf">Download CV</a>
          </button>
        </div>
      </div>
    </section>
  )
}


export default CardAps
