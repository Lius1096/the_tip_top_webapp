import validator from "validator"

export const validateFirstName = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez renseigner votre nom."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez renseigner votre nom.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}