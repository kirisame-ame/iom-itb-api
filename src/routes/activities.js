const { Router } = require('express');
const {
  GetActivityBySlug,
  GetAllActivities,
  GetAllActivitiesAdmin,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
  GetActivityById,
  GetActivityCounts,
  GetAllTags
} = require('../controllers/activities');
 const JWTValidation = require('../middlewares/auth');
const { Activities } = require('../models');

const router = Router();

// Public
router.get('/', [], GetAllActivities);
router.get('/tags', [], GetAllTags);
router.get('/:slug', [], GetActivityBySlug);

// Admin
router.get('/admin/all', JWTValidation, GetAllActivitiesAdmin);   
router.get('/admin/id/:id', JWTValidation, GetActivityById);      
router.get('/admin/counts', JWTValidation, GetActivityCounts); 
router.post('/', JWTValidation, CreateNewActivity);               
router.put('/:id', JWTValidation, UpdateActivityById);            
router.delete('/:id', JWTValidation, DeleteActivityById);         

module.exports = router;
