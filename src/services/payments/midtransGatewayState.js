const PAYMENT_SESSION_STATES = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  TERMINAL: 'terminal',
  SETTLEMENT: 'settlement',
  UNCHANGED: 'unchanged',
};

const toSearchableText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (_) {
    return String(value);
  }
};

const isMidtransNotFoundError = (error) => {
  const httpStatusCode = Number(
    error?.httpStatusCode
    || error?.statusCode
    || error?.status
    || error?.ApiResponse?.status_code
    || error?.rawHttpClientData?.status
    || 0
  );
  const errorText = [
    toSearchableText(error?.message),
    toSearchableText(error?.ApiResponse),
    toSearchableText(error?.rawHttpClientData),
  ]
    .filter(Boolean)
    .join(' ');

  return httpStatusCode === 404
    || errorText.includes('"status_code":"404"')
    || errorText.includes('"status_code":404')
    || errorText.includes('HTTP status code: 404')
    || errorText.includes('requested resource is not found')
    || errorText.includes("Transaction doesn't exist");
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
