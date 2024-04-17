
import { Route } from "../Enums/RouteEnums";
import Admin from "../Models/Admin";
import ApiService from "../Services/ApiService";

export default abstract class AdminRepository {
    public static getCurrentAdmin() {
        return ApiService.get(
            Route.ADMIN_BASE + Route.ADMIN_ME
        );
    }
    public static putAdmin(client: Admin) {
        return ApiService.put(
            Route.ADMIN_BASE ,
            client
        );
    }

    public static createAdmin(admin: Admin) {
        return ApiService.post(
            Route.ADMIN_BASE,
            admin
        );
    }
}