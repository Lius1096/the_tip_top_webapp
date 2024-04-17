import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";
import { Moment } from "moment";
import Game from "../Models/Game";

export default abstract class SettingsGameRepository {

    public static getCurrentGame() {
        return ApiService.get(
            Route.GAME_BASE + "/current"
        );
    }

    public static startGame(date: string) {
        return ApiService.post(
            Route.GAME_BASE + "/start",
            {startDate: date}
        );
    }

    public static editGame(id: number, game: Game) {
        return ApiService.put(
            Route.GAME_BASE + "/" + id,
            game
        );
    }
}
