import React, { useEffect, useState } from "react";
import InputLabelComponent from "../../../components/InputLabelComponent";
import HomeButton from "../../../components/HomeButton";
import { useNavigate } from "react-router-dom";
import Client from "../../../Models/Client";
import Layout from "../../../components/Admin/Layout";
import ImageRepository from "../../../Repositories/ImageRepository";
import teaCup from "../../../Assets/Icons/teaCup.svg";
import config from "../../../config";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../../Services/FirebaseService";
import ClientRepository from "../../../Repositories/ClientRepository";
import ApiService from "../../../Services/ApiService";
import ProfileComponent from "../../../components/ProfileComponent";
import Helpers from "../../../Services/Helpers";
import { Alert, Skeleton } from "@mui/material";
import Title from "../../../components/Title";
import SimpleSelectComponent from "../../../components/SimpleSelectComponent";
import DatePickerComponent from "../../../components/DatePickerComponent";
import { Moment } from "moment";
import CityComponent from "../../../components/CityComponent";
import { useDispatch, useSelector } from "react-redux";
import { setImageProfile } from "../../../Redux/Reducer/ImageProfileReducer";
import { login } from "../../../Redux/Reducer/UserReducer";
import { toast } from "react-hot-toast";
import ApiErrorInterface from "../../../Models/Interface/ApiErrorInterface";
import { validateFirstName } from "../../Validation/FirstName";
import { validateLastName } from "../../Validation/LastName";
import { validatePhone } from "../../Validation/Phone";
import { Helmet } from "react-helmet-async";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState<string>();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [errorMessage, setErrorImage] = useState("");

  const [client, setClient] = useState<Client>();
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [user, loadUser] = useAuthState(auth);
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState<Moment>();
  const [error, setError] = useState<ApiErrorInterface[]>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      setLoading(false);
      if (user) {
        if (userSelector.profile) {
          setClient(userSelector.profile);
          setProfilePicture(imageSelector.value);
        }
      } else {
        ApiService.disableAuth();
        navigate("/client/login");
      }
    }
  }, [user, loadUser, userSelector, imageSelector]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);

  const validate = () => {
    let isFirstNameError = !validateFirstName(firstName).valid;
    let isLastNameError = !validateLastName(lastName).valid;
    let isPhoneError = !validatePhone(phone).valid;
    setFirstNameError(isFirstNameError);
    setLastNameError(isLastNameError);
    setPhoneError(isPhoneError);
    if (!isFirstNameError && !isLastNameError && !isPhoneError) {
      return true;
    } else {
      return false;
    }
  };
  const handleLastName = (value: any) => {
    setLastName(value);
  };
  const handFirstName = (value: any) => {
    setFirstName(value);
  };
  const handleCity = (value: any) => {
    setCity(value);
  };
  const handleSex = (value: any) => {
    setSex(value);
  };

  const handlePhone = (value: any) => {
    setPhone(value);
  };
  const handleBirthDay = (value: Moment) => {
    setBirthday(value);
  };
  const getFile = (value: File, error: boolean) => {
    if (error) {
      setErrorImage("Mauvais format de fichier");
    } else {
      setErrorImage("");
      Helpers.resizeFile(value, false)
        .then((response: any) => {
          setFile(response);
          setProfilePicture(URL.createObjectURL(response));
          setLoadingImage(false);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    }
  };
  const handleEditProfile = () => {
    setLoading(true);
    if (validate()) {
      if (client) {
        const clientObj = new Client(
          "",
          lastName,
          firstName,
          client.email,
          phone
        );

        if (birthday) {
          clientObj.birthday = new Date(birthday.format("L"));
        }
        clientObj.city = city!;
        clientObj.sex = sex;
        ClientRepository.putClient(clientObj)
          .then((response: any) => {
            toast.success("Profil mis à jour avec succès ✅");
            dispatch(
              login({
                profile: JSON.parse(response),
                role: 1,
              })
            );
            if (file) {
              ImageRepository.createImage(file)
                .then((response: any) => {
                  response = JSON.parse(response);
                  dispatch(
                    setImageProfile({
                      value: config.uriPath + "/images/" + response.filePath,
                    })
                  );

                  setLoading(false);
                  navigate("/client/profile");
                })
                .catch((err) => {
                  setLoadingImage(false);
                });
            } else {
              navigate("/client/profile");
            }
          })
          .catch((err) => {
            setError(err.data);
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  };
  const renderErrorMessage = () => {
    if (error) {
      return error.map((el) => <p>{toast.error(el.message)}</p>);
    }
    return "";
  };

  const renderCity = ["Paris", "Lyon", "Sens"];
  const renderSex = [
    { value: "h", label: "Homme" },
    { value: "f", label: "Femme" },
  ];
  const rendertLayout = () => {
    if (client) {
      return (
        <div className="w-screen border">
          <div
            className={`${
              loading ? "fixed" : "hidden"
            } w-full h-screen overflow-y-hidden bg-[rgba(88,105,75,0.3)] z-50 `}
          >
            <Alert severity="error">{renderErrorMessage()}</Alert>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative flex items-center justify-center">
                <div className="absolute border-t-4 border-b-4 rounded-full animate-spin h-44 w-44 border-first"></div>
                <img src={teaCup} alt="Icon Thé Tip Top" className="h-28 w-28" />
              </div>
            </div>
          </div>
          <div className={`${loading ? "opacity-10" : "opacity-100"}`}>
            <Layout>
              <div className="flex flex-col gap-y-[10px] bg-white h-full">
                <div className="flex gap-x-[334px]">
                  <Title
                    title="Editer le profil"
                    color="text-first"
                  />
                </div>
                <div className="mx-auto">
                  {profilePicture && !loadingImage ? (
                    <ProfileComponent
                      profilePicture={profilePicture}
                      getFile={getFile}
                      right="right-4"
                      bottom="-bottom-2"
                      btnWith="w-10"
                      btnPosition=""
                    />
                  ) : (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={300}
                      height={300}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-[50px] gap-y-[10px] items-end">
                  <div>
                    <p
                      className={`${
                        lastNameError ? "block" : "hidden"
                      } text-third text-xs xl:text-base pb-1`}
                    >
                      {validateFirstName(firstName).message}
                    </p>
                    {client ? (
                      client.firstName ? (
                        <InputLabelComponent
                          type="text"
                          label="Prénom"
                          placeholder=" Prénom"
                          value={client.firstName}
                          callBack={handFirstName}
                        />
                      ) : (
                        <InputLabelComponent
                          type="text"
                          label="Prénom"
                          placeholder=" Prénom"
                          callBack={handFirstName}
                        />
                      )
                    ) : (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        className="text-2xl"
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`${
                        lastNameError ? "block" : "hidden"
                      } text-third text-xs xl:text-base pb-1`}
                    >
                      {validateLastName(lastName).message}
                    </p>
                    {client ? (
                      client.lastName ? (
                        <InputLabelComponent
                          type="text"
                          label="Nom "
                          placeholder="Nom"
                          value={client.lastName}
                          callBack={handleLastName}
                        />
                      ) : (
                        <InputLabelComponent
                          type="text"
                          label="Nom "
                          placeholder="Nom"
                          callBack={handleLastName}
                        />
                      )
                    ) : (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        className="text-2xl"
                      />
                    )}
                  </div>

                  <div>
                    {client.city ? (
                      <CityComponent
                        label="Ville"
                        cities={renderCity}
                        value={client.city}
                        callBack={handleCity}
                      />
                    ) : (
                      <CityComponent
                        label="Ville"
                        cities={renderCity}
                        callBack={handleCity}
                      />
                    )}
                  </div>
                  <div>
                    {client.sex ? (
                      <SimpleSelectComponent
                        label="Genre"
                        options={renderSex}
                        value={client.sex}
                        callBack={handleSex}
                      />
                    ) : (
                      <SimpleSelectComponent
                        label="Genre"
                        placeholder="Votre genre"
                        options={renderSex}
                        callBack={handleSex}
                      />
                    )}
                  </div>

                  <div>
                    {client.birthday ? (
                      <DatePickerComponent
                        message="Date de naissance"
                        defautValue={client.birthday}
                        callBack={handleBirthDay}
                      />
                    ) : (
                      <DatePickerComponent callBack={handleBirthDay} />
                    )}
                  </div>
                  <div>
                    <p
                      className={`${
                        phoneError ? "block" : "hidden"
                      } text-third text-xs xl:text-base pb-1`}
                    >
                      {validatePhone(phone).message}
                    </p>
                    {client.phone ? (
                      <InputLabelComponent
                        label="Téléphone "
                        type="phone"
                        placeholder="+33..."
                        value={client.phone}
                        callBack={handlePhone}
                      />
                    ) : (
                      <InputLabelComponent
                        label="Téléphone "
                        type="phone"
                        placeholder="+33..."
                        callBack={handlePhone}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-end ">
                    <div
                      className=""
                      onClick={() => navigate("/client/profile")}
                    >
                      <HomeButton
                        bg="bg-white"
                        color="text-first"
                        fontSize="text-lg"
                        title="Annuler"
                      />
                    </div>
                    <div className="" onClick={handleEditProfile}>
                      <HomeButton
                        bg="bg-first"
                        color="text-white"
                        fontSize="text-lg"
                        title="Enregistrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Layout>
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
              <img src={teaCup} alt="Icon Modification du profil" className="h-28 w-28" />
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <Helmet>
        <title>Thé Tip Top Modifier le profil utilisateur</title>
        <meta
          name="description"
          content="Modifier le profil utilisateur : mettez à jour vos informations personnelles."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/edit"
        />
      </Helmet>
      {rendertLayout()}
    </>
  );
};

export default EditProfile;
