const { Router } = require('express');
const {
  GetHelpSubmissionById,
  GetAllHelpSubmissions,
  CreateNewHelpSubmission,
  UpdateHelpSubmissionById,
  DeleteHelpSubmissionById,
} = require('../controllers/helpSubmissions');
const upload  = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { BANTUAN_ROLES } = require('../utils/roles');

const router = Router();

router.get('', JWTValidation, requireRoles(BANTUAN_ROLES), GetAllHelpSubmissions);
router.get('/:id', JWTValidation, requireRoles(BANTUAN_ROLES), GetHelpSubmissionById);
router.post('', upload.fields([{ name: 'file', maxCount: 1 }]), CreateNewHelpSubmission);
router.put('/:id', JWTValidation, requireRoles(BANTUAN_ROLES), upload.fields([{ name: 'file', maxCount: 1 }]), UpdateHelpSubmissionById);
router.delete('/:id', JWTValidation, requireRoles(BANTUAN_ROLES), DeleteHelpSubmissionById);

module.exports = router;
