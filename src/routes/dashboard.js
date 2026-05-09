const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const JWTValidation = require('../middlewares/auth');

router.get('/stats', JWTValidation, dashboardController.getStats);
router.get('/charts', JWTValidation, dashboardController.getCharts);
router.get('/recent', JWTValidation, dashboardController.getRecent);
router.get('/payments', JWTValidation, dashboardController.getPaymentMonitoring);

module.exports = router;
