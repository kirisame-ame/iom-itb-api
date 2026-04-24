const { StatusCodes } = require('http-status-codes');
const { Donations, Transactions } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const GetPaymentStatus = async (orderId) => {
  if (!orderId) {
    throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'orderId is required' });
  }

  if (orderId.startsWith('DONATION-')) {
    const donation = await Donations.findOne({
      where: { midtrans_order_id: orderId },
    });
    if (!donation) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Donation not found' });
    }
    return {
      scope: 'donation',
      orderId,
      paymentMethod: donation.paymentMethod,
      paymentStatus: donation.paymentStatus,
      paymentType: donation.paymentType,
      paidAt: donation.paidAt,
      grossAmount: donation.grossAmount,
    };
  }

  if (orderId.startsWith('IOM-')) {
    const trx = await Transactions.findOne({ where: { code: orderId } });
    if (!trx) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Transaction not found' });
    }
    return {
      scope: 'transaction',
      orderId,
      code: trx.code,
      paymentMethod: trx.paymentMethod,
      paymentStatus: trx.paymentStatus,
      paymentType: trx.paymentType,
      vaNumber: trx.vaNumber,
      paidAt: trx.paidAt,
      expiredAt: trx.expiredAt,
      status: trx.status,
      grossAmount: trx.grossAmount,
    };
  }

  throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'Unknown orderId prefix' });
};

module.exports = GetPaymentStatus;
