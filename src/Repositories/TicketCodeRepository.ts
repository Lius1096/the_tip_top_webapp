import TicketCode from "../Models/TicketCode";
import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";

export default abstract class TicketCodeRepository {

    public static getTicketCodeById(id: number) {
        return ApiService.getSingleInstance<TicketCode>(
            Route.TICKET_CODE_BASE + "/" + id,
            TicketCode
        );
    }

    public static getCurrentClientTicketCodes() {
        return ApiService.get(
            Route.TICKET_CODE_CLIENT
        );
    }

    public static getAllTicketCodes() {
        return ApiService.get(
            Route.TICKET_CODE_BASE 
        );
    }

    public static getWinnersGroupByGiveaway() {
        return ApiService.get(
            Route.TICKET_CODE_BASE + "group_by_giveaway"
        );
    }

    public static getWinTicketCodes() {
        return ApiService.get(
            Route.TICKET_CODE_BASE + "all_wins"
        );
    }



    
    public static getRecoveredTicketCodes() {
        return ApiService.get(
            Route.TICKET_CODE_BASE + "all_recovers"
        );
    }

    public static applyTicketCode(ticketCode: string) {
        return ApiService.get(
            Route.TICKET_CODE_APPLY + ticketCode
        );
    }
    public static recoveredTicketCode(ticketCode: string, clientId: number) {
        return ApiService.put(
            Route.TICKET_CODE_BASE + "recovered/" + ticketCode + "/client/" + clientId
        );
    }
    public static setTicketCodeAsGive(label: string, id: number) {
        return ApiService.put(
            Route.TICKET_CODE_BASE + "recovered/"+ label + "/client/"+id
        );
    }
}
