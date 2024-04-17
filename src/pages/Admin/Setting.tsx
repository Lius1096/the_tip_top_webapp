import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import HomeButton from "../../components/HomeButton";

import { IconButton, Skeleton } from "@mui/material";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../Services/FirebaseService";
import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Reducer/UserReducer";
import SettingsGameRepository from "../../Repositories/SettingsGameRepository";
import ApiErrorInterface from "../../Models/Interface/ApiErrorInterface";
import DatePickerComponent from "../../components/DatePickerComponent";
import { Moment } from "moment";
import Game from "../../Models/Game";
import InputLabelComponent from "../../components/InputLabelComponent";
import moment from "moment";
import { startLoading, stopLoading } from "../../Redux/Reducer/LoadingReducer";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, loadUser] = useAuthState(auth);
  const [startDate, setStartDate] = useState<Moment | undefined>();
  const [endDate, setEndDate] = useState<Moment | undefined>();
  const [editEndDate, setEditEndDate] = useState(false);
  const [editTicketsNumber, setEditTicketsNumber] = useState(false);
  const [ticketsCode, setTicketsCode] = useState<number>()
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game>();
  const [error, setError] = useState<ApiErrorInterface>();

  const userSelector = useSelector((state: any) => state.userReducer);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role === 3) {
          SettingsGameRepository.getCurrentGame()
            .then((responseGame) => {
              setGame(JSON.parse(responseGame));
              setEndDate(moment(JSON.parse(responseGame).endDate))
              setLoading(false);
              
            })
            .catch((err) => {
              setError(err.data);
              setLoading(false);
            });
        } else {
          redirectLogout();
        }
      } else {
        redirectLogout();
      }
    }
  }, [user, loadUser]);

  useEffect(() => {
    if (loading) {
      // dispatchstartLoading())
    }else{
      // dispatchstopLoading())
    }
  }, [loading]);

  const redirectLogout = () => {
    ApiService.disableAuth();
    // dispatchlogout());
    navigate("/admin/login");
  };
  const handleStartDateChange = (date: Moment) => {
    setStartDate(date);
    setEndDate(date)
  };

  const validate = () => {
    if (startDate && startDate.isValid()) {
      setErrorMessage(false);
      return true;
    }
    setErrorMessage(true);
    return false;
  };

  const handleStartGame = () => {
    if (validate()) {
      setLoading(true)
      SettingsGameRepository.startGame(startDate?.format("YYYY-MM-DD")!)
        .then((response) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false)
        });
    }
  };
  const handleEditGame = () => {
    if (!errorMessage) {
      setLoading(true)
      const newGame = new Game()
          newGame.endDate = endDate?.format("YYYY-MM-DD")
          newGame.tiketsCode = ticketsCode
      SettingsGameRepository.editGame(game?.id!, newGame).then((response: any) => {
        setGame(JSON.parse(response))
        setLoading(false)
        toast.success(
          "Enrégistré !"  
        )
      }).catch((err) => {
        setLoading(false)
      })
    }else{

    }
  }
  const handleTicketsCode = (tickets: string) => {
    if (parseInt(tickets) < game?.tiketsCode!) {
      setErrorMessage(true)
    setTicketsCode(game?.tiketsCode)
    }else{
      setErrorMessage(false)
      setTicketsCode(parseInt(tickets))
    }
  }

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="flex flex-col gap-y-10">
          <Skeleton
            variant="rounded"
            animation="wave"
            className="rounded-[10px] h-9 w-40"
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            className="rounded-[10px] h-9 w-40"
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            className="rounded-[10px] h-9 w-40"
          />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col gap-y-10">
          <h2 className="text-third"> {error.message} </h2>
          <div className="flex flex-col gap-y-9 w-max">
            <div className="">
              <p className={`${errorMessage ? "block text-third" : "hidden"}`}>
                La date de début est requise.
              </p>
              <DatePickerComponent
                defautValue={startDate}
                message="Date de début"
                callBack={handleStartDateChange}
              />
            </div>
            <div className="w-1/2" onClick={handleStartGame}>
              <HomeButton
                bg="bg-first"
                color="text-white"
                fontSize=""
                title="Lancer un jeu concours"
              />
            </div>
          </div>
        </div>
      );
    }
    if (game) {
      return (
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-9 w-max">
            <div className="">
            <div className="flex items-end gap-x-4">
            <DatePickerComponent
                defautValue={game.endDate}
                message="Date de fin"
                readOnly={!editEndDate}
                callBack={handleStartDateChange}
                minDate={game.startDate}
              />
                {
                editEndDate ? null 
                : 
                <IconButton className="px-2 text-first h-max w-max" onClick={() => setEditEndDate(true)}>
                  <svg
                    width="15"
                    height="25"
                    viewBox="0 0 18 25"
                    fill="none"
                    xmlns="
  http://www.w3.org/2000/svg
  "
                  >
                    <path
                      d="M6.52775 21.0989L1.6958 23.941L2.023 18.3443L12.1358 1.79014C12.1886 1.70465 12.2729 1.64348 12.3706 1.61996C12.4682 1.59644 12.5712 1.61248 12.6571 1.66459L16.515 4.02349C16.6005 4.07621 16.6617 4.16059 16.6852 4.25824C16.7087 4.35588 16.6927 4.45887 16.6406 4.54473L6.52775 21.0989Z"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10.5229 4.42773L15.0277 7.18232"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.01172 18.3438L6.51646 21.0983"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </IconButton>
              }
            </div>
            </div>

            <div className="flex items-end gap-x-4">
              <div>
              <p className={`${errorMessage ? "block text-third" : "hidden"}`}>
              Le nombre de tickets ne doit pas être inferieur à {game.tiketsCode}
            </p>
                <InputLabelComponent
                  type="number"
                  value={game.tiketsCode}
                  label="Nombre de tickets"
                  min={game.tiketsCode}
                  step={500}
                  readOnly={!editTicketsNumber}
                  callBack={handleTicketsCode}
                />
              </div>
              {
                editTicketsNumber ? null 
                : 
                <IconButton className="px-2 text-first h-max w-max" onClick={() => setEditTicketsNumber(true)}>
                  <svg
                    width="15"
                    height="25"
                    viewBox="0 0 18 25"
                    fill="none"
                    xmlns="
  http://www.w3.org/2000/svg
  "
                  >
                    <path
                      d="M6.52775 21.0989L1.6958 23.941L2.023 18.3443L12.1358 1.79014C12.1886 1.70465 12.2729 1.64348 12.3706 1.61996C12.4682 1.59644 12.5712 1.61248 12.6571 1.66459L16.515 4.02349C16.6005 4.07621 16.6617 4.16059 16.6852 4.25824C16.7087 4.35588 16.6927 4.45887 16.6406 4.54473L6.52775 21.0989Z"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10.5229 4.42773L15.0277 7.18232"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.01172 18.3438L6.51646 21.0983"
                      stroke="#58694B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </IconButton>
              }
            </div>
            <div className="w-1/2" onClick={handleEditGame}>
              <HomeButton
                bg="bg-first"
                color="text-white"
                fontSize=""
                title="Enregistrer"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Layout>
        <Helmet>
          <title>Thé Tip Top Paramètre du jeu concours </title>
          <meta
            name="description"
            content="Accédez à la page des paramètres pour personnaliser vos préférences et configurations . Gérez vos informations de compte, les notifications, "
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/settings"
          />
        </Helmet>
      <div className="flex flex-col w-full h-full px-4 mx-auto bg-white xl:gap-y-10 gap-y-8 lg:gap-y-2 md:px-8 xl:w-2/3">
        <div className="flex justify-between">
          <Title title="Paramètre du jeu concours" color="text-first" />
        </div>
        {renderScreen()}
        
      </div>
    </Layout>
  );
};

export default Setting;
