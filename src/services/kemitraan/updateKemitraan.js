const { Kemitraan, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path');

const removeFileByUrl = (fileUrl) => {
  if (!fileUrl) return;
  const fileName = path.basename(fileUrl);
  const filePath = path.join(__dirname, '../../uploads', fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const UpdateKemitraan = async (id, body, files, baseUrl) => {
  const transaction = await sequelize.transaction();
  const logoFile = files && files['logo'] ? files['logo'][0] : null;
  const pdfFile = files && files['file'] ? files['file'][0] : null;

  try {
    const kemitraan = await Kemitraan.findByPk(id, { transaction });

    if (!kemitraan) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Kemitraan not found',
      });
    }

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

    const hasUpdate = name || type || description || contactName || contactEmail
      || contactPhone || website || startDate || endDate || status || options
      || logoFile || pdfFile;

    if (!hasUpdate) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one field must be provided for update',
      });
    }

    const uploadDir = path.resolve(__dirname, '../../uploads');
    if ((logoFile || pdfFile) && !fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move logo and delete previous one if replaced
    let logoFileUrl = kemitraan.logo;
    if (logoFile) {
      const logoFilePath = path.join(uploadDir, logoFile.filename);
      fs.renameSync(logoFile.path, logoFilePath);
      logoFileUrl = `${baseUrl}/uploads/${logoFile.filename}`;
      removeFileByUrl(kemitraan.logo);
    }

    // Move PDF and delete previous one if replaced
    let pdfFileUrl = kemitraan.file;
    if (pdfFile) {
      const pdfFilePath = path.join(uploadDir, pdfFile.filename);
      fs.renameSync(pdfFile.path, pdfFilePath);
      pdfFileUrl = `${baseUrl}/uploads/${pdfFile.filename}`;
      removeFileByUrl(kemitraan.file);
    }

    await Kemitraan.update(
      {
        name: name || kemitraan.name,
        type: type || kemitraan.type,
        description: description || kemitraan.description,
        logo: logoFileUrl,
        file: pdfFileUrl,
        contactName: contactName || kemitraan.contactName,
        contactEmail: contactEmail || kemitraan.contactEmail,
        contactPhone: contactPhone || kemitraan.contactPhone,
        website: website || kemitraan.website,
        startDate: startDate || kemitraan.startDate,
        endDate: endDate || kemitraan.endDate,
        status: status || kemitraan.status,
        options: options || kemitraan.options,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return await Kemitraan.findByPk(id);
  } catch (error) {
    await transaction.rollback();

    if (logoFile && fs.existsSync(logoFile.path)) {
      fs.unlinkSync(logoFile.path);
    }
    if (pdfFile && fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update kemitraan: ${error.message || error}`,
    });
  }
};

module.exports = UpdateKemitraan;
