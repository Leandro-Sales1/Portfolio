import { FaEye, FaGithub } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const CardMobile = ({ imagem, titulo, descricao, link, gitHub }) => {
  return (
    <>
      <div className="relative flex  flex-col mx-auto rounded-xl bg-[#26262b] bg-clip-border text-white shadow-md shadow-black w-[21.5rem] mt-12 md:w-[36rem]">
        <div className="relative mx-4 -mt-6 w-auto h-auto overflow-hidden rounded-xl bg-clip-border shadow-black shadow-md">
          <a target="_blank" href={link} title="Ver o projeto em tempo real." rel="noopener noreferrer">
            <img className="rounded-md" src={imagem} alt={`imagem do projeto ${titulo}`} />
          </a>
        </div>
        <div className="p-6">
          <h3 className="mb-2 font-bold text-xl md:text-2xl">
            {titulo}
          </h3>
          <p className="text-wrap font-normal text-left text-lg md:text-xl">
            {descricao}
          </p>
        </div>
        <div className="m-1 p-2 flex items-center justify-around md:m-3 md:p-4">
          <a className="icone rounded-lg "
            href={link}
            title="Ver o projeto em tempo real."
            target="_blank"
            rel="noopener noreferrer"><FaEye /></a>

          <a className={gitHub ? "icone rounded-lg " : "icone rounded-lg text-transparent"}
            href={gitHub} title={gitHub ? "GitHub do projeto." : null}
            target="_blank"
            rel="noopener noreferrer"><FaGithub /></a>
        </div>
      </div>
    </>
  )
}

export default CardMobile