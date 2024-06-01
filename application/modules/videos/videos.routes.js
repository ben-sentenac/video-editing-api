import VideoController from "./videos.controller.js";
import { getAllVideosOptions,uploadVideoOptions,convertVideoOptions } from "./videosRoutesOptions.js";


export async function videoAPIRoutes(instance) {

    const videoController = new VideoController(instance.mysql);
    const { uploadVideo, getVideos, convertVideo, downloadVideo } = videoController;
   
    instance.get('/',getAllVideosOptions,getVideos);
   
    instance.post('/upload',uploadVideoOptions,uploadVideo);

    instance.patch('convert-video',convertVideoOptions,convertVideo);

    instance.post('/download',downloadVideo);
}
