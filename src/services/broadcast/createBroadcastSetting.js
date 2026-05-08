const { BroadcastSettings } = require('../../models');

const createBroadcastSetting = async (body) => {
  const { name, scheduleDay, scheduleInterval, jenisIuran, template, recipients, isActive } = body;
  const setting = await BroadcastSettings.create({
    name,
    scheduleDay,
    scheduleInterval,
    jenisIuran,
    template,
    recipients: recipients || [],
    isActive: isActive !== undefined ? isActive : true,
  });
  return setting;
};

module.exports = createBroadcastSetting;
