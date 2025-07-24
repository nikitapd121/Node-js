const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getlogin);
router.post('/login', authController.postlogin);
router.get('/signup', authController.getsignup);
router.post('/signup', authController.postsignup);
router.get('/logout', authController.getlogout);

module.exports = router;
