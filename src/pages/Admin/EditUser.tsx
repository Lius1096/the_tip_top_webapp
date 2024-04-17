import React, { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Services/FirebaseService";
import ApiService from "../../Services/ApiService";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import { Skeleton } from "@mui/material";
import InputLabelComponent from "../../components/InputLabelComponent";
import HomeButton from "../../components/HomeButton";
import Admin from "../../Models/Admin";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import SimpleSelectComponent from "../../components/SimpleSelectComponent";
import Client from "../../Models/Client";
import Employee from "../../Models/Employe";
import UserRepository from "../../Repositories/UserRepository";
import CityComponent from "../../components/CityComponent";
import { Helmet } from "react-helmet-async";

const EditUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [admin, setAdmin] = useState<Admin>();
  const [companyName, setCompanyName] = useState("");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [user, loadUser] = useAuthState(auth);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState<any>();
  const [codeEmployee, setCodeEmployee] = useState("");
  const userSelector = useSelector((state: any) => state.userReducer);

  useEffect(() => {
    if (location.state && location.state.user && location.state.role) {
      if (location.state.user.companyName) {
        setCompanyName(location.state.user.companyName);
      } else {
        setCompanyName("Paris");
      }
      setUserData(location.state.user);
      setRole(location.state.role.toLowerCase());
    } else {
      navigate(-1);
    }
  }, [location]);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role) {
          if (userSelector.role === 3) {
            setAdmin(userSelector.profile);
          } else {
            redirectLogout();
          }
        } else {
          redirectLogout();
        }
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

  const handleLastName = (value: any) => {
    setLastName(value);
  };
  const handleGroup = (value: string) => {
    setRole(value);
  };
  const handlePhone = (value: string) => {
    setPhone(value);
  };
  const handFirstName = (value: any) => {
    setFirstName(value);
  };
  const handleCodeEmployee = (value: string) => {
    setCodeEmployee(value);
  };
  const handleCompanyName = (value: any) => {
    setCompanyName(value);
  };

  const renderCity = ["Paris", "Lyon", "Sens"];

  const handleEditUser = () => {
    switch (role) {
      case "client":
        const client = new Client("", lastName, firstName, "", phone);
        UserRepository.putUser(client, userData.id)
          .then((clientResponse) => {
            if (clientResponse) {
              navigate("/admin/user");
            }
          })
          .catch(() => {});
        break;

      case "employee":
        const employee = new Employee(
          "",
          lastName,
          firstName,
          "",
          codeEmployee,
          companyName
        );
        UserRepository.putUser(employee, userData.id)
          .then((employeeResponse) => {
            if (employeeResponse) {
              navigate("/admin/employee_list");
            }
          })
          .catch(() => {});
        break;

      case "admin":
        const admin = new Admin("", lastName, firstName, "");
        UserRepository.putUser(admin, userData.id)
          .then((adminResponse) => {
            if (adminResponse) {
              navigate("/admin/user");
            }
          })
          .catch(() => {});
        break;
      default:
        break;
    }
  };
  const rendertLayout = () => {
    return (
      <Layout>
        <Helmet>
          <title>Thé Tip Top Modifier le profil administrateur</title>
          <meta
            name="description"
            content="Modifiez le profil administrateur : mettez à jour vos informations personnelles."
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/edit"
          />
        </Helmet>

        <div className="flex flex-col gap-y-[10px] bg-white h-full ">
          <div className="flex gap-x-[334px]">
            <Title title="Modifier un utilisateur" color="text-first" />
          </div>
          <div className="grid grid-cols-2 gap-x-[50px] gap-y-[10px] pt-20 items-end">
            <div>
              {userData ? (
                userData.firstName ? (
                  <InputLabelComponent
                    type="text"
                    label="Prénom"
                    placeholder="Ex: John"
                    value={userData.firstName}
                    callBack={handFirstName}
                  />
                ) : (
                  <InputLabelComponent
                    type="text"
                    label="Prénom"
                    placeholder="Ex: John"
                    callBack={handFirstName}
                  />
                )
              ) : (
                <Skeleton
                  variant="text"
                  animation="wave"
                  className="text-2xl"
                />
              )}
            </div>
            <div>
              {userData ? (
                userData.lastName ? (
                  <InputLabelComponent
                    type="text"
                    label="Nom"
                    placeholder="Ex: Doe"
                    value={userData.lastName}
                    callBack={handleLastName}
                  />
                ) : (
                  <InputLabelComponent
                    type="text"
                    label="Nom"
                    placeholder="Ex: Doe"
                    callBack={handleLastName}
                  />
                )
              ) : (
                <Skeleton
                  variant="text"
                  animation="wave"
                  className="text-2xl"
                />
              )}
            </div>
            {userData && role !== "client" ? (
              <div>
                {role ? (
                  <SimpleSelectComponent
                    label="Rôle"
                    options={[
                      { value: 0, label: "employee" },
                      { value: 1, label: "admin" },
                    ]}
                    value={role}
                    callBack={handleGroup}
                  />
                ) : (
                  <SimpleSelectComponent
                    label="Rôle"
                    options={[
                      { value: 0, label: "employee" },
                      { value: 1, label: "admin" },
                    ]}
                    callBack={handleGroup}
                  />
                )}
              </div>
            ) : null}

            {userData && role === "employee" ? (
              <div>
                {userData.employeCode ? (
                  <InputLabelComponent
                    label="Code employee "
                    type="text"
                    value={userData.employeCode}
                    placeholder="XXX XXX XXX XX"
                    callBack={handleCodeEmployee}
                  />
                ) : (
                  <InputLabelComponent
                    label="Code employee "
                    type="text"
                    placeholder="XXX XXX XXX XX"
                    callBack={handleCodeEmployee}
                  />
                )}
              </div>
            ) : null}

            {userData && role === "client" ? (
              <div>
                {userData.phone ? (
                  <InputLabelComponent
                    label="Téléphone "
                    type="phone"
                    placeholder="+33..."
                    value={userData.phone}
                    required
                    callBack={handlePhone}
                  />
                ) : (
                  <InputLabelComponent
                    label="Téléphone "
                    type="phone"
                    placeholder="+33..."
                    required
                    callBack={handlePhone}
                  />
                )}
              </div>
            ) : null}

            {role === "employee" || role === "client" ? (
              <div>
                {userData ? (
                  <div>
                    <CityComponent
                      label="Ville"
                      cities={renderCity}
                      value={userData.companyName}
                      callBack={handleCompanyName}
                    />
                  </div>
                ) : (
                  <div>
                    <CityComponent
                      label="Ville"
                      cities={renderCity}
                      callBack={handleCompanyName}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div>
            <div className="flex justify-between pt-10">
              <div className="" onClick={() => navigate("/admin/user")}>
                <HomeButton
                  bg="bg-white"
                  color="text-first"
                  fontSize="text-base"
                  title="Annuler"
                />
              </div>
              <div className="" onClick={handleEditUser}>
                <HomeButton
                  bg="bg-first"
                  color="text-white"
                  fontSize="text-base"
                  title="Enregistrer"
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  return <>{rendertLayout()}</>;
};

export default EditUser;
