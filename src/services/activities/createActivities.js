const { Activities, Tags, sequelize } = require('../../models');
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
      'img': ['src', 'alt', 'style'],  
      'a': ['href', 'target', 'rel'],
      'p': ['style'],                   
      'h1': ['style'],
      'h2': ['style'],
      'h3': ['style'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'width': [/^\d+(%|px)$/],
        'height': [/.*/],
      },
    },
    allowedSchemesByTag: {
      'img': ['https','http'],
      'a': ['https']
    },
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
      })
    }
  });
};

const CreateActivities = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, date, image, url, description, status, tags } = body;

    if (!title || !date) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Judul dan tanggal wajib diisi.',
      });
    }

    if (tags && tags.length > 3) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Maksimal 3 tag per kegiatan.',
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
        description: sanitizeDescription(description || ''),
        date,
        url: url || '',
        status: status || 'draft',
      },
      { transaction }
    );

    if (tags && tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(name => Tags.findOrCreate({ where: { name: name.trim().toLowerCase() } }))
      );
      await newActivity.setTags(tagInstances.map(([tag]) => tag), { transaction });
    }

    await transaction.commit();

    const result = await Activities.findOne({
      where: { id: newActivity.id },
      include: [{ model: Tags, as: 'tags' }]
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