const { Router } = require('express');
const JWTValidation = require('../middlewares/auth');
const {
  GetPaymentNotifications,
  MarkPaymentNotificationsRead,
} = require('../controllers/notifications');

const router = Router();

router.get('/payments', JWTValidation, GetPaymentNotifications);
router.post('/payments/read', JWTValidation, MarkPaymentNotificationsRead);

module.exports = router;

