const { BroadcastSettings } = require('../../models');

const deleteBroadcastSetting = async (id) => {
  const setting = await BroadcastSettings.findByPk(id);
  if (!setting) throw new Error('Broadcast setting not found');
  await setting.destroy();
  return { message: 'Deleted' };
};

module.exports = deleteBroadcastSetting;
