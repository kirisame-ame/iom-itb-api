const { Router } = require('express');
const {
  GetExcelById,
  GetAllExcel,
} = require('../controllers/excel');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { BANTUAN_ROLES } = require('../utils/roles');

const router = Router();

const token = "user_content_key=AehSKLj0GIrn7P_ALY_cYog7jvWs_ht3nuYyWmnR40CyWcO-_GOzjd3JFd6OvFH-m60IYtsTojDVChrMPG8WNAZmYC-UewiS4_xSEdm7Ri_tYdQekLOQYqgz85o4IPxG_kDOrQhqewXH72nRkMm5clpz6rq7GLsph6uOfsdBj9Mk0EGVxroPJqP2Y3ytYhOA3TOc5cNCUKAQsya-Cxh2HKwrd_QSwvnj4mWOo29i8L2XMNGqJe8Pyybz9brXVmz1CdZdVQoPmBLGLO92flVtqXYM6G3BnIPgIBo00gAIY8F4&lib=MHbVxRf8x76npGcRu7Ntqv-PvG3BvuGoP"

router.get('', JWTValidation, requireRoles(BANTUAN_ROLES), (req, res, next) => {
  GetAllExcel(req, res, next, token);
});
router.get('/:id', JWTValidation, requireRoles(BANTUAN_ROLES), (req, res, next) => {
  GetExcelById(req, res, next, token);
});

module.exports = router;
