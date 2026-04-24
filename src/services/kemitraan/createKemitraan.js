const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const createKemitraan = async (body) => {
  try {
    const { name, description, image, mou } = body;

    if (!name) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Nama instansi (Mitra) wajib diisi',
      });
    }

    const newKemitraan = await Kemitraan.create({
      name,
      description: description || null,
      image: image || null,
      mou: mou || null,
    });

    return newKemitraan;
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = createKemitraan;