'use strict';

const debug = require('debug')('vidya:server');
const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => debug('listening on port ' + app.address().port));

// console.log(app);
