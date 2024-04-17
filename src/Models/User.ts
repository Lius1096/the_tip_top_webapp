// User.ts

  class User {
     readonly id?: number;
     lastName: string;
     firstName: string;
     email: string;
     roles?: string[];

    constructor(
      lastName: string,
      firstName: string,
      email: string,

    ) {
      this.lastName = lastName;
      this.firstName = firstName;
      this.email = email;
    }  
  }
  
  export default User;
