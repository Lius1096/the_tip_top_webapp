import validator from "validator"

export const validateRole = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez selectionner un rôle."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez selectionner un rôle.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}