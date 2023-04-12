const express=require('express');
const router = express.Router();

const purchaseController=require('../controllers/purchase');
const userauthentication=require('../middleware/auth');

router.get('/purchase/purchasepremium',userauthentication.authenticate,purchaseController.purchasePremium);
router.post('/purchase/updateTransactionStatus',userauthentication.authenticate,purchaseController.updateTransaction);

module.exports = router;