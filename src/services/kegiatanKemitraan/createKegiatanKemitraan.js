const { KegiatanKemitraan } = require('../../models');
const { CreateKegiatanKemitraanDto } = require('../../dtos/kegiatanKemitraan');
const assertKemitraanExists = require('./assertKemitraanExists');
const {
  pickImageFile,
  moveUploadedFile,
  cleanupUploadedFiles,
} = require('./kegiatanKemitraanUploads');

module.exports = async (body = {}, files, baseUrl) => {
  const imageFile = pickImageFile(files);

  try {
    const dto = CreateKegiatanKemitraanDto.from({
      ...body,
      image: imageFile ? moveUploadedFile(imageFile, baseUrl) : body?.image,
    });

    await assertKemitraanExists(dto.kemitraanId);
    return await KegiatanKemitraan.create(dto.toPersistence());
  } catch (error) {
    cleanupUploadedFiles(imageFile);
    throw error;
  }
};
