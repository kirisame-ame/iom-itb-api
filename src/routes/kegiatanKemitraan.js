const { Router } = require('express');
const ctrl = require('../controllers/kegiatanKemitraan');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer');

const router = Router();

router.get('', [], ctrl.GetAll);
router.post('', [auth, upload.fields([{ name: 'image', maxCount: 1 }])], ctrl.Create);
router.put('/:id', [auth, upload.fields([{ name: 'image', maxCount: 1 }])], ctrl.Update);
router.delete('/:id', [auth], ctrl.Delete);

module.exports = router;
