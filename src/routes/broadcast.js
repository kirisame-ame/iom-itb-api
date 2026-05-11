const express = require('express');
const router = express.Router();
const { BroadcastSettings, BroadcastLogs } = require('../models');
const JWTValidation = require('../middlewares/auth');
const createBroadcastSetting = require('../services/broadcast/createBroadcastSetting');
const updateBroadcastSetting = require('../services/broadcast/updateBroadcastSetting');
const deleteBroadcastSetting = require('../services/broadcast/deleteBroadcastSetting');
const runBroadcast = require('../services/broadcast/runBroadcast');
const getBroadcastRecipients = require('../services/broadcast/getBroadcastRecipients');

// GET /broadcast/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await BroadcastSettings.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ data: settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/settings', JWTValidation, async (req, res) => {
  try {
    const setting = await createBroadcastSetting(req.body);
    res.status(201).json({ data: setting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/settings/:id', JWTValidation, async (req, res) => {
  try {
    const setting = await updateBroadcastSetting(req.params.id, req.body);
    res.json({ data: setting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/settings/:id', JWTValidation, async (req, res) => {
  try {
    await deleteBroadcastSetting(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/run/:id', JWTValidation, async (req, res) => {
  try {
    const result = await runBroadcast(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /broadcast/logs
router.get('/logs', async (req, res) => {
  try {
    const { settingId, page = 1, limit = 20 } = req.query;
    const where = settingId ? { broadcastSettingId: settingId } : {};
    const offset = (page - 1) * limit;
    const { count, rows } = await BroadcastLogs.findAndCountAll({
      where,
      order: [['sentAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /broadcast/members — list members with WA & email
router.get('/members', async (req, res) => {
  try {
    const data = await getBroadcastRecipients();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
