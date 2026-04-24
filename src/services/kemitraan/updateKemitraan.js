const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const updateKemitraan = async (id, body, files, baseUrl) => {
  const imageFile = files && files['logo'] ? files['logo'][0]
    : files && files['image'] ? files['image'][0]
    : null;
  const mouFile = files && files['file'] ? files['file'][0]
    : files && files['mou'] ? files['mou'][0]
    : null;

  try {
    const kemitraan = await Kemitraan.findByPk(id);
    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Data Kemitraan tidak ditemukan',
      });
    }

    const uploadDir = path.resolve(__dirname, '../../uploads');
    if ((imageFile || mouFile) && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const payload = {};
    if (body && body.name !== undefined) payload.name = body.name;
    if (body && body.description !== undefined) payload.description = body.description;

    if (imageFile) {
      const dest = path.join(uploadDir, imageFile.filename);
      if (imageFile.path !== dest) fs.renameSync(imageFile.path, dest);
      payload.image = `${baseUrl}/uploads/${imageFile.filename}`;
    } else if (body && typeof body.image === 'string') {
      payload.image = body.image;
    }

    if (mouFile) {
      const dest = path.join(uploadDir, mouFile.filename);
      if (mouFile.path !== dest) fs.renameSync(mouFile.path, dest);
      payload.mou = `${baseUrl}/uploads/${mouFile.filename}`;
    } else if (body && typeof body.mou === 'string') {
      payload.mou = body.mou;
    }

    await kemitraan.update(payload);
    return kemitraan;
  } catch (error) {
    if (imageFile && fs.existsSync(imageFile.path)) fs.unlinkSync(imageFile.path);
    if (mouFile && fs.existsSync(mouFile.path)) fs.unlinkSync(mouFile.path);

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = updateKemitraan;
