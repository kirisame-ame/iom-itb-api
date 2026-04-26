const { Activities, ActivityMedia } = require('../../models');
const { Op } = require('sequelize');

const GetActivities = async ({ slug = null, id=null, search = '', page = 1, limit = 10, status = null }) => {

  if (id) {
    try {
      const activity = await Activities.findOne({
        where: { id },
        include: [{ model: ActivityMedia, as: 'media', order: [['order', 'ASC']] }]
      });
      if (!activity) return { message: `Activity tidak ditemukan` };
      return activity;
    } catch (error) {
      return { message: `Terjadi kesalahan: ${error.message}` };
    }
  }

  if (slug) {
    try {
      const activity = await Activities.findOne({
        where: { url: slug },
        include: [{ model: ActivityMedia, as: 'media', order: [['order', 'ASC']] }]
      });
      if (!activity) {
        return { message: `Kegiatan dengan slug ${slug} tidak ditemukan` };
      }
      return activity;
    } catch (error) {
      return { message: `Terjadi kesalahan: ${error.message}` };
    }
  }

  const pageNumber = parseInt(page) || 1;
  const pageLimit = parseInt(limit);
  const offset = (pageNumber - 1) * pageLimit;

  const options = {
    where: {},
    limit: pageLimit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: ActivityMedia, as: 'media', order: [['order', 'ASC']] }]
  };

  // Filter by status
  if (status && ['draft', 'published'].includes(status)) {
    options.where.status = status;
  }

  // Search by judul atau konten
  if (search) {
    options.where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  try {
    const { rows, count } = await Activities.findAndCountAll(options);
    return {
      data: rows,
      total: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageLimit),
    };
  } catch (error) {
    console.error('Database error in getActivities:', error);
    if (error.message.includes('ETIMEDOUT') || error.message.includes('connect')) {
      return { data: [], total: 0, currentPage: pageNumber, totalPages: 0 };
    }
    throw new Error(`Gagal mengambil data Kegiatan: ${error.message}`);
  }
};

module.exports = GetActivities;