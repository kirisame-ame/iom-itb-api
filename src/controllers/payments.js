const { StatusCodes } = require('http-status-codes');
const { createDonationSnapToken, createTransactionSnapToken } = require('../services/payments/createSnapToken');
const handleMidtransNotification = require('../services/payments/handleNotification');
const verifyPayment = require('../services/payments/verifyPayment');

const CreateSnapToken = async (req, res) => {
  try {
    const { type, payload } = req.body;
    let result;

    if (type === 'donation') {
      result = await createDonationSnapToken(payload);
    } else if (type === 'transaction') {
      result = await createTransactionSnapToken(payload);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ status: 400, message: 'Invalid type. Use "donation" or "transaction"' });
    }

    return res.status(StatusCodes.OK).json({ status: 200, message: 'Snap token created', data: result });
  } catch (error) {
    return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: error.status || 500,
      message: error.message,
    });
  }
};

const HandleNotification = async (req, res) => {
  try {
    const result = await handleMidtransNotification(req.body);
    const httpStatus = result?.status && Number.isInteger(result.status) ? result.status : StatusCodes.OK;
    return res.status(httpStatus).json({ status: httpStatus, ...result });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 500, message: error.message });
  }
};

const VerifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log('[VerifyPayment] orderId:', orderId);
    const result = await verifyPayment(orderId);
    return res.status(StatusCodes.OK).json({ status: 200, ...result });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 500, message: error.message });
  }
};

module.exports = { CreateSnapToken, HandleNotification, VerifyPayment };
