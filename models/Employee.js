const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema for employee
const employeeSchema = new mongoose.Schema({
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

// Hash password before saving employee
employeeSchema.pre('save', async function(next) {
  const employee = this;
  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 10);
  }
  next();
});

// Method to compare password
employeeSchema.methods.comparePassword = async function(candidatePassword) {
  const employee = this;
  return await bcrypt.compare(candidatePassword, employee.password);
};

// Create Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
