const mongoose = require('mongoose');

const SIPPerformanceSchema = new mongoose.Schema({
  sipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SIP',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  nav: {
    type: Number,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  totalInvested: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

SIPPerformanceSchema.index({ sipId: 1, date: -1 });

module.exports = mongoose.model('SIPPerformance', SIPPerformanceSchema);
