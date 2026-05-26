const { Router } = require('express');
const { CreateSnapToken, HandleNotification, VerifyPayment, CancelPayment } = require('../controllers/payments');
const { createRateLimiter } = require('../middlewares/rateLimit');
const midtransIpAllowlist = require('../middlewares/midtransIpAllowlist');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { FINANCE_ROLES } = require('../utils/roles');

const router = Router();

const snapLimiter = createRateLimiter({ windowMs: 60_000, max: 30, keyPrefix: 'snap' });
const notificationLimiter = createRateLimiter({ windowMs: 60_000, max: 120, keyPrefix: 'notif' });
const verifyLimiter = createRateLimiter({ windowMs: 60_000, max: 20, keyPrefix: 'verify' });
const cancelLimiter = createRateLimiter({ windowMs: 60_000, max: 20, keyPrefix: 'cancel' });

router.post('/snap-token', snapLimiter, CreateSnapToken);
router.post('/notification', notificationLimiter, midtransIpAllowlist, HandleNotification);
router.post('/verify', verifyLimiter, JWTValidation, requireRoles(FINANCE_ROLES), VerifyPayment);
router.post('/cancel', cancelLimiter, JWTValidation, requireRoles(FINANCE_ROLES), CancelPayment);

module.exports = router;
