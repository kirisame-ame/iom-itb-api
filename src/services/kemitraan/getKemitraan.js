const { Kemitraan } = require('../../models');
const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const getKemitraan = async (query = {}, options = {}) => {
  try {
    const safeQuery = query || {};
    const page = parseInt(safeQuery.page) || 1;
    const limit = parseInt(safeQuery.limit) || 10;
    const search = safeQuery.search || '';
    const includePrivateMou = Boolean(options.includePrivateMou);

    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { picName: { [Op.like]: `%${search}%` } },
            { picPhone: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const queryOptions = {
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    };

    if (!includePrivateMou) {
      queryOptions.attributes = { exclude: ['mou'] };
    }

    const { count, rows } = await Kemitraan.findAndCountAll(queryOptions);

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
