'use strict';

// const filename = 'log_' + datetime.getTime() + '_' + randomNumber.toFixed(6) + '_' + crypto.createHash('md5').update(data).digest('hex');

module.exports = (hash) => {
  const timestamp = new Date().getTime();
  const random_number = (Math.random() * 999999).toFixed(6);

  return `log_${timestamp}_${random_number}_4`;
};
