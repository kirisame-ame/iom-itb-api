const { Router } = require('express');
const {
  GetActivityBySlug,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
  GetActivityById,
} = require('../controllers/activities');
 const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', [], GetAllActivities);
router.get('/:slug', [], GetActivityBySlug);
router.post('',/* JWTValidation, */CreateNewActivity);
router.put('/:id',/* JWTValidation, */UpdateActivityById);
router.delete('/:id',/* JWTValidation, */DeleteActivityById);
router.get('/id/:id', [], GetActivityById);

module.exports = router;
