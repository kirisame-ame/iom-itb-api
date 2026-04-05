const { Router } = require('express');
const { 
  createKemitraan, 
  getKemitraan, 
  updateKemitraan, 
  deleteKemitraan 
} = require('../controllers/kemitraan');
const auth = require('../middlewares/auth');

const router = Router();

router.get('', [], getKemitraan);
router.post('', [auth], createKemitraan);
router.put('/:id', [auth], updateKemitraan);
router.delete('/:id', [auth], deleteKemitraan);

module.exports = router;