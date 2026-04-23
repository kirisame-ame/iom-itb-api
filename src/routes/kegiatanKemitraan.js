const { Router } = require('express');
const ctrl = require('../controllers/kegiatanKemitraan');
const auth = require('../middlewares/auth');

const router = Router();

router.get('', [], ctrl.GetAll);
router.post('', [auth], ctrl.Create);
router.put('/:id', [auth], ctrl.Update);
router.delete('/:id', [auth], ctrl.Delete);

module.exports = router;