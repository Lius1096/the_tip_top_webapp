import User from "../Models/User";
import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";

export default abstract class UserRepository {

    public static getAllUsers() {
        return ApiService.get(
            "/users/"
        );
    }

    public static createFirebaseUser(user: {email: string, password: string}) {
        return ApiService.post(
            "/firebase/user",
            user
        );
    }
    public static getUserToken(user: {email: string, password: string}) {
        return ApiService.post(
            "/firebase/user/login",
            user
        );
    }

    public static putUser(user: User, id: any) {
        return ApiService.put(
            "/users/" + id,
            user
        );
    }
    public static delete(id: any) {
        return ApiService.put(
            "/users/" + id,
           
        );
    }
}
