import { buildServer } from "./server.js";
import process from "node:process";

let server = null;

try {

    const { app, host, port } = await buildServer({logger:true});

    server =  app.listen({port,host});
    
} catch (error) {
    server.log.error(error);
    process.exit(1);
}