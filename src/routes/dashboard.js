const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { ALL_ADMIN_WEB_ROLES, FINANCE_ROLES } = require('../utils/roles');

router.get('/stats', JWTValidation, requireRoles(ALL_ADMIN_WEB_ROLES), dashboardController.getStats);
router.get('/charts', JWTValidation, requireRoles(ALL_ADMIN_WEB_ROLES), dashboardController.getCharts);
router.get('/recent', JWTValidation, requireRoles(ALL_ADMIN_WEB_ROLES), dashboardController.getRecent);
router.get('/payments', JWTValidation, requireRoles(FINANCE_ROLES), dashboardController.getPaymentMonitoring);

module.exports = router;
