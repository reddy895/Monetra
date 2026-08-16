const { Budget, User } = require('../models');
const { getCurrentMonthYear } = require('../utils/dates');
const { RULE_50_30_20, CATEGORY_LIMITS } = require('../config/constants');
const { getExpenseSummary } = require('./expenseService');

const getSalaryRecommendations = (salary) => {
  const needs = (salary * RULE_50_30_20.NEEDS_PERCENTAGE) / 100;
  const wants = (salary * RULE_50_30_20.WANTS_PERCENTAGE) / 100;
  const savings = (salary * RULE_50_30_20.SAVINGS_PERCENTAGE) / 100;

  const categoryLimits = Object.entries(CATEGORY_LIMITS).map(([name, pct]) => ({
    name,
    percentage: pct,
    amount: Math.round((salary * pct) / 100)
  }));

  return {
    salary,
    needs: { percentage: 50, amount: needs, label: 'Needs (Rent, Groceries, Bills, Transport, Health)' },
    wants: { percentage: 30, amount: wants, label: 'Wants (Dining, Entertainment, Shopping)' },
    savings: { percentage: 20, amount: savings, label: 'Savings & Investments (Emergency Fund, SIP)' },
    categoryLimits
  };
};

const getCurrentBudget = async (userId, month, year) => {
  const { month: curMonth, year: curYear } = getCurrentMonthYear();
  const targetMonth = month ? Number(month) : curMonth;
  const targetYear = year ? Number(year) : curYear;

  const user = await User.findById(userId);
  const salary = user ? user.monthlySalary : 30000;

  let budget = await Budget.findOne({ userId, month: targetMonth, year: targetYear });
  const summary = await getExpenseSummary(userId, targetMonth, targetYear);

  if (!budget) {
    const rec = getSalaryRecommendations(salary);
    budget = await Budget.create({
      userId,
      month: targetMonth,
      year: targetYear,
      salary,
      needsBudget: rec.needs.amount,
      wantsBudget: rec.wants.amount,
      savingsBudget: rec.savings.amount,
      totalSpent: summary.totalSpent,
      savingsAchieved: Math.max(0, salary - summary.totalSpent)
    });
  } else {
    budget.totalSpent = summary.totalSpent;
    budget.savingsAchieved = Math.max(0, budget.salary - summary.totalSpent);
    await budget.save();
  }

  return {
    budget,
    summary,
    recommendations: getSalaryRecommendations(budget.salary)
  };
};

const saveBudget = async (userId, data) => {
  const { month, year, salary, categoryBudgets } = data;
  const targetSalary = salary || 30000;
  const needsBudget = (targetSalary * RULE_50_30_20.NEEDS_PERCENTAGE) / 100;
  const wantsBudget = (targetSalary * RULE_50_30_20.WANTS_PERCENTAGE) / 100;
  const savingsBudget = (targetSalary * RULE_50_30_20.SAVINGS_PERCENTAGE) / 100;

  const budget = await Budget.findOneAndUpdate(
    { userId, month, year },
    {
      userId,
      month,
      year,
      salary: targetSalary,
      needsBudget,
      wantsBudget,
      savingsBudget,
      categoryBudgets: categoryBudgets || []
    },
    { upsert: true, new: true }
  );

  return budget;
};

const getBudgetComparison = async (userId, customSalary = null, month = null, year = null) => {
  const user = await User.findById(userId);
  const salary = customSalary ? Number(customSalary) : (user ? user.monthlySalary : 30000);
  const summary = await getExpenseSummary(userId, month, year);
  const recommendations = getSalaryRecommendations(salary);

  // Health Score Calculation out of 100
  let score = 100;

  // Penalty if Needs > 50%
  const needsPct = (summary.needsSpent / salary) * 100;
  if (needsPct > 50) {
    score -= Math.min(30, Math.round((needsPct - 50) * 2));
  }

  // Penalty if Wants > 30%
  const wantsPct = (summary.wantsSpent / salary) * 100;
  if (wantsPct > 30) {
    score -= Math.min(35, Math.round((wantsPct - 30) * 2.5));
  }

  // Bonus/penalty for savings
  const savingsPct = (summary.savingsSpent / salary) * 100;
  if (savingsPct < 20) {
    score -= Math.min(35, Math.round((20 - savingsPct) * 1.75));
  }

  score = Math.max(10, Math.min(100, score));

  return {
    salary,
    month: summary.month,
    year: summary.year,
    healthScore: score,
    actual: {
      needs: summary.needsSpent,
      needsPercentage: Math.round((summary.needsSpent / salary) * 100),
      wants: summary.wantsSpent,
      wantsPercentage: Math.round((summary.wantsSpent / salary) * 100),
      savings: summary.savingsSpent,
      savingsPercentage: Math.round((summary.savingsSpent / salary) * 100),
      totalSpent: summary.totalSpent
    },
    ideal: {
      needs: recommendations.needs.amount,
      needsPercentage: 50,
      wants: recommendations.wants.amount,
      wantsPercentage: 30,
      savings: recommendations.savings.amount,
      savingsPercentage: 20
    },
    categories: summary.categories
  };
};

module.exports = {
  getSalaryRecommendations,
  getCurrentBudget,
  saveBudget,
  getBudgetComparison
};
