const { Router } = require('express');
const { createKemitraan, getKemitraan } = require('../controllers/kemitraan');
// const auth = require('../middlewares/auth');

const router = Router();

router.get('', [], getKemitraan);
router.post('', [], createKemitraan); 

module.exports = router;