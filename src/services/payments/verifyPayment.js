const { coreApi } = require('../../utils/midtrans');
const { PaymentNotificationDto } = require('../../dtos/payments');
const logPaymentEvent = require('./logPaymentEvent');
const processPaymentUpdate = require('./processPaymentUpdate');
const {
  PAYMENT_SESSION_STATES,
  getMidtransStatusOrNull,
  getPaymentSessionState,
} = require('./midtransGatewayState');

const verifyPayment = async (orderId) => {
  if (!orderId) throw new Error('orderId is required');

  const statusResponse = await getMidtransStatusOrNull(coreApi, orderId);
  if (!statusResponse) {
    return {
      result: {
        message: 'Payment session has not been started in Midtrans.',
        paymentStatus: null,
        paymentSessionState: PAYMENT_SESSION_STATES.NOT_STARTED,
      },
      payload: { order_id: orderId },
      paymentStatus: null,
    };
  }

  const paymentDto = PaymentNotificationDto.fromMidtransRaw(statusResponse);
  const result = await processPaymentUpdate(paymentDto);

  return {
    result: {
      ...result,
      paymentSessionState: getPaymentSessionState(paymentDto),
    },
    payload: statusResponse,
    paymentStatus: paymentDto.paymentStatus,
  };
};

const verifyPaymentWithLogging = async (orderId, opts = {}) => {
  let result;
  let error = null;
  let payload = { order_id: orderId };
  let paymentStatus = null;

  try {
    const verification = await verifyPayment(orderId, opts);
    result = {
      ...verification.result,
      paymentStatus: verification.result?.paymentStatus || verification.paymentStatus || null,
    };
    payload = verification.payload || payload;
    paymentStatus = verification.paymentStatus || null;
    return result;
  } catch (err) {
    error = err.message;
    throw err;
  } finally {
    await logPaymentEvent({
      source: 'verify',
      payload,
      paymentStatus,
      processed: !error,
      error,
      ipAddress: opts.ipAddress,
    });
  }
};

module.exports = verifyPaymentWithLogging;
