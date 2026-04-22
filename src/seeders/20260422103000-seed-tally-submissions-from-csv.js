'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { parse } = require('csv-parse/sync');

const FORM_CONFIGS = [
  {
    fileName: 'Form_Pendaftaran_Anggota.csv',
    formSlug: 'pendaftaran_anggota',
  },
  {
    fileName: 'Form_Pengajuan_Bantuan.csv',
    formSlug: 'pengajuan_bantuan',
  },
  {
    fileName: 'Form_Orang_Tua_Asuh.csv',
    formSlug: 'orang_tua_asuh',
  },
];

function buildRowKeyMap(row) {
  const map = {};

  Object.keys(row || {}).forEach((rawKey) => {
    const normalized = String(rawKey).trim().toLowerCase();
    map[normalized] = row[rawKey];
  });

  return map;
}

function pickValue(row, aliases) {
  const keyMap = buildRowKeyMap(row);

  for (const alias of aliases) {
    const normalizedAlias = String(alias).trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(keyMap, normalizedAlias)) {
      const value = keyMap[normalizedAlias];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim();
      }
    }
  }

  return null;
}

function pickWhatsapp(row) {
  const direct = pickValue(row, ['No WA', 'Nomor WA', 'Nomor HP', 'no wa', 'nomor wa', 'nomor hp']);
  if (direct) {
    return direct;
  }

  const keyMap = buildRowKeyMap(row);
  const phoneLikeKey = Object.keys(keyMap).find((key) => {
    return key.includes('wa') || key.includes('whatsapp') || key.includes('nomor hp') || key.includes('phone');
  });

  if (!phoneLikeKey) {
    return null;
  }

  const value = keyMap[phoneLikeKey];
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseSubmittedAt(rawValue) {
  if (!rawValue) {
    return null;
  }

  const value = String(rawValue).trim();
  if (!value) {
    return null;
  }

  // Handles Tally CSV datetime shape like 2024-07-22 14:25:23
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value)) {
    return new Date(value.replace(' ', 'T') + 'Z');
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function normalizeSubmissionId(row, fallbackSeed) {
  const direct = pickValue(row, ['Submission ID', 'submission id', 'submissionid']);
  if (direct) {
    return direct;
  }

  return crypto.createHash('sha256').update(fallbackSeed).digest('hex').slice(0, 40);
}

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const csvDir = process.env.SEED_CSV_DIR || __dirname;
    const submissionRows = [];

    for (const config of FORM_CONFIGS) {
      const filePath = path.join(csvDir, config.fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error(
          `CSV file not found: ${filePath}. Set SEED_CSV_DIR to your private CSV directory when running seed.`,
        );
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        relax_quotes: true,
        relax_column_count: true,
        trim: false,
      });

      records.forEach((row, index) => {
        const tallySubmissionId = normalizeSubmissionId(
          row,
          `${config.formSlug}:${config.fileName}:${index}:${JSON.stringify(row)}`,
        );

        const respondentId = pickValue(row, ['Respondent ID', 'respondent id', 'respondentid']);
        const formId = pickValue(row, ['Form ID', 'form id', 'formid']);
        const submittedAtRaw = pickValue(row, ['Submitted at', 'submitted at', 'submittedat']);
        const submittedAt = parseSubmittedAt(submittedAtRaw) || now;
        const extractedWhatsapp = pickWhatsapp(row);

        submissionRows.push({
          tallySubmissionId,
          respondentId,
          formId,
          formSlug: config.formSlug,
          submittedAt,
          payload: JSON.stringify(row),
          extractedWhatsapp,
          sourceType: 'csv_seed',
          createdAt: now,
          updatedAt: now,
        });
      });
    }

    if (submissionRows.length === 0) {
      return;
    }

    await queryInterface.bulkInsert('TallySubmissions', submissionRows, {
      updateOnDuplicate: [
        'respondentId',
        'formId',
        'submittedAt',
        'payload',
        'extractedWhatsapp',
        'updatedAt',
      ],
    });

    await queryInterface.sequelize.query(`
      INSERT INTO PengajuanBantuanStatuses
        (submissionId, currentStatus, catatan, updatedBy, createdAt, updatedAt)
      SELECT
        ts.id,
        'VERIFIKASI_BERKAS',
        NULL,
        'SEEDER',
        NOW(),
        NOW()
      FROM TallySubmissions ts
      WHERE ts.formSlug = 'pengajuan_bantuan'
      AND NOT EXISTS (
        SELECT 1
        FROM PengajuanBantuanStatuses pbs
        WHERE pbs.submissionId = ts.id
      )
    `);

    await queryInterface.sequelize.query(`
      INSERT INTO PengajuanBantuanStatusHistories
        (submissionId, oldStatus, newStatus, oldCatatan, newCatatan, changedBy, changedAt, createdAt, updatedAt)
      SELECT
        pbs.submissionId,
        NULL,
        pbs.currentStatus,
        NULL,
        pbs.catatan,
        'SEEDER',
        NOW(),
        NOW(),
        NOW()
      FROM PengajuanBantuanStatuses pbs
      INNER JOIN TallySubmissions ts ON ts.id = pbs.submissionId
      WHERE ts.formSlug = 'pengajuan_bantuan'
      AND ts.sourceType = 'csv_seed'
      AND NOT EXISTS (
        SELECT 1
        FROM PengajuanBantuanStatusHistories pbsh
        WHERE pbsh.submissionId = pbs.submissionId
      )
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DELETE ts
      FROM TallySubmissions ts
      WHERE ts.sourceType = 'csv_seed'
    `);
  },
};
