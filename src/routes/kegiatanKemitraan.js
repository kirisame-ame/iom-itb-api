const { Router } = require('express');
const ctrl = require('../controllers/kegiatanKemitraan');
const auth = require('../middlewares/auth');

const router = Router();

router.get('', [], ctrl.getAll);
router.post('', [auth], ctrl.create);
router.put('/:id', [auth], ctrl.update);
router.delete('/:id', [auth], ctrl.delete);

module.exports = router;