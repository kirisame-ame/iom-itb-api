const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateKemitraan = require('../services/kemitraan/createKemitraan');
const GetKemitraan = require('../services/kemitraan/getKemitraan');
const GetKemitraanByIdService = require('../services/kemitraan/getKemitraanById');
const UpdateKemitraan = require('../services/kemitraan/updateKemitraan');
const DeleteKemitraan = require('../services/kemitraan/deleteKemitraan');

const GetKemitraanById = async (req, res) => {
  try {
    const { id } = req.params;
    const kemitraan = await GetKemitraanByIdService(id);

    if (!kemitraan) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Kemitraan tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Kemitraan ditemukan',
      data: kemitraan,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Kemitraan',
    }));
  }
};

const GetAllKemitraan = async (req, res) => {
  try {
    const { search, page, limit, type, status } = req.query;

    const result = await GetKemitraan({ search, page, limit, type, status });

    res.status(StatusCodes.OK).json(new DataTable(result.data, result.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const CreateNewKemitraan = async (req, res) => {
  try {
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newKemitraan = await CreateKemitraan(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Kemitraan created successfully',
      data: newKemitraan,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create Kemitraan',
    }));
  }
};

const UpdateKemitraanById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedKemitraan = await UpdateKemitraan(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Kemitraan berhasil diperbarui',
      data: updatedKemitraan,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const DeleteKemitraanById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteKemitraan(id);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: (result && result.message) || 'Kemitraan berhasil dihapus',
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

module.exports = {
  GetKemitraanById,
  GetAllKemitraan,
  CreateNewKemitraan,
  UpdateKemitraanById,
  DeleteKemitraanById,
};
