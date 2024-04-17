import Giveaway from "../Models/Giveaway";
import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";

export default abstract class GiveawayRepository {

    public static getAllGiveaways() {
        return ApiService.get(
            Route.GIVEAWAY_BASE,
        );
    }

    public static getBestWinner() {
        return ApiService.get(
            Route.GIVEAWAY_BASE + "draw"
        );
    }

    public static createGiveaway(giveaway: Giveaway) {
        return ApiService.postInstance<Giveaway>(
            Route.GIVEAWAY_BASE,
            Giveaway,
            giveaway,
            false
        );
    }

    public static updateGiveaway(giveaway: Giveaway) {
        return ApiService.putInstance<Giveaway>(
            Route.GIVEAWAY_BASE + "/" + giveaway.id,
            Giveaway,
            giveaway
        );
    }

    public static deleteGiveaway(giveaway: Giveaway) {
        return ApiService.deleteInstance(Route.GIVEAWAY_BASE + "/" + giveaway.id);
    }
}
