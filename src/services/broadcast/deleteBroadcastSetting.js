const { BroadcastSettings } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

/**
 * @param {string | number} id
 * @returns {Promise<{message: string}>}
 */
const deleteBroadcastSetting = async (id) => {
  const setting = await BroadcastSettings.findByPk(id);
  if (!setting) {
    throw new BaseError({
      status: StatusCodes.NOT_FOUND,
      message: 'Pengaturan broadcast tidak ditemukan',
    });
  }
  await setting.destroy();
  return { message: 'Pengaturan broadcast berhasil dihapus' };
};

module.exports = deleteBroadcastSetting;
