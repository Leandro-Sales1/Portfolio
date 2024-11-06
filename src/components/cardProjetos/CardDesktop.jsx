
// eslint-disable-next-line react/prop-types
const CardDesktop = ({ imagem, titulo, descricao, link, gitHub }) => {
  return (
    <>
      <div className="card">
        <img className="card__img" src={imagem} alt={`imagem do projeto ${titulo}`} />
        <div className="card__content">
          <p className="card__title font-bold text-xl md:text-2xl">{titulo}</p>
          <p className="card__description text-wrap font-normal text-left text-sm lg:ml-2 2xl:text-lg">{descricao}</p>
          <div className="mt-3">
            <button className="p-2 rounded-lg 2xl:p-3">
              <a href={link}
                title="Ver o projeto em tempo real."
                target="_blank"
                rel="noopener noreferrer">Demonstração</a></button>
            {gitHub ?
              <button className="p-2 rounded-lg ml-6 2xl:p-3">
                <a href={gitHub} title="Git hub do projeto"
                  target="_blank"
                  rel="noopener noreferrer">Código</a></button>
              : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default CardDesktop