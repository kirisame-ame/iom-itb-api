'use strict';

const {
  PengajuanBantuanStatuses,
  Donations,
  Transactions,
  TallySubmissions
} = require('../../models');

const { Op } = require('sequelize');

module.exports = {
  async getStats() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total Pengajuan Pending
    const totalPending = await PengajuanBantuanStatuses.count({
      where: {
        currentStatus: 'VERIFIKASI_BERKAS'
      }
    });

    // Total Pengajuan Diterima Bulan Ini
    const approvedThisMonth = await PengajuanBantuanStatuses.count({
      where: {
        currentStatus: 'KEPUTUSAN_DITERIMA',
        updatedAt: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    // Total Donasi
    const totalDonasi = await Donations.sum('amount');

    // 🔹 Pesanan Merchandise Baru
    const pesananBaru = await Transactions.count({
      where: {
        status: 'waiting'
      }
    });
    const totalAnggota = await TallySubmissions.count({
      where: {
        formSlug: 'pendaftaran_anggota'
      }
    });

    // 🔹 Anggota Baru Bulan Ini
    const anggotaBaru = await TallySubmissions.count({
    where: {
        formSlug: 'pendaftaran_anggota',
        submittedAt: {
        [Op.between]: [startOfMonth, endOfMonth]
        }
    }
    });

    return {
      totalPending,
      approvedThisMonth,
      totalDonasi: totalDonasi || 0,
      pesananBaru,
      totalAnggota,
      anggotaBaru
    };
  }
};