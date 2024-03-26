const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema for employee
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});


// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};

// Create Employee model
const User = mongoose.model('users', userSchema);

module.exports = User;
