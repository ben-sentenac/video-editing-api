import VideoController from "./video.controller.js";



export function videoAPIRoutes(instance, _, done) {

    const videoController = new VideoController(instance.mysql);
    const { uploadVideo, getVideos, convertVideo, downloadVideo } = videoController;

    const getAllVideosOptions = {
        method: "GET",
        url: "/",
        schema: {
            response: {
                "2xx": {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: { type: "array" }
                    },
                    additionalProperties: false,
                },
            },
        },
        handler: getVideos
    };

    const uploadVideoOptions = {
        method: "POST",
        url: "/upload",
        schema: {
            headers: {
                type: "object",
                properties: {
                    "content-type": { type: "string" },
                    "content-length": { type: "string" },
                },
            },
            response: {
                "2xx": {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                videoId: { type: "string" },
                                name: { type: "string" },
                                originalName: { type: "string" },
                                extension: { type: "string" },
                                createdAt: { type: "string" },
                                updatedAt: { type: "string" }
                            }
                        }
                    },
                },
            },
        },
        handler: uploadVideo,
    };


    const convertVideoOptions = {
        url: '/convert',
        method: 'PATCH',
        schema: {
            body:{
                type:"object",
                properties: {
                    "videoId":{type:"string"},
                    "to":{type:"string"}
                }
            },
            response: {
                "2xx":{
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        message: { type: "string" },
                    }
                }
            }
        },
        handler: convertVideo
    };

    const downloadVideoOptions = {
        url:'/download',
        method:'POST',
        handler:downloadVideo
    };

    /**
     * Get all uploaded videos
     * @api GET /
     */
    instance.route(getAllVideosOptions, done());
    /**
     * Get all uploaded videos
     * @api POST /upload
     */
    instance.route(uploadVideoOptions, done());

    instance.route(convertVideoOptions, done());

    instance.route(downloadVideoOptions,done());
}
