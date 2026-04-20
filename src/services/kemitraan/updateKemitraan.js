const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const updateKemitraan = async (id, body) => {
  try {
    const kemitraan = await Kemitraan.findByPk(id);
    
    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Data Kemitraan tidak ditemukan',
      });
    }

    const { name, description, image, mou } = body;

    await kemitraan.update({
      name: name || kemitraan.name,
      description: description !== undefined ? description : kemitraan.description,
      image: image !== undefined ? image : kemitraan.image,
      mou: mou !== undefined ? mou : kemitraan.mou,
    });

    return kemitraan;
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = updateKemitraan;