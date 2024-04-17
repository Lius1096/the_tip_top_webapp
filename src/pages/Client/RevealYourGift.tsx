import React, { useEffect, useState } from "react";
import HomeButton from "../../components/HomeButton";
import InputCodeComponent from "../../components/InputCodeComponent";
import { useNavigate } from "react-router-dom";
import teaCup from "../../Assets/Icons/teaCup.svg";
import TicketCodeRepository from "../../Repositories/TicketCodeRepository";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { FirebaseAuthServiceErrorCode, auth } from "../../Services/FirebaseService";
import ApiService from "../../Services/ApiService";
import { useSelector } from "react-redux";
import { Alert, Button } from "@mui/material";
import { FirebaseError } from "firebase/app";
import ApiErrorInterface from "../../Models/Interface/ApiErrorInterface";
import { Helmet } from "react-helmet-async";

const RevealYourGift = () => {
  const navigate = useNavigate();
  const [ticketCode, setTicketCode] = useState("");
  const [user, loadUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const userSelector = useSelector((state: any) => state.userReducer);
  const [error, setError] = useState<FirebaseError | ApiErrorInterface>();
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      if (user) {
        if (userSelector.profile) {
          TicketCodeRepository.getCurrentClientTicketCodes().then((response) => {
            response = JSON.parse(response);
            if (response.length > 0) {
              setIsFirstTime(false);
            }else{
              setIsFirstTime(true);
            }
          }).catch(() => { })
          setLoading(false);
        } else {
          ApiService.disableAuth();
          navigate("/client/login");
        }
      } else {
        ApiService.disableAuth();
        navigate("/client/login");
      }
    }
  }, [user, loadUser, userSelector]);


  const handleTicketCode = (value: any) => {
    setTicketCode(value);
  };
  const handleApplyTicketCode = () => {
    if (ticketCode.length === 10) {
      setLoading(true);
      (async () => {
        TicketCodeRepository.applyTicketCode(ticketCode).then((response) => {
          response = JSON.parse(response)
          navigate("/client/congratulation", { state: { giveAway: response.giveaway } });
        }).catch((err) => {
          if (err && err.message) {
            setError(JSON.parse(err.message))
          }

          setLoading(false)
        });
      })();
    } else {
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);

  const renderErrorMessage = () => {
    if (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case FirebaseAuthServiceErrorCode.EMAIL_EXISTS:
            return (
              <div>
                <p>
                  Un compte existe déjà avec ce e-mail
                  <a href="/client/login" className="ml-2 italic underline">
                    {" "}
                    Je me connecte ?
                  </a>
                </p>
              </div>
            );
          default:
            return "Erreur, un problème inconnu est survenu";
        }
      } else {
        return <p>{error.message}</p>
      }
    }
    return "";
  };

  return (
    <div className="h-screen overflow-y-hidden">
        <Helmet>
        <title>Thé Tip Top Révélez votre cadeau !</title>
        <meta
          name="description"
          content="Veuillez avoir en votre possession le ticket de caisse, repérez-y votre code de participation situé tout en bas, puis saisissez-le dans le champ prévu ci-après."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/gift"
        />
      </Helmet>
      <div
        className={`${error ? "animate__fadeInDown" : "hidden"
          } fixed z-50 w-screen animate__animated`}
      >
        <Alert severity="error">{renderErrorMessage()}</Alert>
      </div>
      <div
        className={`${loading ? "fixed" : "hidden"
          } w-screen h-screen overflow-y-hidden bg-[rgba(88,105,75,0.3)] z-50 `}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative flex items-center justify-center">
            <div className="absolute border-t-4 border-b-4 rounded-full animate-spin h-44 w-44 border-first"></div>
            <img src={teaCup} alt="Icon Thé Tip Top" className="h-28 w-28" />
          </div>
        </div>
      </div>

      <div className={`${loading ? "opacity-10" : "opacity-100"} flex h-full relative`}>
        <div className="lg:flex flex-col xl:py-[25px] xl:pr-[10px] xl:pl-[25px] bg-first  relative hidden w-1/2 px-4 md:px-8 py-8">
          <div className="flex">
            <h2 className="text-xl font-bold text-white xl:text-2xl">Jeux concours 🎉</h2>
          </div>
          <div className="flex flex-col gap-y-4">
            <p className="pt-2 text-sm font-semibold text-left text-white xl:leading-7 xl:text-base 2xl:text-xl lg:pt-4">
              Veuillez avoir en votre possession le ticket de
              caisse, repérez-y votre code de participation  situé tout en
              bas, puis saisissez-le dans le champ prévu ci-après. Si vous ne
              disposez pas  d'un ticket de caisse, nous vous encourageons à
              effectuer un achat d'au moins 50€ dansl'une de nos boutiques
              physiques ou sur
              notre boutique en ligne.
            </p>
            <div onClick={() => isFirstTime ? navigate('/') : navigate(-1)} className="relative">
              <Button variant="text" className="absolute left-0 z-10 flex items-center text-white border-white cursor-pointer gap-x-2">
                <span className="flex items-center justify-center w-5 h-5 bg-white rounded-full xl:w-8 xl:h-8">
                  <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.77691 15.8772C7.61474 15.8772 7.43863 15.8227 7.30435 15.7011L1.27746 10.6738C1.14189 10.5661 1.0076 10.4306 0.898628 10.295C-0.155479 9.02422 0.0206392 7.13267 1.27746 6.07856L7.30435 1.05129C7.61475 0.781426 8.0886 0.834637 8.35846 1.14631C8.61565 1.45671 8.57511 1.93056 8.26343 2.18647L2.23654 7.21374C1.60181 7.7408 1.50678 8.69987 2.04777 9.3359C2.10225 9.40305 2.16939 9.47147 2.23654 9.52468L8.27738 14.552C8.58778 14.8091 8.62832 15.2817 8.3724 15.5921C8.22417 15.7682 8.00752 15.862 7.80481 15.862L7.77691 15.8772Z" fill="#58694B" />
                  </svg>
                </span>
                {isFirstTime ? "Revenir à l'accueil" : "Retourner dans mon espace"}
              </Button>
            </div>
          </div>
          <div className="bg-gift-employer xl:h-[55%] bg-no-repeat bg-contain absolute w-full bg-left-bottom bottom-0 left-0 h-[40%]">
          </div>

        </div>
        <div className="bg-gift-confeties w-1/2 xl:h-[60%] bg-no-repeat bg-contain absolute bg-left-bottom bottom-0 left-0 hidden lg:block h-1/2">
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full gap-8 px-4 py-8 bg-white md:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-extrabold text-center lg:text-5xl text-first">
              Révélez votre cadeau !
            </h1>
            <h3 className="font-semibold text-center lg:text-xl text-text">
              Saisissez votre code et découvrez ce qui vous attend !
            </h3>
          </div>

          <div className="relative flex flex-col items-center justify-center w-full h-full bg-center bg-no-repeat bg-contain bg-ticket">
            <div className="flex flex-col gap-y-4 items-center absolute lg:top-[40%] top-[45%]">
              <div className="flex items-center text-xs font-semibold text-text 2xl:text-lg">
                <span>*** &nbsp;</span>
                <p className="overflow-x-hidden truncate w-52 md:w-max text-ellipsis text-text"> votre code de partication au Tea Contest  </p>
                <span>&nbsp; ***</span>
              </div>
              <div className="w-full">
                <InputCodeComponent callBack={handleTicketCode} />
              </div>
              <div className={`${ticketCode.length === 10 ? "opacity-100" : "opacity-50"} w-max mx-auto`} onClick={handleApplyTicketCode}>
                <HomeButton
                  bg="bg-first"
                  color="text-white"
                  fontSize="text-sm lg:text-base"
                  title="Révéler"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealYourGift;
