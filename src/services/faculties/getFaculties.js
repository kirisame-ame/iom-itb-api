const { Faculties } = require('../../models');

const GetFaculties = async ({ id = null, onlyActive = false } = {}) => {
  if (id) {
    return Faculties.findByPk(id);
  }

  const where = {};
  if (onlyActive) where.isActive = true;

  const rows = await Faculties.findAll({
    where,
    order: [['kodeUnik', 'ASC']],
  });

  return rows;
};

module.exports = GetFaculties;
