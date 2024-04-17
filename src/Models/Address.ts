// Adresse.ts

  
  class Address {

    // Numéro 1 Définitrion des propriétés

     readonly id?: number;
     formattedAddress: string;
     city: string;
     country: string;
     client: number
     defaultAddress?: boolean
  
    constructor(
      formattedAddress: string,
      city: string,
      country: string,
      client: number
    ) {
      
      // Numéro 2 Initialisation des propriétés

      this.formattedAddress = formattedAddress;
      this.city = city;
      this.country = country;
      this.client = client
    }
  
   
  }
  
  export default Address;
  