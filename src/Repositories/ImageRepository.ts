import { Route } from "../Enums/RouteEnums";
import Admin from "../Models/Admin";
import ApiService from "../Services/ApiService";

export default abstract class ImageRepository {

    public static createImage(file: File) {
        return ApiService.postInstance<any>(
            Route.IMAGE_BASE,
            File,
            file,
            false,
            true
        );
    }

    public static getCurrentClientImage() {
        return ApiService.get(
            Route.IMAGE_BASE + "/me"
        );
    }
    public static getClientImage(id: number) {
        return ApiService.get(
            Route.IMAGE_BASE + "/client/" +id
        );
    }
}