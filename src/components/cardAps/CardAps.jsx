import { FaLinkedin, FaGithub, FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss, SiSass } from "react-icons/si"
import { IoLogoCss3 } from "react-icons/io5";



// eslint-disable-next-line react/prop-types
const CardAps = ({ corBotao, mostrarSecTitulo, mostrarSecTec }) => {
    return (
        <section className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
            <div className={`m-4 flex flex-col items-center justify-center ${mostrarSecTitulo}`}>
                <div className="flex flex-col items-center justify-center gap-2 md:gap-8">
                    <img className="w-40 h-40 rounded-full  md:w-60 md:h-60" src="/imagens/fotoPrincipal.jpeg" alt="minha foto" />
                    <h1 className="text-center text-3xl md:text-4xl">Olá, sou o Sales, Dev. Front-End.</h1>
                </div>
                <div className="m-4 flex flex-col items-center justify-center gap-4 md:gap-7 lg:gap-10">
                    <h3 className="text-lg text-justify md:text-xl lg:w-11/12">Sou amante de jogos e tecnologia desde a infância. Com o tempo, tenho me especializado cada vez mais na área de Engenharia de Software. Sendo um profissional bem-humorado, dedicado, organizado e sempre adepto a mudanças. </h3>
                    <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-10">
                        <a style={{ color: '#007bb5' }} className="icone" title="Linkedin" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        <a className="icone" href="https://github.com/Leandro-Sales1" title="GitHub" target="_blank" rel="noreferrer"> <FaGithub /></a>
                    </div>
                    <a className="p-2 border-2 border-black rounded-md md:text-2xl md:p-3" style={{ backgroundColor: corBotao }} href="/CurriculoSales.pdf" download={"Curriculo Sales.pdf"} type="application/pdf">Download CV</a>
                </div>
            </div>

            <div className={`m-5 flex flex-col items-center justify-center gap-4 md:gap-6 lg:mt-12 lg:gap-8 ${mostrarSecTec? '' :  'hidden'}`}>
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
            </div>
        </section>
    )


}


export default CardAps
