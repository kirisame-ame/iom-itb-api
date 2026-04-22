const { Router } = require('express');
const JWTValidation = require('../middlewares/auth');
const {
  ListTallySubmissionsByForm,
  GetTallySubmissionById,
  UpdatePengajuanBantuanStatus,
} = require('../controllers/tallySubmissions');

const router = Router();

router.get('/form/:formSlug', JWTValidation, ListTallySubmissionsByForm);
router.get('/form/:formSlug/:tallySubmissionId', JWTValidation, GetTallySubmissionById);
router.patch('/pengajuan-bantuan/:tallySubmissionId/status', JWTValidation, UpdatePengajuanBantuanStatus);

module.exports = router;
