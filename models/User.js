const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
