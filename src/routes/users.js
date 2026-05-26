const { Router } = require('express');
const {
  GetUserById,
  GetAllUser,
  CreateNewUser,
  UpdateUserById,
  DeleteUserById,
} = require('../controllers/users'); // Updated to 'transaction'
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { ADMIN_FULL_ROLES } = require('../utils/roles');

const router = Router();
const canManageUsers = [JWTValidation, requireRoles(ADMIN_FULL_ROLES)];

router.get('', canManageUsers, GetAllUser);
router.get('/:id', canManageUsers, GetUserById);
router.post('', canManageUsers, upload.fields([{ name: 'photo', maxCount: 1 }]), CreateNewUser);
router.put('/:id', canManageUsers, upload.fields([{ name: 'photo', maxCount: 1 }]), UpdateUserById);
router.delete('/:id', canManageUsers, DeleteUserById);

module.exports = router;
