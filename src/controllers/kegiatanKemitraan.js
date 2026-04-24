const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const GetService = require('../services/kegiatanKemitraan/getKegiatanKemitraan');
const CreateService = require('../services/kegiatanKemitraan/createKegiatanKemitraan');
const UpdateService = require('../services/kegiatanKemitraan/updateKegiatanKemitraan');
const DeleteService = require('../services/kegiatanKemitraan/deleteKegiatanKemitraan');

const sendError = (res, error) => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  console.error('[kegiatanKemitraan]', error);
  res.status(status).json(new BaseResponse({
    status,
    message: error.message || 'Internal server error',
  }));
};

module.exports = {
  GetAll: async (req, res) => {
    try {
      const data = await GetService();
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Success', data }));
    } catch (error) { sendError(res, error); }
  },
  Create: async (req, res) => {
    try {
      const data = await CreateService(req.body);
      res.status(StatusCodes.CREATED).json(new BaseResponse({ status: StatusCodes.CREATED, message: 'Created', data }));
    } catch (error) { sendError(res, error); }
  },
  Update: async (req, res) => {
    try {
      const data = await UpdateService(req.params.id, req.body);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Updated', data }));
    } catch (error) { sendError(res, error); }
  },
  Delete: async (req, res) => {
    try {
      await DeleteService(req.params.id);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Deleted', data: null }));
    } catch (error) { sendError(res, error); }
  },
};
