const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');

const apiKeyAuth = (req, res, next) => {
  const apiKey = process.env.REGISTER_API_KEY;

  if (!apiKey) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new BaseResponse({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'REGISTER_API_KEY is not configured on the server',
      })
    );
  }

  const provided = req.headers['x-api-key'];

  if (!provided || provided !== apiKey) {
    return res.status(StatusCodes.UNAUTHORIZED).json(
      new BaseResponse({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or missing API key',
      })
    );
  }

  return next();
};

module.exports = apiKeyAuth;
