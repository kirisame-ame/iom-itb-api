const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const deleteKemitraan = async (id) => {
  try {
    const kemitraan = await Kemitraan.findByPk(id);
    
    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Data Kemitraan tidak ditemukan',
      });
    }

    await kemitraan.destroy();
    
    return true;
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to delete kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = deleteKemitraan;