const { Activities, ActivityMedia, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateActivities = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, date, image, url, description, status, media } = body;

    if (!title || !date || !image) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Judul, tanggal, dan gambar wajib diisi.',
      });
    }

    if (url) {
      const existingActivity = await Activities.findOne({ where: { url } });
      if (existingActivity) {
        throw new BaseError({
          status: StatusCodes.CONFLICT,
          message: 'URL sudah digunakan. Silakan gunakan URL yang berbeda.',
        });
      }
    }

    const newActivity = await Activities.create(
      {
        title,
        image,
        description: description || '',
        date,
        url: url || '',
        status: status || 'draft'
      },
      { transaction }
    );

    // Insert media kalau ada
    if (media && media.length > 0) {
      const mediaData = media.map((item, index) => ({
        activity_id: newActivity.id,
        type: item.type, // 'image' | 'youtube'
        value: item.value,
        order: item.order ?? index,
        caption: item.caption || null
      }));

      await ActivityMedia.bulkCreate(mediaData, { transaction });
    }

    await transaction.commit();

    // Return dengan media
    const result = await Activities.findOne({
      where: { id: newActivity.id },
      include: [{ model: ActivityMedia, as: 'media' }]
    });

    return result;
  } catch (error) {
    await transaction.rollback();
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal membuat aktivitas: ${error.message || error}`,
    });
  }
};

module.exports = CreateActivities;