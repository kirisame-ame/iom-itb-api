'use strict';

const express = require('express');
const router = express.Router();
const bankesMockController = require('../controllers/bankesMock');

// Kami sengaja tidak memasang Middleware JWTValidation sementara agar Anda 
// bisa langsung / cepat mengujinya di Frontend tanpa takut error 401 Unauthorized.
router.get('/mahasiswa', bankesMockController.getMahasiswa);
router.get('/ota', bankesMockController.getOta);

module.exports = router;
