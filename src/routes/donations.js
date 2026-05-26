const { Router } = require('express');
const {
  GetDonationById,
  GetAllDonations,
  CreateNewDonation,
  UpdateDonationById,
  DeleteDonationById,
} = require('../controllers/donations');
const JWTValidation = require('../middlewares/auth')
const requireRoles = require('../middlewares/requireRoles');
const { FINANCE_ROLES } = require('../utils/roles');

const router = Router();

router.get('', [], GetAllDonations);
router.get('/admin', JWTValidation, requireRoles(FINANCE_ROLES), GetAllDonations);
router.get('/:id', [], GetDonationById);
router.post('', [], CreateNewDonation);
router.put('/:id', JWTValidation, requireRoles(FINANCE_ROLES), UpdateDonationById);
router.delete('/:id', JWTValidation, requireRoles(FINANCE_ROLES), DeleteDonationById);

module.exports = router;
