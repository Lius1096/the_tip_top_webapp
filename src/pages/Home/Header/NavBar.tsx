import React, { useEffect, useState } from "react";
import logo from "../../../Assets/Images/logo.svg";
import menuIcon from "../../../Assets/Icons/menu.svg";
import HomeButton from "../../../components/HomeButton";
import 'animate.css';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const [isScroll, setIsScroll] = useState<boolean | undefined>(undefined);

  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  const typeOfValue = () => {
  }

  return (
    <div className={isScroll === true ? 'lg:fixed w-full  left-0 bg-white z-40 shadow lg:animate__animated lg:animate__fadeInDown ' : isScroll === false ? 'lg:static lg:animate__animated lg:animate__fadeInUp px-4 md:px-8 xl:px-[100px]' : 'px-4 md:px-8 xl:px-[100px]'}>
      <div className="hidden lg:flex lg:justify-between lg:items-center py-7">
        <div>
          <img className="lg:w-1/2 xl:w-auto" src={logo} alt="Icon Logo Thé Tip Top" />
        </div>
        <ul className="w-full lg:flex lg:justify-center lg:gap-x-8">
          <li onClick={() => setSelected(0)}>
            <a
              href="#accueil"
              className={`lg:text-sm xl: hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 0 ? "text-first font-bold text-2xl" : "text-text"
                }`}
            >
              Accueil
            </a>
          </li>
          <li onClick={() => setSelected(1)}>
            <a
              href="#section-1"
              className={`lg:text-sm xl: hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 1 ? "text-first font-bold text-2xl" : "text-text"
                }`}
            >
              Recette pour Jouer
            </a>
          </li>
          <li onClick={() => setSelected(2)}>
            <a
              href="#section-2"
              className={`lg:text-sm xl: hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 2 ? "text-first font-bold text-2xl" : "text-text"
                }`}
            >
              Récompenses savourantes
            </a>
          </li>
          <li onClick={() => setSelected(3)}>
            <a
              href="#section-3"
              className={`lg:text-sm xl: hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 3 ? "text-first font-bold text-2xl" : "text-text"
                }`}
            >
              Tassez-nous vos Saveurs?
            </a>
          </li>
          <div className="lg:hidden " onClick={() => navigate('client/login')}>
            <HomeButton
              bg="bg-first register_btn"
              color="text-white"
              fontSize="lg:text-sm xl:text-lg "
              title=" Prendre une Tasse de Jeu"

              handleValue={typeOfValue}

            />
          </div>
        </ul>

        <div className="hidden lg:translate-x-0 lg:static lg:flex w-max " onClick={() => navigate('client/login')}>
          <HomeButton
            bg="bg-first register_btn"
            color="text-white"
            fontSize="xl:text-lg lg:text-xs"
            title=" Prendre une Tasse de Jeu"
            handleValue={typeOfValue}
          />
        </div>
      </div>
      <div className="fixed left-0 flex flex-col gap-y-8  w-screen  bg-white lg:hidden z-[9999] p-4">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} className="w-12" alt="" />
          </div>
          <div className="static flex translate-x-0 lg:hidden " onClick={handleClick}>
            <img src={menuIcon} alt="Icon Logo Thé Tip Top" className="w-6" />
          </div>
        </div>
        <ul className={toggle ? "flex flex-col lg:hidden gap-y-2 bg-white" : "hidden"}>
          <li onClick={() => setSelected(0)}>
            <a
              href="#accueil"
              className={` hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 0 ? "text-first font-bold text-2xl" : "text-text text-xl"
                }`}
            >
              Accueil
            </a>
          </li>
          <li onClick={() => setSelected(1)}>
            <a
              href="#section-1"
              className={` hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 1 ? "text-first font-bold text-2xl" : "text-text text-xl"
                }`}
            >
              Recette pour Jouer
            </a>
          </li>
          <li onClick={() => setSelected(2)}>
            <a
              href="#section-2"
              className={` hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 2 ? "text-first font-bold text-2xl" : "text-text text-xl"
                }`}
            >
              Récompenses savourantes
            </a>
          </li>
          <li onClick={() => setSelected(3)}>
            <a
              href="#section-3"
              className={` hover:text-first transition-all hover:transition-all cursor-pointer ${selected === 3 ? "text-first font-bold text-2xl" : "text-text text-xl"
                }`}
            >
              Tassez-nous vos Saveurs?
            </a>
          </li>
          <div className="flex pt-4 w-max" onClick={() => navigate('client/login')}>
            <HomeButton
              bg="bg-first register_btn "
              color="text-white "
              fontSize="text-xl py-3"
              title=" Prendre une Tasse de Jeu"
              handleValue={typeOfValue}
            />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
