const mongoose = require('mongoose');
const { Expense, Category, Budget, User } = require('../models');
const { getMonthDateRange, getCurrentMonthYear } = require('../utils/dates');
const { CATEGORY_TYPES, RULE_50_30_20 } = require('../config/constants');

const updateBudgetAggregates = async (userId, date) => {
  const expenseDate = new Date(date);
  const month = expenseDate.getMonth() + 1;
  const year = expenseDate.getFullYear();
  const { startDate, endDate } = getMonthDateRange(month, year);

  const total = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const totalSpent = total.length > 0 ? total[0].total : 0;
  const user = await User.findById(userId);
  const salary = user ? user.monthlySalary : 30000;
  const savingsAchieved = Math.max(0, salary - totalSpent);

  await Budget.findOneAndUpdate(
    { userId, month, year },
    {
      totalSpent,
      savingsAchieved,
      salary,
      needsBudget: (salary * RULE_50_30_20.NEEDS_PERCENTAGE) / 100,
      wantsBudget: (salary * RULE_50_30_20.WANTS_PERCENTAGE) / 100,
      savingsBudget: (salary * RULE_50_30_20.SAVINGS_PERCENTAGE) / 100
    },
    { upsert: true, new: true }
  );
};

const createExpense = async (userId, data) => {
  const expense = await Expense.create({
    userId,
    categoryId: data.categoryId,
    amount: Number(data.amount),
    description: data.description || '',
    date: data.date ? new Date(data.date) : new Date(),
    paymentMethod: data.paymentMethod || 'UPI',
    tags: Array.isArray(data.tags) ? data.tags : [],
    isRecurring: !!data.isRecurring,
    recurringFrequency: data.recurringFrequency || null
  });

  await updateBudgetAggregates(userId, expense.date);
  return await Expense.findById(expense._id).populate('categoryId');
};

const getExpenses = async (userId, query) => {
  const {
    categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    paymentMethod,
    search,
    limit = 50,
    page = 1,
    sortBy = 'date',
    sortOrder = 'desc'
  } = query;

  const filter = { userId: new mongoose.Types.ObjectId(userId) };

  if (categoryId) {
    filter.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};
    if (minAmount !== undefined) filter.amount.$gte = Number(minAmount);
    if (maxAmount !== undefined) filter.amount.$lte = Number(maxAmount);
  }

  if (search) {
    filter.description = { $regex: search, $options: 'i' };
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortDirection };

  const skip = (Number(page) - 1) * Number(limit);

  const [expenses, totalCount] = await Promise.all([
    Expense.find(filter)
      .populate('categoryId')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Expense.countDocuments(filter)
  ]);

  return {
    expenses,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit))
    }
  };
};

const getExpenseById = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, userId }).populate('categoryId');
  if (!expense) {
    const err = new Error('Expense not found.');
    err.statusCode = 404;
    throw err;
  }
  return expense;
};

const updateExpense = async (userId, expenseId, data) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  if (!expense) {
    const err = new Error('Expense not found.');
    err.statusCode = 404;
    throw err;
  }

  const oldDate = expense.date;

  if (data.categoryId) expense.categoryId = data.categoryId;
  if (data.amount !== undefined) expense.amount = Number(data.amount);
  if (data.description !== undefined) expense.description = data.description;
  if (data.date) expense.date = new Date(data.date);
  if (data.paymentMethod) expense.paymentMethod = data.paymentMethod;
  if (data.tags) expense.tags = data.tags;
  if (data.isRecurring !== undefined) expense.isRecurring = data.isRecurring;
  if (data.recurringFrequency !== undefined) expense.recurringFrequency = data.recurringFrequency;

  await expense.save();

  await updateBudgetAggregates(userId, expense.date);
  if (oldDate.getMonth() !== expense.date.getMonth() || oldDate.getFullYear() !== expense.date.getFullYear()) {
    await updateBudgetAggregates(userId, oldDate);
  }

  return await Expense.findById(expense._id).populate('categoryId');
};

