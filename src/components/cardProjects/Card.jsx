/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { instance } from "../../api/instance";
import CardMobile from "./CardMobile";
import CardDesktop from "./CardDesktop";


const Card = ({ isMobile, text, isEn }) => {
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
    <section className="m-4 mb-0 flex flex-col items-center justify-center md:mx-12 md:mt-12 lg:w-[95%] lg:m-auto lg:mt-8 2xl:w-[90%]">
      <h2 className="font-bold text-center text-2xl md:text-3xl lg:mb-6">{text.projects}</h2>
      <div className="md:gap-y-10 lg:w-full lg:h-auto lg:gap-x-8 lg:grid grid-cols-2">
        {isMobile ? cards.map(card => (
          <CardMobile
            imagem={card.imagem}
            titulo={card.titulo}
            descricao={isEn ? card.descricaoEn : card.descricao}
            link={card.link}
            gitHub={card.gitHub}
            key={card.titulo}
            text={text}
          />
        ))
          :
          cards.map(card => (
            <CardDesktop
              imagem={card.imagem}
              titulo={card.titulo}
              descricao={isEn ? card.descricaoEn : card.descricao}
              link={card.link}
              gitHub={card.gitHub}
              key={card.titulo}
              text={text}
            />
          ))}
      </div>
    </section>
  );
};

export default Card;