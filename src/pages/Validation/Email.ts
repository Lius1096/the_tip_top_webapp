import validator from 'validator';
export const validateEmail =(value: string)=>{
    const result = {
        valid : false,
        message: "Veuillez renseigner un e-mail valide"
    }
    if (validator.isEmail(value)) {
        result.valid = true
        result.message = ""
    }else{
        result.valid = false
        result.message = "Veuillez renseigner un e-mail valide"
    }
    return result
} 