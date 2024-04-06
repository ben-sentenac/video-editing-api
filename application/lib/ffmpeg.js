import { spawn } from 'node:child_process';

export default class FFmpeg 
{
    /**
     * make thumnail image from video source
     * @param {*} input inputPath of the video file the thumbnail is generated from
     * @param {*} output outputPah of the thumbnail file
     * @param {*} framePos the timeline frame in second in the video the thumbnail is generted from
     * @returns 
     */
    static generateThumbnail(input,output,framePos) {
        return new Promise((resolve,reject) => {
            const ff = spawn(
                "ffmpeg", [
                    "-i",
                    input,
                    "-ss",
                    framePos,
                    "-vframes",
                    "1",
                    output,
                ]);
                //lidsten on error and close event
                ff.on('close', (code) => {
                    if(code === 0) {
                        resolve();
                    }
                    reject();
                });
                ff.on('error', (err) => {
                    reject(err);
                });
        });
        
    }
}