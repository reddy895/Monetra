require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  User,
  Category,
  Expense,
  Budget,
  Goal,
  SIP,
  SIPPerformance,
  Tip,
  InvestmentRecommendation,
  Notification
} = require('../models');
const { DEFAULT_CATEGORIES } = require('../config/constants');

const advisorTips = [
  // ₹20,000 - ₹25,000 Bracket
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 25000,
    category: 'emergency',
    title: 'Build a ₹15,000 Starter Emergency Fund',
    description: 'Aim to set aside ₹1,000 to ₹1,500 every month in a separate savings account or liquid fund to protect against unforeseen medical or family needs.',
    actionItem: 'Set up an automatic ₹1,000 transfer on salary credit day.',
    priority: 1,
    icon: 'ShieldCheck'
  },
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 25000,
    category: 'sip',
    title: 'Start Small with a Nifty 50 Index Fund',
    description: 'Start your wealth journey with just ₹500 - ₹1,000/month. Index funds have low expense ratios (<0.2%) and replicate India’s top 50 companies.',
    actionItem: 'Start a ₹500/mo SIP in UTI Nifty 50 Index Fund.',
    priority: 2,
    icon: 'TrendingUp'
  },
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 25000,
    category: 'budget',
    title: 'Strict 50/30/20 Budgeting',
    description: 'On a ₹20K-₹25K salary: Needs ₹10,000-₹12,500, Wants ₹6,000-₹7,500, Savings ₹4,000-₹5,000. Keep rent within 30% by sharing accommodation if needed.',
    actionItem: 'Review rent and utilities to ensure they stay below 35% combined.',
    priority: 3,
    icon: 'PieChart'
  },
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 25000,
    category: 'food',
    title: 'Meal Planning & Groceries Optimization',
    description: 'Ordering online frequently can easily cost ₹3,000-₹4,000/mo. Cooking dinner at home saves over ₹2,000 monthly.',
    actionItem: 'Cap Swiggy/Zomato orders to twice a month.',
    priority: 4,
    icon: 'Utensils'
  },

  // ₹25,001 - ₹35,000 Bracket
  {
    salaryRangeMin: 25001,
    salaryRangeMax: 35000,
    category: 'emergency',
    title: '3-Month Emergency Cushion',
    description: 'At ₹30,000 salary, your 3-month living cost is approx ₹45,000. Save ₹3,000/month in high-interest savings or liquid funds.',
    actionItem: 'Reach ₹45,000 emergency fund in 15 months.',
    priority: 1,
    icon: 'ShieldCheck'
  },
  {
    salaryRangeMin: 25001,
    salaryRangeMax: 35000,
    category: 'sip',
    title: 'Core + Satellite SIP Allocation (₹3,000 - ₹5,000/mo)',
    description: 'Split your savings: 70% in Flexi Cap / Large Cap Index, 30% in a Mid Cap fund for higher long-term compounding.',
    actionItem: 'Invest ₹2,000 in Parag Parikh Flexi Cap + ₹1,000 in Motilal Oswal Midcap.',
    priority: 2,
    icon: 'TrendingUp'
  },
  {
    salaryRangeMin: 25001,
    salaryRangeMax: 35000,
    category: 'tax',
    title: 'Tax-Saving & Long-Term Growth via ELSS',
    description: 'ELSS mutual funds have the shortest 3-year lock-in among 80C options and generate ~13-15% historical annual returns.',
    actionItem: 'Invest ₹1,500/mo in Mirae Asset ELSS Tax Saver.',
    priority: 3,
    icon: 'FileText'
  },
  {
    salaryRangeMin: 25001,
    salaryRangeMax: 35000,
    category: 'saving',
    title: 'Avoid Credit Card EMI Traps',
    description: 'Buying gadgets on "No Cost" EMI often triggers processing fees and locks up your monthly cash flow.',
    actionItem: 'Use a dedicated sinking fund goal for gadgets instead of EMIs.',
    priority: 4,
    icon: 'CreditCard'
  },

  // ₹35,001 - ₹50,000 Bracket
  {
    salaryRangeMin: 35001,
    salaryRangeMax: 50000,
    category: 'sip',
    title: 'Accelerate Wealth Creation (₹7,000 - ₹10,000/mo SIP)',
    description: 'Investing ₹8,000/month at 13% CAGR grows to over ₹19 Lakhs in 10 years and ₹85 Lakhs in 20 years.',
    actionItem: 'Diversify: ₹4,000 Flexi Cap, ₹2,500 Mid/Small Cap, ₹1,500 ELSS.',
    priority: 1,
    icon: 'TrendingUp'
  },
  {
    salaryRangeMin: 35001,
    salaryRangeMax: 50000,
    category: 'insurance',
    title: 'Separate Insurance from Investment',
    description: 'Do not buy Endowment or ULIP policies. Buy a pure Term Life Insurance (10-15x annual salary) and a standalone Health Cover.',
    actionItem: 'Get a ₹50 Lakh Term Cover + ₹5 Lakh Health Cover for ~₹800/mo.',
    priority: 2,
    icon: 'ShieldCheck'
  },
  {
    salaryRangeMin: 35001,
    salaryRangeMax: 50000,
    category: 'emergency',
    title: 'Full 6-Month Emergency Cushion',
    description: 'Maintain 6 months of mandatory living expenses (~₹1,00,000) split between sweep-in FD and Liquid Mutual Funds.',
    actionItem: 'Automate ₹5,000/mo until emergency fund target is hit.',
    priority: 3,
    icon: 'ShieldCheck'
  },
  {
    salaryRangeMin: 35001,
    salaryRangeMax: 50000,
    category: 'budget',
    title: 'Lifestyle Inflation Guard',
    description: 'When bonuses or increments happen, allocate at least 50% of the raise directly into increasing your SIP amounts (Step-up SIP).',
    actionItem: 'Commit to a 10% annual Step-Up on all active SIPs.',
    priority: 4,
    icon: 'PieChart'
  }
];

