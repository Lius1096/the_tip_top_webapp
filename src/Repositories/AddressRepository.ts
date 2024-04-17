import Address from "../Models/Address";
import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";

export default abstract class AddressRepository {

    public static getAllAddresses() {
        return ApiService.getCollection<Address[]>(
            Route.ADDRESS_BASE,
            Address,
            false,
            1
        );
    }

    public static getAddressById(id: number) {
        return ApiService.getSingleInstance<Address>(
            Route.ADDRESS_BASE + "/" + id,
            Address
        );
    }

    public static createAddress(address: Address) {
        return ApiService.postInstance<Address>(
            Route.ADDRESS_BASE,
            Address,
            address,
            false
        );
    }

    public static updateAddress(address: Address) {
        return ApiService.putInstance<Address>(
            Route.ADDRESS_BASE + "/" + address.id,
            Address,
            address
        );
    }

    public static deleteAddress(address: Address) {
        return ApiService.deleteInstance(Route.ADDRESS_BASE + "/" + address.id);
    }
}
