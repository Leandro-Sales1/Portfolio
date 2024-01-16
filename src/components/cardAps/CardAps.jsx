import { FaLinkedin, FaGithub, FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss, SiSass   } from "react-icons/si"
import { IoLogoCss3 } from "react-icons/io5";



// eslint-disable-next-line react/prop-types
const CardAps = ({corBotao}) =>{
    return(
        <section className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
            <div className="m-4 flex flex-col items-center justify-center  md:grid grid-cols-2 md:items-center md:m-8 lg:w-2/3 lg:m-10">
                <div className="flex flex-col items-center justify-center gap-2 md:gap-8">
                    <img className="w-40 h-40 rounded-full  md:w-60 md:h-60" src="/imagens/fotoPrincipal.jpeg" alt="minha foto" />
                    <h1 className="text-center text-3xl md:text-4xl">Olá, sou o Sales, Dev. Front-End.</h1>
                </div>
                <div className="m-4 flex flex-col items-center justify-center gap-4 md:gap-7 lg:gap-10">
                    <h3 className="text-lg text-justify md:text-xl">Sou amante de jogos e tecnologia desde a infância. Com o tempo, tenho me especializado cada vez mais na área de Engenharia de Software. Sendo um profissional bem-humorado, dedicado, organizado e sempre adepto a mudanças. </h3>
                    <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-10">
                        <a style={{color:'#007bb5'}} className="text-5xl md:text-6xl" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        <a className="text-5xl md:text-6xl" href="https://github.com/Leandro-Sales1" target="_blank" rel="noreferrer"> <FaGithub /></a>
                    </div>
                    <a className="p-2 border-2 border-black rounded-md md:text-2xl md:p-3" style={{backgroundColor: corBotao}} href="src/assets/CurriculoSales.pdf" download={"Curriculo Sales.pdf"} type="application/pdf">Download CV</a>
                </div>
                
            </div>
            
            <div className="m-5 flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
                        <h2 className="text-center text-2xl md:text-3xl">Tecnologias:</h2> 
                        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
                            <FaReact className="text-5xl rounded-lg md:text-6xl" title="React" style={{color:'#61DBFB'}} />
                            <SiTypescript className="text-5xl rounded-lg md:text-6xl" title="TypeScript" style={{color:'#3178c6'}} />
                            <SiJavascript className="text-5xl rounded-lg md:text-6xl" title="JavaScript" style={{color:'#F0DB4F'}}/>
                            <FaHtml5 className="text-5xl rounded-lg md:text-6xl" title="HTML 5" style={{color:'#ec6231'}}/>
                            <IoLogoCss3 className="text-5xl rounded-lg md:text-6xl" title="CSS 3" style={{color:'#2965f1'}}/>
                        </div>
                        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 ">
                            <SiTailwindcss className="text-5xl rounded-lg md:text-6xl" title="TailWind CSS" style={{color:'#06b6d4'}} />
                            <FaBootstrap className="text-5xl rounded-lg md:text-6xl" title="BootStrap" style={{color:'#9461fb'}} />
                            <SiSass className="text-5xl rounded-lg md:text-6xl" title="Sass" style={{color:'#CD6799'}} />
                            <FaFigma className="text-5xl rounded-lg md:text-6xl" title="Figma"/>
                            <FaNodeJs className="text-5xl rounded-lg md:text-6xl" title="NodeJS" style={{color:'#3c873a'}} />
                        </div>
                </div>
        </section>
    )


}


export default CardAps