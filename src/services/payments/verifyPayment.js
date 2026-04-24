const { coreApi } = require('../../utils/midtrans');
const { PaymentNotificationDto } = require('../../dtos/payments');
const logPaymentEvent = require('./logPaymentEvent');
const processPaymentUpdate = require('./processPaymentUpdate');

const verifyPayment = async (orderId) => {
  if (!orderId) throw new Error('orderId is required');

  const statusResponse = await coreApi.transaction.status(orderId);
  const paymentDto = PaymentNotificationDto.fromMidtransRaw(statusResponse);
  const result = await processPaymentUpdate(paymentDto);

  return {
    result,
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
    result = verification.result;
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
