const { Router } = require('express');
const {
  GetKemitraanById,
  GetAllKemitraan,
  GetPublicKemitraan,
  GetPublicKemitraanById,
  CreateNewKemitraan,
  UpdateKemitraanById,
  DeleteKemitraanById,
} = require('../controllers/kemitraan');
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { KEMITRAAN_ROLES } = require('../utils/roles');

const router = Router();
const canManageKemitraan = [JWTValidation, requireRoles(KEMITRAAN_ROLES)];

router.get('/public', GetPublicKemitraan);
router.get('/public/:id', GetPublicKemitraanById);
router.get('/admin', canManageKemitraan, GetAllKemitraan);
router.get('/admin/:id', canManageKemitraan, GetKemitraanById);

router.post(
  '/admin',
  canManageKemitraan,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  CreateNewKemitraan
);
router.put(
  '/admin/:id',
  canManageKemitraan,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  UpdateKemitraanById
);
router.delete('/admin/:id', canManageKemitraan, DeleteKemitraanById);

router.get('', GetPublicKemitraan);
router.get('/:id', GetPublicKemitraanById);

router.post(
  '',
  canManageKemitraan,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  CreateNewKemitraan
);
router.put(
  '/:id',
  canManageKemitraan,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  UpdateKemitraanById
);
router.delete('/:id', canManageKemitraan, DeleteKemitraanById);

module.exports = router;
