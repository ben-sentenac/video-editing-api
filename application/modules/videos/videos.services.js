import path from 'node:path';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'node:crypto';
import { FF } from '../../lib/ffmpeg.js';
import utils from '../../utils/utils.js';


export class VideoServices {
    /**
     * instance of database
     * @param {*} dbInstance 
     * TODO 
     * move db stuff in repository class 
     */
    constructor(dbInstance) {
        this.db = dbInstance;
        this.storagePath = 'storage';
    }
    /**
     * Upload a video file of 4gb max size
     * @param {*} fileStream stream from the request
     * @param {*} userId user id from the request
     * @returns { Object } videoObject
     */
    async upload(fileStream, userId) {
        const filename = fileStream.filename;

        const ext = path.extname(filename).substring(1).toLocaleLowerCase();
        const originalName = path.parse(filename).name;

        const videoId = uuidv4();
        const hashedFileName = crypto.randomBytes(8).toString('hex');

        let fileHandle;
        try {
            const filePath = path.resolve(this.storagePath, videoId, `${hashedFileName}.${ext}`);
            await fs.mkdir(path.resolve(this.storagePath, videoId), { recursive: true });
            fileHandle = await fs.open(filePath, 'w');
            const writeStream = fileHandle.createWriteStream();
           await pipeline(
            fileStream.file,
            writeStream
           );
            //generate thumbnails
            
            const thumbnailPath = path.resolve(this.storagePath, videoId, 'thumbnail.jpg');
            await FF.makeThumbnail(filePath,thumbnailPath);
            const { width, height } = await FF.getDimensions(filePath);
            const dimensions = `${String(width)}x${String(height)}`  ;
             await this.create(videoId, hashedFileName, originalName, ext, userId, dimensions);
            
           
            //return data in response 
            return {
                videoId,
                name: hashedFileName,
                originalName,
                extension: ext,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        } catch (err) {
            console.log(err);
            //if an error during upload occur delete the folder //delete db entries
            await utils.deleteFolder(`./storage/${videoId}`);
            //trow UploadError or thumbnail error or saveError
            throw err;
        } finally {
            fileHandle.close();
        }
    }
    //FFMPEG STUFFS
    async resize() {
        //TODO
    }

    async extractAudio() {
        //todo
    }

    async convertVideoTo(videoPath, format) {
        try {
            //todo
            //todo update in db and add new extension  ?
        } catch (err) {
            throw err;
        }
    }
    //DB STUFF
    async create(videoId, name, originalName, extension, userId, dimensions) {
        const sql = `INSERT INTO videos (video_id,name,original_name,
            extension,user_id,extracted_audio,dimensions,
            resizes,thumbnail,deleted,created_at,updated_at,deleted_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const values = [
            videoId,
            name,
            originalName,
            extension,
            userId,
            false,
            dimensions,
            JSON.stringify({}),
            'thumbnail.jpg',
            false,
            new Date(),
            new Date(),
            null
        ];

        return await this.db.execute({
            sql, values
        });
    }

    async updateExt(video) {
        const values = [video.extension, new Date(), video.video_id];
        return await this.db.execute({ sql, values });
    }

    async delete(videoId) {
        const sql = `DELETE FROM videos WHERE video_id= ?`;
        return await this.db.execute(sql, [videoId]);
    }

    async getAllVideos() {
        try {
            const [result] = await this.db.query('SELECT * FROM videos');
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    /**
         *  get video  from db
         * @param {*} videoId 
         * @returns {Promise} 
         */
    async getVideo(videoId) {
        try {
            const sql = `SELECT * FROM videos WHERE video.video_id = ?`;
            const [result] = await this.db.query(sql, [videoId]);
            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }

    }

    




}