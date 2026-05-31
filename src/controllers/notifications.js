const {
  getPaymentNotifications,
  markPaymentNotificationsRead,
} = require('../services/notifications/paymentNotifications');

const GetPaymentNotifications = async (req, res, next) => {
  try {
    const result = await getPaymentNotifications(req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const MarkPaymentNotificationsRead = async (req, res, next) => {
  try {
    const result = await markPaymentNotificationsRead(req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  GetPaymentNotifications,
  MarkPaymentNotificationsRead,
};

