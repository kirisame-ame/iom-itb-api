const { StatusCodes } = require('http-status-codes');
const { Merchandises } = require('../../models');
const { Op } = require('sequelize');

// Tambahkan parameter id untuk pengecekan spesifik merchandise
const GetMerchandises = async ({ id = null, search = '', page = 1, limit = 5 }) => {
  // Jika id disediakan, kembalikan merchandise berdasarkan id
  if (id !== null && id !== undefined) {
    const merchandise = await Merchandises.findByPk(id);

    if (!merchandise) {
      const error = new Error('Merchandise tidak ditemukan');
      error.status = StatusCodes.NOT_FOUND;
      throw error;
    }

    return merchandise;
  }  

  // Logika untuk pencarian semua merchandise
  const pageNumber = parseInt(page) || 1;
  const pageLimit = parseInt(limit);
  const offset = (pageNumber - 1) * pageLimit;
  
  const options = {
    where: {},
    limit: pageLimit,
    offset,
    order: [['createdAt', 'DESC']],  // Urutkan berdasarkan tanggal dibuat secara descending
  };

  // Jika ada pencarian, gunakan filter nama merchandise
  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Merchandises.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data merchandise: ${error.message}`);
  }
};

module.exports = GetMerchandises;
