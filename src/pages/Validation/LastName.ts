import validator from "validator"

export const validateLastName = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez renseigner votre prénom."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez renseigner votre prénom.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}