export default class BadRequestError extends Error
{
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.badRequest = true;
        Error.captureStackTrace(this,this.constructor);
    }
};