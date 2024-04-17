import React, { useEffect, useState } from "react";
import loginImage from "../../Assets/Images/loginImage.svg";
import InputLabelComponent from "../../components/InputLabelComponent";
import HomeButton from "../../components/HomeButton";
import teaCup from "../../Assets/Icons/teaCup.svg";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import facebookIcon from "../../Assets/Icons/facebookIcon.svg";
import googleIcon from "../../Assets/Icons/googleIcon.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FirebaseAuthServiceErrorCode,
  auth,
  getJWTToken,
  logInWithEmailAndPassword,
  signInWithFacebook,
  signInWithGoogle,
} from "../../Services/FirebaseService";
import { Alert, Button, Checkbox, FormControlLabel } from "@mui/material";
import { validateEmail } from "../Validation/Email";
import { validatePassword } from "../Validation/Password";
import { FirebaseError } from "firebase/app";
import { inMemoryPersistence, indexedDBLocalPersistence, signOut } from "firebase/auth";
import ClientRepository from "../../Repositories/ClientRepository";
import ApiService from "../../Services/ApiService";
import ImageRepository from "../../Repositories/ImageRepository";
import { useDispatch } from "react-redux";
import {
  removeImageProfile,
  setImageProfile,
} from "../../Redux/Reducer/ImageProfileReducer";
import config from "../../config";
import { login, logout } from "../../Redux/Reducer/UserReducer";
import HomeTitle from "../../components/HomeTitle";
import ApiErrorInterface from "../../Models/Interface/ApiErrorInterface";

