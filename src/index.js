// Shim: Node >=22 removed `SlowBuffer`; buffer-equal-constant-time (via jsonwebtoken) still uses it.
const bufferMod = require('buffer');
if (!bufferMod.SlowBuffer) {
  bufferMod.SlowBuffer = bufferMod.Buffer;
}

const app = require('./app');
const { startPaymentExpiryCron } = require('./services/payments/paymentCron');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startPaymentExpiryCron();
});
