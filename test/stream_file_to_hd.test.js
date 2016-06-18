'use strict';

const BPromise = require('bluebird');
const random   = require('charlatan');
const fs       = require('fs');
const tmp      = BPromise.promisifyAll(require('tmp'));
// const fs     = BPromise.promisifyAll(require('fs'));
const expect = require('chai').expect;

const stream_file_to_hd = require('../lib/stream_file_to_hd');

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

    it('should return a promise', () => {
      const file_stream = fs.createReadStream(source_file_path);
      expect(stream_file_to_hd(file_stream).then).to.exist;
    });

    it('should return created file and hash', done => {
      const file_stream = fs.createReadStream(source_file_path);
      stream_file_to_hd(file_stream)
        .then(file_info => {
          expect(file_info.path).to.exist;
          expect(file_info.hash).to.exist;
          return done();
        })
        .catch(error => {
          throw error;
        });
    });
  });
});
