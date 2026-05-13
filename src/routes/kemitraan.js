const { Router } = require('express');
const {
  GetKemitraanById,
  GetAllKemitraan,
  CreateNewKemitraan,
  UpdateKemitraanById,
  DeleteKemitraanById,
} = require('../controllers/kemitraan');
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');

const router = Router();

router.get('', optionalAuth, GetAllKemitraan);
router.get('/:id', optionalAuth, GetKemitraanById);

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
