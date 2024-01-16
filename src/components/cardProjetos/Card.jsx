/* eslint-disable react/prop-types */
import CardProjetos from "./CardProjetos"

// eslint-disable-next-line react/prop-types
const Card = ({card})=>{
    
     
    return(
        <section className="m-4  flex flex-col items-center justify-center       lg:w-3/5 lg:m-auto">
        <h2 className="text-center text-2xl mb-4">Projetos:</h2>
        <div>
            {card.map( card =><CardProjetos imagem={card.imagem} titulo={card.titulo} descricao={card.descricao} link={card.link} 
            gitHub={card.gitHub} key={card.titulo}/>)}
        </div>
          
        </section>
    )

}

export default Card