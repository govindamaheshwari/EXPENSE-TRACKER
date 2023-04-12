const express=require('express');
const router = express.Router();

const epenseController=require('../controllers/expense');
const userauthentication=require('../middleware/auth');

router.get('/expense/getExpenses',userauthentication.authenticate,epenseController.getExpenses);
router.post('/expense/addExpenses',userauthentication.authenticate,epenseController.addExpense);
router.get('/expense/getExpense',userauthentication.authenticate,epenseController.getExpense);
router.put('/expense/updateExpense/:expanseId',epenseController.updateExpense);
router.delete('/expense/deleteExpenses/:expanseId',userauthentication.authenticate, epenseController.deleteExpense);
router.get('/expense/downloadExpenses',userauthentication.authenticate, epenseController.downloadExpense);




module.exports = router;