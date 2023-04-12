const express=require('express');
const router = express.Router();

const passwordController=require('../controllers/forgot_password');

router.post('/password/forgotpassword', passwordController.forgotpassword)
router.get('/password/resetpassword/:id', passwordController.resetpassword)
router.get('/password/updatepassword/:id', passwordController.updatepassword)

module.exports = router;