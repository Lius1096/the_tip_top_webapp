// Client.ts
import User from "./User"

export default class Client extends User {
    readonly isWinner?: boolean
    birthday?: Date
    image?: string
    city: string
    phone?: string 
    firebaseToken: string
    sex?:  string
    acceptMarketing?: boolean
    constructor (
      firebaseToken: string,
      lastName: string,
      firstName: string,
      email: string,
      city: string,
    
    )
    {
      super(
        firstName,
        lastName,
        email,
      );
        this.city = city
        this.firebaseToken = firebaseToken
    }
}
