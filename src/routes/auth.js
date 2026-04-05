const { Router } = require('express');
const {
  getMe,
  getApps,
  selectApp,
} = require('../controllers/ssoAuth');
const router = Router();
const JWTValidation = require('../middlewares/auth');

router.get('/me', JWTValidation, getMe);
router.get('/apps', JWTValidation, getApps);
router.post('/select', JWTValidation, selectApp);

module.exports = router;
