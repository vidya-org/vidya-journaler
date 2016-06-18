'use strict';

module.exports = (hash) => {
  const timestamp = new Date().getTime();
  const random_number = (Math.random() * 999999).toFixed(6);

  return `log_${timestamp}_${random_number}_${hash}`;
};
