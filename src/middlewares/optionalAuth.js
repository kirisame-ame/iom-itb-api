const JWTValidation = require('./auth');

const optionalAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next();
  }

  return JWTValidation(req, res, next);
};

module.exports = optionalAuth;
