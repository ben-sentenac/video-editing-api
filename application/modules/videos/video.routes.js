import VideoController from "./video.controller.js";



export function videoAPIRoutes(instance, _, done) {

    const videoController = new VideoController();

    const { uploadVideo } = videoController;

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
                    },
                    additionalProperties: false,
                },
            },
        },
        handler: async (req, res) =>
            res.send({
                status: "success",
                message: "Request successful",
                extraProperty: "value",
            }),
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
                    },
                    additionalProperties: false,
                },
            },
        },
        handler: uploadVideo,
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
}
