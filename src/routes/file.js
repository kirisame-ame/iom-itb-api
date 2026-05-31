const { Router } = require('express');
const { uploadFile, downloadFile, previewFile, uploadImage } = require('../controllers/file');
const uploadImageMiddleware = require('../middlewares/uploadImage');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { ALL_ADMIN_WEB_ROLES } = require('../utils/roles');

const router = Router();

router.post('/upload', JWTValidation, requireRoles(ALL_ADMIN_WEB_ROLES), uploadFile);
router.get('/download', [], downloadFile);
router.get('/preview', [], previewFile);
router.post('/images/upload',
  JWTValidation,
  requireRoles(ALL_ADMIN_WEB_ROLES),
  uploadImageMiddleware.single('image'), 
  uploadImage
);

module.exports = router;
