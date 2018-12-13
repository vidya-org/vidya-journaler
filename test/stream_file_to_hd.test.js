'use strict';

const random   = require('charlatan');
const tmp      = Bluebird.promisifyAll(require('tmp'));
const fs       = Bluebird.promisifyAll(require('fs'));
const expect   = require('chai').expect;

const stream_file_to_hd = require('../lib/stream_file_to_hd');

describe('Stream file to hd', () => {
  describe('calling the function', () => {
    let original_file_contents;
    let source_file_path;
    before(() => {
      original_file_contents = random.Lorem.text(10);

      return tmp.fileAsync({ mode: 0o640, prefix: 'vidya_journaler_test_' })
        .then(tmp_file => (source_file_path = tmp_file))
        .then(() => fs.writeFileSync(source_file_path, original_file_contents));
    });

    it('should return a promise', () => {
      const file_stream = fs.createReadStream(source_file_path);

      expect(stream_file_to_hd(file_stream).then).to.exist;
    });

    it('should return created file and hash', () => {
      const file_stream = fs.createReadStream(source_file_path);

      return stream_file_to_hd(file_stream)
        .then(file_info => {
          expect(file_info.path).to.exist;
          expect(file_info.hash).to.exist;
        });
    });

    it('the saved file should have the original contents', () => {
      const original_file_stream = fs.createReadStream(source_file_path);

      return stream_file_to_hd(original_file_stream)
        .then(file_info => fs.readFileAsync(file_info.path, 'utf8'))
        .then(new_contents => {
          expect(new_contents).to.be.equal(original_file_contents);
        });
    });
  });
});
