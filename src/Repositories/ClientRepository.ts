import { Route } from "../Enums/RouteEnums";
import Client from "../Models/Client";
import ApiService from "../Services/ApiService";

export default abstract class ClientRepository {

    // recupérer le client actuelment connecté

    public static getCurrentClient() {
        return ApiService.get(
            Route.CLIENT_BASE + Route.CLIENT_ME
        );
    }

    // Créer un client

    public static createClient(client: Client) {
        return ApiService.post(
            Route.CLIENT_BASE,
            client,
        );
    }

    // récupérer tous les clients

    public static getClientCollection() {
        return ApiService.getCollection<Client[]>(
            Route.CLIENT_BASE,
            Client,
            false,
            1
        );
    }

    public static fetchClientById(id: number) {
        return ApiService.getSingleInstance<Client>(
            Route.CLIENT_BASE + "/" + id,
            Client
        );
    }

    public static putClient(client: Client) {
        return ApiService.put(
            Route.CLIENT_BASE,
            client
        );
    }

    public static deleteClient(client: Client) {
        return ApiService.deleteInstance(Route.CLIENT_BASE + "/" + client.id);
    }

    public static getWinTicketCodesById(id: number) {
        return ApiService.get(
            Route.CLIENT_BASE  + "tickets/" + id
        );
    }

    
}