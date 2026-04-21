const { Router } = require('express');
const {
  CreateSnapTokenHandler,
  NotificationHandler,
  PaymentStatusHandler,
} = require('../controllers/payments');

const router = Router();

// Public endpoints: snap-token is called from the public donation/merch forms,
// notification must be public and authenticated only via Midtrans signature
// (verified server-side inside the handler via coreApi.transaction.notification).
router.post('/snap-token', CreateSnapTokenHandler);
router.post('/notification', NotificationHandler);
router.get('/status/:orderId', PaymentStatusHandler);

module.exports = router;
