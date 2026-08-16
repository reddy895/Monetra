const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  totalIncome: {
    type: Number,
    required: true
  },
  totalExpenses: {
    type: Number,
    required: true
  },
  savings: {
    type: Number,
    required: true
  },
  savingsRate: {
    type: Number, // percentage
    required: true
  },
  categoryBreakdown: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    categoryName: String,
    amount: Number,
    percentage: Number
  }],
  needsSpent: Number,
  wantsSpent: Number,
  savingsSpent: Number,
  insights: [{
    type: String
  }],
  recommendations: [{
    type: String
  }]
}, {
  timestamps: true
});

MonthlySummarySchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);
