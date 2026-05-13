const { StatusCodes } = require('http-status-codes');
const BaseError = require('../schemas/responses/BaseError');

const BROADCAST_INTERVALS = new Set(['weekly', 'monthly', '3months']);
const DELIVERY_STATUSES = new Set(['sent', 'failed', 'skipped']);

const toPlain = (value) => (typeof value?.toJSON === 'function' ? value.toJSON() : value || {});

const parseRecipients = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeText = (value) => String(value || '').trim();

const toBoolean = (value, fallback = true) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
};

const toInteger = (value) => {
  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : NaN;
};

const assertBroadcastPayload = (payload, { partial = false } = {}) => {
  const requiredFields = ['name', 'jenisIuran', 'scheduleInterval', 'scheduleDay', 'template'];
  const missing = requiredFields.filter((field) => !partial && (payload[field] === undefined || payload[field] === null || payload[field] === ''));
  if (missing.length) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: `${missing.join(', ')} wajib diisi`,
    });
  }

  if (payload.scheduleInterval !== undefined && !BROADCAST_INTERVALS.has(payload.scheduleInterval)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Interval broadcast tidak valid',
    });
  }

  if (payload.scheduleDay !== undefined) {
    const scheduleDay = toInteger(payload.scheduleDay);
    const maxDay = payload.scheduleInterval === 'weekly' ? 7 : 31;
    if (!Number.isInteger(scheduleDay) || scheduleDay < 1 || scheduleDay > maxDay) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: payload.scheduleInterval === 'weekly'
          ? 'Hari jadwal wajib antara 1 sampai 7'
          : 'Tanggal jadwal wajib antara 1 sampai 31',
      });
    }
  }
};

const normalizeRecipient = (recipient) => ({
  id: recipient?.id !== undefined && recipient?.id !== null ? String(recipient.id) : '',
  name: normalizeText(recipient?.name) || '-',
  nim: normalizeText(recipient?.nim) || null,
  noWhatsapp: normalizeText(recipient?.noWhatsapp) || null,
  email: normalizeText(recipient?.email) || null,
});

const normalizeRecipients = (recipients) => parseRecipients(recipients).map(normalizeRecipient);

const toBroadcastSettingDto = (setting) => {
  const data = toPlain(setting);
  return {
    id: Number(data.id),
    name: data.name || '',
    scheduleDay: Number(data.scheduleDay || 1),
    scheduleInterval: data.scheduleInterval || 'monthly',
    jenisIuran: data.jenisIuran || '',
    template: data.template || '',
    recipients: normalizeRecipients(data.recipients),
    isActive: Boolean(data.isActive),
    lastRunAt: data.lastRunAt || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
};

const toBroadcastLogDto = (log) => {
  const data = toPlain(log);
  const waStatus = DELIVERY_STATUSES.has(data.waStatus) ? data.waStatus : 'skipped';
  const emailStatus = DELIVERY_STATUSES.has(data.emailStatus) ? data.emailStatus : 'skipped';

  return {
    id: Number(data.id),
    broadcastSettingId: Number(data.broadcastSettingId),
    broadcastName: data.broadcastName || '',
    recipientName: data.recipientName || null,
    waNumber: data.waNumber || null,
    email: data.email || null,
    waStatus,
    emailStatus,
    waError: data.waError || null,
    emailError: data.emailError || null,
    sentAt: data.sentAt || null,
  };
};

const toBroadcastLogsDto = ({ rows, count, page, limit }) => {
  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 20;

  return {
    data: rows.map(toBroadcastLogDto),
    pagination: {
      total: Number(count || 0),
      page: currentPage,
      totalPages: Math.ceil(Number(count || 0) / pageLimit),
      limit: pageLimit,
    },
  };
};

const toBroadcastRecipientDto = (recipient) => normalizeRecipient(recipient);

const toBroadcastSettingCreatePayload = (body) => {
  const payload = {
    name: normalizeText(body.name),
    scheduleDay: toInteger(body.scheduleDay),
    scheduleInterval: normalizeText(body.scheduleInterval),
    jenisIuran: normalizeText(body.jenisIuran),
    template: normalizeText(body.template),
    recipients: normalizeRecipients(body.recipients),
    isActive: toBoolean(body.isActive, true),
  };

  assertBroadcastPayload(payload);
  return payload;
};

const toBroadcastSettingUpdatePayload = (body, setting) => {
  const current = toBroadcastSettingDto(setting);
  const payload = {
    name: body.name !== undefined ? normalizeText(body.name) : current.name,
    scheduleDay: body.scheduleDay !== undefined ? toInteger(body.scheduleDay) : current.scheduleDay,
    scheduleInterval: body.scheduleInterval !== undefined ? normalizeText(body.scheduleInterval) : current.scheduleInterval,
    jenisIuran: body.jenisIuran !== undefined ? normalizeText(body.jenisIuran) : current.jenisIuran,
    template: body.template !== undefined ? normalizeText(body.template) : current.template,
    recipients: body.recipients !== undefined ? normalizeRecipients(body.recipients) : current.recipients,
    isActive: body.isActive !== undefined ? toBoolean(body.isActive, current.isActive) : current.isActive,
  };

  assertBroadcastPayload(payload);
  return payload;
};

const toBroadcastRecipientUpdatePayload = (body) => {
  const payload = {
    name: normalizeText(body.name),
    nim: normalizeText(body.nim),
    noWhatsapp: normalizeText(body.noWhatsapp),
    email: normalizeText(body.email),
  };

  if (!payload.name) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Nama penerima wajib diisi',
    });
  }

  if (!payload.noWhatsapp && !payload.email) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Minimal salah satu dari No. WhatsApp atau Email wajib diisi',
    });
  }

  return payload;
};

const toBroadcastRecipientCreatePayload = (body) => {
  return toBroadcastRecipientUpdatePayload(body);
};

const toBroadcastRecipientImportPayload = (body) => {
  const payload = {
    name: normalizeText(body.name),
    nim: normalizeText(body.nim),
    noWhatsapp: normalizeText(body.noWhatsapp),
    email: normalizeText(body.email),
  };

  if (!payload.name || (!payload.noWhatsapp && !payload.email)) return null;
  return payload;
};

const toBroadcastImportResultDto = ({ inserted, skipped, total }) => ({
  inserted: Number(inserted || 0),
  skipped: Number(skipped || 0),
  total: Number(total || 0),
});

const toBroadcastRunDto = ({ sent, attempted, logs }) => ({
  sent: Number(sent || 0),
  attempted: Number(attempted || 0),
  logs: Array.isArray(logs) ? logs.map(toBroadcastLogDto) : [],
});

module.exports = {
  normalizeRecipients,
  toBroadcastImportResultDto,
  toBroadcastLogDto,
  toBroadcastLogsDto,
  toBroadcastRecipientCreatePayload,
  toBroadcastRecipientDto,
  toBroadcastRecipientImportPayload,
  toBroadcastRecipientUpdatePayload,
  toBroadcastRunDto,
  toBroadcastSettingCreatePayload,
  toBroadcastSettingDto,
  toBroadcastSettingUpdatePayload,
};
