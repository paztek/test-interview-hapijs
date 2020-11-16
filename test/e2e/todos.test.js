'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const jwt =require('jsonwebtoken');

const { init } = require('../../src/lib/server');

const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

describe('CRUD /todos', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    describe('When not authenticated', () => {

        it('returns a HTTP 401', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/todos',
            });

            expect(res.statusCode).to.equal(401);
        });
    });

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

        describe('GET /todos', () => {

            it('returns a HTTP 200 with the list of todos', async () => {
                const res = await server.inject({
                    method: 'get',
                    url: '/todos',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.instanceOf(Array);
                expect(res.result).to.have.length(3);
            });
        });

        describe('POST /todos', () => {

            it('returns a HTTP 201 with the newly created todo', async () => {
                const payload = {
                    label: 'Answer correctly',
                    done: false,
                };

                const res = await server.inject({
                    method: 'post',
                    url: '/todos',
                    payload,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                expect(res.statusCode).to.equal(201);
                expect(res.result.id).to.be.exist();
                expect(res.result).to.contain(payload);
            });
        });

        describe('GET /todos/:id', () => {

            it('returns a HTTP 200 with the desired todo', async () => {
                const id = 2;

                const res = await server.inject({
                    method: 'post',
                    url: `/todos/${id}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.equal(id);
            });
        });

        describe('PUT /todos/:id', () => {

            it('returns a HTTP 200 with the updated todo', async () => {
                const id = 2;

                const payload = {
                    label: 'My updated todo',
                    done: true,
                };

                const res = await server.inject({
                    method: 'put',
                    url: `/todos/${id}`,
                    payload,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                expect(res.statusCode).to.equal(200);
                expect(res.result.id).to.equal(id);
                expect(res.result).to.contain(payload);
            });
        });
    });
});
