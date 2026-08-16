const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  salaryRangeMin: {
    type: Number,
    required: true
  },
  salaryRangeMax: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['emergency', 'sip', 'budget', 'saving', 'food', 'transport', 'insurance', 'tax'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: Number,
    default: 1 // 1 = high priority
  },
  actionItem: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '💡'
  }
}, {
  timestamps: true
});

TipSchema.index({ salaryRangeMin: 1, salaryRangeMax: 1 });

module.exports = mongoose.model('Tip', TipSchema);
