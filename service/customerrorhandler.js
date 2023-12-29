class customerrorhandler extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static alreadyexist(message) {
        return new customerrorhandler(409, message)
    }

    static wrongcredentials(message) {
        return new customerrorhandler(401, message)
    }

    static unauthorized(message) {
        return new customerrorhandler(401, message)
    }

    static notfound(message = "not found") {
        return new customerrorhandler(401, message)
    }
}
export default customerrorhandler