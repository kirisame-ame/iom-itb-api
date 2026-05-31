'use strict';

const statsService = require('../services/dashboard/dashboardStats');
const chartsService = require('../services/dashboard/dashboardCharts');
const recentService = require('../services/dashboard/dashboardRecent');
const paymentMonitoringService = require('../services/dashboard/paymentMonitoring');
const { extractRoles } = require('../middlewares/requireRoles');
const { ROLES } = require('../utils/roles');

const hasAnyRole = (roles, allowedRoles) => roles.some((role) => allowedRoles.includes(role));

const getDashboardAccess = (req, res) => {
  const roles = extractRoles(req.user || res.locals.user);
  const isFullAccess = hasAnyRole(roles, [ROLES.ADMIN, ROLES.PENGURUS_BIDANG_1]);

  return {
    bantuan: isFullAccess,
    finance: isFullAccess || roles.includes(ROLES.BENDAHARA),
    sekretariat: isFullAccess || roles.includes(ROLES.SEKRETARIAT),
  };
};

const filterStatsByRole = (stats, access) => ({
  totalPending: access.bantuan ? stats.totalPending : 0,
  approvedThisMonth: access.bantuan ? stats.approvedThisMonth : 0,
  totalDonasi: access.finance ? stats.totalDonasi : 0,
  pesananBaru: access.finance ? stats.pesananBaru : 0,
  totalAnggota: access.sekretariat ? stats.totalAnggota : 0,
  anggotaBaru: access.sekretariat ? stats.anggotaBaru : 0,
});

const emptyCharts = {
  trenPengajuan: [],
  distribusiStatus: [],
  penerimaPerTahun: [],
};

const emptyRecent = {
  pengajuanTerbaru: [],
  logAktivitas: [],
};

module.exports = {
  async getStats(req, res) {
    const data = await statsService.getStats();
    res.json(filterStatsByRole(data, getDashboardAccess(req, res)));
  },

  async getCharts(req, res) {
    if (!getDashboardAccess(req, res).bantuan) {
      return res.json(emptyCharts);
    }

    const data = await chartsService.getCharts(req.query);
    return res.json(data);
  },

  async getRecent(req, res) {
    if (!getDashboardAccess(req, res).bantuan) {
      return res.json(emptyRecent);
    }

    const data = await recentService.getRecent();
    return res.json(data);
  },

  async getPaymentMonitoring(req, res) {
    const data = await paymentMonitoringService.getPaymentMonitoring(req.query);
    res.json(data);
  }
};
