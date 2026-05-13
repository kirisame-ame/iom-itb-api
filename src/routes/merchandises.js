const { Router } = require('express');
const {
  GetMerchandiseById,
  GetAllMerchandise,
  GetMerchandiseCategories,
  CreateMerchandiseCategory,
  UpdateMerchandiseCategory,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
  DeleteMerchandiseCategory,
} = require('../controllers/merchandises');
const upload  = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('/categories', JWTValidation, GetMerchandiseCategories);
router.post('/categories', JWTValidation, CreateMerchandiseCategory);
router.put('/categories/:category', JWTValidation, UpdateMerchandiseCategory);
router.delete('/categories/:category', JWTValidation, DeleteMerchandiseCategory);

router.get('', [], GetAllMerchandise);
router.get('/:id', [], GetMerchandiseById);
router.post('', JWTValidation, [], CreateNewMerchandise);
router.put('/:id', JWTValidation, [], UpdateMerchandiseById);
router.delete('/:id', JWTValidation, [], DeleteMerchandiseById);

module.exports = router;
