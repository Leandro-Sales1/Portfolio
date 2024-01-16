import { FaEye, FaGithub } from "react-icons/fa";



// eslint-disable-next-line react/prop-types
const CardProjetos = ({imagem, titulo, descricao, link, gitHub})=>{    
    return(
        <>
            <div className="mb-8 border-2 border-solid border-white rounded-lg shadow-sm">
                <img className="  rounded-md" src={imagem} alt={`imagem do projeto ${titulo}`} />
                <h2 className="m-1 pb-1 text-center text-2xl border-b-2 border-white">{titulo}</h2>
                <p className="px-3 text-lg text-justify  ">{descricao}</p>
                <div className="m-1 p-2 flex items-center justify-evenly gap-6 border-t-2 border-white">
                    <a className="text-5xl rounded-lg " href={link} target="_blank" rel="noopener noreferrer"><FaEye /></a>
                    <a className="text-5xl rounded-lg" href={gitHub} target="_blank" rel="noopener noreferrer"><FaGithub/></a>
                </div>
            </div>
        </>

    )


}

export default CardProjetos