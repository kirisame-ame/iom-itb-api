const { Kemitraan } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const MODEL_FIELDS = [
  'name',
  'type',
  'description',
  'contactName',
  'contactEmail',
  'contactPhone',
  'website',
  'startDate',
  'endDate',
  'status',
  'options',
];

const updateKemitraan = async (id, body, files, baseUrl) => {
  const logoFile = files && files['logo'] ? files['logo'][0] : null;
  const pdfFile = files && files['file'] ? files['file'][0] : null;

  try {
    const kemitraan = await Kemitraan.findByPk(id);

    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Data Kemitraan tidak ditemukan',
      });
    }

    const uploadDir = path.resolve(__dirname, '../../uploads');
    if ((logoFile || pdfFile) && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const payload = {};
    for (const key of MODEL_FIELDS) {
      if (body && body[key] !== undefined) payload[key] = body[key];
    }

    if (logoFile) {
      const dest = path.join(uploadDir, logoFile.filename);
      if (logoFile.path !== dest) fs.renameSync(logoFile.path, dest);
      payload.logo = `${baseUrl}/uploads/${logoFile.filename}`;
    } else if (body && typeof body.logo === 'string') {
      payload.logo = body.logo;
    }

    if (pdfFile) {
      const dest = path.join(uploadDir, pdfFile.filename);
      if (pdfFile.path !== dest) fs.renameSync(pdfFile.path, dest);
      payload.file = `${baseUrl}/uploads/${pdfFile.filename}`;
    } else if (body && typeof body.file === 'string') {
      payload.file = body.file;
    }

    await kemitraan.update(payload);
    return kemitraan;
  } catch (error) {
    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = updateKemitraan;
