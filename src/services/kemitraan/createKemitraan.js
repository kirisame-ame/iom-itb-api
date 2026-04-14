const { Kemitraan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const CreateKemitraan = async (body, files, baseUrl) => {
  const transaction = await sequelize.transaction();
  const logoFile = files && files['logo'] ? files['logo'][0] : null;
  const pdfFile = files && files['file'] ? files['file'][0] : null;

  try {
    const {
      name,
      type,
      description,
      contactName,
      contactEmail,
      contactPhone,
      website,
      startDate,
      endDate,
      status,
      options,
    } = body;

    if (!name) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Name is a required field',
      });
    }

    // Ensure the upload directory exists
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move logo file to `uploads` directory
    let logoFilePath = null;
    if (logoFile) {
      logoFilePath = path.join(uploadDir, logoFile.filename);
      fs.renameSync(logoFile.path, logoFilePath);
    }

    // Move PDF file to `uploads` directory
    let pdfFilePath = null;
    if (pdfFile) {
      pdfFilePath = path.join(uploadDir, pdfFile.filename);
      fs.renameSync(pdfFile.path, pdfFilePath);
    }

    // Construct URLs for the files
    const logoFileUrl = logoFilePath ? `${baseUrl}/uploads/${logoFile.filename}` : null;
    const pdfFileUrl = pdfFilePath ? `${baseUrl}/uploads/${pdfFile.filename}` : null;

    const newKemitraan = await Kemitraan.create(
      {
        name,
        type,
        description,
        logo: logoFileUrl,
        file: pdfFileUrl,
        contactName,
        contactEmail,
        contactPhone,
        website,
        startDate,
        endDate,
        status: status || 'active',
        options,
      },
      { transaction }
    );

    await transaction.commit();

    return newKemitraan;
  } catch (error) {
    await transaction.rollback();

    // Clean up uploaded files if any errors occur
    if (logoFile && fs.existsSync(logoFile.path)) {
      fs.unlinkSync(logoFile.path);
    }
    if (pdfFile && fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = CreateKemitraan;
