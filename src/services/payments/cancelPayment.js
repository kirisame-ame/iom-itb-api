const { coreApi } = require('../../utils/midtrans');
const { PaymentNotificationDto } = require('../../dtos/payments');
const logPaymentEvent = require('./logPaymentEvent');
const processPaymentUpdate = require('./processPaymentUpdate');
const {
  PAYMENT_SESSION_STATES,
  getMidtransStatusOrNull,
  getPaymentSessionState,
} = require('./midtransGatewayState');

const TERMINAL_STATUSES = new Set(['failed', 'expired', 'refunded']);

const syncMidtransStatus = async (statusResponse) => {
  const paymentDto = PaymentNotificationDto.fromMidtransRaw(statusResponse);
  const result = await processPaymentUpdate(paymentDto);

  return {
    result: {
      ...result,
      paymentStatus: result?.paymentStatus || paymentDto.paymentStatus || null,
    },
    payload: statusResponse,
    paymentStatus: paymentDto.paymentStatus,
    transactionStatus: paymentDto.transactionStatus,
  };
};

const cancelPayment = async (orderId) => {
  if (!orderId) throw new Error('orderId is required');

  const currentStatus = await getMidtransStatusOrNull(coreApi, orderId);

  if (!currentStatus) {
    return {
      result: {
        message: 'Payment session has not been started in Midtrans.',
        paymentStatus: null,
        paymentSessionState: PAYMENT_SESSION_STATES.NOT_STARTED,
      },
      payload: { order_id: orderId },
      paymentStatus: null,
      transactionStatus: null,
    };
  }

  const current = PaymentNotificationDto.fromMidtransRaw(currentStatus);

  if (current.paymentStatus === 'settlement') {
    return {
      result: {
        message: 'Settled transaction cannot be canceled.',
        paymentStatus: 'settlement',
        paymentSessionState: PAYMENT_SESSION_STATES.SETTLEMENT,
      },
      payload: currentStatus,
      paymentStatus: current.paymentStatus,
      transactionStatus: current.transactionStatus,
    };
  }

  if (TERMINAL_STATUSES.has(current.paymentStatus) || current.transactionStatus === 'cancel') {
    const synced = await syncMidtransStatus(currentStatus);
    return {
      ...synced,
      result: {
        ...synced.result,
        paymentSessionState: getPaymentSessionState(synced),
      },
    };
  }

  if (current.transactionStatus === 'pending') {
    await coreApi.transaction.expire(orderId);
  } else if (current.transactionStatus === 'capture') {
    await coreApi.transaction.cancel(orderId);
  } else {
    return {
      result: {
        message: `Transaction with status ${current.transactionStatus || current.paymentStatus} cannot be canceled.`,
        paymentStatus: current.paymentStatus,
        paymentSessionState: PAYMENT_SESSION_STATES.UNCHANGED,
      },
      payload: currentStatus,
      paymentStatus: current.paymentStatus,
      transactionStatus: current.transactionStatus,
    };
  }

  const refreshedStatus = await coreApi.transaction.status(orderId);
  const synced = await syncMidtransStatus(refreshedStatus);

  return {
    ...synced,
    result: {
      ...synced.result,
      paymentSessionState: getPaymentSessionState(synced),
    },
  };
};

const cancelPaymentWithLogging = async (orderId, opts = {}) => {
  let result;
  let error = null;
  let payload = { order_id: orderId };
  let paymentStatus = null;

  try {
    const cancellation = await cancelPayment(orderId);
    result = cancellation.result;
    payload = cancellation.payload || payload;
    paymentStatus = cancellation.paymentStatus || null;
    return result;
  } catch (err) {
    error = err.message;
    throw err;
  } finally {
    await logPaymentEvent({
      source: 'system',
      payload,
      paymentStatus,
      processed: !error,
      error,
      ipAddress: opts.ipAddress,
    });
  }
};

module.exports = cancelPaymentWithLogging;
