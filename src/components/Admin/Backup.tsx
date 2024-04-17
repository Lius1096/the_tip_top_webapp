import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Services/FirebaseService";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';

import { Drawer, Skeleton, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../Services/ApiService";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";

const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const Layout = (props: any) => {
  const navigate = useNavigate();
  const [user, loadUser] = useAuthState(auth);
  const [role, setRole] = useState<number>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);
  const [openDrawer, setOpenDrawer] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile) {
          setRole(userSelector.role);
          setFullName(
            userSelector.profile.firstName + " " + userSelector.profile.lastName
          );
          setEmail(userSelector.profile.email);
          setProfilePicture(imageSelector.value);
        } else {
          logoutUser();
        }
      } else {
      }
    }
  }, [user, loadUser, userSelector, imageSelector]);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        switch (role) {
          case 1:
            ApiService.disableAuth();
            dispatch(logout());
            dispatch(removeImageProfile());
            navigate("/client/login");
            break;
          case 2:
            ApiService.disableAuth();
            dispatch(logout());
            dispatch(removeImageProfile());
            navigate("/admin/login");
            break;
          case 3:
            ApiService.disableAuth();
            dispatch(logout());
            dispatch(removeImageProfile());
            navigate("/admin/login");
            break;

          default:
            break;
        }
      })
      .catch(() => { });
  };

  const renderNavigation = () => {
    if (role) {
      return (
        <ul className="flex flex-col font-semibold text-white xl:text-xl xl:gap-y-7 gap-y-4">
          {role === 1 ? (
            <li
              onClick={() => navigate("/client/dashboard")}
              className="cursor-pointer"
            >
              Tableau de bord
            </li>
          ) : role && role >= 2 ? (
            <li
              onClick={() => navigate("/admin/dashboard")}
              className="cursor-pointer"
            >
              Tableau de bord
            </li>
          ) : null}
          {role === 1 ? (
            <li
              onClick={() => navigate("/client/gift")}
              className="cursor-pointer w-max"
            >
              Prendre une tasse de jeu
            </li>
          ) : null}
          {role && role >= 2 ? (
            <li
              onClick={() => navigate("/admin/winningList")}
              className="cursor-pointer w-max "
            >
              Liste des gagnants
            </li>
          ) : null}
          {role === 1 ? (
            <li
              onClick={() => navigate("/client/giveaway")}
              className="cursor-pointer"
            >
              Historique de vos gains{" "}
            </li>
          ) : null}
          {role && role >= 2 ? (
            <li
              onClick={() => navigate("/admin/user")}
              className="cursor-pointer"
            >
              Utilisateurs
            </li>
          ) : null}
          {role === 1 ? (
            <li
              onClick={() => navigate("/client/profile")}
              className="cursor-pointer"
            >
              Profile
            </li>
          ) : (
            <li
              onClick={() => navigate("/admin/profile")}
              className="cursor-pointer"
            >
              Profile
            </li>
          )}
          <li onClick={() => navigate("/")} className="cursor-pointer">
            À propos du jeux
          </li>
          <li onClick={() => navigate("/")} className="cursor-pointer">
            Boutique en ligne
          </li>
          <li onClick={logoutUser} className="cursor-pointer">
            Déconnexion
          </li>
        </ul>
      );
    }
    return (
      <div className="w-full flex-flex-col">
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
        <Skeleton variant="text" animation="wave" className="text-2xl" />
      </div>
    );
  };
  return (
    <div className="h-screen overflow-hidden w-screen flex bg-first xl:gap-x-[20px] py-4 md:py-8 gap-x-4 ">
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(!openDrawer)} variant="persistent">
        <div className="h-full flex flex-col xl:gap-y-[60px] gap-y-10 py-10 xl:py-20 bg-first px-4 md:px-8">
          <div className="flex flex-col items-start xl:gap-[15px] text-white w-max gap-y-4">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Icon Photo de profil"
                className="xl:rounded-[13px] xl:h-[72px] h-14 rounded-md"
              />
            ) : (
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="xl:h-[72px] xl:w-[72px] xl:rounded-[13px] h-14 rounded-md"
              />
            )}
            <div className="w-full">
              {fullName ? (
                <p className="capitalize xl:text-[30px] font-semibold text-xl">{fullName}</p>
              ) : (
                <div className="w-full">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    className="text-2xl"
                  />
                </div>
              )}
              {email ? (
                <p className="xl:text-[17px] opacity-50 text-sm"> {email} </p>
              ) : (
                <div className="w-full">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    className="text-2xl"
                  />
                </div>
              )}
            </div>
          </div>
          {renderNavigation()}
        </div>
      </Drawer>
      <Main open={openDrawer}>
        </Main>
      <div className="bg-white rounded-[30px] p-[50px] flex flex-col gap-y-[50px] h-full w-full">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
