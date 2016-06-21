'use strict';

const BPromise         = require('bluebird');
const random           = require('charlatan');
const expect           = require('chai').expect;
const Log              = require('../lib/models').Log;
const tmp              = BPromise.promisifyAll(require('tmp'));
const fs               = BPromise.promisifyAll(require('fs'));
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

  describe('receive log file', _ => {
    let source_file_path;
    before(done => {
      const log_content = random.Lorem.text(10);

      tmp.fileAsync({ mode: 0o600, prefix: 'vidya_journaler_test_' })
        .then(tmp_file => {
          source_file_path = tmp_file;

          return fs.writeFileAsync(source_file_path, log_content);
        })
        .then(_ => done())
        .catch(error => {
          throw error;
        });
    });

    beforeEach(done => {
      Log.remove({})
        .then(_ => done())
        .catch(error => {
          throw error;
        });
    });

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
          Log.find({}, (err, logs) => {
            expect(err).to.be.null;

            expect(logs).to.have.lengthOf(1);
            return done();
          });
        });
    });
  });
});
