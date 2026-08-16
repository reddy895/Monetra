const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Category, Budget } = require('../models');
const { DEFAULT_CATEGORIES, RULE_50_30_20 } = require('../config/constants');
const { getCurrentMonthYear } = require('../utils/dates');

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    monthlySalary: user.monthlySalary
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'super_secret_jwt_key_personal_finance_partner_2026',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'super_refresh_jwt_key_personal_finance_partner_2026',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const registerUser = async ({ email, fullName, password, monthlySalary, riskProfile }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    const error = new Error('User already exists with this email address.');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email: email.toLowerCase().trim(),
    fullName: fullName.trim(),
    hashedPassword,
    monthlySalary: Number(monthlySalary),
    riskProfile: riskProfile || 'moderate'
  });

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  // Create initial monthly budget for the user
  const { month, year } = getCurrentMonthYear();
  const needsBudget = (user.monthlySalary * RULE_50_30_20.NEEDS_PERCENTAGE) / 100;
  const wantsBudget = (user.monthlySalary * RULE_50_30_20.WANTS_PERCENTAGE) / 100;
  const savingsBudget = (user.monthlySalary * RULE_50_30_20.SAVINGS_PERCENTAGE) / 100;

  await Budget.findOneAndUpdate(
    { userId: user._id, month, year },
    {
      userId: user._id,
      month,
      year,
      salary: user.monthlySalary,
      needsBudget,
      wantsBudget,
      savingsBudget,
      totalSpent: 0,
      savingsAchieved: 0
    },
    { upsert: true, new: true }
  );

  return {
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      monthlySalary: user.monthlySalary,
      riskProfile: user.riskProfile,
      currencyPreference: user.currencyPreference
    },
    accessToken,
    refreshToken
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      monthlySalary: user.monthlySalary,
      riskProfile: user.riskProfile,
      currencyPreference: user.currencyPreference
    },
    accessToken,
    refreshToken
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'super_refresh_jwt_key_personal_finance_partner_2026'
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error('Invalid or revoked refresh token.');
      error.statusCode = 401;
      throw error;
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        monthlySalary: user.monthlySalary,
        riskProfile: user.riskProfile
      }
    };
  } catch (err) {
    const error = new Error('Invalid or expired refresh token.');
    error.statusCode = 401;
    throw error;
  }
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: 'Logged out successfully.' };
};

const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-hashedPassword');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowed = ['fullName', 'monthlySalary', 'riskProfile', 'currencyPreference'];
  const updateData = {};

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      updateData[key] = updates[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  }).select('-hashedPassword');

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUserProfile,
  updateProfile
};
