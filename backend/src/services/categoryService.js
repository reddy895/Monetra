const { Category } = require('../models');
const { DEFAULT_CATEGORIES } = require('../config/constants');

const getUserCategories = async (userId) => {
  // Return system default categories and user custom categories
  const categories = await Category.find({
    $or: [
      { isDefault: true },
      { userId: userId }
    ]
  }).sort({ isDefault: -1, name: 1 });

  return categories;
};

const createCategory = async (userId, data) => {
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
    $or: [{ userId }, { isDefault: true }]
  });

  if (existing) {
    const err = new Error('A category with this name already exists.');
    err.statusCode = 400;
    throw err;
  }

  const category = await Category.create({
    name: data.name.trim(),
    icon: data.icon || '📊',
    color: data.color || '#5B7F7A',
    isDefault: false,
    userId,
    maxBudgetPercentage: data.maxBudgetPercentage || 10
  });

  return category;
};

const updateCategory = async (userId, categoryId, data) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    const err = new Error('Category not found or default category cannot be modified directly.');
    err.statusCode = 404;
    throw err;
  }

  if (data.name) category.name = data.name.trim();
  if (data.icon) category.icon = data.icon;
  if (data.color) category.color = data.color;
  if (data.maxBudgetPercentage !== undefined) category.maxBudgetPercentage = data.maxBudgetPercentage;

  await category.save();
  return category;
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({ _id: categoryId, userId });
  if (!category) {
    const err = new Error('Custom category not found or cannot delete default system categories.');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Category removed successfully.' };
};

module.exports = {
  getUserCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
