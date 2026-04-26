const { Router } = require('express');
const { uploadImage } = require('../controllers/file');
const uploadImageMiddleware = require('../middlewares/uploadImage');

const router = Router();

router.post('/upload',
  uploadImageMiddleware.single('image'),
  uploadImage
);

module.exports = router;