const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
  if (!expense) {
    const err = new Error('Expense not found.');
    err.statusCode = 404;
    throw err;
  }

  await updateBudgetAggregates(userId, expense.date);
  return { message: 'Expense deleted successfully.' };
};

const getExpenseSummary = async (userId, month, year) => {
  const { month: curMonth, year: curYear } = getCurrentMonthYear();
  const targetMonth = month ? Number(month) : curMonth;
  const targetYear = year ? Number(year) : curYear;
  const { startDate, endDate } = getMonthDateRange(targetMonth, targetYear);

  const user = await User.findById(userId);
  const salary = user ? user.monthlySalary : 30000;

  // Category aggregation
  const categoryBreakdown = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$categoryId',
        totalSpent: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryName: '$category.name',
        icon: '$category.icon',
        color: '$category.color',
        maxBudgetPercentage: '$category.maxBudgetPercentage',
        totalSpent: 1,
        count: 1
      }
    },
    { $sort: { totalSpent: -1 } }
  ]);

  // Get all default & user categories to ensure complete category list even with 0 expenses
  const allCategories = await Category.find({
    $or: [{ isDefault: true }, { userId: new mongoose.Types.ObjectId(userId) }]
  });

  const categoryMap = new Map();
  allCategories.forEach(cat => {
    categoryMap.set(cat._id.toString(), {
      categoryId: cat._id,
      categoryName: cat.name,
      icon: cat.icon,
      color: cat.color,
      maxBudgetPercentage: cat.maxBudgetPercentage || 10,
      totalSpent: 0,
      count: 0
    });
  });

  // Merge actual spending
  categoryBreakdown.forEach(item => {
    const key = item.categoryId ? item.categoryId.toString() : '';
    if (categoryMap.has(key)) {
      const existing = categoryMap.get(key);
      existing.totalSpent = item.totalSpent;
      existing.count = item.count;
    } else {
      categoryMap.set(key, item);
    }
  });

  const mergedCategories = Array.from(categoryMap.values());

  const totalSpent = categoryBreakdown.reduce((sum, item) => sum + item.totalSpent, 0);

  // Group by Needs vs Wants
  let needsSpent = 0;
  let wantsSpent = 0;

  categoryBreakdown.forEach(cat => {
    const type = CATEGORY_TYPES[cat.categoryName] || 'wants';
    if (type === 'needs') {
      needsSpent += cat.totalSpent;
    } else {
      wantsSpent += cat.totalSpent;
    }
  });

  const savingsSpent = Math.max(0, salary - totalSpent);
  const savingsRate = Math.round((savingsSpent / salary) * 100);

  // Add percentage of salary to categories
  const categoriesWithPercent = mergedCategories.map(cat => ({
    ...cat,
    percentageOfSalary: Math.round((cat.totalSpent / salary) * 100 * 10) / 10,
    percentageOfExpense: totalSpent > 0 ? Math.round((cat.totalSpent / totalSpent) * 100 * 10) / 10 : 0,
    isOverLimit: cat.maxBudgetPercentage ? ((cat.totalSpent / salary) * 100) > cat.maxBudgetPercentage : false
  }));

  return {
    month: targetMonth,
    year: targetYear,
    salary,
    totalSpent,
    savingsSpent,
    savingsRate,
    needsSpent,
    wantsSpent,
    idealNeeds: (salary * RULE_50_30_20.NEEDS_PERCENTAGE) / 100,
    idealWants: (salary * RULE_50_30_20.WANTS_PERCENTAGE) / 100,
    idealSavings: (salary * RULE_50_30_20.SAVINGS_PERCENTAGE) / 100,
    categories: categoriesWithPercent
  };
};

const getExpenseTrend = async (userId, period = 'month') => {
  const { month, year } = getCurrentMonthYear();
  const { startDate, endDate } = getMonthDateRange(month, year);

  // Daily spending in current month
  const dailySpending = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Last 6 months trend
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyTrend = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    dailySpending,
    monthlyTrend
  };
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenseTrend
};
