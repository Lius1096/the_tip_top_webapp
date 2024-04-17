import React, { createRef, useEffect, useState } from "react";
import InputLabelComponent from "../../components/InputLabelComponent";
import HomeButton from "../../components/HomeButton";
import facebookIcon from "../../Assets/Icons/facebookIcon.svg";
import googleIcon from "../../Assets/Icons/googleIcon.svg";
import { NavLink, useNavigate } from "react-router-dom";
import teaCup from "../../Assets/Icons/teaCup.svg";
import { Helmet } from "react-helmet-async";
import {
  FirebaseAuthServiceErrorCode,
  auth,
  getJWTToken,
  registerWithEmailAndPassword,
  signInWithFacebook,
  signInWithGoogle,
} from "../../Services/FirebaseService";
import { validatePassword } from "../Validation/Password";
import { Alert, Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { validateFirstName } from "../Validation/FirstName";
import { validateLastName } from "../Validation/LastName";
import { validateEmail } from "../Validation/Email";
import { FirebaseError } from "firebase/app";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import ClientRepository from "../../Repositories/ClientRepository";
import Client from "../../Models/Client";
import ApiErrorInterface from "../../Models/Interface/ApiErrorInterface";
import ApiService from "../../Services/ApiService";
import { inMemoryPersistence, indexedDBLocalPersistence, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../Redux/Reducer/UserReducer";
import ImageRepository from "../../Repositories/ImageRepository";
import config from "../../config";
import registerImage from "../../Assets/Images/Inscription_image.svg";
import ReCAPTCHA from "react-google-recaptcha";
import {
  removeImageProfile,
  setImageProfile,
} from "../../Redux/Reducer/ImageProfileReducer";
import HomeTitle from "../../components/HomeTitle";
import CityComponent from "../../components/CityComponent";
import { validateCity } from "../Validation/City";


const RegisterComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userSelector = useSelector((state: any) => state.userReducer);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [social, setSocial] = useState(false);
  const [user, loadUser] = useAuthState(auth);
  const [cgu, setCgu] = useState(false);
  const [accetptMarketing, setAccetptMarketing] = useState(false);
  const [pdd, setPdd] = useState(false);
  const [recaptcha, setRecaptcha] = useState(null);
  const [error, setError] = useState<FirebaseError | ApiErrorInterface[]>();
  const [errorCgu, setErrorCgu] = useState(false)
  const [errorPdd, setErrorPdd] = useState(false)


  const renderCity = ["Paris", "Lyon", "Sens"];

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);
  useEffect(() => {
    console.log(social);

  }, [social])
  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
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
                ImageRepository.getCurrentClientImage()
                  .then((response) => {
                    responseClient = JSON.parse(responseClient);
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
              .catch(() => {
                if (user.providerData[0].providerId === "password") {
                  ApiService.disableAuth();
                  const client = new Client(
                    responseToken,
                    lastName,
                    firstName,
                    email,
                    city
                  );
                  if (accetptMarketing) {
                    client.acceptMarketing = true
                  }
                  ClientRepository.createClient(client)
                    .then((response: any) => {
                      if (response) {
                        response = JSON.parse(response)
                        ApiService.enableAuth(
                          undefined,
                          undefined,
                          "client " + responseToken
                        );
                        dispatch(
                          login({
                            profile: response,
                            role: 1,
                          })
                        );
                        navigate("/client/gift");
                      } else {
                        setLoading(false);
                        logoutUser()
                      }
                    })
                    .catch((err) => {
                      setError(err.data);
                      logoutUser()
                      setLoading(false);
                    });
                } else {
                  setSocial(true);
                  if (user.email) {
                    setEmail(user.email);
                  }
                  if (user.displayName) {
                    setFirstName(user.displayName.split(" ")[0]);
                    setLastName(user.displayName.split(" ")[1]);
                  }
                  if (user.city) {
                    setCity(user.city);
                  }
                  setLoading(false);
                }
              });

          } else {
            ApiService.disableAuth();
            setLoading(false);
            logoutUser()
          }
        })();

      } else {
        setLoading(false);
      }
    }
  }, [user, loadUser, useSelector]);

  const handleFirstName = (value: any) => {
    setFirstName(value);
  };
  const handleLastName = (value: string) => {
    setLastName(value);
  };
  const handleEmail = (value: string) => {
    setEmail(value);
  };
  const handlePassword = (value: string) => {
    setPassword(value);
  };
  const handleCity = (value: string) => {
    setCity(value);
  };
  const handleCPassword = (value: string) => {
    setCPassword(value);
  };
  const handleGoogle = () => {
    setLoading(true);
    signInWithGoogle().catch(() => setLoading(false));
  };
  const handleFacebook = () => {
    setLoading(true);
    signInWithFacebook().catch(() => setLoading(false));
  };
  const validateRgpd = () => {
    setErrorCgu(!cgu)
    setErrorPdd(!pdd)
    if (cgu && pdd) {
      return true
    }
    return false
  }
  const validate = () => {
    let isFirstNameError = !validateFirstName(firstName).valid;
    let isLastNameError = !validateLastName(lastName).valid;
    let isCityError = !validateCity(city).valid;
    let isEmailError = !validateEmail(email).valid;
    let isPasswordError = !validatePassword(password, cPassword, true).valid;
    setFirstNameError(isFirstNameError);
    setLastNameError(isLastNameError);
    setPasswordError(isPasswordError);
    setEmailError(isEmailError);
    setCityError(isCityError)
    if (social) {
      if (
        !isFirstNameError &&
        !isLastNameError &&
        !isCityError &&
        !isEmailError
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !isFirstNameError &&
        !isLastNameError &&
        !isCityError &&
        !isPasswordError &&
        !isEmailError
      ) {
        return true;
      } else {
        return false;
      }
    }
  };
  const handleRegister = () => {
    if (validate()) {
      if (!social) {
        console.log(validateRgpd())
        if (validateRgpd()) {
          setLoading(true);
          registerWithEmailAndPassword(email, password)
            .then(() => { })
            .catch((err) => {
              setError(err);
              setLoading(false);
            });
        }
      } else {
        if (user) {
          setLoading(true);
          (async () => {
            const responseToken = await getJWTToken(user);
            if (responseToken) {
              ApiService.enableAuth(
                undefined,
                undefined,
                "client " + responseToken
              );
              ClientRepository.getCurrentClient().then((responseClient: any) => {
                ImageRepository.getCurrentClientImage()
                  .then((response: any) => {
                    responseClient = JSON.parse(responseClient);
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
              }).catch((err) => {
                ApiService.disableAuth();
                const client = new Client(
                  responseToken,
                  user.displayName ? user.displayName.split(" ")[1] : lastName,
                  user.displayName ? user.displayName.split(" ")[0] : firstName,
                  user.email!,
                  user.city ? user.city : city
                );
                if (accetptMarketing) {
                  client.acceptMarketing = true
                }
                ClientRepository.createClient(client).then((response: any) => {
                  if (response) {
                    response = JSON.parse(response)
                    ApiService.enableAuth(
                      undefined,
                      undefined,
                      "client " + responseToken
                    );
                    dispatch(
                      login({
                        profile: response,
                        role: 1,
                      })
                    );
                    navigate("/client/gift");
                  } else {
                    logoutUser()
                    setLoading(false);
                  }
                }).catch((err) => {
                  setError(err.data);
                  logoutUser()
                  setLoading(false);
                });
              })
            } else {
              logoutUser()
              setLoading(false);
            }
          })();
        }
      }
    }
  };
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        ApiService.disableAuth();
        dispatch(logout());
        dispatch(removeImageProfile());
      })
      .catch(() => { });
  };
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
        return error.map((el) => <p>{el.message}</p>);
      }
    }
    return "";
  };

  return (
    <div className="h-screen overflow-x-hidden overflow-y-hidden">
        <Helmet>
        <title>Thé Tip Top Participez à notre Tea Contest</title>
        <meta
          name="description"
          content="Inscrivez-vous dès maintenant pour tenter votre chance et remporter des expériences sensorielles uniques autour du monde magique du thé."
        />
        <link rel="canonical" href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/register" />
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
          <div className="flex items-center justify-center ">
            <div className="absolute border-t-4 border-b-4 rounded-full animate-spin h-44 w-44 border-first"></div>
            <img src={teaCup} alt="Icon Icon du Thé" className="h-28 w-28" />
          </div>
        </div>
      </div>
      <div
        className={`${loading ? "opacity-10" : "opacity-100"
          } flex md:h-full relative h-screen`}
      >
        <div className="lg:flex flex-col xl:py-[25px] xl:pr-[10px] xl:pl-[25px] bg-first  relative hidden w-1/2 px-4 md:px-8 py-8">
          <div className="flex">
            <h2 className="text-xl font-bold text-white xl:text-2xl">Jeux concours 🎉</h2>

          </div>
          <div className="flex flex-col gap-y-4">
            <p className="pt-2 text-sm font-semibold text-left text-white xl:leading-7 xl:text-base 2xl:text-xl lg:pt-4">
              Inscrivez-vous dès maintenant pour tenter votre chance et remporter
              des expériences sensorielles uniques autour du monde magique du thé. <br />
              Laissez-vous emporter par la délicatesse des arômes et le plaisir du
              jeu, car sur notre site, chaque participant est une chance de goûter
              à la victoire ! 🍵✨
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
            src={registerImage}
            alt="Image Femme "
            className="absolute bottom-0 -z-0 -right-20"
          />
        </div>
        <div className="flex flex-col xl:py-[25px]  lg:px-[100px] xl:gap-y-6 bg-white text-first p-4 md:p-8 gap-y-4 w-full overflow-y-auto">
          <div className="flex flex-col justify-center xl:gap-y-4 gap-y-2">
            <HomeTitle title="Participez à notre Tea Contest" />
            <p className="font-semibold xl:text-xl text-text md:whitespace-nowrap">
              Remplissez le formulaire ci-dessous pour révéler votre prix
              exceptionnel !
            </p>
          </div>
          <div className="grid lg:grid-cols-2 xl:gap-x-[50px] xl:gap-y-[10px] items-end gap-y-2 gap-x-8 py-3">
            <div>
              <p className={`${lastNameError ? "block" : "hidden"} text-third text-xs xl:text-base pb-1`}>
                {validateFirstName(firstName).message}
              </p>
              {social && firstName !== "" ? (
                <InputLabelComponent
                  value={firstName}
                  disable
                  type="text"
                  label="Prénom"
                  placeholder=" Prénom"
                  required
                  callBack={handleFirstName}
                />
              ) : (
                <InputLabelComponent
                  type="text"
                  label="Prénom"
                  placeholder=" Prénom"
                  required
                  callBack={handleFirstName}
                />
              )}
            </div>
            <div>
              <p
                className={`${firstNameError ? "block" : "hidden"} text-third text-xs xl:text-base pb-1`}
              >
                {validateLastName(lastName).message}
              </p>
              {social && lastName !== "" ? (
                <InputLabelComponent
                  value={lastName}
                  disable
                  type="text"
                  label="Nom "
                  placeholder="Nom"
                  required
                  callBack={handleLastName}
                />
              ) : (
                <InputLabelComponent
                  type="text"
                  label="Nom "
                  placeholder="Nom"
                  required
                  callBack={handleLastName}
                />
              )}
            </div>
            <div>
              <p className={`${emailError ? "block" : "hidden"} text-third text-xs xl:text-base pb-1 `}>
                {validateEmail(email).message}
              </p>
              {social ? (
                <InputLabelComponent
                  disable
                  type="email"
                  value={email}
                  label="Email "
                  placeholder="Email"
                  required
                  callBack={handleEmail}
                />
              ) : (
                <InputLabelComponent
                  type="email"
                  label="Email "
                  placeholder="Email"
                  required
                  callBack={handleEmail}
                />
              )}

            </div>
            <div>
              <p className={`${cityError ? "block" : "hidden"} text-third text-xs xl:text-base pb-1`}>
                {validateCity(city).message}
              </p>
              {social ? (
                <CityComponent
                label="Ville"
                  required
                  callBack={handleCity}
                />
              ) : (
                <CityComponent
                label="Ville"
                  required
                  callBack={handleCity}
                />
              )}
            </div>
            {!social ? (
              <div>
                <p
                  className={`${passwordError ? "block" : "hidden"
                    } text-third text-xs xl:text-base pb-1 `}
                >
                  {validatePassword(password, cPassword, true).message}
                </p>
                <InputLabelComponent
                  label="Mot de passe "
                  type="password"
                  placeholder="Mot de passe"
                  callBack={handlePassword}
                  required
                />
              </div>
            ) : null}
            {!social ? (
              <div>
                <p
                  className={`${passwordError ? "block" : "hidden"
                    } text-third text-xs xl:text-base pb-1 `}
                >
                  {validatePassword(password, cPassword, true).message}
                </p>
                <InputLabelComponent
                  label="Confirmer Mot de passe "
                  type="password"
                  placeholder="Confimer mot de passe"
                  callBack={handleCPassword}
                  required
                />
              </div>
            ) : null}

          </div>
          <div>
            <div>
              <p className={`${errorCgu ? "block" : "hidden"} text-third text-xs xl:text-base pb-1 `}>Veuillez donner votre accord</p>
              <FormControlLabel
                control={
                  <Checkbox

                    className="text-sm underline lg:text-base text-first"
                    sx={{}}
                    value={cgu}
                    onChange={(e: any) => setCgu(e.target.checked)}
                  />
                }
                label={
                  <span className="text-sm text-text xl:text-base">
                    J'accepte les{" "}
                    <a href="/cgu" target="_blank" className="italic underline">
                      Conditions Générales d'Utilisation et les Règles du Jeu.
                    </a>{" "}
                  </span>
                }
                labelPlacement="end"
               
              />
            </div>
            <div>
              <p className={`${errorPdd ? "block" : "hidden"} text-third text-xs xl:text-base pb-1 `}>Veuillez donner votre accord</p>
              <FormControlLabel
                control={
                  <Checkbox
                    className="text-sm underline lg:text-base text-first"
                    sx={{}}
                    value={pdd}
                    onChange={(e: any) => setPdd(e.target.checked)}
                  />
                }
                label={
                  <label className="text-sm text-text xl:text-base"> J’accepte <a
                    href="/politiquedeconfidentialie"
                    target="_blank"
                    className="italic underline"
                  >
                    la politique des données.
                  </a></label>
                }
               
                labelPlacement="end"
              />
            </div>
            <div>
              <p className={`${errorPdd ? "block" : "hidden"} text-third text-xs xl:text-base pb-1 `}>Veuillez donner votre accord</p>
              <FormControlLabel
                control={
                  <Checkbox
                    className="text-sm underline lg:text-base text-first"
                    sx={{}}
                    value={pdd}
                    onChange={(e: any) => setPdd(e.target.checked)}
                  />
                }
                label={
                  <label className="text-sm text-text xl:text-base">Je souhaite recevoir des offres exclusives et des actualités par e-mail de la part de Thé tip top</label>
                }
               
                labelPlacement="end"
              />
            </div>
            <ReCAPTCHA
              className="text-sm"
              sitekey="6Lcwf5YpAAAAAOyhOApbW_Xnj1O1bVCM8WA_aLVK"
              onChange={(value: any) => setRecaptcha(value)}
            />
          </div>
          <div className="flex justify-center ">
            <div className="w-full lg:w-1/2" onClick={handleRegister}>
              <HomeButton
                bg="bg-first"
                color="text-white"
                fontSize=" w-full block"
                title={social ? "Continuer" : "S’inscrire"}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 pb-10">
            <h3 className="font-semibold xl:text-xl lg:text-center text-text">
              Ou inscrivez-vous avec un réseau social
            </h3>
            <ul className="flex items-center justify-center gap-x-9 ">
              <li className="cursor-pointer" onClick={handleGoogle}>
                <img className="lg:w-[42px] w-[38px]" src={googleIcon} alt="" />
              </li>
              <li className="cursor-pointer" onClick={handleFacebook}>
                <img
                  className="lg:w-[42px] w-[38px] cursor-pointer"
                  src={facebookIcon}
                  alt=""
                />
              </li>
            </ul>
            <p className="text-sm xl:text-base text-text">
              Vous avez déjà un compte ?{" "}
              <NavLink
                to="/client/login"
                className="font-bold underline cursor-pointer"
              >
                connectez-vous
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
