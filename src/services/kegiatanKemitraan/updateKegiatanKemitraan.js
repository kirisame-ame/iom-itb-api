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

module.exports = async (id, body = {}) => {
  const data = await KegiatanKemitraan.findByPk(id);
  if (!data) throw new Error('Kegiatan tidak ditemukan');

  const payload = {};
  for (const key of ALLOWED_FIELDS) {
    const value = body[key];
    if (value === undefined) continue;
    if (key === 'image' && typeof value !== 'string') continue;
    payload[key] = value;
  }
  return await data.update(payload);
};
