import React, { useEffect, useState } from "react";

import cellContent from "../../Assets/Icons/cellContent.svg";
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { auth } from "../../Services/FirebaseService";
import ApiService from "../../Services/ApiService";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import HomeButton from "../../components/HomeButton";
import SimpleSelectComponent from "../../components/SimpleSelectComponent";
import { useDispatch, useSelector } from "react-redux";

import deleteIcon from "../../Assets/Icons/deleteIcon.svg";
import editIcon from "../../Assets/Icons/editIcon.svg";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import Employee from "../../Models/Employe";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableFooter from "../../components/Admin/TableFooter";
import {frFR} from '@mui/material/node/locale';
import EmployeeRepository from "../../Repositories/EmployeRepository";
import { Helmet } from "react-helmet-async";

const EmployeeList = () => {

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
      field: 'companyName' , headerName: 'Boutique'
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
          ><img src={editIcon} alt="Icon Modification du profil" className="xl:h-6 " /></span>
          <span className="flex items-center justify-center cursor-pointer"><img src={deleteIcon} alt="Icon Suppression du profil" className="xl:h-6" /></span>
        </div>
    },
  ];

  const theme = useTheme();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, frFR),
    [theme],
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [employees, setEmployees] = useState<Employee[]>();
  const userSelector = useSelector((state: any) => state.userReducer);
  const [value, setValue] = useState();
  const location = useLocation();
  const [role, setRole] = useState<number>();

  useEffect(() => {
    if (loadUser) {
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role >= 2) {
          setRole(userSelector.role);
        } else {
          redirectLogout();
        }
        EmployeeRepository.getAllEmployees().then((response) => {
            response = JSON.parse(response)
            setEmployees(response)
          })
          .catch((err) => { });
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
          <title>Thé Tip Top Employés du site - Gestion de l'équipe sur Thé Tip Top</title>
          <meta
            name="description"
            content="Consultez la liste des employés et membres de l'équipe travaillant sur Thé Tip Top. Accédez aux profils des membres, leurs rôles, leurs informations de contact"
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/settings"
          />
        </Helmet>
      <div className="flex flex-col xl:gap-y-[100px] gap-y-8">
        <div className="flex flex-col justify-between md:flex-row gap-y-4">
          <Title title=" Liste des employés" color="text-first" />
          {role && role === 2 ? (
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
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => navigate("/admin/newUser")}
            >
              <HomeButton
                bg="bg-first "
                color="text-white"
                fontSize=""
                title="Ajouter un employé"
              />
            </div>
          )}
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
              callBack={handleGroup}
            />
          </div>
          <div className="w-full">
            {
              employees ?
                <div className="overflow-x-auto " style={{ height: 400, width: '100%' }}>
                  <ThemeProvider theme={themeWithLocale}>
                    <DataGrid
                      rows={employees}
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
  );
};

export default EmployeeList;
