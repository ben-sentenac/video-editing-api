import BadRequestError from '../../errors/BadRequestError.js';
import MimeTypeError from '../../errors/MimeTypeError.js';
import utils from '../../utils/utils.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { VideoServices } from './videos.services.js';

export default class VideoController {

    constructor(dbInstance) {
        this.db = dbInstance;
        this.services = new VideoServices(this.db);
        //binding context
        this.uploadVideo = this.uploadVideo.bind(this);
        this.getVideos = this.getVideos.bind(this);
        this.convertVideo = this.convertVideo.bind(this);
        this.downloadVideo = this.downloadVideo.bind(this);

    }


    async uploadVideo(req, res) {
        const incomingData = await req.file();
        if (!utils.checkMimeTypes(incomingData['mimetype'], utils.ALLOWED_MIME_TYPES)) {
            throw new MimeTypeError('Unsupported mime type', 415);
        }
        const userId = req.userId ?? null;
        const video = await this.services.upload(incomingData, userId);
        res.code(201);
        res.send({
            status: 'OK',
            message: 'resource created!',
            data: video
        });
    }

    async getVideos(req, res) {
        const videos = await this.services.getAllVideos();
        res.send(
            {
                status: 'OK',
                data: videos
            }
        );
    }

    async convertVideo(req, res) {
        //get the format and the videoid from req
        const { videoId, to } = req.body;
        if (!videoId || !to) {
            throw new BadRequestError(`Bad request required fields:[ videoId; to ]`, 400);
        }
        const video = await this.services.getVideo(videoId);
        const videoPath = path.resolve(`${this.services.storagePath}/${videoId}/${video.name}.${video.extension}`);
        await this.services.convertVideoTo(videoPath, to);
        //update extension (mabe its better to update all video properties??)
        await this.services.updateExt({ video_id: videoId, extension: to });
        await this.services.deleteFile(videoPath);
        //get the video
        //convert it
        res.code(200);
        res.send({
            status: 'OK',
            message: `Video successfully converted! to ${to}`
        });
    }

    async downloadVideo(req, res) {
        const { videoId } = req.body;
        if (!videoId) {
            throw new BadRequestError(`Bad request required field:[ videoId ]`, 400);
        }

        //find the video 
        const video = await this.services.getVideo(videoId);
        if (!video) {
            res.code(404);
            res.send({
                status: "error",
                message: "resource not found"
            });
        }
        const videoPath = path.resolve(`${this.services.storagePath}/${videoId}/${video.name}.${video.extension}`);
        let file;
        let mimeType;
        let fileName;

        try {
            file = await fs.open(videoPath, 'w');
            mimeType = utils.setMimeType(video.extension);
            fileName = `${video.original_name}.${video.extension}`;
            //get the file size 
            const stats = await file.stat();
            const fileStream = file.createWriteStream();

            res.headers({
                "Content-Type": mimeType,
                "Content-Length": stats.size,
                "Content-Disposition": `attachment; filename=${fileName}`
            });
            //todo fix FST_ERR_REP_INVALID_PAYLOAD_TYPE
            res.code(200);
            await pipeline(
                fileStream,
                res.raw
            );
        } catch (error) {
            console.error(error);
            //TODO
            res.code(500);
            res.send({
                status: "error",
                message: "Downloading fail!"
            })
        } finally {
            await file.close();
            await this.services.deleteFolder(`./storage/${videoId}`);
            //delete from db
            await this.services.delete(videoId);
        }

    }
}