import validator from "validator";
export const validatePassword = (
  password: string,
  cPassword: string | null,
  isLoging: boolean
) => {
  if (validator.isEmpty(password)) {
    return {
      valid: false,
      message: "Veuillez renseigner votre mot de passe",
    };
  }
  if (!isLoging) {
      if (
        !validator.isStrongPassword(password, {
          minLength: 6,
          minLowercase: 0,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
          returnScore: false,
        })
      ) {
        return {
          valid: false,
          message:
            "Votre mot de passe doit contenir 6 caractères au moins 1 lettre majuscule et 1 chiffre",
        };
      }
  }
  if (cPassword !== null) {
    if (validator.isEmpty(cPassword)) {
      return {
        valid: false,
        cMessage: "Veuillez confirmer votre mot de passe",
      };
    }
    if (password !== cPassword) {
      return {
        valid: false,
        message: "Les mots de passe ne correspondent pas",
      };
    } else
      return {
        valid: true,
        message: "",
      };
  }

  return {
    valid: true,
    message: "",
  };
};
