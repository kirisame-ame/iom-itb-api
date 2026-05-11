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

const router = Router();

router.get('', [], GetAllUser);
router.get('/:id', [], GetUserById);
router.get('', [], GetAllUser);
router.post('', upload.fields([{ name: 'photo', maxCount: 1 }]), CreateNewUser);
router.put('/:id', JWTValidation, upload.fields([{ name: 'photo', maxCount: 1 }]), UpdateUserById);
router.delete('/:id', JWTValidation, DeleteUserById);

module.exports = router;
