const crypto = require('crypto');

const ORDER_TRACKING_TOKEN_PREFIX = 'ord_';

const generateOrderTrackingToken = () => {
  return `${ORDER_TRACKING_TOKEN_PREFIX}${crypto.randomBytes(24).toString('base64url')}`;
};

module.exports = {
  generateOrderTrackingToken,
};
