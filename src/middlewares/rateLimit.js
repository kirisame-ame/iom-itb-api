const { StatusCodes } = require('http-status-codes');

const createRateLimiter = ({ windowMs, max, keyPrefix = 'rl' }) => {
  const buckets = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(key);
    }
  }, Math.max(windowMs, 60_000)).unref?.();

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || entry.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        status: StatusCodes.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later',
      });
    }

    entry.count += 1;
    return next();
  };
};

module.exports = { createRateLimiter };
