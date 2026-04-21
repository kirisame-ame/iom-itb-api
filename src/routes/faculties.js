const { Router } = require('express');
const {
  GetAllFaculties,
  GetFacultyById,
  CreateNewFaculty,
  UpdateFacultyById,
  DeleteFacultyById,
} = require('../controllers/faculties');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', [], GetAllFaculties);
router.get('/:id', [], GetFacultyById);
router.post('', JWTValidation, CreateNewFaculty);
router.put('/:id', JWTValidation, UpdateFacultyById);
router.delete('/:id', JWTValidation, DeleteFacultyById);

module.exports = router;
