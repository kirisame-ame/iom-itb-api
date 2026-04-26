'use strict';

const {
  TallySubmissions,
  PengajuanBantuanStatuses,
  PengajuanBantuanStatusHistories
} = require('../../models');

const { fn, col, literal, Op } = require('sequelize');

module.exports = {
  async getCharts() {
    const now = new Date();
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    // Tren Pengajuan 7 hari
    const trenPengajuan = await TallySubmissions.findAll({
      attributes: [
        [fn('DATE', col('submittedAt')), 'date'],
        [fn('COUNT', col('id')), 'total']
      ],
      where: {
        submittedAt: {
          [Op.gte]: last7Days
        },
        formSlug: 'pengajuan_bantuan'
      },
      group: [literal('date')],
      order: [[literal('date'), 'ASC']]
    });

    // Distribusi Status
    const distribusiStatus = await PengajuanBantuanStatuses.findAll({
      attributes: [
        'currentStatus',
        [fn('COUNT', col('id')), 'total']
      ],
      group: ['currentStatus']
    });

    // Penerima per Tahun
    const penerimaPerTahun = await PengajuanBantuanStatuses.findAll({
      attributes: [
        [fn('YEAR', col('updatedAt')), 'year'],
        [fn('COUNT', col('id')), 'total']
      ],
      where: {
        currentStatus: 'KEPUTUSAN_DITERIMA'
      },
      group: [literal('year')],
      order: [[literal('year'), 'ASC']]
    });

    return {
      trenPengajuan,
      distribusiStatus,
      penerimaPerTahun
    };
  }
};