import React from "react";
import HomeButton from "../../../components/HomeButton";
import stars from "../../../Assets/Images/stars.svg"
import { useNavigate } from "react-router-dom";

const Presentation = () => {

  const typeOfValue = () => {

  }

  const navigate = useNavigate();
  return (
    <div className="px-4 md:px-8 xl:px-[100px] relative h-full mt-24 lg:mt-0" id="accueil">
      <div className="flex pb-10 bg-right-top bg-no-repeat lg:bg-[length:350px] xl:bg-contain lg:bg-presentation">
        <div className="flex flex-col items-start gap-y-10 xl:gap-y-24">
          <div className="flex flex-col items-start xl:gap-y-14 gap-y-10">
            <h1 className="text-4xl font-extrabold leading-tight lg:text-4xl xl:text-6xl text-first">
              Saisissez votre tasse, <br />
              préparez-vous <br />à l'aventure !🍵✨
            </h1>
            <p className="text-base font-semibold leading-normal xl:text-2xl text-text lg:w-2/3">
            Nous célébrons l'inauguration de notre dixième boutique à Nice, et <br /> pour exprimer notre gratitude envers nos clients, nous lançons un jeu-concours . <br />
            Explorez un mois entier de nouvelles saveurs exquises ! <br /> Chaque tasse de thé vous réserve une surprise délicieuse dans notre univers enchanté. 🌟 <br />
              #Thé-Tip-Top
            </p>
          </div>
          <div className="" onClick={() => navigate('/client/login')}>

            <HomeButton
              bg="bg-first register_btn"
              color="text-white"
              fontSize="xl:text-lg lg:text-xs"
              title=" Prendre une Tasse de Jeu"
              handleValue={typeOfValue}
            />
          </div>

        </div>
        <div className="absolute hidden right-10 lg:block">
          <img  className="animate-light xl:w-[800px] w-[600px]" src={stars} alt="Icon Annimation" />
        </div>
      </div>
    </div>
  );
};

export default Presentation;
