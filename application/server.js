import path from 'node:path';
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyMysql from '@fastify/mysql';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors'
import { videoAPIRoutes } from './modules/videos/videos.routes.js';
import { getEnv } from './config/app.config.js';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
//TODO clean up file refactoring error handling into is own module


export async function buildServer(opts) {
    const app = fastify(
        opts
    );
    //authorize binary data 
    //app.addContentTypeParser('', (req,payload,done) => {});
    //get config
    const config = await getEnv(app);

    const { host, port, db } = config;

    app.register(fastifyMysql, {
        promise: true,
        connectionString: `mysql://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`
    });
    app.register(cors, {
        origin: '*',
        hook: 'preHandler'
    });
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 4e9,
            files: 1,
        }
    });

    app.register(fastifyStatic, {
        root: path.join(dirname, '..', 'public'),
        prefix: '/public/', // optional: default '/'// optional: default {}
    });

    app.get('/healthcheck', (req, res) => {
        return {
            status:'OK'
        }
    });

    //get thumbnail src
    app.get('/api/static/:id', (req, res) => {
        const videoId = req.params.id;
        const thumbnail = `assets/${videoId}/thumbnail.jpg`;
        res.sendFile(thumbnail); // serving a file from a different root location
    })

    app.register(videoAPIRoutes, { prefix: '/api/videos' });

    //testing api 


    //centralized error handler
    app.setErrorHandler(async (err, req, res) => {
        console.error(err);
        if (err.validation) {
            res.code(err.statusCode || 403);
            return { error: err.message };
        }
        if (err.mimeType) {
            res.code(err.statusCode || 415);
            return res.send({ error: err.message });
        }

        if (err.badRequest) {
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


    return { 
        app,
        port,
        host
    }
}





