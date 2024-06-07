import { useState, useEffect } from "react";
import { instance } from "../../api/instance";
import CardProjetos from "./CardProjetos";

const Card = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const CarregaCards = async () => {
      try {
        const response = await instance.get('/cards');
        setCards(response.data);
      } catch (error) {
        alert('Ops... Aconteceu algum erro ao carregar os projetos da API. Tente novamente!')
      }
    };

    CarregaCards();
  }, []);

  return (
    <section className="m-4 mb-0 flex flex-col items-center justify-center md:m-12 lg:w-[90%] lg:m-auto lg:mt-8">
      <h2 className="text-center text-2xl mb-4 md:text-3xl md:mb-5 lg:mb-6">Projetos:</h2>
      <div className="md:gap-y-10 lg:w-full lg:h-auto lg:gap-x-8 lg:grid grid-cols-2">
        {cards.map(card => (
          <CardProjetos
            imagem={card.imagem}
            titulo={card.titulo}
            descricao={card.descricao}
            link={card.link}
            gitHub={card.gitHub}
            key={card.titulo}
          />
        ))}
      </div>
    </section>
  );
};

export default Card;