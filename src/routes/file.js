const { Router } = require('express');
const { uploadFile, downloadFile, previewFile, uploadImage } = require('../controllers/file');
const uploadImageMiddleware = require('../middlewares/uploadImage');

const router = Router();

router.post('/upload', [], uploadFile);
router.get('/download', [], downloadFile);
router.get('/preview', [], previewFile);
router.post('/images/upload', 
  uploadImageMiddleware.single('image'), 
  uploadImage
);

module.exports = router;