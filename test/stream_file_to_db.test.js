'use strict';

const Bluebird = require('bluebird');
const random   = require('charlatan');
const tmp      = Bluebird.promisifyAll(require('tmp'));
const fs       = Bluebird.promisifyAll(require('fs'));
const expect   = require('chai').expect;

const stream_file_to_bd = require('../lib/stream_file_to_bd');
const Log               = require('../lib/models').Log;

describe('Stream file to db', () => {
  describe('calling the function', () => {
    let original_file_contents;
    let source_file_path;

    before(() => {
      original_file_contents = random.Lorem.text(10);

      return tmp.fileAsync({ mode: 0o640, prefix: 'vidya_journaler_test_' })
        .then(tmp_file => (source_file_path = tmp_file))
        .then(tmp_file => fs.writeFileSync(source_file_path, original_file_contents));
    });

    beforeEach(() => Log.remove({}));

    it('should return a promise', () => {
      const file_stream = fs.createReadStream(source_file_path);

      expect(stream_file_to_bd(file_stream).then).to.exist;
    });

    it('should return a Log.create promise', () => {
      const file_stream = fs.createReadStream(source_file_path);

      return stream_file_to_bd(file_stream)
        .then(log => {
          expect(log.date).to.exist;
          expect(log.text).to.exist;
        });
    });

    it('should store contents correctly', () => {
      const file_stream = fs.createReadStream(source_file_path);

      return stream_file_to_bd(file_stream)
        .then(log => {
          expect(log.text).to.be.equal(original_file_contents);
        });
    });
  });
});
