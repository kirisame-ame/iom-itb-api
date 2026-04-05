const { Kemitraan } = require('../../models');
const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const getKemitraan = async (query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;
    const search = query.search || '';

    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Kemitraan.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      pagination: {
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        start: count === 0 ? 0 : offset + 1,
        end: offset + rows.length
      }
    };
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to fetch kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = getKemitraan;