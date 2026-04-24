const { Kemitraan } = require('../../models');
const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const getKemitraan = async (query = {}) => {
  try {
    const safeQuery = query || {};
    const page = parseInt(safeQuery.page) || 1;
    const limit = parseInt(safeQuery.limit) || 10;
    const search = safeQuery.search || '';
    const { type, status } = safeQuery;

    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const { count, rows } = await Kemitraan.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      pagination: {
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        start: count === 0 ? 0 : offset + 1,
        end: offset + rows.length,
      },
    };
  } catch (error) {
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to fetch kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = getKemitraan;
