const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { deleteMerchandiseCategory } = require('./merchandiseCategories');

const DeleteMerchandiseCategory = async (category) => {
  try {
    return await deleteMerchandiseCategory(category);
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal menghapus kategori merchandise: ${error.message || error}`,
    });
  }
};

module.exports = DeleteMerchandiseCategory;
