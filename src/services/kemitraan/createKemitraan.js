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

const createKemitraan = async (body, files, baseUrl) => {
  const logoFile = files && files['logo'] ? files['logo'][0] : null;
  const pdfFile = files && files['file'] ? files['file'][0] : null;

  try {
    if (!body || !body.name) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Nama instansi (Mitra) wajib diisi',
      });
    }

    const uploadDir = path.resolve(__dirname, '../../uploads');
    if ((logoFile || pdfFile) && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let logoUrl = typeof body.logo === 'string' ? body.logo : null;
    if (logoFile) {
      const dest = path.join(uploadDir, logoFile.filename);
      if (logoFile.path !== dest) fs.renameSync(logoFile.path, dest);
      logoUrl = `${baseUrl}/uploads/${logoFile.filename}`;
    }

    let fileUrl = typeof body.file === 'string' ? body.file : null;
    if (pdfFile) {
      const dest = path.join(uploadDir, pdfFile.filename);
      if (pdfFile.path !== dest) fs.renameSync(pdfFile.path, dest);
      fileUrl = `${baseUrl}/uploads/${pdfFile.filename}`;
    }

    const payload = {};
    for (const key of MODEL_FIELDS) {
      if (body[key] !== undefined && body[key] !== '') payload[key] = body[key];
    }
    payload.logo = logoUrl;
    payload.file = fileUrl;

    const newKemitraan = await Kemitraan.create(payload);
    return newKemitraan;
  } catch (error) {
    if (logoFile && fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
    if (pdfFile && fs.existsSync(pdfFile.path)) fs.unlinkSync(pdfFile.path);

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = createKemitraan;
