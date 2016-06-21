'use strict';

const fs       = require('fs');
const path     = require('path');
const debug    = require('debug')('vidya:database_connect');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const DB_NAME = process.env.DB_NAME || 'test';

debug('Connecting with database...');
mongoose.connect('mongodb://localhost/' + DB_NAME, {
  server: {
    poolSize: 5
  },
  user:   process.env.DB_USER || '',
  pass:   process.env.DB_PASS || '',
  config: {
    autoIndex: true
  }
});

// Useful for debugging DB
// if (process.env.NODE_ENV === 'test') {
//   mongoose.set('debug', true);
// }

const db = mongoose.connection;

db.on('error', debug.bind('connection error:'));

db.once('open', () => {
  debug('Database connected!');
});

const database = {
  connection: db
};

fs.readdirSync(__dirname)
  .filter(ignore_bad_ext_files)
  .filter(ignore_folders)
  .forEach((file) => {
    const modelName = file.split('.')[0];

    database[modelName] = require(path.join(__dirname, file));
  });

module.exports = database;

function ignore_folders (file) {
  return fs.lstatSync(`${__dirname}/${file}`).isFile();
}

function ignore_bad_ext_files (file) {
  return ((file.indexOf('.') !== 0) && (file !== 'index.js'));
}
