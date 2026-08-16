const budgetService = require('../services/budgetService');

const getCurrentBudget = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await budgetService.getCurrentBudget(req.user._id, month, year);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const salary = req.query.salary ? Number(req.query.salary) : req.user.monthlySalary;
    const recs = budgetService.getSalaryRecommendations(salary);
    res.status(200).json({
      success: true,
      data: recs
    });
  } catch (error) {
    next(error);
  }
};

const saveBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.saveBudget(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

const getComparison = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const comparison = await budgetService.getBudgetComparison(req.user._id, month, year);
    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentBudget,
  getRecommendations,
  saveBudget,
  getComparison
};
