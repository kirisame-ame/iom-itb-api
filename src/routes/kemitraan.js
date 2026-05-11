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

const router = Router();

router.get('', [], GetAllKemitraan);
router.get('/:id', [], GetKemitraanById);

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
