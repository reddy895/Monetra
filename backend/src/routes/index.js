const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const expenseRoutes = require('./expenseRoutes');
const categoryRoutes = require('./categoryRoutes');
const budgetRoutes = require('./budgetRoutes');
const advisorRoutes = require('./advisorRoutes');
const sipRoutes = require('./sipRoutes');
const reportRoutes = require('./reportRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/advisor', advisorRoutes);
router.use('/sips', sipRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Personal Finance Partner API'
  });
});

module.exports = router;
