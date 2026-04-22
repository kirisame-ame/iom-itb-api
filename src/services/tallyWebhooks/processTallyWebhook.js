'use strict';

const crypto = require('crypto');
const { UniqueConstraintError } = require('sequelize');
const db = require('../../models');
const triggerWhatsappNotificationStub = require('./triggerWhatsappNotificationStub');

const FORM_SLUGS = {
  PENDAFTARAN_ANGGOTA: 'pendaftaran_anggota',
  PENGAJUAN_BANTUAN: 'pengajuan_bantuan',
  ORANG_TUA_ASUH: 'orang_tua_asuh',
};

function normalizeTextForMatching(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPhoneLikeLabelOrKey(input) {
  const normalized = normalizeTextForMatching(input);

  if (!normalized) {
    return false;
  }

  return (
    normalized.includes('nomor wa') ||
    normalized.includes('no wa') ||
    normalized.includes('whatsapp') ||
    normalized.includes('nomor hp') ||
    normalized.includes('phone number') ||
    normalized === 'phone' ||
    normalized.includes(' phone ')
  );
}

function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return null;
    }
    current = current[part];
  }

  return current ?? null;
}

function pickFirst(payload, paths) {
  for (const p of paths) {
    const value = getNestedValue(payload, p);
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return null;
}

function pickWhatsappRecursively(node) {
  if (node === null || node === undefined) {
    return null;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = pickWhatsappRecursively(item);
      if (found) {
        return found;
      }
    }
    return null;
  }

  if (typeof node === 'object') {
    for (const [rawKey, value] of Object.entries(node)) {
      if (isPhoneLikeLabelOrKey(rawKey)) {
        if (value !== null && value !== undefined && String(value).trim() !== '') {
          return String(value).trim();
        }
      }

      const nested = pickWhatsappRecursively(value);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function pickWhatsappFromTallyFields(payload) {
  const fields = getNestedValue(payload, 'data.fields') || getNestedValue(payload, 'event.data.fields');

  if (!Array.isArray(fields)) {
    return null;
  }

  // Tally officially provides typed fields. Prefer explicit phone field type first.
  const phoneField = fields.find((field) => {
    return (
      field &&
      String(field.type || '').toUpperCase() === 'INPUT_PHONE_NUMBER' &&
      field.value !== null &&
      field.value !== undefined &&
      String(field.value).trim() !== ''
    );
  });

  if (phoneField) {
    return String(phoneField.value).trim();
  }

  // Fallback to label matching for custom text/number fields used as phone/WA.
  const labelMatched = fields.find((field) => {
    const hasPhoneLabel = isPhoneLikeLabelOrKey(field?.label || field?.key || '');

    return hasPhoneLabel && field?.value !== null && field?.value !== undefined && String(field.value).trim() !== '';
  });

  if (labelMatched) {
    return String(labelMatched.value).trim();
  }

  return null;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const asString = String(value).trim();
  if (!asString) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(asString)) {
    return new Date(asString.replace(' ', 'T') + 'Z');
  }

  const parsed = new Date(asString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function sha256Hex(inputBuffer) {
  return crypto.createHash('sha256').update(inputBuffer).digest('hex');
}

function extractSignatureCandidates(signatureHeaderValue) {
  if (!signatureHeaderValue) {
    return [];
  }

  const raw = String(signatureHeaderValue).trim();
  const candidates = [raw];

  // Supports values like: sha256=<hex> or t=...,v1=<hex>
  raw.split(',').forEach((segment) => {
    const [key, value] = segment.split('=');
    if (!value) {
      return;
    }

    const normalizedKey = String(key || '').trim().toLowerCase();
    const normalizedValue = String(value || '').trim();

    if (normalizedKey === 'v1' || normalizedKey === 'sha256') {
      candidates.push(normalizedValue);
    }
  });

  return [...new Set(candidates)];
}

function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

function isSignatureValid({ rawBody, signatureHeaderValue, secret }) {
  if (!secret) {
    return false;
  }

  // Tally docs show base64 digest in examples. We support both base64 and hex variants.
  const expectedBase64 = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  const expectedHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const candidates = extractSignatureCandidates(signatureHeaderValue);

  return candidates.some((candidate) => {
    const normalized = String(candidate).replace(/^sha256=/i, '').trim();
    return safeEqual(normalized, expectedBase64) || safeEqual(normalized, expectedHex);
  });
}

function normalizePayload(rawBodyBuffer) {
  let payload = {};

  try {
    payload = JSON.parse(rawBodyBuffer.toString('utf8'));
  } catch (error) {
    const parseError = new Error('Invalid JSON payload');
    parseError.status = 400;
    throw parseError;
  }

  const submissionId = pickFirst(payload, [
    'data.submissionId',
    'event.data.submissionId',
    'submissionId',
    'Submission ID',
  ]);

  const respondentId = pickFirst(payload, [
    'data.respondentId',
    'event.data.respondentId',
    'respondentId',
    'Respondent ID',
  ]);

  const formId = pickFirst(payload, ['data.formId', 'event.data.formId', 'formId']);

  const submittedAtRaw =
    pickFirst(payload, ['data.submittedAt', 'data.createdAt', 'event.data.createdAt', 'submittedAt', 'createdAt']) ||
    null;

  const submittedAt = parseDate(submittedAtRaw) || new Date();
  const extractedWhatsapp = pickWhatsappFromTallyFields(payload) || pickWhatsappRecursively(payload);

  return {
    payload,
    submissionId,
    respondentId,
    formId,
    submittedAt,
    extractedWhatsapp,
  };
}

async function processTallyWebhook({ formSlug, headers, rawBody }) {
  const secret = process.env.TALLY_WEBHOOK_SECRET || '';
  const signatureHeaderName = (process.env.TALLY_WEBHOOK_SIGNATURE_HEADER || 'tally-signature').toLowerCase();
  const signatureRequired =
    process.env.TALLY_WEBHOOK_SIGNATURE_REQUIRED === 'true' || process.env.NODE_ENV === 'production';

  const signatureHeaderValue = headers[signatureHeaderName] || headers[signatureHeaderName.toLowerCase()] || null;

  if (signatureRequired) {
    const valid = isSignatureValid({ rawBody, signatureHeaderValue, secret });
    if (!valid) {
      const unauthorizedError = new Error('Invalid webhook signature');
      unauthorizedError.status = 401;
      throw unauthorizedError;
    }
  }

  const normalized = normalizePayload(rawBody);
  const fallbackSubmissionHash = sha256Hex(rawBody).slice(0, 40);
  const tallySubmissionId = normalized.submissionId || fallbackSubmissionHash;
  const payloadEventId = pickFirst(normalized.payload, ['eventId', 'data.responseId', 'data.submissionId']);
  const eventKeySource =
    headers['x-tally-event-id'] ||
    headers['x-webhook-id'] ||
    payloadEventId ||
    `${formSlug}:${tallySubmissionId}:${normalized.submittedAt.toISOString()}`;
  const eventKey = `${formSlug}:${eventKeySource}`;

  let webhookEvent;
  try {
    webhookEvent = await db.TallyWebhookEvents.create({
      eventKey,
      formSlug,
      signatureHeader: signatureHeaderValue,
      headersJson: headers,
      payloadJson: normalized.payload,
      processStatus: 'RECEIVED',
      receivedAt: new Date(),
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return {
        duplicated: true,
      };
    }
    throw error;
  }

  try {
    await db.sequelize.transaction(async (transaction) => {
      await db.TallySubmissions.upsert(
        {
          tallySubmissionId,
          respondentId: normalized.respondentId,
          formId: normalized.formId,
          formSlug,
          submittedAt: normalized.submittedAt,
          payload: normalized.payload,
          extractedWhatsapp: normalized.extractedWhatsapp,
          sourceType: 'webhook',
        },
        { transaction },
      );

      const submission = await db.TallySubmissions.findOne({
        where: {
          formSlug,
          tallySubmissionId,
        },
        transaction,
      });

      if (formSlug === FORM_SLUGS.PENGAJUAN_BANTUAN && submission) {
        await db.PengajuanBantuanStatuses.findOrCreate({
          where: {
            submissionId: submission.id,
          },
          defaults: {
            submissionId: submission.id,
            currentStatus: 'VERIFIKASI_BERKAS',
            catatan: null,
            updatedBy: 'SYSTEM_WEBHOOK',
          },
          transaction,
        });

        await db.PengajuanBantuanStatusHistories.findOrCreate({
          where: {
            submissionId: submission.id,
            oldStatus: null,
            newStatus: 'VERIFIKASI_BERKAS',
            oldCatatan: null,
            newCatatan: null,
            changedBy: 'SYSTEM_WEBHOOK',
          },
          defaults: {
            submissionId: submission.id,
            oldStatus: null,
            newStatus: 'VERIFIKASI_BERKAS',
            oldCatatan: null,
            newCatatan: null,
            changedBy: 'SYSTEM_WEBHOOK',
            changedAt: new Date(),
          },
          transaction,
        });
      }

      await webhookEvent.update(
        {
          processStatus: 'PROCESSED',
          processedAt: new Date(),
          errorMessage: null,
        },
        { transaction },
      );
    });

    const processedSubmission = await db.TallySubmissions.findOne({
      where: {
        formSlug,
        tallySubmissionId,
      },
    });

    await triggerWhatsappNotificationStub({
      formSlug,
      submission: processedSubmission,
    });

    return {
      duplicated: false,
      tallySubmissionId,
    };
  } catch (error) {
    await webhookEvent.update({
      processStatus: 'FAILED',
      errorMessage: error.message,
      processedAt: new Date(),
    });

    throw error;
  }
}

module.exports = {
  FORM_SLUGS,
  processTallyWebhook,
};
