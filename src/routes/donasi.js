const { Router } = require('express');
const {
  GetExcelById,
  GetAllExcel,
} = require('../controllers/excel');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { FINANCE_ROLES } = require('../utils/roles');

const router = Router();

const token = "user_content_key=AehSKLjWVMbCVjS7dke2CirWJ-j3SudazARe_eNG8Gvw-wLVv-bjgSzcX4cAEZOivNUM2buCeXtAiV5vK-Dbfqn_VQ6uavejau1aYABYddVedvc9mPiGxcq2Aios1AM10ZA9amI7gTHw67iSCVapN3_Xl8GDqBm-pOhTvxPuVHpUweC9ellaJ378GQvszBAz_elJ0SaD7MfS3Gf5FkhW_qCbrRTSlkvI72QMuC4pn7ccoO6WtPavcP8Zy5XoZ7U6QBWUmDDS46Aq2rhEee0JzME310OV8m2Dx3Y4q8IuYUb8&lib=MaNYI2ARQJf8bkBmcrj3NBOPvG3BvuGoP"

router.get('', JWTValidation, requireRoles(FINANCE_ROLES), (req, res, next) => {
  GetAllExcel(req, res, next, token);
});
router.get('/:id', JWTValidation, requireRoles(FINANCE_ROLES), (req, res, next) => {
  GetExcelById(req, res, next, token);
});

module.exports = router;
