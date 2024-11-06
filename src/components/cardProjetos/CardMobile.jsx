
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
        <div className="my-3 ml-6">
          <button className="p-2 rounded-lg">
            <a href={link}
              title="Ver o projeto em tempo real."
              target="_blank"
              rel="noopener noreferrer">Demonstração</a></button>
          {gitHub ?
            <button className="p-2 rounded-lg ml-6">
              <a href={gitHub} title="Git hub do projeto"
                target="_blank"
                rel="noopener noreferrer">Código</a></button>
            : null}
        </div>
      </div>
    </>
  )
}

export default CardMobile