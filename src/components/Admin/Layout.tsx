import React, { useEffect, useState } from "react";
import { styled, useTheme, Drawer, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { IconButton, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth/dist/index.cjs';
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../Services/FirebaseService";
import { signOut } from "firebase/auth";
import ApiService from "../../Services/ApiService";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import menuIcon from "../../Assets/Icons/menu.svg";
import arrowIcon from "../../Assets/Icons/right-white.svg";
import teaCup from "../../Assets/Icons/teaCup.svg";
import random from "../../Assets/Icons/random.svg";
import GiveawayRepository from "../../Repositories/GiveawayRepository";
import toast from "react-hot-toast";
import { removeWinner } from "../../Redux/Reducer/WinnerReducer";
import { stopLoading } from "../../Redux/Reducer/LoadingReducer";

const drawerWidth = 240;
const drawerWidthLg = 400;
const drawerWidthXl = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.only("lg")]: {
    marginLeft: `-${drawerWidthLg}px`,
  },
  [theme.breakpoints.only("xl")]: {
    marginLeft: `-${drawerWidthXl}px`,
  },
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.only("lg")]: {
      marginLeft: 0,
    },
    [theme.breakpoints.only("xl")]: {
      marginLeft: 0,
    },
  }),
}));

export default function Layout(props: any) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [user, loadUser] = useAuthState(auth);
  const [role, setRole] = useState<number>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const loadingSelector = useSelector((state: any) => state.loadingReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);
  const WinnerSelector = useSelector((state: any) => state.winnerReducer);
  const [openDraw, setOpenDraw] = useState(false)
  const [openCDraw, setOpenCDraw] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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
          setOpenDraw(WinnerSelector.value)
        } else {
          logoutUser();
        }
      } else {
        logoutUser();
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
            ApiService.disableAuth();
            dispatch(logout());
            dispatch(removeImageProfile());
            navigate("/client/login");
            break;
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    setLoading(loadingSelector.value);
  }, [loadingSelector]);

  const renderNavigation = () => {
    if (role) {
      return (
        <ul className="flex flex-col font-semibold text-white xl:text-xl xl:gap-y-3 gap-y-4 lg:gap-y-2">
          {role && role === 3 && WinnerSelector.value ? (
            <li
              onClick={() => navigate("/admin/draw")}
              className="cursor-pointer"
            >
              Tirage au sort
            </li>
          ) : null}
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
          {role && role === 3 ? (
            <li
              onClick={() => navigate("/admin/employee_list")}
              className="cursor-pointer"
            >
              Employés
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
            Retour à l'accueil
          </li>
          <li className="cursor-pointer">
            <a href="/regledujeu" target="_blank">
              Règlement du jeu
            </a>
          </li>
          {role === 3 ? (
            <li
              onClick={() => navigate("/admin/settings")}
              className="cursor-pointer"
            >
              Paramètres du jeu
            </li>
          ) : (
            null
          )}
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

  const getBesWinner = () => {
    setLoading(true)
    setOpenCDraw(false)
    GiveawayRepository.getBestWinner().then((response) => {
      setLoading(false)
      setOpenDraw(false)
      dispatch(removeWinner())
      dispatch(stopLoading())
      navigate("/admin/detailProfile", {
        state: { profileData: response },
      })
    }).catch((err) => {
      setLoading(false)
      toast.error(err.data.message)
    })
  }
  return (
    <div>
      <div
        className={`${loading ? "fixed" : "hidden"
          } w-screen overflow-y-hidden bg-[rgba(88,105,75,0.3)]  h-screen z-[9999]`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center ">
            <div className="absolute border-t-4 border-b-4 rounded-full animate-spin h-44 w-44 border-first"></div>
            <img src={teaCup} alt="Icon Thé Tip Top" className="h-28 w-28" />
          </div>
        </div>
      </div>
      <div
        className={`h-screen overflow-hidden w-screen flex bg-first xl:gap-x-[20px] py-4 md:py-8 gap-x-4 pr-4 md:pr-8 xl:pr-[100px]`}
      >
        <Drawer
          sx={{
            flexShrink: 0,
            width: drawerWidth,
            [theme.breakpoints.only("lg")]: {
              width: drawerWidthLg,
            },
            [theme.breakpoints.only("xl")]: {
              width: 400,
            },
            "& .MuiDrawer-paper": {
              border: 0,
              width: drawerWidth,
              overflow: "hidden",
              boxSizing: "border-box",
              [theme.breakpoints.only("lg")]: {
                width: drawerWidthLg,
              },
              [theme.breakpoints.only("xl")]: {
                width: drawerWidthXl,
              },
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <div className="h-full flex flex-col xl:gap-y-8 overflow-y-hidden py-16 xl:py-20 bg-first pl-4 md:pl-8 xl:pl-[100px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start w-full text-white gap-y-8 lg:gap-y-10">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Icon Photo du profil"
                    className="xl:rounded-[13px] xl:h-[72px] h-14 rounded-md"
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="xl:h-[72px] xl:w-[72px] xl:rounded-[13px] h-14 rounded-md"
                  />
                )}
                <div className="flex flex-col w-full gap-y-2">
                  {fullName ? (
                    <p className="text-xl font-semibold capitalize xl:text-2xl ">
                      {fullName}
                    </p>
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
                    <p className="xl:text-[17px] opacity-50 text-sm">
                      {" "}
                      {email}{" "}
                    </p>
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
              <div className="absolute right-0" onClick={() => setOpen(false)}>
                <IconButton>
                  <img
                    src={arrowIcon}
                    className="w-3 h-3 rotate-180 xl:h-5 xl:w-5"
                    alt="Icon Button responsive"
                  />
                </IconButton>
              </div>
            </div>
            {renderNavigation()}
          </div>
        </Drawer>
        <Main open={open} className="w-1/2">
          <div className="h-full p-4 md:p-8 xl:rounded-[30px] bg-white rounded-3xl overflow-y-hidden">
            <div className="flex flex-col h-full overflow-y-auto rounded-3xl lg:rounded-none gap-y-4 lg:gap-y-0">
              {open ? null : (
                <div className="flex " onClick={() => setOpen(true)}>
                  <IconButton className="w-10 h-10 xl:w-12 xl:h-12">
                    <img src={menuIcon} className="" alt="Icon Menu principal" />
                  </IconButton>
                </div>
              )}
              <div className="flex flex-col gap-y-10 ">{props.children}</div>
            </div>
          </div>
          <Dialog
            open={openDraw}
            sx={{
              "& .MuiPaper-root": {
                width: "100%",
                borderRadius: "24px",
                [theme.breakpoints.up("md")]: {
                  width: "50%",
                  padding: "30px",
                },
                [theme.breakpoints.up("lg")]: {
                  width: "40%",
                },
                [theme.breakpoints.up("xl")]: {
                  borderRadius: "30px",
                  width: "30%",
                  padding: "40px"
                },
                maxWidth: "unset"
              }
            }}
          >
            <div className="flex justify-end pt-2 pr-2 right-3 top-3 lg:absolute lg:p-0">
              <IconButton className="xl:p-3 bg-third" onClick={() => setOpenDraw(false)}>
                <svg width="15" height="15" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.65225 45.943C1.00425 46.295 1.46425 46.47 1.92425 46.47C2.38425 46.47 2.84525 46.294 3.19625 45.943L23.2333 25.911L43.2713 45.943C43.6233 46.295 44.0832 46.47 44.5442 46.47C45.0042 46.47 45.4652 46.294 45.8162 45.943C46.5192 45.24 46.5192 44.1 45.8162 43.398L25.7812 23.367L45.8182 3.33497C46.5212 2.63297 46.5212 1.49197 45.8182 0.788969C45.1152 0.0859687 43.9753 0.0859687 43.2723 0.788969L23.2343 20.821L3.19725 0.788969C2.49425 0.0859687 1.35525 0.0859687 0.65225 0.788969C-0.05075 1.49197 -0.05075 2.63297 0.65225 3.33497L20.6892 23.367L0.65225 43.398C-0.05075 44.101 -0.05075 45.24 0.65225 45.943Z" fill="#fff" />
                </svg>
              </IconButton>
            </div>
            <div className="flex flex-col items-center">

              <DialogTitle id="alert-dialog-title" className="text-lg font-extrabold text-first md:text-xl xl:text-2xl">
                Tirage au sort 🎡
              </DialogTitle>
              <h3 className="text-sm font-semibold text-center md:text-base xl:text-lg text-first">Le jeu-concours est terminé, vous pouvez dès à présent lancer le tirage au sort pour déterminer l'heureux gagant du gros lot.</h3>
            </div>
            <DialogContent>
              <DialogActions className="justify-between md:w-[40%] lg:w-1/2 mx-auto">
                <Button onClick={() => setOpenCDraw(true)} className="mx-auto text-xs bg-first md:text-sm xl:text-base" variant="contained">
                  Lancer
                  <img className="w-8 ml-4" src={random} alt="tirage au sort" />
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openCDraw}
            sx={{
              "& .MuiPaper-root": {
                width: "100%",
                borderRadius: "24px",
                [theme.breakpoints.up("md")]: {
                  width: "50%",
                  padding: "30px",
                },
                [theme.breakpoints.up("lg")]: {
                  width: "40%",
                },
                [theme.breakpoints.up("xl")]: {
                  borderRadius: "30px",
                  width: "30%",
                  padding: "40px"
                },
                maxWidth: "unset"
              }
            }}
          >
            <div className="flex justify-end pt-2 pr-2 right-3 top-3 lg:absolute lg:p-0">
              <IconButton className="xl:p-3 bg-third" onClick={() => { setOpenCDraw(false); setOpenDraw(false) }}>
                <svg width="15" height="15" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.65225 45.943C1.00425 46.295 1.46425 46.47 1.92425 46.47C2.38425 46.47 2.84525 46.294 3.19625 45.943L23.2333 25.911L43.2713 45.943C43.6233 46.295 44.0832 46.47 44.5442 46.47C45.0042 46.47 45.4652 46.294 45.8162 45.943C46.5192 45.24 46.5192 44.1 45.8162 43.398L25.7812 23.367L45.8182 3.33497C46.5212 2.63297 46.5212 1.49197 45.8182 0.788969C45.1152 0.0859687 43.9753 0.0859687 43.2723 0.788969L23.2343 20.821L3.19725 0.788969C2.49425 0.0859687 1.35525 0.0859687 0.65225 0.788969C-0.05075 1.49197 -0.05075 2.63297 0.65225 3.33497L20.6892 23.367L0.65225 43.398C-0.05075 44.101 -0.05075 45.24 0.65225 45.943Z" fill="#fff" />
                </svg>
              </IconButton>
            </div>
            <div className="flex flex-col items-center">

              <DialogTitle id="alert-dialog-title" className="text-lg font-extrabold text-first md:text-xl xl:text-2xl">
                Êtes-vous sûr de vouloir continuer ?
              </DialogTitle>
              <h3 className="text-sm font-semibold text-center md:text-base xl:text-lg text-third">En cliquant sur oui vous lancer le tirage au sort.
                <br />
                Rassurez-vous d'être en présence de Maître Arnaud Rick huissier de justice.
              </h3>
            </div>
            <DialogContent>
              <DialogActions className="justify-between md:w-[40%] lg:w-1/2 mx-auto">
                <Button className="text-xs text-third border-third md:text-sm xl:text-base" variant="outlined" onClick={() => setOpenCDraw(false)} >Non</Button>
                <Button className="text-xs bg-first md:text-sm xl:text-base" variant="contained" onClick={getBesWinner}>
                  Oui
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </Main>
      </div>
    </div>
  );
}
