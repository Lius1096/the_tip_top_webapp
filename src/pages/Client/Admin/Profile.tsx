import React, { useEffect, useState } from "react";
import Layout from "../../../components/Admin/Layout";
import HomeButton from "../../../components/HomeButton";
import Title from "../../../components/Title";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../../Services/FirebaseService";
import Client from "../../../Models/Client";
import ApiService from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import moment from "moment";
import Helpers from "../../../Services/Helpers";
import ImageRepository from "../../../Repositories/ImageRepository";
import config from "../../../config";
import ProfileComponent from "../../../components/ProfileComponent";
import { useDispatch, useSelector } from "react-redux";
import { setImageProfile } from "../../../Redux/Reducer/ImageProfileReducer";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [client, setClient] = useState<Client>();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [errorMessage, setErrorImage] = useState("");
  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);

  const userSelector = useSelector((state: any) => state.userReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      if (user) {
        if (userSelector.profile) {
          setClient(
            userSelector.profile
          );
          setProfilePicture(imageSelector.value);
        }
      } else {
        ApiService.disableAuth();
        navigate("/client/login");
      }
    }
  }, [user, loadUser, userSelector, imageSelector]);

  useEffect(() => {
    if (file) {
      setLoadingImage(true);
      ImageRepository.createImage(file)
        .then((response: any) => {
          response = JSON.parse(response);
          dispatch(setImageProfile({ value: config.uriPath + "/images/" + response.filePath }))
          setLoadingImage(false);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    }
  }, [file]);

  const renderProfileInfo = () => {
    if (client) {
      return (
        <div className="flex flex-col xl:gap-y-4 gap-y-2">
          <h2 className="font-bold text-center xl:text-2xl text-text md:text-left">
            {client.firstName + " " + client.lastName}
          </h2>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {client.birthday
              ? moment().diff(client.birthday, "years") + " ans"
              : "Âge: N/A"}
          </h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {client.sex ? client.sex : "Sexe: N/A"}
          </h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">{client.email}</h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">{client.phone}</h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {client.city ? client.city : "Ville: N/A"}
          </h3>
          {renderEditButton(client)}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-y-[15px] w-full">
          <Skeleton variant="text" className="text-2xl" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton variant="text" className="text-2xl" />
          <Skeleton variant="text" className="text-base" />
          <Skeleton
            variant="rounded"
            width={163}
            height={40}
            className="items-center justify-center py-[10px] rounded-2xl px-8"
          />
        </div>
      );
    }
  };
  const renderEditButton = (client: Client) => {
    if (!client.birthday || !client.sex || !client.city) {
      return (
        <div onClick={handleCompleteProfile}>
          <HomeButton
            bg="bg-first items-center justify-center"
            color="text-white font-semibold w-max"
            fontSize=""
            title="Compléter mon profil"
          />
        </div>
      );
    }
    return (
      <div onClick={() => navigate("/client/edit")}>
        <HomeButton
          bg="bg-first items-center justify-center"
          color="text-white font-semibold w-max"
          fontSize=""
          title="Editer mon profil"
        />
      </div>
    );
  };

  const getFile = (value: File, error: boolean) => {
    if (error) {
      setErrorImage("Mauvais format de fichier");
    } else {
      setLoadingImage(true);
      setErrorImage("");
      Helpers.resizeFile(value, false)
        .then((response: any) => {
          setFile(response);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    }
  };

  const handleCompleteProfile = () => {
    navigate("/client/edit", { state: { profile: client } });
  };

  return (
    <Layout>
      <Helmet>
        <title>Thé Tip Top Vue profil : détails personnels</title>
        <meta
          name="description"
          content="Vue profil : informations personnelles utilisateur."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/profile"
        />
      </Helmet>
      <div className="flex flex-col 2xl:gap-y-[100px] gap-y-4 2xl:py-[100px] lg:gap-y-10 md:gap-y-20">
        <div className="flex">
          <Title title="Votre profil" color="text-first" />
        </div>
        <div className="flex flex-col items-center justify-center md:flex-row gap-y-8 gap-x-14 2xl:gap-x-20 ">
          {profilePicture && !loadingImage ? (
            <ProfileComponent
              profilePicture={profilePicture}
              getFile={getFile}
              size="xl:w-[444px] xl:h-[444px] w-40 h-40 md:w-80 md:h-80"
              btnSize="w-12 md:w-16 xl:w-max"
              btnWith="w-10 lg:w-full xl:w-max"
              btnPosition="right-2 md:right-10  xl:right-20 "
            />
          ) : (
            <Skeleton
              variant="circular"
              animation="wave"
              width={444}
              height={444}
            />
          )}
          {renderProfileInfo()}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
