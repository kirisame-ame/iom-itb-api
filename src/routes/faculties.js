const { Router } = require('express');
const { Faculties } = require('../models');

const router = Router();

router.get('', async (req, res) => {
  const faculties = await Faculties.findAll({ order: [['name', 'ASC']] });
  return res.json({ status: 200, data: faculties });
});

module.exports = router;
