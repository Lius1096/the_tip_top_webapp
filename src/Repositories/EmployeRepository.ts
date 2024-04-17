import Employee from "../Models/Employe";
import ApiService from "../Services/ApiService";
import { Route } from "../Enums/RouteEnums";

export default abstract class EmployeeRepository {

    public static getCurrentEmployee() {
        return ApiService.get(
            Route.EMPLOYE_BASE + Route.EMPLOYE_ME
        );
    }
    public static getAllEmployees() {
        return ApiService.get(
            Route.EMPLOYE_BASE
        );
    }    

    public static getEmployeeById(id: number) {
        return ApiService.getSingleInstance<Employee>(
            Route.EMPLOYE_BASE + "/" + id,
            Employee
        );
    }

    public static createEmployee(employee: Employee) {
        return ApiService.post(
            Route.EMPLOYE_BASE,
            employee
        );
    }

    

    public static updateEmployee(employee: Employee) {
        return ApiService.putInstance<Employee>(
            Route.EMPLOYE_BASE + "/" + employee.id,
            Employee,
            employee
        );
    }
    public static putEmployee(client: Employee) {
        return ApiService.put(
            Route.EMPLOYE_BASE,
            client
        );
    }

    public static deleteEmployee(employee: Employee) {
        return ApiService.deleteInstance(Route.EMPLOYE_BASE + "/" + employee.id);
    }
}
