const { StatusCodes } = require('http-status-codes');
const { Donations, Transactions, sequelize } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');
const { coreApi } = require('../../config/midtrans');
const { decreaseMerchandiseStock } = require('./stockHelper');

const mapStatus = (statusResponse) => {
  const { transaction_status: trxStatus, fraud_status: fraudStatus } = statusResponse;
  if (trxStatus === 'capture') {
    if (fraudStatus === 'accept') return 'settlement';
    if (fraudStatus === 'challenge') return 'pending';
    return 'failed';
  }
  if (trxStatus === 'settlement') return 'settlement';
  if (trxStatus === 'pending') return 'pending';
  if (trxStatus === 'deny' || trxStatus === 'cancel' || trxStatus === 'failure') return 'failed';
  if (trxStatus === 'expire') return 'expired';
  if (trxStatus === 'refund' || trxStatus === 'partial_refund') return 'refunded';
  return 'pending';
};

const FINAL_STATUSES = new Set(['settlement', 'refunded', 'expired', 'failed']);

const HandleMidtransNotification = async (body) => {
  const statusResponse = await coreApi.transaction.notification(body);
  const orderId = statusResponse.order_id;
  const newStatus = mapStatus(statusResponse);
  const midtransTransactionId = statusResponse.transaction_id;

  if (!orderId) {
    throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'order_id missing' });
  }

  if (orderId.startsWith('DON-')) {
    return updateDonation(orderId, newStatus, midtransTransactionId);
  }
  if (orderId.startsWith('TRX-')) {
    return updateTransaction(orderId, newStatus, midtransTransactionId);
  }

  throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: `Unknown order_id prefix: ${orderId}` });
};

const updateDonation = async (orderId, newStatus, midtransTransactionId) => {
  const t = await sequelize.transaction();
  try {
    const donation = await Donations.findOne({ where: { midtransOrderId: orderId }, transaction: t });
    if (!donation) {
      await t.rollback();
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Donation not found for order_id' });
    }

    if (FINAL_STATUSES.has(donation.paymentStatus) && donation.paymentStatus !== 'settlement') {
      await t.rollback();
      return { orderId, newStatus: donation.paymentStatus, changed: false };
    }
    if (donation.paymentStatus === newStatus) {
      await t.rollback();
      return { orderId, newStatus, changed: false };
    }

    donation.paymentStatus = newStatus;
    donation.midtransTransactionId = midtransTransactionId || donation.midtransTransactionId;
    if (newStatus === 'settlement' && !donation.date) {
      donation.date = new Date();
    }
    await donation.save({ transaction: t });

    await t.commit();
    return { orderId, newStatus, changed: true, scope: 'donation' };
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    throw error;
  }
};

const updateTransaction = async (orderId, newStatus, midtransTransactionId) => {
  const t = await sequelize.transaction();
  try {
    const trx = await Transactions.findOne({ where: { midtransOrderId: orderId }, transaction: t });
    if (!trx) {
      await t.rollback();
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Transaction not found for order_id' });
    }

    if (FINAL_STATUSES.has(trx.paymentStatus) && trx.paymentStatus !== 'settlement') {
      await t.rollback();
      return { orderId, newStatus: trx.paymentStatus, changed: false };
    }
    if (trx.paymentStatus === newStatus) {
      await t.rollback();
      return { orderId, newStatus, changed: false };
    }

    const previousStatus = trx.paymentStatus;
    trx.paymentStatus = newStatus;
    trx.midtransTransactionId = midtransTransactionId || trx.midtransTransactionId;

    if (newStatus === 'settlement' && previousStatus !== 'settlement' && trx.status === 'waiting') {
      await decreaseMerchandiseStock({ merchandiseId: trx.merchandiseId, qty: trx.qty }, t);
      trx.status = 'on process';
    }

    await trx.save({ transaction: t });
    await t.commit();
    return { orderId, newStatus, changed: true, scope: 'transaction' };
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    throw error;
  }
};

module.exports = HandleMidtransNotification;
