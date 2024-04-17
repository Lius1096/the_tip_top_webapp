export class ServerError extends Error {
    
}

export class BusinessError extends Error {
    data: any;
    // data: Object;
    constructor(data: Object) {
        super(JSON.stringify(data));
        this.data = data;
    }
}
