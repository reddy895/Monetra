const { Expense, Budget, User, SIP, Goal } = require('../models');
const { getMonthDateRange, getCurrentMonthYear } = require('../utils/dates');
const { getExpenseSummary } = require('./expenseService');
const { getBudgetComparison } = require('./budgetService');

const getMonthlyReport = async (userId, month, year) => {
  const { month: curMonth, year: curYear } = getCurrentMonthYear();
  const targetMonth = month ? Number(month) : curMonth;
  const targetYear = year ? Number(year) : curYear;

  const [user, summary, comparison, sips, goals] = await Promise.all([
    User.findById(userId),
    getExpenseSummary(userId, targetMonth, targetYear),
    getBudgetComparison(userId, targetMonth, targetYear),
    SIP.find({ userId, status: 'active' }),
    Goal.find({ userId })
  ]);

  const totalSIPInvestedMonthly = sips.reduce((acc, s) => acc + s.amount, 0);

  // Generate tailored insights
  const insights = [];
  if (summary.savingsRate >= 20) {
    insights.push(`Superb! You achieved a ${summary.savingsRate}% savings rate this month, beating the 20% benchmark.`);
  } else {
    insights.push(`Your savings rate is ${summary.savingsRate}%. Target at least 20% (₹${Math.round(user.monthlySalary * 0.2).toLocaleString('en-IN')}) next month.`);
  }

  const topCategory = summary.categories[0];
  if (topCategory) {
    insights.push(`Your largest expense was ${topCategory.categoryName} at ₹${topCategory.totalSpent.toLocaleString('en-IN')} (${topCategory.percentageOfSalary}% of monthly salary).`);
  }

  if (totalSIPInvestedMonthly > 0) {
    insights.push(`You invested ₹${totalSIPInvestedMonthly.toLocaleString('en-IN')} across ${sips.length} active SIPs this month.`);
  }

  return {
    user: {
      fullName: user.fullName,
      email: user.email,
      monthlySalary: user.monthlySalary
    },
    month: targetMonth,
    year: targetYear,
    summary,
    comparison,
    totalSIPInvestedMonthly,
    activeSIPCount: sips.length,
    activeGoalsCount: goals.filter(g => g.status === 'active').length,
    insights
  };
};

const getYearlyReport = async (userId, year) => {
  const curYear = year ? Number(year) : new Date().getFullYear();
  const user = await User.findById(userId);

  const monthlyReports = [];
  let yearlyTotalExpense = 0;

  for (let m = 1; m <= 12; m++) {
    const summary = await getExpenseSummary(userId, m, curYear);
    yearlyTotalExpense += summary.totalSpent;
    monthlyReports.push({
      month: m,
      totalSpent: summary.totalSpent,
      savings: summary.savingsSpent,
      savingsRate: summary.savingsRate
    });
  }

  const annualIncome = user.monthlySalary * 12;
  const annualSavings = Math.max(0, annualIncome - yearlyTotalExpense);
  const annualSavingsRate = Math.round((annualSavings / annualIncome) * 100);

  return {
    year: curYear,
    annualIncome,
    yearlyTotalExpense,
    annualSavings,
    annualSavingsRate,
    monthlyReports
  };
};

module.exports = {
  getMonthlyReport,
  getYearlyReport
};
