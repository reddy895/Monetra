const SALARY_LIMITS = {
  MIN: 20000,
  MAX: 50000
};

const RULE_50_30_20 = {
  NEEDS_PERCENTAGE: 50,
  WANTS_PERCENTAGE: 30,
  SAVINGS_PERCENTAGE: 20
};

const CATEGORY_LIMITS = {
  'Rent': 30,
  'Groceries': 10,
  'Food': 10,
  'Bills': 10,
  'Shopping': 10,
  'Entertainment': 8,
  'Transport': 5,
  'Healthcare': 5,
  'Education': 5,
  'Other': 7
};

const CATEGORY_TYPES = {
  'Rent': 'needs',
  'Groceries': 'needs',
  'Bills': 'needs',
  'Healthcare': 'needs',
  'Transport': 'needs',
  'Education': 'needs',
  'Food': 'wants',
  'Shopping': 'wants',
  'Entertainment': 'wants',
  'Other': 'wants'
};

const DEFAULT_CATEGORIES = [
  { name: 'Rent', icon: 'Home', color: '#5B7F7A', maxBudgetPercentage: 30, isDefault: true },
  { name: 'Groceries', icon: 'ShoppingCart', color: '#7D9B7A', maxBudgetPercentage: 10, isDefault: true },
  { name: 'Transport', icon: 'Car', color: '#D4A373', maxBudgetPercentage: 5, isDefault: true },
  { name: 'Food', icon: 'Utensils', color: '#C47A7A', maxBudgetPercentage: 10, isDefault: true },
  { name: 'Bills', icon: 'Zap', color: '#A8A8A8', maxBudgetPercentage: 10, isDefault: true },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#B8A9C9', maxBudgetPercentage: 10, isDefault: true },
  { name: 'Entertainment', icon: 'Film', color: '#F5A623', maxBudgetPercentage: 8, isDefault: true },
  { name: 'Healthcare', icon: 'HeartPulse', color: '#E74C3C', maxBudgetPercentage: 5, isDefault: true },
  { name: 'Education', icon: 'GraduationCap', color: '#3498DB', maxBudgetPercentage: 5, isDefault: true },
  { name: 'Other', icon: 'Layers', color: '#95A5A6', maxBudgetPercentage: 7, isDefault: true }
];

module.exports = {
  SALARY_LIMITS,
  RULE_50_30_20,
  CATEGORY_LIMITS,
  CATEGORY_TYPES,
  DEFAULT_CATEGORIES
};
