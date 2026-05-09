const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { CreateKemitraanDto } = require('../../dtos/kemitraan');
const {
  pickFile,
  moveUploadedFile,
  cleanupUploadedFiles,
} = require('./kemitraanUploads');

const createKemitraan = async (body, files, baseUrl) => {
  const imageFile = pickFile(files, 'logo', 'image');
  const mouFile = pickFile(files, 'file', 'mou');

  try {
    const dto = CreateKemitraanDto.from({
      ...body,
      image: imageFile ? moveUploadedFile(imageFile, baseUrl) : body?.image,
      mou: mouFile ? moveUploadedFile(mouFile, baseUrl) : body?.mou,
    });

    return await Kemitraan.create(dto.toPersistence());
  } catch (error) {
    cleanupUploadedFiles(imageFile, mouFile);
    if (error instanceof BaseError) throw error;

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = createKemitraan;
