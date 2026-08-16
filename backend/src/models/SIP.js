const mongoose = require('mongoose');

const SIPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fundName: {
    type: String,
    required: true,
    trim: true
  },
  amc: {
    type: String,
    required: true,
    trim: true
  },
  fundCode: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Debt', 'Index', 'Flexi Cap', 'Balanced'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 500
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  nextDate: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  totalInvested: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  returns: {
    type: Number,
    default: 0 // Percentage
  },
  xirr: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

SIPSchema.index({ userId: 1, status: 1 });
SIPSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('SIP', SIPSchema);
