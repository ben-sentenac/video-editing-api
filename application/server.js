import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';


import { videoAPIRoutes } from './modules/videos/video.routes.js';

const PORT = 3000;
const HOST = 'localhost';

const app = fastify();
//authorize binary data 
//app.addContentTypeParser('', (req,payload,done) => {});

app.register(fastifyMultipart);

app.register(videoAPIRoutes,{ prefix:'/api/videos'})

//testing api 
app.get('/not-found', (req,res) => {
  res.callNotFound();
});

//centralized error handler
app.setErrorHandler(async (err,req,res) => {
  if(err.validation) {
    res.code(err.statusCode || 403);
    return { error :err.message};
  } 
  if(err.mimeType) {
    res.code(err.statusCode);
    return { error: err.message } ;
  }
  req.log.error({err});
  res.code(err.statusCode || 500);
  return 'Error while processing request';
});

app.setNotFoundHandler(async (req,res) => {
    res.code(404);
    res.send({
      status:"error",
      message:"Can't find my way!"
    });
});

try {
    await app.listen({ port: PORT, host: HOST });
} catch (err) {
    console.error(err);
    process.exit(1);
}