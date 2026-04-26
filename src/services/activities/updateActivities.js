const { Activities, ActivityMedia, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const sanitizeHtml = require('sanitize-html');

const sanitizeDescription = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'u', 's', 'blockquote',
      'ul', 'ol', 'li', 'img', 'a', 'br'
    ],
    allowedAttributes: {
      'img': ['src', 'alt'],
      'a': ['href', 'target']
    },
    allowedSchemesByTag: {
      'img': ['http', 'https'],
      'a': ['http', 'https']
    },
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
      })
    }
  });
};

module.exports = UpdateActivities;

const cleanDescription = description !== undefined 
  ? sanitizeDescription(description) 
  : activity.description;


const validateMedia = (media) => {
  for (const item of media) {
    if (item.type === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
      if (!youtubeRegex.test(item.value)) {
        throw new BaseError({
          status: StatusCodes.BAD_REQUEST,
          message: `URL YouTube tidak valid: ${item.value}`
        });
      }
    } else if (item.type === 'image') {
      try {
        const url = new URL(item.value);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new BaseError({
            status: StatusCodes.BAD_REQUEST,
            message: `URL gambar tidak valid: ${item.value}`
          });
        }
      } catch {
        throw new BaseError({
          status: StatusCodes.BAD_REQUEST,
          message: `URL gambar tidak valid: ${item.value}`
        });
      }
    } else {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: `Tipe media tidak valid: ${item.type}`
      });
    }
  }
};

const UpdateActivities = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    const activity = await Activities.findByPk(id, { transaction });

    if (!activity) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Aktivitas tidak ditemukan.',
      });
    }

    const { title, date, description, url, image, status, media } = body;

    if (!title && !date && !description && !url && !image && !status && !media) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Setidaknya salah satu field harus diisi untuk pembaruan.',
      });
    }

    if (url && url !== activity.url) {
      const existingActivity = await Activities.findOne({ where: { url } });
      if (existingActivity) {
        throw new BaseError({
          status: StatusCodes.CONFLICT,
          message: 'URL sudah digunakan. Silakan gunakan URL yang berbeda.',
        });
      }
    }

    if (media !== undefined && media.length > 0) {
      validateMedia(media);
    }

    await Activities.update(
      {
        title: title || activity.title,
        image: image || activity.image,
        description: cleanDescription,
        date: date !== undefined ? date : activity.date,
        url: url !== undefined ? url : activity.url,
        status: status || activity.status,
      },
      { where: { id }, transaction }
    );

    // Update media kalau ada
    if (media !== undefined) {
      // Hapus media lama
      await ActivityMedia.destroy({ where: { activity_id: id }, transaction });

      // Insert media baru
      if (media.length > 0) {
        const mediaData = media.map((item, index) => ({
          activity_id: id,
          type: item.type,
          value: item.value,
          order: item.order ?? index,
          caption: item.caption || null
        }));
        await ActivityMedia.bulkCreate(mediaData, { transaction });
      }
    }

    await transaction.commit();

    // Return data terbaru
    const result = await Activities.findOne({
      where: { id },
      include: [{ model: ActivityMedia, as: 'media', order: [['order', 'ASC']] }]
    });

    return result;
  } catch (error) {
    await transaction.rollback();
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Gagal memperbarui aktivitas: ${error.message || error}`,
    });
  }
};