import React, { useEffect, useState } from "react";

import adminIcon from "../../Assets/Icons/admin.svg";
import InputLabelComponent from "../../components/InputLabelComponent";
import { Alert, Button, Checkbox, FormControlLabel } from "@mui/material";
import teaCup from "../../Assets/Icons/teaCup.svg";
import HomeButton from "../../components/HomeButton";
import { Helmet } from "react-helmet-async";

import {
  FirebaseAuthServiceErrorCode,
  auth,
  getJWTToken,
  logInWithEmailAndPassword,
} from "../../Services/FirebaseService";
import { useNavigate } from "react-router-dom";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { FirebaseError } from "firebase/app";
import { validateEmail } from "../Validation/Email";
import { inMemoryPersistence, indexedDBLocalPersistence, signOut } from "firebase/auth";
import { validatePassword } from "../Validation/Password";
import ApiService from "../../Services/ApiService";
import AdminRepository from "../../Repositories/AdminRepository";
import { useDispatch } from "react-redux";
import { login, logout } from "../../Redux/Reducer/UserReducer";
import ImageRepository from "../../Repositories/ImageRepository";
import { removeImageProfile, setImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import config from "../../config";
import EmployeeRepository from "../../Repositories/EmployeRepository";
import HomeTitle from "../../components/HomeTitle";
import SettingsGameRepository from "../../Repositories/SettingsGameRepository";
import { addWinner, removeWinner } from "../../Redux/Reducer/WinnerReducer";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, loadUser] = useAuthState(auth);


  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState<FirebaseError>();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);
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
              "admin " + responseToken
            );
            AdminRepository.getCurrentAdmin().then((response) => {
              dispatch(login({
                profile: JSON.parse(response),
                role: 3
              }))
              ImageRepository.getCurrentClientImage().then((imageResponse) => {
                imageResponse = JSON.parse(imageResponse)
                if (imageResponse && imageResponse.filePath) {
                  dispatch(setImageProfile({
                    value: config.uriPath + "/images/" + imageResponse.filePath
                  }))
                }
              }).catch(() => {
                ApiService.disableAuth();
                logoutUser()
                setLoading(false);
              })
              
              SettingsGameRepository.getCurrentGame()
              .then((responseGame) => {
                responseGame = JSON.parse(responseGame)
                  if (new Date(responseGame.endDate) < new Date()) {
                    dispatch(addWinner())
                  }else{
                    dispatch(removeWinner())
                  }

                }).catch(()=> dispatch(removeWinner()))
              navigate("/admin/dashboard");
            }).catch(() => {
              ApiService.disableAuth();
              ApiService.enableAuth(
                undefined,
                undefined,
                "employee " + responseToken
              );
              EmployeeRepository.getCurrentEmployee().then((responseEmployee) => {
                ImageRepository.getCurrentClientImage().then((imageResponse) => {
                  imageResponse = JSON.parse(imageResponse)
                  if (imageResponse && imageResponse.filePath) {
                    dispatch(setImageProfile({
                      value: config.uriPath + "/images/" + imageResponse.filePath
                    }))
                  }
                }).catch(() => {

                })
                dispatch(login({
                  profile: JSON.parse(responseEmployee),
                  role: 2
                }))
                navigate("/admin/dashboard");
              }).catch(() => {
                logoutUser()
                setLoading(false);
              })

            })

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
      switch (error.code) {
        case FirebaseAuthServiceErrorCode.INVALID_LOGIN_CREDENTIALS:
          return (
            <div>
              <p>
                Aucun compte trouvé avec la combinaison e-mail et mot de passe
                fournise.
                <a href="/client/register" className="ml-2 italic underline">
                  {" "}
                  Je n'ai pas de compte ?
                </a>
              </p>
            </div>
          );

        case FirebaseAuthServiceErrorCode.WRONG_PASSWORD:
          return (
            <div>
              <p>
                Aucun compte trouvé avec la combinaison e-mail et mot de passe
                fournise.
                <a href="/client/register" className="ml-2 italic underline">
                  {" "}
                  Je n'ai pas de compte ?
                </a>
              </p>
            </div>
          );

        default:
          return "Erreur, un problème inconnu est survenu";
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
    <div className="h-screen overflow-hidden">
        <Helmet>
        <title>Thé Tip Top Connection à votre Tea Space administrateur !</title>
        <meta
          name="description"
          content="Vous êtes le gagnant de notre concours ! Profitez de votre infuseur à thé et savourez chaque moment de détente."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/congratulation"
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
      <div className={`${loading ? "opacity-10" : "opacity-100"} flex flex-col  items-center  text-white bg-first h-full`}>
        <div className="flex flex-col justify-center w-full h-full px-4 mx-auto lg:w-1/2 md:px-8 lg:px-0 gap-y-10 lg:gap-y-0 xl:gap-y-10">
          <div className="flex flex-col gap-[10px]  justify-center w-1/2  mx-auto mb-10">
            <img src={adminIcon} alt="Icon Page administrateur" className="w-1/4 mx-auto " />
            <h1 className="text-2xl font-extrabold text-center text-white xl:text-5xl">
            Espace Admin
            </h1>
          </div>
          <div className="flex flex-col w-full mx-auto lg:w-1/2 gap-y-6 ">
            <div>
              <p className={`${emailError ? "block" : "hidden"} text-third my-2`}>
                {validateEmail(email).message}
              </p>
              <InputLabelComponent
                type="text"
                label="identifiant / email *"
                placeholder="Ex: Admin"
                color="text-white"
                bg="bg-white"
                inputColor="text-text"
                callBack={handleEmailChange}
              />
            </div>
            <div>
              <p
                className={`${passwordError ? "block" : "hidden"
                  } text-third my-2`}
              >
                {validatePassword(password, null, true).message}
              </p>
              <InputLabelComponent
                type="password"
                label="Mot de passe *"
                placeholder="********"
                color="text-white"
                bg="bg-white"
                inputColor="text-text"
                callBack={handlePasswordChange}
              />
            </div>
            <FormControlLabel
              control={<Checkbox defaultChecked className="text-sm text-white lg:text-base" sx={{

              }} />}
              label="Se souvenir de moi "
              value={remember}
              onChange={(e: any) => setRemember(e.target.checked)}
            />
            <div onClick={handleLogin}>
              <HomeButton
                bg="bg-white"
                color="text-first"
                fontSize="text-sm lg:text-base w-full block"
                title="Se connecter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
