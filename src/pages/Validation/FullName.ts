import validator from "validator"

export const validateFullName = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez renseigner votre nom complet."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez renseigner votre nom complet.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}