/* eslint-disable react/prop-types */
import { FaLinkedin, FaWhatsapp, FaGithub } from "react-icons/fa";

const CardAps = ({ isEn, setIsEn, text }) => {
  const handleLang = () => {
    setIsEn(!isEn);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8 lg:sticky lg:items-end lg:top-4" >
      <div className="mt-4 w-80 h-auto bg-[#26262b] flex flex-col rounded-tr-[1.25rem] rounded-bl-[1.25rem] md:w-[36rem] lg:w-[22rem] 2xl:w-[26rem]"
        style={{ clipPath: "polygon(1.875rem 0%, 100% 0, 100% calc(100% - 1.875rem), calc(100% - 1.875rem) 100%, 0 100%, 0% 1.875rem)" }}>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
          <div className="flex ml-16 md:ml-40 lg:ml-12 2xl:ml-20">
            <img className="mt-7 ml-2 w-40 h-40 object-cover object-top rounded-full shadow-sm shadow-black md:w-56 md:h-56"
              src="/imagens/fotoPrincipal.jpg" alt="minha foto" />
            <div className="btn-container -ml-10 mt-1 md:ml-12 md:mt-4 lg:-ml-14 lg:mt-2 2xl:-ml-8">
              <label className="switch btn-color-mode-switch">
                <input onChange={handleLang} value='1' id="color_mode" name="color_mode" type="checkbox" />
                <label className="btn-color-mode-switch-inner" data-off="PT" data-on="EN" htmlFor="color_mode"></label>
              </label>
            </div>
          </div>
          <h1 className="font-bold text-center text-2xl md:text-3xl ">Leandro Sales</h1>
        </div>
        <div className="mt-2 flex flex-col items-center justify-center">
          <h2 className="font-bold text-center text-xl md:text-2xl">{text.aboutMe}</h2>
          <h3 className=" ml-4 text-wrap font-normal text-left text-lg md:ml-6 md:text-xl lg:text-lg lg:ml-4 2xl:text-xl ">{text.text}</h3>
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
              download={isEn? "ResumeSales.pdf" : "CurriculoSales.pdf"}
              type="application/pdf">Download CV</a>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CardAps
