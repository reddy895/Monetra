const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  hashedPassword: {
    type: String,
    required: [true, 'Password is required']
  },
  monthlySalary: {
    type: Number,
    required: [true, 'Monthly salary is required'],
    min: [20000, 'Minimum monthly salary supported is ₹20,000'],
    max: [50000, 'Maximum monthly salary supported is ₹50,000']
  },
  currencyPreference: {
    type: String,
    default: 'INR'
  },
  riskProfile: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

UserSchema.index({ monthlySalary: 1 });

module.exports = mongoose.model('User', UserSchema);
