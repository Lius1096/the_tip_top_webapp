import validator from "validator"

export const validateSubject = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez indiquer votre sujet."
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = 'Veuillez indiquer votre sujet.'
        
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}