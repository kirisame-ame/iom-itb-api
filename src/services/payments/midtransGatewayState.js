const PAYMENT_SESSION_STATES = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  TERMINAL: 'terminal',
  SETTLEMENT: 'settlement',
  UNCHANGED: 'unchanged',
};

const isMidtransNotFoundError = (error) => {
  const responseBody = error?.ApiResponse || error?.message || '';
  return error?.httpStatusCode === 404
    || String(responseBody).includes('requested resource is not found')
    || String(responseBody).includes("Transaction doesn't exist");
};

const getMidtransStatusOrNull = async (coreApi, orderId) => {
  try {
    return await coreApi.transaction.status(orderId);
  } catch (error) {
    if (isMidtransNotFoundError(error)) {
      return null;
    }
    throw error;
  }
};

const getPaymentSessionState = ({ transactionStatus, paymentStatus } = {}) => {
  if (transactionStatus === 'pending') {
    return PAYMENT_SESSION_STATES.PENDING;
  }
  if (transactionStatus === 'cancel') {
    return PAYMENT_SESSION_STATES.CANCELED;
  }
  if (transactionStatus === 'expire') {
    return PAYMENT_SESSION_STATES.EXPIRED;
  }
  if (paymentStatus === 'settlement' || transactionStatus === 'settlement') {
    return PAYMENT_SESSION_STATES.SETTLEMENT;
  }
  if (paymentStatus === 'failed' || paymentStatus === 'refunded') {
    return PAYMENT_SESSION_STATES.TERMINAL;
  }
  return PAYMENT_SESSION_STATES.UNCHANGED;
};

module.exports = {
  PAYMENT_SESSION_STATES,
  isMidtransNotFoundError,
  getMidtransStatusOrNull,
  getPaymentSessionState,
};