const investmentRecommendations = [
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 28000,
    fundName: 'UTI Nifty 50 Index Fund - Direct Growth',
    fundCategory: 'Index',
    amc: 'UTI Mutual Fund',
    fundCode: '120716',
    minInvestment: 500,
    recommendedAmount: 1000,
    riskLevel: 'low',
    expectedReturns: '11-13%',
    cagr3Y: 13.8,
    cagr5Y: 15.2,
    currentNav: 171.58,
    description: 'Low-cost index fund replicating Nifty 50 with 0.18% expense ratio. Ideal low-risk foundation.',
    priority: 1
  },
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 28000,
    fundName: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    fundCategory: 'Flexi Cap',
    amc: 'PPFAS Mutual Fund',
    fundCode: '122639',
    minInvestment: 1000,
    recommendedAmount: 1500,
    riskLevel: 'moderate',
    expectedReturns: '13-16%',
    cagr3Y: 16.5,
    cagr5Y: 19.1,
    currentNav: 91.68,
    description: 'India’s most trusted multi-cap fund investing across large, mid, and small cap equities with high alpha.',
    priority: 2
  },
  {
    salaryRangeMin: 20000,
    salaryRangeMax: 28000,
    fundName: 'Mirae Asset ELSS Tax Saver Fund - Direct Growth',
    fundCategory: 'ELSS',
    amc: 'Mirae Asset Mutual Fund',
    fundCode: '135781',
    minInvestment: 500,
    recommendedAmount: 1000,
    riskLevel: 'moderate',
    expectedReturns: '13-15%',
    cagr3Y: 15.1,
    cagr5Y: 17.8,
    currentNav: 58.32,
    description: 'Dual benefit of Section 80C tax saving and equity compounding with lowest 3-year lock-in.',
    priority: 3
  },
  {
    salaryRangeMin: 28001,
    salaryRangeMax: 40000,
    fundName: 'HDFC Nifty 50 Index Fund - Direct Growth',
    fundCategory: 'Index',
    amc: 'HDFC Mutual Fund',
    fundCode: '119063',
    minInvestment: 500,
    recommendedAmount: 2000,
    riskLevel: 'low',
    expectedReturns: '12-14%',
    cagr3Y: 14.1,
    cagr5Y: 15.5,
    currentNav: 238.49,
    description: 'Solid large-cap exposure with minimal tracking error and top tier stability.',
    priority: 1
  },
  {
    salaryRangeMin: 28001,
    salaryRangeMax: 40000,
    fundName: 'Motilal Oswal Midcap Fund - Direct Growth',
    fundCategory: 'Mid Cap',
    amc: 'Motilal Oswal Mutual Fund',
    fundCode: '127042',
    minInvestment: 500,
    recommendedAmount: 1500,
    riskLevel: 'high',
    expectedReturns: '15-18%',
    cagr3Y: 22.4,
    cagr5Y: 24.1,
    currentNav: 120.27,
    description: 'High-growth mid-cap companies with strong pricing power and robust earnings.',
    priority: 2
  },
  {
    salaryRangeMin: 40001,
    salaryRangeMax: 50000,
    fundName: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    fundCategory: 'Flexi Cap',
    amc: 'PPFAS Mutual Fund',
    fundCode: '122639',
    minInvestment: 1000,
    recommendedAmount: 3500,
    riskLevel: 'moderate',
    expectedReturns: '14-17%',
    cagr3Y: 16.5,
    cagr5Y: 19.1,
    currentNav: 91.68,
    description: 'Anchor equity fund for your wealth creation journey with consistent outperformance.',
    priority: 1
  },
  {
    salaryRangeMin: 40001,
    salaryRangeMax: 50000,
    fundName: 'Nippon India Small Cap Fund - Direct Growth',
    fundCategory: 'Small Cap',
    amc: 'Nippon India Mutual Fund',
    fundCode: '118778',
    minInvestment: 500,
    recommendedAmount: 2000,
    riskLevel: 'high',
    expectedReturns: '16-20%',
    cagr3Y: 24.8,
    cagr5Y: 28.2,
    currentNav: 209.19,
    description: 'India’s largest small cap fund with wide diversification across 150+ emerging market leaders.',
    priority: 2
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_partner';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB...');

    // 1. Seed Default Categories
    console.log('Seeding Default Categories...');
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { name: cat.name, isDefault: true },
        { ...cat, userId: null },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${DEFAULT_CATEGORIES.length} default categories.`);

    // 2. Seed Advisor Tips
    console.log('Seeding Advisor Tips...');
    await Tip.deleteMany({});
    await Tip.insertMany(advisorTips);
    console.log(`✓ Seeded ${advisorTips.length} advisor tips.`);

    // 3. Seed Investment Recommendations
    console.log('Seeding Investment Recommendations...');
    await InvestmentRecommendation.deleteMany({});
    await InvestmentRecommendation.insertMany(investmentRecommendations);
    console.log(`✓ Seeded ${investmentRecommendations.length} fund recommendations.`);

    // 4. Delete all existing users, expenses, goals, SIPs, and budgets
    console.log('Clearing all existing users and activity data...');
    await User.deleteMany({});
    await Expense.deleteMany({});
    await Goal.deleteMany({});
    await SIP.deleteMany({});
    await SIPPerformance.deleteMany({});
    await Notification.deleteMany({});
    await Budget.deleteMany({});

    console.log('✓ All previous users cleared. 0 users in database.');
    console.log('✓ Ready for new user registrations at /register.');
    console.log('Database Initialized Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
