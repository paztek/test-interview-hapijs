'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const jwt =require('jsonwebtoken');

const { init } = require('../src/lib/server');

const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

describe('GET /', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    /*
    describe('When not authenticated', () => {

        it('returns a HTTP 401', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/'
            });

            expect(res.statusCode).to.equal(401);
        });
    });
     */

    describe('When authenticated', () => {

        let token;

        const secret = 'AZERTYUIOP';

        const user = {
            id: 12345,
            username: 'matthieu',
        };

        beforeEach(() => {
            token = jwt.sign(user, secret);
        });

        it('returns a HTTP 200', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal({ foo: 'bar' });
        });
    });
});
