const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');

const extractRoles = (user = {}) => {
  const roles = [];

  if (Array.isArray(user.roles)) {
    roles.push(...user.roles);
  }

  if (user.roleName) {
    roles.push(user.roleName);
  }

  return [...new Set(roles.filter(Boolean))];
};

const normalizeAllowedRoles = (roles) => {
  if (roles.length === 1 && Array.isArray(roles[0])) {
    return roles[0];
  }

  return roles;
};

const getEffectiveRoles = (req, userRoles) => {
  const selectedRole = req.get('x-selected-role');

  if (!selectedRole) {
    return userRoles;
  }

  return userRoles.includes(selectedRole) ? [selectedRole] : [];
};

const requireRoles = (...roles) => {
  const allowedRoles = normalizeAllowedRoles(roles).filter(Boolean);

  if (allowedRoles.length === 0) {
    throw new Error('requireRoles requires at least one role');
  }

  return (req, res, next) => {
    const user = req.user || res.locals.user;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        new BaseResponse({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Authentication is required',
        })
      );
    }

    const userRoles = getEffectiveRoles(req, extractRoles(user));
    const hasAllowedRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasAllowedRole) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new BaseResponse({
          status: StatusCodes.FORBIDDEN,
          message: 'You do not have access to this resource',
        })
      );
    }

    return next();
  };
};

module.exports = requireRoles;
module.exports.extractRoles = extractRoles;
