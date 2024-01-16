import { FaLinkedin, FaGithub, FaReact, FaHtml5, FaBootstrap, FaFigma, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiTailwindcss, SiSass   } from "react-icons/si"
import { IoLogoCss3 } from "react-icons/io5";



// eslint-disable-next-line react/prop-types
const CardAps = ({corBotao}) =>{
    return(
        <section className="m-4 flex flex-col items-center justify-center       lg:w-3/5 lg:m-auto">
            <img className="w-40 h-40 rounded-full " src="/imagens/fotoPrincipal.jpeg" alt="minha foto" />
            <div className="m-4 flex flex-col items-center justify-center gap-4">
                <h1 className="text-center text-3xl">Olá, sou o Sales, Dev. Front-End. </h1>
                <h3 className="text-lg text-center">Sou amante de jogos e tecnologia desde criança. Bem-humorado, dedicado, organizado e sempre adepto a mudanças, me especializando cada vez mais na área de Engenharia de Software. </h3>
                <div className="flex items-center justify-center gap-4">
                    <a style={{color:'#007bb5'}} className="text-5xl" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                    <a className="text-5xl" href="https://github.com/Leandro-Sales1" target="_blank" rel="noreferrer"> <FaGithub /></a>
                </div>
                <a className="p-2 border-2 border-black rounded-md" style={{backgroundColor: corBotao}} href="src/assets/CurriculoSales.pdf" download={"Curriculo Sales.pdf"} type="application/pdf">Download CV</a>
                <div className="m-5 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-center text-2xl">Tecnologias:</h2> 
                    <div className="flex items-center justify-center gap-4">
                        <FaReact className="text-5xl rounded-lg" title="React" style={{color:'#61DBFB'}} />
                        <SiTypescript className="text-5xl rounded-lg" title="TypeScript" style={{color:'#3178c6'}} />
                        <SiJavascript className="text-5xl rounded-lg" title="JavaScript" style={{color:'#F0DB4F'}}/>
                        <FaHtml5 className="text-5xl rounded-lg" title="HTML 5" style={{color:'#ec6231'}}/>
                        <IoLogoCss3 className="text-5xl rounded-lg" title="CSS 3" style={{color:'#2965f1'}}/>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <SiTailwindcss className="text-5xl rounded-lg" title="TailWind CSS" style={{color:'#06b6d4'}} />
                        <FaBootstrap className="text-5xl rounded-lg" title="BootStrap" style={{color:'#9461fb'}} />
                        <SiSass className="text-5xl rounded-lg" title="Sass" style={{color:'#CD6799'}} />
                        <FaFigma className="text-5xl rounded-lg" title="Figma"/>
                        <FaNodeJs className="text-5xl rounded-lg" title="NodeJS" style={{color:'#3c873a'}} />
                    </div>
                </div>           
            </div>
        </section>
    )


}


export default CardAps