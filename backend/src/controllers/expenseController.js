const expenseService = require('../services/expenseService');

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const result = await expenseService.getExpenses(req.user._id, req.query);
    res.status(200).json({
      success: true,
      data: result.expenses,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.user._id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const result = await expenseService.deleteExpense(req.user._id, req.params.id);
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
    const summary = await expenseService.getExpenseSummary(req.user._id, month, year);
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

const getTrend = async (req, res, next) => {
  try {
    const trend = await expenseService.getExpenseTrend(req.user._id, req.query.period);
    res.status(200).json({
      success: true,
      data: trend
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary,
  getTrend
};
