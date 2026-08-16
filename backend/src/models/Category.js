const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  color: {
    type: String,
    default: '#5B7F7A'
  },
  isDefault: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null means system default category
  },
  maxBudgetPercentage: {
    type: Number, // e.g., Rent: 30% of salary
    min: 0,
    max: 100,
    default: 10
  }
}, {
  timestamps: true
});

CategorySchema.index({ userId: 1, isDefault: 1 });

module.exports = mongoose.model('Category', CategorySchema);
