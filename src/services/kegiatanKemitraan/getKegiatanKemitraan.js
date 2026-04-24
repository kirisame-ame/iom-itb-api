const { KegiatanKemitraan, Kemitraan } = require('../../models');

module.exports = async () => {
  return await KegiatanKemitraan.findAll({
    include: [
      {
        model: Kemitraan,
        as: 'kemitraan',
        attributes: ['id', 'name'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};
