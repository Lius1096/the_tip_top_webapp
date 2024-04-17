import React, { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { useNavigate } from "react-router-dom";
import { auth } from "../../Services/FirebaseService";
import ImageRepository from "../../Repositories/ImageRepository";
import config from "../../config";
import Admin from "../../Models/Admin";
import { Skeleton } from "@mui/material";
import HomeButton from "../../components/HomeButton";
import Helpers from "../../Services/Helpers";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import ProfileComponent from "../../components/ProfileComponent";
import { useDispatch, useSelector } from "react-redux";
import { setImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import Employee from "../../Models/Employe";
import { Helmet } from "react-helmet-async";

const AdminProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [admin, setAdmin] = useState<Employee>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [errorMessage, setErrorImage] = useState("");
  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [role, setRole] = useState();

  const userSelector = useSelector((state: any) => state.userReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role >= 2) {
          setAdmin(userSelector.profile);
          setRole(userSelector.role);
          setProfilePicture(imageSelector.value);
        }
      }
    }
  }, [user, loadUser, userSelector, imageSelector]);

  useEffect(() => {
    if (file) {
      setLoadingImage(true);
      ImageRepository.createImage(file)
        .then((response: any) => {
          response = JSON.parse(response);
          dispatch(
            setImageProfile({
              value: config.uriPath + "/images/" + response.filePath,
            })
          );
          setLoadingImage(false);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    }
  }, [file]);

  const renderProfileInfo = () => {
    if (admin) {
      if (role === 2) {
        return (
          <div className="flex flex-col gap-y-[15px]">
            <h2 className="text-2xl font-extrabold text-text">
              {admin.firstName + " " + admin.lastName}
            </h2>

            <h3 className="font-extrabold">{admin.email}</h3>
            <h3 className="font-extrabold">{admin.employeCode}</h3>

            {renderEditButton(admin)}
          </div>
        );
      } else {
        return (
          <div className="flex flex-col xl:gap-y-4 gap-y-2">
            <h2 className="font-bold text-center xl:text-2xl text-text md:text-left">
              {admin.firstName + " " + admin.lastName}
            </h2>

            <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
              {admin.email}
            </h3>

            {renderEditButton(admin)}
          </div>
        );
      }
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

  const renderEditButton = (admin: Admin) => {
    if (!admin.firstName || !admin.lastName) {
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
      <div onClick={handleCompleteProfile}>
        <HomeButton
          bg="bg-first items-center justify-center"
          color="text-white font-semibold w-max"
          fontSize=""
          title="Editer mon profil"
        />
      </div>
    );
  };

  const handleCompleteProfile = () => {
    navigate("/admin/edit", { state: { profile: admin } });
  };

  return (
    <Layout>
      <Helmet>
        <title>Thé Tip Top Profil administrateur : détails personnels</title>
        <meta
          name="description"
          content="Profil administrateur : informations personnelles de l'utilisateur."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/profile"
        />
      </Helmet>

      <div className="flex flex-col 2xl:gap-y-[100px] gap-y-4 2xl:py-[100px] lg:gap-y-10 md:gap-y-20">
        <div className="flex">
          <Title title="Votre profil" color="text-first" />
        </div>

        <div className="flex flex-col items-center justify-center md:flex-row gap-y-8 gap-x-14 2xl:gap-x-20">
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

export default AdminProfile;