const LoginClient = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("rostand");
  const [password, setPassword] = useState("rostand");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, loadUser] = useAuthState(auth);

  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState<FirebaseError | ApiErrorInterface>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);
  useEffect(() => {
    if (loadUser) {
      setLoading(true)
    } else {
      setLoading(true)
      if (user) {
        (async () => {
          const responseToken = await getJWTToken(user);
          if (responseToken) {
            ApiService.enableAuth(
              undefined,
              undefined,
              "client " + responseToken
            );
            ClientRepository.getCurrentClient()
              .then((responseClient) => {
                responseClient = JSON.parse(responseClient);
                ImageRepository.getCurrentClientImage()
                  .then((response) => {
                    response = JSON.parse(response);
                    if (response && response.filePath) {
                      dispatch(
                        setImageProfile({
                          value:
                            config.uriPath + "/images/" + response.filePath,
                        })
                      );
                    }
                    dispatch(
                      login({
                        profile: responseClient,
                        role: 1,
                      })
                    );
                    navigate("/client/giveaway");
                  })
                  .catch(() => {
                    dispatch(
                      login({
                        profile: responseClient,
                        role: 1,
                      })
                    );
                    navigate("/client/giveaway");
                  });
              })
              .catch((err) => {
                ApiService.disableAuth();
                setError(err.data);
                logoutUser()
                setLoading(false);
              });
          } else {
            logoutUser()
            setLoading(false);
          }
        })();
      } else {
        setLoading(false);
      }
    }
  }, [user, loadUser]);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        ApiService.disableAuth();
        dispatch(logout());
        dispatch(removeImageProfile());
      })
      .catch(() => { });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };
  const handlePasswordChange = (value: any) => {
    setPassword(value);
  };
  const handleGoogle = () => {
    setLoading(true);
    auth
      .setPersistence(indexedDBLocalPersistence)
      .then(() => {
        signInWithGoogle().catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  };
  const handleFacebook = () => {
    setLoading(true);
    auth
      .setPersistence(indexedDBLocalPersistence)
      .then(() => {
        signInWithFacebook().catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  };
  const validate = () => {
    let isEmailError = !validateEmail(email).valid;
    let isPasswordError = !validatePassword(password, null, true).valid;

    setPasswordError(isPasswordError);
    setEmailError(isEmailError);

    if (!isEmailError && !isPasswordError) {
      return true;
    }
    return false;
  };
  const renderErrorMessage = () => {
    if (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case FirebaseAuthServiceErrorCode.EMAIL_EXISTS:
            return (
              <div>
                <p>
                  Aucun compte trouvé avec la combinaison e-mail et mot de passe
                  fournise.
                  <a href="/client/register" className="ml-2 italic underline">
                    {" "}
                    vous n'avez pas encore de compte ?
                  </a>
                </p>
              </div>
            );
          default:
            return "Erreur, un problème inconnu est survenue";
        }
      } else {
        return <p>Erreur, un problème inconnu est survenue</p>
      }
    }
    return "";
  };
  const handleLogin = () => {
    if (validate()) {
      setLoading(true);
      if (remember) {
        auth
          .setPersistence(indexedDBLocalPersistence)
          .then(() => {
            logInWithEmailAndPassword(email, password).catch((err) => {
              setError(err);
              setLoading(false);
            });
          })
          .catch(() => {
            logInWithEmailAndPassword(email, password).catch((err) => {
              setError(err);
              setLoading(false);
            });
          });
      } else {
        auth
          .setPersistence(inMemoryPersistence)
          .then(() => {
            logInWithEmailAndPassword(email, password).catch((err) => {
              setError(err);
              setLoading(false);
            });
          })
          .catch(() => {
            logInWithEmailAndPassword(email, password).catch((err) => {
              setError(err);
              setLoading(false);
            });
          });
      }
    } else {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen overflow-hidden overflow-x-hidden">
        <Helmet>
        <title>Thé Tip Top Connection à votre Tea Space</title>
        <meta
          name="description"
          content="Connectez-vous à votre espace administrateur pour découvrir votre prochain cadeau et consulter vos statistiques."
        />
        <link rel="canonical" href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/login" />
      </Helmet>
      <div
        className={`${error ? "animate__fadeInDown" : "hidden"
          } fixed z-50 w-screen animate__animated`}
      >
        <Alert severity="error">{renderErrorMessage()}</Alert>
      </div>
      <div
        className={`${loading ? "fixed" : "hidden"
          } w-screen overflow-y-hidden bg-[rgba(88,105,75,0.3)] z-50 h-full`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 border-t-4 border-b-4 rounded-full animate-spin lg:h-44 lg:w-44 border-first"></div>
            <img src={teaCup} alt="Icon Thé Tip Top" className="w-16 h-16 lg:h-28 lg:w-28" />
          </div>
        </div>
      </div>
      <div
        className={`${loading ? "opacity-10" : "opacity-100"
          } flex h-full relative`}
      >
        <div className="lg:flex flex-col xl:py-[25px] xl:pr-[10px] xl:pl-[25px] bg-first  relative hidden w-1/2 px-4 md:px-8 py-8 lg:w-1/3">

          <div className="flex">
            <h1 className="text-xl font-bold text-white xl:text-2xl">  Vous êtes de retour ! 😀</h1>

          </div>
          <div className="pt-2 text-sm font-semibold text-left text-white xl:leading-7 xl:text-base 2xl:text-xl lg:pt-4">
            <p className="py-4 text-sm text-white xl:text-base 2xl:text-xl">
              Connectez vous et accéder à votre espace afin de révéler votre
              prochain cadeaux et ainsi consulter vos statistiques.
            </p>
            <div onClick={() => navigate('/')} className="relative">
              <Button variant="text" className="absolute left-0 z-10 flex items-center text-white border-white cursor-pointer gap-x-2">
                <span className="flex items-center justify-center w-5 h-5 bg-white rounded-full xl:w-8 xl:h-8">
                  <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.77691 15.8772C7.61474 15.8772 7.43863 15.8227 7.30435 15.7011L1.27746 10.6738C1.14189 10.5661 1.0076 10.4306 0.898628 10.295C-0.155479 9.02422 0.0206392 7.13267 1.27746 6.07856L7.30435 1.05129C7.61475 0.781426 8.0886 0.834637 8.35846 1.14631C8.61565 1.45671 8.57511 1.93056 8.26343 2.18647L2.23654 7.21374C1.60181 7.7408 1.50678 8.69987 2.04777 9.3359C2.10225 9.40305 2.16939 9.47147 2.23654 9.52468L8.27738 14.552C8.58778 14.8091 8.62832 15.2817 8.3724 15.5921C8.22417 15.7682 8.00752 15.862 7.80481 15.862L7.77691 15.8772Z" fill="#58694B" />
                  </svg>
                </span>
                Revenir à l'accueil
              </Button>
            </div>
          </div>
          <img
            src={loginImage}
            alt="Icon Connection"
            className="absolute bottom-0 -right-20"
          />
        </div>
        <div className="flex flex-col p-[25px]  lg:gap-y-8 xl:gap-y-14 2xl:gap-y-20 bg-white text-first gap-y-14 items-center w-full">
          <div className="flex flex-col justify-center gap-y-4">
            <HomeTitle title=" Connection à votre Tea Space" />
            <p className="font-semibold text-center xl:text-xl text-text">
              Entrez vos informations de connexion ci-dessous pour accéder à
              l'univers exclusif de notre Tea Contest :
            </p>
          </div>
          <div className="flex flex-col w-full mx-auto lg:w-1/2 lg:gap-y-6 gap-y-10">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="">
                <p
                  className={`${emailError ? "block" : "hidden"
                    } text-third my-2`}
                >
                  {validateEmail(email).message}
                </p>
                <InputLabelComponent
                  type="email"
                  label="Email "
                  placeholder="Email"
                  required
                  callBack={handleEmailChange}
                />
              </div>
              <div className="">
                <p
                  className={`${passwordError ? "block" : "hidden"
                    } text-third my-2`}
                >
                  {validatePassword(password, null, true).message}
                </p>
                <InputLabelComponent
                  type="password"
                  label="Mot de passe "
                  placeholder="Mot de passe"
                  required
                  callBack={handlePasswordChange}
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      className="text-sm text-first lg:text-base"
                      sx={{}}
                    />
                  }
                  label="Se souvenir de moi "
                  value={remember}
                  onChange={(e: any) => setRemember(e.target.checked)}
                />

              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full" onClick={handleLogin}>
                <HomeButton
                  bg="bg-first"
                  color="text-white"
                  fontSize="text-sm lg:text-base w-full block"
                  title="Se connecter"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5">
            <h3 className="font-semibold xl:text-xl lg:text-center text-text">
              Ou inscrivez-vous avec un réseau social
            </h3>
            <ul className="flex items-center justify-center gap-x-9 ">
              <li className="cursor-pointer" onClick={handleGoogle}>
                <img className="lg:w-[42px] w-[38px]" src={googleIcon} alt="Icon Google" />
              </li>
              <li className="cursor-pointer" onClick={handleFacebook}>
                <img
                  className="lg:w-[42px] w-[38px] cursor-pointer"
                  src={facebookIcon}
                  alt="Icon Facebook"
                />
              </li>
            </ul>
            <p className="text-sm xl:text-base text-text">
              Vous n'avez pas de compte ?{" "}
              <NavLink
                to="/client/register"
                className="font-bold underline cursor-pointer"
              >
                créez un compte
              </NavLink>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
