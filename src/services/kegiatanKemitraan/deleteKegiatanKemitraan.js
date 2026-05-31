const { KegiatanKemitraan } = require('../../models');

module.exports = async (id) => {
  const data = await KegiatanKemitraan.findByPk(id);
  if (!data) throw new Error('Kegiatan tidak ditemukan');
  return await data.destroy();
};