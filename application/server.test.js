import { describe,it } from "node:test";
import assert from "node:assert";

import { buildServer } from "./server.js";

describe('server should work correctly', async () => {

    const app = (await buildServer()).app;

    it('it should send 404 status code on not found route test', async () => {
    
        const response = await app.inject({
            method:'GET',
            url:'/not-'
        });
    
        assert.equal(response.statusCode, 404, 'should be 404');
        assert.deepStrictEqual(response.json(), {status:'error',message:'Can\'t find my way!'}, 'should responsd not found');
    
    });
    
    it('it should send 200 status code on healthcheck route test', async () => {
    
        const response = await app.inject({
            method:'GET',
            url:'/healthcheck'
        });
    
        assert.equal(response.statusCode, 200, 'should be 200');
        assert.deepStrictEqual(response.json(), {status:'OK'}, 'should respond OK');
    
    });
    
});

