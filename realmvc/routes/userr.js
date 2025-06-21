const express = require('express');
const router = express.Router();
const homeController = require('../controllers/store');

router.get('/', homeController.getHomes);
router.get('/booking',homeController.getBookings);
router.get('/fav',homeController.favlist)
router.get('/index',homeController.index)
module.exports = router;
