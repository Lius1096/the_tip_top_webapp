import React, { useEffect, useState } from 'react';
import Layout from '../../components/Admin/Layout';
import Title from '../../components/Title';
import HomeButton from '../../components/HomeButton';
import trophy from '../../Assets/Images/trophy.svg'
import random from "../../Assets/Icons/random.svg";
import { useAuthState } from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../Services/FirebaseService";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import GiveawayRepository from '../../Repositories/GiveawayRepository';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../Redux/Reducer/LoadingReducer';
import ApiService from '../../Services/ApiService';
import { logout } from '../../Redux/Reducer/UserReducer';
import { removeImageProfile } from '../../Redux/Reducer/ImageProfileReducer';
import { useNavigate } from 'react-router-dom';
import { removeWinner } from '../../Redux/Reducer/WinnerReducer';

const Draw = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, loadUser] = useAuthState(auth);
    const [openCDraw, setOpenCDraw] = useState(false)
    const [loading, setLoading] = useState(true);
    const userSelector = useSelector((state: any) => state.userReducer);

    useEffect(() => {
        if (loadUser) {
        } else {
            if (user) {
                if (userSelector.profile && userSelector.role) {
                    if (userSelector.role >= 2) {
                        GiveawayRepository.getBestWinner().then((response) => {
                            response = JSON.parse(response)
                            dispatch(removeWinner())
                            dispatch(stopLoading())
                            navigate("/admin/detailProfile", {
                                state: { profileData: response },
                            })
                        }).catch((err) => {
                            setLoading(false)
                        })
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
        if (loading) {
            dispatch(startLoading())
        } else {
            dispatch(stopLoading())
        }
    }, [loading]);

    const getBesWinner = () => {
        setLoading(true)
        setOpenCDraw(false)
        GiveawayRepository.getBestWinner().then((response) => {
            response = JSON.parse(response)
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
        <Layout>
            <div className="flex flex-col xl:gap-y-[100px] gap-y-8">
                <div className="flex flex-col justify-between md:flex-row gap-y-4">
                    <Title title="Tirage au sort" color="text-first" />


                </div>
                <div className="flex flex-col gap-y-8">
                    <img src={trophy} className='w-1/4 mx-auto opacity-60' alt="Icon Tirage au sort" />
                    <p className='font-semibold text-center text-text'>Vous n'avez pas encore effectué de tirage au sort !</p>
                    <Button onClick={() => setOpenCDraw(true)} className="flex mx-auto text-xs bg-first md:text-sm xl:text-base" variant="contained">
                        Lancer
                        <img className="w-8 ml-4" src={random} alt="tirage au sort" />
                    </Button>
                </div>

            </div>
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
                    <IconButton className="xl:p-3 bg-third" onClick={() => setOpenCDraw(false)}>
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
        </Layout>
    );
};

export default Draw;