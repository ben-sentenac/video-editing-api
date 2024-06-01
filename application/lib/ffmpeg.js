import { spawn } from "node:child_process";

export const FF = {};

//ffmpeg -i video.mp4 -ss 5 -vframes 1 thumbnail.jpg
FF.makeThumbnail = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", [
            "-i",
            inputPath,
            "-ss",
            "5",
            "-vframes",
            "1",
            outputPath,
        ]);

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`FFmpeg exit with code: ${code}`);
            }

        });

        ffmpeg.on('error', (error) => {
            reject(error);
        })
    });
}
//ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0
//inputPath
FF.getDimensions = (inputPath) => {
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
            inputPath,
        ]);

        let dimensions = "";

        ffprobe.stdout.on('data', (chunk) => {
            dimensions += chunk.toString("utf-8");
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
                reject(`FFprobe exited with code ${code}`);
            }
        });

        ffprobe.on('error', (error) => {
            reject(error);
        });
    });

};

//ffmpeg -i <videopath> -vn -c:a copy <audio.aac>
FF.extractAudio = (originalVideoPath, targetAudioPath) => {
    return new Promise((resolve, reject) => {

        const ffmpeg = spawn('ffmpeg', ['-i', originalVideoPath, '-vn', '-c:a', 'copy', targetAudioPath]);
        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`FFmpeg exited with code:${code}`);
            }
        });

        ffmpeg.on('error', (err) => {
            reject(err);
        });
        //end promisez
    });
};

//ffmpeg -i video.mp4 -vf scale=320:140 -c:a copy -y video-320x140.mp4
FF.resize = (originalVideoPath, targetVideoPath, width, height) => {
    return new Promise((resolve, reject) => {
        //nice (see ressource manangement because we don't want ffmpeg take all resoutrces)
        //and let node have the priority
        //ps -p <processid> -o nice 
        //the lowest number (nice value) have the highest priority
        // so node must have the highest priority
        //todo research "set nice value linux"
        const ffmpeg = spawn('ffmpeg', [
            '-i',
            originalVideoPath,
            '-vf',
            `scale=${width}x${height}`,
            '-c:a',
            'copy',
            '-threads',//run using only 2 cores
            '2',//
            '-y',
            targetVideoPath
        ]);

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`FFmpeg exited with code:${code}`);
            }
        })

        ffmpeg.on('error', (err) => {
            reject(err);
        });
    });
}
