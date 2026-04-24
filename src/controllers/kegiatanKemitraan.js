const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const GetService = require('../services/kegiatanKemitraan/getKegiatanKemitraan');
const CreateService = require('../services/kegiatanKemitraan/createKegiatanKemitraan');
const UpdateService = require('../services/kegiatanKemitraan/updateKegiatanKemitraan');
const DeleteService = require('../services/kegiatanKemitraan/deleteKegiatanKemitraan');

module.exports = {
  GetAll: async (req, res, next) => {
    try {
      const data = await GetService();
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Success', data }));
    } catch (error) { next(error); }
  },
  Create: async (req, res, next) => {
    try {
      const data = await CreateService(req.body);
      res.status(StatusCodes.CREATED).json(new BaseResponse({ status: StatusCodes.CREATED, message: 'Created', data }));
    } catch (error) { next(error); }
  },
  Update: async (req, res, next) => {
    try {
      const data = await UpdateService(req.params.id, req.body);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Updated', data }));
    } catch (error) { next(error); }
  },
  Delete: async (req, res, next) => {
    try {
      await DeleteService(req.params.id);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Deleted', data: null }));
    } catch (error) { next(error); }
  }
};