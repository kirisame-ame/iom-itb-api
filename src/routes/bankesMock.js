'use strict';

const express = require('express');
const router = express.Router();
const bankesMockController = require('../controllers/bankesMock');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { BANTUAN_ROLES } = require('../utils/roles');

router.get('/mahasiswa', JWTValidation, requireRoles(BANTUAN_ROLES), bankesMockController.getMahasiswa);
router.get('/ota', JWTValidation, requireRoles(BANTUAN_ROLES), bankesMockController.getOta);

module.exports = router;
