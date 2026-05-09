const { StatusCodes } = require('http-status-codes');

const parseList = (raw) => (raw || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || '';
};

const normalizeIp = (ip) => (ip || '').replace(/^::ffff:/, '');

const midtransIpAllowlist = (req, res, next) => {
  const allowed = parseList(process.env.MIDTRANS_ALLOWED_IPS);
  if (allowed.length === 0) return next();

  const ip = normalizeIp(getClientIp(req));
  if (allowed.includes(ip)) return next();

  return res.status(StatusCodes.FORBIDDEN).json({
    status: StatusCodes.FORBIDDEN,
    message: 'Source IP not allowed',
  });
};

module.exports = midtransIpAllowlist;
