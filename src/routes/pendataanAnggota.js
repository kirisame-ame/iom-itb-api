const { Router } = require('express');
const {
  GetExcelById,
  GetAllExcel,
} = require('../controllers/excel');
const JWTValidation = require('../middlewares/auth');
const requireRoles = require('../middlewares/requireRoles');
const { SECRETARIAT_ROLES } = require('../utils/roles');

const router = Router();

const token = "user_content_key=AehSKLhRZSCAvYSBZIQNurlzGFhjZrv9qpOZgXsCFJhNawk1PqaTPVZlIFeYNc1GD_l7PiBp22weM_n5GL9pqiwufHh30VGHHUfA0CBZN1th4kVQlrmf8j_VlzdeQmmIgjfgZzj7T3DeEkttQWZMzpU7PztDlqUlChui2erf3-ITRtCTKXHZ5A1pEnIfY6fvjeN56LBO-koiNwzpxC94Yt2cxe_aVES0rim_yUAqlhLMdyDR9-Bz3lJYEzacz6vG63_m-l_oDn51e5-bGyL3lUD1Yh2rCOmWig&lib=MYF9cBL8jemodFySAFBpJRMZZhN4jZlUL"

router.get('', JWTValidation, requireRoles(SECRETARIAT_ROLES), (req, res, next) => {
  GetAllExcel(req, res, next, token);
});
router.get('/:id', JWTValidation, requireRoles(SECRETARIAT_ROLES), (req, res, next) => {
  GetExcelById(req, res, next, token);
});

module.exports = router;
