const { StatusCodes } = require('http-status-codes');
const { Donations, Transactions } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const GetPaymentStatus = async (orderId) => {
  if (!orderId) {
    throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'orderId is required' });
  }

  if (orderId.startsWith('DON-')) {
    const donation = await Donations.findOne({ where: { midtransOrderId: orderId } });
    if (!donation) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Donation not found' });
    }
    return {
      scope: 'donation',
      orderId,
      paymentStatus: donation.paymentStatus,
      grossAmount: donation.grossAmount,
    };
  }

  if (orderId.startsWith('TRX-')) {
    const trx = await Transactions.findOne({ where: { midtransOrderId: orderId } });
    if (!trx) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Transaction not found' });
    }
    return {
      scope: 'transaction',
      orderId,
      code: trx.code,
      paymentStatus: trx.paymentStatus,
      status: trx.status,
      grossAmount: trx.grossAmount,
    };
  }

  throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'Unknown orderId prefix' });
};

module.exports = GetPaymentStatus;
