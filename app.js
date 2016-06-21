'use strict';

const http = require('http');
const path = require('path');
const url  = require('url');
const auth = require('http-auth');
const HttpStatusCodes = require('http-status-codes');

const basic_auth = auth.basic({
  realm: 'Vidya',
  file:  path.join(__dirname, '/test/test_files/htpasswd')
});

const app = (request, response) => {
  const target_url = url.parse(request.url);

  if (target_url.path !== '/') {
    response.writeHead(HttpStatusCodes.NOT_FOUND, {'Content-Type': 'text/plain'});
    return response.end();
  }

  response.end();
};

module.exports = http.createServer(basic_auth, app);
