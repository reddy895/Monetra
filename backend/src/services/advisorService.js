const { Tip, Goal, Scenario, User, Expense } = require('../models');
const { getBudgetComparison, getSalaryRecommendations } = require('./budgetService');
const { getExpenseSummary } = require('./expenseService');
const { calculateSIPFutureValue } = require('../utils/xirr');

const getAdvisorDashboard = async (userId, customSalary = null) => {
  const user = await User.findById(userId);
  const salary = customSalary ? Number(customSalary) : (user ? user.monthlySalary : 30000);

  const [comparison, tips, goals, scenarios] = await Promise.all([
    getBudgetComparison(userId, salary),
    getPersonalizedTips(salary, userId),
    Goal.find({ userId }).sort({ priority: -1, targetDate: 1 }),
    Scenario.find({ userId, isActive: true })
  ]);

  const emergencyFund = await getEmergencyFundStatus(userId, salary);
  const taxAdvice = getTaxSavingGuidance(salary);

  return {
    salary,
    blueprint: getSalaryRecommendations(salary),
    comparison,
    emergencyFund,
    tips,
    goals,
    scenarios,
    taxAdvice
  };
};

const getPersonalizedTips = async (salary, userId) => {
  // Query static tips based on salary bracket
  const staticTips = await Tip.find({
    salaryRangeMin: { $lte: salary },
    salaryRangeMax: { $gte: salary }
  }).sort({ priority: 1 }).limit(6);

  // Generate dynamic spending-based tips
  const summary = await getExpenseSummary(userId);
  const dynamicTips = [];

  // Check food/dining out
  const foodCat = summary.categories.find(c => c.categoryName === 'Food');
  if (foodCat && foodCat.percentageOfSalary > 10) {
    const excess = Math.round(foodCat.totalSpent - (salary * 0.1));
    const yearlySavings = excess * 12;
    const compounded = calculateSIPFutureValue(excess, 12, 5).futureValue;
    dynamicTips.push({
      category: 'food',
      title: 'Food & Dining Out is High',
      description: `You're spending ₹${foodCat.totalSpent.toLocaleString('en-IN')} (${foodCat.percentageOfSalary}% of salary). Reducing this by ₹${excess.toLocaleString('en-IN')}/month saves ₹${yearlySavings.toLocaleString('en-IN')}/year.`,
      actionItem: `Cook at home 2 more days per week to save ₹${excess.toLocaleString('en-IN')}/mo. In 5 years at 12% in an Index SIP, this could grow to ₹${compounded.toLocaleString('en-IN')}.`,
      priority: 1,
      icon: '🍽️'
    });
  }

  // Check shopping / entertainment
  const shoppingCat = summary.categories.find(c => c.categoryName === 'Shopping' || c.categoryName === 'Entertainment');
  if (shoppingCat && shoppingCat.percentageOfSalary > 8) {
    const excess = Math.round(shoppingCat.totalSpent - (salary * 0.08));
    dynamicTips.push({
      category: 'saving',
      title: 'Discretionary Shopping Alert',
      description: `Discretionary spend is at ${shoppingCat.percentageOfSalary}% of your monthly income.`,
      actionItem: `Apply the 24-Hour Rule: Wait 24 hours before non-essential purchases above ₹1,000.`,
      priority: 2,
      icon: '🛍️'
    });
  }

  // Combine dynamic and static tips, deduplicate
  const allTips = [...dynamicTips, ...staticTips];
  return allTips;
};

const getEmergencyFundStatus = async (userId, salary) => {
  const summary = await getExpenseSummary(userId);
  const monthlyExpenses = summary.totalSpent > 0 ? summary.totalSpent : Math.round(salary * 0.8);

  const targetMonths = 3;
  const targetAmount = monthlyExpenses * targetMonths;

  // Find if user has an emergency fund goal
  const emergencyGoal = await Goal.findOne({ userId, category: 'emergency_fund' });
  const currentAmount = emergencyGoal ? emergencyGoal.currentAmount : 0;
  const progressPercentage = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;

  const monthlySuggestedSave = Math.round(targetAmount / 12); // save over 12 months

  return {
    targetMonths,
    monthlyExpenses,
    targetAmount,
    currentAmount,
    progressPercentage,
    monthlySuggestedSave,
    goalId: emergencyGoal ? emergencyGoal._id : null,
    isComplete: currentAmount >= targetAmount
  };
};

