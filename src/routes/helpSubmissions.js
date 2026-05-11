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

const router = Router();

router.get('', [], GetAllHelpSubmissions);
router.get('/:id', [], GetHelpSubmissionById);
router.post('', upload.fields([{ name: 'file', maxCount: 1 }]), CreateNewHelpSubmission);
router.put('/:id', JWTValidation, upload.fields([{ name: 'file', maxCount: 1 }]), UpdateHelpSubmissionById);
router.delete('/:id', JWTValidation, DeleteHelpSubmissionById);

module.exports = router;
