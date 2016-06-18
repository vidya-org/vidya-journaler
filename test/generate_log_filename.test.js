'use strict';

const crypto = require('crypto');
const expect = require('chai').expect;

const generate_log_filename = require('../lib/generate_log_filename');

describe('Filename generator', _ => {
  describe('the generated filename', _ => {
    let generated_filename;
    const hash = crypto.createHash('md5').update('filename generator test').digest('hex');
    before(done => {
      generated_filename = generate_log_filename(hash);
      done();
    });

    it('should have 4 fields separated by underscore', done => {
      const fields = generated_filename.split('_');

      expect(fields).to.have.lengthOf(4);

      done();
    });
  });
});
