import validator from "validator"

export const validateCodeEmployee = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez renseigner un code valide."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez renseigner un code valide.'
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}