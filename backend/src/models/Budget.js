const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  needsBudget: {
    type: Number,
    required: true // 50% of salary
  },
  wantsBudget: {
    type: Number,
    required: true // 30% of salary
  },
  savingsBudget: {
    type: Number,
    required: true // 20% of salary
  },
  categoryBudgets: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    categoryName: String,
    allocated: Number,
    spent: {
      type: Number,
      default: 0
    }
  }],
  totalSpent: {
    type: Number,
    default: 0
  },
  savingsAchieved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
