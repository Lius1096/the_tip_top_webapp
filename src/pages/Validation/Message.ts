import validator from "validator"

export const validateMessage = (value: string) => {
    const result = {
        valid : false,
        message: "Veuillez rédiger le contenu de votre message"
    }

    if (validator.isEmpty(value)) {
        result.valid = false
        result.message = "Veuillez rédiger le contenu de votre message"
        
    } else {
        result.valid = true
        result.message = ''
    }
    return result;
}