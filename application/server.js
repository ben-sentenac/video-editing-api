import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyMysql from '@fastify/mysql';


import { videoAPIRoutes } from './modules/videos/video.routes.js';
import { getEnv } from './config/app.config.js';


//TODO clean up file refactoring error handling into is own module

const app = fastify(
    {
        logger:true
    }
);
//authorize binary data 
//app.addContentTypeParser('', (req,payload,done) => {});
//get config
const config = await getEnv(app);

const { host,port,db} = config;

app.register(fastifyMysql, {
    promise: true,
    connectionString: `mysql://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`
});

app.register(fastifyMultipart, {
    limits: {
        fileSize: 4e9
    }
});

app.get('/not-found', (req, res) => {
    res.callNotFound();
});

app.register(videoAPIRoutes, { prefix: '/api/videos' });

//testing api 


//centralized error handler
app.setErrorHandler(async (err, req, res) => {
    if (err.validation) {
        res.code(err.statusCode || 403);
        return { error: err.message };
    }
    if (err.mimeType) {
        res.code(err.statusCode || 415);
        return { error: err.message };
    }

    if(err.badRequest) {
        res.code(err.statusCode || 400);
        return { error: err.message };
    }

    req.log.error({ err });
    res.code(err.statusCode || 500);
    return err;
});

app.setNotFoundHandler(async (req, res) => {
    res.code(404);
    res.send({
        status: "error",
        message: "Can't find my way!"
    });
});


process.on('SIGINT', () => {
    // Perform cleanup before exiting the process
    console.log('Shutting down ...');
    // Perform cleanup, if needed

    // Exit the process with a success code
    process.exit(0);
});


(async () => {
    try {
        await app.listen({ port,host});
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
