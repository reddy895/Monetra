import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  PiggyBank,
  Compass,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RootState } from '../../store';
import {
  useGetExpenseSummaryQuery,
  useGetExpenseTrendQuery,
  useGetExpensesQuery,
  useGetAdvisorDashboardQuery
} from '../../store/apiSlice';
import { StatCard } from '../../components/UI/StatCard';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { SalaryProgressBar } from './components/SalaryProgressBar';
import { SpendingSummary } from './components/SpendingSummary';
import { QuickActions } from './components/QuickActions';
import { ExpenseFormModal } from '../Expenses/components/ExpenseFormModal';
import { formatINR, formatDate, getMonthName } from '../../utils/formatters';
import { AppIcon } from '../../components/UI/AppIcon';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const { data: summaryData, isLoading: isSummaryLoading } = useGetExpenseSummaryQuery();
  const { data: trendData } = useGetExpenseTrendQuery();
  const { data: recentExpensesData } = useGetExpensesQuery({ limit: 6, sortBy: 'date', sortOrder: 'desc' });
  const { data: advisorData } = useGetAdvisorDashboardQuery();

  const summary = summaryData?.data;
  const recentExpenses = recentExpensesData?.data || [];
  const advisor = advisorData?.data;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (isSummaryLoading || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-charcoal-muted text-sm">
        <div className="w-8 h-8 border-2 border-teal-muted border-t-transparent rounded-full animate-spin mb-3" />
        <span>Loading your financial dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting & Financial Health Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface rounded-card border border-border p-5 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-charcoal tracking-tight">
              Welcome back, {user?.fullName || 'User'}
            </h2>
            <Badge variant="info" size="sm">
              {getMonthName(currentMonth)} {currentYear}
            </Badge>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Tracking against monthly salary of <span className="font-semibold text-charcoal">{formatINR(user?.monthlySalary || 30000)}</span> using the 50/30/20 framework.
          </p>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-3 bg-background p-3 rounded-card border border-border shrink-0">
          <div className="w-10 h-10 rounded-full bg-teal-subtle text-teal-muted flex items-center justify-center font-bold text-sm border border-teal-muted/30">
            {advisor?.comparison?.healthScore || 85}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-charcoal">Budget Health Score</span>
              <span className="text-[10px] text-charcoal-light">/ 100</span>
            </div>
            <p className="text-[11px] text-teal-muted font-medium flex items-center gap-1">
              {advisor?.comparison?.healthScore >= 80 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success-dark" />
                  <span className="text-success-dark">Excellent 50/30/20 Balance</span>
                </>
              ) : advisor?.comparison?.healthScore >= 60 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-soft" />
                  <span className="text-amber-soft">Moderate Discretionary Spend</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-danger-dark" />
                  <span className="text-danger-dark">High Overspending Alert</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <QuickActions onOpenAddExpense={() => setIsExpenseModalOpen(true)} />

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Spent This Month"
          value={formatINR(summary.totalSpent)}
          subtitle={`${Math.round((summary.totalSpent / summary.salary) * 100)}% of monthly salary`}
          trend={{
            value: `${formatINR(summary.salary - summary.totalSpent)} remaining`,
            isPositive: summary.totalSpent <= summary.salary,
          }}
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Needs (Essential)"
          value={formatINR(summary.needsSpent)}
          subtitle={`Budget limit: ${formatINR(summary.idealNeeds)} (50%)`}
          trend={{
            value: `${Math.round((summary.needsSpent / summary.salary) * 100)}% of salary`,
            isPositive: summary.needsSpent <= summary.idealNeeds,
          }}
          iconBgColor="bg-slate-subtle text-slate-warm"
          icon={<Receipt className="w-5 h-5" />}
        />
        <StatCard
          title="Wants (Lifestyle)"
          value={formatINR(summary.wantsSpent)}
          subtitle={`Budget limit: ${formatINR(summary.idealWants)} (30%)`}
          trend={{
            value: `${Math.round((summary.wantsSpent / summary.salary) * 100)}% of salary`,
            isPositive: summary.wantsSpent <= summary.idealWants,
          }}
          iconBgColor="bg-amber-subtle text-amber-soft"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Savings Achieved"
          value={formatINR(summary.savingsSpent)}
          subtitle={`Target: ${formatINR(summary.idealSavings)} (20%)`}
          trend={{
            value: `${summary.savingsRate}% savings rate`,
            isPositive: summary.savingsRate >= 20,
          }}
          iconBgColor="bg-success-subtle text-success"
          icon={<PiggyBank className="w-5 h-5" />}
        />
      </div>

      {/* 50/30/20 Multi-Segment Salary Progress Bar */}
      <SalaryProgressBar
        salary={summary.salary}
        totalSpent={summary.totalSpent}
        needsSpent={summary.needsSpent}
        wantsSpent={summary.wantsSpent}
        savingsSpent={summary.savingsSpent}
      />

      {/* Visual Charts: Donut + Trend */}
      <SpendingSummary summary={summary} trend={trendData?.data} />

      {/* Bottom Section: Recent Transactions & Advisor Recommendations Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-7 p-0 overflow-hidden shadow-subtle flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-charcoal">Recent Transactions</h3>
                <p className="text-xs text-charcoal-muted">Last entries logged this week</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/expenses')}
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                View All
              </Button>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No expenses logged yet. Click "Add Expense" to get started.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentExpenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="px-5 py-3 flex items-center justify-between hover:bg-background/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-card bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                        <AppIcon name={exp.categoryId?.name} className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal truncate max-w-[180px] sm:max-w-[240px]">
                          {exp.description || exp.categoryId?.name || 'Expense'}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          {formatDate(exp.date)} • {exp.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal tabular-nums">
                      {formatINR(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-background border-t border-border text-center">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="text-xs text-teal-muted hover:text-teal-hover font-semibold inline-flex items-center gap-1"
            >
              + Record another expense
            </button>
          </div>
        </Card>

        {/* Advisor Top Insight Card */}
        <Card className="lg:col-span-5 flex flex-col justify-between bg-surface border-border">
          <div>
            <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-soft" />
                <h3 className="text-sm font-bold text-charcoal">Smart Advisor Highlight</h3>
              </div>
              <span className="text-[10px] font-semibold bg-amber-subtle text-amber-soft px-2 py-0.5 rounded border border-amber-soft/30">
                Rule-Based
              </span>
            </div>

            {advisor?.tips && advisor.tips.length > 0 ? (
              <div className="bg-background rounded-card p-4 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-card bg-teal-subtle text-teal-muted flex items-center justify-center shrink-0 font-bold">
                    <AppIcon name={advisor.tips[0].category || advisor.tips[0].title} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">{advisor.tips[0].title}</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      {advisor.tips[0].description}
                    </p>
                    {advisor.tips[0].actionItem && (
                      <div className="mt-2.5 bg-surface p-2.5 rounded-sm border border-border text-[11px] text-teal-muted font-medium flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-muted" />
                        <div>
                          <span className="font-semibold text-charcoal">Action:</span> {advisor.tips[0].actionItem}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Emergency Fund Quick Progress */}
            {advisor?.emergencyFund && (
              <div className="mt-4 p-3 bg-slate-subtle/50 rounded-card border border-border text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-charcoal">Emergency Fund (3 Months)</span>
                  <span className="font-bold text-teal-muted tabular-nums">
                    {formatINR(advisor.emergencyFund.currentAmount)} / {formatINR(advisor.emergencyFund.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-slate-subtle rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-muted h-full rounded-full transition-all duration-500"
                    style={{ width: `${advisor.emergencyFund.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/advisor')}
              rightIcon={<Compass className="w-4 h-4" />}
            >
              Open Full Smart Advisor
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};
