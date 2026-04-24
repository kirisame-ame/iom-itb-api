const { coreApi } = require('../../utils/midtrans');
const { PaymentNotificationDto } = require('../../dtos/payments');
const logPaymentEvent = require('./logPaymentEvent');
const processPaymentUpdate = require('./processPaymentUpdate');

const cancelPayment = async (orderId) => {
  if (!orderId) throw new Error('orderId is required');

  await coreApi.transaction.cancel(orderId);
  const statusResponse = await coreApi.transaction.status(orderId);
  const paymentDto = PaymentNotificationDto.fromMidtransRaw(statusResponse);
  const result = await processPaymentUpdate(paymentDto);

  return {
    result,
    payload: statusResponse,
    paymentStatus: paymentDto.paymentStatus,
  };
};

const cancelPaymentWithLogging = async (orderId, opts = {}) => {
  let result;
  let error = null;
  let payload = { order_id: orderId };
  let paymentStatus = null;

  try {
    const cancellation = await cancelPayment(orderId);
    result = {
      ...cancellation.result,
      paymentStatus: cancellation.result?.paymentStatus || cancellation.paymentStatus || null,
    };
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
