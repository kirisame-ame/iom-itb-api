const { BroadcastSettings } = require('../../models');
const {
  toBroadcastSettingDto,
  toBroadcastSettingUpdatePayload,
} = require('../../dtos/broadcast');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

/**
 * @param {string | number} id
 * @param {Record<string, unknown>} body
 * @returns {Promise<ReturnType<typeof toBroadcastSettingDto>>}
 */
const updateBroadcastSetting = async (id, body) => {
  const setting = await BroadcastSettings.findByPk(id);
  if (!setting) {
    throw new BaseError({
      status: StatusCodes.NOT_FOUND,
      message: 'Pengaturan broadcast tidak ditemukan',
    });
  }

  const payload = toBroadcastSettingUpdatePayload(body, setting);
  await setting.update(payload);
  return toBroadcastSettingDto(setting);
};

module.exports = updateBroadcastSetting;
