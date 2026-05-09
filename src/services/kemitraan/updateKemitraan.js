const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { UpdateKemitraanDto } = require('../../dtos/kemitraan');
const {
  pickFile,
  moveUploadedFile,
  cleanupUploadedFiles,
} = require('./kemitraanUploads');

const updateKemitraan = async (id, body, files, baseUrl) => {
  const imageFile = pickFile(files, 'logo', 'image');
  const mouFile = pickFile(files, 'file', 'mou');

  try {
    const kemitraan = await Kemitraan.findByPk(id);
    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Data Kemitraan tidak ditemukan',
      });
    }

    const dto = UpdateKemitraanDto.from({
      ...body,
      image: imageFile ? moveUploadedFile(imageFile, baseUrl) : body?.image,
      mou: mouFile ? moveUploadedFile(mouFile, baseUrl) : body?.mou,
    });

    await kemitraan.update(dto.toPersistence());
    return kemitraan;
  } catch (error) {
    cleanupUploadedFiles(imageFile, mouFile);
    if (error instanceof BaseError) throw error;

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = updateKemitraan;
