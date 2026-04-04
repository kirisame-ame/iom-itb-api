const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const getKemitraan = async () => {
  try {
    const data = await Kemitraan.findAll({
      order: [['createdAt', 'DESC']],
    });

    return data;
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to fetch kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = getKemitraan;