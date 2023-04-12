const express=require('express');
const router = express.Router();

const loginController=require('../controllers/signUp');

router.post('/user/signup',loginController.register);
router.post('/user/login',loginController.login);
router.get('/premium',loginController.premiumLeaderboard);

module.exports = router;