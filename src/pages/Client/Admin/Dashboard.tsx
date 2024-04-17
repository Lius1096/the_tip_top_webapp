import React, { useEffect, useState } from "react";
import Layout from "../../../components/Admin/Layout";
import HomeButton from "../../../components/HomeButton";
import TicketBox from "../../../components/TicketBox";
import DetailWinBox from "../../../components/DetailWinBox";
import { Helmet } from "react-helmet-async";
import Title from "../../../components/Title";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import TicketCode from "../../../Models/TicketCode";
import ApiService from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../Services/FirebaseService";
import TicketCodeRepository from "../../../Repositories/TicketCodeRepository";
import Giveaway from "../../../Models/Giveaway";
import GiveawayRepository from "../../../Repositories/GiveawayRepository";
import lotWinner from "../../../Assets/Icons/ticketFournis.svg"
import ticketUtiliser from "../../../Assets/Icons/lotGagnes.svg"
import config from "../../../config";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import Helpers from "../../../Services/Helpers";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, loadUser] = useAuthState(auth);
  const [ticketCodes, setTicketCodes] = useState<TicketCode[]>();
  const [giveaways, setGiveaways] = useState<Giveaway[]>();
  const userSelector = useSelector((state: any) => state.userReducer);

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {

        if (userSelector.profile) {
        } else {
          ApiService.disableAuth();
          navigate("/admin/login");
        }

        TicketCodeRepository.getCurrentClientTicketCodes()
          .then((response) => {
            response = JSON.parse(response);

            setTicketCodes(response);
          })
          .catch((err) => { });
        GiveawayRepository.getAllGiveaways()
          .then((response) => {
            response = JSON.parse(response);

            setGiveaways(response);
          })
          .catch((err) => { });
      } else {
        ApiService.disableAuth();
        navigate("/client/login");
      }
    }
  }, [user, loadUser]);

  const renderGiveawayList = () => {
    if (giveaways) {
      return giveaways.map((giveaway) => {
        if (ticketCodes) {
          return (
            <DetailWinBox
              key={giveaway.id!}
              icon={config.giveAwayIcons[Helpers.getGiveawayIcon(giveaway.label!)]}
              label={giveaway.label!}
              total={
                ticketCodes?.filter(
                  (ticketCode) => ticketCode.giveaway?.id === giveaway.id
                ).length
              }
            />
          );
        }
        <DetailWinBox
          key={giveaway.id!}
          icon={config.giveAwayIcons[Helpers.getGiveawayIcon(giveaway.label!)]}
          label={giveaway.label!}
          total={0}
        />;
      });
    } else {
      return (
        <>
          <div>
            <Skeleton
              sx={{ bgcolor: "grey.700" }}
              variant="rectangular"
              className="rounded-2xl h-[150px]"
            />
          </div>
          <div>
            <Skeleton
              sx={{ bgcolor: "grey.700" }}
              variant="rectangular"
              className="rounded-2xl h-[150px]"
            />
          </div>
          <div>
            <Skeleton
              sx={{ bgcolor: "grey.700" }}
              variant="rectangular"
              className="rounded-2xl h-[150px]"
            />
          </div>
          <div>
            <Skeleton
              sx={{ bgcolor: "grey.700" }}
              variant="rectangular"
              className="rounded-2xl h-[150px]"
            />
          </div>
          <div>
            <Skeleton
              sx={{ bgcolor: "grey.700" }}
              variant="rectangular"
              className="rounded-2xl h-[150px]"
            />
          </div>
        </>
      );
    }
  };
  return (
    <Layout>
        <Helmet>
        <title>Thé Tip Top Tableau de bord - Lots gagnés</title>
        <meta
          name="description"
          content="Résumé des lots gagnés par l'utilisateur : gains, retraits et détails."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/dashboard"
        />
      </Helmet>
      <div className="flex flex-col gap-y-8 2xl:px-[100px]">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title="   Tableau de board" color="text-first" />
          <div onClick={() => navigate("/client/gift")}>
            <HomeButton
              bg="bg-first "
              color="text-white"
              fontSize=""
              title="Prendre une tasse"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:gap-x-[50px] gap-y-4 gap-x-10">
          <TicketBox
            icon={lotWinner}
            index={ticketCodes ? ticketCodes.length : 0}
            text="Lots gagnés"
          />
          <TicketBox
            icon={ticketUtiliser}
            index={
              ticketCodes
                ? ticketCodes!.filter((ticket) => ticket.isRecovered).length
                : 0
            }
            text="Lots rétirés"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 xl:rounded-xl bg-rgba(193, 150, 99, 0.70) 2xl:px-[100px]">
        <div className="flex flex-col">
          <h3 className="font-bold xl:text-xl text-first">Détails de tous les gains</h3>
          <span className="text-xs text-gray-700">Groupés</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-2">
          {renderGiveawayList()}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
