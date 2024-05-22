/* eslint-disable react/prop-types */
import { instance } from "../../api/instance"
import CardProjetos from "./CardProjetos"

async function getcards(){
    const response = await instance.get('/cards')
    return response.data
  } 
 
const card = await getcards()

// eslint-disable-next-line react/prop-types
const Card = () => {
    return (
        <section className="m-4 mb-0 flex flex-col items-center justify-center md:m-12 lg:w-[90%] lg:m-auto lg:mt-8">
            <h2 className="text-center text-2xl mb-4 md:text-3xl md:mb-5 lg:mb-6">Projetos:</h2>
            <div className="md:gap-y-10 lg:w-full lg:h-auto lg:gap-x-8 lg:grid grid-cols-2">
                {card.map(card => <CardProjetos imagem={card.imagem} titulo={card.titulo} descricao={card.descricao} link={card.link}
                    gitHub={card.gitHub} key={card.titulo} />)}
            </div>
        </section>
    )

}

export default Card