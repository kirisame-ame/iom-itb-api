const { KegiatanKemitraan } = require('../../models');
const { UpdateKegiatanKemitraanDto } = require('../../dtos/kegiatanKemitraan');
const assertKemitraanExists = require('./assertKemitraanExists');
const {
  pickImageFile,
  moveUploadedFile,
  cleanupUploadedFiles,
} = require('./kegiatanKemitraanUploads');

module.exports = async (id, body = {}, files, baseUrl) => {
  const imageFile = pickImageFile(files);

  try {
    const data = await KegiatanKemitraan.findByPk(id);
    if (!data) throw new Error('Kegiatan tidak ditemukan');

    const dto = UpdateKegiatanKemitraanDto.from({
      ...body,
      image: imageFile ? moveUploadedFile(imageFile, baseUrl) : body?.image,
    });

    if (dto.kemitraanId) await assertKemitraanExists(dto.kemitraanId);
    return await data.update(dto.toPersistence());
  } catch (error) {
    cleanupUploadedFiles(imageFile);
    throw error;
  }
};
