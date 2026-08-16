import React, { useState } from 'react';
import {
  useGetMonthlyReportQuery,
  useGetYearlyReportQuery
} from '../../store/apiSlice';
import { Card } from '../../components/UI/Card';
import { StatCard } from '../../components/UI/StatCard';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { MonthlySummaryModal } from '../Advisor/components/MonthlySummaryModal';
import { formatINR, getMonthName } from '../../utils/formatters';
import {
  FileText,
  Printer,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  Wallet
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: monthlyData, isLoading: isMonthlyLoading } = useGetMonthlyReportQuery({
    month: selectedMonth,
    year: selectedYear,
  });
  const { data: yearlyData } = useGetYearlyReportQuery({ year: selectedYear });

  const report = monthlyData?.data;
  const yearly = yearlyData?.data;

  const handlePrint = () => {
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!report) return;
    const headers = ['Category', 'Total Spent (INR)', '% of Monthly Salary', 'Status'];
    const rows = report.summary.categories.map((c) => [
      c.categoryName,
      c.totalSpent,
      `${c.percentageOfSalary}%`,
      c.isOverLimit ? 'Over Budget Limit' : 'Within Budget Limit',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Financial_Report_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal tracking-tight">Financial Health Reports</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Audit your spending, savings velocity, and 50/30/20 compliance by month or full calendar year.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-card border border-border bg-surface px-3 py-1.5 text-xs text-charcoal font-medium"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>
                {getMonthName(m)}
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
            CSV Export
          </Button>
          <Button size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>
        </div>
      </div>

      {isMonthlyLoading || !report ? (
        <div className="p-12 text-center text-xs text-charcoal-light">
          Generating monthly financial report...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Monthly Income (Take-Home)"
              value={formatINR(report.user.monthlySalary)}
              subtitle={`Salaried professional bracket`}
              icon={<Wallet className="w-5 h-5" />}
            />
            <StatCard
              title="Total Outflow"
              value={formatINR(report.summary.totalSpent)}
              subtitle={`${Math.round((report.summary.totalSpent / report.user.monthlySalary) * 100)}% of monthly earnings`}
              iconBgColor="bg-slate-subtle text-slate-warm"
              icon={<Calendar className="w-5 h-5" />}
            />
            <StatCard
              title="Savings & Investments"
              value={formatINR(report.summary.savingsSpent)}
              subtitle={`Achieved rate: ${report.summary.savingsRate}%`}
              iconBgColor="bg-teal-subtle text-teal-muted"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
              title="Budget Health Score"
              value={`${report.comparison.healthScore}/100`}
              subtitle={report.comparison.healthScore >= 80 ? 'Grade A Compliance' : 'Grade B'}
              iconBgColor="bg-amber-subtle text-amber-soft"
              icon={<Award className="w-5 h-5" />}
            />
          </div>

          {/* 50/30/20 Rule Audit Table */}
          <Card className="shadow-subtle">
            <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-charcoal">
                  50/30/20 Rule Compliance Breakdown ({getMonthName(selectedMonth)} {selectedYear})
                </h3>
                <p className="text-xs text-charcoal-muted">Actual expenditures evaluated against standard rule benchmarks</p>
              </div>
              <Badge variant={report.summary.savingsRate >= 20 ? 'success' : 'warning'} size="sm">
                {report.summary.savingsRate >= 20 ? '✓ 20% Target Met' : 'Below 20% Target'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-card border border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-warm text-xs uppercase">Needs (50% Target)</span>
                  <span className="text-[11px] font-semibold text-charcoal">
                    {Math.round((report.summary.needsSpent / report.user.monthlySalary) * 100)}%
                  </span>
                </div>
                <p className="text-lg font-bold text-charcoal tabular-nums">{formatINR(report.summary.needsSpent)}</p>
                <p className="text-[11px] text-charcoal-muted mt-1">Ideal Cap: {formatINR(report.summary.idealNeeds)}</p>
              </div>

              <div className="bg-background p-4 rounded-card border border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-soft text-xs uppercase">Wants (30% Target)</span>
                  <span className="text-[11px] font-semibold text-charcoal">
                    {Math.round((report.summary.wantsSpent / report.user.monthlySalary) * 100)}%
                  </span>
                </div>
                <p className="text-lg font-bold text-charcoal tabular-nums">{formatINR(report.summary.wantsSpent)}</p>
                <p className="text-[11px] text-charcoal-muted mt-1">Ideal Cap: {formatINR(report.summary.idealWants)}</p>
              </div>

              <div className="bg-background p-4 rounded-card border border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-teal-muted text-xs uppercase">Savings (20% Target)</span>
                  <span className="text-[11px] font-semibold text-teal-muted">
                    {report.summary.savingsRate}%
                  </span>
                </div>
                <p className="text-lg font-bold text-teal-muted tabular-nums">{formatINR(report.summary.savingsSpent)}</p>
                <p className="text-[11px] text-charcoal-muted mt-1">Ideal Target: {formatINR(report.summary.idealSavings)}</p>
              </div>
            </div>
          </Card>

          {/* Actionable Insights */}
          <Card className="shadow-subtle bg-surface border-border">
            <div className="border-b border-border pb-3 mb-3">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Monthly Analysis & Recommendations
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {report.insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-background rounded-card border border-border">
                  <CheckCircle2 className="w-4 h-4 text-teal-muted shrink-0 mt-0.5" />
                  <span className="text-charcoal leading-relaxed">{ins}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Annual Overview Snapshot */}
          {yearly && (
            <Card className="shadow-subtle">
              <div className="border-b border-border pb-3 mb-4">
                <h3 className="text-sm font-bold text-charcoal">Yearly Cumulative Overview ({selectedYear})</h3>
                <p className="text-xs text-charcoal-muted">Full 12-month earnings and cumulative savings progress</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-background p-3.5 rounded-card border border-border">
                  <span className="text-[11px] text-charcoal-muted">Projected Annual Income</span>
                  <p className="text-base font-bold text-charcoal tabular-nums mt-1">{formatINR(yearly.annualIncome)}</p>
                </div>
                <div className="bg-background p-3.5 rounded-card border border-border">
                  <span className="text-[11px] text-charcoal-muted">Total Annual Expenditure</span>
                  <p className="text-base font-bold text-charcoal tabular-nums mt-1">{formatINR(yearly.yearlyTotalExpense)}</p>
                </div>
                <div className="bg-teal-subtle/50 p-3.5 rounded-card border border-teal-muted/30">
                  <span className="text-[11px] text-teal-muted font-bold">Total Annual Savings</span>
                  <p className="text-base font-black text-teal-muted tabular-nums mt-1">{formatINR(yearly.annualSavings)}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <MonthlySummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportData={report}
      />
    </div>
  );
};
