const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const getKemitraanById = async (id, options = {}) => {
  try {
    const queryOptions = {};

    if (!options.includePrivateMou) {
      queryOptions.attributes = { exclude: ['mou'] };
    }

    return await Kemitraan.findByPk(id, queryOptions);
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to fetch kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = getKemitraanById;
