const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const { BroadcastRecipients } = require('../../models');

const HEADER_MAP = {
  nama: 'name',
  name: 'name',
  'nim/relasi': 'nim',
  'nim / relasi': 'nim',
  nim: 'nim',
  relasi: 'nim',
  'no. whatsapp': 'noWhatsapp',
  'no whatsapp': 'noWhatsapp',
  whatsapp: 'noWhatsapp',
  wa: 'noWhatsapp',
  nowhatsapp: 'noWhatsapp',
  phone: 'noWhatsapp',
  email: 'email',
};

const normalizeHeader = (h) => String(h || '').trim().toLowerCase().replace(/\s+/g, ' ');
const normalizeCell = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};

const mapRow = (row) => {
  const out = { name: null, nim: null, noWhatsapp: null, email: null };
  for (const [k, v] of Object.entries(row)) {
    const target = HEADER_MAP[normalizeHeader(k)];
    if (target) out[target] = normalizeCell(v);
  }
  return out;
};

const parseFile = (file) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (ext === '.csv') {
    const text = file.buffer.toString('utf8');
    return parse(text, { columns: true, skip_empty_lines: true, trim: true, bom: true });
  }
  if (ext === '.xls' || ext === '.xlsx') {
    const wb = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: '' });
  }
  throw new Error('Format file harus .csv, .xls, atau .xlsx');
};

const importBroadcastRecipients = async (file) => {
  if (!file) throw new Error('File tidak ditemukan.');

  const rawRows = parseFile(file);
  const candidates = rawRows.map(mapRow).filter((r) => r.name && (r.noWhatsapp || r.email));

  if (!candidates.length) {
    throw new Error('Tidak ada baris valid (butuh kolom Nama dan minimal salah satu dari No. WhatsApp/Email).');
  }

  const created = await BroadcastRecipients.bulkCreate(candidates);
  return {
    inserted: created.length,
    skipped: rawRows.length - created.length,
    total: rawRows.length,
  };
};

module.exports = importBroadcastRecipients;
