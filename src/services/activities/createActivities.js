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

const CreateActivities = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, date, image, url, description, status, media } = body;

    if (!title || !date) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Judul dan tanggal wajib diisi.',
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

    if (media && media.length > 0) {
      validateMedia(media);
    }

    const newActivity = await Activities.create(
      {
        title,
        image,
        description: sanitizeDescription(description || ''),
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