'use strict';

const BPromise = require('bluebird');
const random   = require('charlatan');
const tmp      = BPromise.promisifyAll(require('tmp'));
const fs       = BPromise.promisifyAll(require('fs'));
const expect   = require('chai').expect;

const stream_file_to_bd = require('../lib/stream_file_to_bd');
const Log               = require('../lib/models').Log;

describe('Stream file to hd', _ => {
  describe('calling the function', _ => {
    let original_file_contents;
    let source_file_path;
    before(done => {
      original_file_contents = random.Lorem.text(10);

      tmp.fileAsync({ mode: 0o640, prefix: 'vidya_journaler_test_' })
        .then(tmp_file => {
          source_file_path = tmp_file;

          return fs.writeFileSync(source_file_path, original_file_contents);
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

    it('should return a promise', done => {
      const file_stream = fs.createReadStream(source_file_path);
      expect(stream_file_to_bd(file_stream).then).to.exist;
      done();
    });

    it('should return a Log.create promise', done => {
      const file_stream = fs.createReadStream(source_file_path);
      return stream_file_to_bd(file_stream)
        .then(log => {
          expect(log.date).to.exist;
          expect(log.text).to.exist;
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it('should store contents correctly', done => {
      const file_stream = fs.createReadStream(source_file_path);
      return stream_file_to_bd(file_stream)
        .then(log => {
          expect(log.text).to.be.equal(original_file_contents);
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });
});
