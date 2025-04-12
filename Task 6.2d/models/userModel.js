const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String },  // may be empty if using Google OAuth
  role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
  googleId: { type: String }
});

// Hash password if provided and modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema; // Export the schema for use in other files
module.exports.userModel = mongoose.model('User', userSchema); // Export the model for use in other files