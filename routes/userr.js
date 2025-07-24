// userr.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');

// Home page
router.get('/', storeController.index);

// Booking page
router.get('/booking', storeController.getBookings);

// Favorites page
router.get('/fav', storeController.favlist);

// Add to favorites
router.post('/fav', storeController.postfav);

// Home details page
router.get('/homes/:homeId', storeController.homeID);

// Delete from favorites
router.post('/delete-favhome/:homeId', storeController.favdeletekaro);

module.exports = router;
