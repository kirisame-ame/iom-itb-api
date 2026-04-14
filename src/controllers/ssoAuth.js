const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const {
  buildAccessibleApps,
  getAppUrl,
  getUserRolesFromToken,
  isAnyRoleAllowed,
  isRoleAllowedForApp,
} = require('../utils/ssoAccess');

const normalizeUser = (user = {}) => ({
  sub: user.sub,
  email: user.email,
  name: user.name,
  preferredUsername: user.preferred_username,
});

const getMe = async (req, res) => {
  try {
    const roles = getUserRolesFromToken(req.user);
    const apps = buildAccessibleApps(roles);

    res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'SSO session active',
        data: {
          user: normalizeUser(req.user),
          roles,
          apps,
          hasWebAccess: isAnyRoleAllowed(roles, 'web'),
        },
      })
    );
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(
      new BaseResponse({
        status,
        message: error.message || 'Failed to load SSO profile',
      })
    );
  }
};

const getApps = async (req, res) => {
  try {
    const roles = getUserRolesFromToken(req.user);
    const apps = buildAccessibleApps(roles);

    res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'Accessible apps loaded',
        data: {
          apps,
          roles,
        },
      })
    );
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(
      new BaseResponse({
        status,
        message: error.message || 'Failed to load accessible apps',
      })
    );
  }
};

const selectApp = async (req, res) => {
  try {
    const roles = getUserRolesFromToken(req.user);
    const { appId, role } = req.body || {};

    if (!appId || typeof appId !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new BaseResponse({
          status: StatusCodes.BAD_REQUEST,
          message: 'appId is required',
        })
      );
    }

    if (!role || typeof role !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new BaseResponse({
          status: StatusCodes.BAD_REQUEST,
          message: 'role is required',
        })
      );
    }

    if (!roles.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new BaseResponse({
          status: StatusCodes.FORBIDDEN,
          message: 'Role not assigned to current user',
        })
      );
    }

    if (!isRoleAllowedForApp(role, appId)) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new BaseResponse({
          status: StatusCodes.FORBIDDEN,
          message: 'Selected role has no access to selected app',
        })
      );
    }

    const redirectUrl = appId === 'web' ? '/dashboard' : getAppUrl(appId);

    res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'App selection accepted',
        data: {
          selectedAppId: appId,
          selectedRole: role,
          redirectUrl,
        },
      })
    );
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(
      new BaseResponse({
        status,
        message: error.message || 'Failed to process app selection',
      })
    );
  }
};

module.exports = {
  getMe,
  getApps,
  selectApp,
};
