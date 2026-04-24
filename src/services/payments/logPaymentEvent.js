const { PaymentEvents } = require('../../models');

const scopeFromOrderId = (orderId) => {
  if (!orderId) return 'unknown';
  if (orderId.startsWith('DONATION-')) return 'donation';
  if (orderId.startsWith('IOM-')) return 'transaction';
  return 'unknown';
};

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
      scope: scopeFromOrderId(orderId),
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
