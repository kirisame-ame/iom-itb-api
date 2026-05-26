const { Router } = require('express');
const { uploadImage } = require('../controllers/file');
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { ALL_ADMIN_WEB_ROLES } = require('../utils/roles');

const router = Router();

router.post('/upload', JWTValidation, requireRoles(ALL_ADMIN_WEB_ROLES), upload.single('image'), uploadImage);

module.exports = router;
