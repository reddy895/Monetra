const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
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
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['dining', 'shopping', 'transport', 'entertainment', 'subscription', 'other'],
    default: 'other'
  },
  monthlySaving: {
    type: Number,
    required: true
  },
  yearlySaving: {
    type: Number,
    required: true
  },
  impact: {
    type: String // e.g., "You could save ₹12,000/year by reducing dining out"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

ScenarioSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Scenario', ScenarioSchema);
