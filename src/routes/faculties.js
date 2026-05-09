const { Router } = require('express');
const { Faculties } = require('../models');

const router = Router();

const pick = (body = {}) => {
  const out = {};
  if (body.name !== undefined) out.name = body.name;
  if (body.kodeUnik !== undefined) out.kodeUnik = body.kodeUnik;
  if (body.isActive !== undefined) out.isActive = !!body.isActive;
  return out;
};

router.get('', async (req, res) => {
  try {
    const faculties = await Faculties.findAll({ order: [['name', 'ASC']] });
    return res.json({ status: 200, data: faculties });
  } catch (error) {
    console.error('[faculties:get]', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

router.post('', async (req, res) => {
  try {
    const payload = pick(req.body);
    if (!payload.name) {
      return res.status(400).json({ status: 400, message: 'Nama fakultas wajib diisi' });
    }
    const faculty = await Faculties.create(payload);
    return res.status(201).json({ status: 201, data: faculty });
  } catch (error) {
    console.error('[faculties:post]', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const faculty = await Faculties.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).json({ status: 404, message: 'Fakultas tidak ditemukan' });
    }
    await faculty.update(pick(req.body));
    return res.json({ status: 200, data: faculty });
  } catch (error) {
    console.error('[faculties:put]', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const faculty = await Faculties.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).json({ status: 404, message: 'Fakultas tidak ditemukan' });
    }
    await faculty.destroy();
    return res.json({ status: 200, message: 'Fakultas dihapus' });
  } catch (error) {
    console.error('[faculties:delete]', error);
    return res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
