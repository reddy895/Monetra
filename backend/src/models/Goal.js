const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['emergency_fund', 'vacation', 'gadget', 'education', 'wedding', 'home', 'vehicle', 'other'],
    required: true,
    default: 'other'
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  monthlyContribution: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  }
}, {
  timestamps: true
});

GoalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
