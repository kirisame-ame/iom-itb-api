const { Router } = require('express');
const {
  GetMerchandiseById,
  GetAllMerchandise,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
  DeleteMerchandiseCategory,
} = require('../controllers/merchandises');
const upload  = require('../middlewares/multer');

const { Merchandises } = require('../models');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('/categories', async (req, res) => {
  try {
    const rows = await Merchandises.findAll({
      attributes: ['kategori'],
      where: { kategori: { [require('sequelize').Op.ne]: null } },
      group: ['kategori'],
      order: [['kategori', 'ASC']],
    });
    const categories = [...new Set(rows.map(r => r.kategori).filter(Boolean))].sort();
    res.json({ data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('', [], GetAllMerchandise);
router.get('/:id', [], GetMerchandiseById);
router.post('', JWTValidation, [], CreateNewMerchandise);
router.put('/:id', JWTValidation, [], UpdateMerchandiseById);
router.delete('/categories/:category', JWTValidation, [], DeleteMerchandiseCategory);
router.delete('/:id', JWTValidation, [], DeleteMerchandiseById);

module.exports = router;
