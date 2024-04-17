import React from "react";
import HomeTitle from "../../../components/HomeTitle";
import HomeButton from "../../../components/HomeButton";
import RecipeCard from "../../../components/RecipeCard";

import recipeIcon1 from "../../../Assets/Icons/recipe1.svg";
import recipeIcon2 from "../../../Assets/Icons/recipe2.svg";
import recipeIcon3 from "../../../Assets/Icons/recipe3.svg";

const Recipe = () => {

  const typeOfValue = () => {

  }
  return (
    <section
      className="py-10 xl:py-24"
      style={{
        background:
          "linear-gradient(131deg, rgba(142, 137, 37, 0.29) 26.88%, rgba(255, 255, 255, 0.00) 58.74%)",
      }}
      id="section-1"
    >
      <div className="flex bg-no-repeat lg:bg-section1 bg-right lg:bg-[length:400px] xl:bg-[length:45%] 2xl:bg-auto px-4 md:px-8 xl:px-[100px]">
        <div className="flex flex-col lg:w-[60%] 2xl:w-1/2 xl:gap-y-20 gap-y-10">
          <div className="flex flex-col items-start gap-y-6 xl:gap-y-10">
            <div>
              <HomeTitle title="Recette pour jouer" />
              <h3 className="pt-2 text-lg font-bold text-left text-first lg:pt-4">
                Suivez ces 3 ingrédients délicieusement <br /> simples ! 🍵✨
              </h3>
            </div>
            <div className="flex flex-col gap-y-4 xl:gap-y-6">
              <p className="text-lg font-semibold text-left text-text">
                Embarquez pour un voyage sensoriel et gagnez des récompenses<br />
                exquises en seulement quelques étapes faciles. <br /> Prêt à infuser
                vos idées et à savourer la victoire ? 🌿 <br />

              </p>
              <p className="text-lg font-semibold text-left text-first">
                #JeuConcoursThé<br />
                #Thé-Tip-Top
              </p>
            </div>
            <div className="">
              <HomeButton
                title="Notre boutique en ligne"
                bg="bg-third"
                color="text-white"
                fontSize="text-xl xl:text-2xl"
                handleValue={typeOfValue}
              />
            </div>
          </div>

          <div className="flex flex-col items-start w-3/4 mx-auto lg:gap-y-20 lg:flex lg:flex-row lg:w-full xl:gap-x-8 lg:justify-between gap-y-8 gap-x-4">
            <div className="">
              <RecipeCard
                icon={recipeIcon1}
                title="Un ticket"
                text="Explorez notre univers gourmand en réalisant des achats d'une valeur supérieure à 49€, que ce soit dans l'une de nos charmantes boutiques ou en ligne. "
              />
            </div>
            <div className="lg:mt-10 ">
              <RecipeCard
                icon={recipeIcon2}
                title="Une inscription"
                text="Une fois en possession de votre ticket, initiez votre voyage gourmand en vous inscrivant sur notre site web et  révélez l'excitation de participer."
              />
            </div>
            <div className="lg:mt-40">
              <RecipeCard
                icon={recipeIcon3}
                text="Entrez votre code de participation et laissez la magie opérer : découvrez votre récompense gourmande qui vous attend. L'aventure des saveurs n'attend que vous ! 🌟🔐"
                title="Gagnez !"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recipe;
