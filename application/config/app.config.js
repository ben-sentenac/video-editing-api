import process from 'node:process';
import path from 'node:path';
import { fastifyEnv } from '@fastify/env';
import { fileURLToPath } from 'node:url';
import { envSchema } from './app.env.schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '..');
//mysql://user:password@host:port/dbName

const configOptions = {
    confKey: 'config',
    schema: envSchema,
    dotenv: {
        path: path.resolve(envPath, '.env'),
        debug: true
    },
    data: process.env
};

async function getEnv(instance) {
    instance.register(fastifyEnv, configOptions);
    //call this to be sure the plugn has loaded before return 
    await instance.after();
    return {
        name: process.env.APP_NAME,
        host: process.env.APP_SERVER_HOST,
        port: process.env.APP_SERVER_PORT,
        mode: process.env.MODE,
        db: {
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            host: process.env.MYSQL_HOST || '127.0.0.1',
            port: process.env.MYSQL_PORT || 3306,
            database: process.env.MYSQL_DB_NAME
        }
    }
}
export {
    getEnv
};