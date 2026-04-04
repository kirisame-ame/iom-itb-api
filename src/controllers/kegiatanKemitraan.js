const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const getService = require('../services/kegiatanKemitraan/getKegiatanKemitraan');
const createService = require('../services/kegiatanKemitraan/createKegiatanKemitraan');
const updateService = require('../services/kegiatanKemitraan/updateKegiatanKemitraan');
const deleteService = require('../services/kegiatanKemitraan/deleteKegiatanKemitraan');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await getService();
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Success', data }));
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const data = await createService(req.body);
      res.status(StatusCodes.CREATED).json(new BaseResponse({ status: StatusCodes.CREATED, message: 'Created', data }));
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const data = await updateService(req.params.id, req.body);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Updated', data }));
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await deleteService(req.params.id);
      res.status(StatusCodes.OK).json(new BaseResponse({ status: StatusCodes.OK, message: 'Deleted', data: null }));
    } catch (error) { next(error); }
  }
};