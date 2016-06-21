'use strict';

// const BPromise = require('bluebird');
const expect           = require('chai').expect;
const request          = require('supertest');
const HttpStatusCodes  = require('http-status-codes');
const app              = require('../app');

describe('Main API', _ => {
  describe('on connection', _ => {
    it('should reject unknown sender', done => {
      request(app)
        .put('/')
        .expect(HttpStatusCodes.UNAUTHORIZED)
        .end(done);
    });

    it('should accept known sender', done => {
      request(app)
        .put('/')
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.OK)
        .end(done);
    });

    it('should reject URLs different from /', done => {
      request(app)
        .put('/someurl')
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.NOT_FOUND)
        .end(done);
    });
  });
});
