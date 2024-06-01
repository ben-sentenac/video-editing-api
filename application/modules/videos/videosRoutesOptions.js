

export  const getAllVideosOptions = {
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
    }
};

export  const uploadVideoOptions = {
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
    }
};


export  const convertVideoOptions = {
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
};