const mongoose = require('mongoose');

const InvestmentRecommendationSchema = new mongoose.Schema({
  salaryRangeMin: {
    type: Number,
    required: true
  },
  salaryRangeMax: {
    type: Number,
    required: true
  },
  fundName: {
    type: String,
    required: true
  },
  fundCategory: {
    type: String,
    enum: ['Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Debt', 'Index', 'Flexi Cap', 'Balanced'],
    required: true
  },
  amc: {
    type: String,
    required: true
  },
  fundCode: {
    type: String,
    required: true
  },
  minInvestment: {
    type: Number,
    default: 500
  },
  recommendedAmount: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  expectedReturns: {
    type: String,
    required: true
  },
  cagr3Y: {
    type: Number,
    default: 13.5
  },
  cagr5Y: {
    type: Number,
    default: 14.8
  },
  currentNav: {
    type: Number,
    default: 100
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

InvestmentRecommendationSchema.index({ salaryRangeMin: 1, salaryRangeMax: 1, riskLevel: 1 });

module.exports = mongoose.model('InvestmentRecommendation', InvestmentRecommendationSchema);
