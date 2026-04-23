const { Router } = require('express');
const { CreateSnapToken, HandleNotification, VerifyPayment } = require('../controllers/payments');

const router = Router();

router.post('/snap-token', CreateSnapToken);
router.post('/notification', HandleNotification);
router.post('/verify', VerifyPayment);

module.exports = router;
