const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const advisorController = require('../controllers/advisorController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

router.use(protect);

router.get('/dashboard', advisorController.getDashboard);
router.get('/breakdown', advisorController.getBreakdown);
router.get('/tips', advisorController.getTips);
router.get('/emergency-fund', advisorController.getEmergencyFund);
router.get('/summary', advisorController.getSummary);

// Goals
router.get('/goals', advisorController.getGoals);
router.post(
  '/goals',
  [
    body('name').trim().notEmpty().withMessage('Goal name is required'),
    body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be greater than 0'),
    body('targetDate').notEmpty().withMessage('Target date is required')
  ],
  validate,
  advisorController.createGoal
);
router.put('/goals/:id', advisorController.updateGoal);
router.delete('/goals/:id', advisorController.deleteGoal);

// What-If Scenarios
router.post('/what-if', advisorController.simulateWhatIf);
router.post('/scenarios', advisorController.saveScenario);
router.get('/scenarios', advisorController.getScenarios);
router.delete('/scenarios/:id', advisorController.deleteScenario);

module.exports = router;
