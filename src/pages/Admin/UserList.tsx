import React, { useEffect, useState } from "react";

import cellContent from "../../Assets/Icons/cellContent.svg";
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../Services/FirebaseService";
import ApiService from "../../Services/ApiService";
import UserRepository from "../../Repositories/UserRepository";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import HomeButton from "../../components/HomeButton";
import SimpleSelectComponent from "../../components/SimpleSelectComponent";
import { useDispatch, useSelector } from "react-redux";
import User from "../../Models/User";

import deleteIcon from "../../Assets/Icons/deleteIcon.svg";
import editIcon from "../../Assets/Icons/editIcon.svg";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {frFR} from '@mui/material/node/locale';
import TableFooter from "../../components/Admin/TableFooter";
import { Helmet } from "react-helmet-async";
const UserList = () => {
  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, frFR),
    [theme],
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#' },
    {
      field: "firstName", headerName: 'Nom Compleet',
      renderCell: (params: GridRenderCellParams) => <span className="px-3 underline cursor-pointer"
        onClick={() =>
          navigate("/admin/detailProfile", {
            state: { profileData: params.row },
          })
        }>{params.row.firstName + " " + params.row.lastName}</span>
    },
    {
      field: 'email', headerName: 'Email'
    },
    {
      field: 'roles', type: "string[]", headerName: 'Rôle',
      renderCell: (params: GridRenderCellParams) => params.value.toString().slice(5)
    },
    {
      field: '',
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams) =>
        <div className="flex items-center cursor-pointer gap-x-4">
          <span className="flex items-center justify-center" onClick={() =>
            navigate("/admin/editUser", {
              state: {
                user: params.row,
                role: params.row.roles
                  ? params.row.roles[params.row.roles.length - 1].slice(5)
                  : "",
              },
            })
          }
          ><img src={editIcon} alt="Icon Modification du profil " className="xl:h-6 " /></span>
          <span className="flex items-center justify-center cursor-pointer"><img src={deleteIcon} alt="Icon Suppression" className="xl:h-6" /></span>
        </div>
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [clients, setClients] = useState<User[]>();
  const [culomnsDatas, setColumnsDatas] = useState<GridColDef[]>()
  const userSelector = useSelector((state: any) => state.userReducer);
  const [value, setValue] = useState();
  const location = useLocation();
  const [role, setRole] = useState<number>();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role >= 2) {
          if (userSelector.role  === 2) {
            columns.pop()
          }
          setColumnsDatas(columns)
          setRole(userSelector.role);
        } else {
          redirectLogout();
        }
        UserRepository.getAllUsers()
          .then((response) => {
            response = JSON.parse(response);
            setClients(response);
          })
          .catch((err) => {});
      } else {
        redirectLogout();
      }
    }
  }, [user, loadUser]);
  const redirectLogout = () => {
    ApiService.disableAuth();
    dispatch(logout());
    dispatch(removeImageProfile());
    navigate("/admin/login");
  };




  const handleGroup = (value: any) => {
    setValue(value);
  };

  return (
    <Layout>
        <Helmet>
          <title>Thé Tip Top Liste des gagnants - jeu concours - Thé Tip Top </title>
          <meta
            name="description"
            content="Consultez la liste complète des gagnants du concours Thé Tip Top sur Thé-Tip-Top. Découvrez qui a remporté les prix et les récompenses, et célébrez leur succès avec nous !"
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/winningList"
          />
        </Helmet>
      <div className="flex flex-col xl:gap-y-[100px] gap-y-8">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title=" Liste des utilisateurs" color="text-first" />
          {
            role && role === 2 ?
              <div
                className="cursor-pointer"
                onClick={() => navigate("/admin/winningList")}
              >
                <HomeButton
                  bg="bg-first "
                  color="text-white"
                  fontSize=""
                  title="Remettre un gain"
                />
              </div>

              :
              <div
                className="cursor-pointer"
                onClick={() => navigate("/admin/newUser")}
              >
                <HomeButton
                  bg="bg-first "
                  color="text-white"
                  fontSize=""
                  title="Ajouter un utilisateur"
                />
              </div>

          }


        </div>

        <div className="flex flex-col gap-y-[10px]">
          <div className="w-[90%] md:w-1/2 xl:w-1/3">
            <SimpleSelectComponent
              label="Grouper"
              options={[
                { value: 0, label: "Tous" },
                { value: 1, label: "Gain" },
                { value: 2, label: "Status" },
              ]}
              //   value={groupBy}
              callBack={handleGroup}
            />
          </div>
          <div className="w-full">
            {
              clients && culomnsDatas ?
                <div className="overflow-x-auto " style={{ height: 400, width: '100%' }}>
                  <ThemeProvider theme={themeWithLocale}>
                    <DataGrid
                      rows={clients}
                      columns={culomnsDatas}
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
                        pagination: () => <TableFooter />

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
                        <TableCell>Nom</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Action</TableCell>
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
                    </TableBody>
                  </Table>
                </TableContainer>
            }
          </div>

        </div>
      </div>
    </Layout>
  )
};

export default UserList;
