const { Router } = require('express');
const {
  handlePendaftaranAnggotaWebhook,
  handlePengajuanBantuanWebhook,
  handleOrangTuaAsuhWebhook,
} = require('../controllers/tallyWebhooks');

const router = Router();

router.post('/pendaftaran-anggota', handlePendaftaranAnggotaWebhook);
router.post('/pengajuan-bantuan', handlePengajuanBantuanWebhook);
router.post('/orangtua-asuh', handleOrangTuaAsuhWebhook);

module.exports = router;
