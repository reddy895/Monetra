const advisorService = require('../services/advisorService');
const budgetService = require('../services/budgetService');
const { getExpenseSummary } = require('../services/expenseService');

const getDashboard = async (req, res, next) => {
  try {
    const salary = req.query.salary || null;
    const dashboard = await advisorService.getAdvisorDashboard(req.user._id, salary);
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

const getBreakdown = async (req, res, next) => {
  try {
    const salary = req.query.salary ? Number(req.query.salary) : req.user.monthlySalary;
    const blueprint = budgetService.getSalaryRecommendations(salary);
    const comparison = await budgetService.getBudgetComparison(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        blueprint,
        comparison
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTips = async (req, res, next) => {
  try {
    const salary = req.query.salary ? Number(req.query.salary) : req.user.monthlySalary;
    const tips = await advisorService.getPersonalizedTips(salary, req.user._id);
    res.status(200).json({
      success: true,
      data: tips
    });
  } catch (error) {
    next(error);
  }
};

const getEmergencyFund = async (req, res, next) => {
  try {
    const salary = req.query.salary ? Number(req.query.salary) : req.user.monthlySalary;
    const fund = await advisorService.getEmergencyFundStatus(req.user._id, salary);
    res.status(200).json({
      success: true,
      data: fund
    });
  } catch (error) {
    next(error);
  }
};

const getGoals = async (req, res, next) => {
  try {
    const goals = await advisorService.getGoals(req.user._id);
    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const goal = await advisorService.createGoal(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Financial goal created successfully',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const goal = await advisorService.updateGoal(req.user._id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Goal updated',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const result = await advisorService.deleteGoal(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const simulateWhatIf = async (req, res, next) => {
  try {
    const result = advisorService.simulateWhatIf(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const saveScenario = async (req, res, next) => {
  try {
    const scenario = await advisorService.saveScenario(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Scenario saved to your profile',
      data: scenario
    });
  } catch (error) {
    next(error);
  }
};

const getScenarios = async (req, res, next) => {
  try {
    const scenarios = await advisorService.getScenarios(req.user._id);
    res.status(200).json({
      success: true,
      data: scenarios
    });
  } catch (error) {
    next(error);
  }
};

const deleteScenario = async (req, res, next) => {
  try {
    const result = await advisorService.deleteScenario(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const summary = await getExpenseSummary(req.user._id, month, year);
    const blueprint = budgetService.getSalaryRecommendations(req.user.monthlySalary);
    res.status(200).json({
      success: true,
      data: {
        summary,
        blueprint,
        user: {
          fullName: req.user.fullName,
          email: req.user.email,
          monthlySalary: req.user.monthlySalary
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getBreakdown,
  getTips,
  getEmergencyFund,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  simulateWhatIf,
  saveScenario,
  getScenarios,
  deleteScenario,
  getSummary
};
