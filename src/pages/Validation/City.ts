import validator from "validator"

export const validateCity = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez renseigner votre ville."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez renseigner votre ville.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}