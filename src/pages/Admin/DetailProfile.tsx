import React, { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Services/FirebaseService";
import { Skeleton } from "@mui/material";
import Title from "../../components/Title";
import ProfileComponent from "../../components/ProfileComponent";
import Layout from "../../components/Admin/Layout";
import profileImage from "../../Assets/Icons/profilePicture.svg";
import moment from "moment";
import deleteIcon from "../../Assets/Icons/deleteIcon.svg";
import editIcon from "../../Assets/Icons/editIcon.svg";
import ClientRepository from "../../Repositories/ClientRepository";
import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../Services/ApiService";
import ImageRepository from "../../Repositories/ImageRepository";
import config from "../../config";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";

const DetailProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [userData, setUserData] = useState<any>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [loadingImage, setLoadingImage] = useState(false);
  const [totalWins, setTotalWins] = useState<number>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const location = useLocation();
  const [currentUserRole, setCurrentUserRole] = useState<number>();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role && location.state.profileData) {
          if (userSelector.role >= 2) {
            setCurrentUserRole(userSelector.role);
            setUserData(location.state.profileData);
            ImageRepository.getClientImage(location.state.profileData.id).then((responseImage) => {
              responseImage = JSON.parse(responseImage)
              setProfilePicture(config.uriPath + "/images/" + responseImage.filePath);
            }).catch(() => { })
          } else {
            redirectLogout()
          }
        } else {
          redirectLogout()
        }
      } else {
        redirectLogout()
      }
    }
  }, [user, loadUser]);

  const redirectLogout = () => {
    ApiService.disableAuth();
    dispatch(logout())
    dispatch(removeImageProfile())
    navigate("/admin/login")
  }

  useEffect(() => {
    if (userData) {
      ClientRepository.getWinTicketCodesById(userData.id)
        .then((response) => {
          response = JSON.parse(response);
          setTotalWins(response.length);
        })
        .catch((err) => { });
    }
  }, [userData]);

  const renderProfileInfo = () => {
    if (userData) {
      return (
        <div className="flex flex-col xl:gap-y-4 gap-y-2">
          <h2 className="font-bold text-center xl:text-2xl text-text md:text-left">
            {userData.firstName + " " + userData.lastName}
          </h2>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {userData.birthday
              ? moment().diff(userData.birthday, "years") + " ans"
              : "Âge: N/A"}
          </h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {userData.sex ? userData.sex : "Sexe: N/A"}
          </h3>
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">{userData.email}</h3>
          {userData.roles && userData.roles[0] === "ROLE_CLIENT" ? (
            <h3 className="font-semibold text-center ftext-sm xl:text-base md:text-left">{userData.phone}</h3>
          ) : null}
          <h3 className="text-sm font-semibold text-center xl:text-base md:text-left">
            {userData.city ? userData.city : "Ville: N/A"}
          </h3>
          <h3 className="text-sm font-bold text-center text-first xl:text-base md:text-left">
            Total des gains
            <sup className="py-0.5 px-1.5 ml-1 text-xs text-white rounded-full  bg-first ">{totalWins ? totalWins : 0}</sup>
          </h3>
          {currentUserRole && currentUserRole === 3 ? (
            <div className="flex items-center mx-auto w-max gap-x-2">
              <img onClick={() =>
                navigate("/admin/editUser", {
                  state: {
                    user: userData,
                    role: userData.roles
                      ? userData.roles[userData.roles.length - 1].slice(5)
                      : "",
                  },
                })
              } src={editIcon} alt="Icon Modification du profil" className="w-5 h-5 xl:w-5" />
              <img src={deleteIcon} alt="Icon Suppression du profil" className="w-4 h-4 xl:w-5" />
            </div>
          ) : null}
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

  return (
    <Layout>
      
      <div className="flex flex-col 2xl:gap-y-[100px] gap-y-4 2xl:py-[100px] lg:gap-y-10 md:gap-y-20">
        <div className="flex items-center h-full gap-x-2">
          <div onClick={() => navigate(-1)} className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer bg-first xl:w-10 xl:h-10">
            <svg width="14" height="14" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.5931 43.6306C23.353 43.8652 23.0266 43.998 22.6856 44C22.5164 44.0015 22.3486 43.9695 22.1926 43.906C22.0365 43.8425 21.8955 43.7488 21.7781 43.6306L0.379398 22.8941C0.259219 22.7791 0.163798 22.6422 0.0986685 22.4912C0.0335391 22.3403 -2.95309e-07 22.1783 -2.95309e-07 22.0146C-2.95309e-07 21.851 0.0335391 21.689 0.0986685 21.5381C0.163798 21.3871 0.259219 21.2502 0.379398 21.1352L21.7781 0.394288C21.8958 0.2724 22.0376 0.174695 22.195 0.106988C22.3524 0.0392809 22.5223 0.00295525 22.6945 0.000172926C22.8667 -0.00260939 23.0377 0.0282085 23.1974 0.0907926C23.3571 0.153377 23.5021 0.246448 23.6239 0.364467C23.7457 0.482486 23.8417 0.623042 23.9063 0.777769C23.9709 0.932495 24.0027 1.09823 23.9998 1.26511C23.997 1.43199 23.9595 1.59661 23.8896 1.74916C23.8197 1.90172 23.7189 2.03909 23.5931 2.15311L3.10188 22.0146L23.5931 41.8718C23.7128 41.987 23.8077 42.124 23.8725 42.275C23.9373 42.4259 23.9706 42.5877 23.9706 42.7512C23.9706 42.9146 23.9373 43.0765 23.8725 43.2274C23.8077 43.3783 23.7128 43.5154 23.5931 43.6306Z" fill="#fff" />
            </svg>
          </div>
          <Title
            title={`profil de ${userData ? userData.firstName : null
              }`}
            color="text-first"
          />
        </div>

        <div className="flex flex-col items-center justify-center md:flex-row gap-y-8 gap-x-14 2xl:gap-x-20 ">
          {profilePicture && !loadingImage ? (
            <ProfileComponent
              profilePicture={profilePicture}
              size="xl:w-[444px] xl:h-[444px] w-40 h-40 md:w-80 md:h-80"
              btnSize="w-12 md:w-16 xl:w-max"
              btnWith="w-10 lg:w-full xl:w-max"
              btnPosition="right-2 md:right-10  xl:right-20 "
            />
          ) : (
            <ProfileComponent
              profilePicture={profileImage}
              size="xl:w-[444px] xl:h-[444px] w-40 h-40 md:w-80 md:h-80"
              btnSize="w-12 md:w-16 xl:w-max"
              btnWith="w-10 lg:w-full xl:w-max"
              btnPosition="right-2 md:right-10  xl:right-20 "
            />
          )}
          {renderProfileInfo()}
        </div>
      </div>
    </Layout>
  );
};

export default DetailProfile;
