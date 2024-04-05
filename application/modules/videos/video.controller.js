import MimeTypeError from '../../errors/MimeTypeError.js';
import utils from '../../utils/utils.js';

export default class VideoController 
{

    constructor(_services) {
        this.services = _services;
    }


    async uploadVideo(req,res)  {
        const incomingData = await req.file();
        if(!utils.checkMimeTypes(incomingData['mimetype'])) {
            throw new MimeTypeError('Unsupported mime type',415);
        }
        //todo process downloading
        //add downloadservice 

    }
}