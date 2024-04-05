export default class MimeType extends Error
{
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.mimeType = true;
        Error.captureStackTrace(this,this.constructor);
    }
}