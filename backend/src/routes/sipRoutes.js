const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const sipController = require('../controllers/sipController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

// Public Real-Time Live AMFI Mutual Fund NAV & Projections
router.get('/live-nav/:schemeCode', sipController.getLiveFundNAV);
router.get('/live-search', sipController.searchLiveFunds);
router.get('/recommendations', sipController.getRecommendations);
router.post('/calculate', sipController.calculate);
router.get('/funds', sipController.searchFunds);

// Protected routes (User specific portfolio if needed)
router.use(protect);
router.get('/performance', sipController.getPerformance);
router.get('/', sipController.getSIPs);
router.post(
  '/',
  [
    body('fundName').trim().notEmpty().withMessage('Fund name is required'),
    body('amc').trim().notEmpty().withMessage('AMC is required'),
    body('amount').isFloat({ min: 500 }).withMessage('Minimum SIP amount is ₹500'),
    body('category').notEmpty().withMessage('Fund category is required')
  ],
  validate,
  sipController.createSIP
);
router.put('/:id', sipController.updateSIP);
router.delete('/:id', sipController.deleteSIP);

module.exports = router;
