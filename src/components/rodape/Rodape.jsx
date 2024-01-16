import { FaLinkedin, FaWhatsapp} from "react-icons/fa";
import { TbMailForward } from "react-icons/tb";



const Rodape = ()=>{
    return(
        <footer className="flex flex-col items-center justify-center gap-2"> 
            <h2 className="text-2xl">Entre em contato:</h2>
            <div className="flex gap-4"> 
            <a style={{color:'#007bb5'}} className="text-4xl" href="https://www.linkedin.com/in/leandro-sales1/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a style={{color:'#25D366'}} className="text-4xl" href=" https://wa.me/5522998209708?text=" target="_blank" rel="noreferrer" ><FaWhatsapp/></a>
            <a className="text-4xl text-white" href="mailto:leandrosales3@gmail.com" target="_blank" rel="noreferrer" ><TbMailForward /></a>
            </div> 
            <img className="" src="/imagens/rodape.png" alt="rodapé" />


        </footer>
    )

}

export default Rodape