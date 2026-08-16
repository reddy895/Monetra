import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  useGetAdvisorDashboardQuery,
  useGetMonthlyReportQuery
} from '../../store/apiSlice';
import { SalarySelector } from '../../components/Common/SalarySelector';
import { BudgetBreakdown } from './components/BudgetBreakdown';
import { CategoryComparison } from './components/CategoryComparison';
import { EmergencyFundTracker } from './components/EmergencyFundTracker';
import { TipsList } from './components/TipsList';
import { GoalsManager } from './components/GoalsManager';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { TaxSavingGuide } from './components/TaxSavingGuide';
import { MonthlySummaryModal } from './components/MonthlySummaryModal';
import { Button } from '../../components/UI/Button';
import {
  Compass,
  FileText,
  Sliders,
  Target,
  Lightbulb,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const AdvisorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get('tab') || 'blueprint';

  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedSalary, setSelectedSalary] = useState<number>(user?.monthlySalary || 30000);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: dashboardData, isLoading, isError, refetch } = useGetAdvisorDashboardQuery({ salary: selectedSalary });
  const { data: monthlyReportData } = useGetMonthlyReportQuery();

  const dashboard = dashboardData?.data;

  const tabs = [
    { id: 'blueprint', label: '50/30/20 Blueprint & Guardrails', icon: Compass },
    { id: 'tips', label: 'Actionable Tips', icon: Lightbulb },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'tax', label: 'Tax Saving (80C / 80D)', icon: FileCheck2 },
  ];

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Fallback blueprint calculation if server is initializing
  const fallbackBlueprint = {
    salary: selectedSalary,
    needs: { percentage: 50, amount: Math.round(selectedSalary * 0.5), label: 'Essential Needs' },
    wants: { percentage: 30, amount: Math.round(selectedSalary * 0.3), label: 'Lifestyle Wants' },
    savings: { percentage: 20, amount: Math.round(selectedSalary * 0.2), label: 'SIP & Savings' },
    categoryLimits: []
  };

  const fallbackComparison = {
    salary: selectedSalary,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    healthScore: 100,
    actual: {
      needs: 0,
      needsPercentage: 0,
      wants: 0,
      wantsPercentage: 0,
      savings: selectedSalary,
      savingsPercentage: 100,
      totalSpent: 0
    },
    ideal: {
      needs: Math.round(selectedSalary * 0.5),
      needsPercentage: 50,
      wants: Math.round(selectedSalary * 0.3),
      wantsPercentage: 30,
      savings: Math.round(selectedSalary * 0.2),
      savingsPercentage: 20
    },
    categories: []
  };

  const activeDashboard = dashboard || {
    salary: selectedSalary,
    blueprint: fallbackBlueprint,
    comparison: fallbackComparison,
    emergencyFund: {
      targetMonths: 3,
      monthlyExpenses: Math.round(selectedSalary * 0.5),
      targetAmount: Math.round(selectedSalary * 1.5),
      currentAmount: 0,
      progressPercentage: 0,
      monthlySuggestedSave: Math.round((selectedSalary * 1.5) / 12),
      isComplete: false
    },
    tips: [],
    goals: [],
    scenarios: [],
    taxAdvice: {
      annualSalary: selectedSalary * 12,
      isTaxableUnderOldRegime: selectedSalary * 12 > 500000,
      recommendations: []
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-charcoal tracking-tight">Smart Finance Advisor</h2>
            <span className="text-[10px] font-bold bg-amber-subtle text-amber-soft px-2 py-0.5 rounded border border-amber-soft/30 uppercase tracking-wider">
              Rule-Based • No Chatbot
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Practical financial blueprint and category guardrails tailored to salaried professionals in India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isError && (
            <Button size="sm" variant="outline" onClick={() => refetch()} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Retry Sync
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsReportModalOpen(true)}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Export / Print Monthly Summary
          </Button>
        </div>
      </div>

      {/* Salary Bracket Selector */}
      <SalarySelector
        currentSalary={selectedSalary}
        onSalaryChange={setSelectedSalary}
        label="Simulate or Switch Salary Bracket"
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabFromUrl === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-card text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-teal-muted text-white shadow-xs'
                  : 'bg-surface hover:bg-slate-subtle text-charcoal-muted hover:text-charcoal border border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="space-y-6 animate-fade-in">
        {activeTabFromUrl === 'blueprint' && (
          <>
            <BudgetBreakdown
              blueprint={activeDashboard.blueprint}
              comparison={activeDashboard.comparison}
            />
            <EmergencyFundTracker
              fund={activeDashboard.emergencyFund}
              salary={selectedSalary}
            />
            <CategoryComparison
              categories={activeDashboard.comparison.categories}
              salary={selectedSalary}
            />
          </>
        )}

        {activeTabFromUrl === 'tips' && (
          <TipsList tips={activeDashboard.tips} salary={selectedSalary} />
        )}

        {activeTabFromUrl === 'goals' && <GoalsManager />}

        {activeTabFromUrl === 'simulator' && (
          <WhatIfSimulator salary={selectedSalary} />
        )}

        {activeTabFromUrl === 'tax' && (
          <TaxSavingGuide salary={selectedSalary} />
        )}
      </div>

      {/* Monthly Summary Export Modal */}
      <MonthlySummaryModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={monthlyReportData?.data}
      />
    </div>
  );
};
