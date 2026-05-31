const { Router } = require('express');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { BANTUAN_ROLES, SUBMISSION_ROLES } = require('../utils/roles');
const {
  ListTallySubmissionsByForm,
  GetTallySubmissionById,
  UpdatePengajuanBantuanStatus,
  SendTallySubmissionWhatsapp,
} = require('../controllers/tallySubmissions');

const router = Router();

router.get('/form/:formSlug', JWTValidation, requireRoles(SUBMISSION_ROLES), ListTallySubmissionsByForm);
router.get('/form/:formSlug/:tallySubmissionId', JWTValidation, requireRoles(SUBMISSION_ROLES), GetTallySubmissionById);
router.post('/form/:formSlug/:tallySubmissionId/whatsapp', JWTValidation, requireRoles(SUBMISSION_ROLES), SendTallySubmissionWhatsapp);
router.patch('/pengajuan-bantuan/:tallySubmissionId/status', JWTValidation, requireRoles(BANTUAN_ROLES), UpdatePengajuanBantuanStatus);

module.exports = router;
