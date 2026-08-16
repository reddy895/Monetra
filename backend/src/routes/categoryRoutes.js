const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

router.use(protect);

router.get('/', categoryController.getCategories);
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Category name is required')
  ],
  validate,
  categoryController.createCategory
);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
