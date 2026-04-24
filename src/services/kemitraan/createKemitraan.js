const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const createKemitraan = async (body, files, baseUrl) => {
  const imageFile = files && files['logo'] ? files['logo'][0]
    : files && files['image'] ? files['image'][0]
    : null;
  const mouFile = files && files['file'] ? files['file'][0]
    : files && files['mou'] ? files['mou'][0]
    : null;

  try {
    if (!body || !body.name) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Nama instansi (Mitra) wajib diisi',
      });
    }

    const uploadDir = path.resolve(__dirname, '../../uploads');
    if ((imageFile || mouFile) && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let imageUrl = typeof body.image === 'string' ? body.image : null;
    if (imageFile) {
      const dest = path.join(uploadDir, imageFile.filename);
      if (imageFile.path !== dest) fs.renameSync(imageFile.path, dest);
      imageUrl = `${baseUrl}/uploads/${imageFile.filename}`;
    }

    let mouUrl = typeof body.mou === 'string' ? body.mou : null;
    if (mouFile) {
      const dest = path.join(uploadDir, mouFile.filename);
      if (mouFile.path !== dest) fs.renameSync(mouFile.path, dest);
      mouUrl = `${baseUrl}/uploads/${mouFile.filename}`;
    }

    const newKemitraan = await Kemitraan.create({
      name: body.name,
      description: body.description || null,
      image: imageUrl,
      mou: mouUrl,
    });

    return newKemitraan;
  } catch (error) {
    if (imageFile && fs.existsSync(imageFile.path)) fs.unlinkSync(imageFile.path);
    if (mouFile && fs.existsSync(mouFile.path)) fs.unlinkSync(mouFile.path);

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = createKemitraan;
