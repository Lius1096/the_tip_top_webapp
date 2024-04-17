import React, { useEffect, useState } from "react";
import HomeButton from "../../../components/HomeButton";
import Layout from "../../../components/Admin/Layout";
import Title from "../../../components/Title";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../../Services/FirebaseService";
import ApiService from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import TicketCode from "../../../Models/TicketCode";
import { Helmet } from "react-helmet-async";

import TicketCodeRepository from "../../../Repositories/TicketCodeRepository";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material";
import SimpleSelectComponent from "../../../components/SimpleSelectComponent";
import { useSelector } from "react-redux";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableFooter from "../../../components/Admin/TableFooter";
import * as locales from "@mui/material/locale";
import ClientQrCode from "../../../components/Admin/ClientQrCode";
import { frFR } from "@mui/material/node/locale";

const WinningHistory = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "#" },
    {
      field: "giveaway",
      headerName: "Nom du lot",
      renderCell: (params: GridRenderCellParams) => params.value.label,
    },
    { field: "label", headerName: "Code de participation" },
    {
      field: "isRecovered",
      headerName: "status",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <span className="line-through text-third">Déjà remis</span>
        ) : (
          <span
            className="font-semibold underline cursor-pointer text-first "
            onClick={() => showQrCode(params.row)}
          >
            Retirer
          </span>
        ),
    },
  ];

  const navigate = useNavigate();
  const [user, loadUser] = useAuthState(auth);
  const [ticketCodes, setTicketCodes] = useState<TicketCode[]>();
  const [groupBy, setGroupBy] = useState("Tous");
  const userSelector = useSelector((state: any) => state.userReducer);
  const [openQrCode, setOpenQrCode] = useState(false);
  const [qrCOdeInfo, setQrCodeInfo] = useState<TicketCode>();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile) {
        } else {
          ApiService.disableAuth();
          navigate("/admin/login");
        }
        (async () => {
          TicketCodeRepository.getCurrentClientTicketCodes()
            .then((response) => {
              response = JSON.parse(response);
              if (response.length > 0) {
                setTicketCodes(response);
              } else {
                navigate("/client/gift");
              }
            })
            .catch((err) => {});
        })();
      } else {
        ApiService.disableAuth();
        navigate("/client/login");
      }
    }
  }, [user, loadUser]);
  useEffect(() => {
    if (ticketCodes) {
      const groupedKeys = ticketCodes.reduce(
        (group: { [key: string]: TicketCode[] }, ticketCode) => {
          if (!group[ticketCode.giveaway?.label!]) {
            group[ticketCode.giveaway?.label!] = [];
          }
          group[ticketCode.giveaway?.label!].push(ticketCode);
          return group;
        },
        {}
      );
    }
  }, [groupBy, ticketCodes]);

  const showQrCode = (value: TicketCode) => {
    setOpenQrCode(true);
    setQrCodeInfo(value);
  };

  const handleGroup = (value: string) => {
    setGroupBy(value);
  };

  const theme = useTheme();
    const themeWithLocale = React.useMemo(
        () => createTheme(theme, frFR),
        [theme],
    );


  return (
    <Layout>
      <Helmet>
        <title>Thé Tip Top Historique de vos gains</title>
        <meta
          name="description"
          content="Cette page affiche un historique détaillé de tous les lots que vous avez gagnés dans le cadre du jeu concours. Vous pouvez visualiser les informations relatives à chaque."
        />
        <link
          rel="canonical"
          href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/client/giveaway"
        />
      </Helmet>
      <div className="flex flex-col xl:gap-y-[100px] gap-y-8">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title="Historique de vos gains" color="text-first" />
          <div onClick={() => navigate("/client/gift")}>
            <HomeButton
              bg="bg-first "
              color="text-white"
              fontSize=""
              title="Prendre une tasse"
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-4 lg:gap-y-8">
          <div className="lg:w-[250px] w-[150px]">
            <SimpleSelectComponent
              label="Grouper"
              options={[
                { value: 0, label: "Tous" },
                { value: 1, label: "Gain" },
                { value: 2, label: "Status" },
              ]}
              value={groupBy}
              callBack={handleGroup}
            />
          </div>
          <div className="w-full">
            {ticketCodes ? (
              <div className="overflow-x-auto ">
                <ThemeProvider theme={themeWithLocale}>
                  <DataGrid
                    rows={ticketCodes}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{
                      "& .MuiDataGrid-columnHeaders": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-virtualScrollerRenderZone": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-row": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-columnHeadersInner": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-columnHeadersInner > div": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-withBorderColor": {
                        width: "100% !important",
                        maxWidth: "100% !important",
                      },
                      "& .MuiDataGrid-cell:last-of-type": {
                        display: "none",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        justifyContent: "space-between",
                      },
                      "& .MuiTablePagination-root": {
                        width: "100%",
                      },
                      "& .MuiToolbar-root": {
                        width: "100%",
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        textOverflow: "unset",
                      },
                    }}
                    slots={{
                      pagination: () => <TableFooter />,
                    }}
                    slotProps={{
                      footer: {},
                    }}
                  />
                </ThemeProvider>
              </div>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <input type="checkbox" name="" id="" />
                      </TableCell>
                      <TableCell>#</TableCell>
                      <TableCell>Nom du lot</TableCell>
                      <TableCell>Code de participation</TableCell>
                      <TableCell>status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          sx={{ bgcolor: "grey.700" }}
                          variant="text"
                          className="text-5xl"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
      {qrCOdeInfo ? (
        <Dialog
          open={openQrCode}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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
                padding: "40px",
              },
              maxWidth: "unset",
            },
          }}
        >
          <div className="flex justify-end pt-2 pr-2 right-3 top-3 lg:absolute lg:p-0">
            <IconButton
              className="xl:p-3 bg-third"
              onClick={() => setOpenQrCode(false)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 47 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.65225 45.943C1.00425 46.295 1.46425 46.47 1.92425 46.47C2.38425 46.47 2.84525 46.294 3.19625 45.943L23.2333 25.911L43.2713 45.943C43.6233 46.295 44.0832 46.47 44.5442 46.47C45.0042 46.47 45.4652 46.294 45.8162 45.943C46.5192 45.24 46.5192 44.1 45.8162 43.398L25.7812 23.367L45.8182 3.33497C46.5212 2.63297 46.5212 1.49197 45.8182 0.788969C45.1152 0.0859687 43.9753 0.0859687 43.2723 0.788969L23.2343 20.821L3.19725 0.788969C2.49425 0.0859687 1.35525 0.0859687 0.65225 0.788969C-0.05075 1.49197 -0.05075 2.63297 0.65225 3.33497L20.6892 23.367L0.65225 43.398C-0.05075 44.101 -0.05075 45.24 0.65225 45.943Z"
                  fill="#fff"
                />
              </svg>
            </IconButton>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <DialogTitle
              id="alert-dialog-title"
              className="text-lg font-extrabold text-first md:text-xl xl:text-2xl"
            >
              🎉 Votre Code QR Gagnant ! 🎉
            </DialogTitle>
            <h3 className="text-sm text-center md:text-base xl:text-lg">
              Présentez ce code QR à la caisse pour récupérer votre prix ! 🏆
            </h3>
          </div>
          <DialogContent>
            <div className="flex justify-center py-10">
              <ClientQrCode ticketCode={qrCOdeInfo} />
            </div>
          </DialogContent>
          <div className="absolute left-0 w-full bottom-3">
            <p className="text-[10px] text-center text-third xl:text-sm">
              NB: Veuillez partager ce code QR uniquement avec un agent du
              magasin !
            </p>
          </div>
        </Dialog>
      ) : null}
    </Layout>
  );
};

export default WinningHistory;
