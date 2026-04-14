const { Kemitraan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const removeFileByUrl = (fileUrl) => {
  if (!fileUrl) return;
  const fileName = path.basename(fileUrl);
  const filePath = path.join(__dirname, '../../uploads', fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const DeleteKemitraan = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const kemitraan = await Kemitraan.findByPk(id, { transaction });

    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Kemitraan not found',
      });
    }

    removeFileByUrl(kemitraan.logo);
    removeFileByUrl(kemitraan.file);

    await kemitraan.destroy({ transaction });

    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Kemitraan deleted successfully',
    };
  } catch (error) {
    await transaction.rollback();
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to delete kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = DeleteKemitraan;
