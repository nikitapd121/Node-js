// models/fav.js
const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// A user can favorite the same home only once
favSchema.index({ houseId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Fav', favSchema);
