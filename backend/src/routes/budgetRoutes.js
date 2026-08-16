const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', budgetController.getCurrentBudget);
router.get('/recommendations', budgetController.getRecommendations);
router.get('/comparison', budgetController.getComparison);
router.post('/', budgetController.saveBudget);
router.put('/:id', budgetController.saveBudget);

module.exports = router;
