import { describe, it, after } from "node:test";
import assert from "node:assert";
import formAutoContent from "form-auto-content"
import { buildServer } from "../../../server.js";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readdir, rm } from "node:fs/promises";


const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);


async function purgeStorage() {
    const storageDir = await readdir('./storage', 'utf-8');
    for (const dir of storageDir) {
        await rm(path.resolve('storage', dir), { recursive: true });
    }
}

describe('test videos routes', async () => {

    after(async () => {
        await purgeStorage();
    });

    const app = (await buildServer()).app;


    it('should upload', async () => {

        const form = formAutoContent({
            myFile: createReadStream(path.join(__dirname, 'fixtures', 'video.mp4'))
        });

        const response = await app.inject({
            method: 'POST',
            url: '/api/videos/upload',
            ...form
        });

        assert.equal(response.statusCode, 201, 'should be 201');
        assert.equal(response.json().status, 'OK');

    });

    it('should get all videos', async () => {

        const response = await app.inject({
            method: 'GET',
            url: '/api/videos'
        });

        assert.equal(response.statusCode, 200, 'should be 200');
        assert.equal(response.json().status, 'OK');

    });

});