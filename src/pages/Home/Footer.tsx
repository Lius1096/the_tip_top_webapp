import React from "react";
import music from "../../Assets/Icons/music.svg";
import facebook from "../../Assets/Icons/facebook.svg";
import instagram from "../../Assets/Icons/instagram.svg";
import youtub from "../../Assets/Icons/youtub.svg";
import logo from "../../Assets/Images/logo.svg"

const Footer = () => {
  return (
    <footer
      className="xl:px-[100px] px-4 md:px-8 py-4"
      style={{
        background:
          "linear-gradient(327deg, rgba(142, 137, 37, 0.29) 16.86%, rgba(255, 255, 255, 0.00) 105.18%)",
      }}
    >
      <div className="flex flex-col justify-end gap-y-2">
        <div className="flex flex-col items-center justify-between md:flex-row gap-y-2">
          <img className="w-14 xl:w-auto" src={logo} alt="Icon logo Thé Tip Top" />
          <ul className="flex flex-col items-center justify-center w-full lg:gap-x-7 text-first md:flex-row">
            <li>
              <a href="#section-1" className="text-sm underline cursor-pointer text-first xl:text-lg">
                Recette pour Jouer
              </a>
            </li>
            <li>
              <a href="#section-2" className="text-sm underline cursor-pointer text-first xl:text-lg">
                Récompenses savourantes
              </a>
            </li>
            <li>
              <a href="#section-3" className="text-sm underline cursor-pointer text-first xl:text-lg">
                Tassez-nous vos Saveurs?
              </a>
            </li>
          </ul>

        </div>
        <div className="flex flex-col items-center justify-between md:flex-row gap-y-2">
          <div className="flex flex-col items-center justify-center w-full lg:gap-x-7 text-first md:flex-row">
            <div className="text-sm underline cursor-pointer text-first xl:text-lg"><a href="/cgu" target="_blank" rel="noopener noreferrer">Nos conditions générales d'utilisation</a></div>
            <div className="text-sm underline cursor-pointer text-first xl:text-lg"><a href="/politiquedeconfidentialie" target="_blank" rel="noopener noreferrer">Notre politique de confidentialité</a></div>
            <div className="text-sm underline cursor-pointer text-first xl:text-lg"><a href="/regledujeu" target="_blank" rel="noopener noreferrer">Règles du jeu</a></div>
          </div>

          <ul className="flex xl:gap-x-7 w-max gap-x-2">
            <li className="cursor-pointer">
              <a href="https://www.instagram.com/thetiptop23/" target="_blank" rel="noopener noreferrer">
                <img className="xl:w-[42px] w-[32px]" src={instagram} alt="Icon Instagram" />
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://www.youtube.com/@thetiptop23/" target="_blank" rel="noopener noreferrer">
                <img className="xl:w-[42px] w-[32px]" src={youtub} alt="Icon YouTube" />
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://www.facebook.com/thetiptop23/" target="_blank" rel="noopener noreferrer">
                <img className="xl:w-[42px] w-[32px]" src={facebook} alt="Icon Facebook" />
              </a>
            </li>
            <li className="cursor-pointer">
              <a href="https://www.tiktok.com/thetiptop23/" target="_blank" rel="noopener noreferrer">
                <img className="xl:w-[42px] w-[32px]" src={music} alt="Icon Tiktok" />
              </a>
            </li>
          </ul>
        </div>
        <p className="w-full text-xs font-bold text-center text-gray-500 xl:text-sm md:text-left">
          Thé Tip Top &copy; 2024 - tout droit reservé
        </p>

      </div>
    </footer>
  );
};

export default Footer;