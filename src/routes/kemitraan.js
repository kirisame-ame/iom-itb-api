const { Router } = require('express');
const {
  GetKemitraanById,
  GetAllKemitraan,
  CreateNewKemitraan,
  UpdateKemitraanById,
  DeleteKemitraanById,
} = require('../controllers/kemitraan');
const upload = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllKemitraan);
router.get('/:id', [], GetKemitraanById);

// Allow upload for 'logo' (image) and 'file' (PDF) fields
router.post(
  '',
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  CreateNewKemitraan
);
router.put(
  '/:id',
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  UpdateKemitraanById
);
router.delete('/:id', [], DeleteKemitraanById);

module.exports = router;
