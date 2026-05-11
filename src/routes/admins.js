const { Router } = require('express');
const {
  CreateNewAdmin,
} = require('../controllers/admins');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.post('/', JWTValidation, CreateNewAdmin);

module.exports = router;
