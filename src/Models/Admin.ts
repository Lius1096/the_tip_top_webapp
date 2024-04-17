import User from "./User";



class Admin extends User{

    readonly id?: number;

    firebaseToken: string

    constructor (
       
    firebaseToken: string,
        firstName: string,
        lastName: string,
        mail: string
        )

        {
            super(lastName,firstName, mail);
            this.firebaseToken = firebaseToken
            
        }

}

export default  Admin;
