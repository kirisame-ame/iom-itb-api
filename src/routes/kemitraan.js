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

const router = Router();

router.get('/public', GetPublicKemitraan);
router.get('/public/:id', GetPublicKemitraanById);
router.get('/admin', JWTValidation, GetAllKemitraan);
router.get('/admin/:id', JWTValidation, GetKemitraanById);

router.post(
  '/admin',
  JWTValidation,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  CreateNewKemitraan
);
router.put(
  '/admin/:id',
  JWTValidation,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  UpdateKemitraanById
);
router.delete('/admin/:id', JWTValidation, DeleteKemitraanById);

router.get('', GetPublicKemitraan);
router.get('/:id', GetPublicKemitraanById);

router.post(
  '',
  JWTValidation,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  CreateNewKemitraan
);
router.put(
  '/:id',
  JWTValidation,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  UpdateKemitraanById
);
router.delete('/:id', JWTValidation, DeleteKemitraanById);

module.exports = router;
