const { StatusCodes } = require('http-status-codes');
const { Kemitraan } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

module.exports = async (kemitraanId) => {
  const kemitraan = await Kemitraan.findByPk(kemitraanId);

  if (!kemitraan) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Kemitraan tidak ditemukan',
    });
  }

  return kemitraan;
};
