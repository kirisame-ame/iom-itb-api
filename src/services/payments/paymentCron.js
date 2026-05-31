const cron = require('node-cron');
const expirePendingOrders = require('./expirePendingOrders');

const SCHEDULE = process.env.PAYMENT_EXPIRE_CRON || '*/15 * * * *';

let task = null;

const startPaymentExpiryCron = () => {
  if (task) return task;
  if (process.env.PAYMENT_EXPIRE_CRON_DISABLED === 'true') {
    console.log('[paymentCron] expiry cron disabled via env');
    return null;
  }
  task = cron.schedule(SCHEDULE, async () => {
    try {
      const stats = await expirePendingOrders();
      if (stats.transactionsExpired || stats.donationsExpired) {
        console.log('[paymentCron] expiry run:', stats);
      }
    } catch (err) {
      console.error('[paymentCron] expiry run failed:', err.message);
    }
  });
  console.log(`[paymentCron] expiry cron scheduled: ${SCHEDULE}`);
  return task;
};

const stopPaymentExpiryCron = () => {
  if (task) {
    task.stop();
    task = null;
  }
};

module.exports = { startPaymentExpiryCron, stopPaymentExpiryCron };
