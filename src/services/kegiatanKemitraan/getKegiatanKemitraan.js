const { KegiatanKemitraan, Kemitraan } = require('../../models');

module.exports = async () => {
  return await KegiatanKemitraan.findAll({
    include: [{
      model: Kemitraan,
      as: 'Kemitraan',
      attributes: ['id', ['name', 'title']] // 'name' di DB dikirim sebagai 'title' ke frontend
    }],
    order: [['createdAt', 'DESC']]
  });
};