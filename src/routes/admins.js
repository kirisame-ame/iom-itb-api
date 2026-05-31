const { Router } = require('express');
const {
  CreateNewAdmin,
} = require('../controllers/admins');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { ROLES } = require('../utils/roles');

const router = Router();

router.post('/', JWTValidation, requireRoles(ROLES.ADMIN), CreateNewAdmin);

module.exports = router;
