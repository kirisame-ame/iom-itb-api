const { Router } = require('express');
const { uploadImage } = require('../controllers/file');
const upload = require('../middlewares/multer');

const router = Router();

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;