export function validatePhone(phone: string) {
    let result = {
        valid : true,
        message: "Téléphone invalide"
    }
    if (phone) {
        phone = phone.replace(/ +/g, "")
    const search = phone.match(/^[+]?[0-9]+$/)
    if (!search) {
        return result = {
            valid : true,
            message: "Téléphone invalide"
        }
    }
    const character = phone.split("");
    
    switch (character[0]) {
        case "+":
            if (character.length !== 12) {
                result = {
                    valid : true,
                    message: "Téléphone invalide"
                }
            } else {
                if (character[2] === '3' && character[1] === "3") {
                    if (character[3] === "7" || character[3] === "6" || character[3] === "1") {
                        result = {
                            valid : true,
                            message: "Téléphone invalide"
                        }
                    } else {
                        result = {
                            valid : true,
                            message: "Téléphone invalide"
                        }
                    }
                } else {
                    result = {
                        valid : true,
                        message: "Téléphone invalide"
                    }
                }
            }

            break;
        case "0":
            if (character.length !== 10) {
                result = {
                    valid : true,
                    message: "Téléphone invalide"
                }
            } else {
                if (character[1] === "7" || character[1] === "6") {
                    result = {
                       valid: false,
                        message: ""
                    }
                } else {
                    result = {
                        valid : true,
                        message: "Téléphone invalide"
                    }
                }

            }

            break;
        case "7":
            if (character.length !== 9) {
                result = {
                    valid : true,
                    message: "Téléphone invalide"
                }
            } else {
                result = {
                   valid: false,
                    message: ""
                }
            }

            break;
        case "6":
            if (character.length !== 9) {
                result = {
                    valid : true,
                    message: "Téléphone invalide"
                }
            } else {
                result = {
                   valid: false,
                    message: ""
                }
            }
            break;

        default:
            result = {
               valid: false,
                message: ""
            }
            break;
            
    }
    return result;
    }else{
        return result;
    }
    
  
}