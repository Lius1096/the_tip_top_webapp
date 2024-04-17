import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, styled, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';

import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../Services/FirebaseService";
import TicketCode from "../../Models/TicketCode";
import ApiService from "../../Services/ApiService";
import TicketCodeRepository from "../../Repositories/TicketCodeRepository";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import HomeButton from "../../components/HomeButton";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import { logout } from "../../Redux/Reducer/UserReducer";
import SearchBtn from "../../components/searchBtn";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableFooter from "../../components/Admin/TableFooter";
import {frFR} from '@mui/material/node/locale';
import QrCodeReader from "../../components/QrCodeReader";
import config from "../../config";
import toast from "react-hot-toast";
import { startLoading, stopLoading } from "../../Redux/Reducer/LoadingReducer";
import { Helmet } from "react-helmet-async";
import Helpers from "../../Services/Helpers";

const WinningList = () => {
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, frFR),
    [theme],
  );

  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));



  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#' },
    {
      field: 'client', headerName: 'Gagnant',
      renderCell: (params: GridRenderCellParams) => <span className="px-3 underline cursor-pointer"
        onClick={() =>
          navigate("/admin/detailProfile", {
            state: { profileData: params.value },
          })
        }>{params.value.firstName}</span>
    },
    {
      field: 'giveaway', headerName: 'Gain',
      renderCell: (params: GridRenderCellParams) => params.value.label
    },
    { field: 'label', headerName: 'Code de participation' },
    {
      field: 'isRecovered',
      headerName: 'status',
      renderCell: (params: GridRenderCellParams) => params.value ?
        <span className="line-through text-third">Déjà remis</span> :
        <span className="font-semibold underline cursor-pointer text-first" onClick={() => openDial(params.row)}>Remettre</span>
    },
  ];
  const [user, loadUser] = useAuthState(auth);
  const [ticketCodes, setTicketCodes] = useState<TicketCode[]>();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTickets, setDisplayedTickets] = useState<TicketCode[]>();
  const [seachrTikectCodes, setSeachrTicketCodes] = useState<TicketCode[]>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const [refresh, setRefresh] = useState(true);
  const [searchValue, setSearchValue] = useState<string>();
  const [openQrCode, setOpenQrCode] = useState(false);
  const [loading, setloading] = useState(false);
  const [ticketCode, setTicketCode] = useState<TicketCode>()

  useEffect(() => {
    if (displayedTickets) {
      let searchFound: TicketCode[] = [];
      if (searchValue && searchValue.split(" ").length > 0) {
        if (searchValue.length === 10) {
          searchFound = displayedTickets.filter(
            (ticketCode) => ticketCode.label === searchValue.toLocaleUpperCase()
          );
        } else {
          searchFound = displayedTickets.filter((ticketCode) => {
            if (ticketCode.client) {
              const fullName = ticketCode.client.firstName.toLocaleLowerCase() + ticketCode.client.lastName.toLocaleLowerCase()

              if (fullName.search(searchValue.replace(/\s/g, "").toLocaleLowerCase()) > - 1) {
                return ticketCode;
              }
            }
          });
        }
      } else {
        searchFound = displayedTickets;
      }

      setSeachrTicketCodes(searchFound);
    }
  }, [searchValue]);

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (refresh) {
          if (userSelector.role && userSelector.role >= 2) {
          } else {
            redirectLogout()
          }
          TicketCodeRepository.getWinTicketCodes()
            .then((response) => {
              response = JSON.parse(response);
              setTicketCodes(response);
              setSeachrTicketCodes(response);
              setRefresh(false)
            })
            .catch((err) => {
              setRefresh(false)
            })
        }
      } else {
        redirectLogout()
      }
    }
  }, [user, loadUser, refresh]);

  useEffect(() => {
    if (loading) {
      dispatch(startLoading())
    }else{
      dispatch(stopLoading())
    }
  }, [loading]);

  const redirectLogout = () => {
    ApiService.disableAuth();
    dispatch(logout())
    dispatch(removeImageProfile())
    navigate("/admin/login")
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.replace(/\s/g, "") === "") {
      setSeachrTicketCodes(ticketCodes)
    }

  };

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>Aucune donnée</Box>
      </StyledGridOverlay>
    );
  }

  const getScannerResult = (value: TicketCode) => {
    setTicketCode(value);
  }
  const openDial = (value: TicketCode) => {
    setTicketCode(value)
    setOpenQrCode(true)
  }
  const recoveredTikecCode = () => {
    
    if (ticketCode && ticketCode.client) {
      setloading(true)
      TicketCodeRepository.recoveredTicketCode(ticketCode.label!, ticketCode.client.id!).then(() => {
        setRefresh(true)
        setOpenQrCode(false)
        setloading(false)
       toast.success(
          "La remise a été réalisée avec succès."
          
        )
      }).catch((err) => {
        toast.error(err.data[0].message)
      })
    }
  }
  useEffect(() => {
    if (!openQrCode) {
      setTicketCode(undefined)
    }
  }, [openQrCode])
  return (
    <Layout>
        <Helmet>
          <title>Thé Tip Top Liste des utilisateurs - Gestion des utilisateurs </title>
          <meta
            name="description"
            content="Découvrez la liste complète des utilisateurs enregistrés sur le site. Gérez facilement les comptes des utilisateurs avec notre interface conviviale de gestion des utilisateurs"
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/user"
          />
        </Helmet>
      <div className="flex flex-col xl:gap-y-[100px] gap-y-8">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title="Liste des gagnants" color="text-first " />
          <div
            className="cursor-pointer"
            onClick={() => setOpenQrCode(true)}
          >
            <HomeButton
              bg="bg-first "
              color="text-white"
              fontSize=""
              title="Scanner"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-[10px]">
          <div className="w-[90%] md:w-1/2 xl:w-1/3">
            {/* <SearchBtn
              placeholder="Entrez votre recherche..."
              handleSearch={handleSearch}
              value={searchValue}
            /> */}

          </div>
          <div className="w-full">
            {
              seachrTikectCodes ?
                <div className="overflow-x-auto " style={{ height: 400, width: '100%' }}>
                  <ThemeProvider theme={themeWithLocale}>
                    <DataGrid
                      rows={seachrTikectCodes}
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
                          width: "100%"
                        },
                        "& .MuiDataGrid-virtualScrollerRenderZone": {
                          width: "100%"
                        },
                        "& .MuiDataGrid-row": {
                          width: "100%"
                        },
                        "& .MuiDataGrid-columnHeadersInner": {
                          width: "100%"
                        },
                        "& .MuiDataGrid-columnHeadersInner > div": {
                          width: "100%"
                        },
                        "& .MuiDataGrid-withBorderColor": {
                          width: "100% !important",
                          maxWidth: "100% !important",
                        },
                        "& .MuiDataGrid-cell:last-of-type": {
                          display: "none"
                        },
                        "& .MuiDataGrid-footerContainer": {
                          justifyContent: "space-between"
                        },
                        "& .MuiTablePagination-root": {
                          width: "100%"
                        },
                        "& .MuiToolbar-root": {
                          width: "100%"
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          textOverflow: "unset"
                        },

                      }}
                      slots={{
                        pagination: () => <TableFooter />,
                        noRowsOverlay: CustomNoRowsOverlay,

                      }}
                      slotProps={{
                        footer: {},
                      }}
                    />
                  </ThemeProvider>
                </div>
                :
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell><input type="checkbox" name="" id="" /></TableCell>
                        <TableCell>#</TableCell>
                        <TableCell>Gagnant</TableCell>
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
            }
          </div>
        </div>
        <Dialog
          open={loading ? false : openQrCode }
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
            <IconButton className="xl:p-3 bg-third" onClick={() => setOpenQrCode(false)}>
              <svg width="15" height="15" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.65225 45.943C1.00425 46.295 1.46425 46.47 1.92425 46.47C2.38425 46.47 2.84525 46.294 3.19625 45.943L23.2333 25.911L43.2713 45.943C43.6233 46.295 44.0832 46.47 44.5442 46.47C45.0042 46.47 45.4652 46.294 45.8162 45.943C46.5192 45.24 46.5192 44.1 45.8162 43.398L25.7812 23.367L45.8182 3.33497C46.5212 2.63297 46.5212 1.49197 45.8182 0.788969C45.1152 0.0859687 43.9753 0.0859687 43.2723 0.788969L23.2343 20.821L3.19725 0.788969C2.49425 0.0859687 1.35525 0.0859687 0.65225 0.788969C-0.05075 1.49197 -0.05075 2.63297 0.65225 3.33497L20.6892 23.367L0.65225 43.398C-0.05075 44.101 -0.05075 45.24 0.65225 45.943Z" fill="#fff" />
              </svg>
            </IconButton>
          </div>
          <div className="flex flex-col items-center">

            <DialogTitle id="alert-dialog-title" className="text-lg font-extrabold text-first md:text-xl xl:text-2xl">
              Remettre un bien
            </DialogTitle>
            {ticketCode ? <h3 className="text-sm font-semibold text-center md:text-base xl:text-lg text-first">Détails du bien</h3> : <h3 className="text-sm text-center md:text-base xl:text-lg">Merci de scanner le code qr du client</h3>}
          </div>
          <DialogContent>
            {ticketCode && ticketCode.giveaway && ticketCode.client ?
              <div className="flex flex-col items-center py-8 gap-y-8">
                 <img className="w-1/3" src={config.giveAwayIcons[Helpers.getGiveawayIcon(ticketCode.giveaway.label!)]} alt="Remise du cadeau" />
                <div className="flex flex-col">
                  <p className="text-base xl:text-lg text-first">Gain: <span className="font-bold text-first">{ticketCode.giveaway.label}</span></p>
                  <p className="text-base xl:text-lg text-first">Gagnant: <span className="font-bold text-first">{ticketCode.client.firstName + " " + ticketCode.client.lastName}</span> </p>
                  <p className="text-base xl:text-lg text-first">Code ticket: <span className="font-bold text-first"> {ticketCode.label}</span></p>
                </div>
              </div>
              :
              <QrCodeReader callBack={getScannerResult} />
            }
            {
              ticketCode ?
                <DialogActions className="justify-between md:w-[40%] lg:w-1/2 mx-auto">
                  <Button className="text-xs text-third border-third md:text-sm xl:text-base" variant="outlined" onClick={()=> setOpenQrCode(false)} >Annuler</Button>
                  <Button className="text-xs bg-first md:text-sm xl:text-base" variant="contained" onClick={recoveredTikecCode}>
                    Confirmer
                  </Button>
                </DialogActions> : null
            }
          </DialogContent>

          <div className="absolute left-0 w-full bottom-3">
            <p className="text-[10px] text-center text-third xl:text-sm">NB: Vous êtes responsable de la remise de ce bien !</p>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WinningList;
