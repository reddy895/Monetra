const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('monthlySalary')
      .isInt({ min: 20000, max: 50000 })
      .withMessage('Monthly salary must be between ₹20,000 and ₹50,000')
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateMe);

module.exports = router;
