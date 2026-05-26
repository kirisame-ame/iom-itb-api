const { Router } = require('express');
const {
  GetDanaBantuanById,
  GetAllDanaBantuan,
  CreateNewDanaBantuan,
  UpdateDanaBantuanById,
  DeleteDanaBantuanById,
} = require('../controllers/danaBantuan');
const JWTValidation = require('../middlewares/auth')
const requireRoles = require('../middlewares/requireRoles');
const { DANA_BANTUAN_ROLES } = require('../utils/roles');

const router = Router();

const canManageDanaBantuan = [JWTValidation, requireRoles(DANA_BANTUAN_ROLES)];

router.get('', canManageDanaBantuan, GetAllDanaBantuan);
router.get('/:id', canManageDanaBantuan, GetDanaBantuanById);
router.post('', canManageDanaBantuan, CreateNewDanaBantuan);
router.put('/:id', canManageDanaBantuan, UpdateDanaBantuanById);
router.delete('/:id', canManageDanaBantuan, DeleteDanaBantuanById);

module.exports = router;
