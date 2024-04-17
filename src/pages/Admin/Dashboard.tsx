import React, { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { useNavigate } from "react-router-dom";
import { auth } from "../../Services/FirebaseService";
import Giveaway from "../../Models/Giveaway";
import ApiService from "../../Services/ApiService";
import { Skeleton } from "@mui/material";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import HomeButton from "../../components/HomeButton";
import TicketBox from "../../components/TicketBox";
import TicketCodeRepository from "../../Repositories/TicketCodeRepository";
import GiveawayRepository from "../../Repositories/GiveawayRepository";
import DetailWinBox from "../../components/DetailWinBox";
import config from "../../config";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Helpers from "../../Services/Helpers";
import lotWinner from "../../Assets/Icons/ticketFournis.svg"
import ticketUtiliser from "../../Assets/Icons/lotGagnes.svg"

interface TotalWinGiveaway {
  id: number;
  label: string;
  value: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, loadUser] = useAuthState(auth);
  const [totalWinGiveaways, setTotalWinGiveaways] =
    useState<TotalWinGiveaway[]>();
  const [giveaways, setGiveaways] = useState<Giveaway[]>();
  const [totalWins, setTotalWins] = useState<number>();
  const [totalRecovers, setTotalRecovers] = useState<number>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const [role, setRole] = useState<number>();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.role) {
          setRole(userSelector.role);
        } else {
          ApiService.disableAuth();
          navigate("/admin/login");
        }

        TicketCodeRepository.getWinnersGroupByGiveaway()
          .then((response) => {
            response = JSON.parse(response);
            setTotalWinGiveaways(response);
          })
          .catch((err) => {});
        TicketCodeRepository.getWinTicketCodes()
          .then((response) => {
            response = JSON.parse(response);
            setTotalWins(response.length);
          })
          .catch((err) => {});
        TicketCodeRepository.getRecoveredTicketCodes()
          .then((response) => {
            response = JSON.parse(response);
            setTotalRecovers(response.length);
          })
          .catch((err) => {});
        GiveawayRepository.getAllGiveaways()
          .then((response) => {
            response = JSON.parse(response);
            setGiveaways(response);
          })
          .catch((err) => {});
      } else {
        ApiService.disableAuth();
        navigate("/admin/login");
      }
    }
  }, [user, loadUser]);
  const renderGiveawayList = () => {
    if (giveaways) {
      return giveaways.map((giveaway) => {
        if (totalWinGiveaways && totalWinGiveaways.length > 0) {
          for (let index = 0; index < totalWinGiveaways.length; index++) {
            const totalWinGiveaway = totalWinGiveaways[index];
            if (giveaway.id === totalWinGiveaway.id) {
              return (
                <DetailWinBox
                  icon={config.giveAwayIcons[Helpers.getGiveawayIcon(giveaway.label!)]}
                  label={totalWinGiveaway.label}
                  total={totalWinGiveaway.value}
                />
              );
            }
          }
        }
        return (
          <DetailWinBox
            icon={config.giveAwayIcons[Helpers.getGiveawayIcon(giveaway.label!)]}
            label={giveaway.label!}
            total={0}
          />
        );
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
          content="Vue d'ensemble des lots gagnés par l'utilisateur : gains, retraits et détails."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/dashboard"
        />
      </Helmet>

      <div className="flex flex-col gap-y-8 2xl:px-[100px]">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title="Tableau de board" color="text-first" />
          {role && role === 3 ? (
            <div onClick={() => navigate("/admin/newUser")}>
              <HomeButton
                bg="bg-first "
                color="text-white"
                fontSize=""
                title="Ajouter un utilisateur"
              />
            </div>
          ) : (
            <div onClick={() => navigate("/admin/winningList")}>
              <HomeButton
                bg="bg-first "
                color="text-white"
                fontSize=""
                title="Remettre un gain"
              />
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 xl:gap-x-[50px] gap-y-4 gap-x-10">
          {totalWins === undefined ? (
            <div>
              <Skeleton
                sx={{ bgcolor: "grey.700" }}
                variant="rectangular"
                className="rounded-2xl h-[150px]"
              />
            </div>
          ) : (
            <TicketBox
              icon={lotWinner}
              index={totalWins}
              text="Lots gagnés"
            />
          )}
          {totalRecovers === undefined ? (
            <div>
              <Skeleton
                sx={{ bgcolor: "grey.700" }}
                variant="rectangular"
                className="rounded-2xl h-[150px]"
              />
            </div>
          ) : (
            <TicketBox
              icon={ticketUtiliser}
              index={totalRecovers}
              text="Lots rétirés"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-4 xl:rounded-xl bg-rgba(193, 150, 99, 0.70) 2xl:px-[100px]">
        <div className="flex flex-col">
          <h3 className="font-bold xl:text-xl text-first">
            Détails de tous les gains
          </h3>
          <span className="text-xs text-gray-700">Groupés</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-2">
          {renderGiveawayList()}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
