const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

//this will run before save
//this is middleware for mongoose
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hashSync(this.password, salt);
    this.password = hashedpass;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.method.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
};

module.exports = mongoose.model('User', UserSchema);
