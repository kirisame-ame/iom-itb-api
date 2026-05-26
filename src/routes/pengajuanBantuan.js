const { Router } = require('express');
const {
  GetExcelById,
  GetAllExcel,
} = require('../controllers/excel');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { BANTUAN_ROLES } = require('../utils/roles');

const router = Router();

const token = "user_content_key=AehSKLisufbc-_dP5DV8im0UknU-jRpc-Gp99xbIgGmRQE4FSk-CdQcZP_rNtyEveRDvp0Zb4rmG5xwI4HUZPNCpj-iCFMIsOtyy8afcuicg69M1ztBE-CfXr9N0wyqgMi0YrCIwae-XZ6Eao0NGbs7HOe5AqJqjtKga5XInI37RNj08h8xPJct6mstdbw0_kRdKoz0XOKhT6zawObsE2OeHVEdMMa5lev-zRkRnPJx_j2VCvCc_uKuceoVrdfgpY-wXOLdyC6KKsV7kjOeXnNI6wMpSdM3IqkiroQhbhqJ7&lib=Mr_Lcr7NfB9C34KNTUZ81zePvG3BvuGoP"

router.get('', JWTValidation, requireRoles(BANTUAN_ROLES), (req, res, next) => {
  GetAllExcel(req, res, next, token);
});
router.get('/:id', JWTValidation, requireRoles(BANTUAN_ROLES), (req, res, next) => {
  GetExcelById(req, res, next, token);
});

module.exports = router;
