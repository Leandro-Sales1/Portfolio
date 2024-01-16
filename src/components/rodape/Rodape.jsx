import { FaLinkedin, FaWhatsapp} from "react-icons/fa";
import { TbMailForward } from "react-icons/tb";



const Rodape = ()=>{
    return(
        <footer className="flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-5"> 
            <h2 className="text-2xl md:text-3xl">Entre em contato:</h2>
            <div className="flex gap-4 md:gap-6 lg:gap-8 "> 
            <a style={{color:'#007bb5'}} className="text-4xl md:text-6xl lg:text-5xl " href="https://www.linkedin.com/in/leandro-sales1/" title="Linkedin" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a style={{color:'#25D366'}} className="text-4xl md:text-6xl lg:text-5xl " href=" https://wa.me/5522998209708?text=" title="WhastsApp" target="_blank"  rel="noreferrer" ><FaWhatsapp/></a>
            <a className="text-4xl text-white md:text-6xl lg:text-5xl" href="mailto:leandrosales3@gmail.com" title="E-mail" target="_blank" rel="noreferrer" ><TbMailForward /></a>
            </div>
            <div style={{backgroundColor:'#37373d'}}>
            <img className="p-6 md:p-12 lg:w-1/3 lg:m-auto" src="/imagens/rodape.png" alt="rodapé" />
            </div> 

        </footer>
    )

}

export default Rodape