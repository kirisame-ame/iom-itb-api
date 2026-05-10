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
      'img': ['https', 'http'],
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

    const { title, date, description, url, image, status, tags } = body;

    if (!title && !date && !description && !url && !image && !status && tags === undefined) {
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

    if (tags !== undefined && tags.length > 3) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Maksimal 3 tag per kegiatan.',
      });
    }

    const cleanDescription = description !== undefined
      ? sanitizeDescription(description)
      : activity.description;

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

    if (tags !== undefined) {
      const tagInstances = await Promise.all(
        tags.map(name => Tags.findOrCreate({ where: { name: name.trim().toLowerCase() } }))
      );
      await activity.setTags(tagInstances.map(([tag]) => tag), { transaction });
    }

    await transaction.commit();

    const result = await Activities.findOne({
      where: { id },
      include: [{ model: Tags, as: 'tags' }]
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

module.exports = UpdateActivities;