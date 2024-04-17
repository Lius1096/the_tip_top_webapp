import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import Title from "../../components/Title";
import InputLabelComponent from "../../components/InputLabelComponent";
import { Alert, Skeleton } from "@mui/material";
import HomeButton from "../../components/HomeButton";
import {
  FirebaseAuthServiceErrorCode,
  auth
} from "../../Services/FirebaseService";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../Validation/Password";
import { validateFirstName } from "../Validation/FirstName";
import { validateLastName } from "../Validation/LastName";
import { validatePhone } from "../Validation/Phone";
import { validateEmail } from "../Validation/Email";
import { FirebaseError } from "firebase/app";
import ApiErrorInterface from "../../Models/Interface/ApiErrorInterface";
import SimpleSelectComponent from "../../components/SimpleSelectComponent";
import { validateRole } from "../Validation/Role";
import { useDispatch, useSelector } from "react-redux";
import {useAuthState} from 'react-firebase-hooks/auth/dist/index.cjs';
import ClientRepository from "../../Repositories/ClientRepository";
import Client from "../../Models/Client";
import User from "../../Models/User";
import UserRepository from "../../Repositories/UserRepository";
import Employee from "../../Models/Employe";
import EmployeeRepository from "../../Repositories/EmployeRepository";
import Admin from "../../Models/Admin";
import AdminRepository from "../../Repositories/AdminRepository";
import { validateCodeEmployee } from "../Validation/CodeEmployee";
import ApiService from "../../Services/ApiService";
import { logout } from "../../Redux/Reducer/UserReducer";
import { removeImageProfile } from "../../Redux/Reducer/ImageProfileReducer";
import CityComponent from "../../components/CityComponent";

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, loadUser] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [role, setRole] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [codeEmployee, setCodeEmployee] = useState("");
  const [userToken, setUserToken] = useState<string>();
  const [companyName, setCompanyName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [codeEmployeeError, setCodeEmployeeError] = useState(false);
  const [error, setError] = useState<FirebaseError | ApiErrorInterface[]>();

  const userSelector = useSelector((state: any) => state.userReducer);

  useEffect(() => {
    if (user) {
      if (userSelector.role) {
        if (userSelector.role !== 3) {
          redirectLogout();
        }
      } else {
        redirectLogout();
      }
    } else {
      redirectLogout();
    }
  }, [user, useSelector]);

  const redirectLogout = () => {
    ApiService.disableAuth();
    dispatch(logout());
    dispatch(removeImageProfile());
    navigate("/admin/login");
  };

  const handleFirstName = (value: string) => {
    setFirstName(value);
  };
  const handleLastName = (value: string) => {
    setLastName(value);
  };
  const handleEmail = (value: string) => {
    setEmail(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };
  const handlePhone = (value: string) => {
    setPhone(value);
  };
  const handleCPassword = (value: string) => {
    setCPassword(value);
  };
  const handleCodeEmployee = (value: string) => {
    setCodeEmployee(value);
  };

  const handleGroup = (value: string) => {
    setRole(value);
  };

  const validate = () => {
    let isFirstNameError = !validateFirstName(firstName).valid;
    let isLastNameError = !validateLastName(lastName).valid;
    let isPhoneError = !validatePhone(phone).valid;
    let isCodeEmployeeError = !validateCodeEmployee(codeEmployee).valid;
    if (role === "employee" || role === "admin") {
      isPhoneError = false;
      if (role === "admin") {
        isCodeEmployeeError = false;
      }
    }
    let isEmailError = !validateEmail(email).valid;
    let isRoleError = !validateRole(role).valid;
    let isPasswordError = !validatePassword(password, cPassword, true).valid;
    setFirstNameError(isFirstNameError);
    setLastNameError(isLastNameError);
    setCodeEmployeeError(isCodeEmployeeError);
    setPhoneError(isPhoneError);
    setPasswordError(isPasswordError);
    setEmailError(isEmailError);
    setRoleError(isRoleError);

    if (
      !isFirstNameError &&
      !isLastNameError &&
      !isPhoneError &&
      !isPasswordError &&
      !isEmailError &&
      !isRoleError
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleNewUser = async () => {
    if (validate()) {
      const userResponse: any = await UserRepository.createFirebaseUser({
        email: email,
        password: password,
      });

      if (userResponse) {
        const jwtToken: any = await UserRepository.getUserToken({
          email: email,
          password: password,
        });

        if (jwtToken) {
          switch (role) {
            case "client":
              const client = new Client(
                JSON.parse(jwtToken),
                lastName,
                firstName,
                email,
                phone
              );
              ClientRepository.createClient(client)
                .then((clientResponse) => {
                  if (clientResponse) {
                    navigate("/admin/user");
                  }
                })
                .catch(() => {});
              break;

            case "employee":
              const employee = new Employee(
                JSON.parse(jwtToken),
                lastName,
                firstName,
                email,
                codeEmployee,
                companyName
              );
              EmployeeRepository.createEmployee(employee)
                .then((employeeResponse) => {
                  if (employeeResponse) {
                    navigate("/admin/user");
                  }
                })
                .catch(() => {});
              break;

            case "admin":
              const admin = new Admin(
                JSON.parse(jwtToken),
                lastName,
                firstName,
                email
              );
              AdminRepository.createAdmin(admin)
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
        }
      }
    }
  };
  const renderCity = ["Paris", "Lyon", "Sens"];

  const handleCompanyName = (value: any) => {
    setCompanyName(value);
  };

  const renderErrorMessage = () => {
    if (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case FirebaseAuthServiceErrorCode.EMAIL_EXISTS:
            return (
              <div>
                <p>Un compte existe déjà avec ce e-mail</p>
              </div>
            );
          default:
            return "Erreur, un problème inconnu est survenu";
        }
      } else {
        return error.map((el) => <p>{el.message}</p>);
      }
    }
    return "";
  };

  return (
    <Layout>
      <div className="h-screen bg-white">
        <div
          className={`${
            error ? "animate__fadeInDown" : "hidden"
          } fixed z-50 w-screen animate__animated`}
        >
          <Alert severity="error">{renderErrorMessage()}</Alert>
        </div>
        <div className="flex flex-col gap-y-[10px]  h-full ">
          <div className="flex gap-x-[334px]">
            <Title
              title="Ajouter un utilisateur"
              color="text-first py-4 text-3xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-[50px] gap-y-[20px] items-end">
            <div>
              <p
                className={`${firstNameError ? "block" : "hidden"} text-third`}
              >
                {validateFirstName(firstName).message}
              </p>
              <InputLabelComponent
                type="text"
                label="Prénom"
                placeholder=" Prénom"
                callBack={handleFirstName}
              />
            </div>
            <div>
              <p className={`${lastNameError ? "block" : "hidden"} text-third`}>
                {validateLastName(lastName).message}
              </p>
              <InputLabelComponent
                type="text"
                label="Nom "
                placeholder="Nom"
                callBack={handleLastName}
              />
            </div>
            <div>
              <p className={`${emailError ? "block" : "hidden"} text-third`}>
                {validateEmail(email).message}
              </p>
              <InputLabelComponent
                type="email"
                label="Email "
                placeholder="Email"
                callBack={handleEmail}
              />
            </div>
            {role === "employee" ? (
              <div>
                <p
                  className={`${
                    codeEmployeeError ? "block" : "hidden"
                  } text-third`}
                >
                  {validateCodeEmployee(codeEmployee).message}
                </p>
                <InputLabelComponent
                  label="Code employee "
                  type="text"
                  placeholder="XXX XXX XXX XX"
                  required
                  callBack={handleCodeEmployee}
                />
              </div>
            ) : null}

            <div>
              <p className={`${roleError ? "block" : "hidden"} text-third`}>
                {validateRole(role).message}
              </p>
              <SimpleSelectComponent
                required
                label="Rôle"
                options={[
                  { value: 0, label: "employee" },
                  { value: 1, label: "admin" },
                ]}
                //   value={groupBy}
                callBack={handleGroup}
              />
            </div>
            <div>
              <p
                className={`${passwordError ? "block" : "hidden"} text-third `}
              >
                {validatePassword(password, cPassword, true).message}
              </p>
              <InputLabelComponent
                label="Mot de passe "
                type="password"
                placeholder="Mot de passe"
                callBack={handlePassword}
                required
              />
            </div>
            <div>
              <p
                className={`${passwordError ? "block" : "hidden"} text-third `}
              >
                {validatePassword(password, cPassword, true).cMessage}
              </p>
              <InputLabelComponent
                label="Confirmer Mot de passe "
                type="password"
                placeholder="Confimer mot de passe"
                callBack={handleCPassword}
                required
              />
            </div>
            <div>
            
              {role === "employee" ? (
              <div>
                <p className={`${codeEmployeeError ? "block" : "hidden"} text-third`}>
                  {validateCodeEmployee(codeEmployee).message}
                </p>
                <CityComponent
                    label="Ville"
                    cities={renderCity}
                    callBack={handleCompanyName}
                />
              </div>
            ) : null}
            </div>
          </div>
          <div>
            <div className="flex justify-end ">
              <div className="" onClick={() => navigate("/admin/user")}>
                <HomeButton
                  bg="bg-white"
                  color="text-first"
                  fontSize="text-lg"
                  title="Annuler"
                />
              </div>
              <div className="" onClick={handleNewUser}>
                <HomeButton
                  bg="bg-first"
                  color="text-white"
                  fontSize="text-lg"
                  title="Ajouter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;
