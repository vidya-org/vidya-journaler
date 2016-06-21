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
        .send()
        .expect(HttpStatusCodes.UNAUTHORIZED)
        .end(done);
    });
  });
});
