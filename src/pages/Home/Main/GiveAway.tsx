import React from "react";
import HomeTitle from "../../../components/HomeTitle";
import GiveAwayCard from "../../../components/GiveAwayCard";

import coffret1 from "../../../Assets/Icons/coffret1.svg";
import coffret2 from "../../../Assets/Icons/coffret2.svg";
import infuseur from "../../../Assets/Icons/infuseurAthe.svg";
import TheDetox from "../../../Assets/Icons/theDetox.svg";
import theIinfusion from "../../../Assets/Icons/theInfusion.svg";
import HomeButton from "../../../components/HomeButton";
import { useNavigate } from "react-router-dom";
// import thesignature from "../../../Assets/Icons/thesignature.svg";

const GiveAwayHome = () => {
  const navigate = useNavigate()
  return (
    <section
      className="py-10 xl:py-24"
      style={{
        background:
          "linear-gradient(357deg, rgba(142, 137, 37, 0.29) 0.06%, rgba(142, 137, 37, 0.00) 95.01%)",
      }}
      id="section-2"
    >
      <div className="px-4 md:px-8 xl:px-[100px] lg:pl-0 flex lg:justify-end lg:bg-[length:50%] xl:bg-[length:35%] lg:bg-section2 bg-no-repeat lg:bg-left ">
        <div className="flex flex-col lg:w-[60%] 2xl:w-1/2 gap-y-10 lg:items-end xl:items-start">
          <div className="flex flex-col items-start gap-y-6 xl:gap-y-10">
            <div>
              <HomeTitle title="Récompenses savoureuses" />
              <h3 className="pt-2 text-lg font-bold text-left text-first lg:pt-4">
                Découvrez l'univers thé tip top et tentez de remporter des
                récompenses sensationnelles en participant à notre jeu concours !
              </h3>
            </div>
            <div className="flex flex-col gap-y-4 xl:gap-y-6">
              <p className="text-lg font-semibold text-left text-text">
              Nous mettons à votre dispositions 500 000 tickets. Vous aurez une période de 30 jours pendant le jeu concours, ainsi que 30 jours supplémentaires à partir de la date de clôture du concours, pour revêler vos gains et réclamer vos lots en magasin ou en ligne .</p>
              <p className="text-lg font-semibold text-left text-first">
                #RécompensesExquises <br />
                #ThéGagnant <br />
                #Thé-Tip-Top
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:w-2/3 gap-x-8 gap-y-4 xl:grid-cols-2 xl:w-full">
            <GiveAwayCard
              icon={infuseur}
             
              title="Infuseur à thé "
              total = {300000}
            />
            <GiveAwayCard
              icon={TheDetox}
             
              title="Boîte de 100g de thé détox ou d'infusion"
              total = {100000}
            />
            <GiveAwayCard
              icon={theIinfusion}
             
              title="Boîte de 100g de thé  signature"
              total = {50000}
            />
            <GiveAwayCard
              icon={coffret1}
             
              title="Coffret découverte de 39€"
              total = {20000}
            />
            <GiveAwayCard
              icon={coffret2}
             
              title="Coffret découverte de 69€"
              total = {300000}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <h3 className="pt-2 font-semibold text-left xl:text-lg text-text xl:pt-4">Vous avez déjà un tikect gagnant ?</h3>
            <div className="" onClick={() => navigate('/client/register')}>
              <HomeButton
                bg="bg-first register_btn"
                color="text-white"
                fontSize="text-sm lg:text-2xl"
                title="C'est par ici !"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveAwayHome;
