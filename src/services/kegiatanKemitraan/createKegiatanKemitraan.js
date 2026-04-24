const { KegiatanKemitraan } = require('../../models');

const ALLOWED_FIELDS = [
  'kemitraanId',
  'name',
  'description',
  'location',
  'startDate',
  'endDate',
  'status',
  'image',
];

module.exports = async (body = {}) => {
  const payload = {};
  for (const key of ALLOWED_FIELDS) {
    const value = body[key];
    if (value === undefined) continue;
    if (key === 'image' && typeof value !== 'string') continue;
    payload[key] = value;
  }
  return await KegiatanKemitraan.create(payload);
};
