const { Router } = require('express');
const {
  CreateKemitraan,
  GetKemitraan,
  UpdateKemitraan,
  DeleteKemitraan
} = require('../controllers/kemitraan');
const auth = require('../middlewares/auth');

const router = Router();

router.get('', [], GetKemitraan);
router.post('', [auth], CreateKemitraan);
router.put('/:id', [auth], UpdateKemitraan);
router.delete('/:id', [auth], DeleteKemitraan);

module.exports = router;