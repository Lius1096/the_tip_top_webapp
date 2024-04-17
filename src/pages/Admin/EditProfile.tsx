import { Moment } from "moment";
import React, { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import { useNavigate } from "react-router-dom";
import { auth } from "../../Services/FirebaseService";
import AdminRepository from "../../Repositories/AdminRepository";
import ApiService from "../../Services/ApiService";
import ImageRepository from "../../Repositories/ImageRepository";
import config from "../../config";
import Helpers from "../../Services/Helpers";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import ProfileComponent from "../../components/ProfileComponent";
import { Skeleton } from "@mui/material";
import InputLabelComponent from "../../components/InputLabelComponent";
import HomeButton from "../../components/HomeButton";
import { Helmet } from "react-helmet-async";
import Admin from "../../Models/Admin";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../Redux/Reducer/UserReducer";
import {
  removeImageProfile,
  setImageProfile,
} from "../../Redux/Reducer/ImageProfileReducer";
import Employee from "../../Models/Employe";
import EmployeeRepository from "../../Repositories/EmployeRepository";

const EditAdminProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [errorMessage, setErrorImage] = useState("");
  const [admin, setAdmin] = useState<Admin>();

  const [file, setFile] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [user, loadUser] = useAuthState(auth);
  const [role, setRole] = useState();

  const userSelector = useSelector((state: any) => state.userReducer);
  const imageSelector = useSelector((state: any) => state.imageReducer);

  useEffect(() => {
    if (loadUser) {
      setLoading(true);
    } else {
      if (user) {
        if (userSelector.profile && userSelector.role >= 2) {
          setAdmin(userSelector.profile);
          setRole(userSelector.role);
          setProfilePicture(imageSelector.value);
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
  const handFirstName = (value: any) => {
    setFirstName(value);
  };

  const getFile = (value: File, error: boolean) => {
    if (error) {
      setErrorImage("Mauvais format de fichier");
    } else {
      setLoadingImage(true);
      setErrorImage("");
      Helpers.resizeFile(value, false)
        .then((response: any) => {
          setFile(response);
          setProfilePicture(URL.createObjectURL(response));
          setLoadingImage(false);
        })
        .catch((err) => {
          setLoadingImage(false);
        });
    }
  };
  const handleEditProfile = () => {
    if (admin) {
      if (role === 3) {
        const adminObject = new Admin("", firstName, lastName, admin.email);
        AdminRepository.putAdmin(adminObject)
          .then((response: any) => {
            dispatch(
              login({
                profile: JSON.parse(response),
                role: 3,
              })
            );
            if (file) {
              ImageRepository.createImage(file)
                .then((response: any) => {
                  response = JSON.parse(response);
                  dispatch(
                    setImageProfile({
                      value: config.uriPath + "/images/" + response.filePath,
                    })
                  );
                  navigate("/admin/profile");
                })
                .catch((err) => {
                  setLoadingImage(false);
                });
            } else {
              navigate("/admin/profile");
            }
          })
          .catch((err) => {});
      } else {
        const employeeObject = new Employee(
          "",
          firstName,
          lastName,
          admin.email,
          "",
          ""
        );
        EmployeeRepository.putEmployee(employeeObject)
          .then((response: any) => {
            dispatch(
              login({
                profile: JSON.parse(response),
                role: 2,
              })
            );
            if (file) {
              ImageRepository.createImage(file)
                .then((response: any) => {
                  response = JSON.parse(response);
                  dispatch(
                    setImageProfile({
                      value: config.uriPath + "/images/" + response.filePath,
                    })
                  );
                  navigate("/admin/profile");
                })
                .catch((err) => {
                  setLoadingImage(false);
                });
            } else {
              navigate("/admin/profile");
            }
          })
          .catch((err) => {});
      }
    }
  };
  const rendertLayout = () => {
    return (
      <Layout>
        <Helmet>
          <title>Modifier le profil utilisateur</title>
          <meta
            name="description"
            content="Mettez à jour vos informations personnelles avec la fonction de modification du profil utilisateur."
          />
          <link
            rel="canonical"
            href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/admin/edit"
          />
        </Helmet>

        <div className="flex flex-col w-full h-full px-4 mx-auto bg-white xl:gap-y-10 gap-y-8 lg:gap-y-2 md:px-8 xl:w-2/3">
          <div className="flex gap-x-[334px]">
            <Title title="Edit profile" color="text-first" />
          </div>
          <div className="mx-auto">
            {profilePicture && !loadingImage ? (
              <ProfileComponent
                profilePicture={profilePicture}
                getFile={getFile}
                size="xl:w-[150px] xl:h-[150px] w-40 h-40 2xl:w-[250px] 2xl:h-[250px]"
                btnSize="w-12"
                right="right-4"
                bottom="-bottom-2"
                btnWith="w-10"
                btnPosition="right-2 2xl:right-10"
              />
            ) : (
              <Skeleton
                variant="circular"
                animation="wave"
                width={300}
                height={300}
              />
            )}
          </div>
          <div className="flex flex-col w-full mx-auto md:w-2/3 2xl:w-1/3 gap-y-4 lg:gap-2 2xl:gap-y-4">
            <div>
              {admin ? (
                admin.firstName ? (
                  <InputLabelComponent
                    type="text"
                    label="Prénom"
                    placeholder="Ex: John"
                    value={admin.firstName}
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
              {admin ? (
                admin.lastName ? (
                  <InputLabelComponent
                    type="text"
                    label="Nom"
                    placeholder="Ex: Doe"
                    value={admin.lastName}
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
            <div></div>
          </div>
          <div>
            <div className="flex justify-between mx-auto md:w-2/3 2xl:w-1/3">
              <div className="" onClick={() => navigate("/admin/profile")}>
                <HomeButton
                  bg="bg-white"
                  color="text-first"
                  fontSize="text-base"
                  title="Annuler"
                />
              </div>
              <div className="" onClick={handleEditProfile}>
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

export default EditAdminProfile;
