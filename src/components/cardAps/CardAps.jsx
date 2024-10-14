import { FaLinkedin, FaWhatsapp, FaAddressCard, FaGithub, FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss, SiSass, SiNextdotjs, SiJest, SiCypress, SiRedux, SiGraphql } from "react-icons/si"
import { IoLogoCss3 } from "react-icons/io5";
import { TbMailForward } from "react-icons/tb";


// eslint-disable-next-line react/prop-types
const CardAps = ({ mostrarSecTitulo, mostrarSecTec }) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
      <div className={`m-4 mb-0 flex flex-col items-center justify-center ${mostrarSecTitulo}`}>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
          <img className="w-40 h-40 object-cover object-top rounded-full shadow-sm shadow-black  md:w-56 md:h-56" src="/imagens/fotoPrincipal.jpg" alt="minha foto" />
          <h1 className="text-center text-3xl md:text-4xl">Leandro Sales</h1>
          <h2 className="p-2 border border-black rounded-md text-sm shadow-sm shadow-black bg-[#3184a5] lg:bg-[#2C5364]">Dev. Front-End.</h2>
        </div>
        <div className="m-4 flex flex-col items-center justify-center gap-8 md:gap-7 lg:gap-10">
          <div className="flex items-center max-w-56 flex-wrap justify-center gap-x-8 gap-y-6">
            <a className="icone-sm" title="Linkedin" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a className="icone-sm" href="https://github.com/Leandro-Sales1" title="GitHub" target="_blank" rel="noreferrer"> <FaGithub /></a>
            <a className="icone-sm" href="/CurriculoSales.pdf" title="Download CV" download={"Curriculo Sales.pdf"} type="application/pdf"><FaAddressCard /></a>
            <a className="icone-sm" href=" https://wa.me/5522998209708?text=" title="WhastsApp" target="_blank" rel="noreferrer" ><FaWhatsapp /></a>
            <a className="icone-sm" href="mailto:leandrosales3@gmail.com" title="E-mail" target="_blank" rel="noreferrer" ><TbMailForward /></a>
          </div>
        </div>
      </div>

      <div className={`m-4 mt-0 flex flex-col items-center justify-center gap-4 md:gap-6 lg:mt-12 lg:gap-8 ${mostrarSecTec ? '' : 'hidden'}`}>
        <h2 className="text-center text-2xl md:text-3xl">Sobre mim:</h2>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg w-[90%] text-justify md:text-xl lg:w-4/5 ">Os jogos foram minha porta de entrada para o mundo da tecnologia na infância, despertando minha paixão pela área. Durante o curso de Engenharia de Software, identifiquei-me com o desenvolvimento. Sou um profissional bem-humorado, autodidata, dedicado, organizado, responsável, sempre em busca de novos desafios e adaptável às mudanças.</h3>
        </div>
        <h2 className="text-center text-2xl md:text-3xl">Tecnologias:</h2>
        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
          <FaReact className="icone" title="React" style={{ color: '#61DBFB' }} />
          <SiTypescript className="icone rounded-lg " title="TypeScript" style={{ color: '#3178c6' }} />
          <SiJavascript className="icone rounded-lg " title="JavaScript" style={{ color: '#F0DB4F' }} />
          <FaHtml5 className="icone" title="HTML 5" style={{ color: '#ec6231' }} />
          <IoLogoCss3 className="icone" title="CSS 3" style={{ color: '#2965f1' }} />
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 ">
          <SiTailwindcss className="icone" title="TailWind CSS" style={{ color: '#06b6d4' }} />
          <FaBootstrap className="icone" title="BootStrap" style={{ color: '#9461fb' }} />
          <SiSass className="icone" title="Sass" style={{ color: '#CD6799' }} />
          <FaFigma className="icone" title="Figma" />
          <FaNodeJs className="icone" title="NodeJS" style={{ color: '#3c873a' }} />
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 ">
          <SiNextdotjs className="icone" title="Next.JS" style={{ color: "black" }} />
          <SiJest className="icone" title="Jest" style={{ color: '#CD6799' }} />
          <SiCypress className="icone" title="Cypress" style={{ color: "white" }} />
          <SiRedux className="icone" title="Redux" style={{ color: '#9461fb' }} />
          <SiGraphql className="icone" title="GraphQL" style={{ color: '#CD6799' }} />
        </div>
      </div>
    </section>
  )


}


export default CardAps
