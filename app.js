'use strict';

const http = require('http');
const path = require('path');
const auth = require('http-auth');

const basic_auth = auth.basic({
  realm: 'Vidya',
  file:  path.join(__dirname, '/test/test_files/htpasswd')
});

const app = (request, response) => {

  response.end();
};

module.exports = http.createServer(basic_auth, app);
