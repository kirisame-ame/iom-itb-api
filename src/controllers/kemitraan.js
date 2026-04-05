const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const createKemitraanService = require('../services/kemitraan/createKemitraan');
const getKemitraanService = require('../services/kemitraan/getKemitraan');
const updateKemitraanService = require('../services/kemitraan/updateKemitraan');
const deleteKemitraanService = require('../services/kemitraan/deleteKemitraan');

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
    const result = await getKemitraanService(req.query);
    
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Successfully fetched Kemitraan',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) { 
    next(error); 
  }
};

const updateKemitraan = async (req, res, next) => {
  try {
    const result = await updateKemitraanService(req.params.id, req.body);
    return res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'Successfully updated Kemitraan',
        data: result,
      })
    );
  } catch (error) {
    next(error);
  }
};

const deleteKemitraan = async (req, res, next) => {
  try {
    await deleteKemitraanService(req.params.id);
    return res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: 'Successfully deleted Kemitraan',
        data: null,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKemitraan,
  getKemitraan,
  updateKemitraan,
  deleteKemitraan,
};