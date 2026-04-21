const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const CreateSnapToken = require('../services/payments/createSnapToken');
const HandleNotification = require('../services/payments/handleNotification');
const GetPaymentStatus = require('../services/payments/getPaymentStatus');
const { clientKey, isProduction } = require('../config/midtrans');

const CreateSnapTokenHandler = async (req, res) => {
  try {
    const { type, payload } = req.body || {};
    const result = await CreateSnapToken({ type, payload });
    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Snap token created',
      data: { ...result, clientKey, isProduction },
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create snap token',
    }));
  }
};

const NotificationHandler = async (req, res) => {
  try {
    const result = await HandleNotification(req.body);
    res.status(StatusCodes.OK).json({ ok: true, ...result });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[midtrans-webhook] failed:', error.message);
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({ ok: false, message: error.message });
  }
};

const PaymentStatusHandler = async (req, res) => {
  try {
    const data = await GetPaymentStatus(req.params.orderId);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Payment status fetched',
      data,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to fetch status',
    }));
  }
};

module.exports = {
  CreateSnapTokenHandler,
  NotificationHandler,
  PaymentStatusHandler,
};
