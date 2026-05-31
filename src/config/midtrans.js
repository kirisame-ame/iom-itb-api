const midtransClient = require('midtrans-client');

const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION).toLowerCase() === 'true';
const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.MIDTRANS_CLIENT_KEY || process.env.MIDTRANS_CIENT_KEY;

if (!serverKey) {
  // eslint-disable-next-line no-console
  console.warn('[midtrans] MIDTRANS_SERVER_KEY is not set. Payment endpoints will fail until configured.');
}

const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

module.exports = {
  snap,
  coreApi,
  isProduction,
  clientKey,
};
