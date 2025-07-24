const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  accountType: {
    type: String,
    enum: ['user', 'host'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
