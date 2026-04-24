const crypto = require('crypto');
const { coreApi } = require('../../utils/midtrans');
const { PaymentNotificationDto } = require('../../dtos/payments');
const logPaymentEvent = require('./logPaymentEvent');
const processPaymentUpdate = require('./processPaymentUpdate');

const verifySignature = (body) => {
  const { order_id, status_code, gross_amount, signature_key } = body || {};
  if (!signature_key) return false;

  const expected = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY || ''}`)
    .digest('hex');

  return expected === signature_key;
};

const handleMidtransNotification = async (body, { ipAddress } = {}) => {
  const signatureValid = verifySignature(body);
  if (!signatureValid) {
    await logPaymentEvent({
      source: 'notification',
      payload: body,
      signatureValid: false,
      processed: false,
      error: 'Invalid signature',
      ipAddress,
    });

    return { status: 401, message: 'Invalid signature' };
  }

  let notification;
  let paymentDto;
  let processError = null;

  try {
    notification = await coreApi.transaction.notification(body);
    paymentDto = PaymentNotificationDto.fromMidtransRaw(notification);
    return await processPaymentUpdate(paymentDto);
  } catch (error) {
    processError = error.message;
    throw error;
  } finally {
    await logPaymentEvent({
      source: 'notification',
      payload: notification || body,
      paymentStatus: paymentDto?.paymentStatus,
      signatureValid: true,
      processed: !processError,
      error: processError,
      ipAddress,
    });
  }
};

module.exports = handleMidtransNotification;
