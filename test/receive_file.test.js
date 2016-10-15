'use strict';

const Bluebird         = require('bluebird');
const random           = require('charlatan');
const expect           = require('chai').expect;
const Log              = require('../lib/models').Log;
const tmp              = Bluebird.promisifyAll(require('tmp'));
const fs               = Bluebird.promisifyAll(require('fs'));
const request          = require('supertest');
const HttpStatusCodes  = require('http-status-codes');
const app              = require('../app');

describe('Main API', () => {
  describe('on connection', () => {
    it('should reject unknown sender', done => {
      request(app)
        .put('/')
        .expect(HttpStatusCodes.UNAUTHORIZED)
        .end(done);
    });

    it('should reject URLs different from /', done => {
      request(app)
        .put('/someurl')
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.NOT_FOUND)
        .end(done);
    });

    it('should reject Http Method that differs from PUT', done => {
      request(app)
        .post('/')
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.METHOD_NOT_ALLOWED)
        .end(done);
    });
  });

  describe('receive log file', () => {
    let source_file_path;

    before(() => {
      const log_content = random.Lorem.text(10);

      return tmp.fileAsync({ mode: 0o600, prefix: 'vidya_journaler_test_' })
        .then(tmp_file => (source_file_path = tmp_file))
        .then(() => fs.writeFileAsync(source_file_path, log_content));
    });

    beforeEach(() => Log.remove({}));

    it('should accept file', done => {
      request(app)
        .put('/')
        .attach('filename', source_file_path)
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.OK)
        .end(done);
    });

    it('should store file on database', done => {
      request(app)
        .put('/')
        .attach('filename', source_file_path)
        .auth('some_user1', 'some_pass1')
        .expect(HttpStatusCodes.OK)
        .end((err, message) => {
          expect(err).to.be.null;

          Log.find({})
            .then(logs => {
              expect(logs).to.have.lengthOf(1);
              done();
            })
            .catch(done);
        });
    });
  });
});
