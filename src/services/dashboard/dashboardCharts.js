'use strict';

const {
  TallySubmissions,
  PengajuanBantuanStatuses,
  PengajuanBantuanStatusHistories
} = require('../../models');

const { fn, col, literal, Op } = require('sequelize');

module.exports = {
  async getCharts(query = {}) {
    const now = new Date();
    const range = String(query.range || 'week').toLowerCase();

    const rangeMap = {
      week: 7,
      month: 30,
      '3months': 90,
      year: 365,
      all: null,
    };

    const selectedDays = rangeMap[range] ?? 7;
    const trenWhere = {
      formSlug: 'pengajuan_bantuan'
    };

    let startDate = null;
    const endDate = new Date(now);

    if (selectedDays !== null) {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - (selectedDays - 1));
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      trenWhere.submittedAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const trenPengajuanRaw = await TallySubmissions.findAll({
      attributes: [
        [fn('DATE', col('submittedAt')), 'date'],
        [fn('COUNT', col('id')), 'total']
      ],
      where: trenWhere,
      group: [literal('date')],
      order: [[literal('date'), 'ASC']]
    });

    const formatDateKey = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const normalizeDateKey = (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value.slice(0, 10);
      if (value instanceof Date) return formatDateKey(value);
      return formatDateKey(new Date(value));
    };

    let trenPengajuan = trenPengajuanRaw;

    if (startDate) {
      const totalsByDate = new Map(
        trenPengajuanRaw.map((item) => {
          const dateValue = item.get ? item.get('date') : item.date;
          const totalValue = item.get ? item.get('total') : item.total;
          return [normalizeDateKey(dateValue), Number(totalValue) || 0];
        })
      );

      const filled = [];
      const cursor = new Date(startDate);

      while (cursor <= endDate) {
        const key = formatDateKey(cursor);
        filled.push({ date: key, total: totalsByDate.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }

      trenPengajuan = filled;
    }

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