const { Router } = require('express');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { FINANCE_ROLES } = require('../utils/roles');
const {
  GetPaymentNotifications,
  MarkPaymentNotificationsRead,
} = require('../controllers/notifications');

const router = Router();

router.get('/payments', JWTValidation, requireRoles(FINANCE_ROLES), GetPaymentNotifications);
router.post('/payments/read', JWTValidation, requireRoles(FINANCE_ROLES), MarkPaymentNotificationsRead);

module.exports = router;

