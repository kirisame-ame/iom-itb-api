const { KegiatanKemitraan } = require('../../models');

module.exports = async (body) => {
  return await KegiatanKemitraan.create(body);
};