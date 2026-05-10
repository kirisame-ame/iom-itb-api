const { Router } = require('express');
const {
  GetMerchandiseById,
  GetAllMerchandise,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
} = require('../controllers/merchandises');
const upload  = require('../middlewares/multer');

const { Merchandises } = require('../models');

const router = Router();

router.get('/categories', async (req, res) => {
  try {
    const rows = await Merchandises.findAll({
      attributes: ['kategori'],
      where: { kategori: { [require('sequelize').Op.ne]: null } },
      group: ['kategori'],
      order: [['kategori', 'ASC']],
    });
    const defaults = ['Stiker', 'Busana', 'ATK'];
    const fromDb = rows.map(r => r.kategori).filter(Boolean);
    const merged = [...new Set([...defaults, ...fromDb])].sort();
    res.json({ data: merged });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('', [], GetAllMerchandise);
router.get('/:id', [], GetMerchandiseById);
router.post('', [], CreateNewMerchandise);
router.put('/:id', [], UpdateMerchandiseById);
router.delete('/:id', [], DeleteMerchandiseById);

module.exports = router;
