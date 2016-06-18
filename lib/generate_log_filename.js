'use strict';

// const filename = 'log_' + datetime.getTime() + '_' + randomNumber.toFixed(6) + '_' + crypto.createHash('md5').update(data).digest('hex');

module.exports = (hash) => {
  const timestamp = new Date().getTime();

  return `log_${timestamp}_3_4`;
};
