const { BroadcastSettings } = require('../../models');
const {
  toBroadcastSettingCreatePayload,
  toBroadcastSettingDto,
} = require('../../dtos/broadcast');

/**
 * @param {Record<string, unknown>} body
 * @returns {Promise<ReturnType<typeof toBroadcastSettingDto>>}
 */
const createBroadcastSetting = async (body) => {
  const payload = toBroadcastSettingCreatePayload(body);
  const setting = await BroadcastSettings.create(payload);
  return toBroadcastSettingDto(setting);
};

module.exports = createBroadcastSetting;
