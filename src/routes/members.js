const { Router } = require('express');
const {
  GetMemberById,
  GetAllMembers,
  CreateNewMember,
  UpdateMemberById,
  DeleteMemberById,
} = require('../controllers/members');
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', [], GetAllMembers);
router.get('/:id', [], GetMemberById);

router.post('', JWTValidation, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'file', maxCount: 1 }]), CreateNewMember);
router.put('/:id', JWTValidation, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'file', maxCount: 1 }]), UpdateMemberById);
router.delete('/:id', JWTValidation, DeleteMemberById);

module.exports = router;
