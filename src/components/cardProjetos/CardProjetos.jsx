import { FaEye, FaGithub } from "react-icons/fa";



// eslint-disable-next-line react/prop-types
const CardProjetos = ({ imagem, titulo, descricao, link, gitHub }) => {
    return (
        <>
            <div className="mb-8 border-2 border-solid border-white rounded-lg shadow-sm md:mb-10">
                <a target="_blank" href={link} title="Ver o projeto em tempo real." rel="noopener noreferrer">
                    <img className="rounded-md" src={imagem} alt={`imagem do projeto ${titulo}`} />
                </a>
                <h2 className="m-1 pb-1 text-center text-2xl border-b-2 border-white md:m-3 md:pb-3 md:text-3xl">{titulo}</h2>
                <p className="px-3 text-lg text-justify md:px-5 md:text-xl  ">{descricao}</p>
                <div className="m-1 p-2 flex items-center justify-around border-t-2 border-white md:m-3 md:p-4">
                    <a className="text-5xl rounded-lg " href={link} title="Ver o projeto em tempo real." target="_blank" rel="noopener noreferrer"><FaEye /></a>
                    <a className="text-5xl rounded-lg " href={gitHub} title="GitHub do projeto." target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
            </div>
        </>

    )


}

export default CardProjetos