const { Kemitraan } = require('../../models');
const { Op } = require('sequelize');

const GetKemitraan = async (id = null, query = {}, search = '') => {
  if (id) {
    try {
      const kemitraan = await Kemitraan.findByPk(id);
      if (!kemitraan) {
        throw new Error(`Kemitraan with id ${id} not found`);
      }
      return kemitraan;
    } catch (error) {
      throw new Error(`Failed to retrieve kemitraan data: ${error.message}`);
    }
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;

  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };

  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  if (query.type) {
    options.where.type = query.type;
  }

  if (query.status) {
    options.where.status = query.status;
  }

  try {
    const { rows, count } = await Kemitraan.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve kemitraan data: ${error.message}`);
  }
};

module.exports = GetKemitraan;
