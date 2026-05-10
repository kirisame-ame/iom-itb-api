const { BroadcastSettings } = require('../../models');

const updateBroadcastSetting = async (id, body) => {
  const setting = await BroadcastSettings.findByPk(id);
  if (!setting) throw new Error('Broadcast setting not found');

  const { name, scheduleDay, scheduleInterval, jenisIuran, template, recipients, isActive } = body;
  await setting.update({
    name: name !== undefined ? name : setting.name,
    scheduleDay: scheduleDay !== undefined ? scheduleDay : setting.scheduleDay,
    scheduleInterval: scheduleInterval !== undefined ? scheduleInterval : setting.scheduleInterval,
    jenisIuran: jenisIuran !== undefined ? jenisIuran : setting.jenisIuran,
    template: template !== undefined ? template : setting.template,
    recipients: recipients !== undefined ? recipients : setting.recipients,
    isActive: isActive !== undefined ? isActive : setting.isActive,
  });
  return setting;
};

module.exports = updateBroadcastSetting;
