const { PaymentEvents } = require('../../models');
const { PaymentNotificationDto } = require('../../dtos/payments');

const logPaymentEvent = async ({
  source,
  payload,
  paymentStatus,
  signatureValid,
  processed,
  error,
  ipAddress,
}) => {
  try {
    const orderId = payload?.order_id || 'unknown';
    return await PaymentEvents.create({
      source,
      orderId,
      scope: PaymentNotificationDto.scopeFromOrderId(orderId),
      transactionStatus: payload?.transaction_status || null,
      fraudStatus: payload?.fraud_status || null,
      paymentStatus: paymentStatus || null,
      paymentType: payload?.payment_type || null,
      grossAmount: payload?.gross_amount != null ? Number(payload.gross_amount) : null,
      signatureKey: payload?.signature_key || null,
      signatureValid: typeof signatureValid === 'boolean' ? signatureValid : null,
      rawPayload: payload || null,
      processed: !!processed,
      error: error || null,
      ipAddress: ipAddress || null,
    });
  } catch (err) {
    console.error('[logPaymentEvent] failed to persist event:', err.message);
    return null;
  }
};

module.exports = logPaymentEvent;
