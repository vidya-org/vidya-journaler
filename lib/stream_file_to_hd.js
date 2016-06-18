'use strict';

const BPromise = require('bluebird');
const fs       = require('fs');
const crypto   = require('crypto');
const tmp      = BPromise.promisifyAll(require('tmp'));

module.exports = (input_stream) => {
  return new BPromise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    let new_file_path;
    tmp.fileAsync({ mode: 0o600, prefix: 'vj_' })
      .then(tmp_file_path => {
        new_file_path = tmp_file_path;
        return fs.createWriteStream(tmp_file_path);
      })
      .then(output_stream => {
        input_stream.on('data', chunk => {
          hash.update(chunk);
          output_stream.write(chunk);
        });
        input_stream.on('end', _ => {
          output_stream.end();
          resolve({
            path: new_file_path,
            hash: hash.digest('hex')
          });
        });
      });
  });
};
