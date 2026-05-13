const { Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const DeleteMerchandiseCategory = async (category) => {
  const normalizedCategory = String(category || '').trim();

  if (!normalizedCategory) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Kategori wajib diisi',
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const [affectedCount] = await Merchandises.update(
      { kategori: null },
      {
        where: { kategori: normalizedCategory },
        transaction,
      }
    );

    await transaction.commit();

    return {
      affectedCount,
      message: affectedCount > 0
        ? `Kategori ${normalizedCategory} berhasil dihapus dari ${affectedCount} merchandise`
        : `Kategori ${normalizedCategory} tidak sedang digunakan`,
    };
  } catch (error) {
    await transaction.rollback();

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal menghapus kategori merchandise: ${error.message || error}`,
    });
  }
};

module.exports = DeleteMerchandiseCategory;
