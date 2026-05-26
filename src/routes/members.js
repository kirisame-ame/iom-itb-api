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
const requireRoles = require('../middlewares/requireRoles');
const { SECRETARIAT_ROLES } = require('../utils/roles');

const router = Router();
const canManageMembers = [JWTValidation, requireRoles(SECRETARIAT_ROLES)];

router.get('', canManageMembers, GetAllMembers);
router.get('/:id', canManageMembers, GetMemberById);

router.post('', canManageMembers, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'file', maxCount: 1 }]), CreateNewMember);
router.put('/:id', canManageMembers, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'file', maxCount: 1 }]), UpdateMemberById);
router.delete('/:id', canManageMembers, DeleteMemberById);

module.exports = router;
