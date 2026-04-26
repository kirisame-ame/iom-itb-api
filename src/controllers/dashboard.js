'use strict';

const statsService = require('../services/dashboard/dashboardStats');
const chartsService = require('../services/dashboard/dashboardCharts');
const recentService = require('../services/dashboard/dashboardRecent');

module.exports = {
  async getStats(req, res) {
    const data = await statsService.getStats();
    res.json(data);
  },

  async getCharts(req, res) {
    const data = await chartsService.getCharts();
    res.json(data);
  },

  async getRecent(req, res) {
    const data = await recentService.getRecent();
    res.json(data);
  }
};