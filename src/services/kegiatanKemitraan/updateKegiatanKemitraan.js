const { KegiatanKemitraan } = require('../../models');
const { UpdateKegiatanKemitraanDto } = require('../../dtos/kegiatanKemitraan');
const assertKemitraanExists = require('./assertKemitraanExists');

module.exports = async (id, body = {}) => {
  const data = await KegiatanKemitraan.findByPk(id);
  if (!data) throw new Error('Kegiatan tidak ditemukan');

  const dto = UpdateKegiatanKemitraanDto.from(body);
  if (dto.kemitraanId) await assertKemitraanExists(dto.kemitraanId);
  return await data.update(dto.toPersistence());
};
