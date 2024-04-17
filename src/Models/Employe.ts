// Employe.ts

import User from "./User"

  
  class Employee extends User {

    firebaseToken: string
    employeCode: string
    companyName: string

    constructor (
      firebaseToken: string,
      lastName: string,
      firstName: string,
      email: string,
      employeCode: string,
      companyName: string
    )
    {
       
      super(
        firstName,
        lastName,
        email,
      );
        this.firebaseToken = firebaseToken
        this.employeCode = employeCode
        this.companyName = companyName

    }
  }
  
  export default Employee;
  