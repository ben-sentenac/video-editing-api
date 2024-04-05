import path from 'node:path';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import crypto from 'node:crypto';


export class VideoServices {
    constructor() {
        this.storagePath = './storage';
        //binding 
        this.upload = this.upload.bind(this);
        this.save = this.save.bind(this);
    }

    async upload(fileStream) {
        const { filename, file } = fileStream;
        const ext = path.extname(filename);
        const originalName = path.parse(filename).name;

        const videoId = crypto.randomBytes(4).toString('hex');
        const name = crypto.randomBytes(8).toString('hex');
        try {
            const filePath = path.join(this.storagePath, videoId, `${name}.${ext}`);

            await fs.mkdir(path.join(this.storagePath, videoId), { recursive: true });
            const fileHandle = await fs.open(filePath, 'w');
            const writeStream = fileHandle.createWriteStream();
            await pipeline(
                file,
                writeStream
            );
            //TODO generate thumnails
            const thumbnailPath = path.join(this.storagePath,videoId,'thumbnail.jpg');
            //make a thumbnail or throw an exception
            await this.makeThumbnail(filePath,thumbnailPath);
            //TODO save in db
        } catch (err) {
            console.log(err);
            //if an error during upload occur delete the folder
            //trow UploadError or saveError
            throw err;
        }
    }

    resize() {

    }

    async makeThumbnail(path,thumbnailPath) {

    }

    extractAudio() {

    }

    create() {

    }

    save() {

    }

    update() {

    }
}