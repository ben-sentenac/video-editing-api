import { spawn } from 'node:child_process';
import path from 'node:path';

export default class FFmpeg {
    /**
     * make thumnail image from video source
     * @param {*} input inputPath of the video file the thumbnail is generated from
     * @param {*} output outputPah of the thumbnail file
     * @param {*} framePos the timeline frame in second in the video the thumbnail is generted from
     * @returns 
     */
    static generateThumbnail(input, output, framePos) {
        return new Promise((resolve, reject) => {
            const _framePos = String(framePos);
            const ff = spawn(
                "ffmpeg", [
                "-i",
                input,
                "-ss",
                "5",
                "-vframes",
                "1",
                output,
            ]);
            //lidsten on error and close event
            ff.on('close', (code) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject(false);
                }

            });
            ff.on('error', (err) => {
                console.error(err);
                reject(err);
            });
        });

    }

    static getVideoDimension(videoPath) {
        return new Promise((resolve, reject) => {
            const ffprobe = spawn("ffprobe", [
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=width,height",
                "-of",
                "csv=p=0",
                videoPath,
            ]);
            let error = '';
            let dimensions = "";
    
            ffprobe.stdout.on('data', (chunk) => {
                dimensions += chunk.toString("utf-8");
            });

            ffprobe.stderr.on('data',(chunk) => {
                error += chunk.toString('utf-8');
            });
    
            ffprobe.on('close', (code) => {
                if (code === 0) {
                    //replace empty space by ""
                    dimensions = dimensions.replace(/\s/g, "").split(',');
                    //console.log(dimensions);
                    resolve({
                        width: Number(dimensions[0]),
                        height: Number(dimensions[1])
                    });
                } else {
                    reject({error});
                }
            });
    
            ffprobe.on('error', (err) => {
                reject(err);
            });
        });
    }

    static convertTo(input,format) {
        return new Promise ((resolve,reject) => {
            const output = input.replace(path.extname(input),'') + `.${format}`;
            let error = '';
            const ff = spawn('ffmpeg',[
                "-loglevel",
                "error",
                "-i",
                input,
                output
            ]);

            ff.stderr.on('data',(chunk) => {
                //TODO don't do this for security issues 
                /**
                 * if wrong input or output 
                 * "/home/benfrom09/WORKSPACE/NODE_JS/apps_and_api/video-edit-app/
                 * storage/videoId/79eeb637d455913f.mp4: No such file or directory\n"
                 * so do not reveal file structure
                 */
                error += chunk.toString('utf-8');
            });

            ff.stderr.on('end', () => {
                console.log(error);
                const message = error.split(':');
                error = (`${path.basename(message[0])}:${message[1]}`).replace('\n','.');
            });

            ff.on("close", (code) => {
                if(code === 0) {
                    resolve();
                } else {
                    reject({error});
                }
            })

            ff.on("error", (err) => {
                console.error('ERROR',err);
                reject(err);
            });
        });
    }
}