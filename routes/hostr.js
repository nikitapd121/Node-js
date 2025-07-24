const express = require('express');
const router = express.Router();
const homeController = require('../controllers/host');
const upload = require('../utils/upload');

router.get('/add-home', homeController.getAddHome);
router.get('/host-home', homeController.getHostHome);
router.post('/submit-details', upload.single('photo'), homeController.postAddHome);

// For editing existing home (if supporting reupload)
router.post('/edit-home', upload.single('photo'), homeController.postEditHome);


router.get('/edit-home/:homeId', homeController.editpage); 

router.post('/delete-home/:homeId', homeController.deletekaro);

module.exports = router;
