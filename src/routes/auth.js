const { Router } = require('express');
const {
  getMe,
  getApps,
  selectApp,
  registerUser,
} = require('../controllers/ssoAuth');
const router = Router();
const JWTValidation = require('../middlewares/auth');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

router.get('/me', JWTValidation, getMe);
router.get('/apps', JWTValidation, getApps);
router.post('/select', JWTValidation, selectApp);
router.post('/register', apiKeyAuth, registerUser);

module.exports = router;