const getTaxSavingGuidance = (salary) => {
  const annualSalary = salary * 12;
  const isTaxableUnderOldRegime = annualSalary > 500000;

  return {
    annualSalary,
    isTaxableUnderOldRegime,
    recommendations: [
      {
        section: 'Section 80C',
        limit: '₹1,50,000',
        instruments: ['ELSS Mutual Funds (3 yr lock-in, high growth)', 'PPF (15 yr safe compounding)', 'EPF (Provident Fund)'],
        advice: 'For salaried earners in ₹20k-₹50k bracket, ELSS offers the lowest lock-in (3 years) with highest historical wealth creation.'
      },
      {
        section: 'Section 80D',
        limit: '₹25,000',
        instruments: ['Individual Health Insurance / Parents Health Policy'],
        advice: 'Essential to prevent medical emergencies from depleting your salary or savings.'
      },
      {
        section: 'Section 80CCD(1B)',
        limit: '₹50,000',
        instruments: ['National Pension System (NPS)'],
        advice: 'Additional tax deduction beyond 80C for long-term retirement security.'
      }
    ]
  };
};

const simulateWhatIf = (data) => {
  const { category, reductionAmount, returnRate = 12, tenureYears = 5 } = data;
  const monthlySaving = Number(reductionAmount);
  const yearlySaving = monthlySaving * 12;

  const compounding = calculateSIPFutureValue(monthlySaving, Number(returnRate), Number(tenureYears));

  const impactMessage = `By trimming ₹${monthlySaving.toLocaleString('en-IN')}/month on ${category}, you keep ₹${yearlySaving.toLocaleString('en-IN')} extra in your pocket annually. If invested in a ${returnRate}% SIP, it grows to ₹${compounding.futureValue.toLocaleString('en-IN')} in ${tenureYears} years!`;

  return {
    category,
    monthlySaving,
    yearlySaving,
    tenureYears: Number(tenureYears),
    returnRate: Number(returnRate),
    projectedGrowth: compounding,
    impactMessage
  };
};

const saveScenario = async (userId, data) => {
  const simulation = simulateWhatIf(data);
  const scenario = await Scenario.create({
    userId,
    name: data.name || `Cut ${data.category} spend by ₹${data.reductionAmount}/mo`,
    description: data.description || '',
    category: data.category || 'other',
    monthlySaving: simulation.monthlySaving,
    yearlySaving: simulation.yearlySaving,
    impact: simulation.impactMessage,
    isActive: true
  });
  return scenario;
};

const getScenarios = async (userId) => {
  return await Scenario.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

const deleteScenario = async (userId, scenarioId) => {
  await Scenario.findOneAndDelete({ _id: scenarioId, userId });
  return { message: 'Scenario deleted successfully.' };
};

// Goals CRUD
const getGoals = async (userId) => {
  return await Goal.find({ userId }).sort({ priority: -1, targetDate: 1 });
};

const createGoal = async (userId, data) => {
  const goal = await Goal.create({
    userId,
    name: data.name,
    category: data.category || 'other',
    targetAmount: Number(data.targetAmount),
    currentAmount: Number(data.currentAmount || 0),
    targetDate: new Date(data.targetDate),
    monthlyContribution: Number(data.monthlyContribution || 0),
    priority: data.priority || 'medium',
    status: 'active'
  });
  return goal;
};

const updateGoal = async (userId, goalId, data) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, userId },
    { ...data },
    { new: true }
  );
  if (!goal) {
    const err = new Error('Goal not found.');
    err.statusCode = 404;
    throw err;
  }
  return goal;
};

const deleteGoal = async (userId, goalId) => {
  const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
  if (!goal) {
    const err = new Error('Goal not found.');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Goal removed successfully.' };
};

module.exports = {
  getAdvisorDashboard,
  getPersonalizedTips,
  getEmergencyFundStatus,
  getTaxSavingGuidance,
  simulateWhatIf,
  saveScenario,
  getScenarios,
  deleteScenario,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
