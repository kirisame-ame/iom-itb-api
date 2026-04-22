const express = require('express');

const router = express.Router();
const AuthRouter = require('./auth');
const UserRouter = require('./users');
const MemberRouter = require('./members');
const AdminRouter = require('./admins');
const MerchandiseRouter = require('./merchandises');
const ActivityRouter = require('./activities');
const DonationsRouter = require('./donations');
const PendataanAnggotaRouter = require('./pendataanAnggota');
const PengajuanBantuanRouter = require('./pengajuanBantuan');
const OrangtuaAsuhRouter = require('./orangtuaAsuh');
const DonasiRouter = require('./donasi');
const HelpSubmissiosRouter = require('./helpSubmissions');
const TransactionRouter = require('./transactions');
const fileRouter = require('./file');
const CompetitionRouter = require('./competition');
const DanaBantuan = require('./danaBantuan');
const KemitraanRouter = require('./kemitraan');
const FacultyRouter = require('./faculties');
const PaymentRouter = require('./payments');
const TallyWebhookRouter = require('./tallyWebhooks');
const TallySubmissionsRouter = require('./tallySubmissions');

router.get('/', (req, res) => {
  res.json({
    version: '3.9.0',
  });
});

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/members', MemberRouter);
router.use('/pendataan-anggota', PendataanAnggotaRouter);
router.use('/pengajuan-bantuan', PengajuanBantuanRouter);
router.use('/orangtua-asuh', OrangtuaAsuhRouter);
router.use('/donasi', DonasiRouter);
router.use('/admins', AdminRouter);
router.use('/merchandises', MerchandiseRouter);
router.use('/activities', ActivityRouter);
router.use('/donations', DonationsRouter);
router.use('/help-submissions', HelpSubmissiosRouter);
router.use('/transactions', TransactionRouter);
router.use('/file', fileRouter);
router.use('/competition', CompetitionRouter);
router.use('/dana-bantuan', DanaBantuan);
router.use('/kemitraan', KemitraanRouter);
router.use('/faculties', FacultyRouter);
router.use('/payments', PaymentRouter);
router.use('/webhooks/tally', TallyWebhookRouter);
router.use('/tally-submissions', TallySubmissionsRouter);

module.exports = router;
