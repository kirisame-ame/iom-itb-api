'use strict';

const {
  TallySubmissions,
  PengajuanBantuanStatuses,
  PengajuanBantuanStatusHistories
} = require('../../models');

const { literal } = require('sequelize');

module.exports = {
  async getRecent() {

    // Pengajuan terbaru
    const pengajuanTerbaru = await TallySubmissions.findAll({
      attributes: [
        'submittedAt',
        [
          literal(`JSON_UNQUOTE(JSON_EXTRACT(payload, '$.answersByLabel."Nama"'))`),
          'name'
        ],
        [
          literal(`JSON_UNQUOTE(JSON_EXTRACT(payload, '$.answersByLabel."NIM"'))`),
          'nim'
        ],
        [
          literal(`JSON_UNQUOTE(JSON_EXTRACT(payload, '$.answersByLabel."Jenis Bantuan"'))`),
          'type'
        ]
      ],
      include: [
        {
          model: PengajuanBantuanStatuses,
          as: 'pengajuanStatus',
          attributes: ['currentStatus']
        }
      ],
      where: {
        formSlug: 'pengajuan_bantuan'
      },
      order: [['submittedAt', 'DESC']],
      limit: 10
    });

    // Log aktivitas admin
    const logAktivitas = await PengajuanBantuanStatusHistories.findAll({
      attributes: [
        'changedBy',
        'changedAt',
        'oldStatus',
        'newStatus'
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return {
      pengajuanTerbaru,
      logAktivitas
    };
  }
};