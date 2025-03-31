/* eslint-disable react/prop-types */
import { FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss, SiSass, SiNextdotjs, SiJest, SiCypress, SiRedux, SiGraphql } from "react-icons/si"
import { IoLogoCss3 } from "react-icons/io5";




export default function Techs({ text }) {
  return (
    <section className="flex flex-col items-center mt-8">
      <div className="card-tech w-[22rem] h-[16rem] md:w-[36rem] md:h-[19rem] ">
        <div className="bg-tech w-[21.4rem] h-[15.4rem] md:w-[35.4rem] md:h-[18.4rem] ">
          <h2 className="font-bold text-center text-lg md:text-2xl mt-3 md:mt-4">
            {text.techs}
          </h2>
          <div className="flex flex-col items-center mt-4 gap-y-3">
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
              <FaFigma className="icone" title="Figma" style={{ color: '#fff' }} />
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
        </div>
        <div className="blob w-48 h-48 md:w-[20rem] md:h-[20rem]"></div>
      </div>
    </section>
  )
}