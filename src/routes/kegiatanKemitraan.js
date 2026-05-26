const { Router } = require('express');
const ctrl = require('../controllers/kegiatanKemitraan');
const auth = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { KEMITRAAN_ROLES } = require('../utils/roles');
const upload = require('../middlewares/multer');

const router = Router();

router.get('', [], ctrl.GetAll);
router.post('', [auth, requireRoles(KEMITRAAN_ROLES), upload.fields([{ name: 'image', maxCount: 1 }])], ctrl.Create);
router.put('/:id', [auth, requireRoles(KEMITRAAN_ROLES), upload.fields([{ name: 'image', maxCount: 1 }])], ctrl.Update);
router.delete('/:id', [auth, requireRoles(KEMITRAAN_ROLES)], ctrl.Delete);

module.exports = router;
