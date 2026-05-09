const { Activities, Tags } = require('../../models');
const { Op } = require('sequelize');

const GetActivities = async ({ slug = null, id = null, search = '', page = 1, limit = 10, status = null, sort = 'newest' }) => {

  if (id) {
    try {
      const activity = await Activities.findOne({
        where: {
          id,
          ...(status && { status }),
        },
        include: [{ model: Tags, as: 'tags' }]
      });
      if (!activity) return { message: `Activity tidak ditemukan` };
      return activity;
    } catch (error) {
      return { message: `Terjadi kesalahan: ${error.message}` };
    }
  }

  if (slug) {
    try {
      const decodedSlug = decodeURIComponent(slug);
      const activity = await Activities.findOne({
        where: {
          ...(status && { status }),
          [Op.or]: [
            { url: slug },
            { url: decodedSlug },
            { title: decodedSlug },
          ]
        },
        include: [{ model: Tags, as: 'tags' }]
      });
      if (!activity) return { message: `Kegiatan tidak ditemukan` };
      return activity;
    } catch (error) {
      return { message: `Terjadi kesalahan: ${error.message}` };
    }
  }

  const pageNumber = parseInt(page) || 1;
  const pageLimit = parseInt(limit);
  const offset = (pageNumber - 1) * pageLimit;

  const getOrder = () => {
    switch (sort) {
      case 'oldest': return [['createdAt', 'ASC']];
      case 'az': return [['title', 'ASC']];
      case 'za': return [['title', 'DESC']];
      default: return [['createdAt', 'DESC']];
    }
  };

  const options = {
    where: {},
    limit: pageLimit,
    offset,
    order: getOrder(),
    include: [{ model: Tags, as: 'tags' }]
  };

  if (status && ['draft', 'published'].includes(status)) {
    options.where.status = status;
  }

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