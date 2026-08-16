const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

router.use(protect);

router.get('/summary', expenseController.getSummary);
router.get('/trend', expenseController.getTrend);

router.get('/', expenseController.getExpenses);
router.post(
  '/',
  [
    body('categoryId').isMongoId().withMessage('Valid category ID required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('paymentMethod').isIn(['Cash', 'Card', 'UPI', 'Bank Transfer']).withMessage('Valid payment method required')
  ],
  validate,
  expenseController.createExpense
);

router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
