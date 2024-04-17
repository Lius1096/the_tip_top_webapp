import React, { useEffect, useState } from "react";
import HomeButton from "../../components/HomeButton";
import { useLocation, useNavigate } from "react-router-dom";
import Giveaway from "../../Models/Giveaway";
import config from "../../config";
import teaCup from "../../Assets/Icons/teaCup.svg";
import { Helmet } from "react-helmet-async";
import Helpers from "../../Services/Helpers";

const Congratulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [giveAway, setGiveAway] = useState<Giveaway>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.giveAway) {
      setLoading(false);
      setGiveAway(location.state.giveAway);
    } else {
      navigate("/client/giveaway");
    }
  }, []);

  const renderScreen = () => {
    if (giveAway) {
      return (
        <div
          className="flex flex-col items-center justify-between px-4 py-10 mx-auto bg-white lg:py-20 lg:w-1/2 rounded-2xl lg:h-3/4 md:px-8 h-1/2"
          style={{ boxShadow: "0px 2px 12.9px 0px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="flex flex-col items-center gap-y-4">
            <h1 className="text-2xl font-extrabold text-first xl:text-5xl">
              Félicitations ! 🥳
            </h1>
            <h2 className="font-semibold xl:text-xl lg:text-center text-text">
              Merci de votre passage chez thé tip top pour vous monter à quel
              point vous comptez pour nous, nous vous offrons :
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-3">
            <img
              className="w-2/3 xl:w-4/5"
              src={config.giveAwayIcons[Helpers.getGiveawayIcon(giveAway.label!)]}
              alt="Thé Tip Top Giveaway"
            />
            <h3 className="pb-2 font-bold text-left xl:text-lg text-first xl:pb-4">
              {giveAway.label}
            </h3>
          </div>
          <div className="" onClick={() => navigate("/client/giveaway")}>
            <HomeButton
              bg="bg-first"
              color="text-white"
              fontSize=" w-full block"
              title="Ma liste de gains"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`${
            loading ? "fixed" : "hidden"
          } w-screen h-screen overflow-y-hidden bg-[rgba(88,105,75,0.3)] z-50 `}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative flex items-center justify-center">
              <div className="absolute border-t-4 border-b-4 rounded-full animate-spin h-44 w-44 border-first"></div>
              <img src={teaCup} alt="" className="h-28 w-28" />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="h-full"
      style={{
        background:
          "linear-gradient(357deg, rgba(142, 137, 37, 0.29) 0.06%, rgba(142, 137, 37, 0.00) 95.01%)",
      }}
    >
      <Helmet>
        <title>Thé Tip Top Félicitations ! Vous avez gagné un infuseur à thé !</title>
        <meta
          name="description"
          content="Vous êtes le gagnant de notre concours ! Profitez de votre infuseur à thé et savourez chaque moment de détente."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/congratulation"
        />
      </Helmet>
      <div className="flex flex-col justify-center w-screen h-screen overflow-y-hidden bg-no-repeat bg-cover bg-felicitation">
        {renderScreen()}
      </div>
    </div>
  );
};
export default Congratulation;
