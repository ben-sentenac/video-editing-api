import MimeTypeError from '../../errors/MimeTypeError.js';
import utils from '../../utils/utils.js';
import { VideoServices } from './video.services.js';

export default class VideoController 
{

    constructor() {
        this.services = new VideoServices();
        this.uploadVideo = this.uploadVideo.bind(this);
    }


    async uploadVideo(req,res)  {
        const incomingData = await req.file();
        if(!utils.checkMimeTypes(incomingData['mimetype'],utils.ALLOWED_MIME_TYPES)) {
            throw new MimeTypeError('Unsupported mime type',415);
        }
        await this.services.upload(incomingData);
        res.send({
            status:'sucess',
            message:'file uploaded!'
        });
    }
}