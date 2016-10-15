'use strict';

const crypto = require('crypto');
const expect = require('chai').expect;

const generate_log_filename = require('../lib/generate_log_filename');

describe('Filename generator', () => {
  describe('the generated filename', () => {
    let generated_filename;
    const hash = crypto.createHash('md5').update('filename generator test').digest('hex');

    before(() => {
      generated_filename = generate_log_filename(hash);
    });

    it('should have 4 fields separated by underscore', () => {
      const fields = generated_filename.split('_');

      expect(fields).to.have.lengthOf(4);
    });

    it('should have \'log\' as the first field', () => {
      const first_field = generated_filename.split('_')[0];

      expect(first_field).to.be.equal('log');
    });

    it('should have a numeric timestamp as the second field', () => {
      const second_field = generated_filename.split('_')[1];

      expect(second_field).to.match(/^[0-9]+$/);
    });

    it('should have a random number as the third field', () => {
      const third_field = generated_filename.split('_')[2];

      expect(third_field).to.match(/^[0-9]+[.][0-9]+$/);
    });

    it('should have received hash as the forth field', () => {
      const forth_field = generated_filename.split('_')[3];

      expect(forth_field).to.equal(hash);
    });
  });
});
