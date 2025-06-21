const express = require('express');
const router = express.Router();

const homeController = require('../controllers/host');

router.get('/add-home', homeController.getAddHome);
router.get('/host-home', homeController.getHostHome);
router.post('/submit-details', homeController.homePage);

module.exports = router;
