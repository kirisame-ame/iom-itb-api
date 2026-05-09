const { Router } = require('express');
const {
  GetTransactionById,
  GetTransactionByPublicToken,
  GetAllTransaction,
  CreateNewTransaction,
  UpdateTransactionById,
  DeleteTransactionById,
} = require('../controllers/transactions'); // Updated to 'transaction'
const upload = require('../middlewares/multer');
const JWTValidation = require('../middlewares/auth');

const router = Router();

router.get('', JWTValidation, GetAllTransaction); // Updated to 'GetAllTransaction'
router.get('/public/:token', [], GetTransactionByPublicToken);
router.get('/:id', JWTValidation, GetTransactionById); // Updated to 'GetTransactionById'
router.post('', upload.fields([{ name: 'payment', maxCount: 1 }]), CreateNewTransaction); // Updated to 'CreateNewTransaction'
router.put('/:id', JWTValidation, upload.fields([{ name: 'payment', maxCount: 1 }]), UpdateTransactionById); // Updated to 'UpdateTransactionById'
router.delete('/:id', JWTValidation, DeleteTransactionById); // Updated to 'DeleteTransactionById'

module.exports = router;
