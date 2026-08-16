export interface User {
  id: string;
  _id?: string;
  email: string;
  fullName: string;
  monthlySalary: number;
  currencyPreference?: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string | null;
  maxBudgetPercentage?: number;
}

export interface Expense {
  _id: string;
  userId: string;
  categoryId: Category;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  createdAt: string;
}

export interface ExpenseSummaryCategory {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  totalSpent: number;
  count: number;
  percentageOfSalary: number;
  percentageOfExpense: number;
  maxBudgetPercentage?: number;
  isOverLimit: boolean;
}

export interface ExpenseSummary {
  month: number;
  year: number;
  salary: number;
  totalSpent: number;
  savingsSpent: number;
  savingsRate: number;
  needsSpent: number;
  wantsSpent: number;
  idealNeeds: number;
  idealWants: number;
  idealSavings: number;
  categories: ExpenseSummaryCategory[];
}

export interface ExpenseTrend {
  dailySpending: Array<{ _id: string; total: number; count: number }>;
  monthlyTrend: Array<{ _id: { year: number; month: number }; total: number }>;
}

export interface BudgetRecommendationItem {
  percentage: number;
  amount: number;
  label: string;
}

export interface SalaryBlueprint {
  salary: number;
  needs: BudgetRecommendationItem;
  wants: BudgetRecommendationItem;
  savings: BudgetRecommendationItem;
  categoryLimits: Array<{ name: string; percentage: number; amount: number }>;
}

export interface BudgetComparison {
  salary: number;
  month: number;
  year: number;
  healthScore: number;
  actual: {
    needs: number;
    needsPercentage: number;
    wants: number;
    wantsPercentage: number;
    savings: number;
    savingsPercentage: number;
    totalSpent: number;
  };
  ideal: {
    needs: number;
    needsPercentage: number;
    wants: number;
    wantsPercentage: number;
    savings: number;
    savingsPercentage: number;
  };
  categories: ExpenseSummaryCategory[];
}

export interface AdvisorTip {
  _id?: string;
  category: 'emergency' | 'sip' | 'budget' | 'saving' | 'food' | 'transport' | 'insurance' | 'tax';
  title: string;
  description: string;
  actionItem?: string;
  priority?: number;
  icon?: string;
}

export interface EmergencyFundStatus {
  targetMonths: number;
  monthlyExpenses: number;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  monthlySuggestedSave: number;
  goalId?: string | null;
  isComplete: boolean;
}

export interface FinancialGoal {
  _id: string;
  userId: string;
  name: string;
  category: 'emergency_fund' | 'vacation' | 'gadget' | 'education' | 'wedding' | 'home' | 'vehicle' | 'other';
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'abandoned';
}

export interface Scenario {
  _id: string;
  name: string;
  description?: string;
  category: string;
  monthlySaving: number;
  yearlySaving: number;
  impact?: string;
  isActive: boolean;
}

export interface InvestmentRecommendation {
  _id: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  fundName: string;
  fundCategory: string;
  amc: string;
  fundCode: string;
  minInvestment: number;
  recommendedAmount: number;
  riskLevel: string;
  expectedReturns: string;
  cagr3Y: number;
  cagr5Y: number;
  currentNav: number;
  description: string;
  priority: number;
}

export interface SIPItem {
  _id: string;
  userId: string;
  fundName: string;
  amc: string;
  fundCode: string;
  category: string;
  amount: number;
  startDate: string;
  nextDate: string;
  frequency: 'monthly' | 'quarterly';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  totalInvested: number;
  currentValue: number;
  returns: number;
  xirr: number;
}

export interface SIPPortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnsPercentage: number;
  xirr: number;
  activeCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface SIPCalculationResult {
  totalInvested: number;
  futureValue: number;
  wealthGained: number;
  tenureYears: number;
  annualRatePercentage: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    wealthGained: number;
    totalValue: number;
  }>;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  type: 'budget_alert' | 'goal_achieved' | 'sip_reminder' | 'saving_tip' | 'spending_alert';
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
  createdAt: string;
}

export interface MonthlyReportData {
  user: {
    fullName: string;
    email: string;
    monthlySalary: number;
  };
  month: number;
  year: number;
  summary: ExpenseSummary;
  comparison: BudgetComparison;
  totalSIPInvestedMonthly: number;
  activeSIPCount: number;
  activeGoalsCount: number;
  insights: string[];
}
