const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const createKemitraanService = require('../services/kemitraan/createKemitraan');
const getKemitraanService = require('../services/kemitraan/getKemitraan');

const createKemitraan = async (req, res, next) => {
  try {
    const result = await createKemitraanService(req.body);
    return res.status(StatusCodes.CREATED).json(
      new BaseResponse({
        status: StatusCodes.CREATED,
        message: 'Successfully created Kemitraan',
        data: result,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getKemitraan = async (req, res, next) => {
  try {
    const result = await getKemitraanService();
    return res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'Successfully fetched Kemitraan',
        data: result,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKemitraan,
  getKemitraan,
};