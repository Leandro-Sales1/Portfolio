/* eslint-disable react/prop-types */
import CardProjetos from "./CardProjetos"
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { TbMailForward } from "react-icons/tb";

// eslint-disable-next-line react/prop-types
const Card = ({ card }) => {


    return (
        <section className="m-4 flex flex-col items-center justify-center md:m-12 lg:w-[90%] lg:m-auto lg:mt-8">
            <h2 className="text-center text-2xl mb-4 md:text-3xl md:mb-5 lg:mb-6">Projetos:</h2>
            <div className="lg:w-full lg:h-auto lg:gap-x-8 lg:grid grid-cols-2">
                {card.map(card => <CardProjetos imagem={card.imagem} titulo={card.titulo} descricao={card.descricao} link={card.link}
                    gitHub={card.gitHub} key={card.titulo} />)}
            </div>
            <div className="flex flex-col items-center justify-center mb-4 gap-2 md:gap-4 lg:gap-5">
                <h2 className="text-2xl md:text-3xl">Entre em contato:</h2>
                <div className="flex gap-4 md:gap-6 lg:gap-8 ">
                    <a style={{ color: '#007bb5' }} className="text-4xl md:text-6xl lg:text-5xl " href="https://www.linkedin.com/in/leandro-sales1/" title="Linkedin" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                    <a style={{ color: '#25D366' }} className="text-4xl md:text-6xl lg:text-5xl " href=" https://wa.me/5522998209708?text=" title="WhastsApp" target="_blank" rel="noreferrer" ><FaWhatsapp /></a>
                    <a className="text-4xl text-white md:text-6xl lg:text-5xl" href="mailto:leandrosales3@gmail.com" title="E-mail" target="_blank" rel="noreferrer" ><TbMailForward /></a>
                </div>
            </div>
        </section>
    )

}

export default Card