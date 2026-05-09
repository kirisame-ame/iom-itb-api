const { KegiatanKemitraan } = require('../../models');
const { CreateKegiatanKemitraanDto } = require('../../dtos/kegiatanKemitraan');
const assertKemitraanExists = require('./assertKemitraanExists');

module.exports = async (body = {}) => {
  const dto = CreateKegiatanKemitraanDto.from(body);
  await assertKemitraanExists(dto.kemitraanId);
  return await KegiatanKemitraan.create(dto.toPersistence());
};
