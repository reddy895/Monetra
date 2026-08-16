import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Category,
  Expense,
  ExpenseSummary,
  ExpenseTrend,
  SalaryBlueprint,
  BudgetComparison,
  AdvisorTip,
  EmergencyFundStatus,
  FinancialGoal,
  Scenario,
  InvestmentRecommendation,
  SIPItem,
  SIPPortfolioSummary,
  SIPCalculationResult,
  NotificationItem,
  MonthlyReportData,
  User
} from '../types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('fp_access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('fp_access_token');
    localStorage.removeItem('fp_refresh_token');
    localStorage.removeItem('fp_user');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login';
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Expense',
    'Category',
    'Budget',
    'Advisor',
    'Goal',
    'Scenario',
    'SIP',
    'Report',
    'Notification'
  ],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string } }, any>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Expense', 'Budget', 'Advisor', 'SIP'],
    }),
    login: builder.mutation<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string } }, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Expense', 'Budget', 'Advisor', 'SIP'],
    }),
    getMe: builder.query<{ success: boolean; data: User }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    updateProfile: builder.mutation<{ success: boolean; data: User }, Partial<User>>({
      query: (updates) => ({
        url: '/auth/me',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Auth', 'Budget', 'Advisor', 'SIP', 'Report'],
    }),

    // Categories
    getCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation<{ success: boolean; data: Category }, Partial<Category>>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category', 'Expense', 'Budget', 'Advisor'],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category', 'Expense'],
    }),

    // Expenses
    getExpenses: builder.query<{ success: boolean; data: Expense[]; pagination: any }, Record<string, any>>({
      query: (params) => ({
        url: '/expenses',
        params,
      }),
      providesTags: ['Expense'],
    }),
    getExpenseSummary: builder.query<{ success: boolean; data: ExpenseSummary }, { month?: number; year?: number } | void>({
      query: (params) => ({
        url: '/expenses/summary',
        params: params || {},
      }),
      providesTags: ['Expense', 'Budget'],
    }),
    getExpenseTrend: builder.query<{ success: boolean; data: ExpenseTrend }, { period?: string } | void>({
      query: (params) => ({
        url: '/expenses/trend',
        params: params || {},
      }),
      providesTags: ['Expense'],
    }),
    addExpense: builder.mutation<{ success: boolean; data: Expense }, any>({
      query: (expense) => ({
        url: '/expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Expense', 'Budget', 'Advisor', 'Report'],
    }),
    updateExpense: builder.mutation<{ success: boolean; data: Expense }, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Expense', 'Budget', 'Advisor', 'Report'],
    }),
    deleteExpense: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense', 'Budget', 'Advisor', 'Report'],
    }),

    // Budgets
    getCurrentBudget: builder.query<{ success: boolean; data: { budget: any; summary: ExpenseSummary; recommendations: SalaryBlueprint } }, { month?: number; year?: number } | void>({
      query: (params) => ({
        url: '/budgets',
        params: params || {},
      }),
      providesTags: ['Budget', 'Expense'],
    }),
    getBudgetRecommendations: builder.query<{ success: boolean; data: SalaryBlueprint }, { salary?: number } | void>({
      query: (params) => ({
        url: '/budgets/recommendations',
        params: params || {},
      }),
      providesTags: ['Budget'],
    }),
    getBudgetComparison: builder.query<{ success: boolean; data: BudgetComparison }, { month?: number; year?: number } | void>({
      query: (params) => ({
        url: '/budgets/comparison',
        params: params || {},
      }),
      providesTags: ['Budget', 'Expense'],
    }),
    saveBudget: builder.mutation<{ success: boolean; data: any }, any>({
      query: (budget) => ({
        url: '/budgets',
        method: 'POST',
        body: budget,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Advisor (NO CHATBOT)
    getAdvisorDashboard: builder.query<{ success: boolean; data: any }, { salary?: number } | void>({
      query: (params) => ({
        url: '/advisor/dashboard',
        params: params || {},
      }),
      providesTags: ['Advisor', 'Goal', 'Scenario', 'Expense'],
    }),
    getAdvisorTips: builder.query<{ success: boolean; data: AdvisorTip[] }, { salary?: number } | void>({
      query: (params) => ({
        url: '/advisor/tips',
        params: params || {},
      }),
      providesTags: ['Advisor', 'Expense'],
    }),
    getEmergencyFund: builder.query<{ success: boolean; data: EmergencyFundStatus }, { salary?: number } | void>({
      query: (params) => ({
        url: '/advisor/emergency-fund',
        params: params || {},
      }),
      providesTags: ['Advisor', 'Goal', 'Expense'],
    }),

    // Goals
    getGoals: builder.query<{ success: boolean; data: FinancialGoal[] }, void>({
      query: () => '/advisor/goals',
      providesTags: ['Goal'],
    }),
    addGoal: builder.mutation<{ success: boolean; data: FinancialGoal }, Partial<FinancialGoal>>({
      query: (goal) => ({
        url: '/advisor/goals',
        method: 'POST',
        body: goal,
      }),
      invalidatesTags: ['Goal', 'Advisor'],
    }),
    updateGoal: builder.mutation<{ success: boolean; data: FinancialGoal }, { id: string; data: Partial<FinancialGoal> }>({
      query: ({ id, data }) => ({
        url: `/advisor/goals/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Goal', 'Advisor'],
    }),
    deleteGoal: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/advisor/goals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Goal', 'Advisor'],
    }),

    // What-If & Scenarios
    simulateWhatIf: builder.mutation<{ success: boolean; data: any }, { category: string; reductionAmount: number; returnRate?: number; tenureYears?: number }>({
      query: (body) => ({
        url: '/advisor/what-if',
        method: 'POST',
        body,
      }),
    }),
    saveScenario: builder.mutation<{ success: boolean; data: Scenario }, any>({
      query: (scenario) => ({
        url: '/advisor/scenarios',
        method: 'POST',
        body: scenario,
      }),
      invalidatesTags: ['Scenario', 'Advisor'],
    }),
    getScenarios: builder.query<{ success: boolean; data: Scenario[] }, void>({
      query: () => '/advisor/scenarios',
      providesTags: ['Scenario'],
    }),
    deleteScenario: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/advisor/scenarios/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scenario', 'Advisor'],
    }),

    // SIPs
    getSIPs: builder.query<{ success: boolean; data: SIPItem[]; summary: SIPPortfolioSummary }, void>({
      query: () => '/sips',
      providesTags: ['SIP'],
    }),
    addSIP: builder.mutation<{ success: boolean; data: SIPItem }, any>({
      query: (sip) => ({
        url: '/sips',
        method: 'POST',
        body: sip,
      }),
      invalidatesTags: ['SIP', 'Report'],
    }),
    updateSIP: builder.mutation<{ success: boolean; data: SIPItem }, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sips/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SIP', 'Report'],
    }),
    deleteSIP: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/sips/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SIP', 'Report'],
    }),
    getSIPRecommendations: builder.query<{ success: boolean; data: { salary: number; riskProfile: string; recommendations: InvestmentRecommendation[] } }, { salary?: number; risk?: string } | void>({
      query: (params) => ({
        url: '/sips/recommendations',
        params: params || {},
      }),
      providesTags: ['SIP'],
    }),
    calculateSIP: builder.mutation<{ success: boolean; data: SIPCalculationResult }, { monthlyAmount: number; annualRate: number; tenureYears: number }>({
      query: (body) => ({
        url: '/sips/calculate',
        method: 'POST',
        body,
      }),
    }),
    // Real-Time Live AMFI Mutual Fund NAV & Search
    getLiveFundNAV: builder.query<{ success: boolean; data: any }, { schemeCode: string | number; period?: string }>({
      query: ({ schemeCode, period = '1Y' }) => ({
        url: `/sips/live-nav/${schemeCode}`,
        params: { period },
      }),
    }),
    searchLiveFunds: builder.query<{ success: boolean; data: Array<{ schemeCode: number; schemeName: string }> }, string>({
      query: (q) => ({
        url: '/sips/live-search',
        params: { q },
      }),
    }),
    searchFunds: builder.query<{ success: boolean; data: InvestmentRecommendation[] }, string>({
      query: (q) => ({
        url: '/sips/funds',
        params: { q },
      }),
    }),

    // Reports
    getMonthlyReport: builder.query<{ success: boolean; data: MonthlyReportData }, { month?: number; year?: number } | void>({
      query: (params) => ({
        url: '/reports/monthly',
        params: params || {},
      }),
      providesTags: ['Report'],
    }),
    getYearlyReport: builder.query<{ success: boolean; data: any }, { year?: number } | void>({
      query: (params) => ({
        url: '/reports/yearly',
        params: params || {},
      }),
      providesTags: ['Report'],
    }),

    // Notifications
    getNotifications: builder.query<{ success: boolean; data: NotificationItem[] }, void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
  useGetExpenseTrendQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetCurrentBudgetQuery,
  useGetBudgetRecommendationsQuery,
  useGetBudgetComparisonQuery,
  useSaveBudgetMutation,
  useGetAdvisorDashboardQuery,
  useGetAdvisorTipsQuery,
  useGetEmergencyFundQuery,
  useGetGoalsQuery,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useSimulateWhatIfMutation,
  useSaveScenarioMutation,
  useGetScenariosQuery,
  useDeleteScenarioMutation,
  useGetSIPsQuery,
  useAddSIPMutation,
  useUpdateSIPMutation,
  useDeleteSIPMutation,
  useGetSIPRecommendationsQuery,
  useCalculateSIPMutation,
  useGetLiveFundNAVQuery,
  useSearchLiveFundsQuery,
  useSearchFundsQuery,
  useGetMonthlyReportQuery,
  useGetYearlyReportQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = apiSlice;
